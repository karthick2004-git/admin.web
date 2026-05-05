import { useState, useCallback, useEffect } from 'react';
import { defaultProducts, defaultOrders, defaultPaymentSettings } from './data/defaultData';
import ApiPage from './api/ApiPage';

import ToastContainer from './components/Toast';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import DashboardSection from './components/sections/DashboardSection';
import ProductsSection from './components/sections/ProductsSection';
import OrdersSection from './components/sections/OrdersSection';
import PaymentsSection from './components/sections/PaymentsSection';
import CheckoutSection from './components/sections/CheckoutSection';
import CustomersSection from './components/sections/CustomersSection';
import SupportSection from './components/sections/SupportSection';
import ProductModal from './components/modals/ProductModal';
import OrderModal from './components/modals/OrderModal';
import CustomerModal from './components/modals/CustomerModal';
import LoadingOverlay from './components/LoadingOverlay';

// ── localStorage helpers ──────────────────────────────────────────────────────
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

let toastId = 0;

export default function App() {
  // ── auth ──────────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem('admin_logged_in') === 'true'
  );

  // ── core data ─────────────────────────────────────────────────────────────
  const [products, setProducts]           = useState([]);
  const [orders, setOrders]               = useState([]);
  const [customers, setCustomers]         = useState([]);
  const [paymentSettings, setPayments]    = useState(defaultPaymentSettings);
  const [stats, setStats]                 = useState({ totalOrders: 0, totalProducts: 0, totalCustomers: 0, totalRevenue: 0 });
  const [supportRequests, setSupportRequests] = useState([]);

  // ── ui state ──────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState(() => localStorage.getItem('admin_active_section') || 'dashboard-section');
  const [isAppLoading, setIsAppLoading]   = useState(false);
  
  useEffect(() => {
    localStorage.setItem('admin_active_section', activeSection);
  }, [activeSection]);
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [toasts, setToasts]               = useState([]);

  // ── modals ────────────────────────────────────────────────────────────────
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct]     = useState(null);
  const [orderModalOpen, setOrderModalOpen]     = useState(false);
  const [viewingOrder, setViewingOrder]         = useState(null);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer]     = useState(null);

  // ── toast ─────────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts(t => [...t, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  // ── fetch data ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        try {
          const [pData, oData, cData, sData, payData, supData] = await Promise.all([
            ApiPage.fetchProducts(),
            ApiPage.fetchOrders(),
            ApiPage.fetchCustomers(),
            ApiPage.fetchDashboardStats(),
            ApiPage.fetchPaymentSettings(),
            ApiPage.fetchSupportRequests()
          ]);
          setProducts(pData.products);
          setOrders(oData.orders);
          setCustomers(cData.customers);
          setStats(sData.stats);
          setPayments(payData.paymentSettings);
          setSupportRequests(supData.supportRequests || []);
        } catch (error) {
          showToast(error.message, 'error');
        }
      };
      fetchData();
    }
  }, [isLoggedIn, showToast]);

  // ── auth handlers ─────────────────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    try {
      const data = await ApiPage.adminLogin({ email, password });
      localStorage.setItem('admin_token', data.token);
      sessionStorage.setItem('admin_logged_in', 'true');
      setIsLoggedIn(true);
      setIsAppLoading(true);
      setTimeout(() => setIsAppLoading(false), 2000);
      showToast('Welcome back, Admin!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_logged_in');
    setIsLoggedIn(false);
    showToast('Logged out successfully', 'success');
  };

  // ── product handlers ──────────────────────────────────────────────────────
  const openAddProduct = () => { setEditingProduct(null); setProductModalOpen(true); };
  const openEditProduct = (id) => {
    setEditingProduct(products.find(p => p.id === id) || null);
    setProductModalOpen(true);
  };
  const closeProductModal = () => { setProductModalOpen(false); setEditingProduct(null); };

  const handleSaveProduct = async (formData, editId) => {
    try {
      if (editId) {
        await ApiPage.updateProduct({ id: editId, ...formData });
        showToast('Product updated successfully!', 'success');
      } else {
        await ApiPage.addProduct(formData);
        showToast('Product added successfully!', 'success');
      }
      // Refresh list
      const pData = await ApiPage.fetchProducts();
      setProducts(pData.products);
      closeProductModal();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ApiPage.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        showToast('Product deleted successfully!', 'success');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  };

  // ── order handlers ────────────────────────────────────────────────────────
  const handleViewOrder = (orderId) => {
    setViewingOrder(orders.find(o => o.id === orderId) || null);
    setOrderModalOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId) => {
    const statuses = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentOrder = orders.find(o => o.order_id === orderId);
    if (!currentOrder) return;

    const idx = statuses.indexOf(currentOrder.status);
    if (idx < statuses.length - 1) {
      try {
        const nextStatus = statuses[idx + 1];
        await ApiPage.updateOrderStatus(orderId, nextStatus);
        const oData = await ApiPage.fetchOrders();
        setOrders(oData.orders);
        showToast(`Order status updated to ${nextStatus}`, 'success');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await ApiPage.updateOrderStatus(orderId, 'Cancelled');
        const oData = await ApiPage.fetchOrders();
        setOrders(oData.orders);
        showToast('Order cancelled successfully', 'warning');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  };

  // ── customer handlers ─────────────────────────────────────────────────────
  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This may affect their order history.')) {
      try {
        await ApiPage.deleteCustomer(id);
        setCustomers(customers.filter(c => c.id !== id));
        showToast('Customer deleted successfully!', 'success');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
    setCustomerModalOpen(true);
  };

  // ── payment handlers ──────────────────────────────────────────────────────
  const handleTogglePayment = async (method) => {
    try {
      const current = paymentSettings[method];
      await ApiPage.updatePaymentSettings({ method, enabled: !current.enabled });
      const payData = await ApiPage.fetchPaymentSettings();
      setPayments(payData.paymentSettings);
      showToast(`${method.toUpperCase()} ${!current.enabled ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleSavePayments = async () => {
    const upiId   = document.getElementById('upi-id')?.value;
    const upiName = document.getElementById('upi-name')?.value;
    const codChg  = parseInt(document.getElementById('cod-charges')?.value);
    const codMax  = parseInt(document.getElementById('cod-max')?.value);
    
    try {
      if (upiId) await ApiPage.updatePaymentSettings({ method: 'upi', config: { id: upiId, name: upiName } });
      if (codChg) await ApiPage.updatePaymentSettings({ method: 'cod', config: { charges: codChg, maxOrder: codMax } });
      
      const payData = await ApiPage.fetchPaymentSettings();
      setPayments(payData.paymentSettings);
      showToast('Payment settings saved successfully!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleQRUpload = (dataUrl) => {
    const updated = { ...paymentSettings, qr: { ...paymentSettings.qr, image: dataUrl } };
    savePayments(updated);
    showToast('QR Code uploaded successfully', 'success');
  };

  // ── support handlers ──────────────────────────────────────────────────────
  const handleUpdateSupportStatus = async (id, status) => {
    try {
      await ApiPage.updateSupportStatus(id, status);
      setSupportRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showToast('Support status updated', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  // ── render ────────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast}/>
        <Login onLogin={handleLogin}/>
      </>
    );
  }

  if (isAppLoading) {
    return <LoadingOverlay />;
  }

  const sections = {
    'dashboard-section': <DashboardSection orders={orders} products={products} stats={stats}/>,
    'products-section':  <ProductsSection products={products} onAdd={openAddProduct} onEdit={openEditProduct} onDelete={handleDeleteProduct}/>,
    'orders-section':    <OrdersSection orders={orders} onView={handleViewOrder} onUpdateStatus={handleUpdateOrderStatus} onCancel={handleCancelOrder}/>,
    'payments-section':  <PaymentsSection paymentSettings={paymentSettings} onToggle={handleTogglePayment} onSave={handleSavePayments} onQRUpload={handleQRUpload}/>,
    'checkout-section':  <CheckoutSection orders={orders}/>,
    'customers-section': <CustomersSection customers={customers} onDelete={handleDeleteCustomer} onView={handleViewCustomer}/>,
    'support-section':   <SupportSection supportRequests={supportRequests} onUpdateStatus={handleUpdateSupportStatus}/>,
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast}/>

      {/* Mobile Header */}
      <MobileHeader onMenuToggle={() => setSidebarOpen(o => !o)} onLogout={handleLogout}/>

      {/* Sidebar */}
      <div className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
           onClick={() => setSidebarOpen(false)}/>
      <div className={`fixed left-0 top-0 bottom-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
           style={{width:270}}>
        <Sidebar
          activeSection={activeSection}
          onSectionChange={(s) => { setActiveSection(s); setSidebarOpen(false); }}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <main className="lg:pt-0 pt-16 min-h-screen" style={{marginLeft: undefined}}>
        <div className="lg:ml-[270px]">
          {sections[activeSection]}
        </div>
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={closeProductModal}
        onSave={handleSaveProduct}
        editProduct={editingProduct}
      />
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        order={viewingOrder}
      />
      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        customer={viewingCustomer}
      />
    </>
  );
}
