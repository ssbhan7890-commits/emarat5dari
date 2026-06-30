/* ===== عمارت ۵ دری — اسکریپت اصلی ===== */

/* ---------- CART STATE ---------- */
let cart = JSON.parse(localStorage.getItem('emarat-cart') || '[]');

function saveCart() {
  localStorage.setItem('emarat-cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, name, price, category) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, category, qty: 1 });
  }
  saveCart();
  showToast('محصول به سبد اضافه شد ✓');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else saveCart();
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function formatPrice(n) {
  return n.toLocaleString('fa-IR') + ' تومان';
}

/* ---------- CART UI ---------- */
function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }

  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">سبد خرید شما خالی است.</p>';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="product-img-placeholder" style="width:72px;height:88px;flex-shrink:0;font-size:1.5rem;">🖼️</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            <button class="qty-btn" onclick="removeFromCart('${item.id}')" style="margin-right:auto;background:rgba(220,50,50,0.15);color:#e05555;">✕</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (totalEl) totalEl.textContent = formatPrice(cartTotal());
}

/* ---------- CART DRAWER ---------- */
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- MOBILE MENU ---------- */
function openMenu() { document.getElementById('mobileMenu').classList.add('open'); }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

/* ---------- HEADER SCROLL ---------- */
window.addEventListener('scroll', () => {
  const header = document.getElementById('mainHeader');
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---------- TOAST ---------- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ---------- PRODUCTS DATA ---------- */
const products = [
  { id: 'p1', name: 'کاغذ دیواری رویال کلاسیک', price: 120000, category: 'کاغذ دیواری', tag: 'پرفروش', emoji: '🏛️' },
  { id: 'p2', name: 'پرده مخمل سبز تیره', price: 85000, category: 'پرده', tag: 'جدید', emoji: '🪟' },
  { id: 'p3', name: 'قرنیز طلایی کلاسیک', price: 45000, category: 'قرنیز', tag: '', emoji: '📐' },
  { id: 'p4', name: 'پنل PVC مرمر سفید', price: 230000, oldPrice: 280000, category: 'پنل دیواری', tag: 'تخفیف', emoji: '🔲' },
  { id: 'p5', name: 'گچ‌بری قوس ایرانی', price: 67000, category: 'گچ‌بری', tag: '', emoji: '🎨' },
  { id: 'p6', name: 'کاغذ دیواری اطلس نقره‌ای', price: 95000, category: 'کاغذ دیواری', tag: 'ویژه', emoji: '✨' },
  { id: 'p7', name: 'پرده شاهانه طلایی', price: 145000, oldPrice: 180000, category: 'پرده', tag: 'تخفیف', emoji: '👑' },
  { id: 'p8', name: 'قرنیز مدرن مات', price: 38000, category: 'قرنیز', tag: '', emoji: '📏' },
];

const categories = [
  { name: 'کاغذ دیواری', emoji: '🏛️', class: 'cat-1' },
  { name: 'پرده', emoji: '🪟', class: 'cat-2' },
  { name: 'پنل PVC', emoji: '🔲', class: 'cat-3' },
  { name: 'گچ‌بری', emoji: '🎨', class: 'cat-4' },
];

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card fade-up">
      <div class="product-img">
        <div class="product-img-placeholder">${p.emoji}</div>
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-cat">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">
          <div>
            ${p.oldPrice ? `<div class="price-old">${formatPrice(p.oldPrice)}</div>` : ''}
            <div class="price">${formatPrice(p.price)}</div>
          </div>
          <button class="btn-add" onclick="addToCart('${p.id}','${p.name}',${p.price},'${p.category}')">+ سبد</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- RENDER CATEGORIES ---------- */
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = categories.map(c => `
    <div class="category-card ${c.class}">
      <div class="category-card-overlay"></div>
      <div class="category-card-content">
        <h3>${c.name}</h3>
        <div class="icon-circle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 5l-7 7 7 7" transform="scale(-1,1) translate(-24,0)"/>
          </svg>
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- SMOOTH SCROLL FOR ANCHORS ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const target = document.querySelector(a.getAttribute('href'));
  if (target) target.scrollIntoView({ behavior: 'smooth' });
});

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  updateCartUI();

  // Close cart when clicking overlay
  document.getElementById('cartOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCart();
  });

  // Logo fallback
  const logoImg = document.querySelector('.logo img');
  if (logoImg) {
    logoImg.onerror = function() {
      this.style.display = 'none';
      document.querySelector('.logo-fallback').style.display = 'block';
    };
  }
});
