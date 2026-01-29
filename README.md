# Grant Master - AI-Powered Contract Review System

A professional web application for automated grant contract review and analysis based on your organization's checklist criteria.

## 🌟 Features

- **AI-Powered Analysis**: Automatically analyzes contracts against 58+ checklist items
- **Smart Flag Detection**: Identifies red flags (critical) and orange flags (needs attention)
- **Professional Reports**: Generates comprehensive email reports with findings
- **Beautiful Interface**: Modern, responsive design that works on all devices
- **Easy to Use**: Drag-and-drop file upload or click to browse
- **One-Click Copy**: Copy email reports directly to clipboard

## 📋 What It Does

The Grant Master reviews your contract documents against these categories:
- Basic Contractual Information (14 items)
- Legal Conditions (15 items)
- Financial Conditions (14 items)
- Reporting Requirements (7 items)
- Partnership and Sub Grants (4 items)
- Human Resources (3 items)
- Communications and Visibility (1 item)

## 🚀 Step-by-Step Setup on GitHub Pages (100% FREE)

### Step 1: Create a GitHub Account
1. Go to [github.com](https://github.com)
2. Click "Sign up" (if you don't have an account)
3. Or "Sign in" if you already have one

### Step 2: Create a New Repository
1. Click the **"+"** icon in the top-right corner
2. Select **"New repository"**
3. Name your repository: `grant-master` (or any name you prefer)
4. Choose **"Public"** (required for free GitHub Pages)
5. Check **"Add a README file"**
6. Click **"Create repository"**

### Step 3: Upload Your Files
1. In your new repository, click **"Add file"** → **"Upload files"**
2. Drag and drop these three files (provided separately):
   - `index.html`
   - `app.js`
   - `checklist-data.js`
3. Scroll down and click **"Commit changes"**

### Step 4: Enable GitHub Pages
1. In your repository, click **"Settings"** (top menu)
2. Scroll down the left sidebar and click **"Pages"**
3. Under "Source", select **"Deploy from a branch"**
4. Under "Branch", select **"main"** and **"/ (root)"**
5. Click **"Save"**

### Step 5: Access Your Site
1. Wait 1-2 minutes for deployment
2. Refresh the Settings → Pages page
3. You'll see: **"Your site is live at https://[your-username].github.io/grant-master/"**
4. Click the link to open your application!

### Step 6: Share Your Link
Your Grant Master is now live at:
```
https://[YOUR-GITHUB-USERNAME].github.io/grant-master/
```

## 📱 How to Use the Application

1. **Open the application** in your web browser
2. **Upload a contract** by:
   - Dragging and dropping a file onto the upload area, OR
   - Clicking "Select File" to browse your computer
3. **Wait for analysis** (takes a few seconds)
4. **Review the results**:
   - Contract information summary
   - Overall statistics
   - Detailed findings by category
   - Red and orange flags highlighted
5. **Copy the email report** with one click
6. **Analyze another contract** using the reset button

## 🎨 Customization Options

### Change Colors
Edit `index.html` and find the `<style>` section. Look for these lines:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Replace the color codes with your preferred colors.

### Update Title
In `index.html`, find:
```html
<h1>📋 Grant Master</h1>
```
Change "Grant Master" to your preferred name.

### Add Your Logo
Add this code inside the header section in `index.html`:
```html
<img src="your-logo.png" alt="Logo" style="width: 100px; margin-bottom: 20px;">
```

## 🔧 Advanced: Integrate Real AI Analysis

The current version uses simulated analysis. To add real AI:

1. **Get Claude API Access**:
   - Sign up at [console.anthropic.com](https://console.anthropic.com)
   - Get your API key

2. **Update `app.js`**:
   Replace the `analyzeContract` function with actual API calls to Claude.

3. **Example API Integration**:
```javascript
async function analyzeContract(text) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'YOUR_API_KEY',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 4096,
            messages: [{
                role: 'user',
                content: `Analyze this contract against the checklist: ${text}`
            }]
        })
    });
    
    const data = await response.json();
    // Process data.content
}
```

**Note**: For security, never expose API keys in client-side code. Use a backend server.

## 📚 File Structure

```
grant-master/
├── index.html          # Main HTML page with UI
├── app.js             # JavaScript application logic
├── checklist-data.js  # Contract review checklist data
└── README.md          # This file
```

## 🆘 Troubleshooting

**Problem**: Page not loading after deployment
- **Solution**: Wait 2-3 minutes, then hard refresh (Ctrl+F5 or Cmd+Shift+R)

**Problem**: Files not uploading to repository
- **Solution**: Make sure files are under 100MB and you're uploading to the main branch

**Problem**: Site shows 404 error
- **Solution**: Check Settings → Pages is enabled and set to "main" branch

**Problem**: Changes not appearing
- **Solution**: Wait 1-2 minutes for rebuild, then clear browser cache

## 💡 Tips

1. **Bookmark your site** for easy access
2. **Test with sample contracts** before using with real documents
3. **Review AI findings** manually - the AI is a helpful assistant, not a replacement
4. **Keep checklist updated** by editing `checklist-data.js`
5. **Share the link** with your team members

## 🔒 Privacy & Security

- All processing happens in your browser (client-side)
- No data is sent to external servers (unless you add AI integration)
- Contracts are not stored or saved anywhere
- Safe to use with confidential documents

## 📝 License

Free to use and modify for your organization.

## 🤝 Support

For questions or issues:
1. Check the Troubleshooting section above
2. Review GitHub Pages documentation
3. Contact your IT department for technical assistance

---

**Built with ❤️ for efficient grant management**

Last Updated: January 2026
