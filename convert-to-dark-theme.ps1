# PowerShell script to convert HTML files from light theme to dark theme
# This script performs bulk conversions for the remaining files

$files = @(
    "blog/capital-gains-tax-pakistan.html",
    "blog/fbr-portal-guide-pakistan.html", 
    "blog/zakat-guide-pakistan.html",
    "blog/withholding-tax-pakistan.html",
    "blog/pta-check-imei-online-2026.html",
    "blog/pta-tax-iphone-2026.html",
    "about.html",
    "contact.html",
    "disclaimer.html",
    "privacy-policy.html",
    "terms-conditions.html"
)

$darkHeader = @'
    <!-- HEADER -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <nav class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <a href="/" class="flex items-center space-x-3 group">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl md:text-2xl font-black text-white tracking-tight">
                            Pak<span class="text-emerald-400">Tax</span>Calc
                        </h1>
                    </div>
                </a>
                <a href="/blog/" class="text-gray-300 hover:text-emerald-400 font-medium transition-colors whitespace-nowrap flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Back to Blog
                </a>
            </div>
        </nav>
    </header>
'@

$darkFooter = @'
    <!-- FOOTER -->
    <footer class="bg-[#0a0a0a] border-t border-white/10 py-12">
        <div class="container mx-auto px-4 text-center">
            <div class="flex items-center justify-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-white">
                    Pak<span class="text-emerald-400">Tax</span>Calc
                </h3>
            </div>
            <p class="text-gray-500 text-sm mb-6">Pakistan's most trusted tax calculator platform.</p>
            <div class="border-t border-white/10 pt-6">
                <p class="text-sm text-gray-500">&copy; 2026 PakTaxCalc. All rights reserved. Made with <span class="text-red-500">❤</span> in Pakistan <span class="inline-block">🇵🇰</span></p>
                <p class="text-xs text-gray-600 mt-2">Tax rates updated as per FBR Pakistan FY 2025-2026</p>
            </div>
        </div>
    </footer>
'@

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Converting $file..."
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Replace CSS link
        $content = $content -replace 'href="\.\./css/style\.css"', 'href="../css/dark-theme.css"'
        $content = $content -replace 'href="css/style\.css"', 'href="css/dark-theme.css"'
        
        # Replace body class
        $content = $content -replace 'class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"', 'class="bg-[#0a0a0a] text-white min-h-screen"'
        $content = $content -replace 'class="bg-white min-h-screen"', 'class="bg-[#0a0a0a] text-white min-h-screen"'
        
        # Replace light header with dark header (simplified - just remove old header and let user add new one)
        # For now, we'll skip the complex header replacement and focus on content colors
        
        # Replace content container classes
        $content = $content -replace 'class="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-12"', 'class="max-w-3xl mx-auto bg-[#141414] border border-white/10 rounded-2xl p-8 md:p-12"'
        $content = $content -replace 'class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12"', 'class="max-w-4xl mx-auto bg-[#141414] border border-white/10 rounded-2xl p-8 md:p-12"'
        
        # Replace text colors
        $content = $content -replace 'text-gray-900', 'text-white'
        $content = $content -replace 'text-gray-800', 'text-gray-200'
        $content = $content -replace 'text-gray-700', 'text-gray-300'
        $content = $content -replace 'text-gray-600', 'text-gray-400'
        
        # Replace accent colors  
        $content = $content -replace 'text-emerald-600', 'text-emerald-400'
        $content = $content -replace 'text-emerald-700', 'text-emerald-300'
        $content = $content -replace 'hover:text-emerald-700', 'hover:text-emerald-300'
        $content = $content -replace 'text-indigo-600', 'text-emerald-400'
        $content = $content -replace 'text-indigo-700', 'text-emerald-300'
        $content = $content -replace 'hover:text-indigo-700', 'hover:text-emerald-300'
        $content = $content -replace 'text-blue-600', 'text-emerald-400'
        $content = $content -replace 'text-blue-700', 'text-emerald-300'
        
        # Replace info box backgrounds
        $content = $content -replace 'bg-blue-50', 'bg-blue-500/10'
        $content = $content -replace 'bg-emerald-50', 'bg-emerald-500/10'
        $content = $content -replace 'bg-yellow-50', 'bg-yellow-500/10'
        $content = $content -replace 'bg-red-50', 'bg-red-500/10'
        $content = $content -replace 'bg-green-50', 'bg-emerald-500/10'
        $content = $content -replace 'bg-orange-50', 'bg-orange-500/10'
        $content = $content -replace 'bg-purple-50', 'bg-purple-500/10'
        $content = $content -replace 'bg-gray-50', 'bg-[#1a1a1a]'
        $content = $content -replace 'bg-indigo-50', 'bg-emerald-500/10'
        
        # Replace border colors
        $content = $content -replace 'border-gray-200', 'border-white/10'
        $content = $content -replace 'border-gray-300', 'border-white/10'
        
        # Replace table header backgrounds
        $content = $content -replace 'bg-indigo-600', 'bg-[#1a1a1a]'
        $content = $content -replace 'bg-purple-100', 'bg-[#1a1a1a]'
        $content = $content -replace 'bg-blue-100', 'bg-[#1a1a1a]'
        
        # Save the converted file
        $content | Set-Content $file -Encoding UTF8
        Write-Host "Converted $file successfully!" -ForegroundColor Green
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host "Bulk conversion complete!" -ForegroundColor Green
