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

## Customization

### Update Content

Edit `index.html` to update your CV content:
- Personal information in the header
- Experience sections
- Skills
- Education
- Contact information

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
   cd cv-website
   python3 -m http.server 8000
   ```
   Then open: http://localhost:8000

2. **Simple HTTP server (Node.js):**
   ```bash
   cd cv-website
   npx http-server -p 8000
   ```

3. **VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

## File Structure

```
cv-website/
├── index.html      # Main HTML file
├── styles.css      # Stylesheet
├── script.js       # JavaScript for interactivity
└── README.md       # This file
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
