import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../../utils/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const success = await registerUser(name, email, password);
      if (success) {
        router.push('/account'); // Redirige vers la page de compte
      } else {
        setError('Erreur lors de l’inscription');
      }
    } catch (err) {
      setError('Erreur lors de l’inscription');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Inscription</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Nom</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <button type="submit" className="btn btn-primary">Créer un compte</button>
      </form>
    </div>
  );
}