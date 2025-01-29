import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchProductById } from '../../utils/api';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) fetchProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <p>Chargement...</p>;

  return (
    <div className="container mt-5">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Prix : {product.price} €</p>
      <button className="btn btn-primary">Ajouter au panier</button>
    </div>
  );
}