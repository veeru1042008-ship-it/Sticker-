// 1. Sticker Database
const stickers = [
    {
        id: 1,
        name: "Retro Wave",
        price: 3.99,
        category: "retro",
        image: "https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Retro+Wave"
    },
    {
        id: 2,
        name: "Die Cut Ghost",
        price: 2.50,
        category: "cute",
        image: "https://via.placeholder.com/300x300/4ecdc4/ffffff?text=Ghost"
    },
    {
        id: 3,
        name: "Coffee Addict",
        price: 4.00,
        category: "brand",
        image: "https://via.placeholder.com/300x300/2d3436/ffffff?text=Coffee"
    },
    {
        id: 4,
        name: "80s Vibe",
        price: 3.50,
        category: "retro",
        image: "https://via.placeholder.com/300x300/fab1a0/ffffff?text=80s+Vibe"
    },
    {
        id: 5,
        name: "Cute Avocado",
        price: 2.99,
        category: "cute",
        image: "https://via.placeholder.com/300x300/ffeaa7/ffffff?text=Avocado"
    },
    {
        id: 6,
        name: "Minimalist Brand",
        price: 5.00,
        category: "brand",
        image: "https://via.placeholder.com/300x300/636e72/ffffff?text=Minimalist"
    }
];

// 2. Initialize Shop
const productGrid = document.getElementById('product-grid');
let cart = [];

// Render Products
function displayStickers(items) {
    productGrid.innerHTML = items.map(sticker => `
        <div class="sticker-card">
            <img src="${sticker.image}" alt="${sticker.name}" class="sticker-img">
            <div class="sticker-info">
                <h3>${sticker.name}</h3>
                <p class="price">$${sticker.price.toFixed(2)}</p>
                <button class="add-btn" onclick="addToCart(${sticker.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Initial Load
displayStickers(stickers);

// 3. Filter Function
function filterStickers(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if(category === 'all') {
        displayStickers(stickers);
    } else {
        const filtered = stickers.filter(s => s.category === category);
        displayStickers(filtered);
    }
}

// 4. Cart Logic
function addToCart(id) {
    const sticker = stickers.find(s => s.id === id);
    cart.push(sticker);
    updateCartUI();
    
    // Simple animation feedback
    const btn = event.target;
    btn.innerText = "Added!";
    setTimeout(() => btn.innerText = "Add to Cart", 1000);
}

function updateCartUI() {
    // Update Count
    document.getElementById('cart-count').innerText = cart.length;

    // Update List
    const cartItemsContainer = document.getElementById('cart-items');
    
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
                <i class="fas fa-trash" style="color:red; cursor:pointer" onclick="removeFromCart(${index})"></i>
            </div>
        `).join('');
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-amount').innerText = '$' + total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// 5. Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if(cartSidebar.style.right === '0px') {
        cartSidebar.style.right = '-100%';
        cartOverlay.style.display = 'none';
    } else {
        cartSidebar.style.right = '0px';
        cartOverlay.style.display = 'block';
    }
}