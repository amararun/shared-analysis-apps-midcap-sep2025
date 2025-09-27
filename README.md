# Midcap Analysis Dashboard

A single-page HTML application that analyzes mutual fund portfolio holdings across top midcap funds, comparing May 2025 vs August 2025 data. Built as a self-contained web app with embedded data and JavaScript.

## Tigzig Analyst Platform 
This app is part of Tigzig Analyst platform with 25+ apps for analytics and data science.  
[app.tigzig.com](https://app.tigzig.com)  
For any questions, reach out to me at [amar@harolikar.com](mailto:amar@harolikar.com)

## 🚀 Features

- **Interactive Data Table**: Built with Tabulator.js for professional-grade functionality
- **Advanced Filtering**: Numeric filters with operators (>, <, =, >=, <=, between)
- **Quick Analysis**: 6 predefined filter views (top holdings, increases, decreases, entries, exits)
- **Charts**: 2 Chart.js visualizations (top holdings, fund comparison)
- **Export**: One-click CSV download with timestamp
- **Keyboard Shortcuts**: Ctrl+F for search, Escape to clear filters
- **Mobile Responsive**: Optimized for all device sizes
- **Self-Contained**: Single HTML file with no external dependencies

## 📊 Data Columns (13 Total)

- **Company Name**: Searchable text field (frozen column)
- **Comment**: Special notes (Bonus, Split, Rights, etc.)
- **Market Value %**: May and August percentages with numeric filtering
- **Change Metrics**: MV % Change and Qty % Change with color coding
- **Mutual Fund Holdings**: Number of funds holding each stock (4 columns)
- **Market Values**: Absolute values in ₹ with proper formatting (2 columns)
- **Quantities**: Share quantities with thousand separators (2 columns)

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN)
- **Table Library**: Tabulator.js v5.5.2
- **Charts**: Chart.js (CDN)
- **Icons**: Font Awesome 6.0.0
- **Build Tool**: Node.js script
- **Architecture**: Single Page Application with build-time bundling

## 📁 Project Structure

```
project/
├── index.html                    # Main template with UI structure
├── data.js                      # Portfolio data (3,300+ records)
├── app.js                       # Main application logic (current production)
├── app_simple.js                # Simplified version (4 columns)
├── app_fixed.js                 # Enhanced version (13 columns)
├── build.js                     # Build script for bundling
├── midcap-analysis-dashboard.html # Final single-file output
└── README.md                    # This file
```

## 🏗️ Architecture

This is a **Single Page Application (SPA)** with build-time asset bundling. The build process combines all assets into a single HTML file for easy deployment and distribution.

**For detailed architecture information, see:** [docs/app-architecture.md](docs/app-architecture.md)

## 🚀 Quick Start

### Development Mode
1. Open `index.html` in a web browser
2. The page will load with all functionality

### Production Build
1. Run the build script: `node build.js`
2. Use `midcap-analysis-dashboard.html` - a single file containing everything

## 🎯 Usage

### Quick Analysis Filters
- **Top Holdings**: Sort by market value percentage (May/Aug)
- **Holdings Up/Down**: Filter quantity increases/decreases
- **New Entries**: Companies with August holdings but no May holdings
- **Exits**: Companies with May holdings but no August holdings

### Advanced Filtering
- **Text Search**: Click on any column header filter
- **Numeric Filters**: Use operators like `> 0.01` or `between 0.001 and 0.01`
- **Clear Filters**: Press `Escape` key or use "Clear Filters" button

### Export
- Click the "Export Data Table" button
- File downloads with timestamp: `midcap-analysis-YYYY-MM-DD.csv`

### Keyboard Shortcuts
- `Ctrl/Cmd + F`: Focus search
- `Escape`: Clear all filters

## 📱 Mobile Features

- **Responsive Design**: Automatically adjusts to screen size
- **Column Hiding**: Less important columns hidden on mobile
- **Touch-Friendly**: Optimized for touch interactions
- **Horizontal Scroll**: Table scrolls horizontally on small screens

## 🔧 Customization & Extensions

### Updating with New Data
1. **Convert CSV to JSON**: Update `data.js` with new portfolio data
2. **Modify Table Headers**: Update column titles in `app.js` to match new periods
3. **Update Chart Data**: Modify hardcoded chart values in `app.js`
4. **Rebuild**: Run `node build.js` to generate new single HTML file

### Styling
- Modify Tailwind classes in `index.html`
- Custom CSS in the `<style>` section
- Tabulator styling in `app.js`

### Columns
- Modify column configuration in `app.js`
- Add/remove fields as needed
- Update filter functions for new data types

## 📊 Data Format

The data is structured as an array of objects with these fields:
```javascript
{
  "name": "Company Name",
  "mktvalmay%": 0.001457346083977369,
  "mktvalaug%": 0.001447319053462447,
  "mv%change": 0.05072587375912474,
  "qty%change": 0.0,
  "numofmfmaymv": 2,
  "numofmfaugmv": 2,
  "numofmfmayqty": 2,
  "numofmfaugqty": 2,
  "mktvalmay2025": 33653.0763,
  "mktvalaug2025": 35360.157999999996,
  "qtymay2025": 114955.0,
  "qtyaug2025": 114955.0,
  "comment": ""
}
```

## 🔧 Build Process

The build script (`build.js`) performs these steps:
1. Reads the HTML template
2. Inlines the data and application JavaScript
3. Combines everything into a single HTML file
4. Validates the build
5. Reports file size and build time

## 📈 Performance

- **File Size**: ~150 KB (single HTML file)
- **Load Time**: < 2 seconds on average connection
- **Data Size**: 3,300+ companies with 13 columns each
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Self-Contained**: No external dependencies, works offline

## 🚀 Deployment

### Single File Deployment
1. Upload `midcap-analysis-dashboard.html` to any web server
2. Access directly via URL
3. No additional files needed

### Embedding
```html
<iframe src="midcap-analysis-dashboard.html" 
        width="100%" 
        height="800px" 
        frameborder="0">
</iframe>
```

## 🐛 Troubleshooting

### Common Issues
- **Data not loading**: Check browser console for JavaScript errors
- **Filters not working**: Ensure Tabulator.js loaded correctly
- **Export not working**: Check browser download permissions
- **Mobile issues**: Clear browser cache and reload

### Debug Mode
- Open browser developer tools
- Access `window.midcapTable` for Tabulator instance
- Check console for error messages

## 📝 License

This project is for portfolio analysis and educational purposes only.

## 👨‍💻 Author

**Amar Harolikar**  
Specialist - Decision Sciences & Applied Generative AI

- LinkedIn: [amarharolikar](https://www.linkedin.com/in/amarharolikar)
- GitHub: [amararun](https://github.com/amararun)

---

*Built with ❤️ using Tabulator.js and Tailwind CSS*
