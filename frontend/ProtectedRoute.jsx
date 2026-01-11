import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, roleRequired }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <div>Chargement...</div>;
  if (!isSignedIn) return <Navigate to="/login" />;

  const userRole = user.publicMetadata.role;

  // Si on demande un rôle spécifique (ex: admin) et que l'user ne l'a pas
  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to="/dashboard" />; // Redirige vers son propre dashboard
  }

  return children;
};