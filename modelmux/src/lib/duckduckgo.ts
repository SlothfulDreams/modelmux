import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createSmitheryUrl } from "@smithery/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const serverUrl: URL = createSmitheryUrl(
  "https://server.smithery.ai/@nickclyde/duckduckgo-mcp-server",
  {
    apiKey: process.env.apiKey,
    profile: process.env.profile,
  },
);

const transport = new StreamableHTTPClientTransport(serverUrl);

const client = new Client({
  name: "modelmux",
  version: "1.0.0",
});

await client.connect(transport);

// List available tools
export async function response() {
  return client.callTool({
    name: "fetch_content",
    arguments: {
      url: process.env.url,
    },
  });
}
