import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then(res => res.json())
      .then(categories => {
        const category = categories.find(cat => String(cat.id) === id);
        if (category) setCategoryName(category.name);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : data.data;
        const filtered = result.filter(p => String(p.category_id) === id);
        setProducts(filtered);
      });
  }, [id]);

  if (!mounted || !id) {
    return <p className="text-center">Chargement...</p>;
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Catégorie : {categoryName}</h1>
      <div className="row g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-center">Aucun produit trouvé pour cette catégorie.</p>
        )}
      </div>
    </div>
  );
}