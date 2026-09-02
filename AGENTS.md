## 项目概述

Product Nav — 产品导航网站，采用 Apple 设计语言 + iOS 26 水晶玻璃质感（Glassmorphism）。支持管理员通过密码登录后台进行产品 CRUD 管理、自定义 JS/CSS/HTML 代码注入、以及背景图片与玻璃质感效果开关控制。

## 技术栈

- **前端**：纯静态 HTML + CSS + JavaScript（无框架）
- **设计**：iOS 26 水晶玻璃质感（Glassmorphism），Apple 设计风格
- **后端**：Cloudflare Pages Functions（Serverless）
- **存储**：Cloudflare KV（可选，本地降级到 localStorage）
- **认证**：Cloudflare 环境变量 `ADMIN_PASSWORD` 密码验证
- **包管理器**：pnpm
- **运行时**：Node.js 24
- **本地预览**：serve（静态服务器）

## 目录结构

```
/workspace/projects/
├── .coze                  # 项目配置（预览 + 部署）
├── AGENTS.md              # 本文件
├── DESIGN.md              # 设计文档
├── package.json           # 依赖配置
├── wrangler.toml          # Cloudflare Pages 配置
├── scripts/
│   ├── build.sh           # 构建脚本（安装依赖）
│   └── run.sh             # 启动脚本（serve static）
├── functions/             # Cloudflare Pages Functions
│   ├── _routes.json       # 路由配置
│   └── api/
│       ├── auth.js        # POST /api/auth — 登录验证
│       ├── products.js    # CRUD /api/products — 产品管理
│       └── custom.js      # GET/POST /api/custom — 自定义代码
└── public/                # 静态资源
    ├── index.html         # 首页 — 产品导航
    ├── css/
    │   └── style.css      # 玻璃质感样式
    ├── js/
    │   └── app.js         # 主应用逻辑
    └── admin/
        ├── login.html     # 管理员登录页
        └── index.html     # 管理后台（产品管理 + 自定义代码）
```

## 关键入口 / 核心模块

### 页面
- **首页 `/`**：产品展示网格，支持搜索和分类筛选，加载自定义代码
- **登录 `/admin/login.html`**：管理员密码登录
- **后台 `/admin/`**：产品管理（增删改查）+ 自定义代码编辑器（CSS/JS/HTML）+ 背景设置（图片 URL + 玻璃质感开关）

### API 端点（Cloudflare Pages Functions）
- `POST /api/auth` — 管理员登录验证，返回 token
- `GET /api/products` — 获取所有产品列表（公开）
- `POST /api/products` — 添加产品（需 auth）
- `PUT /api/products?id=xxx` — 更新产品（需 auth）
- `DELETE /api/products?id=xxx` — 删除产品（需 auth）
- `GET /api/custom` — 获取自定义代码（公开）
- `POST /api/custom` — 保存自定义代码（需 auth）

### 数据存储
- **Cloudflare KV（生产）**：`PRODUCTS_KV` 命名空间，存储 products / custom_css / custom_js / custom_html
- **localStorage（本地开发）**：自动降级到浏览器本地存储

## 运行与预览

- **预览类型**：Web 预览型项目 ✅
- **预览方式**：`serve` 静态服务器，端口 5000
- **启动命令**：`bash scripts/run.sh`
- **构建命令**：`bash scripts/build.sh`

### Cloudflare 部署准备

1. 在 Cloudflare Dashboard 中创建 KV 命名空间，绑定到 Pages Functions
2. 设置环境变量 `ADMIN_PASSWORD` 作为管理员密码
3. 部署方式：`npx wrangler pages deploy ./public`

## 用户偏好与长期约束

- 密码验证通过 Cloudflare 环境变量 `ADMIN_PASSWORD` 配置
- 本地开发时自动降级到 localStorage，无需 Cloudflare 环境
- 产品数据在本地开发时存储在 localStorage，部署后由 KV 持久化
- 自定义代码同样支持本地 localStorage 和 KV 双存储
- 背景设置（背景图片 URL + 玻璃质感开关）存储在 localStorage / KV，首页与管理后台同步生效

## 常见问题和预防

- **预览端口**：固定 5000，从 `.preview` 读取，禁止 hardcode
- **端口冲突**：启动前自动清理 5000 端口残留，绝不碰 9000
- **API 调用**：前端使用相对路径 `/api/...`，不硬编码域名
- **Token 过期**：登录 token 有效期 24 小时，过期需重新登录
- **本地开发**：没有 Cloudflare 环境时，所有 API 自动降级到 localStorage
- **本地登录密码**：默认 `admin123`，可在浏览器 localStorage 中设置 `admin_password` 覆盖
- **Cloudflare 登录问题**：确保环境变量名是 `ADMIN_PASSWORD`，设置后需重新部署才能生效
- **`_routes.json`**：位于 `public/` 目录，确保 `/api/*` 路由正确触发 Cloudflare Functions