// ===== Language Management =====
let currentLang = 'ar';

function changeLanguage(lang) {
    currentLang = lang;
    document.body.className = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update all elements with data-ar and data-en
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Update input placeholders
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
        el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
    });

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Re-render products to apply language changes
    renderProducts();
    localStorage.setItem('cozLang', lang);
}

// ===== بيانات المنتجات =====
const productsAr = {
    V60: {
        labelAr: '☕ V60',
        labelEn: '☕ V60',
        mainImage: 'images/V60.PNG',
        items: [
            { id: 1, nameAr: 'لولي بوب 🍒', nameEn: 'Lollipop 🍒', image: 'images/Lollipop .PNG', price: 26 },
            { id: 2, nameAr: 'سنيكرز', nameEn: 'Snickers', image: 'images/Snickers .PNG', price: 26 },
            { id: 3, nameAr: 'توباكو', nameEn: 'Tobacco', image: 'images/Tobacco .PNG', price: 26 },
            { id: 4, nameAr: 'كريم بورليه', nameEn: 'Crème brûlée', image: 'images/Creme.PNG', price: 26 }
        ]
    },
    ESPRESSO: {
        labelAr: '☕ ESPRESSO',
        labelEn: '☕ ESPRESSO',
        items: [
            { id: 5, nameAr: 'امريكانو مثلج', nameEn: 'Ice Americano', image: '', price: 17 },
            { id: 6, nameAr: 'اسبريسو بالرغوة', nameEn: 'Foame Espresso', image: 'images/Fome.PNG', price: 25 },
            { id: 7, nameAr: 'اسبريسو بالرغوة (شوكولاته غامقة)', nameEn: 'Dark Foame Espresso', image: '', price: 27 }
        ]
    },
    MATCHA: {
        labelAr: '🍵 ماتشا',
        labelEn: '🍵 MATCHA',
        items: [
            { id: 8, nameAr: 'ماتشا برغوة', nameEn: 'Foame Matcha', image: 'images/Matcha.PNG', price: 29, coconutOption: true }
        ]
    },
    HIBISCUS: {
        labelAr: '🌺 كركديه',
        labelEn: '🌺 HIBISCUS',
        items: [
            { id: 9, nameAr: 'كركديه', nameEn: 'Hibiscus', image: '', price: 13 }
        ]
    },
    DESSERTS: {
        labelAr: '🍫 حلويات',
        labelEn: '🍫 Desserts',
        items: [
            { id: 10, nameAr: 'روكي رود – 2 قطعة', nameEn: 'RockyRoad – 2 pieces', image: 'images/Rocky road .jpg', price: 12 }
        ]
    }
};

let products = productsAr;
let cart = [];

// ===== Ziina Configuration =====
const ZIINA_CONFIG = {
    apiKey: '8OKX7oHy/bm5O3fVJTeLQIvqM8P9unWyUxtBoqtrFFmaZbrPrEu+zP6zDZ9eWhQx',
    basePaymentLink: 'https://pay.ziina.com/ar/sharjha11/'
};

// ===== تهيئة =====
function init() {
    loadLang();
    loadCart();
    renderProducts();
    setupLanguageButtons();
}

function loadLang() {
    const saved = localStorage.getItem('cozLang') || 'ar';
    changeLanguage(saved);
}

function setupLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.getAttribute('data-lang'));
        });
    });
}

// ===== التحقق من توفر المنتج =====
function isProductAvailable(productId) {
    const availability = JSON.parse(localStorage.getItem('productsAvailability') || '{}');
    return availability[productId] !== false;
}

// ===== رسم المنتجات =====
function renderProducts() {
    const list = document.getElementById('products-list');
    list.innerHTML = '';

    Object.entries(products).forEach(([catKey, cat]) => {
        const section = document.createElement('div');
        section.className = 'category-section';

        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = currentLang === 'ar' ? cat.labelAr : cat.labelEn;
        section.appendChild(title);

        if (catKey === 'V60') {
            // صورة V60 الرئيسية
            if (cat.mainImage) {
                const mainImg = document.createElement('img');
                mainImg.src = cat.mainImage;
                mainImg.alt = 'V60';
                mainImg.className = 'v60-main-img';
                mainImg.onerror = () => { mainImg.style.display = 'none'; };
                section.appendChild(mainImg);
            }

            // شبكة النكهات
            const grid = document.createElement('div');
            grid.className = 'v60-flavors';

            cat.items.forEach(item => {
                const available = isProductAvailable(item.id);
                const card = document.createElement('div');
                card.className = 'v60-flavor-card';
                card.style.opacity = available ? '1' : '0.5';
                
                const itemName = currentLang === 'ar' ? item.nameAr : item.nameEn;
                const btnText = available 
                    ? (currentLang === 'ar' ? '+ أضف' : '+ Add')
                    : (currentLang === 'ar' ? '❌ غير متوفر' : '❌ Unavailable');
                
                card.innerHTML = `
                    <img src="${item.image}" alt="${itemName}" class="v60-flavor-img"
                         onerror="this.style.background='linear-gradient(135deg,#d4a46a,#C19A6B)';this.style.display='block';">
                    <div class="v60-flavor-info">
                        <span class="v60-flavor-name">${itemName}</span>
                        <span class="v60-flavor-price">${item.price} AED</span>
                    </div>
                    <div class="v60-flavor-actions">
                        <input type="number" id="qty-${item.id}" class="qty-input" value="1" min="1" max="10" ${available ? '' : 'disabled'}>
                        <button class="add-btn ${available ? '' : 'unavailable'}" 
                                onclick="${available ? `addToCart(${item.id}, '${catKey}')` : 'return false'}"
                                ${available ? '' : 'disabled'}
                                style="background-color: ${available ? '' : '#999'};">
                            ${btnText}
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            });

            section.appendChild(grid);

        } else if (catKey === 'MATCHA') {
            cat.items.forEach(item => {
                const row = document.createElement('div');
                row.innerHTML = buildProductRow(item, catKey);
                section.appendChild(row.firstElementChild);

                // خيار Coconut Milk
                const available = isProductAvailable(item.id);
                const coconut = document.createElement('div');
                coconut.className = 'coconut-option';
                coconut.id = `coconut-wrapper-${item.id}`;
                coconut.innerHTML = `
                    <label>
                        <input type="checkbox" id="coconut-${item.id}" ${available ? '' : 'disabled'}>
                        Coconut Milk <strong>+3 AED</strong>
                    </label>
                `;
                section.appendChild(coconut);
            });

        } else {
            // باقي الفئات: قائمة بسيطة
            cat.items.forEach(item => {
                const row = document.createElement('div');
                row.innerHTML = buildProductRow(item, catKey);
                section.appendChild(row.firstElementChild);
            });
        }

        list.appendChild(section);
    });
}

function buildProductRow(item, catKey) {
    const available = isProductAvailable(item.id);
    const itemName = currentLang === 'ar' ? item.nameAr : item.nameEn;
    const imgHTML = item.image
        ? `<img src="${item.image}" alt="${itemName}" class="product-thumb"
               onerror="this.style.display='none'">`
        : '';

    const btnText = available 
        ? (currentLang === 'ar' ? '+ أضف' : '+ Add')
        : (currentLang === 'ar' ? '❌ غير متوفر' : '❌ Unavailable');

    return `
        <div class="product-row" style="opacity: ${available ? '1' : '0.5'};">
            <div class="product-row-left">
                ${imgHTML}
                <div>
                    <div class="product-row-name">${itemName}</div>
                </div>
            </div>
            <div class="product-row-right">
                <span class="price-tag">${item.price} AED</span>
                <input type="number" id="qty-${item.id}" class="qty-input" value="1" min="1" max="10" ${available ? '' : 'disabled'}>
                <button class="add-btn ${available ? '' : 'unavailable'}" 
                        onclick="${available ? `addToCart(${item.id}, '${catKey}')` : 'return false'}"
                        ${available ? '' : 'disabled'}
                        style="background-color: ${available ? '' : '#999'};">
                    ${btnText}
                </button>
            </div>
        </div>
    `;
}

// ===== إضافة للسلة =====
function addToCart(itemId, catKey) {
    // التحقق من التوفر قبل الإضافة
    if (!isProductAvailable(itemId)) {
        alert(currentLang === 'ar' ? 'هذا المنتج غير متوفر حالياً' : 'This product is not available');
        return;
    }

    const item = products[catKey].items.find(i => i.id === itemId);
    const qty = parseInt(document.getElementById(`qty-${itemId}`).value) || 1;
    let finalPrice = item.price;
    let itemName = currentLang === 'ar' ? item.nameAr : item.nameEn;

    // Coconut milk add-on
    const coconutCheckbox = document.getElementById(`coconut-${itemId}`);
    if (coconutCheckbox && coconutCheckbox.checked) {
        finalPrice += 3;
        itemName += ' (Coconut Milk)';
    }

    const key = `${itemId}-${itemName}`;
    const existing = cart.find(c => c.key === key);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ key, id: itemId, name: itemName, price: finalPrice, quantity: qty });
    }

    saveCart();
    updateCartCount();

    const btn = document.querySelector(`button.add-btn[onclick="addToCart(${itemId}, '${catKey}')"]`);
    if (btn) {
        const orig = btn.textContent;
        btn.textContent = currentLang === 'ar' ? '✓ تمت الإضافة' : '✓ Added';
        btn.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            btn.textContent = orig;
            btn.style.backgroundColor = '';
        }, 1200);
    }

    document.getElementById(`qty-${itemId}`).value = 1;
    if (coconutCheckbox) coconutCheckbox.checked = false;
}

// ===== تحديث عداد السلة =====
function updateCartCount() {
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// ===== رسم السلة =====
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');

    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart">${currentLang === 'ar' ? 'السلة فارغة' : 'Cart is empty'} 🛒</div>`;
        totalEl.textContent = '0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, idx) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-qty">${currentLang === 'ar' ? 'الكمية' : 'Qty'}: ${item.quantity} × ${item.price} AED</div>
                </div>
                <span class="cart-item-price">${itemTotal} AED</span>
                <button class="remove-btn" onclick="removeFromCart(${idx})" title="حذف">✕</button>
            </div>
        `;
    });

    container.innerHTML = html;
    totalEl.textContent = total;
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartCount();
    renderCart();
}

// ===== localStorage =====
function saveCart() {
    localStorage.setItem('cozCart', JSON.stringify(cart));
}

function loadCart() {
    try {
        const saved = localStorage.getItem('cozCart');
        if (saved) {
            cart = JSON.parse(saved);
            updateCartCount();
        }
    } catch (e) {
        cart = [];
    }
}

// ===== التنقل =====
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goHome() {
    closeAllModals();
    showSection('home');
}

function goProducts() {
    closeAllModals();
    showSection('products');
}

// ===== مودالات =====
function showMenuModal() {
    document.getElementById('menu-modal').classList.add('active');
}
function closeMenuModal() {
    document.getElementById('menu-modal').classList.remove('active');
}

function showCartModal() {
    renderCart();
    document.getElementById('cart-modal').classList.add('active');
}
function closeCartModal() {
    document.getElementById('cart-modal').classList.remove('active');
}

function goCheckout() {
    if (cart.length === 0) { 
        alert(currentLang === 'ar' ? 'السلة فارغة!' : 'Cart is empty!'); 
        return; 
    }

    // التحقق من فتح الطلبات
    const ordersOpen = localStorage.getItem('ordersOpen') !== 'false';
    if (!ordersOpen) {
        alert(currentLang === 'ar' ? 'الطلبات مغلقة حالياً' : 'Orders are closed');
        return;
    }

    closeCartModal();
    document.getElementById('checkout-modal').classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

function closeAllModals() {
    ['menu-modal','cart-modal','checkout-modal','order-modal'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
}

// إغلاق عند النقر خارج المودال
document.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ===== تأكيد الطلب والدفع عبر زينه =====
function submitOrder(event) {
    event.preventDefault();

    const name    = document.getElementById('cust-name').value.trim();
    const phone   = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    if (!name || !phone || !address) {
        alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
        return;
    }

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const orderId = 'ORD-' + Date.now();

    const orderData = {
        orderId: orderId,
        name: name,
        phone: phone,
        address: address,
        items: cart.map(i => ({ ...i })),
        total: total,
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    // حفظ الطلب في السجل
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    saveOrderToHistory(orderData);

    // إغلاق النافذة وتصفير السلة
    closeCheckoutModal();
    document.getElementById('checkout-form').reset();
    cart = [];
    saveCart();
    updateCartCount();

    // الانتقال إلى صفحة النجاح
    window.location.href = 'success.html';
}

// ===== حفظ الطلب في سجل الطلبات =====
function saveOrderToHistory(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('cozOrders') || '[]');
        orders.unshift(orderData);
        localStorage.setItem('cozOrders', JSON.stringify(orders));

        // إرسال إشعار بريد إلكتروني إذا كانت الإشعارات مفعلة
        if (localStorage.getItem('emailNotifications') !== 'false') {
            sendEmailNotification(orderData);
        }
    } catch (e) {
        console.error('Error saving order:', e);
    }
}

// ===== إرسال إشعار بريدي =====
function sendEmailNotification(orderData) {
    // ملاحظة: هذا يتطلب backend أو خدمة مثل Firebase
    console.log('📧 إشعار جديد:', orderData);
    
    // يمكن إضافة رابط للإشعارات هنا لاحقاً
    // مثل emailjs.send() أو Firebase function
}

document.addEventListener('DOMContentLoaded', init);
