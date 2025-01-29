import { useEffect, useState } from 'react';
import { getUserAccount, logout } from '../../utils/auth';
import { useRouter } from 'next/router';

export default function Account() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getUserAccount()
      .then(setUser)
      .catch(() => router.push('/account/login')); // Redirige si non connecté
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/account/login'); // Redirige vers la page de connexion
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="container mt-5">
      <h1>Mon compte</h1>
      <p>Nom : {user.name}</p>
      <p>Email : {user.email}</p>
      <button className="btn btn-danger" onClick={handleLogout}>
        Déconnexion
      </button>
    </div>
  );
}
