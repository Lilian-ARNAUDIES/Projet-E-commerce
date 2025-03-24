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

export const getCart = async (id, type = "user") => {
  const queryParam = type === "user" ? `userId=${id}` : `sessionId=${id}`;
  const res = await fetch(`${BASE_URL}/cart?${queryParam}`);
  if (!res.ok) {
    throw new Error('Failed to fetch cart');
  }
  return res.json();
};

export const addToCart = async (id, productId, quantity, type = "user") => {
  const payload = type === "user"
    ? { userId: id, productId, quantity }
    : { sessionId: id, productId, quantity };

  const res = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Réponse du serveur :", errorText);
    throw new Error("Erreur lors de l'ajout au panier");
  }

  return res.json();
};

export const updateCart = async (cartItemId, quantity) => {
  const res = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erreur lors de la mise à jour de l'item du panier :", errorText);
    throw new Error('Erreur lors de la mise à jour du panier');
  }

  return res.json();
};

export const deleteCartItem = async (cartItemId) => {
  const res = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erreur lors de la suppression de l'item du panier :", errorText);
    throw new Error('Erreur lors de la suppression du panier');
  }
  return res.json();
};

export const getUserAccount = async () => {
  const token = localStorage.getItem("authToken"); // Récupère le token stocké
  if (!token) {
    throw new Error("Utilisateur non connecté");
  }
  
  try {
    console.log("Tentative de récupération du compte utilisateur...");
    const response = await fetch(`${BASE_URL}/users/account`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du compte utilisateur :", error);
    throw error;
  }
};