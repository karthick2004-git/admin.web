export const defaultProducts = [
  { id: 1, name: "Premium Cotton T-Shirt", category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", price: 799, discount: 15, stock: 150, sizes: ["S","M","L","XL"], description: "High-quality premium cotton t-shirt with modern fit and comfortable fabric for everyday wear." },
  { id: 2, name: "Wireless Bluetooth Earbuds", category: "electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", price: 2499, discount: 20, stock: 85, sizes: [], description: "True wireless earbuds with active noise cancellation and 24-hour battery life." },
  { id: 3, name: "Leather Crossbody Bag", category: "accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", price: 1899, discount: 10, stock: 45, sizes: [], description: "Genuine leather crossbody bag with adjustable strap and multiple compartments." },
  { id: 4, name: "Running Sports Shoes", category: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", price: 3499, discount: 25, stock: 60, sizes: ["7","8","9","10","11"], description: "Lightweight running shoes with cushioned sole and breathable mesh upper." },
  { id: 5, name: "Smart Watch Pro", category: "electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", price: 4999, discount: 0, stock: 30, sizes: [], description: "Advanced smartwatch with health monitoring, GPS, and 7-day battery life." },
  { id: 6, name: "Denim Jacket Classic", category: "clothing", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", price: 2299, discount: 5, stock: 75, sizes: ["S","M","L","XL","XXL"], description: "Classic denim jacket with modern styling and premium quality fabric." },
];

export const defaultOrders = [
  { id: "ORD-001", customer: "Rahul Sharma", email: "rahul.s@email.com", phone: "+91 98765 43210", address: "123, MG Road, Andheri West, Mumbai, Maharashtra - 400058", product: "Premium Cotton T-Shirt", quantity: 2, total: 1358, payment: "UPI", status: "delivered", date: "2024-01-15" },
  { id: "ORD-002", customer: "Priya Patel", email: "priya.p@email.com", phone: "+91 87654 32109", address: "456, Park Street, Connaught Place, Delhi - 110001", product: "Wireless Bluetooth Earbuds", quantity: 1, total: 1999, payment: "COD", status: "shipped", date: "2024-01-16" },
  { id: "ORD-003", customer: "Amit Kumar", email: "amit.k@email.com", phone: "+91 76543 21098", address: "789, Civil Lines, Indiranagar, Bangalore - 560038", product: "Running Sports Shoes", quantity: 1, total: 2624, payment: "QR Code", status: "pending", date: "2024-01-17" },
  { id: "ORD-004", customer: "Sneha Reddy", email: "sneha.r@email.com", phone: "+91 65432 10987", address: "321, Banjara Hills, Road No. 12, Hyderabad - 500034", product: "Leather Crossbody Bag", quantity: 1, total: 1709, payment: "UPI", status: "pending", date: "2024-01-17" },
  { id: "ORD-005", customer: "Vikram Singh", email: "vikram.s@email.com", phone: "+91 54321 09876", address: "567, Sector 17, Chandigarh - 160017", product: "Smart Watch Pro", quantity: 1, total: 4999, payment: "COD", status: "cancelled", date: "2024-01-14" },
];

export const defaultPaymentSettings = {
  upi: { enabled: true, id: "shop@ybl", name: "ShopAdmin Store" },
  qr:  { enabled: false, image: "" },
  cod: { enabled: true, charges: 50, maxOrder: 5000 },
};
