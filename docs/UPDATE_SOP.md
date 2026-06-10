# Sunbridge Website 更新与发布标准

最后审阅：2026-06-08

## 1. 适用范围

本流程适用于 Sunbridge 公共网站的文案、图片、样式、页面、JavaScript 和部署更新。

当前生产链路：

```text
本地代码 -> GitHub -> Cloudflare Pages -> 自定义域名 -> 用户
```

生产原则：

- `main` 是生产分支。
- 正式修改必须通过独立分支和 Pull Request。
- 合并前检查 Cloudflare Preview。
- 合并后检查生产部署和正式域名。
- 计划中的登录、预约、后台或数据库能力不能写成已上线功能。

## 2. 更新风险

| 类型 | 示例 | 风险 | 最低检查 |
| --- | --- | --- | --- |
| 文案 | 课程、电话、时间、地点 | 低 | 双语、链接、内容真实性 |
| 图片 | Logo、课程图、活动图 | 中 | 授权、尺寸、桌面和手机 |
| 样式 | 颜色、间距、响应式布局 | 中 | 完整视觉检查 |
| 页面结构 | 新增页面、导航调整 | 高 | 全页面和全设备检查 |
| JavaScript | 语言切换、菜单、动画 | 高 | 全页面功能和控制台 |
| 新功能 | 表单、登录、预约、后台 | 很高 | 独立发布计划、安全和隐私审查 |

## 3. 开始更新

开始前确认工作区没有不明修改：

```powershell
git status --short
git switch main
git pull --ff-only origin main
```

如果 `git status` 不干净，先确认修改归属，不要覆盖或误提交。

创建分支：

```powershell
git switch -c feature/add-page
git switch -c fix/mobile-navigation
git switch -c content/update-course-copy
```

Codex 创建的分支使用 `codex/` 前缀。

不要使用 `test`、`new`、`fix` 等无法说明目的的名称。

## 4. 修改要求

### 4.1 页面和文案

当前公开页面：

```text
index.html
about.html
guitar.html
badminton.html
programming.html
holiday-camp.html
contact.html
```

要求：

- 英文和中文同步更新。
- 公开内容遵守 `docs/CONTENT_RULES.md`。
- 新增、删除或重命名页面时同步检查导航、首页入口、移动菜单和 footer。
- 已公开过的旧 URL 不直接留下 404；使用兼容跳转或 Cloudflare redirects。

### 4.2 样式

主要文件是 `css/style.css` 和 `css/variables.css`。

修改后检查：

- 390px、430px、768px、1024px 和桌面宽度。
- 英文和中文的换行与溢出。
- 导航、按钮、图片和联系方式。
- 键盘操作和可见焦点。

### 4.3 JavaScript

`js/main.js` 负责语言切换、导航和滚动动画。

修改后检查：

- 英文 -> 中文 -> 英文切换。
- 刷新后语言偏好仍保留。
- 清除 `sunbridge-language` 后默认英文。
- 手机菜单能打开、关闭，并支持 Escape。
- 所有公开页面没有控制台错误。

## 5. 本地预览与检查

从项目根目录启动静态服务器：

```powershell
python -m http.server 8000
```

打开：

```text
http://localhost:8000
```

不要只用双击 HTML 文件的方式验证。

最低自动检查：

```powershell
node --check js/main.js
python .agents/skills/project-architecture-keeper/scripts/validate_project_docs.py
git diff --check
```

每次发布使用 `docs/RELEASE_CHECKLIST.md`。高风险修改必须检查所有公开页面、双语和桌面/平板/手机布局。

## 6. 提交与 Pull Request

提交前：

```powershell
git status --short
git diff
```

只暂存本次修改的文件，不默认使用 `git add .`：

```powershell
git add index.html js/main.js docs/RELEASE_CHECKLIST.md
git diff --cached
git commit -m "Update homepage course copy"
git push -u origin <branch-name>
```

PR 描述至少包括：

```markdown
## What changed

- Summary of the change

## Checks

- [ ] English and Chinese checked
- [ ] Desktop, tablet and mobile checked
- [ ] Navigation and links checked
- [ ] No console errors
- [ ] Architecture and TODO updated when required

## Risk

Low / Medium / High

## Rollback

Previous production deployment or commit:
```

## 7. Preview 和生产发布

分支推送或 PR 创建后：

1. 等待 Cloudflare Preview 部署成功。
2. 打开 Preview URL，执行发布清单。
3. 确认 Preview 没有公开敏感资料；Preview 默认可能公开访问。
4. 使用 Squash and merge 合并到 `main`。
5. 等待 Cloudflare Production 部署成功。
6. 打开正式域名检查首页、导航、双语、联系方式、手机布局和 HTTPS。
7. 在 PR 或发布记录中留下生产部署结果。

发布尽量安排在之后至少还有 30 分钟可以观察网站的时间。

## 8. 回滚

出现首页无法打开、导航失效、样式严重错乱、联系方式错误或关键文案错误时：

1. 在 Cloudflare Pages 的 Deployments 中选择上一个成功的生产部署。
2. 执行 `Rollback to this deployment`，先恢复用户访问。
3. 立即检查正式域名。
4. 在 GitHub 撤销有问题的 commit，或创建修复分支。
5. 重新走 PR、Preview 和生产检查。

Cloudflare 回滚只切换当前生产部署，不会自动修改 `main`。如果不修复 Git，下一次部署可能重新带回问题。

## 9. 仓库设置

推荐设置：

- Cloudflare Production branch：`main`
- Preview branches：启用
- GitHub `main`：要求 PR 后合并
- 合并方式：优先 Squash and merge
- 禁止 force push 和删除 `main`
- 有自动检查后，将其设为 required status checks

## 10. 官方参考

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Pages Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages Rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)
- [GitHub Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
