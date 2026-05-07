# ChatGPT Custom GPT Setup — Dillon OS Coding Brain

Follow these steps once. After that you can code from your phone in the ChatGPT app and it'll have full read/write access to `mohr-vault` and `claude-skills-repo`.

## 1. Create a fine-scoped GitHub Personal Access Token

1. https://github.com/settings/personal-access-tokens/new (use **Fine-grained**, not Classic).
2. **Resource owner:** `dillonmohr8777`
3. **Repository access:** Only select repositories → pick `mohr-vault` and `claude-skills-repo`.
4. **Permissions (repository):**
   - Contents: **Read and write**
   - Metadata: **Read-only** (auto)
   - Pull requests: **Read and write**
   - Commit statuses: Read-only (optional)
5. **Expiration:** 90 days (set a calendar reminder to rotate).
6. Generate, copy the token, store it in 1Password.

## 2. Create the Custom GPT in ChatGPT

1. ChatGPT app or web → **Explore GPTs → + Create**.
2. Skip the conversational builder, click **Configure**.
3. Fill in:
   - **Name:** `Dillon OS`
   - **Description:** `My senior coding + marketing operator with full access to my vault and skills.`
   - **Instructions:** open `custom-gpt/CUSTOM_GPT_INSTRUCTIONS.md` in this repo, copy the text between `## BEGIN INSTRUCTIONS` and `## END INSTRUCTIONS`, paste it.
   - **Conversation starters** (optional):
     - `Read 00_Memory_File.md and give me today's priorities.`
     - `Run the seo-audit skill on <client>.`
     - `Open a PR on mohr-vault that adds a new SOP for <X>.`
     - `Summarize my last 5 daily notes and flag what's slipping.`
   - **Knowledge:** leave empty (the Action does the heavy lifting).
   - **Capabilities:** Web Browsing **on**, Code Interpreter **on**, DALL-E off (unless you want it).

## 3. Add the Action

1. Scroll to **Actions → Create new action**.
2. **Schema:** open `custom-gpt/custom-gpt-action.yaml`, copy the entire file, paste into the schema editor. ChatGPT will validate and list 6 operations: `getRepoContents`, `createOrUpdateFile`, `searchCode`, `listCommits`, `listBranches`, `createRef`, `createPullRequest`.
3. **Authentication:**
   - Type: **API Key**
   - Auth Type: **Bearer**
   - API Key value: `ghp_xxx...` (paste the PAT from step 1 — ChatGPT will prefix it with `Bearer ` automatically; if it doesn't, prefix manually)
4. **Privacy policy:** `https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement` (ChatGPT requires a URL here).
5. Save.

## 4. Smoke test

In the GPT preview pane, send:

> Read `vault/00_Memory_File.md` from `mohr-vault` and list my Momentum 360 clients with commission amounts.

It should call `getRepoContents` and reply with the parsed list. If you get a 401, the PAT is wrong. If you get a 403, the PAT scope is wrong (re-check repo selection + Contents permission).

Then test write:

> Create a new file `vault/00_Inbox/gpt-smoke-test.md` on a new branch `gpt/smoke-test-YYYYMMDD` with body "hello from ChatGPT". Then open a PR.

It should call `createRef` then `createOrUpdateFile` then `createPullRequest`. Merge or close the PR after.

## 5. Save and publish

- **Share:** Only me (unless you want others to see it — they'd still need their own PAT to use it).
- Pin it in your ChatGPT mobile app sidebar.

## 6. Maintenance

- Rotate the PAT every 90 days.
- If you add new top-level folders to the vault, update the **Repo map** section of `CUSTOM_GPT_INSTRUCTIONS.md` and re-paste into the GPT.
- If you add a new Align HCM client, update `vault/00_Memory_File.md` (the GPT will read it fresh on each session).

## Limits to know

- ChatGPT Custom GPT Instructions field: ~8,000 chars. The current instructions file is well under that.
- Actions: max ~30 operations per GPT (we use 7).
- GitHub API rate limit on a fine-grained PAT: 5,000 req/hour — plenty for interactive coding.
- File writes via `createOrUpdateFile` are limited to ~1MB per file. For larger files, use the Git Trees API (not included in the spec — add later if needed).

## Troubleshooting

- **"I can't access that repo"** → PAT scope. Regenerate including both repos and Contents read+write.
- **"sha is required"** → The GPT tried to update a file without first calling `getRepoContents`. Tell it: "Always GET the file first to retrieve its sha before PUT."
- **"Branch not found"** → Use `listBranches` first, or call `createRef` to create it. Get the source SHA from `listCommits`.
- **Stale memory** → If the GPT seems out of date on clients, prompt: "Re-read `vault/00_Memory_File.md` before answering."
