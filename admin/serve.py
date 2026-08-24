import os, re, json, time, socketserver, http.server
from urllib.parse import unquote

ADMIN_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(ADMIN_DIR, ".."))
SITE_DIR = os.path.join(ROOT, "site")
DATA_JS = os.path.join(SITE_DIR, "assets", "js", "data.js")
IMG_DIR = os.path.join(SITE_DIR, "assets", "img")
PUBLIC = os.path.join(ADMIN_DIR, "public")

ADMIN_PASS = os.environ.get("ADMIN_PASS", "swamitra@2026")
PORT = int(os.environ.get("PORT", "5174"))

os.makedirs(IMG_DIR, exist_ok=True)

MIME = {
    ".html":"text/html",".css":"text/css",".js":"application/javascript",
    ".json":"application/json",".png":"image/png",".jpg":"image/jpeg",
    ".jpeg":"image/jpeg",".gif":"image/gif",".svg":"image/svg+xml",
    ".webp":"image/webp",".ico":"image/x-icon",".txt":"text/plain",
    ".pdf":"application/pdf",
}

# ── data.js helpers ──
def safe_read(fp):
    try: return open(fp, "r", encoding="utf-8").read()
    except: return None

def find_balanced_block(content, start):
    """Starting from the first '{' or '[' at or after 'start',
    return (end_index, block_string) with properly balanced brackets."""
    opens = {'{': '}', '[': ']'}
    i = start
    while i < len(content) and content[i] not in '{[':
        i += 1
    if i >= len(content):
        return None, None
    open_ch = content[i]
    close_ch = opens[open_ch]
    depth = 0
    in_str = False
    str_ch = ''
    j = i
    while j < len(content):
        ch = content[j]
        if in_str:
            if ch == '\\':
                j += 1  # skip escaped char
            elif ch == str_ch:
                in_str = False
        else:
            if ch in ('"', "'"):
                in_str = True
                str_ch = ch
            elif ch == open_ch:
                depth += 1
            elif ch == close_ch:
                depth -= 1
                if depth == 0:
                    return j + 1, content[i:j+1]
        j += 1
    return None, None

def extract_section(content, name):
    pattern = rf'const\s+{re.escape(name)}\s*=\s*'
    m = re.search(pattern, content)
    if not m: return None
    end, block = find_balanced_block(content, m.end() - 1)
    if not block: return None
    try: return json.loads(block)
    except: return None

def replace_section(content, name, new_data):
    pattern = rf'const\s+{re.escape(name)}\s*=\s*'
    m = re.search(pattern, content)
    if not m: return None
    end, block = find_balanced_block(content, m.end() - 1)
    if not block: return None
    replacement = f'const {name} = {json.dumps(new_data, indent=2)};'
    return content[:m.start()] + replacement + content[end:]

def update_org_field(content, field, value):
    """Update a field inside the org object (handles nested objects)."""
    # First try simple pattern
    pat = re.compile(rf'({re.escape(field)}\s*:\s*["\'])(.*?)(["\'])')
    result = pat.sub(r'\g<1>' + value + r'\g<3>', content, count=1)
    if result != content:
        return result
    # If not found at top level, it might be inside nested social object
    # Fall back to full org replacement
    return content

# ── auth ──
class AdminHandler(http.server.SimpleHTTPRequestHandler):
    sessions = {}

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def send_json(self, obj, status=200):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def authenticated(self):
        cookies = self.headers.get("Cookie", "")
        sid = ""
        for part in cookies.split(";"):
            part = part.strip()
            if part.startswith("swamitra.sid="):
                sid = part.split("=", 1)[1]
                break
        return sid in self.sessions and self.sessions[sid] > time.time()

    # ── API routing ──
    def route_api(self):
        path = self.path

        if path == "/api/auth-status":
            return self.send_json({"authed": self.authenticated()})

        if not self.authenticated():
            return self.send_json({"error": "Unauthorized"}, 401)

        # ── AUTH ──
        if path == "/api/login" and self.command == "POST":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode()
            try: data = json.loads(body)
            except: data = {}
            pw = data.get("password", "")
            if pw == ADMIN_PASS:
                sid = os.urandom(32).hex()
                self.sessions[sid] = time.time() + 14400
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Set-Cookie", f"swamitra.sid={sid}; HttpOnly; SameSite=Lax; Max-Age=14400; Path=/")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            else:
                self.send_json({"error": "Invalid password"}, 403)
            return

        if path == "/api/logout" and self.command == "POST":
            cookies = self.headers.get("Cookie", "")
            for part in cookies.split(";"):
                part = part.strip()
                if part.startswith("swamitra.sid="):
                    sid = part.split("=", 1)[1]
                    self.sessions.pop(sid, None)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Set-Cookie", "swamitra.sid=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
            return

        # ── IMAGES ──
        if path == "/api/images" and self.command == "GET":
            imgs = []
            if os.path.isdir(IMG_DIR):
                imgs = sorted([f for f in os.listdir(IMG_DIR) if f.lower().endswith((".png",".jpg",".jpeg",".gif",".webp",".svg"))])
            return self.send_json({"images": imgs})

        img_file = re.match(r'^/api/images/(.+)$', path)
        if img_file and self.command == "GET":
            name = unquote(img_file.group(1))
            fp = os.path.join(IMG_DIR, name)
            if os.path.isfile(fp):
                ext = os.path.splitext(name)[1].lower()
                ct = MIME.get(ext, "application/octet-stream")
                with open(fp, "rb") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", ct)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_json({"error": "Not found"}, 404)
            return

        if img_file and self.command == "DELETE":
            name = unquote(img_file.group(1))
            fp = os.path.join(IMG_DIR, name)
            if os.path.isfile(fp):
                os.remove(fp)
                self.send_json({"ok": True})
            else:
                self.send_json({"error": "Not found"}, 404)
            return

        # ── FILE UPLOAD ──
        if path == "/api/upload" and self.command == "POST":
            ct = self.headers.get("Content-Type", "")
            if "multipart/form-data" in ct:
                boundary = ct.split("boundary=")[1].strip()
                length = int(self.headers.get("Content-Length", 0))
                raw = self.rfile.read(length).decode("utf-8", errors="replace")

                fn_m = re.search(r'filename="([^"]+)"', raw)
                if fn_m:
                    fname = fn_m.group(1)
                    ext = os.path.splitext(fname)[1].lower()
                    if ext in (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"):
                        parts = raw.split("\r\n\r\n", 1)
                        content_raw = parts[1] if len(parts) > 1 else ""
                        end_b = "\r\n--" + boundary
                        for trim in [end_b, "--" + boundary]:
                            if content_raw.endswith(trim):
                                content_raw = content_raw[:-len(trim)]

                        safe = re.sub(r'[^a-zA-Z0-9._-]', '_', fname)
                        base, extension = os.path.splitext(safe)
                        ts = int(time.time())
                        final = f"{base}_{ts}{extension}"
                        with open(os.path.join(IMG_DIR, final), "wb") as f:
                            f.write(content_raw.encode("utf-8"))
                        return self.send_json({"ok": True, "filename": final, "url": f"/api/images/{final}"})

                return self.send_json({"error": "Invalid file"}, 400)
            return self.send_json({"error": "Expected multipart"}, 400)

        # ── DATA.JS ──
        if path == "/api/data" and self.command == "GET":
            content = safe_read(DATA_JS) or ""
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(content.encode())
            return

        if path == "/api/data" and self.command == "PUT":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode()
            try: data = json.loads(body)
            except: data = {}
            new_content = data.get("data", "")
            if new_content:
                import shutil
                shutil.copy2(DATA_JS, DATA_JS + ".bak")
                with open(DATA_JS, "w", encoding="utf-8") as f:
                    f.write(new_content)
            return self.send_json({"ok": True})

        # ── SECTIONS ──
        sec_m = re.match(r'^/api/data/section/(\w+)$', path)
        if sec_m and self.command == "GET":
            section = sec_m.group(1)
            content = safe_read(DATA_JS)
            section_data = extract_section(content, section) if content else None
            return self.send_json({"section": section_data})

        if sec_m and self.command == "PUT":
            section = sec_m.group(1)
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode()
            try: data = json.loads(body)
            except: data = {}
            content = safe_read(DATA_JS)
            if content:
                updated = replace_section(content, section, data.get("data", []))
                if updated:
                    import shutil
                    shutil.copy2(DATA_JS, DATA_JS + ".bak")
                    with open(DATA_JS, "w", encoding="utf-8") as f:
                        f.write(updated)
            return self.send_json({"ok": True})

        # ── ORG FIELD ──
        org_m = re.match(r'^/api/data/org/(\w+)$', path)
        if org_m and self.command == "PUT":
            field = org_m.group(1)
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode()
            try: data = json.loads(body)
            except: data = {}
            content = safe_read(DATA_JS)
            if content:
                val = data.get("value", "")
                updated = update_org_field(content, field, val)
                if updated != content:
                    with open(DATA_JS, "w", encoding="utf-8") as f:
                        f.write(updated)
            return self.send_json({"ok": True})

        # ── ORG FULL SECTION (for nested objects like social) ──
        if path == "/api/data/section/org" and self.command == "PUT":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode()
            try: data = json.loads(body)
            except: data = {}
            content = safe_read(DATA_JS)
            if content:
                updated = replace_section(content, "org", data.get("data", {}))
                if updated:
                    import shutil
                    shutil.copy2(DATA_JS, DATA_JS + ".bak")
                    with open(DATA_JS, "w", encoding="utf-8") as f:
                        f.write(updated)
            return self.send_json({"ok": True})

        # ── SECTIONS LIST ──
        if path == "/api/sections" and self.command == "GET":
            content = safe_read(DATA_JS)
            sections = []
            if content:
                for m in re.finditer(r'const\s+(\w+)\s*=\s*(\[|\{)', content):
                    sections.append({"name": m.group(1), "type": "array" if m.group(2) == "[" else "object"})
            return self.send_json({"sections": sections})

        # ── PAGES ──
        if path == "/api/pages" and self.command == "GET":
            pages = []
            if os.path.isdir(SITE_DIR):
                for f in sorted(os.listdir(SITE_DIR)):
                    if f.endswith(".html") and f != "404.html":
                        pages.append({"key": f[:-5], "label": f[:-5].replace("-", " ").title(), "file": f})
            return self.send_json({"pages": pages})

        if path == "/api/pages/save" and self.command == "POST":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode()
            try: data = json.loads(body)
            except: data = {}
            fname = data.get("file", "")
            content = data.get("content", "")
            if fname and content:
                target = os.path.join(SITE_DIR, fname)
                if os.path.exists(target):
                    import shutil
                    shutil.copy2(target, target + ".bak")
                with open(target, "w", encoding="utf-8") as f:
                    f.write(content)
            return self.send_json({"ok": True})

        return self.send_json({"error": "Not found"}, 404)

    # ── Static file serving ──
    def serve_static(self):
        path = self.path.split("?")[0].split("#")[0]
        if path == "/":
            path = "/index.html"
        filepath = os.path.join(PUBLIC, path.lstrip("/"))
        if os.path.isdir(filepath):
            filepath = os.path.join(filepath, "index.html")
        if not os.path.exists(filepath):
            filepath = os.path.join(PUBLIC, "index.html")
        ext = os.path.splitext(filepath)[1].lower()
        ct = MIME.get(ext, "application/octet-stream")
        with open(filepath, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ct)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path.startswith("/api/"):
            return self.route_api()
        return self.serve_static()

    def do_POST(self):
        return self.route_api()

    def do_PUT(self):
        return self.route_api()

    def do_DELETE(self):
        if self.path.startswith("/api/images/") and self.authenticated():
            name = unquote(self.path.split("/")[-1])
            fp = os.path.join(IMG_DIR, name)
            if os.path.isfile(fp):
                os.remove(fp)
                self.send_json({"ok": True})
            else:
                self.send_json({"error": "Not found"}, 404)
            return
        self.send_json({"error": "Not found"}, 404)

    def log_message(self, format, *args):
        pass  # silence logs


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), AdminHandler) as httpd:
    print(f"\n  SWAMITRA Admin — http://127.0.0.1:{PORT}")
    print(f"  Default password: {ADMIN_PASS}")
    print(f"  Change with: ADMIN_PASS=yourpass python3 serve.py\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
