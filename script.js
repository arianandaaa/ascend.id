document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar & Dropdown Logic (Untuk halaman selain auth.html) ---
    const hamburger = document.getElementById('hamburger-menu');
    const mainNav = document.querySelector('.main-nav ul');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (hamburger && mainNav) { // Pastikan elemen ini ada (tidak di auth.html)
        // Toggle mobile navigation and hamburger animation
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');

            const authButtons = document.querySelector('.auth-buttons');
            let mobileAuthContainer = mainNav.querySelector('.auth-buttons-mobile');

            if (mainNav.classList.contains('active')) {
                if (!mobileAuthContainer) {
                    mobileAuthContainer = document.createElement('div');
                    mobileAuthContainer.classList.add('auth-buttons-mobile');
                    // Clone the auth buttons from the header (index.html, etc.)
                    // Make sure these links point to auth.html#login and auth.html#signup
                    mobileAuthContainer.innerHTML = `
                        <a href="auth.html#login" class="btn btn-outline">Login</a>
                        <a href="auth.html#signup" class="btn btn-primary">Sign Up</a>
                    `;
                    mainNav.appendChild(mobileAuthContainer);
                } else {
                    mobileAuthContainer.style.display = 'flex';
                }
            } else {
                if (mobileAuthContainer) {
                    mobileAuthContainer.remove();
                }
                // Ensure all dropdowns are closed when main nav closes
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const content = dropdown.querySelector('.dropdown-content');
                    if (content) content.style.maxHeight = '0';
                });
            }
        });

        // Close mobile nav when a link is clicked (excluding dropdown toggles)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const isDropdownToggle = link.closest('.dropdown') && !link.closest('.dropdown-content');
                
                // Only close nav on mobile if it's not a dropdown toggle
                if (window.innerWidth <= 768 && !isDropdownToggle) {
                    mainNav.classList.remove('active');
                    hamburger.classList.remove('active');
                    const mobileAuthContainer = mainNav.querySelector('.auth-buttons-mobile');
                    if (mobileAuthContainer) {
                        mobileAuthContainer.remove();
                    }
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                        const content = dropdown.querySelector('.dropdown-content');
                        if (content) content.style.maxHeight = '0';
                    });
                }
            });
        });

        // Handle dropdowns for mobile (click to toggle)
        dropdowns.forEach(dropdown => {
            const dropdownToggle = dropdown.querySelector('a:first-child');
            const dropdownContent = dropdown.querySelector('.dropdown-content');

            dropdownToggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); 
                    
                    // Close other open dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                            otherDropdown.classList.remove('active');
                            const otherContent = otherDropdown.querySelector('.dropdown-content');
                            if (otherContent) otherContent.style.maxHeight = '0';
                        }
                    });

                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                    if (dropdown.classList.contains('active')) {
                        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
                    } else {
                        dropdownContent.style.maxHeight = "0";
                    }
                }
            });

            // Desktop: Handle mouseleave for dropdown (mostly handled by CSS hover)
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    // No specific JS needed here as CSS handles it
                }
            });
        });
    }
    // --- End Navbar & Dropdown Logic ---

    // --- Simulation Logic (Untuk halaman simulasi.html) ---
    const runMetaSimBtn = document.getElementById('run-meta-sim');
    if (runMetaSimBtn) {
        runMetaSimBtn.addEventListener('click', () => {
            const campaignName = document.getElementById('campaign-name').value;
            const budget = document.getElementById('budget').value;
            const audience = document.getElementById('audience').value;
            const placement = document.getElementById('placement').value;
            
            // Static simulation logic for prototype
            let reach = Math.floor(Math.random() * (150000 - 50000 + 1)) + 50000;
            let clicks = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
            let cpc = (Math.random() * (0.5 - 0.1) + 0.1).toFixed(2); // CPC between $0.1 and $0.5

            if (budget < 50) { // Reduce results for lower budget
                reach = Math.floor(reach * 0.5);
                clicks = Math.floor(clicks * 0.5);
                cpc = (parseFloat(cpc) + 0.1).toFixed(2);
            }
            if (audience.toLowerCase().includes('global')) { // Increase for broader audience
                reach = Math.floor(reach * 1.5);
            }

            document.getElementById('reach-estimate').textContent = `${reach.toLocaleString()}`;
            document.getElementById('clicks-estimate').textContent = `${clicks.toLocaleString()}`;
            document.getElementById('cpc-estimate').textContent = `${cpc}`;

            console.log(`Simulasi Meta Ads:\nNama: ${campaignName}\nBudget: $${budget}\nAudiens: ${audience}\nPenempatan: ${placement}`);
        });
    }

    const runGoogleSimBtn = document.getElementById('run-google-sim');
    if (runGoogleSimBtn) {
        runGoogleSimBtn.addEventListener('click', () => {
            const campaignName = document.getElementById('g-campaign-name').value;
            const budget = document.getElementById('g-budget').value;
            const keywords = document.getElementById('g-keywords').value;
            const matchType = document.getElementById('g-match-type').value;

            // Static simulation logic for prototype
            let impressions = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000;
            let clicks = Math.floor(Math.random() * (900 - 300 + 1)) + 300;
            let cpc = (Math.random() * (1.0 - 0.3) + 0.3).toFixed(2); // CPC between $0.3 and $1.0

            if (budget < 50) {
                impressions = Math.floor(impressions * 0.6);
                clicks = Math.floor(clicks * 0.6);
            }
            if (matchType === 'exact') { // Higher CPC for exact match
                cpc = (parseFloat(cpc) + 0.2).toFixed(2);
            } else if (matchType === 'broad') { // Lower CPC for broad match
                cpc = (parseFloat(cpc) - 0.1).toFixed(2);
                if (cpc < 0.1) cpc = 0.1; // Prevent negative CPC
            }

            document.getElementById('g-impressions').textContent = `${impressions.toLocaleString()}`;
            document.getElementById('g-clicks').textContent = `${clicks.toLocaleString()}`;
            document.getElementById('g-cpc').textContent = `${cpc}`;

            console.log(`Simulasi Google Ads:\nNama: ${campaignName}\nBudget: $${budget}\nKata Kunci: ${keywords}\nJenis Pencocokan: ${matchType}`);
        });
    }
    // --- End Simulation Logic ---


    // --- Authentication Page Logic (Untuk auth.html) ---
    const authCard = document.getElementById('authCard');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const authImage = document.getElementById('authImage');

    if (authCard) { // Hanya jalankan kode ini jika kita berada di halaman auth.html
        // Set initial state based on URL hash or default to login
        const currentHash = window.location.hash;
        if (currentHash === '#signup') {
            authCard.classList.add('signup-active');
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            authImage.classList.remove('auth-image-login');
            authImage.classList.add('auth-image-signup');
            document.title = "Digital Hub - Buat Akun";
        } else {
            authCard.classList.add('login-active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            authImage.classList.remove('auth-image-signup');
            authImage.classList.add('auth-image-login');
            document.title = "Digital Hub - Login";
        }

        const switchForm = (toForm) => {
            if (window.innerWidth <= 850) { // Mobile version: no complex slide transition, just display toggle
                if (toForm === 'signup') {
                    loginForm.style.display = 'none';
                    signupForm.style.display = 'block';
                    document.title = "Digital Hub - Buat Akun";
                    window.location.hash = '#signup';
                } else {
                    loginForm.style.display = 'block';
                    signupForm.style.display = 'none';
                    document.title = "Digital Hub - Login";
                    window.location.hash = '#login';
                }
                return; // Stop here for mobile
            }

            // Desktop transition with slide effect
            if (toForm === 'signup') {
                authCard.classList.remove('login-active');
                authCard.classList.add('signup-active');

                loginForm.classList.add('slide-out-left'); // Animate login form out
                loginForm.classList.remove('active');
                
                setTimeout(() => {
                    signupForm.classList.remove('slide-in-right', 'slide-in-left'); // Clean up any previous slide-in class
                    signupForm.classList.add('active', 'slide-in-left'); // Animate signup form in from left
                    loginForm.classList.remove('slide-out-left'); // Remove slide-out class after animation
                    document.title = "Digital Hub - Buat Akun";
                    window.location.hash = '#signup';
                }, 300); // Match this timeout to your CSS transition duration

                authImage.classList.remove('auth-image-login');
                authImage.classList.add('auth-image-signup');

            } else { // toForm === 'login'
                authCard.classList.remove('signup-active');
                authCard.classList.add('login-active');

                signupForm.classList.add('slide-out-right'); // Animate signup form out
                signupForm.classList.remove('active');
                
                setTimeout(() => {
                    loginForm.classList.remove('slide-in-left', 'slide-in-right'); // Clean up any previous slide-in class
                    loginForm.classList.add('active', 'slide-in-right'); // Animate login form in from right
                    signupForm.classList.remove('slide-out-right'); // Remove slide-out class after animation
                    document.title = "Digital Hub - Login";
                    window.location.hash = '#login';
                }, 300);

                authImage.classList.remove('auth-image-signup');
                authImage.classList.add('auth-image-login');
            }
        };

        if (showSignupBtn) {
            showSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                switchForm('signup');
            });
        }

        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                switchForm('login');
            });
        }

        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.dataset.target;
                const passwordInput = document.getElementById(targetId);
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        });

        // Handle URL hash changes
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash;
            if (newHash === '#signup' && !signupForm.classList.contains('active')) {
                switchForm('signup');
            } else if (newHash === '#login' && !loginForm.classList.contains('active')) {
                switchForm('login');
            } else if (newHash === '' && !loginForm.classList.contains('active')) { // If hash is empty, default to login
                switchForm('login');
            }
        });
    }

    // --- KOL Analyzer Logic (Untuk kol_analyzer.html) ---
const analyzeBtn = document.getElementById('analyze-btn');
const socialPlatform = document.getElementById('social-platform');
const socialHandle = document.getElementById('social-handle');
const analysisResultsSection = document.getElementById('analysisResultsSection');
const creatorNameDisplay = document.getElementById('creatorNameDisplay');
const followersCount = document.getElementById('followers-count');
const totalViews = document.getElementById('total-views');
const engagementRate = document.getElementById('engagement-rate');
const avgEngagement = document.getElementById('avg-engagement');
const creatorSummaryText = document.getElementById('creatorSummaryText');

const chart1WeekBtn = document.getElementById('chart-1-week');
const chart1MonthBtn = document.getElementById('chart-1-month');

let engagementChartInstance; // Variabel untuk menyimpan instance Chart.js

// Function to generate random data for the chart
const generateChartData = (period) => {
    const data = [];
    const labels = [];
    let baseEngagement = parseFloat(engagementRate.textContent || "3.5%"); // Use current displayed ER as base

    if (isNaN(baseEngagement)) {
        baseEngagement = 3.5; // Fallback if N/A
    }

    const endDate = new Date();
    let startDate;

    if (period === 'week') {
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 6); // Last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            labels.push(date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
            // Simulate slight fluctuations around the base engagement rate
            data.push(Math.max(0.5, baseEngagement + (Math.random() * 2 - 1)).toFixed(2));
        }
    } else { // month
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 29); // Last 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            labels.push(date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
            data.push(Math.max(0.5, baseEngagement + (Math.random() * 2 - 1)).toFixed(2));
        }
    }
    return { labels, data };
};

// Function to update or create the chart
const updateEngagementChart = (period = 'week') => {
    const ctx = document.getElementById('engagementChart').getContext('2d');
    const { labels, data } = generateChartData(period);

    if (engagementChartInstance) {
        engagementChartInstance.destroy(); // Destroy previous instance if it exists
    }

    engagementChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Engagement Rate (%)',
                data: data,
                borderColor: '#5E3BEE', // Primary color
                backgroundColor: 'rgba(94, 59, 238, 0.2)', // Light primary color
                tension: 0.3, // Smoothness of the line
                fill: true,
                pointBackgroundColor: '#5E3BEE',
                pointBorderColor: '#fff',
                pointBorderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Engagement Rate (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tanggal'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
};


if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
        const platform = socialPlatform.value;
        const handle = socialHandle.value.trim();

        if (handle === "") {
            alert("Harap masukkan username atau Channel ID!");
            return;
        }

        // Simulate API call and results based on platform
        let simulatedFollowers, simulatedViews, simulatedEngagement, simulatedAvgEngagement;
        let creatorName = handle.startsWith('@') ? handle : `@${handle}`;
        let simulatedNiche = kolNiche.value || "General"; // Use selected niche or default

        switch (platform) {
            case 'youtube':
                simulatedFollowers = (Math.random() * (5 - 0.5) + 0.5).toFixed(1) + "M"; // 0.5M - 5M
                simulatedViews = (Math.random() * (500 - 50) + 50).toFixed(0) + "M"; // 50M - 500M
                simulatedEngagement = (Math.random() * (2 - 0.5) + 0.5).toFixed(2) + "%"; // 0.5% - 2%
                simulatedAvgEngagement = "N/A (YouTube)";
                creatorName = `${handle.replace('@', '')} (YouTube)`;
                break;
            case 'instagram':
                simulatedFollowers = (Math.random() * (1 - 0.1) + 0.1).toFixed(1) + "M"; // 100K - 1M
                simulatedViews = "N/A (Instagram)";
                simulatedEngagement = (Math.random() * (4 - 1.5) + 1.5).toFixed(2) + "%"; // 1.5% - 4%
                simulatedAvgEngagement = (Math.random() * (20000 - 5000) + 5000).toFixed(0) + " Likes"; // 5K - 20K likes
                creatorName = `${handle.replace('@', '')} (Instagram)`;
                break;
            case 'tiktok':
                simulatedFollowers = (Math.random() * (2 - 0.2) + 0.2).toFixed(1) + "M"; // 200K - 2M
                simulatedViews = (Math.random() * (200 - 20) + 20).toFixed(0) + "M"; // 20M - 200M total likes
                simulatedEngagement = (Math.random() * (6 - 3) + 3).toFixed(2) + "%"; // 3% - 6%
                simulatedAvgEngagement = "N/A (TikTok)";
                creatorName = `${handle.replace('@', '')} (TikTok)`;
                break;
            case 'x': // Twitter
                simulatedFollowers = (Math.random() * (0.8 - 0.05) + 0.05).toFixed(2) + "M"; // 50K - 800K
                simulatedViews = "N/A (X)";
                simulatedEngagement = (Math.random() * (1 - 0.2) + 0.2).toFixed(2) + "%"; // 0.2% - 1%
                simulatedAvgEngagement = "N/A (X)";
                creatorName = `${handle.replace('@', '')} (X)`;
                break;
            default:
                simulatedFollowers = "N/A";
                simulatedViews = "N/A";
                simulatedEngagement = "N/A";
                simulatedAvgEngagement = "N/A";
                creatorName = "Kreator Tidak Dikenal";
        }

        creatorNameDisplay.textContent = creatorName;
        followersCount.textContent = simulatedFollowers;
        totalViews.textContent = simulatedViews;
        engagementRate.textContent = simulatedEngagement;
        avgEngagement.textContent = simulatedAvgEngagement;

        // Generate and display summary text
        const currentEngagement = parseFloat(simulatedEngagement);
        let trend = "";
        let reason = "";

        if (currentEngagement > 3.0 && platform === 'instagram') { // Simulate high engagement for IG
            trend = "mengalami peningkatan Engagement Rate yang stabil";
            reason = "konten yang sangat relevan dan interaktif dengan audiens mereka, serta sering berkolaborasi dengan brand besar.";
        } else if (currentEngagement > 1.5 && platform === 'youtube') { // Simulate good engagement for YT
            trend = "menunjukkan pertumbuhan yang baik dalam subscriber dan views";
            reason = "fokus pada kualitas produksi video dan topik yang sedang trending di niche-nya.";
        } else if (currentEngagement < 1.0) { // Simulate low engagement
            trend = "mungkin sedang menghadapi tantangan dalam Engagement Rate";
            reason = "perubahan algoritma platform atau kurangnya variasi dalam format konten.";
        } else {
            trend = "menunjukkan performa yang konsisten";
            reason = "strategi konten yang terarah dan audiens yang setia.";
        }

        creatorSummaryText.innerHTML = `Kreator ini **${creatorNameDisplay.textContent}** ${trend} karena ${reason} Sehingga, dapat dipertimbangkan untuk melakukan endorsement untuk niche **${simulatedNiche}** dan sekitarnya, terutama jika Anda mencari kreator dengan karakteristik performa seperti ini.`;
        
        analysisResultsSection.style.display = 'block'; // Show entire results section

        // Initialize and update the chart
        updateEngagementChart('week'); // Default to 1 week chart
    });
}

// Chart controls
if (chart1WeekBtn) {
    chart1WeekBtn.addEventListener('click', () => updateEngagementChart('week'));
}
if (chart1MonthBtn) {
    chart1MonthBtn.addEventListener('click', () => updateEngagementChart('month'));
}


// --- KOL Recommendation Logic (already exists, but adding to new structure) ---
const recommendBtn = document.getElementById('recommend-btn');
const kolNiche = document.getElementById('kol-niche');
const kolPlatform = document.getElementById('kol-platform');
const kolRecommendationsDiv = document.getElementById('kolRecommendations');
const kolListContainer = document.getElementById('kolListContainer');


if (recommendBtn) { // Pastikan elemen ini ada
    recommendBtn.addEventListener('click', () => {
        const niche = kolNiche.value;
        const platform = kolPlatform.value;

        if (niche === "") {
            alert("Harap pilih niche untuk rekomendasi KOL!");
            return;
        }

        const sampleKOLs = {
            'fashion': [
                { name: 'Fashionista ID', platform: 'instagram', followers: '1.2M', engagement: '4.5%', profile: 'https://instagram.com/fashionistaid' },
                { name: 'Gaya Kekinian', platform: 'tiktok', followers: '900K', engagement: '6.1%', profile: 'https://tiktok.com/@gayakekinian' },
                { name: 'Trendsetter Vibes', platform: 'youtube', followers: '500K', engagement: '3.8%', profile: 'https://youtube.com/trendsettervibes' }
            ],
            'gaming': [
                { name: 'Gamer Pro Indo', platform: 'youtube', followers: '2.5M', engagement: '2.1%', profile: 'https://youtube.com/gamerproindo' },
                { name: 'Mobile Legends Addict', platform: 'instagram', followers: '700K', engagement: '3.9%', profile: 'https://instagram.com/mobilelegendsaddict' },
                { name: 'Fortnite Master', platform: 'tiktok', followers: '1.8M', engagement: '5.5%', profile: 'https://tiktok.com/@fortnitemaster' }
            ],
            'tech': [
                { name: 'Gadget Reviewer ID', platform: 'youtube', followers: '1.8M', engagement: '1.8%', profile: 'https://youtube.com/gadgetreviewerid' },
                { name: 'Teknologi Masa Kini', platform: 'x', followers: '400K', engagement: '0.8%', profile: 'https://x.com/teknologimasakini' }
            ],
            'food': [
                { name: 'Food Blogger Enak', platform: 'instagram', followers: '1.1M', engagement: '4.8%', profile: 'https://instagram.com/foodbloggerenak' },
                { name: 'Resep Praktis Bunda', platform: 'youtube', followers: '600K', engagement: '2.5%', profile: 'https://youtube.com/reseppraktisbunda' }
            ],
            'travel': [
                { name: 'Jelajah Dunia', platform: 'instagram', followers: '950K', engagement: '4.1%', profile: 'https://instagram.com/jelajahdunia' },
                { name: 'Backpacker Vibes', platform: 'youtube', followers: '300K', engagement: '2.9%', profile: 'https://youtube.com/backpackervibes' }
            ],
            'finance': [
                { name: 'Cerdas Keuangan', platform: 'youtube', followers: '700K', engagement: '1.5%', profile: 'https://youtube.com/cerdaskeuangan' },
                { name: 'Investasi Mudah', platform: 'instagram', followers: '250K', engagement: '3.5%', profile: 'https://instagram.com/investasimudah' }
            ],
            'health': [
                { name: 'Sehat Bugar ID', platform: 'instagram', followers: '600K', engagement: '3.2%', profile: 'https://instagram.com/sehatbugarid' },
                { name: 'Dokter Online', platform: 'youtube', followers: '1M', engagement: '2.0%', profile: 'https://youtube.com/dokteronline' }
            ],
            'automotive': [
                { name: 'Mobil Mania', platform: 'youtube', followers: '800K', engagement: '1.7%', profile: 'http://googleusercontent.com/youtube.com/7' },
                { name: 'Review Otomotif ID', platform: 'instagram', followers: '450K', engagement: '3.0%', profile: 'https://instagram.com/reviewotomotifid' }
            ],
            'education': [
                { name: 'Channel Belajar', platform: 'youtube', followers: '1.5M', engagement: '1.9%', profile: 'http://googleusercontent.com/youtube.com/8' },
                { name: 'Edukasi Singkat', platform: 'tiktok', followers: '1.1M', engagement: '5.0%', profile: 'https://tiktok.com/@edukasisngkat' }
            ],
            'art': [
                { name: 'Seni Kreatif', platform: 'instagram', followers: '700K', engagement: '4.8%', profile: 'https://instagram.com/senikreatif' },
                { name: 'Tutorial Gambar', platform: 'youtube', followers: '400K', engagement: '2.3%', profile: 'http://googleusercontent.com/youtube.com/9' }
            ]
        };

        let recommendedKOLs = sampleKOLs[niche] || [];

        // Filter by platform if specified
        if (platform !== "") {
            recommendedKOLs = recommendedKOLs.filter(kol => kol.platform === platform);
        }

        kolListContainer.innerHTML = ''; // Clear previous results

        if (recommendedKOLs.length > 0) {
            recommendedKOLs.forEach(kol => {
                const kolCard = document.createElement('div');
                kolCard.classList.add('kol-card');
                kolCard.innerHTML = `
                    <div class="kol-info">
                        <span class="kol-name">${kol.name}</span>
                        <span class="kol-platform"><i class="fab fa-${kol.platform === 'x' ? 'twitter' : kol.platform}"></i> ${kol.platform.charAt(0).toUpperCase() + kol.platform.slice(1)}</span>
                    </div>
                    <div class="kol-metrics">
                        <span>Followers: <strong>${kol.followers}</strong></span>
                        <span>Engagement: <strong>${kol.engagement}</strong></span>
                    </div>
                    <a href="${kol.profile}" target="_blank" class="btn btn-small btn-outline-dark">Lihat Profil</a>
                `;
                kolListContainer.appendChild(kolCard);
            });
            kolListContainer.querySelector('.no-kol-found').style.display = 'none'; // Hide "not found" message if any
        } else {
            const noKolFound = kolListContainer.querySelector('.no-kol-found');
            if (noKolFound) {
                noKolFound.style.display = 'block'; // Show "not found" message
            } else {
                const p = document.createElement('p');
                p.classList.add('no-kol-found');
                p.style.display = 'block';
                p.textContent = 'Tidak ada KOL ditemukan untuk kriteria ini.';
                kolListContainer.appendChild(p);
            }
        }
        kolRecommendationsDiv.style.display = 'block'; // Show recommendation section
    });
}
});