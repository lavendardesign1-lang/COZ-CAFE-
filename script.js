// ===== Language =====
let currentLang = 'ar';

// ===== البيانات =====
let products = {};
let cart = [];
let quantities = {};

// ✅ رابط السيرفر
const ZIINA_URL = "https://coz-server-iho7.onrender.com/create-payment";

// ===== تهيئة =====
function init() {
    loadProducts();
    renderProducts();
}

// ===== المنتجات (نفس موقعك ✅) =====
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
                { id: 3, nameAr: 'امريكانو مثلج', image: '', price: 17 },
                { id: 4, nameAr: 'اسبريسو بالرغوة', image: 'images/Fome.PNG', price: 25 }
            ]
        }
    };
}

// ===== عرض احترافي ✅ =====
function renderProducts() {
    const list = document.getElementById('products-list');
    if (!list) return;

    list.innerHTML = "";

    Object.values(products).forEach(cat => {

        const title = document.createElement("h2");
        title.innerText = cat.labelAr;
        list.appendChild(title);

        cat.items.forEach(item => {

            quantities[item.id] = quantities[item.id] || 1;

            const row = document.createElement("div");
            row.className = "product-line";

            const img = item.image 
                ? `${item.image}` 
                : "";

            row.innerHTML = `

                ${img}

                <div class="product-info">
                    <div class="product-name">${item.nameAr}</div>
                    <div class="product-price">${item.price} AED</div>
                </div>

                <div class="product-qty">
                    <button onclick="changeQty(${item.id}, -1)">−</button>
                    <span id="qty-${item.id}">${quantities[item.id]}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </div>

                <button class="add-btn" onclick="addToCart(${item.id})">
                    إضافة
                </button>
            `;

            list.appendChild(row);
        });
    });
}

// ===== تغيير الكمية =====
function changeQty(id, change) {
    quantities[id] = (quantities[id] || 1) + change;

    if (quantities[id] < 1) quantities[id] = 1;

    document.getElementById(`qty-${id}`).innerText = quantities[id];
}

// ===== السلة =====
function addToCart(id) {
    let item;

    Object.values(products).forEach(cat => {
        cat.items.forEach(p => {
            if (p.id === id) item = p;
        });
    });

    const qty = quantities[id];

    const existing = cart.find(c => c.id === id);

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

    alert("✅ تمت الإضافة للسلة");
}

// ===== ✅ الدفع =====
async function submitOrder(event) {
    event.preventDefault();

    const name    = document.getElementById('cust-name').value.trim();
    const phone   = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    if (!name || !phone || !address) {
        alert("يرجى ملء جميع الحقول");
        return;
    }

    // ✅ تحقق رقم الهاتف
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
        alert("❌ الرقم لازم 10 أرقام ويبدأ بـ 05");
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

        window.location.href = data.payment_url;

    } catch {
        alert("❌ خطأ في الدفع");
    }
}

// ===== تشغيل =====
document.addEventListener("DOMContentLoaded", init);

function goCheckout() {
    showSection('products');
}

// ===== التنقل بين الصفحات =====// ===== التنقل بين الصفحات =====
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });

    const section = document.getElementById(id);
    if (section) {
        section.classList.add('active');
    }
}

// ===== أزرار التنقل =====
function goHome() {
    showSection('home');
}

function goProducts() {
    showSection('products');
}

// ===== المودالات =====
function showCartModal() {
    document.getElementById('cart-modal').classList.add('active');
}

function closeCartModal() {
    document.getElementById('cart-modal').classList.remove('active');
}

function showMenuModal() {
    document.getElementById('menu-modal').classList.add('active');
}

function closeMenuModal() {
    document.getElementById('menu-modal').classList.remove('active');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}