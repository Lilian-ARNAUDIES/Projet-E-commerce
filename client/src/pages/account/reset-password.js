import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // if (!token) {
    //   setMessage("Lien de réinitialisation invalide.");
    // }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setMessage(data.message);
        setTimeout(() => {
          router.push('/account/login');
        }, 3000);
      } else {
        setMessage(data.message || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Erreur de soumission:", err);
      setMessage("Erreur lors de la soumission.");
    }
  };

  return (
    <div className="container">
      <h1>Réinitialisation du mot de passe</h1>
      {message && <p className={submitted ? 'text-success' : 'text-danger'}>{message}</p>}
      {!submitted && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary">Réinitialiser</button>
        </form>
      )}
    </div>
  );
}