using Microsoft.Win32;
using System.Runtime.InteropServices;

namespace MosaicScreensaver;

internal static class WindowsScreenSaverSecurity
{
    private const string DesktopKey = @"Control Panel\Desktop";

    internal static bool IsEnabled()
    {
        using var key = Registry.CurrentUser.OpenSubKey(DesktopKey);
        return string.Equals(key?.GetValue("ScreenSaverIsSecure")?.ToString(), "1", StringComparison.Ordinal);
    }

    internal static void SetEnabled(bool enabled)
    {
        using var key = Registry.CurrentUser.CreateSubKey(DesktopKey);
        key?.SetValue("ScreenSaverIsSecure", enabled ? "1" : "0", RegistryValueKind.String);
        // Notify Windows so the changed user preference takes effect without sign-out.
        SendMessageTimeout(new IntPtr(0xffff), 0x001A, IntPtr.Zero,
            DesktopKey, 0x0002, 1000, out _);
    }

    [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern IntPtr SendMessageTimeout(
        IntPtr window, uint message, IntPtr wParam, string lParam,
        uint flags, uint timeout, out IntPtr result);
}
