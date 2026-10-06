# Node

`PROXY = "http://user:pass@host:port"` below.

## fetch (Node 18+) with undici

```js
import {fetch, ProxyAgent} from "undici"

const res = await fetch("https://api.ipify.org?format=json", {dispatcher: new ProxyAgent(PROXY)})
```

- The global `fetch` ignores `HTTP_PROXY` and has no `agent` option; pass an undici `dispatcher`.
- undici's `ProxyAgent` is for HTTP proxies. For SOCKS use `socks-proxy-agent` with `node:https` or axios.

## axios

```js
import axios from "axios"
import {HttpsProxyAgent} from "https-proxy-agent"

const agent = new HttpsProxyAgent(PROXY)
const res = await axios.get("https://api.ipify.org?format=json", {httpsAgent: agent, proxy: false, timeout: 30000})
```

- Set `proxy: false` when passing an agent, or axios applies its own proxy handling on top, which breaks HTTPS targets.
- SOCKS: `new SocksProxyAgent("socks5h://user:pass@host:port")` from `socks-proxy-agent`, same way.

## node:https

```js
import https from "node:https"
import {HttpsProxyAgent} from "https-proxy-agent"

https.get("https://api.ipify.org?format=json", {agent: new HttpsProxyAgent(PROXY)}, res => res.pipe(process.stdout))
```
