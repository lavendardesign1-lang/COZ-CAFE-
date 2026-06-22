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
    localStorage.setItem('cozLang', lang);
}

// ===== بيانات المنتجات =====
let products = {};
let cart = [];

// ✅ Ziina Server
const ZIINA_URL = "https://coz-server-iho7.onrender.com/create-payment";

// ===== تهيئة =====
function init() {
    loadLang();
    loadProducts();
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

// ===== تحميل المنتجات =====
function loadProducts() {
    try {
        const saved = localStorage.getItem('cozProducts');
        if (saved) {
            products = JSON.parse(saved);
        } else {
            initializeDefaultProducts();
        }
    } catch {
        initializeDefaultProducts();
    }
}

// ✅ نفس منتجاتك (ما غيرتها)
function initializeDefaultProducts() {
    products = {
        V60: {
            labelAr: '☕ V60',
            labelEn: '☕ V60',
            items: [
                { id: 1, nameAr: 'لولي بوب 🍒', nameEn: 'Lollipop 🍒', image: 'images/Lollipop .PNG', price: 26 },
                { id: 2, nameAr: 'سنيكرز', nameEn: 'Snickers', image: 'images/Snickers .PNG', price: 26 }
            ]
        },
        ESPRESSO: {
            labelAr: '☕ ESPRESSO',
            labelEn: '☕ ESPRESSO',
            items: [
                { id: 3, nameAr: 'امريكانو مثلج', nameEn: 'Ice Americano', price: 17 },
                { id: 4, nameAr: 'اسبريسو بالرغوة', nameEn: 'Foame Espresso', price: 25 }
            ]
        }
    };
}

// ===== عرض المنتجات =====
function renderProducts() {
    const list = document.getElementById('products-list');
    if (!list) return;

    list.innerHTML = "";

    Object.entries(products).forEach(([catKey, cat]) => {

        const title = document.createElement("h2");
        title.innerText = currentLang === 'ar' ? cat.labelAr : cat.labelEn;
        list.appendChild(title);

        cat.items.forEach(item => {
            const row = document.createElement("div");

            const name = currentLang === 'ar' ? item.nameAr : item.nameEn;

            row.innerHTML = `
                ${item.image}
                <b>${name}</b>
                ${item.price} AED
                <button onclick="addToCart(${item.id}, '${catKey}')">+</button>
            `;

            list.appendChild(row);
        });
    });
}

// ===== السلة =====
function addToCart(itemId, catKey) {
    const item = products[catKey].items.find(i => i.id === itemId);

    const existing = cart.find(c => c.id === item.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    alert("✅ تمت الإضافة");
}

function loadCart() {
    const saved = localStorage.getItem('cozCart');
    if (saved) cart = JSON.parse(saved);
}

// ===== ✅ الدفع =====
async function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    if (!name || !phone || !address) {
        alert("يرجى ملء جميع الحقول");
        return;
    }

    // ✅ تحقق رقم الهاتف
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
        alert("❌ رقم الهاتف لازم يكون 10 أرقام ويبدأ بـ 05");
        return;
    }

    const orderId = "ORD-" + Date.now();

    try {
        const res = await fetch(ZIINA_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cart,
                orderId
            })
        });

        const data = await res.json();

        // ✅ تحويل للدفع
        window.location.href = data.payment_url;

    } catch (error) {
        alert("❌ خطأ في الدفع");
    }
}

// ===== تشغيل =====
document.addEventListener("DOMContentLoaded", init);