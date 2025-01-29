export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const registerUser = async (name, email, password) => {
  const res = await fetch('https://localhost:8000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    throw new Error('Failed to register');
  }

  return await res.json();
};

export const getUserAccount = async () => {
  const token = localStorage.getItem('authToken');
  const res = await fetch('https://localhost:8000/api/users/account', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Utilisateur non authentifié');
  }

  return await res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch('https://localhost:8000/api/users/login', {
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
  localStorage.setItem('authToken', data.token); // Stocke le token
  return true;
};