import axios from 'axios';
import type { Product } from '@/types/types.ts';

const API_URL = 'https://mock-data-josw.onrender.com/products';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_URL);
  return response.data;
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(API_URL, product);
  return response.data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  const response = await axios.put<Product>(`${API_URL}/${product.id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number | string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};