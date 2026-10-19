// tests/serve.cjs — 本地静态服务（浏览器验证用，零依赖）
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const PORT = Number(process.env.PORT || 8137);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.md': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.normalize(path.join(root, urlPath));
  if (!f.startsWith(root)) { res.writeHead(403); return res.end('forbidden'); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`serving ${root} at http://127.0.0.1:${PORT}/`));
