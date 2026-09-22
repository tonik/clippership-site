Run devlooper — the Figma→code fidelity loop.

No ANTHROPIC_API_KEY needed. Never ask for one.

## What to do — ONE command, nothing else

Run this in the **background** (run_in_background: true):

```bash
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" && .devlooper/devlooper
```

That is the entire job. The `.devlooper/devlooper` binary does EVERYTHING itself:

- opens a live **dashboard** in the browser (auto-opens a tab)
- if the project isn't configured yet (empty Figma URL), the dashboard opens in
  **idle** mode — the user sets the Figma file in the **Config** tab, then clicks **Start**
- handles SVG fixing, design-init, figma-init, asset-fetch, the build/judge/fix loop,
  screenshots, and resume — all internally

## Do NOT

- Do **NOT** run any prep commands (no SVG-fixing python, no DESIGN.md editing).
- Do **NOT** run design-init / figma-init / asset-fetch yourself — the binary does them.
- Do **NOT** call `use_figma` or any Figma tools yourself.
- Do **NOT** edit project files. Your only action is running the one command above.

## After starting

Tell the user: "devlooper is running — the dashboard should open in your browser.
If the project is new, open the **Config** tab, paste your Figma URL, Save, then click Start."

If it prints "No loop.config.json found", the project needs init first:

```bash
.devlooper/devlooper init --figma "<Figma URL>" --page "local/index.html"
```

(Ask the user for the Figma URL only if init is needed. Token goes to `.devlooper/.env`, never in chat.)
