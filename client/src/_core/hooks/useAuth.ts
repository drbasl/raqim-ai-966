export function useAuth() {
  return {
    user: null,
    loginUrl: null,
    logout: () => {},
  };
}