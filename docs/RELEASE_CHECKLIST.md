# Sunbridge Website Release Checklist

为每次发布复制一份到 PR 描述中，并按本次修改范围勾选。

## Change

- [ ] 已说明修改目的和影响页面
- [ ] 已标记风险：Low / Medium / High
- [ ] 已记录回滚目标
- [ ] 未混入无关文件或本地资料

## Content

- [ ] 英文文案已检查
- [ ] 中文文案已检查
- [ ] Brochure 未提及的服务没有写成已提供
- [ ] 登录、预约和后台没有被误写成已上线
- [ ] 电话、邮箱、网站和地点表述正确
- [ ] 儿童照片或资料已确认授权

## Pages

- [ ] Home
- [ ] About
- [ ] Programmes
- [ ] Holiday Camp
- [ ] Contact
- [ ] 旧 Guitar、Badminton 和 AI URL 跳转

## Devices

- [ ] Desktop
- [ ] 1024px
- [ ] 768px
- [ ] 430px
- [ ] 390px
- [ ] 至少一台真实手机（中高风险修改）

## Functions

- [ ] 所有本地链接正常
- [ ] 英文、中文和刷新后的语言偏好正常
- [ ] 手机菜单正常
- [ ] 滚动动画正常
- [ ] 当前公开的邮箱和其他已确认链接正常
- [ ] 浏览器控制台无明显错误

## Repository

- [ ] `ARCHITECTURE.md` 与实现一致
- [ ] `TODO.md` 已更新
- [ ] `node --check js/main.js` 通过
- [ ] architecture-keeper 校验通过
- [ ] `git diff --check` 通过
- [ ] staged diff 只包含本次修改

## Deployment

- [ ] Cloudflare Preview 部署成功
- [ ] Preview URL 已检查
- [ ] PR 已审核并合并到 `main`
- [ ] Production 部署成功
- [ ] 正式域名已检查
- [ ] HTTPS 正常
- [ ] 上一个成功生产部署已确认可回滚
