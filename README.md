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

## 部署到 Cloudflare Pages（手动 · 网站 GUI 方式）

下面是从零开始在 Cloudflare 网站上手把手部署的完整步骤。

---

### 第一步：准备工作

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)（如果没有账号先注册）
2. 在左侧菜单找到 **Workers 和 Pages** → **Pages**

---

### 第二步：创建 KV 命名空间（存储数据用）

1. 在左侧菜单找到 **Workers 和 Pages** → **KV**
2. 点击 **创建命名空间**
3. 输入名称：`product-nav-kv`（可自定义，记住这个名字）
4. 点击 **添加**
5. 记录下该 KV 命名空间的**名称**，后面会用到

---

### 第三步：将代码上传到 GitHub（如果没有推送过）

如果你还没有将代码推送到 GitHub，先在终端执行：

```bash
# 在项目目录下执行
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

---

### 第四步：在 Cloudflare Pages 创建项目

1. 进入 **Workers 和 Pages** → **Pages** → 点击 **创建**
2. 选择 **连接到 Git** 选项卡
3. 点击 **连接到 GitHub**，授权 Cloudflare 访问你的仓库
4. 在弹出的列表中找到你的仓库（`cloud-guidance-my`），点击 **开始设置**
5. 进入构建设置页面：

---

### 第五步：配置构建设置

在「设置构建和部署」页面，按以下填写：

| 字段 | 填写内容 |
|---|---|
| 项目名称 | `product-nav`（可自定义，会出现在域名中） |
| 生产分支 | `main` |
| 构建命令 | 留空（本项目是纯静态 HTML，无需构建） |
| 构建输出目录 | `public`（**必须填写 `public`**） |
| 根目录 | 留空 |

> ⚠️ **关键：构建输出目录一定要填 `public`**，否则 Cloudflare 找不到首页文件。

点击 **保存并部署**，Cloudflare 会自动开始第一次部署。

---

### 第六步：设置环境变量（管理员密码）

部署完成后，进入项目详情页：

1. 点击顶部导航栏的 **设置** 标签
2. 在左侧找到 **环境变量**（Environment Variables）
3. 点击 **添加变量**
4. 填写：

   | 字段 | 填写内容 |
   |---|---|
   | 变量名 | `ADMIN_PASSWORD` |
   | 值 | 你自己设定的管理员密码（例如 `MyAdmin123!`） |
   | 环境 | 勾选「生产」|

5. 点击 **保存**

---

### 第七步：绑定 KV 命名空间（存储产品数据）

还是在 **设置** 页面：

1. 在左侧找到 **函数** → **KV 命名空间绑定**
2. 点击 **添加绑定**
3. 填写：

   | 字段 | 填写内容 |
   |---|---|
   | 变量名 | `PRODUCTS_KV`（**必须填这个，不能改**） |
   | KV 命名空间 | 选择你第二步创建的 `product-nav-kv` |

4. 点击 **保存**

---

### 第八步：重新部署让配置生效

添加环境变量和 KV 绑定后，需要重新部署一次：

1. 点击顶部导航栏的 **部署** 标签
2. 找到最新的一次部署记录
3. 点击右侧的 **三个点（···）** → **重试部署**
4. 等待部署完成（约 1-2 分钟）

---

### 第九步：访问你的网站

1. 部署完成后，在项目首页会显示一个 `*.pages.dev` 域名
2. 点击该域名即可访问
3. 进入后台：`https://你的域名.pages.dev/admin/login.html`
4. 使用你设置的 `ADMIN_PASSWORD` 密码登录

---

### 可选：绑定自定义域名

1. 在项目 **设置** → **域** 中点击 **添加自定义域**
2. 输入你的域名（例如 `nav.yourdomain.com`）
3. 按照 Cloudflare 指引完成 DNS 配置

---

### 常见问题

**Q：部署后访问首页是 404？**
A：检查「构建输出目录」是否设置为 `public`，然后重新部署一次。

**Q：登录提示密码错误？**
A：检查环境变量 `ADMIN_PASSWORD` 是否已添加到生产环境，并重新部署。

**Q：添加产品后刷新页面数据丢失？**
A：检查 KV 命名空间绑定中的变量名是否写的是 `PRODUCTS_KV`（全大写，必须一致）。

**Q：自定义代码没有生效？**
A：自定义代码保存在 localStroage 或 KV 中，重新部署后需要重新保存一次。

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