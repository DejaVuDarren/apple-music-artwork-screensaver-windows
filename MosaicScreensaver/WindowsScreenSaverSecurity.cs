using Microsoft.Win32;
using System.ComponentModel;
using System.Runtime.InteropServices;

namespace MosaicScreensaver;

internal static class WindowsScreenSaverSecurity
{
    private const uint SpiGetScreenSaveSecure = 0x0076;
    private const uint SpiSetScreenSaveSecure = 0x0077;
    private const uint SpifUpdateIniFile = 0x0001;
    private const uint SpifSendChange = 0x0002;

    internal static bool IsEnabled()
    {
        if (GetSystemParameter(SpiGetScreenSaveSecure, 0, out int secure, 0))
            return secure != 0;

        // Keep the settings window usable if the system query is unavailable.
        using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop");
        return string.Equals(key?.GetValue("ScreenSaverIsSecure")?.ToString(), "1", StringComparison.Ordinal);
    }

    internal static void SetEnabled(bool enabled)
    {
        // Persist through Windows and notify other windows of the change.
        if (!SetSystemParameter(SpiSetScreenSaveSecure, enabled ? 1u : 0u,
                IntPtr.Zero, SpifUpdateIniFile | SpifSendChange))
            throw new Win32Exception(Marshal.GetLastWin32Error(), "无法更新 Windows 屏保登录验证设置。");

        if (!GetSystemParameter(SpiGetScreenSaveSecure, 0, out int actual, 0)
            || (actual != 0) != enabled)
            throw new InvalidOperationException("Windows 未接受屏保登录验证设置。");
    }

    internal static bool LockWorkStationOnExit() => LockWorkStation();

    [DllImport("user32.dll", EntryPoint = "SystemParametersInfoW", SetLastError = true)]
    private static extern bool GetSystemParameter(uint action, uint parameter, out int value, uint flags);

    [DllImport("user32.dll", EntryPoint = "SystemParametersInfoW", SetLastError = true)]
    private static extern bool SetSystemParameter(uint action, uint parameter, IntPtr value, uint flags);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool LockWorkStation();
}
