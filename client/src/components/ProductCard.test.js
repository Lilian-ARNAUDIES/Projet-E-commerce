import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import React from 'react';

describe('ProductCard', () => {
  const product = {
    id: 1,
    name: 'Haltère 10kg',
    image: '/uploads/halter10kg.png',
    description: 'Haltère robuste et ergonomique pour vos séances de musculation.',
    price: 29.99
  };

  test('affiche le nom du produit', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Haltère 10kg')).toBeInTheDocument();
  });

  test('affiche une description tronquée si elle est trop longue', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(/Haltère robuste.*\.\.\./)).toBeInTheDocument();
  });

  test('affiche le prix du produit', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('29.99 €')).toBeInTheDocument();
  });

  test('le bouton redirige vers la fiche produit', () => {
    render(<ProductCard product={product} />);
    const link = screen.getByRole('link', { name: /voir le produit/i });
    expect(link).toHaveAttribute('href', '/products/1');
  });
});