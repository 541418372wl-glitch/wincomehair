# Setup Checklist

This project is delivered in stages so beginners can see the site before cloud setup.

## 1. Local Preview

- Build locally with `node scripts/site.js build --cwd <project>`.
- Start preview with `node scripts/site.js preview:start --cwd <project> --mode vite`.
- Keep the preview running until a public URL is verified.

## 2. Supabase Activation

Use this only when the site needs real products, inventory, orders, auth, or user-owned data.

The agent first checks product authorization:

```bash
accio-mcp-cli server supabase
```

If Supabase is not connected, open Accio, go to the Accio Site Builder plugin, connect Supabase, and finish authorization. If connected, the Agent should run `accio-mcp-cli search supabase` to query tool usage, then use Supabase MCP tools such as `get_project_url`, `get_publishable_keys`, `list_tables`, `list_migrations`, `apply_migration`, `execute_sql`, `generate_typescript_types`, `deploy_edge_function`, `get_logs`, and `get_advisors`.

Never paste `SUPABASE_SERVICE_ROLE_KEY`, database passwords, connection strings, or account access tokens in chat.

## 3. Commerce Requests

This plugin does not generate online payment, cart, checkout, or payment placeholder flows. For commerce-shaped sites, use product/service display, inquiry forms, booking requests, or off-site contact links.

## 4. Company Platform Publish

Use the company platform publish button for a public URL. Keep the local preview running until the public URL is verified.

## Completion

Final handoff should include `Access:` with either a public URL, a still-running local preview URL,
or a blocker plus the exact next action.
