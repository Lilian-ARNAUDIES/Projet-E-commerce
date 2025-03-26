import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchProductById, addToCart, getUserAccount } from '../../utils/api';
import { getSessionId } from '../../utils/session';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id)
        .then(setProduct)
        .catch((error) => console.error("Erreur de chargement :", error));
    }

    // Essayer de récupérer le compte utilisateur
    getUserAccount()
      .then((user) => {
        console.log("User récupéré :", user);
        setUserId(user.id);
      })
      .catch((error) => {
        console.log("Aucun utilisateur connecté, passage en mode invité.");
        // Si l'utilisateur n'est pas connecté, on génère ou récupère le sessionId
        const sid = getSessionId();
        setSessionId(sid);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      if (userId) {
        // Utilisateur connecté
        await addToCart(userId, product.id, 1, "user");
      } else if (sessionId) {
        // Mode invité avec sessionId
        await addToCart(sessionId, product.id, 1, "session");
      } else {
        alert("Une erreur est survenue. Veuillez réessayer.");
        return;
      }
      alert("Produit ajouté au panier !");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      alert("Impossible d'ajouter le produit au panier.");
    }
  };

  if (!product) return <p>Chargement...</p>;
 
  return (
    <div className="container py-5">
      <div className="row g-5 align-items-center">
        <div className="col-md-6 text-center">
          <img
            src={`/uploads/${product.image}`}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <p className="text-muted mb-4">{product.description}</p>
          <h3 className="text-primary mb-4">{product.price} €</h3>
          <button className="btn btn-lg btn-secondary" onClick={handleAddToCart}>
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}