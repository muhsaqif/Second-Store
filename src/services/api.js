import axios from 'axios';

const API = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

/**
 * Fetch semua produk dari API
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
  try {
    const response = await API.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Gagal mengambil data produk');
  }
};

/**
 * Fetch semua kategori dari API
 * @returns {Promise<Array>} Array of categories
 */
export const getCategories = async () => {
  try {
    const response = await API.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Gagal mengambil data kategori');
  }
};

/**
 * Fetch produk berdasarkan kategori tertentu (API-driven)
 * @param {string} category - Nama kategori
 * @returns {Promise<Array>} Array of products in category
 */
export const getProductsByCategory = async (category) => {
  try {
    const response = await API.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw new Error(`Gagal mengambil produk dari kategori "${category}"`);
  }
};

export default API;