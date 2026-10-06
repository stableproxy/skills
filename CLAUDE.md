# stableproxy/skills — AI instructions

Public repo (not pushed yet): Agent Skills for proxies and StableProxy, and a Claude Code plugin marketplace whose one
plugin is **this repo root** (`"source": "./"`) — `skills/`, `.mcp.json` and `.claude-plugin/plugin.json` are the
plugin. `.mcp.json` runs `npx -y @stableproxy/mcp` with no settings: the package signs the user in through the browser on
first use (no hosted server for now). Do not move the skills under `plugins/`, and do not symlink them: an installed plugin is copied into a cache,
and a link pointing outside the plugin folder breaks there.

## Rules that bite

- **No prices, no stock counts, no promo codes** in any skill — they go stale. Point at `get_catalog` /
  `price_order` / `list_countries`.
- **Tool names must exist.** The `stableproxy` skill names MCP tools; they come from `@mcp` tags in
  `sp_backend` (`sp_mcp/TOOLS.md` is the generated list). Renaming a tag there means editing the skill here.
- **Only claim what v3 does.** `price_order` supports `new` and `topup`; `renew`, `traffic`, `ips`, `change` answer
  `422 action_not_supported` until the product decisions in `sp_backend/docs/api-v3/07` §6.
- **Bump `.claude-plugin/plugin.json` `version`** whenever `skills/` or `.mcp.json` changes — CI fails otherwise,
  and installed plugins only update on a new version.
- `name` in a `SKILL.md` equals its folder name; `description` says what it teaches **and when to use it** (that
  sentence is how an agent decides to load it).

## Verify

```bash
node scripts/check.mjs            # frontmatter, links, manifests
claude plugin validate .          # Claude Code's own manifest check
npx -y skills add . --list        # the skills installer sees every skill
```
