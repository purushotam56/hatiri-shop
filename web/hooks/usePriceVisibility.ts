import { useAuth } from '@/context/auth-context';

export type PriceVisibility = 'hidden' | 'login_only' | 'visible';

interface PriceVisibilityResult {
  shouldShowPrice: boolean;
  shouldShowAsBlur: boolean;
}

/**
 * Hook to determine if price should be shown based on visibility setting and user login state
 * @param priceVisibility - The seller's price visibility setting
 * @returns Object with shouldShowPrice and shouldShowAsBlur flags
 */
export function usePriceVisibility(priceVisibility: PriceVisibility = 'visible'): PriceVisibilityResult {
  const { isLoggedIn } = useAuth();

  if (priceVisibility === 'hidden') {
    return {
      shouldShowPrice: false,
      shouldShowAsBlur: true,
    };
  }

  if (priceVisibility === 'login_only') {
    if (isLoggedIn) {
      return {
        shouldShowPrice: true,
        shouldShowAsBlur: false,
      };
    } else {
      return {
        shouldShowPrice: false,
        shouldShowAsBlur: true,
      };
    }
  }

  // priceVisibility === 'visible'
  return {
    shouldShowPrice: true,
    shouldShowAsBlur: false,
  };
}
