import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../../utils/auth';

export default function Register() {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { success, token } = await registerUser(firstname, lastname, email, password);

    if (success && token) {
      // 1. Stocker le token (ex. dans localStorage)
      localStorage.setItem('authToken', token);

      // 2. Rediriger
      router.push('/account');
    } else {
      setError('Erreur lors de l’inscription');
    }
  };

  return (
    <div className="container">
      <h1>Inscription</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Nom</label>
          <input
            type="text"
            className="form-control"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Prénom</label>
          <input
            type="text"
            className="form-control"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
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