# Suggested Git commits (conventional commit style)

```bash
git init
git add index.html
git commit -m "feat: add dashboard page structure with search form and result card"

git add style.css
git commit -m "style: add responsive layout with light and dark themes"

git add script.js
git commit -m "feat: fetch coordinates and current weather from Open-Meteo APIs"

git commit --allow-empty -m "feat: validate city input and handle API, network and timeout errors"
# (or split script.js into several commits with `git add -p`)

git add README.md COMMIT_MESSAGES.md
git commit -m "docs: add README with setup, API details and test cases"
```

## Prompt to generate your own messages
"Here is my `git diff --staged`. Write a one-line conventional commit message (type: summary, under 72 characters), plus a short body if the change needs explanation."
