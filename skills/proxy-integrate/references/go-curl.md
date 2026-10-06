# Go and curl

## Go (net/http)

```go
proxyURL, _ := url.Parse("http://user:pass@host:port")
client := &http.Client{
    Transport: &http.Transport{Proxy: http.ProxyURL(proxyURL)},
    Timeout:   30 * time.Second,
}
res, err := client.Get("https://api.ipify.org?format=json")
```

- `http.ProxyURL` also accepts `socks5://user:pass@host:port`.
- `http.ProxyFromEnvironment` (the default transport) reads `HTTP_PROXY` / `HTTPS_PROXY`; set `Proxy` explicitly to avoid surprises.

## curl

```bash
curl -x "http://user:pass@host:port" https://api.ipify.org?format=json
curl --socks5-hostname "host:port" -U "user:pass" https://api.ipify.org?format=json
```

- `--socks5-hostname` resolves DNS on the proxy; plain `--socks5` resolves locally.
- `-v` shows the `CONNECT` exchange and the proxy's status code — the fastest way to see a `407`.
- curl reads `http_proxy` / `https_proxy` / `ALL_PROXY` from the environment; `--noproxy '*'` ignores them.
