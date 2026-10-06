---
name: proxy-debug
description: Diagnose proxy failures — 407 auth errors, connection refused and timeouts, TLS and CONNECT errors, 403s, bans and captchas from target sites, wrong country or a leaking real IP. Use when requests through a proxy fail, are slow, or a site blocks or misplaces them.
---

# Debugging a proxy

First split the problem: **is the proxy failing, or the target site?** Run the same request through the proxy against `https://api.ipify.org?format=json` with `curl -v`:

- It fails there too → the proxy, the credentials or the network. See *Proxy-side*.
- It works there but not on the target → the site is refusing the IP or the client. See *Site-side*.

## Proxy-side

| Symptom | Usual cause | Fix |
|---|---|---|
| `407 Proxy Authentication Required` | Wrong login or password, credentials not sent, or the client is not on the IP allow-list | Re-copy the credentials; URL-encode special characters; browsers need `page.authenticate` or an allow-list (see *proxy-integrate*) |
| Connection refused / reset | Wrong host or port, HTTP port used with SOCKS (or the reverse) | Match the port to the protocol |
| Timeouts | Dead or overloaded proxy, a firewall blocking outbound ports, no timeout set | Test another proxy from the same package; open the port; always set a timeout |
| TLS / SSL error at connect | Proxy URL written as `https://host:port` for a plain HTTP proxy | Use `http://` for the proxy, keep `https://` for the target |
| `502` / `503` from the proxy | The upstream exit is down | Check the proxy, then replace or rotate it |
| Worked before, now everything is refused | The package expired or ran out of traffic | Check the package's expiry and traffic left |

## Site-side

| Symptom | Usual cause | Fix |
|---|---|---|
| `403`, captcha, "access denied" | The site blocks that IP range or the client looks automated | Move up a proxy type (datacenter → residential → mobile); send real browser headers; slow down |
| `429 Too Many Requests` | Too many requests per IP | Rotate IPs more often or spread load over more proxies; back off |
| Logged out or cart lost mid-flow | The IP changed during a session | Use a sticky proxy for the whole flow |
| Wrong country or currency | Geo by DNS leaked through local resolution, or the site uses a different geo database | Use `socks5h`; check the exit IP's country in several geo services |
| The real IP shows up | Environment proxies ignored, a browser bypass list, or WebRTC | Verify in the client itself; disable WebRTC when anonymity matters |

## With the StableProxy tools connected

- `get_package`: is it active, when does it expire, how much traffic is left.
- `check_proxies`: connects through chosen proxies now and reports which answer, their exit IP and timing.
- `count_dead_proxies` then `replace_dead_proxies`: swap proxies marked not working (the user must update the new addresses).
- `rotate_ip`: a fresh exit IP for one proxy, when a site has blocked the current one.
- `check_locations` then `get_location_results`: where geo databases place each proxy, for "wrong country" reports.
- `get_connection`: re-issue the exact working URL and code, to rule out a copy mistake.
