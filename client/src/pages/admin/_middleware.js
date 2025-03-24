import { isAdmin } from '../../utils/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/'); // Redirige vers la page d'accueil si non-admin
    }
  }, []);

  return children;
}