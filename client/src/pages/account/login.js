import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    fetch('https://localhost:8000/api/users/account', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await loginUser(email, password);
      if (success) {
        console.log('Connexion réussie, redirection vers /account');
        router.push('/account');
      } else {
        console.error('Connexion échouée : identifiants incorrects');
        setError('Identifiants incorrects');
      }
    } catch (err) {
      console.error('Erreur inattendue dans handleLogin:', err);
      setError('Erreur lors de la connexion');
    }
  };

  const goToRegister = () => {
    router.push('/account/register');
  };

  return (
    <div className="container">
      <h1>Connexion</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
            type="button"
            className="btn btn-link p-0 mb-4"
            onClick={() => router.push('/account/forgot-password')}
          >
            Mot de passe oublié ?
          </button>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Se connecter
          </button>
          <button type="button" onClick={goToRegister} className="btn btn-secondary">
            S’inscrire
          </button>
        </div>
      </form>
    </div>
  );
}