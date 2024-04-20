const getConfig = () => {
  return {
    host: import.meta.env.VITE_BE_HOST,
    clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  };
};

export default getConfig;
