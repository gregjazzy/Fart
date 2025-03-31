"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Erreur détaillée:", error);
        
        // Gérer les différents types d'erreurs
        if (error.message) {
          // Messages d'erreur courants de Supabase
          if (error.message.includes("Email not confirmed")) {
            setError("Email non confirmé. Veuillez vérifier votre boîte mail pour confirmer votre compte.");
          } else if (error.message.includes("Invalid login credentials")) {
            setError("Email ou mot de passe incorrect.");
          } else if (error.message.includes("email de réinitialisation")) {
            // Message spécial si un email de réinitialisation a été envoyé
            setSuccessMessage(error.message);
            return;
          } else {
            setError(error.message);
          }
        } else {
          setError("Erreur de connexion. Veuillez réessayer.");
        }
        return;
      }
      
      setSuccessMessage("Connexion réussie!");
      
      // Rediriger vers la page d'accueil après 1 seconde
      setTimeout(() => {
        router.push('/');
      }, 1000);
      
    } catch (error: any) {
      console.error("Exception dans handleLogin:", error);
      setError(error.message || "Erreur inconnue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Image de fond */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/accueil.png")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 p-8 rounded-xl shadow-2xl border-4 border-double border-orange-300">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">
          <span className="inline-block transform hover:scale-105 transition-transform">
            🔑 Connexion
          </span>
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-orange-800 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border-2 border-orange-300 rounded-lg bg-yellow-50 text-orange-800 focus:outline-none focus:border-orange-500"
              placeholder="ton-email@exemple.com"
            />
          </div>
          
          <div>
            <label className="block text-orange-800 font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-2 border-orange-300 rounded-lg bg-yellow-50 text-orange-800 focus:outline-none focus:border-orange-500"
              placeholder="Ton mot de passe secret"
            />
            <div className="mt-1 text-right">
              <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-800">
                Mot de passe oublié?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-orange-800">
            Pas encore de compte ?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              S'inscrire
            </Link>
          </p>
          
          <div className="mt-4">
            <Link href="/" className="text-orange-600 hover:text-orange-800 font-medium inline-flex items-center">
              <span className="mr-1">←</span> Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 