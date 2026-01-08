# CV Versions Guide

This repository supports multiple versions of your CV for different job applications.

## Available Versions

### Default CV
- **File**: `data.json`
- **URL**: `index.html` or `index.html?cv=default`
- **Use for**: General job applications

### Alternative Tailored CV
- **File**: `data-alt.json`
- **URL**: `index.html?cv=alt`
- **Use for**: Specific job applications requiring tailored emphasis on certain skills

## How to Use

### Viewing Different Versions

1. **Default CV**: Open `index.html` in your browser or visit your GitHub Pages URL
2. **Alternative CV**: Add `?cv=alt` to the URL, e.g., `index.html?cv=alt` or `https://yourusername.github.io/?cv=alt`

### Creating a PDF

1. Open the desired CV version in your browser
2. Use the print icon in the header (or press Ctrl+P / Cmd+P)
3. Save as PDF

### For Job Applications

When applying to positions requiring specific skill emphasis:
- Use the alternative version: `index.html?cv=alt`
- Export as PDF and attach to your application
- The alternative version emphasizes:
  - Java development experience
  - System design and data flows
  - Business process automation
  - Front-end development (TypeScript, JavaScript, HTML/CSS)
  - OpenShift, Kubernetes experience
  - Terraform and infrastructure as code
  - AI/ML experience (with willingness to learn LLM/Prompt Engineering)
  - Tech Lead experience
  - Scrum/Agile experience

## Customizing for Other Positions

To create a new tailored version:

1. Copy `data-alt.json` to `data-[version].json`
2. Modify the content to emphasize relevant skills and experience
3. Update `renderer.js` to support the new version:
   ```javascript
   if (cvVersion === 'alt') {
       dataFile = 'data-alt.json';
   } else if (cvVersion === '[version]') {
       dataFile = 'data-[version].json';
   }
   ```
4. Access it via `index.html?cv=[version]`

## Key Differences in Alternative Version

The alternative version has been tailored to emphasize:

1. **Java** - Moved to first position in programming languages
2. **System Design & Data Flows** - Added as explicit skills and emphasized in experience descriptions
3. **Business Process Automation** - Highlighted throughout experience and projects
4. **Front-End Development** - Explicitly mentioned TypeScript, JavaScript, HTML/CSS
5. **OpenShift** - Emphasized in relevant experience
6. **Terraform** - Highlighted in infrastructure skills
7. **AI/ML** - Emphasized AI search POC experience, with willingness to learn LLM/Prompt Engineering
8. **Tech Lead** - Explicitly mentioned team leadership experience
9. **Scrum/Agile** - Highlighted in relevant positions
10. **MongoDB, Kafka, GCP** - Added as "willing to learn" to show openness

The general CV (`data.json`) remains unchanged for other applications.

