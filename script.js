// ===== Language Management =====
let currentLang = 'ar';

function changeLanguage(lang) {
    currentLang = lang;
    document.body.className = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
        el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
    });

    renderProducts();
}

// ===== البيانات =====
let products = {};
let cart = [];

// ===== INIT =====
function init() {
    loadProducts();
    loadCart();
    renderProducts();
}

// ===== المنتجات =====
function loadProducts() {
    products = {
        V60: {
            labelAr: '☕ V60',
            items: [
                { id: 1, nameAr: 'لولي بوب 🍒', image: 'images/Lollipop .PNG', price: 26 },
                { id: 2, nameAr: 'سنيكرز', image: 'images/Snickers .PNG', price: 26 }
            ]
        },
        ESPRESSO: {
            labelAr: '☕ ESPRESSO',
            items: [
                { id: 5, nameAr: 'امريكانو مثلج', image: '', price: 17 },
                { id: 6, nameAr: 'اسبريسو بالرغوة', image: 'images/Fome.PNG', price: 25 }
            ]
        }
    };
}

// ===== عرض =====
function renderProducts() {
    const list = document.getElementById('products-list');
    list.innerHTML = '';

    Object.entries(products).forEach(([catKey, cat]) => {

        const title = document.createElement('h2');
        title.textContent = cat.labelAr;
        list.appendChild(title);

        cat.items.forEach(item => {
            const row = document.createElement('div');
            row.innerHTML = buildProductRow(item, catKey);
            list.appendChild(row.firstElementChild);
        });

    });
}

// ✅ الدالة المصححة 100%
function buildProductRow(item, catKey) {

    const imgHTML = item.image
        ? `<img src="${item.image}" class="product-thumb">`
        : '';

    return `
        <div class="product-line">

            ${imgHTML}

            <div class="product-info">
                <div class="product-name">${item.nameAr}</div>
                <div class="product-price">${item.price} AED</div>
            </div>

            <input type="number" id="qty-${item.id}" value="1" min="1">

            <button onclick="addToCart(${item.id}, '${catKey}')">
                إضافة
            </button>

        </div>
    `;
}
// ===== السلة =====
function addToCart(itemId, catKey) {

    const item = products[catKey].items.find(i => i.id === itemId);
    const qty = parseInt(document.getElementById(`qty-${itemId}`).value) || 1;

    const existing = cart.find(c => c.id === item.id);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            id: item.id,
            name: item.nameAr,
            price: item.price,
            quantity: qty
        });
    }

    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cozCart') || '[]');
}

// ===== تشغيل =====
document.addEventListener('DOMContentLoaded', init);
