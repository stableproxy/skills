<p align="center">
  <img src="assets/logo.svg" width="96" alt="StableProxy">
</p>

<h1 align="center">StableProxy, Skills</h1>

<p align="center">
  Skills that teach your agent how proxies work and how to use StableProxy, plus the MCP server that lets it buy,
  connect and manage your proxies. Set-up guide: <a href="https://app.stableproxy.com/mcp">app.stableproxy.com/mcp</a>
</p>

## Install

**Claude Code** — skills and tools in one plugin:

```
/plugin marketplace add stableproxy/skills
/plugin install stableproxy@stableproxy
```

**Any agent** (Claude Code, Codex, Cursor, Copilot, …) — skills only, with the [skills installer](https://github.com/vercel-labs/skills):

```
npx skills add stableproxy/skills
```

Add `-g` to install for every project. Run it again to update.

The plugin's tools run [`@stableproxy/mcp`](https://www.npmjs.com/package/@stableproxy/mcp) with `npx`. The first
time a tool needs your account, StableProxy opens in your browser to sign in — no key to create.

**Tools without the plugin** — see [`@stableproxy/mcp`](https://www.npmjs.com/package/@stableproxy/mcp) for Claude
Desktop, Cursor and VS Code.

## Skills

| Skill | Teaches |
|---|---|
| [`proxy-basics`](skills/proxy-basics/SKILL.md) | HTTP vs SOCKS5, auth, rotating vs sticky, which proxy type for which job |
| [`proxy-integrate`](skills/proxy-integrate/SKILL.md) | Correct setup in Python, browsers, Node, Go and curl, and the traps |
| [`proxy-debug`](skills/proxy-debug/SKILL.md) | 407s, timeouts, TLS errors, blocks and captchas — cause and fix |
| [`stableproxy`](skills/stableproxy/SKILL.md) | StableProxy products, logins, buying with your confirmation, managing packages with the tools |

Skills never contain prices; the agent reads them live from the MCP tools.

## Safety

Every purchase the agent makes waits for you to confirm it in your browser, unless you allow automatic purchases
with a daily limit. Disconnect it any time in the dashboard under Settings → Security.

## Contributing

`node scripts/check.mjs` validates every skill's frontmatter and links, the marketplace and the plugin. Changing
anything under `skills/` or `.mcp.json` needs a version bump in `.claude-plugin/plugin.json` — that is what ships
the change to installed plugins.
