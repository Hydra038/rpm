import { useRouter } from 'next/navigation';
import { useNavigationStore } from '../store/navigation';
import { useEffect } from 'react';

export function useNavigationLoading() {
  const router = useRouter();
  const { setNavigating } = useNavigationStore();

  const navigateWithLoading = (path: string) => {
    setNavigating(true);
    router.push(path);
    
    // Set a timeout to clear loading if navigation takes too long
    setTimeout(() => {
      setNavigating(false);
    }, 5000);
  };

  // Clear loading state when component unmounts or navigation completes
  useEffect(() => {
    const handleRouteChange = () => {
      setNavigating(false);
    };

    // Listen for route changes to clear loading
    const originalPush = router.push;
    router.push = (...args) => {
      const result = originalPush.apply(router, args);
      // Clear loading after a short delay to allow for page rendering
      setTimeout(() => setNavigating(false), 500);
      return result;
    };

    return () => {
      router.push = originalPush;
    };
  }, [router, setNavigating]);

  return { navigateWithLoading };
}