# Browsers

## Playwright (Python and Node have the same options)

```python
browser = playwright.chromium.launch(proxy={
    "server": "http://host:port",
    "username": "user",
    "password": "pass",
})
```

- Credentials go in `username` / `password`, **not** in the `server` URL.
- A different proxy per context: `browser.new_context(proxy={...})`.
- **SOCKS5 with a password is not supported** by Playwright's browsers. Use the HTTP port, or SOCKS5 with an IP allow-list.

## Puppeteer

```js
const browser = await puppeteer.launch({args: ["--proxy-server=http://host:port"]})
const page = await browser.newPage()
await page.authenticate({username: "user", password: "pass"})
```

- `--proxy-server` takes no credentials; `page.authenticate` answers the proxy's auth challenge. Call it on every new page.
- Chrome cannot authenticate to SOCKS5. Use the HTTP port or an IP allow-list.

## Selenium (Chrome)

- `--proxy-server=http://host:port` works, but Chrome ignores credentials in it and pops up an auth dialog that Selenium cannot fill.
- Simplest fix: add the machine's IP to the proxy's **IP allow-list** and use `--proxy-server` with no password.
- Alternatives: `selenium-wire`, or a small extension that answers the auth challenge.

## All browsers

- Check the exit IP in the page (`https://api.ipify.org`), not in your script — the browser may bypass the proxy for some hosts.
- WebRTC can reveal the real IP; disable it, or test with a WebRTC leak page, when anonymity matters.
