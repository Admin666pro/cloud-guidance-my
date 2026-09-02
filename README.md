# Product Nav — 产品导航网站

一个采用 **iOS 26 水晶玻璃质感** 设计语言的产品导航站点，仿照 Apple 设计风格，支持管理员后台管理产品与自定义代码注入。

## 项目使命

为产品团队提供一个**优雅、可定制、易维护**的产品导航展示平台。让用户以 Apple 级别的视觉体验浏览产品，让管理员能通过简单的后台操作完成产品上架、下架、编辑与页面定制，无需任何开发知识。

---

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | 纯静态 HTML + CSS + JavaScript（无框架） |
| 设计 | iOS 26 水晶玻璃质感（Glassmorphism），Apple 设计风格 |
| 后端 | Cloudflare Pages Functions（Serverless） |
| 存储 | Cloudflare KV（生产） / localStorage（本地开发） |
| 认证 | Cloudflare 环境变量 `ADMIN_PASSWORD` |
| 本地预览 | serve（Node.js 静态服务器） |

---

## 目录结构

```
├── public/                  # 静态资源（部署根目录）
│   ├── index.html           # 首页 — 产品导航
│   ├── css/style.css        # 玻璃质感样式
│   ├── js/app.js            # 主应用逻辑
│   └── admin/
│       ├── login.html       # 管理员登录页
│       └── index.html       # 管理后台
├── functions/api/           # Cloudflare Pages Functions
│   ├── auth.js              # POST /api/auth — 登录验证
│   ├── products.js          # CRUD /api/products — 产品管理
│   └── custom.js            # GET/POST /api/custom — 自定义代码
├── scripts/
│   ├── build.sh             # 构建脚本
│   └── run.sh               # 本地预览脚本
├── .coze                    # 扣子项目配置
├── wrangler.toml            # Cloudflare Pages 配置
├── AGENTS.md                # AI 项目记忆
├── DESIGN.md                # 设计文档
└── README.md                # 本文件
```

---

## 本地构建与预览

### 前置要求

- Node.js 18+
- pnpm

### 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动本地预览（端口 5000）
bash scripts/run.sh
```

打开浏览器访问 `http://localhost:5000` 即可看到首页。

### 本地开发说明

- 本地开发时所有数据存储在浏览器的 **localStorage** 中，无需 Cloudflare 环境
- 管理员默认密码：`admin123`（部署到 Cloudflare 后需通过环境变量覆盖）
- 修改 `public/` 目录下的文件后，浏览器会自动刷新（serve 支持实时刷新）

---

## 部署到 Cloudflare Pages

### 前提准备

1. 在 [Cloudflare Dashboard](https://dash.cloudflare.com/) 开启 Pages 服务
2. 创建一个 **KV 命名空间**（例如 `product-nav-kv`）
3. 设置 **环境变量** `ADMIN_PASSWORD` 作为管理员登录密码

### 方式一：通过 GitHub 自动部署

1. 将代码推送到 GitHub 仓库
2. 在 Cloudflare Pages 中连接该仓库
3. 构建设置：
   - **构建命令**：留空或 `true`（无构建步骤）
   - **构建输出目录**：`public`
4. 在 Pages 项目的「设置 → 变量」中添加：
   - 环境变量：`ADMIN_PASSWORD` = 你的管理员密码
5. 在 Pages 项目的「设置 → 函数 → KV 命名空间绑定」中添加：
   - 变量名：`PRODUCTS_KV`
   - KV 命名空间：选择你创建的 KV 命名空间
6. 部署后即可通过 Cloudflare 分配的域名访问

### 方式二：通过 Wrangler CLI 部署

```bash
# 1. 安装 Wrangler
pnpm add -g wrangler

# 2. 登录 Cloudflare
npx wrangler login

# 3. 部署
npx wrangler pages deploy ./public --branch main
```

### 部署后配置

1. 在 Cloudflare Pages 项目 → **设置 → 环境变量** 中添加 `ADMIN_PASSWORD`
2. 在 **设置 → 函数 → KV 命名空间绑定** 中绑定 `PRODUCTS_KV`
3. 可选：在 **设置 → 域** 中绑定自定义域名

---

## 功能说明

### 首页（产品导航）

- 产品展示网格，支持搜索和分类筛选
- 可设置自定义背景图片
- 可开关玻璃质感效果
- 自动加载自定义 CSS/JS/HTML 代码

### 管理员后台

| 页面 | 功能 |
|---|---|
| 管理后台 | 产品管理（增删改查）、自定义代码编辑、背景设置 |
| 登录页 | 通过密码登录（Cloudflare 环境变量验证） |

### 背景设置

管理员可在后台设置：
- **背景图片 URL** — 设置自定义背景图片，首页和管理后台同步生效
- **玻璃质感开关** — 开启/关闭卡片毛玻璃效果

### 自定义代码

管理员可在后台编辑并保存：
- **自定义 CSS** — 覆盖或扩展页面样式
- **自定义 JavaScript** — 添加额外交互逻辑
- **自定义 HTML** — 在页面底部注入内容

---

## 数据存储

| 环境 | 存储方式 |
|---|---|
| 本地开发 | 浏览器 localStorage |
| 生产环境 | Cloudflare KV（`PRODUCTS_KV` 命名空间） |

存储的数据包括：
- 产品列表
- 自定义代码（CSS / JS / HTML）
- 背景设置（背景图片 URL + 玻璃质感开关）

---

## API 接口

| 方法 | 路径 | 说明 | 需认证 |
|---|---|---|---|
| POST | `/api/auth` | 管理员登录验证 | ❌ |
| GET | `/api/products` | 获取所有产品 | ❌ |
| POST | `/api/products` | 添加产品 | ✅ |
| PUT | `/api/products?id=xxx` | 更新产品 | ✅ |
| DELETE | `/api/products?id=xxx` | 删除产品 | ✅ |
| GET | `/api/custom` | 获取自定义代码 | ❌ |
| POST | `/api/custom` | 保存自定义代码 | ✅ |

---

## 许可证

MIT