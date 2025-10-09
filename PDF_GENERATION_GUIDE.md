# ALX Tech Club - PDF Generation Guide

## 📄 How to Generate the Volunteer Guide PDF

This guide explains how to create a professional PDF from the `volunteer-guide.html` file.

---

## Method 1: Using Browser Print to PDF (Recommended)

### Step-by-Step Instructions:

1. **Open the Volunteer Guide**

   - Open `volunteer-guide.html` in your web browser (Chrome, Firefox, or Edge recommended)
   - Alternatively, click the "Download Volunteer Guide" button on the main website

2. **Click the Print Button**

   - On the volunteer guide page, click the purple **"Download as PDF"** button
   - This will automatically open your browser's print dialog

3. **Configure Print Settings**

   - **Destination:** Select "Save as PDF" or "Microsoft Print to PDF"
   - **Layout:** Portrait
   - **Paper size:** A4
   - **Margins:** None (or minimum)
   - **Background graphics:** ✅ ENABLED (very important for colors!)
   - **Scale:** 100% (default)

4. **Save the PDF**
   - Click "Save" or "Print"
   - Choose your save location
   - Name it: `ALX_Tech_Club_Volunteer_Guide.pdf`

### Browser-Specific Tips:

#### Google Chrome:

- Press `Ctrl+P` (or Cmd+P on Mac) after opening the file
- Enable "Background graphics" in "More settings"
- Destination: "Save as PDF"

#### Mozilla Firefox:

- Press `Ctrl+P` (or Cmd+P on Mac)
- Check "Print backgrounds (colors & images)"
- Destination: "Microsoft Print to PDF" or "Save to PDF"

#### Microsoft Edge:

- Press `Ctrl+P` (or Cmd+P on Mac)
- Enable "Background graphics"
- Printer: "Microsoft Print to PDF"

---

## Method 2: Using the Website Workflow

### User Journey:

1. **Visit the Main Website**

   - Users land on `index.html`
   - See the "Before You Apply" section

2. **Download the Guide**

   - Click "Download Volunteer Guide" button
   - Opens `volunteer-guide.html` in new tab

3. **Generate PDF**

   - Read through the guide
   - Click "Download as PDF" button on the guide page
   - Browser opens print dialog
   - Save as PDF to device

4. **Apply**
   - Return to main website tab
   - Scroll down to "Application Form" section
   - Fill out Google Form

---

## File Structure

```
Club_tech_hiring/
├── index.html                      # Main landing page with download button
├── volunteer-guide.html            # PDF-ready HTML page
├── volunteer-guide-styles.css      # Print-optimized styles
├── styles.css                      # Main website styles
├── script.js                       # Interactive features
└── images/
    ├── ALX_White_1000px.png       # White logo for cover
    └── logo_black.png             # Black logo for content
```

---

## PDF Features

### Page Layout:

- **Cover Page:** Purple gradient with ALX logo and club title
- **Page 1:** About Us and Mission & Values
- **Page 2-3:** Volunteer Roles (6 roles with icons and details)
- **Page 4:** Benefits and Club Statistics
- **Back Cover:** Application steps and contact information

### Design Elements:

- ✅ Purple gradient theme matching website (#6366f1, #8b5cf6, #a855f7)
- ✅ Professional typography (Inter font family)
- ✅ Font Awesome icons throughout
- ✅ Print-optimized page breaks
- ✅ High-contrast colors for readability
- ✅ ALX branding on every page

### Volunteer Roles Included:

1. **Graphic Designer** - Visual content creation
2. **Video Editor** - Video content production
3. **Photographer** - Event photography
4. **Event Coordinator** - Event planning and management
5. **Community Moderator** - Online community management
6. **Speaker Relations** - Guest speaker coordination

---

## Troubleshooting

### Problem: Colors not appearing in PDF

**Solution:** Make sure "Background graphics" or "Print backgrounds" is ENABLED in print settings

### Problem: Page breaks in wrong places

**Solution:** Use Chrome or Edge browser - they handle CSS page breaks better than Firefox

### Problem: Logo images not showing

**Solution:** Ensure `images/ALX_White_1000px.png` and `images/logo_black.png` exist in the images folder

### Problem: PDF is too large

**Solution:** This is normal for print-quality PDFs with gradients. File size should be 500KB-2MB

### Problem: Print button not working

**Solution:** Check that JavaScript is enabled in your browser

---

## Quality Checklist

Before sharing the PDF, verify:

- ✅ All 6 volunteer roles are visible
- ✅ Purple gradient colors appear correctly
- ✅ ALX logos display on cover and back cover
- ✅ Font Awesome icons render properly
- ✅ Page breaks are clean (no cut-off content)
- ✅ Text is readable and high contrast
- ✅ Contact information is correct on back cover
- ✅ All 8 pages are included (cover + 6 content + back)

---

## Deployment Notes

### For Web Hosting:

1. Upload all files to web server
2. Ensure correct file paths for images
3. Test the complete workflow:
   - Main page → Download button → Guide page → Print to PDF

### For Distribution:

- Share the generated PDF file directly with potential volunteers
- Or share the website link and let users generate their own PDF
- The HTML approach ensures everyone gets the latest version

---

## Technical Details

### CSS Print Rules:

```css
@media print {
  .no-print {
    display: none !important;
  }
  * {
    -webkit-print-color-adjust: exact;
  }
}

@page {
  size: A4;
  margin: 0;
}
```

### Browser Compatibility:

- ✅ Chrome 90+ (Best print quality)
- ✅ Edge 90+ (Excellent support)
- ✅ Firefox 88+ (Good support)
- ✅ Safari 14+ (Good support, may need manual backdrop-filter)

---

## Support

If you encounter issues:

1. Try a different browser (Chrome recommended)
2. Clear browser cache and reload
3. Ensure all image files are in the correct location
4. Check that volunteer-guide-styles.css is loading properly

---

## Updates & Maintenance

To update the volunteer guide content:

1. Edit `volunteer-guide.html` for content changes
2. Edit `volunteer-guide-styles.css` for styling changes
3. Update `ALX_Tech_Club_Documentation.md` to keep source in sync
4. Regenerate PDF to test changes

---

**Created for ALX Morocco Tech Club**  
_Where Innovation Meets Community_

#ALXMorocco #TechClub #Volunteer #DoHardThings
