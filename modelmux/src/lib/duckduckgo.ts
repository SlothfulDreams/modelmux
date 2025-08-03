import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createSmitheryUrl } from "@smithery/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export async function search(
  url: string,
  apiKey: string,
  profile: string,
): Promise<CallToolResult> {
  const serverUrl: URL = createSmitheryUrl(
    "https://server.smithery.ai/@nickclyde/duckduckgo-mcp-server",
    {
      apiKey: apiKey,
      profile: profile,
    },
  );

  const transport = new StreamableHTTPClientTransport(serverUrl);

  const client = new Client({
    name: "modelmux",
    version: "1.0.0",
  });

  await client.connect(transport);

  return client.callTool({
    name: "fetch_content",
    arguments: {
      url: url,
    },
  });
}
