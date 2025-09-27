// Midcap Analysis Dashboard - Fixed Tabulator.js Application
document.addEventListener('DOMContentLoaded', function() {

    // Percentage filter function that works with displayed values (e.g., 5.1% entered as 5.1)
    function percentageFilterFunc(headerValue, rowValue, rowData, filterParams) {
        if (!headerValue) return true;

        let value = parseFloat(rowValue);
        if (isNaN(value)) return false;

        // Convert decimal to percentage for comparison (0.051 becomes 5.1)
        value = value * 100;

        // Check for operators
        if (headerValue.includes('>=')) {
            const threshold = parseFloat(headerValue.replace('>=', '').trim());
            return !isNaN(threshold) && value >= threshold;
        }
        if (headerValue.includes('<=')) {
            const threshold = parseFloat(headerValue.replace('<=', '').trim());
            return !isNaN(threshold) && value <= threshold;
        }
        if (headerValue.includes('>')) {
            const threshold = parseFloat(headerValue.replace('>', '').trim());
            return !isNaN(threshold) && value > threshold;
        }
        if (headerValue.includes('<')) {
            const threshold = parseFloat(headerValue.replace('<', '').trim());
            return !isNaN(threshold) && value < threshold;
        }
        if (headerValue.includes('=')) {
            const threshold = parseFloat(headerValue.replace('=', '').trim());
            return !isNaN(threshold) && Math.abs(value - threshold) < 0.01;
        }
        // Default: try exact match
        const threshold = parseFloat(headerValue);
        return !isNaN(threshold) ? Math.abs(value - threshold) < 0.01 : false;
    }

    // Regular numeric filter function
    function numericFilterFunc(headerValue, rowValue, rowData, filterParams) {
        if (!headerValue) return true;
        const value = parseFloat(rowValue);
        if (isNaN(value)) return false;

        // Check for operators
        if (headerValue.includes('>=')) {
            const threshold = parseFloat(headerValue.replace('>=', '').trim());
            return !isNaN(threshold) && value >= threshold;
        }
        if (headerValue.includes('<=')) {
            const threshold = parseFloat(headerValue.replace('<=', '').trim());
            return !isNaN(threshold) && value <= threshold;
        }
        if (headerValue.includes('>')) {
            const threshold = parseFloat(headerValue.replace('>', '').trim());
            return !isNaN(threshold) && value > threshold;
        }
        if (headerValue.includes('<')) {
            const threshold = parseFloat(headerValue.replace('<', '').trim());
            return !isNaN(threshold) && value < threshold;
        }
        if (headerValue.includes('=')) {
            const threshold = parseFloat(headerValue.replace('=', '').trim());
            return !isNaN(threshold) && Math.abs(value - threshold) < 0.0001;
        }
        // Default: try exact match or contains
        const threshold = parseFloat(headerValue);
        return !isNaN(threshold) ? Math.abs(value - threshold) < 0.0001 : String(rowValue).toLowerCase().includes(headerValue.toLowerCase());
    }

    // Initialize Tabulator with comprehensive configuration
    const table = new Tabulator("#data-table", {
        data: midcapData,
        layout: "fitData",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 25, 50, 100],
        paginationCounter: "rows",
        movableColumns: true,
        resizableColumns: true,
        responsiveLayout: false,
        placeholder: "No data available",

        // Column configuration with proper field mapping
        columns: [
            {
                title: "Company Name",
                field: "name",
                sorter: "string",
                minWidth: 180,
                width: 200,
                frozen: true,
                headerFilter: "input",
                headerFilterPlaceholder: "Search companies...",
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (!value) return "";
                    return value.length > 30 ? value.substring(0, 30) + "..." : value;
                }
            },
            {
                title: "Comment",
                field: "comment",
                sorter: "string",
                minWidth: 60,
                width: 80,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter comments",
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (!value || value.trim() === "") return "";
                    return `<span style="background: #fef3c7; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">${value}</span>`;
                },
                tooltip: "Special comments (Bonus, Split, Rights, etc.)"
            },
            {
                title: "Mkt Val<br>Aug %",
                field: "mktvalaug%",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by %",
                headerFilterFunc: percentageFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "";
                    return (value * 100).toFixed(1) + "%";
                },
                tooltip: "Market Value Percentage - August 2025"
            },
            {
                title: "Mkt Val<br>May %",
                field: "mktvalmay%",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by %",
                headerFilterFunc: percentageFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "";
                    return (value * 100).toFixed(1) + "%";
                },
                tooltip: "Market Value Percentage - May 2025"
            },
            {
                title: "MV %<br>Change",
                field: "mv%change",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by %",
                headerFilterFunc: percentageFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "N/A";
                    const formatted = (value * 100).toFixed(1) + "%";
                    return value >= 0 ?
                        `<span style="color: #10b981;">${formatted}</span>` :
                        `<span style="color: #ef4444;">${formatted}</span>`;
                },
                tooltip: "Market Value Percentage Change"
            },
            {
                title: "Qty %<br>Change",
                field: "qty%change",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by %",
                headerFilterFunc: percentageFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "N/A";
                    const formatted = (value * 100).toFixed(1) + "%";
                    return value >= 0 ?
                        `<span style="color: #10b981;">${formatted}</span>` :
                        `<span style="color: #ef4444;">${formatted}</span>`;
                },
                tooltip: "Quantity Percentage Change"
            },
            {
                title: "Num of MF<br>Aug - MV",
                field: "numofmfaugmv",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter",
                headerFilterFunc: numericFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "";
                    return Number(value).toLocaleString();
                },
                tooltip: "Number of Mutual Funds - August Market Value"
            },
            {
                title: "Num of MF<br>May - MV",
                field: "numofmfmaymv",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter",
                headerFilterFunc: numericFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "";
                    return Number(value).toLocaleString();
                },
                tooltip: "Number of Mutual Funds - May Market Value"
            },
            {
                title: "Num of MF<br>Aug - Qty",
                field: "numofmfaugqty",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter",
                headerFilterFunc: numericFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "";
                    return Number(value).toLocaleString();
                },
                tooltip: "Number of Mutual Funds - August Quantity"
            },
            {
                title: "Num of MF<br>May - Qty",
                field: "numofmfmayqty",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter",
                headerFilterFunc: numericFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "";
                    return Number(value).toLocaleString();
                },
                tooltip: "Number of Mutual Funds - May Quantity"
            },
            {
                title: "Mkt Val.<br>Aug 2025",
                field: "mktvalaug2025",
                sorter: "number",
                minWidth: 100,
                width: 120,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by value",
                headerFilterFunc: numericFilterFunc,
                formatter: "money",
                formatterParams: {
                    precision: 0,
                    thousandSeparator: ",",
                    symbol: "₹"
                },
                tooltip: "Market Value - August 2025 (₹)"
            },
            {
                title: "Mkt Val.<br>May 2025",
                field: "mktvalmay2025",
                sorter: "number",
                minWidth: 100,
                width: 120,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by value",
                headerFilterFunc: numericFilterFunc,
                formatter: "money",
                formatterParams: {
                    precision: 0,
                    thousandSeparator: ",",
                    symbol: "₹"
                },
                tooltip: "Market Value - May 2025 (₹)"
            },
            {
                title: "Qty<br>Aug 2025",
                field: "qtyaug2025",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by qty",
                headerFilterFunc: numericFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "";
                    return Number(value).toLocaleString();
                },
                formatterParams: {
                    precision: 0,
                    thousandSeparator: ","
                },
                tooltip: "Quantity - August 2025"
            },
            {
                title: "Qty<br>May 2025",
                field: "qtymay2025",
                sorter: "number",
                minWidth: 80,
                width: 100,
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by qty",
                headerFilterFunc: numericFilterFunc,
                formatter: function(cell, formatterParams) {
                    const value = cell.getValue();
                    if (value === null || value === undefined) return "";
                    return Number(value).toLocaleString();
                },
                formatterParams: {
                    precision: 0,
                    thousandSeparator: ","
                },
                tooltip: "Quantity - May 2025"
            }
        ],

        // Download configuration
        downloadConfig: {
            columnHeaders: true,
            columnGroups: false,
            rowGroups: false,
            columnCalcs: false,
            dataTree: false,
            format: "csv"
        },

        // Initial sorting
        initialSort: [
            {column: "mktvalaug%", dir: "desc"}
        ],

        // Row styling
        rowFormatter: function(row) {
            const data = row.getData();
            if (data.comment && data.comment.trim() !== "") {
                row.getElement().style.backgroundColor = "#fef3c7";
            }
        }
    });

    // Export functionality
    document.getElementById('exportBtn').addEventListener('click', function() {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `midcap-analysis-${timestamp}.csv`;

        // Get all data (including filtered data)
        const data = table.getData("all");

        // Create CSV content manually to ensure all data is included
        let csvContent = "Company Name,Mkt Val May %,Mkt Val Aug %,MV % Change,Qty % Change,MF May MV,MF Aug MV,MF May Qty,MF Aug Qty,Mkt Val May 2025,Mkt Val Aug 2025,Qty May 2025,Qty Aug 2025,Comment\n";

        data.forEach(row => {
            const csvRow = [
                `"${row.name || ''}"`,
                row["mktvalmay%"] || '',
                row["mktvalaug%"] || '',
                row["mv%change"] || '',
                row["qty%change"] || '',
                row["numofmfmaymv"] || '',
                row["numofmfaugmv"] || '',
                row["numofmfmayqty"] || '',
                row["numofmfaugqty"] || '',
                row["mktvalmay2025"] || '',
                row["mktvalaug2025"] || '',
                row["qtymay2025"] || '',
                row["qtyaug2025"] || '',
                `"${row.comment || ''}"`
            ].join(',');
            csvContent += csvRow + '\n';
        });

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        showNotification(`CSV file downloaded successfully! (${data.length} records)`, 'success');
    });

    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const firstInput = document.querySelector('.tabulator-header-filter input');
            if (firstInput) {
                firstInput.focus();
            }
        }

        // Escape to clear filters
        if (e.key === 'Escape') {
            table.clearFilter();
        }
    });

    // Add loading state management
    table.on("dataLoaded", function() {
        console.log("Data loaded successfully");
    });

    table.on("dataError", function(error) {
        console.error("Data loading error:", error);
        showNotification('Error loading data. Please refresh the page.', 'error');
    });

    // Add table info display
    function updateTableInfo() {
        const info = table.getDataCount();
        const total = midcapData.length;
        console.log(`Displaying ${info} of ${total} companies`);
    }

    table.on("dataChanged", updateTableInfo);
    updateTableInfo();

    // Calculate and display validation totals - only if elements exist
    function calculateValidationTotals() {
        const data = midcapData;
        let totalMayMV = 0, totalAugMV = 0, totalMayQty = 0, totalAugQty = 0;

        data.forEach(row => {
            totalMayMV += row.mktvalmay2025 || 0;
            totalAugMV += row.mktvalaug2025 || 0;
            totalMayQty += row.qtymay2025 || 0;
            totalAugQty += row.qtyaug2025 || 0;
        });

        // Only update if elements exist
        const totalMayMVEl = document.getElementById('totalMayMV');
        const totalAugMVEl = document.getElementById('totalAugMV');
        const totalMayQtyEl = document.getElementById('totalMayQty');
        const totalAugQtyEl = document.getElementById('totalAugQty');

        if (totalMayMVEl) totalMayMVEl.textContent = totalMayMV.toLocaleString('en-IN', {maximumFractionDigits: 2});
        if (totalAugMVEl) totalAugMVEl.textContent = totalAugMV.toLocaleString('en-IN', {maximumFractionDigits: 2});
        if (totalMayQtyEl) totalMayQtyEl.textContent = Math.round(totalMayQty).toLocaleString();
        if (totalAugQtyEl) totalAugQtyEl.textContent = Math.round(totalAugQty).toLocaleString();

        console.log('Validation totals calculated:', { totalMayMV, totalAugMV, totalMayQty, totalAugQty });
    }

    // Calculate totals when data loads
    calculateValidationTotals();

    // Quick Analysis Buttons Functionality
    let currentFilter = null;

    function applyQuickFilter(filterType) {
        // Clear previous active state
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Clear existing filters
        table.clearFilter();

        switch(filterType) {
            case 'top-holdings-aug':
                // Sort by Market Value Aug % descending
                table.clearFilter();
                table.setSort("mktvalaug%", "desc");
                break;
            case 'top-holdings-may':
                // Sort by Market Value May % descending
                table.clearFilter();
                table.setSort("mktvalmay%", "desc");
                break;
            case 'increase':
                // Holdings where qty % change > 0, sorted by qty % change descending
                table.setFilter("qty%change", ">", 0);
                table.setSort("qty%change", "desc");
                break;
            case 'decrease':
                // Holdings where qty % change < 0, sorted by qty % change ascending (biggest negatives first)
                table.setFilter("qty%change", "<", 0);
                table.setSort("qty%change", "asc");
                break;
            case 'new-entries':
                // Where Aug MV > 0 and May MV = 0 or null, sorted by Aug MV % desc
                table.setFilter(function(data, filterParams){
                    return (data["mktvalaug%"] > 0) && (!data["mktvalmay%"] || data["mktvalmay%"] === 0);
                });
                table.setSort("mktvalaug%", "desc");
                break;
            case 'exits':
                // Where Aug MV = 0 or null and May MV > 0, sorted by May MV % desc
                table.setFilter(function(data, filterParams){
                    return (data["mktvalmay%"] > 0) && (!data["mktvalaug%"] || data["mktvalaug%"] === 0);
                });
                table.setSort("mktvalmay%", "desc");
                break;
            case 'clear':
                break;
        }

        if (filterType !== 'clear') {
            // Set active state
            document.getElementById(filterType + 'Btn').classList.add('active');
            currentFilter = filterType;
            
        } else {
            currentFilter = null;
        }
    }


    // Add event listeners for quick filter buttons - using correct IDs from HTML
    document.getElementById('topholdingsaugBtn').addEventListener('click', () => applyQuickFilter('top-holdings-aug'));
    document.getElementById('topholdingsmayBtn').addEventListener('click', () => applyQuickFilter('top-holdings-may'));
    document.getElementById('increaseBtn').addEventListener('click', () => applyQuickFilter('increase'));
    document.getElementById('decreaseBtn').addEventListener('click', () => applyQuickFilter('decrease'));
    document.getElementById('newentriesBtn').addEventListener('click', () => applyQuickFilter('new-entries'));
    document.getElementById('exitsBtn').addEventListener('click', () => applyQuickFilter('exits'));
    document.getElementById('clearFiltersBtn').addEventListener('click', () => applyQuickFilter('clear'));


    // Legend functionality
    function showLegend() {
        const legendContent = `
            <div class="space-y-3 text-sm">
                <div><strong>Name</strong> – Standardized instrument/company name.</div>
                <div><strong>Mkt. Val May - %</strong> – Fraction of total May- 2025 market value (e.g., 0.25 = 25%).</div>
                <div><strong>Mkt. Val Aug - %</strong> – Fraction of total August 2025 market value.</div>
                <div><strong>MV % Change</strong> – Relative change in market value between August and May-.</div>
                <div><strong>Qty % Change</strong> – Relative change in quantity between August and May-.</div>
                <div><strong>Num of MF May - MV</strong> – Count of mutual funds holding this instrument in May- (by market value > 0).</div>
                <div><strong>Num of MF Aug - MV</strong> – Count of mutual funds holding it in August (by market value > 0).</div>
                <div><strong>Num of MF May - Qty</strong> – Count of mutual funds holding this instrument in May- (by quantity > 0).</div>
                <div><strong>Num of MF Aug - Qty</strong> – Count of mutual funds holding it in August (by quantity > 0).</div>
                <div><strong>Mkt Val. May 2025</strong> – Raw total market value in May- 2025.</div>
                <div><strong>Mkt Val. Aug 2025</strong> – Raw total market value in August 2025.</div>
                <div><strong>Qty May 2025</strong> – Raw total quantity in May- 2025.</div>
                <div><strong>Qty Aug 2025</strong> – Raw total quantity in August 2025.</div>
            </div>
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Column Legend</h3>
                        <button id="closeLegend" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    ${legendContent}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('#closeLegend');
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    // Add event listener for legend button
    document.getElementById('legendBtn').addEventListener('click', showLegend);

    // Chart initialization - added after table to avoid conflicts
    setTimeout(function() {
        console.log('🎯 Starting chart initialization...');
        console.log('Chart.js available:', typeof Chart !== 'undefined');
        console.log('📊 Chart data values - May:', [30502, 79718, 53464, 30401, 36836]);
        console.log('📊 Chart data values - Aug:', [31056, 83105, 56988, 34780, 38386]);

        // Chart 1: Top Holdings Chart
        console.log('📊 Initializing Chart 1: Top Holdings');
        var canvas1 = document.getElementById('topHoldingsChart');
        console.log('Canvas1 element found:', !!canvas1);

        if (canvas1 && typeof Chart !== 'undefined') {
            try {
                var ctx1 = canvas1.getContext('2d');
                console.log('Canvas1 context obtained:', !!ctx1);

                const chart1 = new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: ['Cash/Others', 'Dixon Tech', 'Persistent', 'Fortis', 'Coforge'],
                        datasets: [{
                            data: [5.0, 3.1, 3.0, 2.9, 2.6],
                            backgroundColor: '#3b82f6'
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: '#1f2937',
                                    font: {
                                        size: 12,
                                        weight: '500'
                                    }
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#374151',
                                    font: {
                                        size: 11
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('✅ Chart 1 created successfully:', !!chart1);
            } catch (error) {
                console.error('❌ Error creating Chart 1:', error);
            }
        } else {
            console.log('❌ Chart 1 failed - Canvas:', !!canvas1, 'Chart.js:', typeof Chart !== 'undefined');
        }

        // Chart 2: Fund Comparison Chart
        console.log('📊 Initializing Chart 2: Fund Comparison');
        var canvas2 = document.getElementById('fundComparisonChart');
        console.log('Canvas2 element found:', !!canvas2);

        if (canvas2 && typeof Chart !== 'undefined') {
            try {
                var ctx2 = canvas2.getContext('2d');
                console.log('Canvas2 context obtained:', !!ctx2);

                const chart2 = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: ['AXIS', 'HDFC', 'KOTAK', 'MOTILAL', 'NIPPON'],
                        datasets: [{
                            label: 'May 2025',
                            data: [30502, 79718, 53464, 30401, 36836],
                            backgroundColor: '#6366f1'
                        }, {
                            label: 'Aug 2025',
                            data: [31056, 83105, 56988, 34780, 38386],
                            backgroundColor: '#10b981'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value, index, values) {
                                        return '₹' + value.toLocaleString() + ' Cr';
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString() + ' Cr';
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('✅ Chart 2 created successfully:', !!chart2);
            } catch (error) {
                console.error('❌ Error creating Chart 2:', error);
            }
        } else {
            console.log('❌ Chart 2 failed - Canvas:', !!canvas2, 'Chart.js:', typeof Chart !== 'undefined');
        }

        console.log('🏁 Chart initialization process completed');
    }, 1000); // Increased timeout to ensure everything is loaded

    // Make table globally accessible for debugging
    window.midcapTable = table;
});