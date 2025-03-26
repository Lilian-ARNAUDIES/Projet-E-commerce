import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://localhost:8000/api/categories')
      .then((res) => res.json())
      .then((data) => {
        const result = Array.isArray(data) ? data : data.data;
        setCategories(result || []);
      })
      .catch((err) => console.error('Erreur chargement catégories :', err));
  }, []);

  return (
    <div className="container">
      <h1 className="text-center mb-5">Toutes nos catégories</h1>
      <div className="row g-4">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="col-12 col-sm-6 col-lg-3">
              <Link
                href={`/categories/${category.id}`}
                className="text-decoration-none"
              >
                <div className="card h-100 shadow-sm border-0 text-center p-4">
                  <h5 className="card-title">{category.name}</h5>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center">Aucune catégorie trouvée.</p>
        )}
      </div>
    </div>
  );
}