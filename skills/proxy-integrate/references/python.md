# Python

`PROXY = "http://user:pass@host:port"` below; for SOCKS5 use `socks5h://user:pass@host:socks_port`.

## requests

```python
import requests

proxies = {"http": PROXY, "https": PROXY}
r = requests.get("https://api.ipify.org?format=json", proxies=proxies, timeout=30)
```

- SOCKS needs `pip install "requests[socks]"`; use `socks5h://`.
- `requests` also reads `HTTP_PROXY` / `HTTPS_PROXY`; `session.trust_env = False` turns that off.

## httpx

```python
import httpx

with httpx.Client(proxy=PROXY, timeout=30) as client:
    client.get("https://api.ipify.org?format=json")
```

- httpx ≥ 0.26 takes `proxy=`; older versions take `proxies=`.
- SOCKS needs `pip install "httpx[socks]"`.

## aiohttp

```python
import aiohttp

async with aiohttp.ClientSession() as session:
    async with session.get("https://api.ipify.org?format=json", proxy=PROXY, timeout=aiohttp.ClientTimeout(total=30)) as r:
        print(await r.text())
```

- aiohttp supports HTTP proxies only. For SOCKS use `aiohttp-socks`:
  `ProxyConnector.from_url("socks5://user:pass@host:port", rdns=True)` as the session's `connector`.

## Scrapy

```python
yield scrapy.Request(url, meta={"proxy": PROXY})
```

- The built-in `HttpProxyMiddleware` reads the credentials from the URL.
- Scrapy has no SOCKS support; use the HTTP port.
- For one sticky IP per spider, keep the same proxy URL; for rotation, pick a different proxy per request in a downloader middleware.
