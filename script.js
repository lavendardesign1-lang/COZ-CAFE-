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
        label: '☕ V60',
        mainImage: 'images/V60.PNG',
        items: [
            { id: 1, name: 'Lollipop',      image: 'images/Lollipop .PNG',   price: 26 },
            { id: 2, name: 'Snickers',       image: 'images/Snickers .PNG',   price: 26 },
            { id: 3, name: 'Tobacco',        image: 'images/Tobacco .PNG',    price: 26 },
            { id: 4, name: 'Crème brûlée',   image: 'images/Creme.PNG', price: 26 }
        ]
    },
    ESPRESSO: {
        label: '☕ ESPRESSO',
        items: [
            { id: 5, name: 'Ice Americano',      image: '',             price: 17 },
            { id: 6, name: 'Foame Espresso',     image: 'images/Fome.PNG', price: 25 },
            { id: 7, name: 'Dark Foame Espresso', image: '',            price: 27 }
        ]
    },
    MATCHA: {
        label: '🍵 MATCHA',
        items: [
            { id: 8, name: 'Foame Matcha', image: 'images/Matcha.PNG', price: 29, coconutOption: true }
        ]
    },
    HIBISCUS: {
        label: '🌺 HIBISCUS',
        items: [
            { id: 9, name: 'Hibiscus', image: '', price: 13 }
        ]
    },
    DESERT: {
        label: '🍫 DESERT',
        items: [
            { id: 10, name: 'RockyRoad – 2 pieces', image: 'images/Rocky road .jpg', price: 12 }
        ]
    }
};

let products = productsAr;
let cart = [];

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

// ===== رسم المنتجات =====
function renderProducts() {
    const list = document.getElementById('products-list');
    list.innerHTML = '';

    Object.entries(products).forEach(([catKey, cat]) => {
        const section = document.createElement('div');
        section.className = 'category-section';

        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = cat.label;
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
                const card = document.createElement('div');
                card.className = 'v60-flavor-card';
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="v60-flavor-img"
                         onerror="this.style.background='linear-gradient(135deg,#d4a46a,#C19A6B)';this.style.display='block';">
                    <div class="v60-flavor-info">
                        <span class="v60-flavor-name">${item.name}</span>
                        <span class="v60-flavor-price">${item.price} AED</span>
                    </div>
                    <div class="v60-flavor-actions">
                        <input type="number" id="qty-${item.id}" class="qty-input" value="1" min="1" max="10">
                        <button class="add-btn" onclick="addToCart(${item.id}, '${catKey}')">${currentLang === 'ar' ? '+ أضف' : '+ Add'}</button>
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
                const coconut = document.createElement('div');
                coconut.className = 'coconut-option';
                coconut.id = `coconut-wrapper-${item.id}`;
                coconut.innerHTML = `
                    <label>
                        <input type="checkbox" id="coconut-${item.id}">
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
    const imgHTML = item.image
        ? `<img src="${item.image}" alt="${item.name}" class="product-thumb"
               onerror="this.style.display='none'">`
        : '';

    return `
        <div class="product-row">
            <div class="product-row-left">
                ${imgHTML}
                <div>
                    <div class="product-row-name">${item.name}</div>
                </div>
            </div>
            <div class="product-row-right">
                <span class="price-tag">${item.price} AED</span>
                <input type="number" id="qty-${item.id}" class="qty-input" value="1" min="1" max="10">
                <button class="add-btn" onclick="addToCart(${item.id}, '${catKey}')">${currentLang === 'ar' ? '+ أضف' : '+ Add'}</button>
            </div>
        </div>
    `;
}

// ===== إضافة للسلة =====
function addToCart(itemId, catKey) {
    const item = products[catKey].items.find(i => i.id === itemId);
    const qty = parseInt(document.getElementById(`qty-${itemId}`).value) || 1;
    let finalPrice = item.price;
    let itemName = item.name;

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

// ===== تأكيد الطلب =====
function submitOrder(event) {
    event.preventDefault();

    const name    = document.getElementById('cust-name').value.trim();
    const phone   = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const payment = document.getElementById('cust-payment').value;

    if (!name || !phone || !address || !payment) {
        alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
        return;
    }

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const orderId = 'ORD-' + Date.now();

    let itemsHTML = '';
    cart.forEach(item => {
        itemsHTML += `
            <div class="order-row">
                <span>${item.name}</span>
                <span>${item.quantity} × ${item.price} = ${item.quantity * item.price} AED</span>
            </div>
        `;
    });

    const labels = {
        ar: {
            success: '✓ تم تأكيد الطلب بنجاح!',
            orderId: 'رقم الطلب',
            name: 'الاسم',
            phone: 'الهاتف',
            address: 'العنوان',
            payment: 'الدفع',
            total: 'الإجمالي',
            status: '⏳ قيد المعالجة – سيتم التواصل معك قريباً'
        },
        en: {
            success: '✓ Order confirmed successfully!',
            orderId: 'Order ID',
            name: 'Name',
            phone: 'Phone',
            address: 'Address',
            payment: 'Payment',
            total: 'Total',
            status: '⏳ Processing - We will contact you soon'
        }
    };

    const l = labels[currentLang];

    const detailsHTML = `
        <div class="order-success">${l.success}</div>
        <div class="order-row"><span>${l.orderId}</span><strong>${orderId}</strong></div>
        <div class="order-row"><span>${l.name}</span><span>${name}</span></div>
        <div class="order-row"><span>${l.phone}</span><span>${phone}</span></div>
        <div class="order-row"><span>${l.address}</span><span>${address}</span></div>
        <div class="order-row"><span>${l.payment}</span><span>${payment}</span></div>
        <hr style="margin:0.75rem 0;border-color:#f0e8e0">
        ${itemsHTML}
        <div class="order-row order-total">
            <span>${l.total}</span>
            <span>${total} AED</span>
        </div>
        <div class="order-status">${l.status}</div>
    `;

    document.getElementById('order-content').innerHTML = detailsHTML;
    closeCheckoutModal();
    document.getElementById('order-modal').classList.add('active');

    document.getElementById('checkout-form').reset();
    cart = [];
    saveCart();
    updateCartCount();
}

document.addEventListener('DOMContentLoaded', init);
