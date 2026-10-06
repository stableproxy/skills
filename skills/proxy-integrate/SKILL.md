---
name: proxy-integrate
description: Correct proxy setup in code and tools — Python (requests, httpx, aiohttp, Scrapy), browsers (Playwright, Puppeteer, Selenium), Node (fetch/undici, axios), Go and curl — including the common traps such as SOCKS DNS leaks, Chrome ignoring proxy passwords and environment proxies. Use when writing or fixing code that sends traffic through a proxy.
---

# Using a proxy in code

1. Get the proxy as `host`, `port`, `username`, `password` and the protocol. With the StableProxy tools connected, `get_connection` returns exactly that plus ready snippets.
2. Pick the reference for the stack and copy its pattern:
   - Python: [references/python.md](references/python.md)
   - Browsers (Playwright, Puppeteer, Selenium): [references/browsers.md](references/browsers.md)
   - Node: [references/node.md](references/node.md)
   - Go and curl: [references/go-curl.md](references/go-curl.md)
3. Verify before the real job: request `https://api.ipify.org?format=json` through the proxy and check the IP is the proxy's, not the machine's.

## Traps that apply everywhere

- **Wrong scheme.** An HTTP proxy is `http://host:port` even when the target is `https://`. Writing `https://host:port` makes the client try TLS to the proxy and fail.
- **Wrong port.** HTTP and SOCKS5 often listen on different ports.
- **SOCKS DNS leak.** Use `socks5h://` (or the library's remote-DNS option), not `socks5://`.
- **Special characters.** URL-encode the username and password when they go into a URL.
- **Environment proxies.** `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` are picked up silently by many libraries. Set them deliberately, or clear them when a request must not use a proxy; `NO_PROXY` lists exceptions.
- **Secrets.** Read credentials from environment variables or a secrets store, never hard-code them in committed code.
- **Timeouts.** Always set one; a dead proxy otherwise hangs the job.
