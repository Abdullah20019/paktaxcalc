// ==========================================
// PAKISTAN TAX CALCULATOR - COMPLETE VERSION
// All 8 Calculators with Tax Breakdown
// ==========================================

let salaryChart = null;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function animateValue(element, start, end, duration) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = 'Rs. ' + formatNumber(value);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ==========================================
// TAB SWITCHING
// ==========================================

function showCalculator(calcType) {
    // Hide all calculators
    document.querySelectorAll('.calculator-content').forEach(calc => {
        calc.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.calculator-tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    
    // Show selected calculator
    const selectedCalc = document.getElementById('calculator-' + calcType);
    if (selectedCalc) {
        selectedCalc.classList.remove('hidden');
    }
    
    // Add active class to selected tab
    const selectedTab = document.getElementById('tab-' + calcType);
    if (selectedTab) {
        selectedTab.classList.add('active-tab');
    }
    
    // Scroll to calculator
    window.scrollTo({
        top: selectedCalc ? selectedCalc.offsetTop - 100 : 0,
        behavior: 'smooth'
    });
}

// ==========================================
// 1. SALARY TAX CALCULATOR WITH BREAKDOWN
// ==========================================

function calculateTax(annualIncome) {
    let tax = 0;
    
    if (annualIncome <= 600000) {
        tax = 0;
    } else if (annualIncome <= 1200000) {
        tax = (annualIncome - 600000) * 0.01;
    } else if (annualIncome <= 2200000) {
        tax = 6000 + (annualIncome - 1200000) * 0.11;
    } else if (annualIncome <= 3200000) {
        tax = 116000 + (annualIncome - 2200000) * 0.23;
    } else if (annualIncome <= 4100000) {
        tax = 346000 + (annualIncome - 3200000) * 0.30;
    } else {
        tax = 616000 + (annualIncome - 4100000) * 0.35;
    }
    
    // Surcharge for income above 10 million
    if (annualIncome > 10000000) {
        tax += tax * 0.09;
    }
    
    return Math.round(tax);
}

// Generate detailed tax slab breakdown
function generateTaxBreakdown(annualIncome) {
    let breakdown = [];
    let remainingIncome = annualIncome;
    let totalTax = 0;
    
    const slabs = [
        { limit: 600000, rate: 0, name: 'First Rs. 600,000' },
        { limit: 600000, rate: 0.01, name: 'Next Rs. 600,000 (Rs. 600K - 1.2M)' },
        { limit: 1000000, rate: 0.11, name: 'Next Rs. 1,000,000 (Rs. 1.2M - 2.2M)' },
        { limit: 1000000, rate: 0.23, name: 'Next Rs. 1,000,000 (Rs. 2.2M - 3.2M)' },
        { limit: 900000, rate: 0.30, name: 'Next Rs. 900,000 (Rs. 3.2M - 4.1M)' },
        { limit: Infinity, rate: 0.35, name: 'Above Rs. 4.1M' }
    ];
    
    for (let slab of slabs) {
        if (remainingIncome <= 0) break;
        
        let taxableAmount = Math.min(remainingIncome, slab.limit);
        let taxOnSlab = taxableAmount * slab.rate;
        totalTax += taxOnSlab;
        
        if (taxableAmount > 0) {
            breakdown.push({
                slab: slab.name,
                amount: taxableAmount,
                rate: (slab.rate * 100).toFixed(0) + '%',
                tax: Math.round(taxOnSlab),
                isActive: true
            });
        }
        
        remainingIncome -= taxableAmount;
    }
    
    return breakdown;
}

function displayTaxBreakdown(annualIncome) {
    const breakdownDiv = document.getElementById('taxBreakdownTable');
    const contentDiv = document.getElementById('slabBreakdownContent');
    
    if (!breakdownDiv || !contentDiv) return;
    
    if (annualIncome <= 0) {
        breakdownDiv.classList.add('hidden');
        return;
    }
    
    const breakdown = generateTaxBreakdown(annualIncome);
    
    let html = '<div class="space-y-2">';
    
    breakdown.forEach((item, index) => {
        const isExempt = item.rate === '0%';
        const bgColor = isExempt ? 'bg-green-50 border-green-300' : 'bg-white border-purple-200';
        const textColor = isExempt ? 'text-green-700' : 'text-gray-800';
        
        html += `
            <div class="p-3 rounded-lg border ${bgColor}">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="font-semibold ${textColor} text-xs mb-1">${item.slab}</div>
                        <div class="text-xs text-gray-600">
                            Taxable: Rs. ${formatNumber(item.amount)} × ${item.rate}
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold ${isExempt ? 'text-green-600' : 'text-red-600'}">
                            Rs. ${formatNumber(item.tax)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    contentDiv.innerHTML = html;
    breakdownDiv.classList.remove('hidden');
}

function calculateDeductions(monthlySalary, options) {
    let deductions = {
        eobi: 0,
        socialSecurity: 0,
        providentFund: 0,
        professionalTax: 0
    };
    
    if (options.includeEOBI) {
        deductions.eobi = Math.min(monthlySalary * 0.01, 200);
    }
    
    if (options.includeSocialSecurity) {
        let rate = (options.province === 'sindh' || options.province === 'punjab') ? 0.06 : 0.05;
        deductions.socialSecurity = monthlySalary * rate;
    }
    
    if (options.providentFundPercent > 0) {
        deductions.providentFund = (monthlySalary * options.providentFundPercent) / 100;
    }
    
    if (options.province === 'sindh' && monthlySalary > 12000) {
        deductions.professionalTax = 200;
    }
    
    return deductions;
}

function calculateSalaryTax() {
    let monthlySalary = parseFloat(document.getElementById('monthlySalary').value) || 0;
    let annualBonus = parseFloat(document.getElementById('annualBonus').value) || 0;
    
    let options = {
        includeEOBI: document.getElementById('eobi').checked,
        includeSocialSecurity: document.getElementById('socialSecurity').checked,
        providentFundPercent: parseFloat(document.getElementById('providentFund').value) || 0,
        province: document.getElementById('province').value
    };
    
    let grossAnnualSalary = (monthlySalary * 12) + annualBonus;
    
    let deductions = calculateDeductions(monthlySalary, options);
    let totalMonthlyDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
    let totalAnnualDeductions = totalMonthlyDeductions * 12;
    
    let taxableIncome = grossAnnualSalary - totalAnnualDeductions;
    
    let annualTax = calculateTax(taxableIncome);
    let monthlyTax = annualTax / 12;
    
    let netMonthlySalary = monthlySalary - monthlyTax - totalMonthlyDeductions;
    let effectiveRate = grossAnnualSalary > 0 ? ((annualTax / grossAnnualSalary) * 100).toFixed(2) : 0;
    
    // Update display with animation
    animateValue(document.getElementById('salary-grossAnnual'), 0, Math.round(grossAnnualSalary), 500);
    animateValue(document.getElementById('salary-annualTax'), 0, Math.round(annualTax), 500);
    animateValue(document.getElementById('salary-monthlyTax'), 0, Math.round(monthlyTax), 500);
    animateValue(document.getElementById('salary-netMonthly'), 0, Math.round(netMonthlySalary), 600);
    
    document.getElementById('salary-effectiveRate').textContent = effectiveRate + '%';
    
    // Display tax breakdown table
    displayTaxBreakdown(taxableIncome);
    
    // Update chart
    updateSalaryChart(monthlySalary, monthlyTax, totalMonthlyDeductions, netMonthlySalary);
}

function updateSalaryChart(gross, tax, deductions, net) {
    const ctx = document.getElementById('salaryChart');
    if (!ctx) return;
    
    if (salaryChart) {
        salaryChart.destroy();
    }
    
    salaryChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Income Tax', 'Other Deductions', 'Net Salary'],
            datasets: [{
                data: [Math.round(tax), Math.round(deductions), Math.round(net)],
                backgroundColor: ['#EF4444', '#F97316', '#10B981'],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12, weight: 'bold' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': Rs. ' + formatNumber(context.parsed);
                        }
                    }
                }
            }
        }
    });
}

// ==========================================
// 2. PTA MOBILE TAX CALCULATOR
// ==========================================

function calculatePTATax() {
    let price = parseFloat(document.getElementById('ptaPrice').value) || 0;
    let usdRate = parseFloat(document.getElementById('ptaUsdRate').value) || 278;
    let regType = document.getElementById('ptaRegType').value;
    
    if (price === 0) return;
    
    let pricePKR = price * usdRate;
    let taxRate = 0;
    
    // Tax calculation based on registration type and price
    if (regType === 'passport') {
        if (pricePKR <= 30000) {
            taxRate = 0.10;
        } else if (pricePKR <= 60000) {
            taxRate = 0.15;
        } else if (pricePKR <= 100000) {
            taxRate = 0.20;
        } else {
            taxRate = 0.25;
        }
    } else {
        if (pricePKR <= 50000) {
            taxRate = 0.15;
        } else if (pricePKR <= 100000) {
            taxRate = 0.20;
        } else if (pricePKR <= 200000) {
            taxRate = 0.25;
        } else {
            taxRate = 0.30;
        }
    }
    
    let taxAmount = pricePKR * taxRate;
    let totalCost = pricePKR + taxAmount;
    
    // Show results
    document.getElementById('ptaResults').classList.remove('hidden');
    document.getElementById('pta-pricePkr').textContent = 'Rs. ' + formatNumber(Math.round(pricePKR));
    document.getElementById('pta-taxAmount').textContent = 'Rs. ' + formatNumber(Math.round(taxAmount));
    document.getElementById('pta-totalCost').textContent = 'Rs. ' + formatNumber(Math.round(totalCost));
}

// ==========================================
// 3. BUSINESS TAX CALCULATOR
// ==========================================

function calculateBusinessTax() {
    let income = parseFloat(document.getElementById('businessIncome').value) || 0;
    let expenses = parseFloat(document.getElementById('businessExpenses').value) || 0;
    let businessType = document.getElementById('businessType').value;
    
    let taxableIncome = income - expenses;
    let taxAmount = 0;
    
    switch(businessType) {
        case 'individual':
            taxAmount = calculateTax(taxableIncome);
            break;
        case 'aop':
            if (taxableIncome <= 400000) {
                taxAmount = 0;
            } else {
                taxAmount = taxableIncome * 0.25;
            }
            break;
        case 'company':
        case 'public':
            taxAmount = taxableIncome * 0.29;
            break;
    }
    
    let netProfit = taxableIncome - taxAmount;
    let effectiveTaxRate = taxableIncome > 0 ? ((taxAmount / taxableIncome) * 100).toFixed(2) : 0;
    
    document.getElementById('business-taxableIncome').textContent = 'Rs. ' + formatNumber(Math.round(taxableIncome));
    document.getElementById('business-taxAmount').textContent = 'Rs. ' + formatNumber(Math.round(taxAmount));
    document.getElementById('business-netProfit').textContent = 'Rs. ' + formatNumber(Math.round(netProfit));
    document.getElementById('business-taxRate').textContent = effectiveTaxRate + '%';
}

// ==========================================
// 4. ZAKAT CALCULATOR
// ==========================================

function calculateZakat() {
    let cash = parseFloat(document.getElementById('zakatCash').value) || 0;
    let gold = parseFloat(document.getElementById('zakatGold').value) || 0;
    let silver = parseFloat(document.getElementById('zakatSilver').value) || 0;
    let investments = parseFloat(document.getElementById('zakatInvestments').value) || 0;
    let debts = parseFloat(document.getElementById('zakatDebts').value) || 0;
    
    let totalWealth = cash + gold + silver + investments - debts;
    let nisab = 503529;
    let zakatAmount = 0;
    let message = '';
    
    if (totalWealth >= nisab) {
        zakatAmount = totalWealth * 0.025;
        message = '<div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500"><p class="text-green-800 font-semibold">✅ You are liable to pay Zakat</p><p class="text-sm text-gray-600 mt-1">Your wealth exceeds Nisab threshold. May Allah accept your Zakat.</p></div>';
    } else {
        message = '<div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"><p class="text-blue-800 font-semibold">ℹ️ Zakat Not Obligatory</p><p class="text-sm text-gray-600 mt-1">Your wealth is below Nisab threshold (Rs. ' + formatNumber(nisab) + ').</p></div>';
    }
    
    document.getElementById('zakat-totalWealth').textContent = 'Rs. ' + formatNumber(Math.round(totalWealth));
    document.getElementById('zakat-amount').textContent = 'Rs. ' + formatNumber(Math.round(zakatAmount));
    document.getElementById('zakat-message').innerHTML = message;
}

// ==========================================
// 5. AGRICULTURAL TAX CALCULATOR
// ==========================================

function toggleAgriMethod() {
    let method = document.getElementById('agriMethod').value;
    
    if (method === 'land') {
        document.getElementById('agriLandInputs').classList.remove('hidden');
        document.getElementById('agriIncomeInputs').classList.add('hidden');
    } else {
        document.getElementById('agriLandInputs').classList.add('hidden');
        document.getElementById('agriIncomeInputs').classList.remove('hidden');
    }
    
    calculateAgriTax();
}

function calculateAgriTax() {
    let method = document.getElementById('agriMethod').value;
    let taxAmount = 0;
    let breakdown = '';
    
    if (method === 'land') {
        let landArea = parseFloat(document.getElementById('agriLand').value) || 0;
        let landType = document.getElementById('agriLandType').value;
        
        if (landArea <= 12.5) {
            taxAmount = 0;
            breakdown = 'Land area below taxable threshold (12.5 acres). Tax exempt.';
        } else if (landArea <= 25) {
            taxAmount = landArea * 300;
            breakdown = landArea + ' acres × Rs. 300 per acre';
        } else if (landArea <= 50) {
            taxAmount = landArea * 450;
            breakdown = landArea + ' acres × Rs. 450 per acre';
        } else {
            taxAmount = landArea * 600;
            breakdown = landArea + ' acres × Rs. 600 per acre';
        }
        
        if (landType === 'barani') {
            taxAmount = taxAmount * 0.5;
            breakdown += ' (50% reduction for Barani land)';
        }
    } else {
        let agriIncome = parseFloat(document.getElementById('agriIncome').value) || 0;
        
        if (agriIncome <= 400000) {
            taxAmount = 0;
            breakdown = 'Income below Rs. 400,000 is tax exempt.';
        } else if (agriIncome <= 800000) {
            taxAmount = (agriIncome - 400000) * 0.05;
            breakdown = '5% on income above Rs. 400,000';
        } else if (agriIncome <= 1200000) {
            taxAmount = 20000 + (agriIncome - 800000) * 0.10;
            breakdown = 'Rs. 20,000 + 10% on income above Rs. 800,000';
        } else {
            taxAmount = 60000 + (agriIncome - 1200000) * 0.15;
            breakdown = 'Rs. 60,000 + 15% on income above Rs. 1,200,000';
        }
    }
    
    document.getElementById('agri-taxAmount').textContent = 'Rs. ' + formatNumber(Math.round(taxAmount));
    document.getElementById('agri-breakdown').textContent = breakdown;
}

// ==========================================
// 6. SALES TAX CALCULATOR
// ==========================================

function calculateSalesTax() {
    let amount = parseFloat(document.getElementById('salesAmount').value) || 0;
    let rateSelect = document.getElementById('salesTaxRate').value;
    let rate = 0;
    
    if (rateSelect === 'custom') {
        rate = parseFloat(document.getElementById('customSalesRate').value) || 0;
        document.getElementById('customRateDiv').classList.remove('hidden');
    } else {
        rate = parseFloat(rateSelect);
        document.getElementById('customRateDiv').classList.add('hidden');
    }
    
    let taxAmount = (amount * rate) / 100;
    let totalAmount = amount + taxAmount;
    
    document.getElementById('sales-baseAmount').textContent = 'Rs. ' + formatNumber(Math.round(amount));
    document.getElementById('sales-taxAmount').textContent = 'Rs. ' + formatNumber(Math.round(taxAmount));
    document.getElementById('sales-totalAmount').textContent = 'Rs. ' + formatNumber(Math.round(totalAmount));
}

// ==========================================
// 7. PROPERTY TAX CALCULATOR
// ==========================================

function calculatePropertyTax() {
    let value = parseFloat(document.getElementById('propertyValue').value) || 0;
    let propertyType = document.getElementById('propertyType').value;
    let city = document.getElementById('propertyCity').value;
    
    let annualTaxRate = 0;
    
    switch(city) {
        case 'lahore':
        case 'islamabad':
            annualTaxRate = propertyType === 'commercial' ? 0.008 : 0.003;
            break;
        case 'karachi':
            annualTaxRate = propertyType === 'commercial' ? 0.01 : 0.004;
            break;
        default:
            annualTaxRate = propertyType === 'commercial' ? 0.006 : 0.0025;
    }
    
    let annualTax = value * annualTaxRate;
    let cgt = value * 0.10;
    let stampDuty = value * 0.02;
    
    document.getElementById('property-annualTax').textContent = 'Rs. ' + formatNumber(Math.round(annualTax));
    document.getElementById('property-cgtTax').textContent = 'Rs. ' + formatNumber(Math.round(cgt));
    document.getElementById('property-stampDuty').textContent = 'Rs. ' + formatNumber(Math.round(stampDuty));
}

// ==========================================
// 8. PENSION CALCULATOR
// ==========================================

function calculatePension() {
    let basicPay = parseFloat(document.getElementById('pensionBasicPay').value) || 0;
    let years = parseFloat(document.getElementById('pensionYears').value) || 0;
    let pensionType = document.getElementById('pensionType').value;
    
    let monthlyPension = 0;
    let commutation = 0;
    let gratuity = 0;
    
    if (pensionType === 'civil' || pensionType === 'military') {
        let pensionPercent = Math.min(years * 2.33, 70);
        monthlyPension = (basicPay * pensionPercent) / 100;
        commutation = (monthlyPension * 0.35) * 12 * 9.5;
        gratuity = basicPay * years;
    } else {
        monthlyPension = years >= 15 ? 8500 : 0;
        commutation = 0;
        gratuity = 0;
    }
    
    let annualPension = monthlyPension * 12;
    
    document.getElementById('pension-monthly').textContent = 'Rs. ' + formatNumber(Math.round(monthlyPension));
    document.getElementById('pension-annual').textContent = 'Rs. ' + formatNumber(Math.round(annualPension));
    document.getElementById('pension-commutation').textContent = 'Rs. ' + formatNumber(Math.round(commutation));
    document.getElementById('pension-gratuity').textContent = 'Rs. ' + formatNumber(Math.round(gratuity));
}

// ==========================================
// INITIALIZATION
// ==========================================

window.onload = function() {
    // Set default values
    const salaryInput = document.getElementById('monthlySalary');
    if (salaryInput) {
        salaryInput.value = '100000';
        calculateSalaryTax();
    }
    
    // Show salary calculator by default
    showCalculator('salary');
    
    console.log('✅ PakTaxCalc initialized successfully!');
};

// ==========================================
// GLOBAL EXPORT
// ==========================================

// Make functions available globally
window.showCalculator = showCalculator;
window.calculateSalaryTax = calculateSalaryTax;
window.calculatePTATax = calculatePTATax;
window.calculateBusinessTax = calculateBusinessTax;
window.calculateZakat = calculateZakat;
window.calculateAgriTax = calculateAgriTax;
window.toggleAgriMethod = toggleAgriMethod;
window.calculateSalesTax = calculateSalesTax;
window.calculatePropertyTax = calculatePropertyTax;
window.calculatePension = calculatePension;
