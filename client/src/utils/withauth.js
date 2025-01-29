import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from './auth';

export default function withAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated()) {
        router.push('/login');
      }
    }, [router]);

    return isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };
}