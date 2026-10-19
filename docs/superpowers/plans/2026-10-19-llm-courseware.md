# 大模型概念课件（单文件 HTML）实现计划

> **给执行者：** 必须使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务执行本计划。步骤用复选框（`- [ ]`）语法跟踪。
> **中文说明**：本计划语言为中文（用户要求），术语保留英文原名。

**Goal（目标）**：交付一份零依赖、双击即用的单文件 HTML 交互课件，1 小时讲清 10 个大模型概念（Token/上下文/Prompt/Function Calling/RAG/微调/Agent/多 Agent/MCP/Skills），深空霓虹风格，全部演示可手动把玩。

**Architecture（架构）**：单个 `index.html`（内联全部 CSS/JS，零外部请求）；页面由 `.section`（节）组成，导航引擎提供键盘翻节、滚动进度条、目录抽屉、全屏；每章内容依序追加到 HTML 中的哨兵注释区域；动画全部由 CSS keyframes/transition + 少量 JS 驱动；页面内置 `#selftest` 自检模式（hash 触发），用于结构与交互的自动化验证。

**Tech Stack**：HTML5 + CSS3（原生动画）+ Vanilla JS（ES2015+，无构建）；Node 17.5.0（`node`，已在 PATH）仅用于测试脚本（零 npm 依赖）；浏览器验证用 OpenCode 内置 browser 工具（打开、点击、evaluate、screenshot、console）。

**Spec（设计稿）**：`E:\opencode\llm-courseware\docs\design.md`（用户已批准；本计划与设计稿冲突时以设计稿为准；设计稿 §10 允许自由发挥的部分按本计划执行）。

---

## Global Constraints（全局约束，所有任务隐含遵守）

1. **单文件产物** `E:\opencode\llm-courseware\index.html`：内联全部 CSS/JS；无任何外部请求（无 http(s) 资源、无 `@import`、无 `<script src>`、无 `<link rel=stylesheet>`、无 fetch/XHR；`data:` URI 可用；CSS 图形/SVG 内联）。
2. **`file://` 双击可用**；目标浏览器：Windows 11 现代 Chrome/Edge；≥1024px 最佳、≥768px 可用；总文件 < 1MB（预计 300–600KB）。
3. **视觉规范（写作精确值）**：背景径向渐变 `#101a35 → #070a16 → #04050c`；主渐变 青 `#22d3ee` → 靛紫 `#818cf8` → 粉紫 `#f0abfc`；正文 `#dbe6ff`/`#c7d5f2`，次要 `#8fa0c0`；卡片 `rgba(255,255,255,.035)` 底 + `rgba(148,180,255,.16)` 边框 + 圆角 10–12px；系统字体栈（`"Segoe UI","Microsoft YaHei",system-ui,sans-serif`），不引外链字体；动效基调：呼吸发光、渐变流动、轻量粒子、连线生长；正文基准 `font-size:17px`。
4. **内容纪律**：中文文案；每个英文术语首次出现紧跟人话解释；每屏必须有视觉元素（反目标：纯文字堆砌）；动画轻量（transform/opacity 为主）、丝滑；所有演示**用户手动触发，不自动播放**；每个演示必须带「重来」按钮；单演示 10–30 秒可玩；无解锁门槛。
5. **章节表（id·标题·时长·关键 min 元素）**：

   | id | 标题 | 约分钟 | 关键元素 |
   |---|---|---|---|
   | `#cover` | 封面 | – | 标题、开始按钮、使用提示（键盘 ←→ 翻节） |
   | `#ch1` | 大模型是什么 | 6 | 文字接龙机演示 `[data-demo="chain"]` |
   | `#ch2` | 概念全家桶 | 12–15 | `#concept-map`、10 概念卡、`#explored-count`、口诀 |
   | `#ch3` | Agent 智能体 | 8 | 想→做→看 循环图、任务步进机 `[data-demo="agent-step"]` |
   | `#ch4` | MCP | 8 | 连线爆炸 `[data-demo="mcp-lines"]`、Host→Client→Server、事实卡 |
   | `#ch5` | Skills | 7 | 三层书页 `[data-demo="skill-layers"]`、上下文计量、OpenCode 彩蛋 |
   | `#ch6` | 实战串联 | 8 | 流程图逐步点亮 `[data-demo="journey"]` |
   | `#ch7` | 记忆加固 | 5 | 星系图 `#starmap`、顺口溜、测验 `#quiz`、完结 `#ending` |

6. **10 概念枚举（data-concept 值，固定小写连字符）**：`token, context, prompt, function-calling, rag, finetuning, agent, multi-agent, mcp, skills`。覆盖口径：ch2 地图 10 卡、ch7 星系图 10 星、测验 10 题（每概念恰好 1 题）、口诀两处（ch2 与 ch7）文字一致且覆盖 10 概念。
7. **必含文眼（最终检查清单）**：`文字接龙`、`幻觉`、`乐高`、`工作台`、`员工手册`、`实习生`、`开卷考试`、`回炉进修`、`USB-C`、`SKILL.md`、`渐进式披露`、`100 token`、`ReAct`、`Agentic AI Foundation`、`无状态`、`5.5 万 token`、`4 万`。（实现时自然织入文案。）
8. **事实基线（2026-10，设计稿 §7）**：MCP 2024-11-25 Anthropic 发布→OpenAI 2025-03 / Google 2025-04 / 微软 2025-05 采用→2025-12-09 捐给 Linux 基金会旗下 Agentic AI Foundation→官方注册表约 4 万服务器→2026-07-28 规格改无状态；Skills 三层渐进披露（元数据 ~100 token 常驻 / 正文 <5k / 资源与脚本按需且仅输出进上下文）；ReAct = Reason 想 + Act 做。
9. **Git**：在 `E:\opencode\llm-courseware` 建立独立仓库（非 E:\opencode 全局）；每个任务一次提交；信息前缀 `feat:` / `docs:` / `test:` / `chore:`。若 `git config user.email` 为空则在**本仓库局部**设置 `user.name "llm-courseware"`、`user.email "llm-courseware@local"`。
10. **测试三层（本计划统一验证口径）**：
    - 打包级：`node tests/check.cjs`（零依赖；外部请求/体积/哨兵/基本 meta 检查，每任务必跑）；
    - 结构+行为：页面 `#selftest` 模式（hash 触发；`window.__selftest.summary()` 返回 `{pass, fail, done, failed[]}`；每任务先把新用例写成红的，再实现到绿）；
    - 目视：browser 工具截图 + `browser.console` 确认无报错。浏览器验证固定地址：`http://127.0.0.1:8137/index.html`（服务由 `node tests/serve.cjs` 后台提供，端口 8137）。
11. **命令约定**：所有命令在 `E:\opencode\llm-courseware` 目录执行；shell 为 PowerShell。

## Review Focus（设计稿暗示但任务测试单未覆盖的 5 类风险，各自落在指定任务测试）

1. **快速连点「开始/走一步/翻开/重来」**不得叠加计时器或重复动画（预期：重入保护，状态干净）→ 任务 4（token 连点）与任务 6（步进机连点）各有一条用例。
2. **按钮聚焦时按空格**：应触发按钮本身、不得误翻节（预期：交互元素获得焦点时空格不翻节；方向键仍翻节）→ 任务 11 测验用例。
3. **窗口 resize 后**进度条章节节点与目录高亮应重新定位、无控制台报错 → 任务 12 用例（`dispatchEvent(new Event('resize'))`）。
4. **`file://` 直开**与 http 下表现一致（无外部请求、hash 自检模式无害）→ 任务 12 用例（直接 tabs.open file:// URL；若工具拒绝则记录并回退为“无外部引用”断言 + README 人工步骤）。
5. **768–1024px 窄屏**：卡片收列、无横向滚动、演示区不溢出 → 任务 12 用例（`document.documentElement.scrollWidth <= window.innerWidth + 1`；若无法改窗宽则代码走查 + 截图记录）。

---

## File Structure（文件结构）

- `E:\opencode\llm-courseware\index.html` — **唯一交付物**；全部 HTML/CSS/JS。内部按哨兵注释分区，各任务向哨兵前追加：
  - `<style>` 内：`/* @@STYLE:CHAPTERS@@ */`（各章样式依次追加于此，最后是响应式段）
  - `<body>` 内：`<!-- @@CHAPTERS@@ -->`（各章 DOM 依次追加于此，位于 `<script>` 之前）
  - `<script>` 内：`/* @@JS:FEATURES@@ */`（导航后、按章追加功能 JS）、`/* @@JS:SELFTEST@@ */`（自检用例区，所有用例集中于此）
- `E:\opencode\llm-courseware\tests\check.cjs` — 打包级结构检查（任务 1 创建；零依赖）
- `E:\opencode\llm-courseware\tests\serve.cjs` — 本地静态服务，127.0.0.1:8137（任务 1 创建；零依赖）
- `E:\opencode\llm-courseware\README.md` — 使用说明（任务 12）
- `E:\opencode\llm-courseware\docs\design.md` — 已批准的设计稿（不修改）
- `E:\opencode\llm-courseware\docs\superpowers\plans\2026-10-19-llm-courseware.md` — 本计划
- `.git/` — 任务 1 初始化

**为什么单文件不分拆**：设计稿硬性要求单文件零依赖；哨兵注释替代物理分片，保证“改哪章找哪区”，避免引入构建步骤。

## 共享约定（interfaces；所有任务引用，不重复定义）

**DOM 约定**
- 节：`<section class="section" data-title="...">`；每节必须有 `data-title`（目录抽屉与自检用）。CSS `scroll-margin-top:72px`。
- 章：`<section class="chapter" id="ch1">…</section>`；章首 `.chapter-head > .chapter-title + .chip`（chip 显示“约 X 分钟”）。
- 组件：`「记住这个」` 用 `<aside class="remember">…</aside>`（ch1–ch6 每章 ≥1 个）；章/节尾导航 `<nav class="sec-nav"><button data-nav="prev">← 上一节</button><button data-nav="next">下一节 →</button></nav>`。
- 演示根：`<div class="demo" data-demo="<name>">`；启动键 `[data-start]`（如有）；重来键 `[data-again]`（**每个演示必有**）。
- 滚动进入动画：元素初始 `opacity:0; transform:translateY(14px)`，进入视口后加 `.in-view`（IntersectionObserver，一次性）；内容**不用 display:none 隐藏**（自检与无障碍友好）。

**JS 接口（任务 1 产出，后续任务严格使用）**
- `window.until(condFn, timeout=6000, step=50) -> Promise`：轮询直到 `condFn()` 真值，超时 reject（`until 超时`）。
- `SELFTEST(name, fn)`：注册自检用例（`fn` 可异步，失败即 throw）；`ok(cond, msg)`：断言，失败 throw。
- `window.__selftest = {results:[{name,pass,msg}], done:boolean, summary() -> {pass,fail,done,failed:[]}}`；仅当 `location.hash.includes('selftest')` 时在 load 后自动顺序执行。
- `window.__CONCEPTS = ['token','context','prompt','function-calling','rag','finetuning','agent','multi-agent','mcp','skills']`。
- `registerDemo(name, impl)`：`impl = {start(), reset()}`；`start()` 必须返回 Promise（完成时 resolve）；helper 保证：`running` 期间再次 `start()` 被忽略（重入保护）、`reset()` 立即执行且调用方需自行清除计时器；`window.__demos[name] = {root, running, start, reset}`；自动绑定 `[data-start]`/`[data-again]` 点击。
- `window.__nav = {goTo(i), next(), prev(), index(), count(), ids()}`：索引基于 `document.querySelectorAll('.section')`（脚本在 body 末尾执行，各任务追加的章节 DOM 位于哨兵处、在脚本之前，加载时自然纳入）。
- 键盘：`→`/空格/PageDown = 下一节，`←`/PageUp = 上一节，`Home` = 回封面；**仅空格**在 `document.activeElement.closest('button,a,input,textarea,select,[contenteditable]')` 非空时放行（不翻页）。
- 进度条：`#progress > #progress-fill`（`transform:scaleX(p)`，p=滚动比例）+ `#progress-nodes`（每章一个 `.node` 圆点，left=章首位置比例；resize 时重算）。
- 目录抽屉：`#btn-toc` 开合 `#toc-drawer`（`[hidden]` 切换 + `.open` 类），`#toc-backdrop` 点击关闭，Esc 关闭；抽屉按 `.chapter`/`.section` 动态生成“章 → 节”两级列表；点节 `__nav.goTo`。
- 全屏：`#btn-fullscreen`（⛶）切换 `document.documentElement.requestFullscreen()`/`exitFullscreen()`；`document.fullscreenEnabled` 为假时隐藏该按钮。

**写文件约定**：每任务只做两处编辑——把新 DOM 插到 `<!-- @@CHAPTERS@@ -->` 之前、新样式插到 `/* @@STYLE:CHAPTERS@@ */` 之前、新 JS 插到 `/* @@JS:FEATURES@@ */` 之前（自检用例插到 `/* @@JS:SELFTEST@@ */` 之前或之后均可，保持区内）。哨兵永不删除。

**测试运行手册（每任务步骤中引用为「跑自检」「跑打包检查」）**
- 跑打包检查：`node tests/check.cjs` → 期望 `N passed, 0 failed` 且退出码 0。
- 跑自检：确保 `node tests/serve.cjs` 在后台运行（未运行则以 background 方式启动）；浏览器打开或 reload `http://127.0.0.1:8137/index.html#selftest`；`browser.evaluate` 执行 `JSON.stringify(window.__selftest.summary())` → 期望 `"fail":0`（实现前可先看目标用例红色失败，即 `failed[]` 含本任务用例名）。
- 目视：`browser.screenshot` 该章区域 + `browser.console` 无 error。

---

### Task 1: 项目脚手架（仓库 / 测试工具 / 导航引擎 / 封面）

**Files:**
- Create: `E:\opencode\llm-courseware\index.html`
- Create: `E:\opencode\llm-courseware\tests\check.cjs`
- Create: `E:\opencode\llm-courseware\tests\serve.cjs`
- Create: `.gitignore`（内容：`*.log`、`node_modules/`）

**Interfaces:**
- Produces: 上文「共享约定」全部接口（哨兵、`registerDemo`、`__nav`、`until`、`SELFTEST/ok/__selftest/__CONCEPTS`、`#cover` 与封面「开始学习」按钮）。
- Consumes: 无。

- [ ] **Step 1: git init + 初始提交（含设计稿与本计划）**

```powershell
git init; git config user.email  # 若为空则：git config user.name "llm-courseware"; git config user.email "llm-courseware@local"
git add docs .gitignore; git commit -m "docs: add approved design spec and implementation plan"
```

- [ ] **Step 2: 写 `tests/check.cjs`（打包级检查，代码照抄）**

```js
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
  chk('体积 < 1MB', Buffer.byteLength(html) < 1024 * 1024);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 3: 跑检查确认红**（此刻 index.html 不存在）

Run: `node tests/check.cjs` → 期望输出含 `FAIL index.html 存在`、退出码 1。

- [ ] **Step 4: 写 `tests/serve.cjs`（代码照抄）**

```js
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
```

- [ ] **Step 5: 写自检用例（写在 `/* @@JS:SELFTEST@@ */` 区，此时页面尚无实现，应为红）**

```js
SELFTEST('nav/封面与壳', async () => {
  ok(!!document.querySelector('#cover.section'), '存在封面节');
  ok(!!document.querySelector('#progress-fill'), '存在进度条');
  ok(!!document.querySelector('#btn-toc') && !!document.querySelector('#toc-drawer'), '存在目录按钮与抽屉');
  ok(!!document.querySelector('#btn-fullscreen'), '存在全屏按钮');
  ok(typeof window.until === 'function' && !!window.__CONCEPTS && window.__CONCEPTS.length === 10, '全局工具就绪');
  ok(typeof window.__nav.goTo === 'function' && window.__nav.count() >= 1, '导航 API 可用');
});
SELFTEST('nav/开始按钮与目录开合', async () => {
  document.querySelector('#btn-toc').click();
  ok(document.querySelector('#toc-drawer').classList.contains('open'), '点目录打开抽屉');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await until(() => !document.querySelector('#toc-drawer').classList.contains('open'), 2000);
  ok(true, 'Esc 关闭抽屉');
});
```

- [ ] **Step 6: 实现 `index.html` 骨架**

结构（按此顺序）：
1. `<html lang="zh-CN">`；`<head>`：`<meta charset="utf-8">`、viewport、`color-scheme:dark`、`<title>大模型技术概念 · 一小时通关</title>`、（可选）emoji data:URI favicon。
2. `<style>`：CSS 变量（全局约束 3 的色值）、`body` 背景径向渐变、基础排版（17px、行高 1.75）、固定头部（`#progress` 三像素条 + `#btn-toc`/`#btn-fullscreen` 按钮）、`.card` 玻璃质感、`.btn` 渐变按钮、`.remember` 高亮框、`.sec-nav`、封面样式、`.in-view` 进入动画、keyframes（呼吸发光 `pulse`、渐变流动 `flow`）。
3. `<body>`：`#progress`(含 `#progress-fill`,`#progress-nodes`) → `#btn-toc`（“目录”）→ `#btn-fullscreen`（⛶）→ `<main>` 内 `#cover.section`（渐变主标题「大模型技术概念 · 一小时通关」、副题「从 Token 到 Agent：把 10 个概念讲成故事」、三个信息 chip：约 60 分钟 / 10 个概念 / 7 章、按钮 `<button class="btn" id="btn-start">开始学习 →</button>`、小字提示「键盘 ← → 翻节 · 右上角目录可跳转 · 每个演示都可重来」）→ `<!-- @@CHAPTERS@@ -->` → `</main>` → `#toc-backdrop` → `<aside id="toc-drawer" class="drawer" hidden>` → `<script>`（见下）。
4. `<script>`：无 IIFE 大包裹；顺序：导航引擎 `/* @@JS:NAV@@ */`…… 实际编码为：工具函数（qsa/$）→ 导航引擎（board 约定全部行为）→ `registerDemo` → `/* @@JS:FEATURES@@ */` → `/* @@JS:SELFTEST@@ */` 区（含上一步用例与 harness）。
5. `.section` 上设置 `scroll-margin-top:72px`；封面节 `data-title="封面"`。
6. TOC/Esc/全屏/progress 行为照「共享约定」实现；IntersectionObserver 给 `.section` 及后续任务加的 `.reveal` 元素加 `.in-view`。
7. 封面按钮 `#btn-start`：点击 `__nav.goTo(1)`。

- [ ] **Step 7: 跑打包检查与自检到绿**

Run: `node tests/check.cjs` → 期望全 PASS。
浏览器：启动 `node tests/serve.cjs`（background）→ 打开 `http://127.0.0.1:8137/index.html#selftest` → evaluate `JSON.stringify(window.__selftest.summary())` → 期望 `{"pass":2,"fail":0,...}`；`browser.console` 无 error；截图封面。

- [ ] **Step 8: 提交**

```powershell
git add index.html tests .gitignore; git commit -m "feat: app shell with nav engine, progress bar, toc drawer, cover"
```

### Task 2: 第 1 章 · 大模型是什么 + 文字接龙机

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`（三个哨兵前各追加一段）

**Interfaces:**
- Consumes: Task 1 的全部约定（`SELFTEST/ok/until`、`registerDemo`、`__nav`、`.section/.chapter/.remember/.sec-nav`、`.in-view`）。
- Produces: `#ch1`（4 节）与演示 `[data-demo="chain"]`；`.chapter-head/.chapter-title/.chip` 首次实际使用（后续章节照此模式）——DOM 约定：`.out`（输出容器，子元素 `.tok`）、`.cand`（候选词行，子元素 `.cand-word`）。

- [ ] **Step 1: 先在 `/* @@JS:SELFTEST@@ */` 区追加用例（红）**

```js
SELFTEST('ch1/结构', async () => {
  const ch = document.querySelector('#ch1');
  ok(!!ch, '存在 #ch1');
  ok(/文字接龙/.test(ch.innerText), '含「文字接龙」比喻');
  ok(/幻觉/.test(ch.innerText), '讲幻觉');
  ok(ch.querySelectorAll('.section').length >= 4, '至少 4 节');
  ok(!!ch.querySelector('.remember'), '含「记住这个」');
  ok(!!ch.querySelector('.chapter-head .chip'), '含时长 chip');
});
SELFTEST('ch1/接龙演示', async () => {
  const d = document.querySelector('[data-demo="chain"]');
  ok(!!d && !!window.__demos.chain, '演示存在且已注册');
  ok(!!d.querySelector('[data-again]'), '有重来按钮');
  d.querySelector('[data-start]').click();
  await until(() => d.querySelectorAll('.out .tok').length >= 2, 5000);
  ok(true, '点击后逐词输出');
  await until(() => window.__demos.chain.running === false, 30000);
  ok(d.querySelectorAll('.out .tok').length === 6, '共接出 6 个 token（我喜欢学习大模型）');
  d.querySelector('[data-again]').click();
  ok(d.querySelectorAll('.out .tok').length === 0, '重来清空输出');
});
```

- [ ] **Step 2: 跑自检确认红**（`#ch1` 不存在，两条用例进 `failed[]`）。

- [ ] **Step 3: 实现（DOM + 样式 + JS）**

DOM 插到 `<!-- @@CHAPTERS@@ -->` 之前：

```html
<section class="chapter" id="ch1">
  <div class="chapter-head reveal"><h2 class="chapter-title">第 1 章 · 大模型是什么</h2><span class="chip">约 6 分钟</span></div>
  <section class="section" data-title="核心：文字接龙大师">…（大标题「它本质是一台『文字接龙大师』」+ 一句话核心：训练=海量阅读、使用=预测下一个词；配 CSS 绘制的“接龙”插画：一列词块 + 发光箭头）</section>
  <section class="section" data-title="知识卡片：三个“不能”">…（3 张 `.card`：不知道新事=知识截止 / 不记你=只有临时工作台“上下文” / 动不了手=没有工具；再加一张“会自信地胡说=幻觉”卡片 + 人话解释）</section>
  <section class="section" data-title="互动：文字接龙机">…（`<div class="demo" data-demo="chain">`：说明一句话、`<button data-start>开始接龙</button><button data-again>重来</button>`、`.cand`（3 个 `.cand-word` 跳动后亮出选中项）、`.out`（逐词追加 `.tok`，每词 ~500ms）、末尾 `.chain-note`「每一步都只是：猜下一个词」「重来」可重播）</section>
  <section class="section" data-title="记住这个">…（`<aside class="remember">`：它是一颗超级大脑，但被关在聊天框里——后面所有技术都在给它补“手、记忆、参考书、手册”。+ 埋点句呼应 ch3–ch5）</section>
  <nav class="sec-nav">…（prev/next 按钮，本章末尾一处即可，ch1 节尾放）</nav>
</section>
```

JS（`/* @@JS:FEATURES@@ */` 前）：`registerDemo('chain', { start, reset })`。固定词表（文案必须与此一致）：句首“他每天早晨”，token 序列 `['都会','去','公园','跑','步','。']`（正好 6 个 `.tok`）；每步在 `.cand` 显示 3 个候选（正确词 + 2 个干扰词），高亮跳动 ~350ms 后把正确词追加进 `.out`。`start()` 返回 Promise（6 步 × ~500ms）；`reset()` 清空 `.out`/`.cand` 并清除所有计时器。`.cand-word` 用 CSS `pulse` 动画制造“候选词跳动”。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查**（`node tests/check.cjs` 全 PASS）。

- [ ] **Step 5: 目视验证**：reload `http://127.0.0.1:8137/index.html`（非自检模式）→ 截图 ch1 演示区；点击「开始接龙」截第二张；`browser.console` 无 error；按 `→` 验证翻到下一节。

- [ ] **Step 6: 提交**：`git add index.html; git commit -m "feat: chapter 1 with word-chain demo"`

### Task 3: 第 2 章 · 概念地图骨架（10 概念卡 + 探索计数 + 三张入口卡）

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: 共享约定、Task 2 建立的章节模式。
- Produces: `#ch2`；`#concept-map`；`.concept[data-concept]`（10 张；子元素 `.concept-head`（点击开合，父元素加 `.open`）、`.concept-body` 内四段 `.def`（是什么）`.metaphor`（比喻）`.example`（迷你例子）`.pitfall`（常见误区）、`.demo-zone[data-zone="<concept>"]` 占位（仅 7 个真实演示概念有：token/context/prompt/function-calling/rag/finetuning/multi-agent；agent/mcp/skills 三卡改放 `<a class="btn-enter" href="#ch3|#ch4|#ch5">去第 N 章 →</a>`）；`#explored-count`（文本固定格式 `已探索 x/10`）；打开任一卡即给该卡 `.explored` 并更新计数。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch2/地图结构', async () => {
  const map = document.querySelector('#concept-map');
  ok(!!map, '存在概念地图');
  const cards = [...map.querySelectorAll('.concept[data-concept]')];
  ok(cards.length === 10, '10 张概念卡');
  const ids = cards.map(c => c.dataset.concept).sort().join(',');
  ok(ids === [...window.__CONCEPTS].sort().join(','), 'data-concept 与约定枚举一致');
  ok(cards.every(c => c.querySelector('.def') && c.querySelector('.metaphor') && c.querySelector('.example') && c.querySelector('.pitfall')), '每卡四段齐全');
  ok([...map.querySelectorAll('.demo-zone')].length === 7, '7 个微演示占位');
  ok(!!map.querySelector('.concept[data-concept="agent"] .btn-enter[href="#ch3"]') && !!map.querySelector('.concept[data-concept="mcp"] .btn-enter[href="#ch4"]') && !!map.querySelector('.concept[data-concept="skills"] .btn-enter[href="#ch5"]'), '三张入口卡跳转正确');
});
SELFTEST('ch2/探索计数与庆祝', async () => {
  const map = document.querySelector('#concept-map');
  const heads = [...map.querySelectorAll('.concept-head')];
  heads[0].click();
  ok(map.querySelectorAll('.concept.explored').length === 1, '打开一卡计 1');
  ok(/#?已探索\s*1\s*\/\s*10/.test(document.querySelector('#explored-count').textContent), '计数文本 1/10');
  heads.forEach(h => h.click());
  await until(() => map.classList.contains('map-complete'), 2000);
  ok(document.querySelector('#explored-count').textContent.includes('10/10'), '点满 10/10');
  ok(true, '点满触发 .map-complete 庆祝');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**

DOM：`#ch2`（`.chapter-head` 标题「第 2 章 · 概念全家桶」+ chip「约 12–15 分钟」）含 4 节（`data-title` 分别：「使用说明」「概念地图」「全家福口诀（预告）」「记住这个」）。地图节内：`<p>` 使用说明（点卡片展开；打开满 10 张有小庆祝；点三个深潜入口可跳章）+ `<h3>已探索 <span id="explored-count">已探索 0/10</span>`（如用独立 span 则文本直接是 `0/10`，注意与用例正则兼容；推荐 `#explored-count` 文本为 `已探索 0/10` 整串）→ `#concept-map`（CSS grid，10 张 `.concept` 卡）。
每卡文案按设计稿 §5 十概念列表：名称中英对照（如「Token 词元」「上下文 Context」「Prompt 提示词」「Function Calling / Tool 工具调用」「RAG 检索增强」「微调 Fine-tuning」「Agent 智能体」「多 Agent Multi-Agent」「MCP」「Skills」），四段分别：是什么（一句话人话定义）/ 比喻（乐高块、工作台、工单、手、开卷考试参考书（含 embedding 一句话）、回炉进修、实习生、团队、USB-C 插座、员工手册）/ 迷你例子 / 常见误区。口诀节：`.jingle`（`data-jingle="ch2"`，一句话串 10 概念——文案自拟但需覆盖 10 概念，任务 10 将复用同一文案）+ 备注“第 7 章还会见到它”。`remember` 节按设计稿。`sec-nav` 本章末尾。
CSS：`.concept` 卡片样式（复用 `.card` 基调）；`.concept-body` 用 `max-height/opacity` 过渡（不用 display:none）；`.concept.open` 展开；`.concept.explored` 加边框高亮 + 小角标；`#concept-map.map-complete` 触发庆祝 keyframes（卡片依次脉冲发光一次 + 计数条星光）。
JS（`/* @@JS:FEATURES@@ */` 前）：点击 `.concept-head` 切换 `.open`；首次打开时加 `.explored` 并更新 `#explored-count`（文字 `已探索 ${n}/10`）；n===10 时给 `#concept-map` 加 `.map-complete`。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：截图概念地图初始态与展开态；`browser.console` 无 error。

- [ ] **Step 6: 提交**：`git commit -am "feat: chapter 2 concept map with explore counter"`

### Task 4: 第 2 章微演示组一（Token / 上下文 / Prompt / Function Calling）

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: `.demo-zone[data-zone]` 占位、`registerDemo/until/ok`。
- Produces: 四个演示根 `[data-demo="token"|"context"|"prompt"|"fc"]` 及类约定：
  - token：`.sentence`（原句）、`.chip`（乐高块）、末尾 `.token-note`；
  - context：`.desk`（` .desk-item` 桌面条目）、`.desk-warn`（“该清一清了”）；
  - prompt：根类 `mode-lazy`/`mode-good` 切换、`.out-lazy`/`.out-good` 两个输出块；
  - fc：`.fc-step`（×3：说/做/回填）、`.fc-result`。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch2/token 微演示', async () => {
  const card = document.querySelector('.concept[data-concept="token"] .concept-head');
  card.click(); // 展开
  const d = document.querySelector('[data-demo="token"]');
  const start = d.querySelector('[data-start]');
  start.click(); start.click(); // 连点防重入
  await until(() => window.__demos.token.running === false, 30000);
  ok(d.querySelectorAll('.chip').length === 6, '切块结果恰好 6 块（连点不叠加）');
  d.querySelector('[data-again]').click();
  ok(d.querySelectorAll('.chip').length === 0, '重来清空');
});
SELFTEST('ch2/上下文微演示', async () => {
  document.querySelector('.concept[data-concept="context"] .concept-head').click();
  const d = document.querySelector('[data-demo="context"]');
  const start = d.querySelector('[data-start]');
  start.click(); start.click(); start.click();
  await until(() => d.querySelectorAll('.desk-item').length === 3, 8000);
  ok(true, '三次点击累积 3 条');
  while (d.querySelectorAll('.desk-item').length < 5) { start.click(); await until(() => window.__demos.context.running === false, 8000); }
  ok(d.querySelector('.desk-warn').classList.contains('on'), '第 5 条出现“该清一清了”提示');
  d.querySelector('[data-again]').click();
  ok(d.querySelectorAll('.desk-item').length === 0, '重来清空');
});
SELFTEST('ch2/prompt 微演示', async () => {
  document.querySelector('.concept[data-concept="prompt"] .concept-head').click();
  const d = document.querySelector('[data-demo="prompt"]');
  ok(d.classList.contains('mode-lazy'), '初始为敷衍提问');
  d.querySelector('[data-case="good"]').click();
  ok(d.classList.contains('mode-good') && d.querySelector('.out-good').classList.contains('on'), '切到好工单并显示其输出');
  ok(!d.querySelector('.out-lazy').classList.contains('on'), '敷衍输出隐藏');
  d.querySelector('[data-again]').click();
  ok(d.classList.contains('mode-lazy'), '重来复位');
});
SELFTEST('ch2/function calling 微演示', async () => {
  document.querySelector('.concept[data-concept="function-calling"] .concept-head').click();
  const d = document.querySelector('[data-demo="fc"]');
  d.querySelector('[data-start]').click();
  await until(() => window.__demos.fc.running === false, 30000);
  ok([...d.querySelectorAll('.fc-step')].every(s => s.classList.contains('on')), '三步全部点亮');
  ok(d.querySelector('.fc-result').classList.contains('on'), '结果回填显示');
  d.querySelector('[data-again]').click();
  ok([...d.querySelectorAll('.fc-step')].every(s => !s.classList.contains('on')), '重来复位三步');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**（每个 `.demo-zone[data-zone=x]` 内替换为 `<div class="demo" data-demo="x">` 完整结构 + `registerDemo('x', …)` 于 FEATURES 区）

固定脚本（文案与数据必须一致，测试依赖计数）：
- **token**：原句 `.sentence` 显示 `我喜欢学习大模型`；点开始后逐个蹦出 6 个 `.chip`：`我`/`喜欢`/`学`/`习`/`大`/`模型`（每块带发光、轻微弹跳，块间有切分微动画），末尾 `.token-note`：`AI 眼里没有“字”，只有一块块 Token——计费和上下文都按它算。` 重来清空。
- **context**：`[data-start]` 按钮文案「继续聊」；每次点击向 `.desk` 追加 1 条 `.desk-item`（聊天条，如「用户：帮我改简历」「AI：好，先看目标岗位……」「用户：改成技术岗」……共 6 条固定文案数组），第 5 条时 `.desk-warn` 加 `.on`（提示「桌面快满了——这就是上下文窗口，满了就该清一清/总结一下」）；重来清空、warn 复位。
- **prompt**：两个切换按钮 `[data-case="lazy"]`（「敷衍提问」）/ `[data-case="good"]`（「好工单」）；`.out-lazy`（如“帮我写点东西”→ 输出泛泛）与 `.out-good`（任务/背景/格式三要素的工单 → 输出具体）；根类 `mode-lazy`/`mode-good` 控制显隐（`.on`）；重来回 `mode-lazy`。
- **fc**：`[data-start]` 文案「查天气」；三步 `.fc-step`：①「AI 说：我需要调用查天气工具」→ ②「工具执行：上海 · 晴 · 26°C」→ ③「结果回填：AI 拿到数据，继续回答」；每步 ~700ms 依次加 `.on`；`.fc-result` 显示「今天上海晴，26 度，适合出去走走。」；`start()` 返回 Promise；重来全部复位。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：逐个展开四张卡并截图；`browser.console` 无 error。

- [ ] **Step 6: 提交**：`git commit -am "feat: ch2 micro-demos batch 1 (token, context, prompt, function calling)"`

### Task 5: 第 2 章微演示组二（RAG / 微调 / 多 Agent）+ 口诀与庆祝收尾

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: `.demo-zone` 占位、约定接口。
- Produces: `[data-demo="rag"|"finetune"|"multi"]`；类约定：rag→`.shelf`（`.book` ×5、`.book.pulled`、`.rag-answer`）；finetune→`[data-mode="rag"|"finetune"]` 按钮、`.ft-stage`（根类 `mode-rag`/`mode-finetune`）、`.ft-desc`；multi→`.worker` ×3、`.merge-result`。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch2/rag 微演示', async () => {
  document.querySelector('.concept[data-concept="rag"] .concept-head').click();
  const d = document.querySelector('[data-demo="rag"]');
  d.querySelector('[data-start]').click();
  await until(() => window.__demos.rag.running === false, 30000);
  ok(d.querySelectorAll('.book.pulled').length === 1, '恰好抽出 1 本资料');
  ok(d.querySelector('.rag-answer').classList.contains('on'), '显示带出处的回答');
  d.querySelector('[data-again]').click();
  ok(d.querySelectorAll('.book.pulled').length === 0, '重来复位');
});
SELFTEST('ch2/微调微演示', async () => {
  document.querySelector('.concept[data-concept="finetuning"] .concept-head').click();
  const d = document.querySelector('[data-demo="finetune"]');
  d.querySelector('[data-mode="finetune"]').click();
  ok(d.classList.contains('mode-finetune'), '切到回炉进修画面');
  ok(/回炉/.test(d.querySelector('.ft-desc').textContent), '描述随模式变化');
  d.querySelector('[data-mode="rag"]').click();
  ok(d.classList.contains('mode-rag'), '切回开卷考试画面');
});
SELFTEST('ch2/多 Agent 微演示', async () => {
  document.querySelector('.concept[data-concept="multi-agent"] .concept-head').click();
  const d = document.querySelector('[data-demo="multi"]');
  d.querySelector('[data-start]').click();
  await until(() => window.__demos.multi.running === false, 40000);
  ok([...d.querySelectorAll('.worker')].every(w => w.classList.contains('done')), '三个小人全部完成');
  ok(d.querySelector('.merge-result').classList.contains('on'), '结果汇总显示');
  d.querySelector('[data-again]').click();
  ok([...d.querySelectorAll('.worker')].every(w => !w.classList.contains('done')), '重来复位');
});
SELFTEST('ch2/口诀一致性', async () => {
  const j = document.querySelector('[data-jingle="ch2"]');
  ok(!!j && j.textContent.trim().length >= 20, '存在口诀（≥20 字）');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**

- **rag**：`.shelf` 放 5 本 `.book`（书名如《公司产品手册》《年度财报》《项目复盘》…）；点「提问」（`[data-start]`）→ 书架发光、最相关一本加 `.pulled`（抽出并翻页微动画）→ `.rag-answer` 显示回答 + 出处小字「资料来源：《项目复盘》第 3 节」；旁注一句话解释 embedding：「先把问题变成『意思坐标』，再去书架里找坐标最近的资料」。重来归位。
- **finetune**：两个模式按钮；`mode-rag` 画面=书架+参考书（开卷考试：带着资料答题，资料拿走就没了）；`mode-finetune` 画面=炉火+大脑（回炉进修：知识炼进模型本身，不再需要带书，但花时间花成本）；`.ft-desc` 文案随模式切换（含「开卷」「回炉进修」字样）；重来回 `mode-rag`。
- **multi**：三个 `.worker`（表格员/设计员/校对员），点「分派任务」→ 依次各干一摊（各自小进度条/勾）→ `done` → `.merge-result` 汇总「三个人各干一摊，合成一份完整 PPT」；场景文案自拟但保持角色固定；重来复位。
- 口诀节补齐：把 Task 3 的 `.jingle[data-jingle="ch2"]` 文案定稿（一次写死，任务 10 复制同一文案到 ch7）；建议节奏示例（可润色，但须覆盖 10 概念）：`乐高块切碎语言，工作台堆满记忆；工单写清需求，双手调起工具；开卷翻书查资料，回炉进修变本能；插座一插全都通，手册在手全都会；实习生自己转圈，团队分工把活干完。`

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：三个演示逐个截图；口诀节截图；console 无 error。

- [ ] **Step 6: 提交**：`git commit -am "feat: ch2 micro-demos batch 2 (rag, finetuning, multi-agent) and jingle"`

### Task 6: 第 3 章 · Agent 智能体（循环图 + 任务步进机）

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: 约定接口。
- Produces: `#ch3`；`.loop`（`.loop-node` ×4：想/做/看/循环）；`[data-demo="agent-step"]`：`[data-start]`（走一步）、`[data-again]`（重来）、`.step-log`（行 `.log-row`）、`.task-done`、`.mistake` 误区卡。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch3/结构与循环图', async () => {
  const ch = document.querySelector('#ch3');
  ok(!!ch, '存在 #ch3');
  ok(!!ch.querySelector('.remember'), '含「记住这个」');
  ok(/ReAct/.test(ch.innerText), '提 ReAct');
  ok(ch.querySelectorAll('.loop-node').length === 4, '循环图 4 节点（想/做/看/循环）');
  ok(!!ch.querySelector('.mistake'), '含误区卡');
  await until(async () => { ch.scrollIntoView(); return true; }, 2000);
});
SELFTEST('ch3/步进机', async () => {
  const ch = document.querySelector('#ch3');
  ch.scrollIntoView();
  const d = ch.querySelector('[data-demo="agent-step"]');
  const start = d.querySelector('[data-start]');
  start.click(); start.click(); // 连点防重入
  await until(() => window.__demos['agent-step'].running === false, 10000);
  ok(d.querySelectorAll('.log-row').length === 1, '连点只走一步');
  for (let i = 0; i < 5; i++) { start.click(); await until(() => window.__demos['agent-step'].running === false, 10000); }
  ok(d.querySelectorAll('.log-row').length === 6, '全程共 6 步');
  ok(d.querySelector('.task-done').classList.contains('on'), '完成态出现「✅ 出票成功」');
  d.querySelector('[data-again]').click();
  ok(d.querySelectorAll('.log-row').length === 0, '重来清空日志');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**

- DOM：`#ch3`（标题「第 3 章 · Agent 智能体」chip「约 8 分钟」）4–5 节：核心（定义与对比：Chatbot 问答机 vs Agent 办事员；公式 `Agent = 模型（大脑）+ 工具（手脚）+ 循环（想→做→看→再想）`）、循环图插画节（`.loop` 四节点环形排布，节点间 `.loop-arrow` 带「连线生长」动画；点节点高亮）、互动演示节（任务步进机）、误区节（`.mistake` 卡：Agent ≠ 更聪明的模型；Agent = 模型 + 脚手架）、记住这个（「大脑 + 手脚 + 自己转圈，直到把事情办完」）。
- 步进机固定脚本（6 步，文案必须与此对应，测试依赖步数）：①想：拆解需求「订去北京的票」→ ②做：调用「查车次」工具 → ③看：拿到 3 个车次结果 → ④想：选早班、准备下单 → ⑤做：调用「下单」工具 → ⑥看：出票成功。每步 ~450ms：对应 `.loop-node` 高亮流转 + `.step-log` 追加一 `.log-row`（形如 `[想] 拆解需求：订票`）；按钮连点重入保护；6 步后 `.task-done` 加 `.on` 显示「✅ 出票成功——从头到尾，只给了一个目标」；重来全复位。旁注：想（Reason）+ 做（Act）就是 ReAct 的直觉。
- CSS：SF 循环图连线生长（`stroke-dashoffset` 类动画或 width 过渡）、高亮呼吸。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：循环图与步进机运行前后截图各一张；console 无 error；按 `→` 从 ch2 到 ch3 顺畅。

- [ ] **Step 6: 提交**：`git commit -am "feat: chapter 3 agent with step machine demo"`

### Task 7: 第 4 章 · MCP（连线爆炸 + 数据流 + 事实卡）

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: 约定接口。
- Produces: `#ch4`；`[data-demo="mcp-lines"]`：内联 SVG（`.wires-before line` ×20、`.wires-after line` ×9、`.hub`）；根类 `mcp-on`；`.flow`（`.flow-node` ×3：Host/Client/Server）；`.facts`（`.fact` ≥5 张事实小卡）。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch4/MCP 连线爆炸', async () => {
  const ch = document.querySelector('#ch4'); ch.scrollIntoView();
  ok(/USB-C/.test(ch.innerText), '含 USB-C 比喻');
  ok(!!ch.querySelector('.remember'), '含「记住这个」');
  const d = ch.querySelector('[data-demo="mcp-lines"]');
  ok(d.querySelectorAll('.wires-before line').length === 20, '乱麻 20 根线（4 应用 × 5 工具）');
  ok(d.querySelectorAll('.wires-after line').length === 9, '星形 9 根线（4+5）');
  d.querySelector('[data-start]').click();
  await until(() => d.classList.contains('mcp-on'), 3000);
  ok(d.classList.contains('mcp-on'), '装上 MCP 后切换形态');
  d.querySelector('[data-again]').click();
  ok(!d.classList.contains('mcp-on'), '重来回到乱麻');
});
SELFTEST('ch4/数据流与事实卡', async () => {
  const ch = document.querySelector('#ch4');
  ok(ch.querySelectorAll('.flow-node').length === 3, 'Host/Client/Server 三节点');
  ok(ch.querySelectorAll('.fact').length >= 5, '≥5 张事实卡');
  const t = ch.innerText;
  ok(/2024/.test(t) && /Anthropic/.test(t), '含 2024 Anthropic 发布');
  ok(/Linux 基金会/.test(t) && /Agentic AI Foundation/.test(t), '含捐给基金会');
  ok(/无状态/.test(t), '含 2026-07 无状态规格');
  ok(/4 万/.test(t), '含注册表约 4 万服务器');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**

- 开篇问题节：M 个 AI 应用 × N 个工具 = 定制接口爆炸（配小图：左边 4 个应用、右边 5 个工具，线乱作一团——静态预演）。
- 演示节：`[data-demo="mcp-lines"]` 用一块内联 SVG（viewBox 固定，左右两列节点：应用列「ChatGPT / Claude / Copilot / Cursor」、工具列「邮箱 / 日历 / 数据库 / GitHub / 文件」）。`wires-before`：20 条交叉细线（灰紫、低透明），`wires-after`：中心 `.hub` 圆（发光「MCP」）+ 9 条线（4 应用→hub、hub→5 工具），初始隐藏。点 `[data-start]`（「装上 MCP」）→ 根加 `mcp-on`：乱麻淡出、hub 缩放浮现、9 条线以 `stroke-dashoffset` 生长；文案条切换「20 根定制线 → 9 根标准线：M+N」。重来复位。
- 数据流节：`.flow` 三节点 Host（你用的应用）→ Client（翻译官）→ Server（工具方）水平排列 + 流动虚线动画 + 每节点一句话人话解释。
- 事实卡节：`.facts` 列 6 张 `.fact`（2024-11-25 Anthropic 发布 / OpenAI 2025-03、Google 2025-04、微软 2025-05 采用 / 2025-12-09 捐给 Linux 基金会旗下 Agentic AI Foundation / 官方注册表约 4 万服务器 / 2026-07-28 规格改为无状态 / 2026-01 MCP Apps 扩展 + 上下文成本 5.5 万 token 的“为什么要精简”注记）。
- 误区节：MCP 不是模型、不是 AI 本身，是接口标准（USB-C 不生产电器）；记住这个：「MCP = AI 世界的 USB-C」。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：连线动画前后截图对比；console 无 error。

- [ ] **Step 6: 提交**：`git commit -am "feat: chapter 4 mcp with wire-explosion demo"`

### Task 8: 第 5 章 · Skills（三层书页 + 上下文计量 + 彩蛋）

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: 约定接口。
- Produces: `#ch5`；`[data-demo="skill-layers"]`：`.layer` ×3（`.layer-meta`/`.layer-body`/`.layer-res`，展开时加 `.open`）、`#skill-meter`（文本 `≈ 100 token` 格式的数字随层变化）、`[data-start]`=翻开手册、`.script-note`；`.vs`（Prompt vs Skill 两栏对比）；`.egg`（彩蛋卡）。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch5/三层渐进披露', async () => {
  const ch = document.querySelector('#ch5'); ch.scrollIntoView();
  ok(/SKILL\.md/.test(ch.innerText) && /渐进式披露/.test(ch.innerText), '含 SKILL.md 与渐进式披露');
  ok(!!ch.querySelector('.remember') && !!ch.querySelector('.egg'), '含记住这个与彩蛋');
  const d = ch.querySelector('[data-demo="skill-layers"]');
  const start = d.querySelector('[data-start]');
  ok(d.querySelectorAll('.layer.open').length === 1, '初始只开元数据层');
  ok(d.querySelector('#skill-meter').textContent.includes('100'), '初始计量 ≈100 token');
  start.click();
  await until(() => d.querySelectorAll('.layer.open').length === 2, 3000);
  ok(d.querySelector('#skill-meter').textContent.includes('4,000'), '翻开正文后 ≈4,000');
  start.click();
  await until(() => d.querySelectorAll('.layer.open').length === 3, 3000);
  ok(d.querySelector('#skill-meter').textContent.includes('4,400'), '资源展开后 ≈4,400');
  ok(d.querySelector('.script-note').classList.contains('on'), '出现“脚本只有输出进上下文”说明');
  d.querySelector('[data-again]').click();
  ok(d.querySelectorAll('.layer.open').length === 1 && d.querySelector('#skill-meter').textContent.includes('100'), '重来复位');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**

- 开篇问题节：每次都要重复教 AI 同样的做法？提示词写一遍只能用一次（配“重复唠叨”小插画）。
- 三层书页节：`[data-demo="skill-layers"]` 一本手册三层（层叠书页样式）：①`.layer-meta` 常驻层（名字+一句描述，`≈ 100 token`）；②`.layer-body` 正文层（步骤说明，翻开后计量跳到 `≈ 4,000 token`）；③`.layer-res` 资源与脚本层（大附件/脚本，翻开后 `≈ 4,400 token`，并显示 `.script-note`「脚本运行时，只有它的输出进上下文——本体根本不占地方」）。点「翻开手册」依次揭开三层（每层 ~600ms 上翻动画，计量数字滚动过渡）；第三层后按钮禁用态；重来复位。旁注强调：`description` 决定“我什么时候该用它”。
- 对比节 `.vs`：Prompt=一次性口头交代（说了就没了）vs Skill=写进员工手册（谁都能翻、随用随取）。
- 彩蛋节 `.egg`：你现在用的工具（OpenCode）里就跑着 Skills——本课件的制作过程本身就是演示（含 `SKILL.md` 代码小样：frontmatter `name`/`description` + 正文）。
- 记住这个：「Skills = 把经验写成手册，需要时自己翻」。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：三层逐层截图 + 计量数字截图；console 无 error。

- [ ] **Step 6: 提交**：`git commit -am "feat: chapter 5 skills with progressive disclosure demo"`

### Task 9: 第 6 章 · 实战串联（流程图逐步点亮）

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: 约定接口。
- Produces: `#ch6`；`[data-demo="journey"]`：`.j-node` ×8（前 7 个带 `data-concept`：`prompt, agent, skills, mcp, function-calling, rag, multi-agent`，第 8 个为 `.j-end`「交付」）、点亮态 `.lit`、`[data-start]`=下一步、`.finale-line`（收束句）。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch6/实战串联', async () => {
  const ch = document.querySelector('#ch6'); ch.scrollIntoView();
  const d = ch.querySelector('[data-demo="journey"]');
  ok(d.querySelectorAll('.j-node').length === 8, '8 个环节节点');
  const t = ch.innerText;
  ['Token', '上下文', 'Prompt', 'Function Calling', 'RAG', '微调', 'Agent', '多 Agent', 'MCP', 'Skills'].forEach(k => ok(t.includes(k), `全文提及 ${k}`));
  const start = d.querySelector('[data-start]');
  start.click(); await until(() => window.__demos.journey.running === false, 8000);
  ok(d.querySelectorAll('.j-node.lit').length === 1, '第一步点亮 1 个节点');
  for (let i = 0; i < 7; i++) { start.click(); await until(() => window.__demos.journey.running === false, 8000); }
  ok(d.querySelectorAll('.j-node.lit').length === 8, '8 步全部点亮');
  ok(d.querySelector('.finale-line').classList.contains('on'), '收束句出现');
  d.querySelector('[data-again]').click();
  ok(d.querySelectorAll('.j-node.lit').length === 0, '重来复位');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**

- 场景节：旁白式引入——用 AI 把「季度工作总结」变成一份 PPT，全程只说了几句话。
- 流程图节 `[data-demo="journey"]`：8 个 `.j-node` 横向流（可换行）依次：`Prompt 提需求` → `Agent 接单` → `触发 PPT Skills(渐进披露)` → `MCP 连上文件/表格/PPT 工具` → `Function Calling 循环（读数据→写大纲→生成→检查→修改）` → `缺知识时 RAG 翻资料` → `多 Agent 分工（表格员/设计员/校对员）` → `.j-end 交付`。每个节点可带小 `.chip` 标签点亮其上已学概念；点「下一步」点亮下一个（节点发光 + 连线生长 + 若有 data-concept 则该 chip 亮起）；8 步后 `.finale-line` 加 `.on`：「所有技术都是为了一件事——让 AI 从『会聊天』变成『能干活』」。旁注自然提及 Token 计费与上下文窗口、可选的微调场景（如“模型总学不会你们公司的黑话，可以考虑微调”），确保文眼检查通过。重来复位。
- 记住这个：完整链条口诀（自拟一句）。
- Note：本任务的用例需要 `#ch5` 已存在（上一步）；若并行执行请注意顺序（本计划为顺序任务）。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：走完 8 步截图；console 无 error。

- [ ] **Step 6: 提交**：`git commit -am "feat: chapter 6 end-to-end journey demo"`

### Task 10: 第 7 章上 · 星系图 + 顺口溜

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: ch2 的 `.jingle[data-jingle="ch2"]` 文案（必须完全复用）。
- Produces: `#ch7`；`#starmap`（中心 `.star-core` 大脑 + `.star[data-concept]` ×10 + `.star-tip` 提示层）；`.jingle[data-jingle="ch7"]`。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch7/星系图', async () => {
  const ch = document.querySelector('#ch7'); ch.scrollIntoView();
  const map = ch.querySelector('#starmap');
  ok(!!map.querySelector('.star-core'), '中心大脑存在');
  const stars = [...map.querySelectorAll('.star[data-concept]')];
  ok(stars.length === 10, '10 颗星');
  const ids = stars.map(s => s.dataset.concept).sort().join(',');
  ok(ids === [...window.__CONCEPTS].sort().join(','), '星图概念枚举一致');
  stars[0].click();
  ok(stars[0].classList.contains('active'), '点星高亮');
  ok(ch.querySelector('.star-tip').classList.contains('on'), '比喻提示出现');
});
SELFTEST('ch7/顺口溜两处一致', async () => {
  const a = document.querySelector('[data-jingle="ch2"]').textContent.replace(/\s+/g, '');
  const b = document.querySelector('[data-jingle="ch7"]').textContent.replace(/\s+/g, '');
  ok(a.length >= 20 && a === b, 'ch2 与 ch7 口诀文字一致');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**

- `#ch7`（标题「第 7 章 · 记忆加固」chip「约 5 分钟」）先落 2 节：总结大图节 + 顺口溜节（测验与完结在任务 11）。
- `#starmap`：CSS/SVG 星图——中心 `.star-core`（发光大脑）四周环绕 10 颗 `.star[data-concept]`（每星含图标感文字：乐高块/工作台/工单/手/参考书/回炉/插座/手册/实习生/团队 + 名词），星星缓慢呼吸；点击某星 → 该星 `.active`，`.star-tip` 显示其“比喻一句话”（如 token：「乐高块：AI 眼里的最小文字积木」）。10 星按设计稿记忆系统文案。
- 顺口溜节：`.jingle[data-jingle="ch7"]` **逐字复用** ch2 已定稿文案（复制粘贴，不要改动任何字），配逐句高亮小动画（可点击/悬停某句放大）。
- 记住这个已在本章并入顺口溜节文案。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：星图截图 + 点星提示截图 + 顺口溜截图；console 无 error。

- [ ] **Step 6: 提交**：`git commit -am "feat: chapter 7 starmap and jingle"`

### Task 11: 第 7 章下 · 10 题测验 + 霓虹粒子庆祝 + 完结彩蛋

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`

**Interfaces:**
- Consumes: 约定接口、`window.__CONCEPTS`。
- Produces: `#quiz`（`.quiz-item[data-concept]` ×10，各含 `.q`、`button.opt` ×4（其一 `[data-correct]`）、`.quiz-hint`）；`#quiz-score`（文本格式 `答对 x/10`）；`#quiz-again`（重来）；`#quiz-result`（含 `.burst`，粒子 `<span>` 共 24 个）；`#ending`。

- [ ] **Step 1: 追加用例（红）**

```js
SELFTEST('ch7/测验结构', async () => {
  const ch = document.querySelector('#ch7'); ch.scrollIntoView();
  const items = [...document.querySelectorAll('#quiz .quiz-item')];
  ok(items.length === 10, '10 道题');
  const ids = items.map(i => i.dataset.concept).sort().join(',');
  ok(ids === [...window.__CONCEPTS].sort().join(','), '每概念恰好 1 题');
  items.forEach((it, i) => {
    ok(it.querySelectorAll('button.opt').length === 4, `第 ${i + 1} 题 4 选项`);
    ok(it.querySelectorAll('[data-correct]').length === 1, `第 ${i + 1} 题恰好 1 个正确项`);
  });
  ok(document.querySelector('#quiz-score').textContent.includes('0/10'), '初始计分 0/10');
});
SELFTEST('ch7/测验流程与庆祝', async () => {
  const items = [...document.querySelectorAll('#quiz .quiz-item')];
  const q1 = items[0];
  const wrong = [...q1.querySelectorAll('button.opt')].find(b => !b.hasAttribute('data-correct'));
  wrong.click();
  ok(wrong.classList.contains('wrong'), '答错标记错误');
  ok(q1.querySelector('.quiz-hint').classList.contains('on'), '答错出现提示');
  q1.querySelector('[data-correct]').click();
  ok(q1.classList.contains('solved'), '答对后题目锁定');
  for (const it of items.slice(1)) { it.querySelector('[data-correct]').click(); }
  await until(() => document.querySelector('#quiz-result').classList.contains('on'), 4000);
  ok(document.querySelector('#quiz-score').textContent.includes('10/10'), '满分 10/10');
  ok(document.querySelectorAll('#quiz-result .burst span').length === 24, '24 颗霓虹粒子庆祝');
  ok(!!document.querySelector('#ending') && /通关/.test(document.querySelector('#ending').innerText), '完结彩蛋出现');
  document.querySelector('#quiz-again').click();
  ok(!document.querySelector('#quiz-result').classList.contains('on') && !items[0].classList.contains('solved'), '重来复位测验');
});
SELFTEST('ch7/空格不误翻节（焦点在按钮上）', async () => {
  const ch = document.querySelector('#ch7'); ch.scrollIntoView();
  const btn = document.querySelector('#quiz .quiz-item button.opt');
  btn.focus();
  const y0 = window.scrollY;
  window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
  await new Promise(r => setTimeout(r, 400));
  ok(Math.abs(window.scrollY - y0) < 200, '空格未触发翻节');
});
```

- [ ] **Step 2: 跑自检确认红。**

- [ ] **Step 3: 实现**

- 测验节：`#quiz` 于 ch7 内新增节 `data-title="互动测验"`。10 题，`data-concept` 按 `window.__CONCEPTS` 顺序各一题；题干与选项文案自拟（须与正文口径一致），每题 4 选项、恰 1 个 `[data-correct]`；答错：该选项 `.wrong` + `.quiz-hint` 加 `.on` 给一句提示（仍可重试）；答对：题目加 `.solved`（选项锁定、正确项发光）、`#quiz-score` 更新 `答对 x/10`。
- 计分与庆祝：全部答对 → `#quiz-result` 加 `.on`，显示分数 + 鼓励语 + `.burst` 内 24 个 `<span>` 霓虹粒子（CSS 随机方向飞散动画）；`#quiz-again`（重来）清空全部状态与粒子。
- 完结彩蛋 `#ending`（ch7 末节 `data-title="完结"`）：一句“已通关”宣言（文本须含「通关」二字）+ 点击回到封面按钮（`__nav.goTo(0)`）+ 把 10 个比喻再列一遍的小卡片墙（复用文案，纯展示）。
- 说明：`.quiz-item` 的 `data-concept` 顺序按 `__CONCEPTS`，自检以集合比较，不依赖顺序。

- [ ] **Step 4: 跑自检到绿 + 跑打包检查。**

- [ ] **Step 5: 目视验证**：答对/答错/满分三种状态截图；console 无 error。

- [ ] **Step 6: 提交**：`git commit -am "feat: ch7 quiz with particle celebration and ending"`

### Task 12: 全篇打磨（reduced-motion / 响应式 / file:// 验证 / 体积 / README / 终验）

**Files:**
- Modify: `E:\opencode\llm-courseware\index.html`
- Create: `E:\opencode\llm-courseware\README.md`
- Modify: `E:\opencode\llm-courseware\tests\check.cjs`（追加最终文眼与体积断言）

**Interfaces:**
- Consumes: 全部既有接口。
- Produces: 交付终态；无新接口。

- [ ] **Step 1: 追加最终用例（红/绿视情况）并补 check.cjs**

自检追加（`/* @@JS:SELFTEST@@ */`）：

```js
SELFTEST('final/文眼清单', async () => {
  const t = document.body.innerText;
  ['文字接龙', '幻觉', '乐高', '工作台', '员工手册', '实习生', '开卷考试', '回炉进修', 'USB-C', 'SKILL.md', '渐进式披露', '100 token', 'ReAct', 'Agentic AI Foundation', '无状态', '5.5 万 token', '4 万'].forEach(k => ok(t.includes(k), `文眼：${k}`));
});
SELFTEST('final/演示规范（重来按钮与注册）', async () => {
  const demos = [...document.querySelectorAll('[data-demo]')];
  ok(demos.length >= 8, '演示数 ≥8');
  demos.forEach(d => ok(!!d.querySelector('[data-again]'), `${d.dataset.demo} 有重来`));
  demos.filter(d => d.querySelector('[data-start]')).forEach(d => ok(!!window.__demos[d.dataset.demo], `${d.dataset.demo} 已注册`));
});
SELFTEST('final/进度与目录响应 resize', async () => {
  window.dispatchEvent(new Event('resize'));
  await new Promise(r => setTimeout(r, 300));
  const nodes = [...document.querySelectorAll('#progress-nodes .node')];
  ok(nodes.length >= 8, '进度条 ≥8 个章节节点（封面+7 章）');
  ok(nodes.every(n => n.offsetLeft >= 0), '节点有位置');
  ok(document.documentElement.scrollWidth <= window.innerWidth + 1, '无横向滚动');
});
```

check.cjs 追加（`exists` 分支内）：

```js
chk('文眼「5.5 万 token」', html.includes('5.5 万 token'));
chk('文眼「渐进式披露」', html.includes('渐进式披露'));
chk('测验 10 题标记', (html.match(/data-concept=/g) || []).length >= 30);
```

- [ ] **Step 2: 加打磨样式（插在 `/* @@STYLE:CHAPTERS@@ */` 前）**

- `@media (prefers-reduced-motion: reduce)`：关闭长动画与粒子（`animation-duration:.01ms; transition-duration:.01ms`）。
- `@media (max-width:1100px)` 与 `(max-width:820px)`：网格收列、字号微调、SVG 弹性宽、`#concept-map`/星图/流程图改单列或纵向。

- [ ] **Step 3: 跑全部验证**

1. `node tests/check.cjs` → 全 PASS；
2. 自检（reload `#selftest`）→ `{"fail":0}`；重点确认 final/* 三组与 ch7/* 全绿；
3. `browser.console` 无 error、无 warn 中可修项；
4. 全篇通读脚本：`Home` → 连续 `→` 走完全篇 12+ 节，观察 scrollspy/进度条/章节节点无异常；目录抽屉逐章展开跳节；
5. `file://` 验证：`browser.tabs.open("file:///E:/opencode/llm-courseware/index.html")` → 页面正常、演示可玩、console 无 error（若浏览器工具拒绝 file://，则记录改用人工步骤：资源管理器双击 index.html；并在 README 写明）；
6. 体积：`node -e "console.log(require('fs').statSync('index.html').size)"` → 期望 < 1MB；
7. 截图终版封面/ch2/ch7 各一张。

- [ ] **Step 4: 写 README.md（内容三段）**

1. 怎么打开：双击 `index.html`（任何现代 Chrome/Edge，离线可用）；
2. 怎么讲演：右上角 ⛶ 全屏；`←`/`→`（或空格/PageUp/PageDown）翻节；`Home` 回封面；目录按钮跳章；每个演示都有「重来」便于现场重演；
3. 怎么改：单文件编辑 `index.html`；自检模式：地址栏 URL 末尾加 `#selftest`；改完跑 `node tests/check.cjs`。

- [ ] **Step 5: 提交**

```powershell
git add -A; git commit -m "chore: polish, responsive, reduced-motion, readme, final verification"
```

- [ ] **Step 6: 终验快照（写入提交说明或完成报告）**

记录：check.cjs 输出、`__selftest.summary()` 完整结果、file:// 验证结论、文件体积、终版截图路径。

---

## 计划自审记录（写计划后自查）

- **Spec 覆盖**：设计稿 §4 视觉（任务 1/2 起全程）§5 七章（任务 2–11）§6 记忆系统（任务 3/5/10 计数+口诀、任务 11 测验、各章 remember）§7 事实（任务 7 事实卡 + 任务 12 文眼）§8 技术（约束 1/2/10）§9 交付（任务 12）§10 自由项（动画参数/题面/口诀交由实现者，本计划给出计数与覆盖约束）。无遗漏。
- **类型/命名一致性**：`data-demo` 名：`chain, token, context, prompt, fc, rag, finetune, multi, agent-step, mcp-lines, skill-layers, journey`（≥12，任务 12 断言 ≥8 有裕量）；`__CONCEPTS` 单一来源；`data-jingle` 两处一致由自检强制。
- **Review Focus 映射**：①连点→任务 4（token）与任务 6（步进机）；②按钮聚焦空格→任务 11；③resize→任务 12；④file://→任务 12；⑤窄屏→任务 12（scrollWidth 断言）。
- **比例**：本计划不含成段产品代码，只含测试代码与接口约定；文长为设计稿的合理倍数内（以接口与断言为主）。

## 执行方式（Execution Handoff）

- 若走 **subagent-driven**：每任务一个子代理实现 + 独立复核再下一个（本计划任务间共享同一文件与约定，已按顺序设计）。
- 若走 **native**：主会话按任务顺序直接实现（推荐；单文件强耦合、串行依赖多，单线执行保风格一致，最后由独立 reviewer 全篇复核）。
- 无论哪种：每任务结束时三件套必须全绿（check.cjs、`#selftest` 对应用例、目视截图），再进入下一任务。
