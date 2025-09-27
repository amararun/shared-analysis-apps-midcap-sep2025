# Midcap Analysis Dashboard - Architecture Documentation

## Overview
A single-page HTML application that analyzes mutual fund portfolio holdings across top midcap funds, comparing May 2025 vs August 2025 data. Built as a self-contained web app with embedded data and JavaScript.

## Architecture Pattern
**Single Page Application (SPA)** with build-time asset bundling

## File Structure
```
├── index.html              # Main template with UI structure
├── data.js                 # Portfolio data (3,300+ records)
├── app.js                  # Main application logic (current production)
├── app_simple.js           # Simplified version
├── app_fixed.js            # Enhanced version with advanced features
├── build.js                # Build script for bundling
└── midcap-analysis-dashboard.html  # Final bundled output
```

## Core Components

### 1. Data Layer (`data.js`)
- **Format**: JavaScript array of objects
- **Size**: ~3,300 records
- **Structure**: Each record contains:
  - `name`: Company name
  - `mktvalmay%` / `mktvalaug%`: Market value percentages (decimal format)
  - `mv%change` / `qty%change`: Percentage changes
  - `numofmfmaymv` / `numofmfaugmv`: Mutual fund counts
  - `mktvalmay2025` / `mktvalaug2025`: Raw market values (₹ Lakhs)
  - `qtymay2025` / `qtyaug2025`: Quantities
  - `comment`: Special annotations

### 2. UI Layer (`index.html`)
- **Framework**: Vanilla HTML + Tailwind CSS
- **Charts**: Chart.js for data visualization
- **Table**: Tabulator.js for interactive data grid
- **Icons**: Font Awesome 6.0.0
- **Responsive**: Mobile-first design

### 3. Application Logic (`app.js`)
- **Table Management**: Tabulator configuration with 13 columns
- **Advanced Filtering**: Custom filter functions with operators (>, <, =, >=, <=, between)
- **Charts**: 2 Chart.js visualizations (top holdings, fund comparison)
- **Export**: CSV download functionality with manual CSV generation
- **Quick Filters**: 6 predefined analysis views (top holdings, increases, decreases, entries, exits)
- **Keyboard Shortcuts**: Ctrl+F for search, Escape to clear filters
- **Notifications**: Success/error messages for user feedback
- **Validation**: Data totals calculation and display

### 4. Build System (`build.js`)
- **Purpose**: Bundles all assets into single HTML file
- **Process**: 
  1. Reads `index.html` template
  2. Injects `data.js` content into `<!-- DATA_PLACEHOLDER -->`
  3. Injects `app.js` content into `<!-- APP_PLACEHOLDER -->`
  4. Outputs `midcap-analysis-dashboard.html`

## Key Features

### Data Table (Tabulator.js)
- **Columns**: 13 data columns with custom formatters
- **Filtering**: Advanced numeric filters with operators (`>`, `<`, `=`, `>=`, `<=`)
- **Sorting**: Multi-column sorting capability
- **Pagination**: 10/25/50/100 records per page
- **Export**: CSV download with all data

### Charts (Chart.js)
1. **Top Holdings Chart**: Horizontal bar chart showing top 5 holdings
2. **Fund Comparison Chart**: Grouped bar chart comparing fund market values

### Quick Analysis Filters
- **Top Holdings Aug**: Sort by August market value percentage (descending)
- **Top Holdings May**: Sort by May market value percentage (descending)
- **Holdings Up**: Filter quantity increases, sorted by change (descending)
- **Holdings Down**: Filter quantity decreases, sorted by change (ascending)
- **New Entries**: Companies with August holdings but no May holdings
- **Exits**: Companies with May holdings but no August holdings
- **Clear Filters**: Reset all filters and sorting

### Data Processing
- **Percentage Conversion**: Decimal to percentage display (0.051 → 5.1%)
- **Color Coding**: Green for positive changes, red for negative
- **Number Formatting**: Indian number format with commas
- **Currency**: ₹ symbol for monetary values

## Technical Dependencies

### External Libraries (CDN)
- **Tailwind CSS**: 3.x (utility-first CSS framework)
- **Tabulator.js**: 5.5.2 (data table)
- **Chart.js**: Latest (data visualization)
- **Font Awesome**: 6.0.0 (icons)

### Browser Support
- Modern browsers with ES6+ support
- Canvas API for charts
- File API for downloads

## Data Flow

1. **Load**: `midcapData` array loaded from `data.js`
2. **Initialize**: Tabulator table created with data
3. **Render**: Charts initialized with hardcoded data
4. **Interact**: User filters/sorts data
5. **Export**: Filtered data exported as CSV

## Build Process

```bash
node build.js
```

**Input Files:**
- `index.html` (template)
- `data.js` (data)
- `app.js` (logic)

**Output:**
- `midcap-analysis-dashboard.html` (self-contained)

## Development Notes

### App Versions
- `app_simple.js`: Basic functionality, minimal features (4 columns)
- `app.js`: Current production version (13 columns, full features)
- `app_fixed.js`: Enhanced version with advanced filtering (13 columns)

### Custom Filter Functions
- `percentageFilterFunc`: Handles percentage data with operators
- `numericFilterFunc`: Handles numeric data with operators

### Styling
- Custom Tailwind configuration for indigo color scheme
- Responsive design with mobile breakpoints
- Custom Tabulator styling for professional appearance

## Deployment
Single HTML file can be deployed to any web server or opened directly in browser. No server-side dependencies required.

## Performance Considerations
- Data loaded synchronously (3,300 records)
- Charts rendered after DOM ready
- Pagination limits DOM nodes
- Local filtering for responsiveness

## Future Enhancements
- Dynamic chart data from table
- Real-time data updates
- Additional chart types
- Advanced analytics features
- Data validation and error handling
