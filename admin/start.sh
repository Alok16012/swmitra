#!/bin/bash
# SWAMITRA Admin Panel — Quick Start
# No npm install needed, zero dependencies, pure Python

PORT=${PORT:-5174}
ADMIN_PASS=${ADMIN_PASS:-"swamitra@2026"}

echo ""
echo "  Starting SWAMITRA Admin Panel..."
echo "  URL:      http://localhost:${PORT}"
echo "  Password: ${ADMIN_PASS}"
echo ""
echo "  To change password: ADMIN_PASS=yourpass ./start.sh"
echo "  Press Ctrl+C to stop"
echo ""

cd "$(dirname "$0")"
ADMIN_PASS="${ADMIN_PASS}" python3 serve.py
