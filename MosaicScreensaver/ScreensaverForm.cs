using System;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace MosaicScreensaver
{
    public partial class ScreensaverForm : Form
    {
        private static int exitRequested;

        [DllImport("user32.dll")]
        static extern IntPtr SetParent(IntPtr hWndChild, IntPtr hWndNewParent);

        [DllImport("user32.dll")]
        static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll", SetLastError = true)]
        static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        static extern bool GetClientRect(IntPtr hWnd, out Rectangle lpRect);

        private Point mouseLocation;
        private bool previewMode = false;
        private readonly bool diagnosticHold = Environment.GetEnvironmentVariable("MOSAIC_DIAGNOSTIC_HOLD") == "1";
        private WebView2 webView;

        public ScreensaverForm(Rectangle bounds)
        {
            InitializeComponent();
            InitScreensaver();
            this.Bounds = bounds;
        }

        public ScreensaverForm(IntPtr PreviewWndHandle)
        {
            InitializeComponent();
            previewMode = true;

            // Set the preview window as the parent of this window
            SetParent(this.Handle, PreviewWndHandle);

            // Make this a child window so it will close when the parent dialog closes
            SetWindowLong(this.Handle, -16, new IntPtr(GetWindowLong(this.Handle, -16) | 0x40000000).ToInt32());

            // Place our window inside the parent
            Rectangle ParentRect;
            GetClientRect(PreviewWndHandle, out ParentRect);
            Size = ParentRect.Size;
            Location = new Point(0, 0);

            InitScreensaver();
        }

        private void InitScreensaver()
        {
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.Manual;
            this.BackColor = Color.Black;

            if (!previewMode)
            {
                this.TopMost = true;
                mouseLocation = Cursor.Position;
                Cursor.Hide();
            }

            // Initialize WebView2
            webView = new WebView2();
            webView.Dock = DockStyle.Fill;
            this.Controls.Add(webView);
            InitializeAsync();
        }

        async void InitializeAsync()
        {
            try
            {
                string userDataFolder = Path.Combine(Path.GetTempPath(), "MosaicScreensaver_WebView2_" + System.Diagnostics.Process.GetCurrentProcess().Id);
                var options = new CoreWebView2EnvironmentOptions();
                var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder, options);
                await webView.EnsureCoreWebView2Async(env);

                // Map the live Apple Music artwork cache and pass its indexed album covers
                // to the page. Read this afresh at every screensaver launch.
                var (artworkFolder, localArtworks) = AppleMusicArtworkCatalog.Load();
                if (Directory.Exists(artworkFolder))
                {
                    webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        "applemusic.local", artworkFolder,
                        CoreWebView2HostResourceAccessKind.Allow);
                }
                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(
                    "window.localMusicArtworks = " + JsonSerializer.Serialize(localArtworks) + ";");
                
                // Inject display mode from Registry
                int mode = 0; // This edition displays only the local Apple Music library.
                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync($"window.displayMode = {mode};");

                // Inject selected music genres from Registry
                var genres = SettingsManager.LoadGenres();
                string genresJson = "['" + string.Join("','", genres) + "']";
                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync($"window.selectedMusicGenres = {genresJson};");

                // Inject selected movie genres from Registry
                var movieGenres = SettingsManager.LoadMovieGenres();
                string movieGenresJson = "['" + string.Join("','", movieGenres) + "']";
                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync($"window.selectedMovieGenres = {movieGenresJson};");

                // Inject flip speed from Registry
                int speed = SettingsManager.LoadFlipSpeed();
                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync($"window.flipSpeed = {speed};");

                int animType = SettingsManager.LoadAnimationType();
                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync($"window.animationType = {animType};");

                int bookLang = SettingsManager.LoadBookLanguage();
                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync($"window.bookLanguage = {bookLang};");
                int rowCount = SettingsManager.LoadRowCount();
                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync($"window.rowCount = {rowCount};");
                
                string appDir = AppDomain.CurrentDomain.BaseDirectory;
                string webDir = Path.Combine(appDir, "web");
                if (!File.Exists(Path.Combine(webDir, "index.html")))
                {
                    // A single-file .NET publish extracts content under the user's temp folder.
                    var extractedRoot = Path.Combine(Path.GetTempPath(), ".net", "MosaicScreensaver");
                    if (Directory.Exists(extractedRoot))
                    {
                        var extractedWeb = Directory.GetDirectories(extractedRoot)
                            .OrderByDescending(Directory.GetLastWriteTimeUtc)
                            .Select(dir => Path.Combine(dir, "web"))
                            .FirstOrDefault(dir => File.Exists(Path.Combine(dir, "index.html")));
                        if (extractedWeb is not null) webDir = extractedWeb;
                    }
                }
                if (Directory.Exists(webDir))
                {
                    webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        "app.local",
                        webDir,
                        CoreWebView2HostResourceAccessKind.Allow
                    );
                    webView.Source = new Uri("https://app.local/index.html");
                }
                else
                {
                    string htmlPath = Path.Combine(appDir, "web", "index.html");
                    if (File.Exists(htmlPath))
                    {
                        webView.Source = new Uri(htmlPath);
                    }
                }

                // Listen for exit messages from WebView2 to fix the focus mode bug
                webView.WebMessageReceived += (sender, args) =>
                {
                    if (previewMode || diagnosticHold) return;
                    string msg = args.TryGetWebMessageAsString();
                    if (msg == "exit")
                    {
                        ExitScreensaver();
                    }
                    else if (msg == "mousemove")
                    {
                        if (Math.Abs(mouseLocation.X - Cursor.Position.X) > 5 ||
                            Math.Abs(mouseLocation.Y - Cursor.Position.Y) > 5)
                        {
                            ExitScreensaver();
                        }
                    }
                };
            }
            catch (Exception ex)
            {
                // Prevent unhandled exception dialog
                Label errorLabel = new Label();
                errorLabel.Text = "WebView2 Init Error";
                errorLabel.ForeColor = Color.White;
                errorLabel.AutoSize = true;
                this.Controls.Add(errorLabel);
                errorLabel.BringToFront();
            }
        }

        private void ScreensaverForm_Load(object sender, EventArgs e)
        {
            if (!previewMode && !diagnosticHold)
            {
                mouseLocation = Cursor.Position;
                
                // Hook up events to exit
                this.MouseMove += new MouseEventHandler(ScreensaverForm_MouseMove);
                this.MouseClick += new MouseEventHandler(ScreensaverForm_MouseClick);
                this.KeyDown += new KeyEventHandler(ScreensaverForm_KeyDown);

                // Need to also capture events if WebView2 eats them. 
                // A robust way in WinForms is a global hook or a timer checking mouse pos,
                // but let's use a simple timer for cursor movement if WebView takes focus.
                System.Windows.Forms.Timer exitTimer = new System.Windows.Forms.Timer();
                exitTimer.Interval = 100;
                exitTimer.Tick += (s, args) =>
                {
                    if (Cursor.Position != mouseLocation)
                    {
                        ExitScreensaver();
                    }
                };
                exitTimer.Start();
            }
        }

        private void ScreensaverForm_MouseMove(object sender, MouseEventArgs e)
        {
            if (!previewMode && !diagnosticHold)
            {
                if (Math.Abs(mouseLocation.X - Cursor.Position.X) > 5 ||
                    Math.Abs(mouseLocation.Y - Cursor.Position.Y) > 5)
                {
                    ExitScreensaver();
                }
            }
        }

        private void ScreensaverForm_MouseClick(object sender, MouseEventArgs e)
        {
            if (!previewMode && !diagnosticHold)
                ExitScreensaver();
        }

        private void ScreensaverForm_KeyDown(object sender, KeyEventArgs e)
        {
            if (!previewMode && !diagnosticHold)
                ExitScreensaver();
        }

        private void ExitScreensaver()
        {
            if (Interlocked.Exchange(ref exitRequested, 1) != 0) return;

            // The parent Windows settings dialog can write its earlier checkbox
            // state after our settings window closes. The app's saved choice also
            // locks the workstation on normal full-screen exits.
            if (SettingsManager.LoadRequireSignIn()
                && !WindowsScreenSaverSecurity.LockWorkStationOnExit())
            {
                MessageBox.Show("无法锁定 Windows。请使用 Win+L 手动锁定后再检查系统设置。",
                    "屏保登录验证", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                Interlocked.Exchange(ref exitRequested, 0);
                return;
            }

            Application.Exit();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            // 
            // ScreensaverForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Name = "ScreensaverForm";
            this.Text = "MosaicScreensaver";
            this.Load += new System.EventHandler(this.ScreensaverForm_Load);
            this.ResumeLayout(false);
        }
    }
}
