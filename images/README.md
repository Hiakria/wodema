# 图片资源说明

请将以下图片放入此文件夹：

## 必需图片：

1. **avatar.png** - 个人头像/IP 形象（建议尺寸：600x800px 或更大）
2. **work1.png ~ work6.png** - 作品展示图（建议尺寸：380x220px）
3. **wechat-qr.png** - 微信二维码（建议尺寸：160x160px）
4. **qq-qr.png** - QQ 二维码（建议尺寸：160x160px）

## 图片风格建议：

- **头像/IP 形象**：二次元卡通风格，软萌可爱，低饱和色彩，淡粉/淡紫背景
- **作品图**：二次元风格设计作品、UI 界面、插画、海报等，画面干净清晰
- **二维码**：清晰的二维码图片，可添加淡紫色边框装饰

## 当前状态：

网站目前使用 picsum.photos 的在线图片服务作为占位符，您可以：
1. 将自己的图片放入 images 文件夹
2. 修改 index.html 中的图片路径（将 https://picsum.photos/... 改为 images/xxx.png）

## 替换示例：

```html
<!-- 替换前 -->
<img src="https://picsum.photos/seed/avatar/600/800" alt="个人形象">

<!-- 替换后 -->
<img src="images/avatar.png" alt="个人形象">
```