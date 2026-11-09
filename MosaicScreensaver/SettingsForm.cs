using System.Drawing;
using System.Windows.Forms;

namespace MosaicScreensaver;

public sealed class SettingsForm : Form
{
    private readonly RadioButton flip;
    private readonly RadioButton flow;
    private readonly ComboBox rows;
    private readonly TrackBar speed;
    private readonly CheckBox requireSignIn;
    private readonly ComboBox artworkSource;
    private readonly TextBox artworkFolder;
    private readonly Button browseFolder;

    public SettingsForm()
    {
        Text = "类MAC专辑封面屏保 · 设置 · v1.0.0";
        ClientSize = new Size(760, 610);
        Font = new Font("Microsoft YaHei UI", 9);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.White;

        var sourceGroup = new GroupBox {
            Text = "专辑封面来源", Location = new Point(20, 15), Size = new Size(700, 156)
        };
        artworkSource = new ComboBox {
            Location = new Point(18, 30), Size = new Size(310, 30),
            DropDownStyle = ComboBoxStyle.DropDownList
        };
        artworkSource.Items.AddRange(new object[] {
            "Apple Music 本地缓存", "自选图片文件夹", "Apple Music 与图片文件夹混合"
        });
        artworkFolder = new TextBox {
            Location = new Point(18, 76), Size = new Size(530, 28), ReadOnly = true
        };
        browseFolder = new Button {
            Text = "选择文件夹…", Location = new Point(558, 74), Size = new Size(124, 31)
        };
        browseFolder.Click += (_, _) => ChooseFolder();
        sourceGroup.Controls.AddRange(new Control[] { artworkSource, artworkFolder, browseFolder,
            new Label {
                Text = "每次启动时重新读取所选来源；图片文件夹包含子文件夹。",
                Location = new Point(18, 116), Size = new Size(650, 24)
            }
        });
        Controls.Add(sourceGroup);

        var animation = new GroupBox {
            Text = "动画效果", Location = new Point(20, 185), Size = new Size(340, 125)
        };
        flip = new RadioButton {
            Text = "3D 翻转", Location = new Point(18, 30), Size = new Size(220, 30)
        };
        flow = new RadioButton {
            Text = "从左向右流动", Location = new Point(18, 73), Size = new Size(220, 30)
        };
        animation.Controls.AddRange(new Control[] { flip, flow });
        Controls.Add(animation);

        var rowGroup = new GroupBox {
            Text = "封面行数", Location = new Point(380, 185), Size = new Size(340, 125)
        };
        rows = new ComboBox {
            Location = new Point(18, 43), Size = new Size(300, 30),
            DropDownStyle = ComboBoxStyle.DropDownList
        };
        rows.Items.Add("自动");
        for (int i = 1; i <= 20; i++) rows.Items.Add($"{i} 行");
        rowGroup.Controls.Add(rows);
        Controls.Add(rowGroup);

        var speedGroup = new GroupBox {
            Text = "动画速度", Location = new Point(20, 332), Size = new Size(340, 160)
        };
        speed = new TrackBar {
            Location = new Point(18, 38), Size = new Size(300, 45),
            Minimum = 1, Maximum = 5, TickFrequency = 1
        };
        speedGroup.Controls.Add(speed);
        speedGroup.Controls.Add(new Label {
            Text = "慢                                                 快", Location = new Point(24, 95),
            Size = new Size(290, 24)
        });
        Controls.Add(speedGroup);

        var security = new GroupBox {
            Text = "退出屏保时的登录验证", Location = new Point(380, 332), Size = new Size(340, 160)
        };
        requireSignIn = new CheckBox {
            Text = "要求使用 Windows 账户登录", Location = new Point(18, 32),
            Size = new Size(300, 30)
        };
        security.Controls.Add(requireSignIn);
        security.Controls.Add(new Label {
            Text = "退出屏保时锁定 Windows，并同步系统的屏保登录选项。",
            Location = new Point(18, 70), Size = new Size(300, 65)
        });
        Controls.Add(security);

        var save = new Button {
            Text = "保存", Location = new Point(544, 545), Size = new Size(86, 35)
        };
        save.Click += (_, _) => SaveSettings();
        var cancel = new Button {
            Text = "取消", Location = new Point(644, 545), Size = new Size(86, 35)
        };
        cancel.Click += (_, _) => Close();
        Controls.AddRange(new Control[] { save, cancel });
        AcceptButton = save;
        CancelButton = cancel;

        if (SettingsManager.LoadAnimationType() == 1) flow.Checked = true;
        else flip.Checked = true;
        rows.SelectedIndex = SettingsManager.LoadRowCount();
        speed.Value = SettingsManager.LoadFlipSpeed();
        requireSignIn.Checked = SettingsManager.LoadRequireSignIn();
        artworkFolder.Text = SettingsManager.LoadArtworkFolder();
        artworkSource.SelectedIndex = SettingsManager.LoadArtworkSource();
    }

    private void ChooseFolder()
    {
        using var dialog = new FolderBrowserDialog {
            Description = "选择存放专辑封面图片的文件夹",
            UseDescriptionForTitle = true,
            SelectedPath = Directory.Exists(artworkFolder.Text) ? artworkFolder.Text : string.Empty
        };
        if (dialog.ShowDialog(this) == DialogResult.OK)
            artworkFolder.Text = dialog.SelectedPath;
    }

    private void SaveSettings()
    {
        if (artworkSource.SelectedIndex != 0 && !Directory.Exists(artworkFolder.Text))
        {
            MessageBox.Show("请先选择有效的图片文件夹。", "专辑封面来源",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }
        SettingsManager.SaveArtworkFolder(artworkFolder.Text);
        SettingsManager.SaveArtworkSource(artworkSource.SelectedIndex);
        SettingsManager.SaveDisplayMode(0);
        SettingsManager.SaveAnimationType(flow.Checked ? 1 : 0);
        SettingsManager.SaveRowCount(rows.SelectedIndex);
        SettingsManager.SaveFlipSpeed(speed.Value);
        SettingsManager.SaveRequireSignIn(requireSignIn.Checked);
        try
        {
            WindowsScreenSaverSecurity.SetEnabled(requireSignIn.Checked);
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                "本屏保的退出锁定选项已保存，但 Windows 系统选项未能同步。\n" + ex.Message,
                "屏保登录验证", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
        Close();
    }
}
