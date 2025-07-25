"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

/**
 * Barra de navegação principal da aplicação.
 * Exibe links de autenticação quando não logado e botão de logout quando autenticado.
 */
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Eventos
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sair
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 