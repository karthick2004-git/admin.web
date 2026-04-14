import ApiClientPublic from './ApiClientPublic';
import ApiClientPrivate from './ApiClientPrivate';
import ApiEndUrl from './ApiEndUrl';

const ApiPage = {
  // --- Admin Auth ---
  adminLogin: async (credentials) => {
    return await ApiClientPublic(ApiEndUrl.admin.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // --- Dashboard ---
  fetchDashboardStats: async () => {
    return await ApiClientPrivate(ApiEndUrl.admin.dashboard);
  },

  // --- Products ---
  fetchProducts: async () => {
    return await ApiClientPrivate(ApiEndUrl.admin.products);
  },

  addProduct: async (productData) => {
    return await ApiClientPrivate(ApiEndUrl.admin.addProduct, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (productData) => {
    return await ApiClientPrivate(ApiEndUrl.admin.updateProduct, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id) => {
    const url = `${ApiEndUrl.admin.deleteProduct}?id=${id}`;
    return await ApiClientPrivate(url, {
      method: 'DELETE',
    });
  },

  // --- Orders ---
  fetchOrders: async () => {
    return await ApiClientPrivate(ApiEndUrl.admin.orders);
  },

  fetchCustomers: async () => {
    return await ApiClientPrivate(ApiEndUrl.admin.customers);
  },

  updateOrderStatus: async (orderId, status) => {
    return await ApiClientPrivate(ApiEndUrl.admin.orders, {
      method: 'PUT',
      body: JSON.stringify({ order_id: orderId, status }),
    });
  },

  deleteCustomer: async (id) => {
    return await ApiClientPrivate(`${ApiEndUrl.admin.deleteCustomer}?id=${id}`, {
      method: 'DELETE',
    });
  },

  // --- Payment Settings ---
  fetchPaymentSettings: async () => {
    return await ApiClientPrivate(ApiEndUrl.admin.paymentSettings);
  },

  updatePaymentSettings: async (settings) => {
    return await ApiClientPrivate(ApiEndUrl.admin.paymentSettings, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

export default ApiPage;
