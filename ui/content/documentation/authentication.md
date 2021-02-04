---
title: Authentication
summary: How to identify your application when making requests to the Unfurl API.
---

# API key authentication

Your application must provide an API key when making secured requests. This allows us to provide you better service by understanding your usage patterns and contact you about upcoming changes that may affect your application.

You can pass your API key either as a header or query string parameter.

## Via header

```bash
curl -v -H "Authorization: token TOKEN" "{{<apiUrl "/pages?url=https%3A%2F%2Fwww.dunkman.me%2F">}}"
```

## Via URL query string parameter

```bash
curl -v "{{<apiUrl "/pages?key=TOKEN&url=https%3A%2F%2Fwww.dunkman.me%2F">}}"
```
