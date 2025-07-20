document.addEventListener('DOMContentLoaded', () => {
    // --- Dashboard Specific Logic (Applies to all dashboard-layout pages) ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const hasDropdownItems = document.querySelectorAll('.sidebar-nav .has-dropdown');

    if (sidebar && sidebarToggle) { // Ensure dashboard elements exist
        // Sidebar Toggle (Minimize/Maximize)
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('minimized');
            // For mobile, also toggle expanded class for submenu visibility
            if (window.innerWidth <= 1200) {
                sidebar.classList.toggle('expanded');
            }
        });

        // Sidebar Dropdown Toggle (Accordion Effect)
        hasDropdownItems.forEach(item => {
            const toggle = item.querySelector('.sidebar-dropdown-toggle');
            const submenu = item.querySelector('.sidebar-submenu');

            toggle.addEventListener('click', (e) => {
                const isMinimized = sidebar.classList.contains('minimized');
                const hasValidHref = toggle.getAttribute('href') && toggle.getAttribute('href') !== '#';

                // Prevent default behavior conditionally:
                // - If sidebar is minimized (always prevent to allow dropdown expansion)
                // - If sidebar is maximized, but it's the FIRST click on a dropdown that's not yet active,
                //   OR if the link is just a placeholder ('#')
                // This ensures smooth dropdown animation without immediate navigation on first click when maximized.
                if (isMinimized || !item.classList.contains('active') || !hasValidHref) {
                    e.preventDefault();
                }
                // If it is maximized AND already active AND has a valid href,
                // we DO NOT prevent default, allowing it to navigate on subsequent clicks
                // (while still toggling dropdown due to code below).

                // Close other open submenus if not the current one
                hasDropdownItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.sidebar-submenu').style.maxHeight = '0';
                    }
                });

                // Toggle current submenu
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    submenu.style.maxHeight = submenu.scrollHeight + 'px'; // Expand to content height
                } else {
                    submenu.style.maxHeight = '0'; // Collapse
                }
            });
            
            // Set initial state for dropdown based on active child or current page
            const currentPagePath = window.location.pathname.split('/').pop();
            const submenuLinks = submenu.querySelectorAll('a');
            let isSubmenuActive = false;
            submenuLinks.forEach(link => {
                if (link.getAttribute('href') === currentPagePath) {
                    item.classList.add('active'); // Activate parent dropdown
                    isSubmenuActive = true;
                    // For initial load, set max-height
                    // Use a small timeout to ensure CSS transition can apply
                    setTimeout(() => {
                        submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    }, 50); 
                }
            });
            // If a submenu item is active, remove 'active' from its parent link if parent is not the current page
            if (isSubmenuActive) {
                const parentLink = item.querySelector('.sidebar-dropdown-toggle');
                if (parentLink && parentLink.getAttribute('href').split('/').pop() !== currentPagePath && parentLink.getAttribute('href') !== '#') {
                    parentLink.classList.remove('active'); // Deactivate parent link itself
                }
            }
        });

        // Handle page load active state for sidebar items (non-dropdowns)
        const currentPath = window.location.pathname.split('/').pop();
        document.querySelectorAll('.sidebar-nav ul li:not(.has-dropdown) a').forEach(link => { // Exclude dropdown parents
            if (link.getAttribute('href') === currentPath) {
                link.parentElement.classList.add('active');
            }
        });


        // Adjust sidebar on window resize (for responsive behavior)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1200) { // Desktop view
                sidebar.classList.remove('expanded'); // Remove mobile expanded state
            } else { // Mobile/tablet view
                sidebar.classList.remove('minimized'); // Always show full sidebar on mobile (toggle via button)
            }
            // Re-calculate max-height for open submenus on resize
            hasDropdownItems.forEach(item => {
                const submenu = item.querySelector('.sidebar-submenu');
                if (item.classList.contains('active') && submenu) {
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                }
            });
        });
    }

    // --- KOL Analyzer Dashboard Logic (kol_analyzer.html specific) ---
    // (This part remains as previously defined for kol_analyzer.html, unchanged from last full script)
    // Make sure all elements like 'analyzeBtn', 'socialPlatform' etc. are correctly grabbed if present on the page.
    const analyzeBtn = document.getElementById('analyze-btn');
    const socialPlatform = document.getElementById('social-platform');
    const socialHandle = document.getElementById('social-handle');
    const combinedChartCard = document.getElementById('combinedChartCard');
    const creatorNameChartDisplay = document.getElementById('creatorNameChartDisplay');

    const creatorDetailsCard = document.getElementById('creatorDetailsCard');
    const creatorNameDisplayDetail = document.getElementById('creatorNameDisplayDetail');
    const followersCountDetail = document.getElementById('followers-count-detail');
    const totalViewsDetail = document.getElementById('total-views-detail');
    const engagementRateDetail = document.getElementById('engagement-rate-detail');
    const avgEngagementDetail = document.getElementById('avg-engagement-detail');
    const avgImpressionsDetail = document.getElementById('avg-impressions-detail');
    const erPerImpressionDetail = document.getElementById('er-per-impression-detail');
    const avgClicksDetail = document.getElementById('avg-clicks-detail');
    const audienceDemographicDetail = document.getElementById('audience-demographic-detail');
    const primaryLocationDetail = document.getElementById('primary-location-detail');
    const creatorSummaryTextDetail = document.getElementById('creatorSummaryTextDetail');

    const overviewKolPic = document.getElementById('overviewKolPic');
    const overviewKolName = document.getElementById('overviewKolName');
    const overviewKolPlatform = document.getElementById('overviewKolPlatform');
    const overviewKolProfileLink = document.getElementById('overviewKolProfileLink');
    const overviewER = document.getElementById('overviewER');
    const overviewFG = document.getElementById('overviewFG');
    const overviewIR = document.getElementById('overviewIR');
    const overviewAV = document.getElementById('overviewAV');


    const chartCombined1WeekBtn = document.getElementById('chart-combined-1-week');
    const chartCombined1MonthBtn = document.getElementById('chart-combined-1-month');

    let combinedChartInstance;

    // Function to generate random data for combined chart
    const generateCombinedChartData = (period, baseEngagement, baseFollowers) => {
        const labels = [];
        const erData = [];
        const followerData = [];
        const endDate = new Date();
        let startDate;
        let numPoints = 0;

        if (period === 'week') {
            numPoints = 7;
            startDate = new Date();
            startDate.setDate(endDate.getDate() - (numPoints - 1));
        } else { // month
            numPoints = 30;
            startDate = new Date();
            startDate.setDate(endDate.getDate() - (numPoints - 1));
        }

        for (let i = 0; i < numPoints; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            labels.push(date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));

            const currentER = Math.max(0.5, baseEngagement + (Math.random() * 2 - 1) * 0.5);
            erData.push(currentER.toFixed(2));

            const currentFollowers = Math.max(100, baseFollowers + (Math.random() * 500 - 250)); // Daily growth
            followerData.push(currentFollowers.toFixed(0));
        }
        return { labels, erData, followerData };
    };

    // Function to update or create the combined chart
    const updateCombinedChart = (period = 'week', baseEngagement, baseFollowers) => {
        const ctx = document.getElementById('combinedChart');
        if (!ctx) return; // Exit if canvas not found (e.g. on other pages)

        const { labels, erData, followerData } = generateCombinedChartData(period, baseEngagement, baseFollowers);

        if (combinedChartInstance) {
            combinedChartInstance.destroy();
        }

        combinedChartInstance = new Chart(ctx, {
            type: 'line', // Still 'line' type for Chart.js, fill makes it area
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Engagement Rate',
                        data: erData,
                        borderColor: 'rgb(231, 76, 60)', // Red color
                        backgroundColor: 'rgba(231, 76, 60, 0.2)', // Red with transparency for fill
                        yAxisID: 'y-er',
                        tension: 0.4, // Make line smoother for organic look
                        fill: true, // This makes it an area chart
                        pointBackgroundColor: 'rgb(231, 76, 60)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1
                    },
                    {
                        label: 'Follower Growth',
                        data: followerData,
                        borderColor: 'rgb(52, 152, 219)', // Blue color
                        backgroundColor: 'rgba(52, 152, 219, 0.2)', // Blue with transparency for fill
                        yAxisID: 'y-follower',
                        tension: 0.4,
                        fill: true, // This makes it an area chart
                        pointBackgroundColor: 'rgb(52, 152, 219)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom', // Legend at the bottom as per image
                        labels: {
                            usePointStyle: true, // Use circle for legend markers
                            boxWidth: 8, // Smaller box for legend
                            font: {
                                size: 10 // Smaller font for legend
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: function(context) {
                                return context[0].label; // Show date as title
                            },
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.label.includes('Rate')) {
                                    label += `${context.raw}%`;
                                } else {
                                    label += context.raw.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false // Hide x-axis grid lines
                        },
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            font: {
                                size: 10 // Smaller font for x-axis labels
                            }
                        }
                    },
                    'y-er': {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: true, // Start at 0 for better comparison
                        grid: {
                            color: 'rgba(0,0,0,0.05)' // Light grid lines for y-axis
                        },
                        ticks: {
                            callback: function(value) {
                                return `${value}%`; // Add percent sign
                            },
                            font: {
                                size: 10
                            }
                        }
                    },
                    'y-follower': {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false // No grid lines for right y-axis
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) return (value / 1000000) + 'M';
                                if (value >= 1000) return (value / 1000) + 'k';
                                return value;
                            },
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    };


    if (analyzeBtn) { // This part runs only on kol_analyzer.html
        analyzeBtn.addEventListener('click', () => {
            const platform = socialPlatform.value;
            const handle = socialHandle.value.trim();

            if (handle === "") {
                alert("Harap masukkan username atau Channel ID!");
                return;
            }

            let simulatedFollowers, simulatedViews, simulatedEngagement, simulatedAvgEngagement;
            let simulatedImpressions, simulatedErPerImpression, simulatedAvgClicks;
            let simulatedAudience, simulatedLocation;
            let creatorNameDisplayValue = handle.startsWith('@') ? handle : `@${handle}`;
            let simulatedNicheForSummary = kolNicheSmall.value || "General";

            let baseFollowersValue, baseEngagementValue;

            // Simulate data generation
            switch (platform) {
                case 'youtube':
                    simulatedFollowers = (Math.random() * (5 - 0.5) + 0.5).toFixed(1) + "M"; 
                    simulatedViews = (Math.random() * (500 - 50) + 50).toFixed(0) + "M"; 
                    simulatedEngagement = (Math.random() * (2 - 0.5) + 0.5).toFixed(2); // Keep as number for chart
                    simulatedAvgEngagement = "N/A (YouTube)";
                    simulatedImpressions = (Math.random() * (10 - 2) + 2).toFixed(1) + "M"; 
                    simulatedErPerImpression = (Math.random() * (0.5 - 0.1) + 0.1).toFixed(2);
                    simulatedAvgClicks = (Math.random() * (50000 - 10000) + 10000).toLocaleString() + " / Video";
                    simulatedAudience = "Pria 60%, Wanita 40% (18-34)";
                    simulatedLocation = "Indonesia, Malaysia";
                    creatorNameDisplayValue = `${handle.replace('@', '')} (YouTube)`;
                    baseFollowersValue = parseFloat(simulatedFollowers) * 1000000;
                    baseEngagementValue = parseFloat(simulatedEngagement);
                    break;
                case 'instagram':
                    simulatedFollowers = (Math.random() * (1 - 0.1) + 0.1).toFixed(1) + "M"; 
                    simulatedViews = "N/A (Instagram)";
                    simulatedEngagement = (Math.random() * (4 - 1.5) + 1.5).toFixed(2); // Keep as number
                    simulatedAvgEngagement = (Math.random() * (20000 - 5000) + 5000).toFixed(0) + " Likes"; 
                    simulatedImpressions = (Math.random() * (5 - 1) + 1).toFixed(1) + "M";
                    simulatedErPerImpression = (Math.random() * (0.8 - 0.3) + 0.3).toFixed(2);
                    simulatedAvgClicks = (Math.random() * (10000 - 2000) + 2000).toLocaleString() + " / Post";
                    simulatedAudience = "Wanita 70%, Pria 30% (20-40)";
                    simulatedLocation = "Jakarta, Bandung";
                    creatorNameDisplayValue = `${handle.replace('@', '')} (Instagram)`;
                    baseFollowersValue = parseFloat(simulatedFollowers) * 1000000;
                    baseEngagementValue = parseFloat(simulatedEngagement);
                    break;
                case 'tiktok':
                    simulatedFollowers = (Math.random() * (2 - 0.2) + 0.2).toFixed(1) + "M"; 
                    simulatedViews = (Math.random() * (200 - 20) + 20).toFixed(0) + "M"; 
                    simulatedEngagement = (Math.random() * (6 - 3) + 3).toFixed(2); // Keep as number
                    simulatedAvgEngagement = "N/A (TikTok)";
                    simulatedImpressions = (Math.random() * (8 - 1.5) + 1.5).toFixed(1) + "M";
                    simulatedErPerImpression = (Math.random() * (1.5 - 0.5) + 0.5).toFixed(2);
                    simulatedAvgClicks = (Math.random() * (15000 - 3000) + 3000).toLocaleString() + " / Video";
                    simulatedAudience = "Remaja 50%, Dewasa Muda 50% (13-24)";
                    simulatedLocation = "Indonesia, Singapura";
                    creatorNameDisplayValue = `${handle.replace('@', '')} (TikTok)`;
                    baseFollowersValue = parseFloat(simulatedFollowers) * 1000000;
                    baseEngagementValue = parseFloat(simulatedEngagement);
                    break;
                case 'x': // Twitter
                    simulatedFollowers = (Math.random() * (0.8 - 0.05) + 0.05).toFixed(2) + "M"; 
                    simulatedViews = "N/A (X)";
                    simulatedEngagement = (Math.random() * (1 - 0.2) + 0.2).toFixed(2); // Keep as number
                    simulatedAvgEngagement = "N/A (X)";
                    simulatedImpressions = (Math.random() * (0.5 - 0.1) + 0.1).toFixed(1) + "M";
                    simulatedErPerImpression = (Math.random() * (0.2 - 0.05) + 0.05).toFixed(2);
                    simulatedAvgClicks = (Math.random() * (1000 - 200) + 200).toLocaleString() + " / Tweet";
                    simulatedAudience = "Pria 75%, Wanita 25% (25-45)";
                    simulatedLocation = "Indonesia, US";
                    creatorNameDisplayValue = `${handle.replace('@', '')} (X)`;
                    baseFollowersValue = parseFloat(simulatedFollowers) * 1000000;
                    baseEngagementValue = parseFloat(simulatedEngagement);
                    break;
                default:
                    simulatedFollowers = "N/A";
                    simulatedViews = "N/A";
                    simulatedEngagement = "N/A";
                    simulatedAvgEngagement = "N/A";
                    simulatedImpressions = "N/A";
                    simulatedErPerImpression = "N/A";
                    simulatedAvgClicks = "N/A";
                    simulatedAudience = "N/A";
                    simulatedLocation = "N/A";
                    creatorNameDisplayValue = "Kreator Tidak Dikenal";
                    baseFollowersValue = 0;
                    baseEngagementValue = 0;
            }

            // Update UI elements with new data
            creatorNameChartDisplay.textContent = creatorNameDisplayValue;
            creatorNameDisplayDetail.textContent = creatorNameDisplayValue;

            followersCountDetail.textContent = simulatedFollowers;
            totalViewsDetail.textContent = simulatedViews;
            engagementRateDetail.textContent = simulatedEngagement + "%";
            avgEngagementDetail.textContent = simulatedAvgEngagement;
            avgImpressionsDetail.textContent = simulatedImpressions;
            erPerImpressionDetail.textContent = simulatedErPerImpression + "%";
            avgClicksDetail.textContent = simulatedAvgClicks;
            audienceDemographicDetail.textContent = simulatedAudience;
            primaryLocationDetail.textContent = simulatedLocation;


            const currentEngagement = parseFloat(simulatedEngagement);
            let trend = "";
            let reason = "";

            if (currentEngagement > 3.0 && (platform === 'instagram' || platform === 'tiktok')) {
                trend = "sedang mengalami **kenaikan** follower dan Engagement Rate yang signifikan";
                reason = "konsistensi dalam mengunggah konten berkualitas tinggi, interaksi aktif dengan audiens, serta kolaborasi strategis dengan brand dan kreator lain. Audiensnya sangat loyal dan responsif.";
            } else if (currentEngagement > 1.5 && platform === 'youtube') {
                trend = "menunjukkan **pertumbuhan yang stabil** dalam jumlah subscriber dan rata-rata views per video";
                reason = "fokus pada niche yang spesifik, kualitas produksi video yang terus meningkat, dan pemanfaatan SEO YouTube yang efektif. Ini menunjukkan potensi jangka panjang yang baik.";
            } else if (baseFollowersValue < 500000 && platform !== 'x') {
                trend = "mungkin berada dalam fase **pertumbuhan awal** atau sedang melakukan pivot strategi konten";
                reason = "meskipun belum mencapai skala besar, mereka memiliki potensi dengan audiens yang terlibat. Perlu diamati lebih lanjut untuk melihat arah tren ke depan.";
            } else if (currentEngagement < 1.0) { // For ER < 1% (excluding X as it's often low)
                 if (platform !== 'x') { // Only apply this low ER text if not X/Twitter
                    trend = "mungkin sedang menghadapi **penurunan** atau stagnasi dalam Engagement Rate-nya";
                    reason = "perubahan algoritma platform yang kurang menguntungkan, atau kebutuhan untuk menyegarkan kembali format dan topik konten agar lebih relevan dengan audiens saat ini.";
                 } else { // Special case for X/Twitter low ER
                    trend = "menunjukkan performa yang konsisten (sesuai standar X/Twitter)";
                    reason = "memiliki audiens yang spesifik dan fokus pada penyebaran informasi cepat, yang umumnya menghasilkan ER lebih rendah dibanding platform visual.";
                 }
            } else {
                trend = "menunjukkan **performa yang konsisten dan solid**";
                reason = "strategi konten yang terarah, pemahaman mendalam tentang audiensnya, dan kemampuan untuk mempertahankan tingkat interaksi yang sehat. Kreator ini dapat menjadi pilihan yang aman dan terpercaya.";
            }

            creatorSummaryTextDetail.innerHTML = `Kreator ini **${creatorNameDisplayValue}** ${trend} karena ${reason} <br><br> Berdasarkan analisis, kreator ini memiliki demografi audiens **${simulatedAudience.toLowerCase()}** dan fokus di **${simulatedLocation}**. Sehingga, dapat dipertimbangkan untuk melakukan endorsement untuk niche **${simulatedNicheForSummary}** dan sekitarnya, terutama jika Anda mencari kreator dengan karakteristik performa seperti ini.`;
            
            combinedChartCard.style.display = 'flex';
            creatorDetailsCard.style.display = 'flex';

            // Update KOL Performance Overview at the bottom
            overviewKolPic.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(creatorNameDisplayValue)}`; // Dynamic avatar
            overviewKolName.textContent = creatorNameDisplayValue;
            overviewKolPlatform.textContent = `Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
            overviewKolProfileLink.style.display = 'inline-block';
            overviewER.textContent = simulatedEngagement + "%";
            overviewFG.textContent = simulatedFollowers;
            overviewIR.textContent = simulatedImpressions;
            overviewAV.textContent = simulatedViews;


            // Initialize and update the combined chart
            updateCombinedChart('week', baseEngagementValue, baseFollowersValue); 
        });
    }

    // Chart controls for Combined Chart
    if (chartCombined1WeekBtn) {
        chartCombined1WeekBtn.addEventListener('click', () => {
            const baseEngagement = parseFloat(engagementRateDetail.textContent);
            const baseFollowers = parseFloat(followersCountDetail.textContent) * (followersCountDetail.textContent.includes('M') ? 1000000 : 1000);
            updateCombinedChart('week', baseEngagement, baseFollowers);
        });
    }
    if (chartCombined1MonthBtn) {
        chartCombined1MonthBtn.addEventListener('click', () => {
            const baseEngagement = parseFloat(engagementRateDetail.textContent);
            const baseFollowers = parseFloat(followersCountDetail.textContent) * (followersCountDetail.textContent.includes('M') ? 1000000 : 1000);
            updateCombinedChart('month', baseEngagement, baseFollowers);
        });
    }


    // --- KOL Recommendation Niche Specific (small card) Logic ---
    const kolNicheSmall = document.getElementById('kol-niche-small');
    const kolPlatformSmall = document.getElementById('kol-platform-small'); // Get the small platform select
    const recommendBtnSmall = document.getElementById('recommend-btn-small');
    const kolRecommendationSpecificCard = document.getElementById('kolRecommendationSpecificCard');
    const kolListContainerSmall = document.getElementById('kolListContainerSmall');


    const generateSmallKolCard = (kol) => {
        return `
            <div class="kol-item-small">
                <div>
                    <span class="kol-platform-icon fab fa-${kol.platform === 'x' ? 'twitter' : kol.platform}"></span>
                    <span class="kol-name-small">${kol.name}</span>
                </div>
                <span class="kol-meta">${kol.followers} | ${kol.engagement}</span>
            </div>
        `;
    };

    if (recommendBtnSmall) {
        recommendBtnSmall.addEventListener('click', () => {
            const niche = kolNicheSmall.value;
            const platform = kolPlatformSmall.value; // Use the small platform select

            if (niche === "") {
                alert("Harap pilih niche untuk rekomendasi KOL!");
                return;
            }

            const sampleKOLsSmall = {
                'fashion': [
                    { name: 'Titan Tyra', platform: 'instagram', followers: '1.5M', engagement: '4.8%' },
                    { name: 'Klaras Fash.', platform: 'tiktok', followers: '2.1M', engagement: '6.5%' },
                    { name: 'Ayla Putri', platform: 'youtube', followers: '800K', engagement: '3.0%' }
                ],
                'gaming': [
                    { name: 'Jess No Limit', platform: 'youtube', followers: '28M', engagement: '2.5%' },
                    { name: 'Windah Basud.', platform: 'youtube', followers: '13M', engagement: '3.1%' },
                    { name: 'EVOS Esports', platform: 'instagram', followers: '6M', engagement: '4.0%' }
                ],
                'tech': [
                    { name: 'GadgetIn', platform: 'youtube', followers: '15M', engagement: '1.8%' },
                    { name: 'David Gadget', platform: 'instagram', followers: '2.5M', engagement: '3.5%' }
                ],
                'food': [
                    { name: 'Magdalena', platform: 'youtube', followers: '5.5M', engagement: '2.8%' },
                    { name: 'Nex Carlos', platform: 'youtube', followers: '5M', engagement: '2.9%' }
                ],
                'travel': [
                    { name: 'Koko Ari', platform: 'instagram', followers: '1.8M', engagement: '4.1%' },
                    { name: 'Jalan-Jln Yuk!', platform: 'youtube', followers: '700K', engagement: '2.0%' }
                ],
                'comedy': [
                    { name: 'Arif M. (Beti)', platform: 'youtube', followers: '10M', engagement: '3.5%' },
                    { name: 'Cameo Project', platform: 'youtube', followers: '2M', engagement: '2.2%' }
                ],
                'beauty': [
                    { name: 'Tasya Farasya', platform: 'youtube', followers: '4M', engagement: '3.8%' },
                    { name: 'Rachel Goddard', platform: 'instagram', followers: '2.8M', engagement: '4.5%' }
                ],
            };

            let recommendedKOLsSmall = sampleKOLsSmall[niche] || [];

            if (platform !== "") { // Filter by platform if specified
                recommendedKOLsSmall = recommendedKOLsSmall.filter(kol => kol.platform === platform);
            }

            kolListContainerSmall.innerHTML = ''; 

            if (recommendedKOLsSmall.length > 0) {
                recommendedKOLsSmall.forEach(kol => {
                    kolListContainerSmall.innerHTML += generateSmallKolCard(kol);
                });
                const noKolFound = kolListContainerSmall.querySelector('.no-kol-found-small');
                if (noKolFound) noKolFound.style.display = 'none';
            } else {
                let noKolFound = kolListContainerSmall.querySelector('.no-kol-found-small');
                if (!noKolFound) { // Create if not exists
                    const p = document.createElement('p');
                    p.classList.add('no-kol-found-small');
                    p.textContent = 'Tidak ada KOL ditemukan untuk kriteria ini.';
                    kolListContainerSmall.appendChild(p);
                    noKolFound = p;
                }
                noKolFound.style.display = 'block';
            }
            kolRecommendationSpecificCard.style.display = 'flex';
        });
    }
    
    if (kolNicheSmall) {
        kolNicheSmall.addEventListener('change', () => {
            if (kolNicheSmall.value !== "") {
                recommendBtnSmall.click();
            }
        });
    }
    if (kolPlatformSmall) { // Add listener for platform changes as well
        kolPlatformSmall.addEventListener('change', () => {
            if (kolNicheSmall.value !== "") { // Only trigger if a niche is already selected
                recommendBtnSmall.click();
            }
        });
    }

    // Initial display of some dashboard cards (ensure they are visible by default on dashboard load)
    if (combinedChartCard) combinedChartCard.style.display = 'flex';
    if (creatorDetailsCard) creatorDetailsCard.style.display = 'flex';
    if (kolRecommendationSpecificCard) kolRecommendationSpecificCard.style.display = 'flex';
}

// --- End KOL Analyzer Dashboard Logic ---
);