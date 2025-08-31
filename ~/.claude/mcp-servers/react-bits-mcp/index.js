#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// Import fetch for Node.js
const fetch = require('node-fetch');

const REACT_BITS_API_URL = process.env.REACT_BITS_API_URL || 'https://react-bits-mcp.davidhzdev.workers.dev';

class ReactBitsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'react-bits-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_react_components',
            description: 'Search for React components in the React Bits database',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for React components',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_component_details',
            description: 'Get detailed information about a specific React component',
            inputSchema: {
              type: 'object',
              properties: {
                componentId: {
                  type: 'string',
                  description: 'The ID of the React component to get details for',
                },
              },
              required: ['componentId'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_react_components':
            return await this.searchComponents(args.query);
          case 'get_component_details':
            return await this.getComponentDetails(args.componentId);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async searchComponents(query) {
    try {
      const response = await fetch(`${REACT_BITS_API_URL}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to search components: ${error.message}`);
    }
  }

  async getComponentDetails(componentId) {
    try {
      const response = await fetch(`${REACT_BITS_API_URL}/component/${componentId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get component details: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('React Bits MCP server running on stdio');
  }
}

const server = new ReactBitsMCPServer();
server.run().catch(console.error);