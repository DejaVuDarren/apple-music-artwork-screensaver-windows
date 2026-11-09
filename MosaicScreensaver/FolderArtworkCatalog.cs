namespace MosaicScreensaver;

internal static class FolderArtworkCatalog
{
    private static readonly HashSet<string> ImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"
    };

    internal static List<string> Load(string folder)
    {
        var urls = new List<string>();
        if (string.IsNullOrWhiteSpace(folder) || !Directory.Exists(folder)) return urls;

        try
        {
            var options = new EnumerationOptions
            {
                RecurseSubdirectories = true,
                IgnoreInaccessible = true,
                AttributesToSkip = FileAttributes.ReparsePoint
            };
            foreach (var path in Directory.EnumerateFiles(folder, "*", options))
            {
                if (!ImageExtensions.Contains(Path.GetExtension(path))) continue;
                var relative = Path.GetRelativePath(folder, path);
                var encoded = string.Join("/", relative.Split(Path.DirectorySeparatorChar)
                    .Select(Uri.EscapeDataString));
                urls.Add("https://userart.local/" + encoded);
            }
        }
        catch (IOException) { }
        catch (UnauthorizedAccessException) { }
        return urls;
    }
}
