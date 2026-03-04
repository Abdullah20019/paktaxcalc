# Update all remaining blog posts with the new header
$blogPosts = @(
    "blog/file-tax-return-pakistan.html",
    "blog/business-tax-guide-pakistan.html",
    "blog/freelancer-tax-guide-pakistan.html",
    "blog/capital-gains-tax-pakistan.html",
    "blog/fbr-portal-guide-pakistan.html",
    "blog/zakat-guide-pakistan.html",
    "blog/withholding-tax-pakistan.html",
    "blog/pta-check-imei-online-2026.html",
    "blog/pta-tax-iphone-2026.html",
    "blog/tax-exemptions-pakistan.html",
    "blog/ntn-registration-guide-pakistan.html"
)

$oldBody = '<body class="bg-[#0a0a0a] text-white min-h-screen">'
$newBody = '<body class="bg-[#0a0a0a] min-h-screen text-white">'

$oldHeaderPattern = '(?s)<!-- HEADER -->.*?Back to Blog\s*</a>\s*</div>\s*</nav>\s*</header>'

$newHeader = @'
    <!-- Dark Header with Animated Navigation -->
<header class="dark-header fixed w-full top-0 z-50">
  <nav class="container mx-auto px-4 py-4">
    <div class="flex justify-between items-center">
      <!-- Logo -->
      <a href="/" class="flex items-center space-x-3 group">
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-all">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z">
            </path>
          </svg>
        </div>
        <div class="text-2xl font-bold tracking-tight">
          Pak<span class="text-emerald-400">Tax</span>Calc
        </div>
      </a>

      <!-- Desktop Slide Tabs Navigation -->
      <div class="hidden md:block">
        <div class="slide-tabs-container" id="slideTabs">
          <div class="slide-tabs-cursor" id="slideCursor"></div>
          <a href="/" class="slide-tab" data-index="0">Home</a>
          <a href="/blog/" class="slide-tab active" data-index="1">Tax Guides</a>
          <a href="/about.html" class="slide-tab" data-index="2">About</a>
          <a href="/contact.html" class="slide-tab" data-index="3">Contact</a>
        </div>
      </div>
      
      <a href="/#calculators" class="hidden md:block btn-green text-sm">Get Started</a>

      <!-- Animated Hamburger Menu -->
      <button id="mobileMenuBtn" class="md:hidden hamburger" aria-label="Toggle navigation" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="md:hidden mobile-menu mt-4 rounded-xl overflow-hidden max-h-0 transition-all duration-300">
      <div class="flex flex-col p-4 space-y-2">
        <a href="/" class="py-3 px-4 rounded-lg hover:bg-white/5 text-gray-300 hover:text-emerald-400 transition-colors">Home</a>
        <a href="/blog/" class="py-3 px-4 rounded-lg bg-white/10 text-emerald-400">Tax Guides</a>
        <a href="/about.html" class="py-3 px-4 rounded-lg hover:bg-white/5 text-gray-300 hover:text-emerald-400 transition-colors">About</a>
        <a href="/contact.html" class="py-3 px-4 rounded-lg hover:bg-white/5 text-gray-300 hover:text-emerald-400 transition-colors">Contact</a>
        <a href="/#calculators" class="btn-green text-center mt-2">Get Started</a>
      </div>
    </div>
  </nav>
</header>

<!-- Spacer for fixed header -->
<div class="h-20"></div>

<script>
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== '0px';
      mobileMenu.style.maxHeight = isOpen ? '0px' : mobileMenu.scrollHeight + 'px';
      mobileMenuBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.style.maxHeight = '0px';
        mobileMenuBtn.classList.remove('active');
      }
    });
  }
</script>
'@

foreach ($file in $blogPosts) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content $file -Raw
        
        # Replace body tag
        $content = $content -replace $oldBody, $newBody
        
        # Replace header section
        $content = $content -replace $oldHeaderPattern, $newHeader
        
        # Replace pt-28 with py-12 on article
        $content = $content -replace '<article class="container mx-auto px-4 pt-28 pb-12">', '<article class="container mx-auto px-4 py-12">'
        
        Set-Content $file $content -NoNewline
        Write-Host "Updated $file" -ForegroundColor Green
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host "All blog posts updated!" -ForegroundColor Cyan
