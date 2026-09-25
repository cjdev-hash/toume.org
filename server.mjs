import http from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.PORT || 3000);
const files = new Map([['/', 'index.html'], ['/index.html', 'index.html'], ['/contact.html', 'contact.html'], ['/styles.css', 'styles.css'], ['/app.js', 'app.js'], ['/ja.png', 'ja.png'], ['/alternative.html', 'alternative.html'], ['/alternative.css', 'alternative.css'], ['/alternative.js', 'alternative.js']]);
const types = {html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',png:'image/png'};
files.set('/thanks.html','thanks.html');
files.set('/thanks.js','thanks.js');
http.createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  const file = files.get(path);
  if (!file) { response.writeHead(404); response.end('Not found'); return; }
  try {
    const body = await readFile(new URL(file, import.meta.url));
    response.writeHead(200, {'Content-Type':types[file.split('.').pop()], 'X-Content-Type-Options':'nosniff'});
    response.end(body);
  } catch { response.writeHead(500); response.end('Unable to load page'); }
}).listen(port, '127.0.0.1', () => console.log(`Toumé is running at http://localhost:${port}`));
