---
name: stableproxy
description: How to use StableProxy — which product fits which job, how its proxy logins work, how to buy safely, and how to manage packages and proxies through the StableProxy MCP tools. Use when the user mentions StableProxy, wants to buy or set up proxies from it, or has the StableProxy MCP server connected.
---

# StableProxy

StableProxy sells datacenter, residential and mobile proxies. Site: https://stableproxy.com. Dashboard: https://app.stableproxy.com.

**Prefer the MCP tools when they are connected** (`get_catalog`, `price_order`, `get_connection`, …). They return live data; this file never contains prices, which change — always read them from `get_catalog` or `price_order`.

## Which product

| Product key | What it is | Pay for | Pick it when |
|---|---|---|---|
| `shared` | Datacenter IPv4 shared with a few users | per IP | Cheapest; light scraping, APIs, testing |
| `private` | Dedicated datacenter IP | per IP | One stable, unshared datacenter identity |
| `datacenter_gb` | Rotating datacenter pool | per GB | Many requests, sites without strict bot checks |
| `residential_gb` | Rotating or sticky residential, country/region/city targeting | per GB | Sites that block datacenter IPs; geo-specific results |
| `residential_static_gb` | Static residential IP that stays yours | per IP + per GB | Long-lived accounts needing residential trust |
| `mobile_rotating_gb` | Mobile carrier IPs, all countries | per GB | Strictest sites and apps |
| `mobile_shared_gb` / `mobile_private_gb` | A mobile modem, shared or yours alone | per modem | Steady mobile identity; private for exclusive use |

Rules: try the cheapest type that works; move up only when blocked (see the *proxy-basics* skill). Availability by country: `list_countries`; cities for residential: `list_cities`.

## Buying — always with the user's agreement

1. `get_catalog` for products and options; `list_countries` when a country matters.
2. `price_order` with `action: new`, the `product` and its `options` (or `action: topup` to add balance). It returns the exact price and a draft; nothing is charged.
3. **Show the user the price and get an explicit yes.** Never confirm on your own initiative.
4. `confirm_order`. It usually comes back **held**: give the user the approval link to confirm in their browser. It is paid at once only if the user allowed automatic purchases within their daily limit, or connected with an API key that may purchase. If the balance is short it returns a payment link instead.
5. `wait_for_payment` with the order id until it reports `paid`; call it again while pending.
6. The result names the new package; continue with `get_connection`.

Renewing a package, adding traffic or adding IPs is not available through the tools yet. Turn on automatic renewal with `update_package_settings` (`is-auto-renew: true`), or send the user to the package page in the dashboard.

## Connecting

- `get_connection` (package `id`, optional `index` and `protocol: http | socks5`) gives host, port, login, password, a ready URL and snippets for curl, Python, Node, PHP and Go. Prefer it over assembling credentials yourself.
- Logins are `user:pass`. Adding `_<index>` or `_<ip>` to the username (`user_3`) pins one specific proxy of the package; without it the proxy is chosen from the credentials.
- HTTP and SOCKS5 use different ports — `get_connection` returns the right one for the protocol.
- No password possible (Chrome, Selenium)? Add the client's IP to `proxy-auth-ips` with `update_package_settings`, then connect without credentials.
- For traffic packages, country, sticky vs rotating and the rotation interval belong to each proxy: `add_proxies` (`countries`, `fixed`, `interval`, and `regions` / `cities` for residential).
- A sticky IP only changes when you `rotate_ip`.
- Download the whole list with `get_download_links` (txt, csv, json, xml or curl lines; HTTP or SOCKS5). Anyone with such a link gets the list — `reset_download_links` revokes old links.

## Managing

| Task | Tools |
|---|---|
| Overview | `get_account`, `list_packages`, `get_packages_summary`, `get_package` |
| Health | `check_proxies`, `count_dead_proxies`, `replace_dead_proxies`, `rotate_ip` |
| Location | `check_locations` → `get_location_results` |
| Settings | `get_package_settings`, `update_package_settings` (name, logins, passwords, allowed IPs, auto-renew), `get_package_features`, `set_package_features` |
| Usage | `get_statistics`, `list_changes`, `get_balance_history` |
| Money | `list_topup_methods`, `list_subscriptions`, `get_balance_alert` / `set_balance_alert`, promo and referral tools |

Changing logins, passwords, the entry server or replacing proxies changes what the user's software must use — tell them before doing it.

## Signing in

The first tool that needs the account opens the StableProxy sign-in page in the user's browser. If the tool answers that sign-in is needed, tell the user to finish it in the browser (or give them the link from the answer), then call the tool again. `sign_in` switches account or grants more; `sign_out` forgets the sign-in.

## When a tool says it is not allowed

The sign-in was granted fewer permissions than the task needs. Ask the user to run `sign_in` again and allow the missing access, or to do that step in the dashboard. Never ask for their password or API key in the chat.

## Without the tools

Sign in at https://app.stableproxy.com to buy and manage proxies, or create an API key on the API keys page. API docs: https://stableproxy.com/apidocs. Connect the tools: https://app.stableproxy.com/mcp.
