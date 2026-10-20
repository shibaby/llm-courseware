# 大模型技术概念

用 10 个比喻，把大模型从 Token 到 Agent 串成一条线。单文件、零依赖、离线可用的交互式 HTML 课件。

[![check](https://github.com/shibaby/llm-courseware/actions/workflows/check.yml/badge.svg)](https://github.com/shibaby/llm-courseware/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-22d3ee.svg)](LICENSE)

## 这是什么

一份可以直接投屏讲演、也可以自己翻着看的网页课件。它不堆定义，而是用一组前后呼应的比喻，把 10 个核心概念讲成一条完整的流水线：

`Token → 上下文 → Prompt → Function Calling → RAG → 微调 → Agent → 多 Agent → MCP → Skills`

适合内训、课堂分享、团队科普，或者作为大模型入门的第一份材料。

## 亮点

- **30 页，一屏一页**：没有滚动条，翻页节奏固定，适合投屏。
- **10 个概念，13 个互动演示**：文字接龙、工具调用、RAG 翻书、Agent 循环、MCP 连线、渐进披露、星图串联、10 题测验等。
- **单文件交付**：全部 HTML / CSS / JS 内联在 `index.html`，约 190 KB。
- **真正离线**：无外部样式、脚本、字体、图片或网络请求，双击即可打开。
- **讲演友好**：顶部显示章节与知识点，底部显示页码，支持目录抽屉、全屏和键盘翻页。
- **可验证**：页面内 33 条自检 + 18 项打包检查，GitHub Actions 自动运行。

## 在线体验

直接访问：<https://shibaby.github.io/llm-courseware/>

## 怎么打开

- 双击 `index.html`，用现代 Chrome / Edge 打开即可，不需要安装任何东西。
- 建议窗口宽度 ≥1024px；投影或全屏效果最佳。

## 怎么讲演

- 点右上角 **⛶** 进入全屏。
- **← / →**、**空格 / PageUp / PageDown** 翻页；**Home** 回封面；**Esc** 关闭目录。
- 点右上角 **目录** 展开 7 章，可直接跳到任意一节。
- 每页固定显示「章节 + 本节知识点」，底部显示「当前页 / 总页数」。
- 每个演示都有「重来」按钮；测验答错会给提示，答对自动切题，也可以手动上一题 / 下一题。

## 项目结构

```text
.
├── index.html                 # 课件本体（HTML + CSS + JS + 自检）
├── tests/
│   ├── check.cjs              # 零依赖打包检查
│   └── serve.cjs              # 本地静态服务（端口 8137）
├── docs/
│   └── design.md              # 设计稿与内容口径
├── .github/workflows/check.yml
├── LICENSE
└── README.md
```

## 本地开发与测试

```powershell
node tests/check.cjs
```

需要浏览器验证时：

```powershell
node tests/serve.cjs
# 打开 http://127.0.0.1:8137/
```

页面内自检：打开 `index.html#selftest`（加查询串可避免缓存，如 `index.html?v=1#selftest`）。

## 内容口径

- 内容基准时间为 2026-10；MCP 注册表规模、规范版本等以官方文档为准。
- Skills 上下文占用（约 100 / 4,000 / 4,400 token）为说明渐进式披露的**示例数字**，不是固定值。
- MCP 注册表 22,636 个活跃服务器为 2026-08 官方注册表全量盘点数据。

## 贡献

欢迎提 Issue 或 PR：修正事实、改进文案、补充演示都很好。提交前请先跑一遍 `node tests/check.cjs`。

## License

[MIT](LICENSE) © 2026 shibaby
