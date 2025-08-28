// Enhanced Pawws Life Interactive Features
let cartItems = 0;
let currentPanel = 1;
const totalPanels = 3;

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// Smooth scrolling for navigation
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

// Enhanced character jump animation with more interactions
const character = document.getElementById('character');
const jumpBtn = document.getElementById('jumpBtn');

if (jumpBtn && character) {
  jumpBtn.addEventListener('click', () => {
    character.classList.add('jump');
    jumpBtn.textContent = 'Wheee! 🎉';
    
    // Add sparkle effect
    createSparkles(character);
    
    // Make floating toys dance
    document.querySelectorAll('.floating-toy').forEach(toy => {
      toy.style.animation = 'floatToy 0.5s ease';
    });
    
    setTimeout(() => {
      character.classList.remove('jump');
      jumpBtn.textContent = 'Meet Pawws!';
    }, 700);
  });
}

// Interactive floating toys in hero section
document.querySelectorAll('.floating-toy').forEach(toy => {
  toy.addEventListener('click', function() {
    this.style.transform = 'scale(2) rotate(360deg)';
    createSparkles(this);
    
    // Different actions for different toys
    const toyIcon = this.textContent;
    let message = '';
    switch(toyIcon) {
      case '🎨': message = 'Let\'s create art together!'; break;
      case '📚': message = 'Time for reading adventures!'; break;
      case '🎮': message = 'Game time activated!'; break;
      case '🌟': message = 'You\'re a star!'; break;
    }
    
    showNotification(message);
    
    setTimeout(() => {
      this.style.transform = '';
    }, 1000);
  });
});

// Sparkle effect function
function createSparkles(element) {
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: radial-gradient(circle, #f9d423, #ff4e50);
      border-radius: 50%;
      pointer-events: none;
      animation: sparkle 1s ease-out forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
    sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
  }
}

// Add sparkle animation CSS
const sparkleCSS = `
@keyframes sparkle {
  0% { transform: scale(0) rotate(0deg); opacity: 1; }
  50% { transform: scale(1) rotate(180deg); opacity: 0.8; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
}
`;
const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);

// Enhanced product fetching and cart functionality
const productsDiv = document.getElementById('products');
const cartSummary = document.getElementById('cartSummary');
const cartCount = document.querySelector('.cart-count');

// Mock product data with categories (updated with child-focused images)
const mockProducts = [
  { id: 1, name: 'Learning Adventure Tee', price: 15.00, category: 'apparel', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Educational Greeting Cards', price: 3.00, category: 'cards', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Digital Learning Pack', price: 0.00, category: 'digital', image: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Creative Kids Hoodie', price: 25.00, category: 'apparel', image: 'https://images.unsplash.com/photo-1491841651911-c44c30c34548?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'STEM Activity Cards', price: 5.00, category: 'cards', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Interactive Storybooks', price: 2.00, category: 'digital', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80' }
];

// Load products (with fallback if backend is not available)
function loadProducts(category = 'all') {
  // Try to fetch from backend first
  fetch('http://localhost:3001/api/products')
    .then(res => res.json())
    .then(products => renderProducts(products, category))
    .catch(() => {
      // Fallback to mock data if backend is unavailable
      console.log('Backend unavailable, using mock data');
      renderProducts(mockProducts, category);
    });
}

function renderProducts(products, category = 'all') {
  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
  
  if (productsDiv) {
    productsDiv.innerHTML = filteredProducts.map(product => `
      <div class="product-card" data-category="${product.category}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <p>${product.price === 0 ? 'Free' : `$${product.price.toFixed(2)}`}</p>
        <button class="add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
          ${product.price === 0 ? 'Download' : 'Add to Cart'}
        </button>
      </div>
    `).join('');
    
    // Add event listeners for cart buttons
    attachCartListeners();
  }
}

function attachCartListeners() {
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      const productName = this.getAttribute('data-name');
      const productPrice = parseFloat(this.getAttribute('data-price'));
      
      // Add visual feedback
      this.style.transform = 'scale(0.95)';
      this.textContent = productPrice === 0 ? 'Downloaded!' : 'Added!';
      
      setTimeout(() => {
        this.style.transform = '';
        this.textContent = productPrice === 0 ? 'Download' : 'Add to Cart';
      }, 1000);
      
      if (productPrice > 0) {
        cartItems++;
        updateCartDisplay();
      }
      
      // Send to backend if available
      fetch('http://localhost:3001/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name: productName, price: productPrice })
      })
      .then(res => res.json())
      .then(data => {
        showNotification(productPrice === 0 ? 'Download started!' : `${productName} added to cart!`);
      })
      .catch(() => {
        showNotification(productPrice === 0 ? 'Download started!' : `${productName} added to cart!`);
      });
    });
  });
}

function updateCartDisplay() {
  if (cartCount) {
    cartCount.textContent = cartItems;
    cartCount.style.animation = 'bounce 0.5s ease';
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #00b894;
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 1001;
    animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2.5s forwards;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 3000);
}

// Product category filtering
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // Filter products
    const category = this.getAttribute('data-category');
    loadProducts(category);
  });
});

// Team interaction
document.querySelectorAll('.join-team-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const teamCard = this.closest('.team-card');
    const teamName = teamCard.querySelector('h3').textContent;
    
    this.textContent = 'Joined!';
    this.style.background = '#00b894';
    teamCard.style.border = '3px solid #00b894';
    
    showNotification(`Welcome to ${teamName}! 🎉`);
    
    setTimeout(() => {
      this.textContent = 'Join Team';
      this.style.background = '';
      teamCard.style.border = '';
    }, 3000);
  });
});

// Education section interactions with Memory Game
document.querySelectorAll('.play-btn, .download-btn, .resource-btn, .challenge-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const action = this.getAttribute('data-game') || this.getAttribute('data-download') || 
                   this.getAttribute('data-resource') || this.getAttribute('data-challenge');
    
    // Launch memory game if it's the memory game button
    if (action === 'memory') {
      openMemoryGame();
      return;
    }
    
    this.style.transform = 'scale(0.95)';
    this.textContent = 'Loading...';
    
    setTimeout(() => {
      this.style.transform = '';
      this.textContent = 'Launched!';
      showNotification(`${action} started! Have fun! 🎮`);
    }, 1000);
    
    setTimeout(() => {
      this.textContent = this.textContent.replace('Launched!', 'Ready');
    }, 3000);
  });
});

// Memory Game Implementation
let gameState = {
  moves: 0,
  matches: 0,
  startTime: null,
  gameInterval: null,
  flippedCards: [],
  gameCards: []
};

const gameEmojis = ['🎨', '📚', '🎮', '🌟', '🎯', '🎪'];
const gameModal = document.getElementById('gameModal');
const gameBoard = document.getElementById('gameBoard');
const closeGameBtn = document.getElementById('closeGame');

function openMemoryGame() {
  gameModal.style.display = 'block';
  initializeGame();
}

function closeMemoryGame() {
  gameModal.style.display = 'none';
  resetGame();
}

function initializeGame() {
  // Create card pairs
  gameState.gameCards = [...gameEmojis, ...gameEmojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
  
  // Reset game state
  gameState.moves = 0;
  gameState.matches = 0;
  gameState.startTime = Date.now();
  gameState.flippedCards = [];
  
  // Start timer
  gameState.gameInterval = setInterval(updateTimer, 1000);
  
  // Render game board
  renderGameBoard();
  updateGameStats();
}

function renderGameBoard() {
  gameBoard.innerHTML = gameState.gameCards.map(card => `
    <div class="memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}" 
         data-id="${card.id}" onclick="flipCard(${card.id})">
      ${card.flipped || card.matched ? card.emoji : '?'}
    </div>
  `).join('');
}

function flipCard(cardId) {
  const card = gameState.gameCards.find(c => c.id === cardId);
  
  if (card.flipped || card.matched || gameState.flippedCards.length >= 2) {
    return;
  }
  
  card.flipped = true;
  gameState.flippedCards.push(card);
  
  if (gameState.flippedCards.length === 2) {
    gameState.moves++;
    updateGameStats();
    
    setTimeout(checkMatch, 600);
  }
  
  renderGameBoard();
}

function checkMatch() {
  const [card1, card2] = gameState.flippedCards;
  
  if (card1.emoji === card2.emoji) {
    // Match found
    card1.matched = true;
    card2.matched = true;
    gameState.matches++;
    
    // Check if game is complete
    if (gameState.matches === gameEmojis.length) {
      setTimeout(gameComplete, 500);
    }
  } else {
    // No match, flip back
    card1.flipped = false;
    card2.flipped = false;
  }
  
  gameState.flippedCards = [];
  renderGameBoard();
  updateGameStats();
}

function updateGameStats() {
  document.getElementById('moveCount').textContent = gameState.moves;
  document.getElementById('matchCount').textContent = gameState.matches;
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
  document.getElementById('timeCount').textContent = elapsed;
}

function gameComplete() {
  clearInterval(gameState.gameInterval);
  const finalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
  
  document.getElementById('gameResult').innerHTML = `
    🎉 Congratulations! 🎉<br>
    You completed the game in ${gameState.moves} moves and ${finalTime} seconds!
    <br><br>
    <button onclick="initializeGame()" style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; margin: 0.5rem;">Play Again</button>
    <button onclick="closeMemoryGame()" style="background: var(--accent-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; margin: 0.5rem;">Close</button>
  `;
  
  showNotification('🎉 Memory game completed! Great job!');
}

function resetGame() {
  if (gameState.gameInterval) {
    clearInterval(gameState.gameInterval);
  }
  document.getElementById('gameResult').innerHTML = '';
}

// Event listeners for game modal
if (closeGameBtn) {
  closeGameBtn.addEventListener('click', closeMemoryGame);
}

// Close modal when clicking outside
gameModal?.addEventListener('click', (e) => {
  if (e.target === gameModal) {
    closeMemoryGame();
  }
});

// Comic panel navigation
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const panelCounter = document.querySelector('.panel-counter');
const panels = document.querySelectorAll('.panel');

function updatePanelDisplay() {
  panels.forEach((panel, index) => {
    panel.style.display = index === currentPanel - 1 ? 'block' : 'none';
  });
  if (panelCounter) {
    panelCounter.textContent = `${currentPanel} / ${totalPanels}`;
  }
  
  // Update button states
  if (prevBtn) prevBtn.disabled = currentPanel === 1;
  if (nextBtn) nextBtn.disabled = currentPanel === totalPanels;
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentPanel > 1) {
      currentPanel--;
      updatePanelDisplay();
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentPanel < totalPanels) {
      currentPanel++;
      updatePanelDisplay();
    }
  });
}

// Add scroll animation CSS
const scrollCSS = `
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes slideOutRight {
  to { transform: translateX(100%); opacity: 0; }
}
`;
const scrollStyle = document.createElement('style');
scrollStyle.textContent = scrollCSS;
document.head.appendChild(scrollStyle);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updatePanelDisplay();
});

// CMS integration placeholder - where real CMS data would be loaded
console.log('🔧 CMS Integration Ready: This is where WordPress/Webflow content would be dynamically loaded');
