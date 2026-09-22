@AGENTS.md

## ⚠️ Design fidelity loop — CRITICAL

This project uses **devlooper** for automated Figma→code comparison.

**NEVER** manually implement a design comparison loop, take screenshots,
run pixel-diffs, or call Figma MCP to evaluate the page. Devlooper handles
all of this automatically.

To start the loop, run from the project root:

```bash
.devlooper/devlooper
```

If asked to "check vs Figma", "improve fidelity", "run the loop", or
"compare with design" — run `.devlooper/devlooper`, not manually.
