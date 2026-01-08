# CV Website

A modern, responsive CV website for Aaron YingCai Sun, built with HTML, CSS, and JavaScript. This site can be easily deployed to GitHub Pages.

## Features

- Clean, modern design with smooth animations
- Fully responsive (mobile-friendly)
- Smooth scrolling navigation
- Professional layout optimized for CV content
- Easy to customize and update

## Setup for GitHub Pages

### Option 1: Create a dedicated repository (Recommended)

1. **Create a new repository on GitHub:**
   ```bash
   # On GitHub, create a new repository named: aaronsuns.github.io
   # Or use any name you prefer
   ```

2. **Initialize and push to GitHub:**
   ```bash
   cd cv-website
   git init
   git add .
   git commit -m "Initial commit: CV website"
   git branch -M main
   git remote add origin https://github.com/aaronsuns/aaronsuns.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Scroll down to **Pages** section
   - Under **Source**, select `main` branch and `/ (root)` folder
   - Click **Save**
   - Your site will be available at: `https://aaronsuns.github.io`

   **Note:** For free GitHub accounts, the repository must be **public** for GitHub Pages to work. If you want to keep it private, you'll need GitHub Pro/Team/Enterprise. Alternatively, you can use the site locally and export PDFs for job applications.

### Option 2: Use a subdirectory in existing repository

1. **Create a `gh-pages` branch:**
   ```bash
   git checkout -b gh-pages
   git add cv-website/
   git commit -m "Add CV website"
   git push origin gh-pages
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Select `gh-pages` branch and `/cv-website` folder
   - Your site will be at: `https://aaronsuns.github.io/aaron/cv-website/`

## CV Versions

This repository supports multiple CV versions for different job applications:

- **Default CV**: `data.json` - General purpose CV for most applications
- **Alternative CV**: `data-alt.json` - Tailored version for specific positions

**Access different versions:**
- Default: `index.html` or `index.html?cv=default`
- Alternative: `index.html?cv=alt`

See `CV_VERSIONS.md` for detailed information about CV versions and how to create custom versions.

## Customization

### Update Content

**Easy way (Recommended):** Edit `data.json` (or `data-alt.json` for alternative version) to update your CV content. All content is stored in JSON files, making it much easier to maintain:
- Personal information in the `profile` section
- About me paragraphs in the `about` array
- Experience entries in the `experience` array
- Projects in the `projects` array
- Skills in the `skills` array
- Education in the `education` array
- Contact information in the `contact` object

The website automatically renders all content from the JSON files - no need to edit HTML!

**Legacy way:** You can still edit `index.html` directly, but using `data.json` is much easier and cleaner.

### Update Styles

Modify `styles.css` to change:
- Colors (update CSS variables in `:root`)
- Fonts
- Layout and spacing
- Responsive breakpoints

### Update Functionality

Edit `script.js` to modify:
- Smooth scrolling behavior
- Scroll animations
- Interactive features

## Local Development

To view the website locally:

1. **Simple HTTP server (Python):**
   ```bash
   python3 -m http.server 8000
   ```
   Then open:
   - Default CV: http://localhost:8000/index.html
   - Alternative CV: http://localhost:8000/index.html?cv=alt

2. **Simple HTTP server (Node.js):**
   ```bash
   npx http-server -p 8000
   ```
   Then open:
   - Default CV: http://localhost:8000/index.html
   - Alternative CV: http://localhost:8000/index.html?cv=alt

3. **VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"
   - For alternative version, add `?cv=alt` to the URL in your browser

## File Structure

```
cv-website/
├── index.html         # Main HTML file (structure only, content from JSON)
├── data.json          # Default CV content (easy to edit!)
├── data-alt.json      # Alternative tailored CV content
├── renderer.js        # Renders content from JSON files
├── styles.css         # Stylesheet
├── script.js          # JavaScript for interactivity
├── profile.jpg        # Profile picture
├── favicon.svg        # Website favicon
├── CV_VERSIONS.md     # Guide for CV versions
└── README.md          # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Personal use - feel free to customize for your own CV!

## Contact

For questions or suggestions, please reach out via LinkedIn or email listed on the website.
