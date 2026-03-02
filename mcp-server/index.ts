import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SettlementStore } from './store';

const store = new SettlementStore();
const server = new McpServer({
  name: 'manor-lords-mcp',
  version: '1.0.0',
});

// Tools
server.tool(
  'get_settlement_status',
  'Get a full snapshot of settlement metrics',
  { settlement_id: z.string().describe('Settlement identifier') },
  async ({ settlement_id }) => {
    const data = store.getSettlement(settlement_id);
    if (!data) {
      return { content: [{ type: 'text' as const, text: `Settlement "${settlement_id}" not found.` }] };
    }
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_resource_chains',
  'Get production chain data with rates and bottlenecks',
  {
    settlement_id: z.string(),
    resource: z.string().optional().describe('Filter to a specific resource'),
  },
  async ({ settlement_id, resource }) => {
    const data = store.getSettlement(settlement_id);
    if (!data) {
      return { content: [{ type: 'text' as const, text: 'Settlement not found.' }] };
    }
    let chains = data.resourceChains;
    if (resource) {
      chains = chains.filter(
        (c) =>
          c.source.toLowerCase().includes(resource.toLowerCase()) ||
          c.product.toLowerCase().includes(resource.toLowerCase())
      );
    }
    return { content: [{ type: 'text' as const, text: JSON.stringify(chains, null, 2) }] };
  }
);

server.tool(
  'get_military_status',
  'Get troop composition, equipment, and threat level',
  { settlement_id: z.string() },
  async ({ settlement_id }) => {
    const data = store.getSettlement(settlement_id);
    if (!data) {
      return { content: [{ type: 'text' as const, text: 'Settlement not found.' }] };
    }
    return { content: [{ type: 'text' as const, text: JSON.stringify(data.military, null, 2) }] };
  }
);

server.tool(
  'get_historical_data',
  'Get time-series data for trend analysis',
  {
    settlement_id: z.string(),
    metric: z.enum(['population', 'approval', 'treasury']),
    range: z.number().optional().describe('Number of recent entries to return'),
  },
  async ({ settlement_id, metric, range }) => {
    const data = store.getSettlement(settlement_id);
    if (!data) {
      return { content: [{ type: 'text' as const, text: 'Settlement not found.' }] };
    }
    let history = data.history.map((h) => ({
      year: h.year,
      season: h.season,
      value: h[metric],
    }));
    if (range) {
      history = history.slice(-range);
    }
    return { content: [{ type: 'text' as const, text: JSON.stringify(history, null, 2) }] };
  }
);

server.tool(
  'update_manual_entry',
  'Update a single settlement metric from manual input',
  {
    settlement_id: z.string(),
    field: z.string(),
    value: z.union([z.string(), z.number()]),
  },
  async ({ settlement_id, field, value }) => {
    const success = store.updateField(settlement_id, field, value);
    return {
      content: [
        {
          type: 'text' as const,
          text: success
            ? `Updated ${field} to ${value}`
            : `Failed to update ${field}. Settlement not found.`,
        },
      ],
    };
  }
);

server.tool(
  'import_save_file',
  'Parse a Manor Lords save file',
  { file_path: z.string().describe('Path to save file') },
  async ({ file_path }) => {
    try {
      const data = await store.importSaveFile(file_path);
      return { content: [{ type: 'text' as const, text: `Imported save file. Settlement "${data.name}" loaded with ${data.population} population.` }] };
    } catch (err) {
      return { content: [{ type: 'text' as const, text: `Failed to import save file: ${err}` }] };
    }
  }
);

// Resources
server.resource(
  'settlement-overview',
  'settlement://default/overview',
  { mimeType: 'application/json', description: 'Aggregate settlement health metrics' },
  async () => {
    const data = store.getSettlement('default');
    return {
      contents: [
        {
          uri: 'settlement://default/overview',
          mimeType: 'application/json',
          text: JSON.stringify(data ?? store.getDefaultData()),
        },
      ],
    };
  }
);

server.resource(
  'settlement-resources',
  'settlement://default/resources',
  { mimeType: 'application/json', description: 'Current resource levels and rates' },
  async () => {
    const data = store.getSettlement('default');
    return {
      contents: [
        {
          uri: 'settlement://default/resources',
          mimeType: 'application/json',
          text: JSON.stringify(data?.resources ?? []),
        },
      ],
    };
  }
);

server.resource(
  'settlement-military',
  'settlement://default/military',
  { mimeType: 'application/json', description: 'Military composition and readiness' },
  async () => {
    const data = store.getSettlement('default');
    return {
      contents: [
        {
          uri: 'settlement://default/military',
          mimeType: 'application/json',
          text: JSON.stringify(data?.military ?? {}),
        },
      ],
    };
  }
);

server.resource(
  'settlement-history',
  'settlement://default/history',
  { mimeType: 'application/json', description: 'Historical data points for charting' },
  async () => {
    const data = store.getSettlement('default');
    return {
      contents: [
        {
          uri: 'settlement://default/history',
          mimeType: 'application/json',
          text: JSON.stringify(data?.history ?? []),
        },
      ],
    };
  }
);

// Handle IPC messages for direct data updates from Electron
process.on('message', (msg: any) => {
  if (msg.type === 'updateSettlement') {
    store.setSettlement(msg.id ?? 'default', msg.data);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
