"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "../AuthProvider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { user, profile, signOut, refreshUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }

    if (profile) {
      setUsername(profile.username || "");
    }
  }, [user, profile, isLoading, router]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (!user) return;
      
      // Mettre à jour le profil dans la table users
      const { error } = await supabase
        .from('users')
        .update({ username })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshUser();
      setSuccessMessage("Profil mis à jour avec succès!");
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setError(error.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

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
            👤 Mon Profil
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
        
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-orange-800">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-orange-800 mt-2">
            <strong>Status:</strong> {profile?.is_premium ? 'Premium 💎' : 'Utilisateur Gratuit'}
          </p>
          <p className="text-orange-800 mt-2">
            <strong>Membre depuis:</strong> {user ? new Date(user.created_at).toLocaleDateString() : ''}
          </p>
        </div>
        
        <form onSubmit={updateProfile} className="space-y-4">
          <div>
            <label className="block text-orange-800 font-medium mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border-2 border-orange-300 rounded-lg bg-yellow-50 text-orange-800 focus:outline-none focus:border-orange-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={updating}
            className={`w-full p-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {updating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mise à jour...
              </span>
            ) : (
              'Mettre à jour mon profil'
            )}
          </button>
        </form>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <Link 
            href="/" 
            className="flex-1 p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-center"
          >
            Retour à l'accueil
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex-1 p-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-bold text-orange-800 mb-2">Abonnement Premium</h3>
          <p className="text-orange-700 mb-3">
            Passez à l'offre Premium pour débloquer toutes les fonctionnalités!
          </p>
          <Link 
            href="/premium" 
            className="block w-full p-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-colors text-center"
          >
            🌟 Devenir Premium (5€/mois)
          </Link>
        </div>
      </div>
    </div>
  );
} 