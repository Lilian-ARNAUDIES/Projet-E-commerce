import { useEffect, useState } from 'react';
import { getUserAccount, logout } from '../../utils/auth';
import { useRouter } from 'next/router';

export default function Account() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/account/login'); // Redirige vers la page de connexion
  };
  
  useEffect(() => {
    getUserAccount()
      .then(setUser)
      .catch(() => router.push('/account/login')); // Redirige si non connecté
  }, []);

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="container">
      <h1>Mon compte</h1>
      <p>Nom : {user.lastname}</p>
      <p>Prénom : {user.firstname}</p>
      <p>Email : {user.email}</p>
      <button className="btn btn-danger" onClick={handleLogout}>
        Déconnexion
      </button>
    </div>
  );
}
