import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupAuthInterceptor } from "@/api/auth";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

// Configura el interceptor de axios para adjuntar el JWT en cada request.
// Al usar zustand con persist, el token ya está disponible al iniciar la app.
setupAuthInterceptor();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
