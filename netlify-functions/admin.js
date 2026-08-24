const https = require('https');

// Environment variables (set in Netlify UI)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Alok16012/swmitra';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const ADMIN_PASS = process.env.ADMIN_PASS || 'swamitra@2026';

// In-memory session store (Note: functions are stateless, sessions reset on cold start)
// For production, consider using a more persistent solution
const sessions = new Map();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

// GitHub API helper
function githubApi(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'SWAMITRA-Admin',
        'Accept': 'application/vnd.github.v3+json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(json.message || `GitHub API error ${res.statusCode}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Session management
function getSession(cookies) {
  const match = cookies.match(/swamitra\.sid=([^;]+)/);
  if (!match) return null;
  const session = sessions.get(match[1]);
  if (!session || session.expires < Date.now()) {
    sessions.delete(match[1]);
    return null;
  }
  return session;
}

function createSession() {
  const sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessions.set(sid, { expires: Date.now() + 4 * 60 * 60 * 1000 });
  return sid;
}

// Parse multipart/form-data
function parseMultipart(body, boundary) {
  const files = {};
  const parts = String(body).split(`--${boundary}`);

  for (const part of parts) {
    const cdMatch = part.match(/Content-Disposition: form-data; name="([^"]+)"(?:; filename="([^"]+)")?/);
    if (!cdMatch) continue;

    const name = cdMatch[1];
    const filename = cdMatch[2] || null;
    const contentStart = part.indexOf('\r\n\r\n');

    if (contentStart === -1) continue;

    let content = part.substring(contentStart + 4);
    content = content.replace(/\r\n--[^-\r\n]+$/, '').replace(/\r\n--$/, '');

    files[name] = filename ? { filename, content } : { value: content };
  }

  return files;
}

// Main handler
exports.handler = async (event) => {
  const { httpMethod, path, body, headers } = event;

  // CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // Login (no auth required)
    if (path === '/api/login' && httpMethod === 'POST') {
      const { password } = JSON.parse(body || '{}');

      if (password === ADMIN_PASS) {
        const sid = createSession();
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Set-Cookie': `swamitra.sid=${sid}; HttpOnly; SameSite=Lax; Max-Age=14400; Path=/`,
          },
          body: JSON.stringify({ ok: true }),
        };
      }

      return jsonResponse(403, { error: 'Invalid password' });
    }

    // Auth status
    if (path === '/api/auth-status' && httpMethod === 'GET') {
      return jsonResponse(200, { authed: !!getSession(headers.cookie || '') });
    }

    // All other routes require auth
    const session = getSession(headers.cookie || '');
    if (!session) {
      return jsonResponse(401, { error: 'Unauthorized' });
    }

    // Logout
    if (path === '/api/logout' && httpMethod === 'POST') {
      const cookies = headers.cookie || '';
      const match = cookies.match(/swamitra\.sid=([^;]+)/);
      if (match) sessions.delete(match[1]);

      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Set-Cookie': 'swamitra.sid=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/',
        },
        body: JSON.stringify({ ok: true }),
      };
    }

    // Get data.js
    if (path === '/api/data' && httpMethod === 'GET') {
      const result = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`);
      const content = Buffer.from(result.content, 'base64').toString('utf-8');

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
        body: content,
      };
    }

    // Update data.js (full file)
    if (path === '/api/data' && httpMethod === 'PUT') {
      const { data: newContent } = JSON.parse(body || '{}');

      const current = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`);
      const base64 = Buffer.from(newContent, 'utf-8').toString('base64');

      await githubApi('PUT', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`, {
        message: 'Update site content via admin panel',
        content: base64,
        sha: current.sha,
      });

      return jsonResponse(200, { ok: true });
    }

    // Get section
    if (path.startsWith('/api/data/section/') && httpMethod === 'GET') {
      const section = path.split('/').pop();
      const result = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`);
      const content = Buffer.from(result.content, 'base64').toString('utf-8');

      const sectionRegex = new RegExp(`const\\s+${section}\\s*=\\s*(\\[.*?\\]|\\{.*?\\});`, 'gs');
      const match = sectionRegex.exec(content);

      if (match) {
        try {
          return jsonResponse(200, { section: JSON.parse(match[1]) });
        } catch (e) {
          return jsonResponse(500, { error: 'Failed to parse section' });
        }
      }

      return jsonResponse(404, { section: null });
    }

    // Update section
    if (path.startsWith('/api/data/section/') && httpMethod === 'PUT') {
      const section = path.split('/').pop();
      const { data: sectionData } = JSON.parse(body || '{}');

      const current = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`);
      let content = Buffer.from(current.content, 'base64').toString('utf-8');

      const sectionRegex = new RegExp(`const\\s+${section}\\s*=\\s*(\\[.*?\\]|\\{.*?\\});`, 'gs');
      const newContent = content.replace(sectionRegex, `const ${section} = ${JSON.stringify(sectionData, null, 2)};`);

      const base64 = Buffer.from(newContent, 'utf-8').toString('base64');
      await githubApi('PUT', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`, {
        message: `Update ${section} via admin panel`,
        content: base64,
        sha: current.sha,
      });

      return jsonResponse(200, { ok: true });
    }

    // Update org field
    if (path.startsWith('/api/data/org/') && httpMethod === 'PUT') {
      const field = path.split('/').pop();
      const { value } = JSON.parse(body || '{}');

      const current = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`);
      let content = Buffer.from(current.content, 'base64').toString('utf-8');

      const fieldRegex = new RegExp(`(${field}\\s*:\\s*["'])(.*?)(["'])`);
      content = content.replace(fieldRegex, `$1${value}$3`);

      const base64 = Buffer.from(content, 'utf-8').toString('base64');
      await githubApi('PUT', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`, {
        message: `Update ${field} via admin panel`,
        content: base64,
        sha: current.sha,
      });

      return jsonResponse(200, { ok: true });
    }

    // List images
    if (path === '/api/images' && httpMethod === 'GET') {
      const result = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/img?ref=${GITHUB_BRANCH}`);
      const images = result.map(item => item.name).filter(name => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(name));

      return jsonResponse(200, { images });
    }

    // Upload image
    if (path === '/api/upload' && httpMethod === 'POST') {
      const contentType = headers['content-type'] || '';

      if (contentType.includes('multipart/form-data')) {
        const boundary = contentType.split('boundary=')[1];
        const decodedBody = Buffer.from(body, 'base64').toString('utf-8');
        const formData = parseMultipart(decodedBody, boundary);

        if (!formData['image'] || !formData['image'].filename) {
          return jsonResponse(400, { error: 'No image provided' });
        }

        const file = formData['image'];
        const filename = file.filename;
        const content = Buffer.from(file.content).toString('base64');

        const result = await githubApi('PUT', `/repos/${GITHUB_REPO}/contents/site/assets/img/${filename}?ref=${GITHUB_BRANCH}`, {
          message: `Upload image ${filename} via admin panel`,
          content: content,
        });

        return jsonResponse(200, {
          ok: true,
          filename: result.content.name,
          url: `/api/images/${result.content.name}`
        });
      }

      return jsonResponse(400, { error: 'Invalid request' });
    }

    // Serve image
    if (path.startsWith('/api/images/') && httpMethod === 'GET') {
      const filename = path.split('/').pop();
      const result = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/img/${filename}?ref=${GITHUB_BRANCH}`);
      const imageBuffer = Buffer.from(result.content, 'base64');

      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': result.type || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
        body: imageBuffer.toString('base64'),
        isBase64Encoded: true,
      };
    }

    // Delete image
    if (path.startsWith('/api/images/') && httpMethod === 'DELETE') {
      const filename = path.split('/').pop();

      const fileInfo = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/img/${filename}?ref=${GITHUB_BRANCH}`);

      await githubApi('DELETE', `/repos/${GITHUB_REPO}/contents/site/assets/img/${filename}?ref=${GITHUB_BRANCH}`, {
        message: `Delete image ${filename} via admin panel`,
        sha: fileInfo.sha,
      });

      return jsonResponse(200, { ok: true });
    }

    // Get sections list
    if (path === '/api/sections' && httpMethod === 'GET') {
      const result = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/assets/js/data.js?ref=${GITHUB_BRANCH}`);
      const content = Buffer.from(result.content, 'base64').toString('utf-8');

      const sections = [];
      const sectionRegex = /const\s+(\w+)\s*=\s*(\[|\{)/g;
      let match;
      while ((match = sectionRegex.exec(content)) !== null) {
        sections.push({
          name: match[1],
          type: match[2] === '[' ? 'array' : 'object'
        });
      }

      return jsonResponse(200, { sections });
    }

    // Get pages list
    if (path === '/api/pages' && httpMethod === 'GET') {
      const result = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site?ref=${GITHUB_BRANCH}`);
      const pages = result
        .filter(item => item.type === 'file' && item.name.endsWith('.html') && item.name !== '404.html')
        .map(item => ({
          key: item.name.replace('.html', ''),
          label: item.name.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          file: item.name,
        }));

      return jsonResponse(200, { pages });
    }

    // Save page HTML
    if (path === '/api/pages/save' && httpMethod === 'POST') {
      const { file, content } = JSON.parse(body || '{}');

      if (!file || !content) {
        return jsonResponse(400, { error: 'Missing file or content' });
      }

      let sha = null;
      try {
        const current = await githubApi('GET', `/repos/${GITHUB_REPO}/contents/site/${file}?ref=${GITHUB_BRANCH}`);
        sha = current.sha;
      } catch (e) {
        // File doesn't exist yet
      }

      const base64Content = Buffer.from(content, 'utf-8').toString('base64');
      await githubApi('PUT', `/repos/${GITHUB_REPO}/contents/site/${file}?ref=${GITHUB_BRANCH}`, {
        message: `Update ${file} via admin panel`,
        content: base64Content,
        sha: sha,
      });

      return jsonResponse(200, { ok: true });
    }

    // 404
    return jsonResponse(404, { error: 'Not found' });

  } catch (error) {
    console.error('Function error:', error);
    return jsonResponse(500, { error: error.message || 'Internal server error' });
  }
};
