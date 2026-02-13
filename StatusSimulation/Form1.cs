using Microsoft.Web.WebView2.Core;
using System.IO;

namespace StatusSimulation
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            InitializeWebView();
        }

        private async void InitializeWebView()
        {
            // 1. Initialize the WebView2 environment
            await webView21.EnsureCoreWebView2Async(null);

            // 2. Set up the local file mapping
            string rootFolder = Path.Combine(Application.StartupPath, "wwwroot");
            webView21.CoreWebView2.SetVirtualHostNameToFolderMapping(
                "app.local",
                rootFolder,
                CoreWebView2HostResourceAccessKind.Allow
            );

            // 3. Load the index.html from your local folder
            webView21.Source = new Uri("https://app.local/index.html");

            // Optional: Remove the browser context menu to make it feel like a real app
            webView21.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // All logic is now inside the WebView/JavaScript
        }
    }
}