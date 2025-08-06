import { ClerkProvider } from '@clerk/clerk-react';

// Get the publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_demo_key_for_development';

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// Clerk configuration
export const clerkConfig = {
  publishableKey: clerkPubKey,
  appearance: {
    theme: {
      primaryColor: '#000000',
      primaryColorText: '#ffffff',
    },
    elements: {
      formButtonPrimary: 'bg-black hover:bg-gray-800 text-white',
      card: 'bg-white dark:bg-black border border-gray-200 dark:border-gray-700',
      headerTitle: 'text-black dark:text-white',
      headerSubtitle: 'text-gray-600 dark:text-gray-400',
      socialButtonsBlockButton: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
      formFieldLabel: 'text-black dark:text-white',
      formFieldInput: 'bg-white dark:bg-black border-gray-300 dark:border-gray-600',
      footerActionLink: 'text-black dark:text-white hover:text-gray-600',
    },
  },
};

export { ClerkProvider };
export default clerkPubKey;
