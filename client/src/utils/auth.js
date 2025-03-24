import axios from 'axios';

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// ✅ Vérification et ajout du token
export const axiosAuthInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ Permet d'envoyer les cookies si nécessaires
});

// ✅ Ajoute automatiquement le token à chaque requête
axiosAuthInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("📡 Envoi du token :", token); // ✅ Vérification dans la console navigateur
  } else {
    console.warn("⚠ Aucun token trouvé dans localStorage !");
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole'); // On supprime aussi le rôle au logout
};

export async function registerUser(lastname, firstname, email, password) {
  try {
    const newUser = { lastname, firstname, email, password, role: "client" }; // ✅ Ajout du rôle par défaut
    console.log("📡 Envoi des données d'inscription :", newUser);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erreur lors de l’enregistrement:', data.message);
      return { success: false, message: data.message };
    }

    if (data.success && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.user.role);
      return { success: true, token: data.token, role: data.user.role };
    }

    return { success: false, message: "Erreur inconnue" };
  } catch (err) {
    console.error('❌ Erreur registerUser:', err);
    return { success: false, message: "Erreur serveur" };
  }
}

export const getUserAccount = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Utilisateur non authentifié');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/account`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Utilisateur non authentifié');
  }

  const userData = await res.json();
  localStorage.setItem('userRole', userData.role); // Stocker le rôle de l’utilisateur
  return userData;
};

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Erreur dans loginUser:', errorData);
      return false;
    }

    const data = await res.json();
    localStorage.setItem('authToken', data.token); // Stocker le token
    localStorage.setItem('userRole', data.user.role); // Stocker le rôle de l’utilisateur

    return { success: true, role: data.user.role };
  } catch (err) {
    console.error('Erreur loginUser:', err);
    return { success: false };
  }
};

export const getUserRole = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole') || null;
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};