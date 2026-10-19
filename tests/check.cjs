// tests/check.cjs — 打包级结构检查（零依赖）
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
let pass = 0, fail = 0;
function chk(name, cond) { cond ? (pass++, console.log('PASS', name)) : (fail++, console.error('FAIL', name)); }
const exists = fs.existsSync(file);
chk('index.html 存在', exists);
if (exists) {
  const html = fs.readFileSync(file, 'utf8');
  chk('lang="zh-CN"', /<html[^>]+lang="zh-CN"/.test(html));
  chk('<title> 存在', /<title>[^<]+<\/title>/.test(html));
  chk('无外部样式表', !/<link[^>]+rel=["']stylesheet/i.test(html));
  chk('无外部脚本', !/<script[^>]+src=/i.test(html));
  chk('无 http(s) 资源引用', !/(?:src|href)\s*=\s*["']https?:/i.test(html));
  chk('无 @import', !/@import/i.test(html));
  chk('无外部 url()', !/url\(\s*['"]?https?:/i.test(html));
  chk('无 fetch/XHR', !/fetch\(|XMLHttpRequest/.test(html));
  chk('哨兵 @@CHAPTERS@@', html.includes('@@CHAPTERS@@'));
  chk('哨兵 @@STYLE:CHAPTERS@@', html.includes('@@STYLE:CHAPTERS@@'));
  chk('哨兵 @@JS:FEATURES@@', html.includes('@@JS:FEATURES@@'));
  chk('哨兵 @@JS:SELFTEST@@', html.includes('@@JS:SELFTEST@@'));
  chk('自检挂载 __selftest', html.includes('__selftest'));
  chk('文眼「5.5 万 token」', html.includes('5.5 万 token'));
  chk('文眼「渐进式披露」', html.includes('渐进式披露'));
  chk('测验 10 题标记', (html.match(/data-concept=/g) || []).length >= 30);
  chk('体积 < 1MB', Buffer.byteLength(html) < 1024 * 1024);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
