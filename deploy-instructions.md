# 🚀 Hostinger File Manager Deployment Instructions

## ✅ FIXED VERSION - UI Styling Issues Resolved

### 1. Files to Upload
**Use the NEW zip file: `whatsapp-dashboard-fixed.zip`**

Upload ALL files from the `out` directory to your Hostinger `public_html` folder:

**Required Files:**
- `index.html` (main page)
- `404.html` (error page)
- `favicon.ico` (website icon)
- All `.svg` files (icons)

**Required Directories:**
- `_next/` (JavaScript bundles and assets)
- `send/` (send messages page)
- `status/` (status page)
- `setup/` (setup page)
- `monitoring/` (monitoring page)
- `404/` (error page assets)

### 2. Hostinger File Manager Steps

1. **Login to Hostinger Control Panel**
   - Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Login with your credentials

2. **Open File Manager**
   - Click on "File Manager" in the left sidebar
   - Navigate to `public_html` folder

3. **Upload Files**
   - Click "Upload" button
   - Select ALL files from the `out` directory
   - Upload them to `public_html`

4. **Set Permissions** (if needed)
   - Right-click on files
   - Set permissions to 644 for files
   - Set permissions to 755 for directories

### 3. Environment Configuration

Since this is a static export, you need to configure your environment variables in the browser. 

**IMPORTANT:** Use the template from `environment-config.html` file.

1. Open `environment-config.html` and copy the script block
2. Edit `index.html` in Hostinger File Manager
3. Find the `</head>` tag
4. Paste the script just before `</head>`
5. Replace the placeholder values with your actual API details:

```html
<script>
window.ENV = {
  NEXT_PUBLIC_API_URL: 'https://your-backend-api-domain.com',
  NEXT_PUBLIC_API_KEY: 'your-actual-api-key-here'
};
</script>
```

### 4. Backend API Setup

Make sure your backend API is deployed and accessible at the URL you specify in the environment variables.

### 5. Test Your Deployment

Visit your domain to test:
- Main dashboard: `https://yourdomain.com/`
- Setup page: `https://yourdomain.com/setup/`
- Send page: `https://yourdomain.com/send/`
- Status page: `https://yourdomain.com/status/`
- Monitoring page: `https://yourdomain.com/monitoring/`

### 6. Troubleshooting

**If pages show 404:**
- Make sure all directories were uploaded
- Check that `_next` directory is complete

**If API calls fail:**
- Verify your backend API URL is correct
- Check CORS settings on your backend
- Ensure API key is valid

**If styling is broken:**
- Verify `_next` directory was uploaded completely
- Check browser console for missing assets

### 7. SSL Certificate

Enable SSL certificate in Hostinger:
- Go to "SSL" in control panel
- Enable "Free SSL Certificate"
- Wait for activation (usually 5-10 minutes)

## 🎯 Quick Upload Checklist

- [ ] **Use the NEW zip file: `whatsapp-dashboard-fixed.zip`**
- [ ] Upload and extract the zip file to `public_html`
- [ ] Edit `index.html` and add environment variables (see `environment-config.html`)
- [ ] Test all pages
- [ ] Enable SSL certificate

## 🔧 What Was Fixed

✅ **CSS Path Issues**: All absolute paths (`/_next/`) converted to relative paths (`./_next/`)  
✅ **JavaScript Path Issues**: All script sources now use relative paths  
✅ **Asset Loading**: Icons and other assets now load correctly  
✅ **UI Styling**: GitHub-inspired dark theme should now display properly 