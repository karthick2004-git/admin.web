import { useState, useEffect, useRef } from 'react';

export default function ProductModal({ isOpen, onClose, onSave, editProduct }) {
  const [form, setForm] = useState({
    name: '', category: '', image: '', price: '', discount: '0',
    stock: '', sizes: '', description: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        category: editProduct.category,
        image: editProduct.image,
        price: editProduct.price,
        discount: editProduct.discount,
        stock: editProduct.stock,
        sizes: editProduct.sizes.join(', '),
        description: editProduct.description,
      });
      setImagePreview(editProduct.image);
    } else {
      setForm({ name:'', category:'', image:'', price:'', discount:'0', stock:'', sizes:'', description:'' });
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
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      description: form.description,
    }, editProduct?.id);
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
              <option value="new-arrivals">New Arrivals</option>
              <option value="shirts">Shirts</option>
              <option value="t-shirts">T-Shirts</option>
            </select>
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
                value={form.discount} onChange={e => setForm(f => ({...f, discount: e.target.value}))}/>
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
              <input type="text" className="input-field" placeholder="S, M, L, XL"
                value={form.sizes} onChange={e => setForm(f => ({...f, sizes: e.target.value}))}/>
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
