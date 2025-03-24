import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://localhost:8000/api/account/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "Un email vous a été envoyé si ce compte existe.");
    } catch (error) {
      setMessage("Erreur lors de l'envoi.");
    }
  };

  return (
    <div className="container">
      <h1>Réinitialiser le mot de passe</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn btn-primary">Envoyer</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}