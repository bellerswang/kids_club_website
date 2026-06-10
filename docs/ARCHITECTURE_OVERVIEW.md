# Sunbridge 项目架构概览

这是一份简短版说明。更完整的当前架构以 [ARCHITECTURE.md](./ARCHITECTURE.md) 为准，目标方案以 [docs/TARGET_ARCHITECTURE.md](./docs/TARGET_ARCHITECTURE.md) 为准。

## 现在的架构

项目现在是一个静态、多页面网站，默认英文，支持中文切换。

- 前端直接由浏览器加载，不需要构建步骤或包管理器。
- 公开页面包括首页、关于、吉他、羽毛球、AI 技能、假期营和联系页。
- 所有公开文案都尽量只保留手册里明确提到的内容。
- `js/main.js` 负责语言切换、导航交互和滚动出现动画。
- `css/style.css` 负责整站的布局、组件和响应式样式。
- 登录和用户中心代码还在仓库里，但目前对外隐藏，不作为公开功能使用。

## 现在的数据流

- 网站内容是纯静态文件。
- 联系和预约不再提交到本地存储或后端接口。
- 访客主要通过电话、邮箱和官网地址联系。
- 当前语言选择会保存在浏览器本地的 `sunbridge-language` 里。

## 未来目标架构

目标是先把前台迁移为 Astro 静态生成网站：

- 页头、页脚和页面布局改成共享组件。
- 课程、页面和联系方式使用 Markdown/YAML 分开管理。
- 英文使用根 URL，中文使用 `/zh/` URL。
- Cloudflare Pages 构建并部署静态 `dist` 目录。
- 动态功能统一通过 `/api/v1` 接入。
- 简单表单使用 Cloudflare Functions，身份和数据使用 Supabase。
- 课时、考勤和成长报告等复杂业务出现后再增加 FastAPI。

完整方案见 [docs/TARGET_ARCHITECTURE.md](./docs/TARGET_ARCHITECTURE.md)。

## 设计原则

- 现在的公开网站以 brochure 为唯一内容依据。
- 未来功能可以做，但不要把“计划中的能力”写成“已经上线”。
- 登录系统目前是隐藏状态，等真正准备上线时再恢复公开入口。
