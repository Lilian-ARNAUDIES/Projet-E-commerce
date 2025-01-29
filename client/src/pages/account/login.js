import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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

  return (
    <div className="container mt-5">
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
        <div className="mb-3">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
    </div>
  );
}