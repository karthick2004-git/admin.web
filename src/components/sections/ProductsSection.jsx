import { useState } from 'react';
import { formatPrice } from './DashboardSection';

function calcDiscounted(price, discount) { return Math.round(price * (1 - discount / 100)); }

const DEFAULT_CATEGORIES = [
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'shirts', label: 'Shirts' },
  { value: 't-shirts', label: 'T-Shirts' },
];

export { DEFAULT_CATEGORIES };

export default function ProductsSection({ products, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const filtered = products.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const mc = !category || p.category === category;
    let mst = true;
    if (stockFilter === 'in-stock') mst = p.stock > 20;
    if (stockFilter === 'low-stock') mst = p.stock > 0 && p.stock <= 20;
    if (stockFilter === 'out-of-stock') mst = p.stock === 0;
    return ms && mc && mst;
  });

  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    const value = trimmed.toLowerCase().replace(/\s+/g, '-');
    const label = trimmed.replace(/\b\w/g, l => l.toUpperCase());
    if (!categories.find(c => c.value === value)) {
      setCategories(prev => [...prev, { value, label }]);
    }
    setCategory(value);
    setNewCatName('');
    setShowAddCat(false);
  };

  return (
    <section className="animate-in">

      {/* ── Page header (tall — contains title + all filters) ── */}
      <div className="page-header-tall">

        {/* Row 1: Title + Add Product button */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold whitespace-nowrap">Product Inventory</h1>
            <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>Manage and track your store products</p>
          </div>
          <button onClick={onAdd}
            className="gradient-btn px-5 py-2.5 rounded-xl font-semibold text-white flex items-center gap-2 text-sm flex-shrink-0 ml-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Product
          </button>
        </div>

        {/* Row 2: Search | Categories + Add Category | All Stock */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* Search bar */}
          <div className="relative" style={{ width: 280 }}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="input-field search-input h-10 text-sm"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Categories dropdown with Add Category integrated */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <select
              className="input-field h-10 text-sm"
              style={{ width: 200 }}
              value={category}
              onChange={e => {
                if (e.target.value === 'ADD_NEW') {
                  const name = window.prompt('Enter new category name:');
                  if (name) {
                    const trimmed = name.trim();
                    const value = trimmed.toLowerCase().replace(/\s+/g, '-');
                    const label = trimmed.replace(/\b\w/g, l => l.toUpperCase());
                    if (!categories.find(c => c.value === value)) {
                      setCategories(prev => [...prev, { value, label }]);
                    }
                    setCategory(value);
                  }
                } else {
                  setCategory(e.target.value);
                }
              }}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
              <option value="ADD_NEW" style={{ fontWeight: 'bold', color: 'var(--accent)' }}>+ Add Category</option>
            </select>
          </div>

          {/* All Stock dropdown */}
          <select
            className="input-field h-10 text-sm flex-shrink-0"
            style={{ width: 150 }}
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value)}>
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

        </div>
      </div>

      {/* ── Products grid ── */}
      <div className="section-container">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No products matching your criteria</p>
          </div>
        ) : (
          /* Fixed 4-per-row grid */
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {filtered.map((product, i) => {
              const disc = calcDiscounted(product.price, product.discount);
              const stockColor = product.stock === 0
                ? 'var(--danger)'
                : product.stock < 20 ? 'var(--warning)' : 'var(--success)';
              const imgUrl = product.image_url || product.image ||
                'https://images.unsplash.com/photo-1556905055-8f358a7a4bc4?q=80&w=800&auto=format&fit=crop';

              return (
                <div key={product.id} className="product-card animate-in"
                  style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="relative">
                    <img src={imgUrl} alt={product.name} className="product-image"
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1556905055-8f358a7a4bc4?q=80&w=800&auto=format&fit=crop'} />
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider"
                        style={{ background: 'var(--danger)' }}>
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest"
                      style={{ color: 'var(--accent)' }}>
                      {product.category.replace(/-/g, ' ')}
                    </span>
                    <h3 className="font-semibold text-sm line-clamp-2 leading-snug">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold text-sm">{formatPrice(disc)}</span>
                      {product.discount > 0 && (
                        <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-0.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: stockColor }} />
                        <span style={{ color: stockColor }}>Stock: {product.stock}</span>
                      </div>
                      {product.sizes?.length > 0 && (
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {product.sizes.join(' | ')}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button onClick={() => onEdit(product.id)} className="btn-icon flex-1" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => onDelete(product.id)} className="btn-icon danger flex-1" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
