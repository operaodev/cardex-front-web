import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

type Tab = "login" | "register";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  return open ? <AuthModalContent onClose={onClose} /> : null;
}

function AuthModalContent({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, register, loading, error } = useAuth();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === "login") {
        await login({ email, password });
        onClose();
      } else {
        await register({ name, email, password });
        // No auto-login: cambiar a iniciar sesión
        setTab("login");
        setPassword("");
      }
    } catch {
      // error ya está en el store vía useAuth
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-lg bg-gray-100">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === "login"
                ? "bg-black text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === "register"
                ? "bg-black text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:border-black transition-colors"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                focus:outline-none focus:border-black transition-colors"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                focus:outline-none focus:border-black transition-colors"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-black rounded-lg
              hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? "Cargando..."
              : tab === "login"
                ? "Iniciar sesión"
                : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}
