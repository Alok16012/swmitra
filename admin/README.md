# SWAMITRA Admin Panel — Netlify Deploy

Password-protected content management for SWAMITRA website, hosted on Netlify.

## How It Works

- Admin panel is a static SPA served from `admin/public/`
- Backend is a Netlify Function (`netlify-functions/admin.js`) that uses the **GitHub API** to read/write files directly in your repository
- No local server needed — everything runs on Netlify
- Changes saved via the admin panel go directly to GitHub, triggering an auto-deploy

## Prerequisites

1. A GitHub **Personal Access Token** (classic) with `repo` scope:
   - Go to https://github.com/settings/tokens
   - Generate new token → check `repo` (full control of private repositories)
   - Copy the token

2. Your GitHub repo must be connected to Netlify (for auto-deploy)

## Deploy Steps

### 1. Push to GitHub (already done)
```bash
git push origin main
```

### 2. Create new Netlify site for admin
- Go to https://app.netlify.com/drop (drag & drop) or use CLI:
  ```bash
  netlify init
  ```
- When prompted, select "Create & configure a new site"
- Set the publish directory to: `admin/public`
- Set functions directory to: `netlify-functions`

### 3. Set environment variables in Netlify
In Netlify UI → Site settings → Environment variables, add:

| Variable | Value | Description |
|----------|-------|-------------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxx` | Your GitHub Personal Access Token |
| `GITHUB_REPO` | `Alok16012/swmitra` | Your GitHub repo (owner/name) |
| `GITHUB_BRANCH` | `main` | Branch to edit (usually `main`) |
| `ADMIN_PASS` | `your_secure_password` | Admin panel login password |

### 4. Deploy
Netlify will automatically deploy. You'll get a URL like:
```
https://swamitra-admin.netlify.app
```

### 5. (Optional) Connect custom subdomain
In Netlify → Domain settings → Add custom domain:
```
admin.swamitra.org
```
or any subdomain you own.

## Usage

1. Open your admin URL in browser
2. Enter the password (from `ADMIN_PASS` env var)
3. Edit content → Save → Changes go to GitHub → Netlify auto-deploys both sites

## Security Notes

- Admin panel uses session-based auth (4-hour expiry)
- All changes are tracked in GitHub commit history
- Password is set via Netlify environment variables (not in code)
- GitHub token should have minimal required permissions (`repo` scope)

## Troubleshooting

### Changes not appearing on live site?
- Check GitHub → repo → Actions/Commits to see if the push succeeded
- Netlify should auto-deploy within 1-2 minutes
- If not, manually trigger deploy in Netlify dashboard

### "GitHub API error"?
- Verify `GITHUB_TOKEN` is correct and has `repo` scope
- Check `GITHUB_REPO` matches your repo exactly (case-sensitive)

### Images not uploading?
- Check file size (Netlify Functions have 10MB limit)
- Ensure image is PNG, JPG, GIF, WebP, or SVG
