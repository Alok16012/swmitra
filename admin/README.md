# SWAMITRA Admin Panel

Password-protected content management system for the SWAMITRA Foundation website. Zero dependencies — just run it.

## Quick Start

```bash
cd admin
python3 serve.py
```

Then open **http://localhost:5174** in your browser.

**Default password:** `swamitra@2026`

## Change Password

```bash
ADMIN_PASS=yourpassword python3 serve.py
```

## Features

| Section | What you can do |
|---------|----------------|
| **Dashboard** | See content stats, quick links to site pages |
| **Organization Info** | Edit name, tagline, email, phone, address, hours |
| **Programmes** | Add/edit/delete programmes with full fields (objectives, audience, components) |
| **Trainings** | Add/edit/delete training courses with curriculum, benefits, objectives |
| **Resources** | Manage the Resource Centre library entries |
| **News & Events** | Add/edit/delete news articles and calendar events |
| **Page Content** | Full HTML editing of any page on the site (homepage, about, contact, etc.) |
| **Image Gallery** | Upload images via drag-and-drop or click, delete existing ones |
| **data.js Editor** | Direct JSON editing of the entire content file (for advanced edits) |

## How It Works

- Changes are written directly to the site files:
  - Text content → `site/assets/js/data.js`
  - Images → `site/assets/img/`
  - Page HTML → individual `.html` files in `site/`
- A `.bak` backup is created before every save
- The live site at `site/index.html` reads from these same files

## Starting from Claude Code

From the Claude Code CLI in your project:

```
/run
```
Then select the **swamitra-admin** configuration. Or run directly:

```bash
python3 /Users/alokkumar/Desktop/swamitra/admin/serve.py
```

## Security Notes

- Admin panel runs on `localhost` only (127.0.0.1)
- Session-based auth with 4-hour expiry
- Backups created automatically before every change
- Change the default password immediately
