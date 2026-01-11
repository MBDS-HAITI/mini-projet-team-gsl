import { RouterProvider } from "react-router/dom";
import { useClerk } from "@clerk/clerk-react";
import { createRouter } from "./router.jsx";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  const clerk = useClerk();
  const router = createRouter(clerk);
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

<Routes>
  <Route path="/login" element={<Login />} />
  
  {/* Route accessible par tout utilisateur connecté */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardSelector /> 
    </ProtectedRoute>
  } />

  {/* Route réservée aux Admins */}
  <Route path="/admin/all-students" element={
    <ProtectedRoute roleRequired="admin">
      <AdminPanel />
    </ProtectedRoute>
  } />
</Routes>