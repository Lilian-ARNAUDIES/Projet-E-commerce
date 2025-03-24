import { useState, useEffect } from 'react';

export default function Home() {
  const [categoryProducts, setCategoryProducts] = useState([]);
  
  useEffect(() => {
    fetch('https://localhost:8000/api/admin/categories')
      .then(res => res.json())
      .then(categories => {
        const haltereCat = categories.find(cat => cat.name.toLowerCase() === 'haltère');
        if (!haltereCat) return;
        const haltereCatId = haltereCat.id;
 
        return fetch('https://localhost:8000/api/admin/products')
          .then(res => res.json())
          .then(products => {
            const filtered = products.filter(p => p.category_id === haltereCatId);
            setCategoryProducts(filtered);
          });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="container-fluid px-0">
      {/* Hero section full height */}
      <div className="position-relative w-100" style={{ height: '90vh' }}>
        <img
          src="/images/background-image.png"
          className="w-100 h-100 position-absolute top-0 start-0 object-fit-cover"
          alt="Home gym hero"
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white text-center bg-dark bg-opacity-25">
          <div className="container px-4">
            <h1 className="display-4 fw-bold">Matériel de musculation haut de gamme</h1>
            <p className="lead">Tout pour équiper votre home gym, du débutant à l'expert</p>
            <a href="/products" className="btn btn-light btn-lg mt-3">Découvrir nos produits</a>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <h2 className="text-center mb-4">Nos équipements de la catégorie haltère</h2>
        <div className="row">
          {categoryProducts.map((product) => (
            <div className="col-12 col-sm-6 col-lg-3 mb-4" key={product.id}>
              <div className="card h-100">
                <img
                  src={`/uploads/${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <a href={`/products/${product.id}`} className="btn btn-outline-primary">Voir</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section engagement */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h3 className="mb-3">Pourquoi choisir notre boutique ?</h3>
          <p className="mb-0">Livraison rapide, service client réactif, matériel testé par des pros.</p>
        </div>
      </div>

      {/* Bandeau promo */}
      <div className="bg-warning text-dark text-center py-4">
        <strong>🚚 Livraison offerte dès 50€ d'achat !</strong>
      </div>
    </div>
  );
}