import { useState, useEffect, useRef } from 'react';

const DEFAULT_MODAL_CATEGORIES = [
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'shirts',       label: 'Shirts' },
  { value: 't-shirts',     label: 'T-Shirts' },
];

export default function ProductModal({ isOpen, onClose, onSave, editProduct }) {
  const [form, setForm] = useState({
    name: '', category: '', image: '', price: '', discount: '0',
    stock: '', sizes: [], description: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef();
  const [categories, setCategories] = useState(DEFAULT_MODAL_CATEGORIES);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        category: editProduct.category,
        image: editProduct.image,
        price: editProduct.price,
        discount: editProduct.discount,
        stock: editProduct.stock,
        sizes: editProduct.sizes || [],
        description: editProduct.description,
      });
      setImagePreview(editProduct.image);
    } else {
      setForm({ name:'', category:'', image:'', price:'', discount:'0', stock:'', sizes:[], description:'' });
      setImagePreview('');
    }
  }, [editProduct, isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const processImage = (file, callback) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 800;
        let w = img.width, h = img.height;
        if (w > h && w > max) { h *= max/w; w = max; } else if (h > max) { w *= max/h; h = max; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processImage(file, (dataUrl) => {
      setForm(f => ({ ...f, image: dataUrl }));
      setImagePreview(dataUrl);
    });
  };

  const removeImage = () => {
    setForm(f => ({ ...f, image: '' }));
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name,
      category: form.category,
      image_url: form.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a4bc4?q=80&w=2070&auto=format&fit=crop',
      price: parseInt(form.price),
      discount: parseInt(form.discount) || 0,
      stock: parseInt(form.stock),
      sizes: form.sizes,
      description: form.description,
    }, editProduct?.id);
  };

  const toggleSize = (size) => {
    setForm(f => {
      const next = f.sizes.includes(size)
        ? f.sizes.filter(s => s !== size)
        : [...f.sizes, size];
      return { ...f, sizes: next };
    });
  };

  const handleDiscountChange = (val) => {
    // If it's just '0' and user types a digit, replace it
    let cleaned = val;
    if (form.discount === '0' && val.length > 1 && val.startsWith('0')) {
      cleaned = val.substring(1);
    }
    setForm(f => ({...f, discount: cleaned}));
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="btn-icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Product Name</label>
            <input type="text" className="input-field" placeholder="Enter product name" required
              value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Category</label>
            <select className="input-field" required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {/* Inline add category */}
            {showAddCat ? (
              <div className="flex gap-1.5 mt-2">
                <input
                  type="text"
                  className="input-field text-sm"
                  style={{height:36}}
                  placeholder="e.g. Hoodies"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const trimmed = newCatName.trim();
                      if (!trimmed) return;
                      const value = trimmed.toLowerCase().replace(/\s+/g, '-');
                      const label = trimmed.replace(/\b\w/g, l => l.toUpperCase());
                      if (!categories.find(c => c.value === value)) {
                        setCategories(prev => [...prev, { value, label }]);
                      }
                      setForm(f => ({ ...f, category: value }));
                      setNewCatName('');
                      setShowAddCat(false);
                    }
                    if (e.key === 'Escape') { setShowAddCat(false); setNewCatName(''); }
                  }}
                  autoFocus
                />
                <button type="button"
                  onClick={() => {
                    const trimmed = newCatName.trim();
                    if (!trimmed) return;
                    const value = trimmed.toLowerCase().replace(/\s+/g, '-');
                    const label = trimmed.replace(/\b\w/g, l => l.toUpperCase());
                    if (!categories.find(c => c.value === value)) {
                      setCategories(prev => [...prev, { value, label }]);
                    }
                    setForm(f => ({ ...f, category: value }));
                    setNewCatName('');
                    setShowAddCat(false);
                  }}
                  className="px-3 rounded-lg text-white text-sm font-semibold flex-shrink-0"
                  style={{background:'var(--accent)', height:36}}>Add</button>
                <button type="button" onClick={() => { setShowAddCat(false); setNewCatName(''); }}
                  className="btn-icon flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setShowAddCat(true)}
                className="mt-2 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
                style={{color:'var(--accent)', background:'var(--accent-soft)'}}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                </svg>
                Add Category
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Product Image</label>
            <div className="file-input-wrapper">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange}/>
              <div className="file-input-label">
                {imagePreview ? (
                  <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg><span>Image Loaded</span></>
                ) : (
                  <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span>Click to upload image</span></>
                )}
              </div>
            </div>
            {imagePreview && (
              <div className="mt-3 relative">
                <img src={imagePreview} alt="Preview"
                  className="w-full h-40 object-contain rounded-lg border"
                  style={{background:'var(--bg-secondary)', borderColor:'var(--border)'}}/>
                <button type="button" onClick={removeImage}
                  className="btn-icon danger absolute top-2 right-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Price (Rs)</label>
              <input type="number" className="input-field" placeholder="999" required
                value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Discount (%)</label>
              <input type="number" className="input-field" placeholder="10"
                value={form.discount} onChange={e => handleDiscountChange(e.target.value)}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Stock</label>
              <input type="number" className="input-field" placeholder="100" required
                value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Sizes</label>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map(sz => {
                  const isActive = form.sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                      style={{
                        background: isActive ? 'var(--accent)' : 'var(--bg-secondary)',
                        color: isActive ? '#fff' : 'var(--text-secondary)',
                        borderColor: isActive ? 'var(--accent)' : 'var(--border)'
                      }}>
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Description</label>
            <textarea className="input-field resize-none" style={{height:96}} placeholder="Product description..."
              value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}/>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold border transition-colors"
              style={{background:'var(--bg-secondary)', borderColor:'var(--border)'}}>
              Cancel
            </button>
            <button type="submit" className="flex-1 gradient-btn py-3 rounded-xl font-semibold text-white">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
