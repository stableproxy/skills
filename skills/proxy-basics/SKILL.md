---
name: proxy-basics
description: How proxies work — HTTP vs HTTPS CONNECT vs SOCKS5 (and socks5h), user:pass vs IP allow-list auth, rotating vs sticky IPs, and what datacenter, residential, static residential and mobile proxies are each good for. Use when choosing a proxy type, explaining proxy concepts, or before writing proxy code.
---

# Proxy basics

## Protocols

| Protocol | What it carries | Notes |
|---|---|---|
| HTTP proxy | `http://` requests directly; `https://` through a `CONNECT` tunnel | The proxy URL scheme is `http://` **even for HTTPS targets** — the tunnel is encrypted end to end, the proxy only sees the host name. |
| SOCKS5 | Any TCP traffic | `socks5://` resolves DNS **on your machine**; `socks5h://` resolves it **on the proxy**. Use `socks5h` (or the client's "remote DNS" option) so DNS does not leak your location and geo-targeting is not undone. |

A proxy usually listens on a different port for HTTP and for SOCKS5. Use the port that matches the protocol.

## Authentication

- **Login and password**: `scheme://user:pass@host:port`. URL-encode special characters in the password.
- **IP allow-list**: the proxy accepts connections from listed IPs without a password. Use it when a tool cannot send proxy credentials (Chrome's `--proxy-server`, some Selenium setups).

## Rotating vs sticky

- **Rotating**: the exit IP changes per request or on a timer. Good for crawling many pages without repeated IPs.
- **Sticky**: the same exit IP for a session. Needed for logins, carts, multi-step flows, and anything that ties a session to an IP.
- Rotating an IP on purpose ("give me a new IP now") is a separate action from rotation by timer.

## Proxy types

| Type | Exit IP belongs to | Good for | Weak at |
|---|---|---|---|
| Datacenter | Hosting providers | Speed, low cost, APIs and sites without strict bot checks | Sites that block hosting ranges |
| Residential | Home internet users (ISPs) | Sites that block datacenter IPs, geo-targeting by country/region/city | Cost per GB, speed varies |
| Static residential | An ISP address that stays yours | Accounts that must keep one IP for weeks, residential trust plus stability | Fewer locations |
| Mobile | Mobile carriers (4G/5G), many users share each IP | The strictest sites and apps; carriers' IPs are rarely blocked | Highest cost, slower |

Rules of thumb:
- Start with datacenter; move to residential when blocks appear; use mobile only when residential is blocked too.
- Paying per IP suits a few long-lived identities; paying per GB suits many requests across changing IPs.
- Geo-targeting needs a proxy *in* that country — the target site sees the exit IP, not you.

## Etiquette

Respect robots.txt and the site's terms, keep request rates reasonable, and never use proxies to get around a block on an account that was banned for abuse.
