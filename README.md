# 类MAC专辑封面屏保

**当前版本：v1.0.0 · Windows x64**

将 Apple Music 本地缓存或自己保存的封面图片展示为可调行数的动态专辑墙。

> **原作者与项目贡献：** 本软件基于 [forestslin 的 mosaic-screensaver-windows v5.0.15](https://github.com/forestslin/mosaic-screensaver-windows/tree/v5.0.15) 开发。原作者及其贡献者创建了 Windows 屏保程序、封面墙布局、3D 翻转与流动动画、多显示器显示和 WebView2 展示框架。本项目保留这些基础实现，并在其上增加本地 Apple Music 缓存读取、可切换封面来源、行数选择和退出时登录验证。感谢原作者公开源码与 MIT 许可。

## 下载与安装

1. 打开 [最新版发行页](https://github.com/DejaVuDarren/apple-music-artwork-screensaver-windows/releases/latest)，在 **Assets / 资源** 中下载名称包含 `win-x64.zip` 的文件。ZIP 内有 `.scr` 和安装说明。也可以直接下载 `.scr`。不要只下载 GitHub 自动生成的 `Source code (zip)`：它只有源码，没有可用的屏保程序。
2. 解压 ZIP，把 `.scr` 放到准备长期保留的位置，例如自己创建的 `C:\Screensavers` 文件夹。安装后不要移动或删除这个文件；Windows 会记住它的完整路径。
3. 右键 `.scr`，选择 **安装**。如果 Windows 11 的简化菜单没有显示此项，先点 **显示更多选项**。随后在 Windows 的 **屏幕保护程序设置** 中，确认下拉列表选中了本屏保，并设置等待分钟数。
4. 点 **设置**，或右键 `.scr` 选择 **配置**。在中文设置窗口中选择封面来源、动画、行数、速度和登录验证，最后点 **保存**。首次使用建议保持“Apple Music 本地缓存”，先确认能显示封面。
5. 在 **屏幕保护程序设置** 中点击 **预览**检查画面，移动鼠标或按键退出。若开启了登录验证，实际全屏退出可能锁定 Windows，请先保存正在进行的工作。外层 Windows 设置窗口可能保留旧的登录选项状态；保存本软件设置后，关闭并重新打开该窗口查看。

需要 **Windows x64** 和 **Microsoft Edge WebView2 Runtime**。若机器上还装有旧版 `MosaicScreensaver_AppleMusic`，请在第 3 步重新选择新版屏保；旧版不会因为下载新版文件而自动升级。

### 配置封面来源

1. **Apple Music 本地缓存**：Windows 版 Apple Music 已在当前用户下缓存封面时，屏保会自动读取。无需指定文件夹。云端封面尚未缓存在本机时，不会出现在屏保中。
2. **自选图片文件夹**：先把封面图片保存到一个文件夹，再点 **选择文件夹…** 指向它，之后在来源下拉框选择“自选图片文件夹”。支持子文件夹中的 JPG、JPEG、PNG、WebP、GIF、BMP 图片。
3. **Apple Music 与图片文件夹混合**：按第 2 项先选择文件夹，再选混合模式。启动时合并两处图片；某一处没有可用封面时仍会显示另一处。

切换来源后必须点 **保存**，下次进入屏保时生效。若屏保显示“所选来源没有找到专辑封面”，先检查 Apple Music 是否在本机缓存封面，或检查所选文件夹及图片格式。若需要退出时的 Windows 登录界面，在本软件中勾选 **要求使用 Windows 账户登录** 并保存；也可以在 Windows 屏保设置中核对 **在恢复时显示登录屏幕**。

## 功能

| 封面来源 | 读取方式 |
| --- | --- |
| Apple Music 本地缓存 | 自动读取当前 Windows 用户的 Apple Music 封面索引；只显示本机已缓存、与资料库条目关联的图片。默认来源。 |
| 自选图片文件夹 | 选择自己的封面文件夹，递归读取 JPG、JPEG、PNG、WebP、GIF、BMP 图片。 |
| 两者混合 | 将上述两处封面合并展示。 |

设置界面为中文。可选自动或 1–20 行、3D 翻转或从左向右流动动画，以及 1–5 档速度。每次启动屏保都会重新扫描所选来源；资料库和图片文件均不会被修改或上传。

“要求使用 Windows 账户登录”会保存为本软件的选项，并同步 Windows 的屏保安全设置。正常退出屏保时会请求系统锁定工作站。若屏保程序异常终止，仍需依赖 Windows 系统级“在恢复时显示登录屏幕”选项提供独立保护。从 Windows 设置窗口打开本软件配置时，请在保存后关闭并重新打开外层窗口，以查看更新后的系统选项。

屏保不提供点击封面播放功能。Apple Music 云端有但尚未缓存在本机的封面不会显示。自选文件夹里的图片会按封面形式裁切显示，程序不验证它们是否真是专辑封面。

## 从源码构建

需要 Windows、.NET SDK 和 WebView2 Runtime。在仓库根目录运行：

```powershell
dotnet publish .\MosaicScreensaver\MosaicScreensaver.csproj -c Release -r win-x64 --self-contained true
```

将发布目录中的 `LeiMacAlbumScreensaver.exe` 重命名为 `LeiMacAlbumScreensaver.scr`，放在固定位置后右键选择“安装”。右键 `.scr` 选择“配置”，即可选择封面来源、图片文件夹、行数、动画和登录验证。

## 数据与兼容性

Apple Music 来源查找当前用户的 `Music\Apple Music\Apple Music Library.musiclibrary\artwork.sqlite` 及相邻的 `artwork` 文件夹。缓存格式不是公开接口，Apple Music 更新后若目录或索引字段改变，可能需要调整读取代码。选择图片文件夹时，程序只读取图片，不扫描其他格式的音乐文件或尝试提取其中的内嵌封面。

仓库只包含源码，不包含个人封面、资料库或缓存文件。发行程序未经代码签名。

## 作者、来源与许可

本项目由 **DejaVuDarren** 维护，软件名称为**类MAC专辑封面屏保**，版本从 **v1.0.0** 独立编号。

原项目作者为 [forestslin](https://github.com/forestslin)，项目为 [mosaic-screensaver-windows](https://github.com/forestslin/mosaic-screensaver-windows)。其屏保框架和动画实现是本软件的基础；本项目对原作进行了本地封面读取、来源选择及 Windows 设置方面的改动。原项目与本项目的源码均按 MIT License 使用，详见 [LICENSE](LICENSE)。本项目不是 Apple 或原作者的官方产品。
