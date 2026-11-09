# Apple Music 本地专辑封面屏保（Windows）

这是基于 [forestslin/mosaic-screensaver-windows v5.0.15](https://github.com/forestslin/mosaic-screensaver-windows/tree/v5.0.15) 修改的 Windows 屏幕保护程序。屏保从**当前用户本机的 Apple Music 封面缓存**读取专辑图片，以翻转或流动动画展示。

## 功能

- 每次启动时只读查询 Apple Music 的封面索引，显示本机已缓存、与资料库条目关联的封面；不会复制或修改音乐资料库。
- 设置封面行数：自动或 1–20 行；多显示器分别排版。
- 选择 3D 翻转或从左向右流动动画，调节速度。
- 在中文设置界面中选择是否要求退出屏保时使用 Windows 账户登录。此选项由 Windows 管理，也会影响其他屏保。

屏保不提供点击封面播放功能。Apple Music 云端有但尚未缓存在本机的封面不会显示。

## 编译

需要 Windows、.NET SDK 和 WebView2 Runtime。在仓库根目录运行：

```powershell
dotnet publish .\MosaicScreensaver\MosaicScreensaver.csproj -c Release -r win-x64 --self-contained true
```

发布目录中的 `MosaicScreensaver.exe` 是单文件程序。将其重命名为 `MosaicScreensaver.scr`，放在固定位置，然后右键选择“安装”。在 Windows 的“屏幕保护程序设置”中选择该屏保并设定等待时间。右键 `.scr` 选择“配置”，可调整行数、动画和登录验证。

## 数据与兼容性

程序按当前 Windows 用户查找 `Music\Apple Music\Apple Music Library.musiclibrary\artwork.sqlite` 及相邻的 `artwork` 文件夹。只读取本地 SQLite 索引和图片，不上传封面或音乐资料库。Apple Music 的缓存格式未公开，更新后若目录或索引字段改变，可能需要调整读取代码。

仓库只包含源码，不包含个人封面、Apple Music 资料库、缓存文件或编译生成的屏保。屏保程序未经代码签名。

## 来源与许可

原项目为 [forestslin/mosaic-screensaver-windows](https://github.com/forestslin/mosaic-screensaver-windows)，其 README 声明采用 MIT License。本项目保留原项目来源说明，并按 MIT License 发布修改后的源码。参见 [LICENSE](LICENSE)。

