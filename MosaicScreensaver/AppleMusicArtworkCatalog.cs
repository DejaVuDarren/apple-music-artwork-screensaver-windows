using System.Runtime.InteropServices;

namespace MosaicScreensaver;

// Read Apple Music's own artwork index. The library and cache are never modified.
internal static class AppleMusicArtworkCatalog
{
    private const int SqliteOpenReadOnly = 0x00000001;
    private const int SqliteRow = 100;
    private const string Query = @"
        SELECT DISTINCT c.artwork_id, c.size_kind, c.extension
        FROM cache_items AS c
        JOIN item_to_artwork AS i ON i.artwork_id = c.artwork_id
        WHERE i.source_kind IN (6, 12) AND c.status = 1";

    internal static (string Folder, List<string> Urls) Load()
    {
        var folder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
            "Music", "Apple Music", "Apple Music Library.musiclibrary", "artwork");
        var db = Path.Combine(Path.GetDirectoryName(folder)!, "artwork.sqlite");
        var urls = new List<string>();
        if (!Directory.Exists(folder) || !File.Exists(db)) return (folder, urls);

        IntPtr connection = IntPtr.Zero;
        IntPtr statement = IntPtr.Zero;
        try
        {
            if (sqlite3_open_v2(db, out connection, SqliteOpenReadOnly, IntPtr.Zero) != 0)
                return (folder, urls);
            if (sqlite3_prepare_v2(connection, Query, -1, out statement, IntPtr.Zero) != 0)
                return (folder, urls);

            while (sqlite3_step(statement) == SqliteRow)
            {
                var id = Marshal.PtrToStringUTF8(sqlite3_column_text(statement, 0));
                var kind = sqlite3_column_int(statement, 1);
                var extension = Marshal.PtrToStringUTF8(sqlite3_column_text(statement, 2));
                if (id is null || extension is null || !Guid.TryParse(id, out _)) continue;
                if (extension != "jpeg" && extension != "jpg" && extension != "png") continue;
                var fileName = $"{id}_sk{kind}.{extension}";
                if (File.Exists(Path.Combine(folder, fileName)))
                    urls.Add("https://applemusic.local/" + Uri.EscapeDataString(fileName));
            }
        }
        finally
        {
            if (statement != IntPtr.Zero) sqlite3_finalize(statement);
            if (connection != IntPtr.Zero) sqlite3_close(connection);
        }
        return (folder, urls);
    }

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.Cdecl)]
    private static extern int sqlite3_open_v2(
        [MarshalAs(UnmanagedType.LPUTF8Str)] string filename,
        out IntPtr db, int flags, IntPtr vfs);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.Cdecl)]
    private static extern int sqlite3_prepare_v2(
        IntPtr db, [MarshalAs(UnmanagedType.LPUTF8Str)] string sql,
        int bytes, out IntPtr statement, IntPtr tail);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.Cdecl)]
    private static extern int sqlite3_step(IntPtr statement);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.Cdecl)]
    private static extern IntPtr sqlite3_column_text(IntPtr statement, int index);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.Cdecl)]
    private static extern int sqlite3_column_int(IntPtr statement, int index);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.Cdecl)]
    private static extern int sqlite3_finalize(IntPtr statement);

    [DllImport("winsqlite3.dll", CallingConvention = CallingConvention.Cdecl)]
    private static extern int sqlite3_close(IntPtr db);
}
