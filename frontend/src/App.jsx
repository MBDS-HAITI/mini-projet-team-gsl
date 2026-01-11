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
