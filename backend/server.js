// Enhanced backend for Pawws Life
// Run: node backend/server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Enhanced product data with categories (child/education focused)
const products = [
  { id: 1, name: 'Learning Adventure Tee', price: 15.00, category: 'apparel', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Educational Greeting Cards', price: 3.00, category: 'cards', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Digital Learning Pack', price: 0.00, category: 'digital', image: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Creative Kids Hoodie', price: 25.00, category: 'apparel', image: 'https://images.unsplash.com/photo-1491841651911-c44c30c34548?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'STEM Activity Cards', price: 5.00, category: 'cards', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Interactive Storybooks', price: 2.00, category: 'digital', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80' }
];

// Cart storage (in production, this would be in a database)
let carts = {};

// API endpoint for products
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let filteredProducts = products;
  
  if (category && category !== 'all') {
    filteredProducts = products.filter(p => p.category === category);
  }
  
  res.json(filteredProducts);
});

// API endpoint for add to cart
app.post('/api/cart', (req, res) => {
  const { productId, name, price } = req.body;
  const sessionId = req.headers['x-session-id'] || 'default';
  
  if (!carts[sessionId]) {
    carts[sessionId] = [];
  }
  
  carts[sessionId].push({ productId, name, price, timestamp: new Date() });
  
  res.json({ 
    success: true, 
    message: price === 0 ? 'Download started!' : `${name} added to cart!`,
    cartCount: carts[sessionId].length
  });
});

// API endpoint to get cart
app.get('/api/cart', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default';
  const cart = carts[sessionId] || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  
  res.json({ items: cart, total, count: cart.length });
});

// API endpoint for team stats (mock data)
app.get('/api/teams', (req, res) => {
  const teams = [
    { id: 1, name: 'Team Readers', wins: 15, rank: 1, members: 234 },
    { id: 2, name: 'Team Artists', wins: 12, rank: 2, members: 198 },
    { id: 3, name: 'Team Explorers', wins: 10, rank: 3, members: 156 },
    { id: 4, name: 'Team Builders', wins: 8, rank: 4, members: 142 }
  ];
  res.json(teams);
});

// API endpoint for comic episodes (mock data)
app.get('/api/comics', (req, res) => {
  const comics = [
    {
      id: 1,
      title: 'The Great Learning Adventure',
      panels: [
        { id: 1, image: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&w=400&q=80', text: 'Pawws discovers a magical learning world...' },
        { id: 2, image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80', text: 'With books and knowledge everywhere!' },
        { id: 3, image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80', text: 'Let\'s learn and play together!' }
      ]
    }
  ];
  res.json(comics);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Pawws Life backend running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints available:`);
  console.log(`   GET  /api/products - Get all products (or filter by ?category=apparel|cards|digital)`);
  console.log(`   POST /api/cart - Add item to cart`);
  console.log(`   GET  /api/cart - Get cart contents`);
  console.log(`   GET  /api/teams - Get team stats`);
  console.log(`   GET  /api/comics - Get comic episodes`);
  console.log(`   GET  /api/health - Health check`);
});
