/**
 * Landing Page Script
 */

// Load stats from API
async function loadStats() {
  try {
    const response = await fetch('/wp-json/linepicplus/v1/health');
    
    if (response.ok) {
      // Try to load admin stats (may fail if not authenticated)
      try {
        const statsRes = await fetch('/admin/api/stats');
        if (statsRes.ok) {
          const stats = await statsRes.json();
          
          document.getElementById('stat-products').textContent = stats.totalProducts || '0';
          document.getElementById('stat-orders').textContent = stats.totalOrders || '0';
          document.getElementById('stat-revenue').textContent = `${stats.totalRevenue || '0'} €`;
          return;
        }
      } catch (e) {
        // Not authenticated, show default stats
      }
    }
    
    // Fallback: show placeholder stats
    document.getElementById('stat-products').textContent = '100+';
    document.getElementById('stat-orders').textContent = '500+';
    document.getElementById('stat-revenue').textContent = '50K€';
  } catch (error) {
    console.error('Error loading stats:', error);
    document.getElementById('stat-products').textContent = '—';
    document.getElementById('stat-orders').textContent = '—';
    document.getElementById('stat-revenue').textContent = '—';
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Animate on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all feature cards and endpoint groups
document.querySelectorAll('.feature-card, .endpoint-group, .tech-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.5s ease-out';
  observer.observe(el);
});

// Load stats on page load
loadStats();

// Navbar background on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  const navbar = document.querySelector('.navbar');
  
  if (currentScroll > 100) {
    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
  } else {
    navbar.style.background = 'rgba(15, 23, 42, 0.8)';
  }
  
  lastScroll = currentScroll;
});

