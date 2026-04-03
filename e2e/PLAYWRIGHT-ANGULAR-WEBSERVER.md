# Playwright webServer with Angular & Concurrently: Startup Detection Fix

## The Problem

When running `npm run e2e`, Playwright's `webServer` configuration timed out:

```
Error: Timed out waiting 120000ms from config.webServer.
```

This project uses a microfrontend architecture where three Angular dev servers must start simultaneously via `concurrently`:

```json
"serve": "concurrently --kill-others \"ng serve src-a\" \"ng serve src-b\" \"ng serve src\""
```

| App       | Port  |
|-----------|-------|
| Shell     | 30103 |
| src-a     | 30307 |
| src-b     | 30809 |

### Why the standard `url` approach fails

The typical Playwright `webServer` configuration uses a `url` property to poll a single URL until it responds:

```ts
// Does NOT work for this setup
webServer: {
  command: 'npm run serve',
  url: 'http://localhost:30103',
}
```

This detects the shell becoming available, but **not** the microfrontend apps. Tests that interact with iframes loading `src-a` (port 30307) or `src-b` (port 30809) fail intermittently because those servers may not be ready yet.

Playwright also does not support multiple `url` values in a single `webServer` entry, and using an array of `webServer` entries would require splitting the `concurrently` command into separate processes, losing the `--kill-others` lifecycle management.

## The Fix: `stdout` pipe with pattern matching

Analysis of the Playwright source code (`packages/playwright/src/runner/webServerPlugin.ts`) revealed an alternative startup detection mechanism: the `wait.stdout` option. Instead of polling URLs, Playwright can monitor the process's stdout for a regex match.

Angular CLI prints `Compiled successfully` to stdout each time a project finishes compiling. Since `concurrently` merges the stdout of all child processes into a single stream, we can rely on this: the **last** `Compiled successfully` message means all three servers are ready.

However, there is a prerequisite discovered in the source code: Playwright only captures the child process output when `stdout` is explicitly set to `'pipe'`. By default, Playwright inherits stdio, meaning the output goes directly to the terminal and the `wait.stdout` regex has nothing to match against.

### Key source code insight

In Playwright's `webServerPlugin.ts`, the process is spawned with the configured `stdio` option. When `stdout: 'pipe'` is set, the child's stdout is captured into a buffer. The `wait.stdout` regex is then tested against this buffer on every `data` event. Only when a match is found does Playwright consider the server ready.

Without `stdout: 'pipe'`, the stdout stream is `null` (inherited), so the regex never matches and the startup times out.

## The Working Configuration

```ts
// playwright.config.ts
webServer: {
  command: 'npm run serve',
  stdout: 'pipe',                          // Required: capture stdout so wait.stdout can match
  wait: { stdout: /Compiled successfully/ }, // Wait for Angular's compilation message
  reuseExistingServer: !process.env['CI'],
  timeout: 180000,                          // 3 minutes — first cold build can be slow
},
```

### Why this works

1. `stdout: 'pipe'` tells Playwright to capture the child process stdout into a buffer instead of inheriting it.
2. `wait: { stdout: /Compiled successfully/ }` tells Playwright to watch that buffer for a match before considering the server ready.
3. Since `concurrently` merges all three Angular dev servers' output, the pattern will match once the last project finishes compiling.
4. `timeout: 180000` (3 minutes) gives enough headroom for the initial cold compilation of three Angular apps plus their library dependencies.

### Why `reuseExistingServer` matters

With `reuseExistingServer: !process.env['CI']`, developers can pre-start the servers with `npm run serve` and run `npx playwright test` separately. This avoids the cold-start wait on repeated test runs. In CI, servers are always started fresh.
