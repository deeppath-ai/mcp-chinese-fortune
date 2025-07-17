#!/usr/bin/env node

// Data一般用于表示从服务器上请求到的数据，Info一般表示解析并筛选过的要传输给大模型的数据。变量使用驼峰命名，常量使用全大写下划线命名。
import { program } from 'commander';
import { startSseAndStreamableHttpMcpServer } from 'mcp-http-server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import axios from 'axios';
import { z } from 'zod';
import { format, parse } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import ApplicationLunar from './ApplicationLunar.js';

const MCP_NAME = "mcp-chinese-fortune"
const VERSION = "0.0.1"




// Configuration schema for Smithery - matches existing Config interface
export const configSchema = z.object({
  server: z.object({
    port: z.number().optional().describe("The port to listen on for SSE or MCP transport"),
    host: z.string().optional().describe("The host to bind the server to. Default is localhost. Use 0.0.0.0 to bind to all interfaces")
  }).optional()
});





// Create server instance
export const server = new McpServer({
  name: MCP_NAME,
  version: VERSION,
  capabilities: {
    resources: {},
    tools: {},
  },
  instructions:
    '该服务主要用于根据出生年月日小时分析生辰八字和命理信息来进行算命：\n\n' +
    '**原则：**\n' +
    '*   **参数准确性**：确保传递给每个的参数格式和类型都正确，特别是日期格式。\n' +
    '*   **必要时追问**：如果用户信息不足以调用接口，请向用户追问缺失的信息。\n' +
    '*   **清晰呈现结果**：将接口返回的信息以用户易于理解的方式进行呈现。\n\n' +
    '请根据上述指引选择接口。',
});



server.tool(
  'fortune-teller',
  '根据出生年月日小时分析生辰八字和命理信息来进行算命',
  {
    year: z.number().describe('year, for example: 1900'),
    month: z.number().describe('month, for example: 7'),
    day: z.number().describe('day, for example: 11'),
    hour: z.number().describe('hour, for example: 5'),
  },
  async ({ year,month, day, hour}) => {
    let month_str = `${month}`
    if (month< 10){
      month_str = `0${month}`
    }
    const lunarInstance = new ApplicationLunar(year, month_str, `${day}`);
    lunarInstance.setTime(`${hour}`)
    let ml = lunarInstance.getJson()
    console.log(ml)
    
    let result = `分析下面 分析命理运势 \n \n ${JSON.stringify(ml)} `
    
    return {
      content: [{ type: 'text', text: result }],
      report: result
    };
  }
);


async function init() {}

program
  .name('mcp-chinese-fortune')
  .description('命理算命大师')
  .version(VERSION)
  .option(
    '--host <host>',
    'host to bind server to. Default is localhost. Use 0.0.0.0 to bind to all interfaces.'
  )
  .option('--port <port>', 'port to listen on for SSE and HTTP transport.')
  .action(async (options) => {
    try {
      await init();
      if (options.port || options.host) {
        await startSseAndStreamableHttpMcpServer({
          host: options.host,
          port: options.port,
          // @ts-ignore
          createMcpServer: async ({ headers }) => {
            return server;
          },
        });
      } else {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error('fortune MCP Server running on stdio');
      }
    } catch (error) {
      console.error('Fatal error in main():', error);
      process.exit(1);
    }
  });

program.parse();

export default function ({ config }: { config: z.infer<typeof configSchema> }) {

  return server.server;
}

