const BASE_URL = 'https://localhost:8000/api';

export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
};

export const getCart = async () => {
  const res = await fetch(`${BASE_URL}/cart`);
  return res.json();
};

export const updateCart = async (productId, quantity) => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
};

export const getUserAccount = async () => {
    const response = await fetch(`${BASE_URL}/account`);
    if (!response.ok) {
        throw new Error('Failed to fetch user account');
    }
    return response.json();
};