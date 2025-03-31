'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

// Initialisation du client Supabase avec les variables d'environnement correctes
// Utiliser les valeurs réelles des variables d'environnement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://apbkobhfnmcqqzqeeqss.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwd2V6YnFhdnhpdXNkdmhzZ3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQxMDkzOTMsImV4cCI6MjAxOTY4NTM5M30.MeYOLUXZHD_KuGuHHjg-iIHDdHWB-z-9Wv2y7LamSyk';

console.log('Initialisation de Supabase avec URL:', SUPABASE_URL);
// Ne pas afficher la clé secrète dans les logs!
console.log('Clé Supabase (5 premiers caractères):', SUPABASE_ANON_KEY.substring(0, 5) + '...');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Vérifier que le client Supabase est correctement initialisé
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('ERREUR de connexion à Supabase:', error);
  } else {
    console.log('Connexion à Supabase établie avec succès');
  }
});

type AuthContextType = {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  supabase: typeof supabase;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  premiumTokens: number;
  premiumExpiry: number | null;
  activatePremium: () => Promise<boolean>;
  consumePremiumToken: () => Promise<boolean>;
  isPremiumActive: () => boolean;
  refreshPremiumStatus: () => Promise<void>;
  premiumMode: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour le système de tokens premium
  const [premiumTokens, setPremiumTokens] = useState<number>(0);
  const [premiumExpiry, setPremiumExpiry] = useState<number | null>(null);
  const [premiumMode, setPremiumMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (data.user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        setProfile(profileData);
        
        // Récupérer les informations premium depuis le localStorage
        const storedTokens = localStorage.getItem(`premium_tokens_${data.user.id}`);
        const storedExpiry = localStorage.getItem(`premium_expiry_${data.user.id}`);
        
        if (storedTokens) {
          setPremiumTokens(parseInt(storedTokens, 10));
        }
        
        if (storedExpiry) {
          const expiryTime = parseInt(storedExpiry, 10);
          // Vérifier si l'abonnement premium n'est pas expiré
          if (expiryTime > Date.now()) {
            setPremiumExpiry(expiryTime);
          } else {
            // Si expiré, réinitialiser
            setPremiumExpiry(null);
            localStorage.removeItem(`premium_expiry_${data.user.id}`);
          }
        }
      }
      
      setIsLoading(false);
    };

    // Initialisation
    fetchUser();

    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Tentative de connexion pour:", email);
      
      // Vérifier d'abord le statut de l'utilisateur
      const { data: userData, error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (signInError) {
        console.error("Erreur de connexion:", signInError);
        return { error: signInError };
      }
      
      if (!userData || !userData.user) {
        console.error("Erreur de connexion: Aucun utilisateur trouvé");
        return { error: new Error("Email ou mot de passe incorrect") };
      }
      
      console.log("Session créée:", userData.session ? "Oui" : "Non");
      console.log("État de confirmation de l'email:", userData.user.email_confirmed_at);
      
      // Si l'utilisateur existe mais n'a pas de session, vérifier si l'email a été confirmé
      if (!userData.session) {
        console.log("Pas de session créée");
        
        // Forcer une confirmation d'email si l'utilisateur existe mais n'a pas confirmé son email
        if (!userData.user.email_confirmed_at) {
          console.log("Forçage de la confirmation d'email...");
          
          const { error: confirmError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/login`,
          });
          
          if (confirmError) {
            console.error("Erreur lors de l'envoi de l'email de réinitialisation:", confirmError);
            return { error: new Error("Impossible d'envoyer un email de réinitialisation. Veuillez réessayer.") };
          }
          
          return { error: new Error("Un email de réinitialisation de mot de passe a été envoyé. Veuillez vérifier votre boîte mail.") };
        }
      }
      
      console.log("Connexion réussie, user:", userData.user);
      return { error: null };
    } catch (error) {
      console.error("Exception lors de la connexion:", error);
      return { error: error instanceof Error ? error : new Error("Erreur inconnue lors de la connexion") };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      console.log("Début de l'inscription pour:", email);
      
      // Créer l'utilisateur dans Supabase Auth seulement
      console.log("Création de l'utilisateur dans Auth...");
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (signUpError) {
        console.error("Erreur d'authentification:", signUpError);
        return { error: signUpError };
      }

      if (!data.user) {
        console.error("Aucun utilisateur créé");
        return { error: new Error("Aucun utilisateur créé") };
      }
      
      console.log("Utilisateur créé avec succès, ID:", data.user.id);
      
      // Pour l'instant, nous ne créons pas l'entrée dans la table users
      // afin de voir si c'est ce qui cause l'erreur
      
      return { error: null };
    } catch (error) {
      console.error("Exception lors de l'inscription:", error);
      return { error: error instanceof Error ? error : new Error("Erreur inconnue lors de l'inscription") };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshUser = async () => {
    if (user) {
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);
    }
  };
  
  // Fonction pour activer l'abonnement premium après paiement
  const activatePremium = async () => {
    console.log("⚡ ACTIVATION DU MODE PREMIUM - DÉBUT");
    
    // Tester la connexion à Supabase avec une requête simple
    try {
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1);
      
      if (testError) {
        console.error("❌ ERREUR CRITIQUE - Test de connexion Supabase échoué:", testError);
      } else {
        console.log("✅ Test de connexion Supabase réussi:", testData);
      }
    } catch (e) {
      console.error("❌ EXCEPTION lors du test de connexion Supabase:", e);
    }
    
    // Fixer la date d'expiration (24 heures à partir de maintenant)
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
    
    // Mettre à jour d'abord localement - IMPORTANT: cela doit être fait même si Supabase échoue
    // pour que l'utilisateur puisse utiliser ses jetons immédiatement
    setPremiumTokens(3);
    setPremiumExpiry(expiryTime);
    setPremiumMode(true);
    
    // Stockage local pour assurer la persistance
    let userId = user?.id;
    if (user) {
      localStorage.setItem(`premium_tokens_${user.id}`, "3");
      localStorage.setItem(`premium_expiry_${user.id}`, expiryTime.toString());
      console.log("⚡ Jetons et expiration mis à jour dans localStorage pour user:", user.id);
    } else {
      // Pour les utilisateurs non connectés, stockage temporaire
      sessionStorage.setItem("temp_premium_tokens", "3");
      sessionStorage.setItem("temp_premium_expiry", expiryTime.toString());
      console.log("⚡ Jetons et expiration mis à jour dans sessionStorage (utilisateur non connecté)");
      
      // Si l'utilisateur n'est pas connecté, essayer de récupérer son ID depuis localStorage
      try {
        const authToken = localStorage.getItem('supabase-auth-token');
        if (authToken) {
          const parsedToken = JSON.parse(authToken);
          userId = parsedToken[0]?.split('.')[0];
          console.log("⚡ ID utilisateur récupéré depuis localStorage:", userId);
        }
      } catch (e) {
        console.error("⚡ Erreur lors de la récupération de l'ID utilisateur:", e);
      }
    }

    // ENSUITE tenter la mise à jour dans Supabase si l'utilisateur est connecté
    if (userId) {
      console.log("⚡ Tentative de mise à jour dans Supabase. User ID:", userId);
      
      try {
        // Vérifier que la table 'users' existe et a les colonnes nécessaires
        const { data: tableData, error: tableError } = await supabase
          .from('users')
          .select('id, premium_tokens')
          .limit(1);
        
        if (tableError) {
          console.error("❌ ERREUR CRITIQUE - La table 'users' n'est pas accessible:", tableError);
        } else {
          console.log("✅ Table 'users' accessible:", tableData);
        }
        
        // Vérifier si l'utilisateur existe déjà dans la table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, premium_tokens, premium_expiry')
          .eq('id', userId)
          .single();
        
        if (userError) {
          console.error("❌ L'utilisateur n'existe pas encore dans la table:", userError);
          
          // Créer l'utilisateur s'il n'existe pas
          const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert([{ 
              id: userId, 
              premium_tokens: 3, 
              premium_expiry: new Date(expiryTime).toISOString(),
              is_premium: true 
            }])
            .select();
          
          if (insertError) {
            console.error("❌ ERREUR lors de la création de l'utilisateur:", insertError);
          } else {
            console.log("✅ Utilisateur créé avec succès:", insertData);
          }
        } else {
          console.log("✅ Utilisateur existant trouvé:", userData);
          
          // Mettre à jour l'utilisateur existant
          const { data: updateData, error: updateError } = await supabase
            .from('users')
            .update({ 
              premium_tokens: 3, 
              premium_expiry: new Date(expiryTime).toISOString(),
              is_premium: true 
            })
            .eq('id', userId)
            .select();
          
          if (updateError) {
            console.error("❌ ERREUR lors de la mise à jour des jetons:", updateError);
          } else {
            console.log("✅ Jetons mis à jour avec succès:", updateData);
          }
        }
      } catch (e) {
        console.error("❌ EXCEPTION lors de l'activation du mode premium:", e);
      }
    }
    
    // Après toutes les tentatives, vérifier l'état des jetons
    console.log("⚡ ACTIVATION TERMINÉE - État final des jetons:", {
      premiumTokens, 
      premiumExpiry,
      localStorage: user ? localStorage.getItem(`premium_tokens_${user.id}`) : null,
      premiumMode
    });
    
    return true;
  };
  
  // Fonction pour consommer un token premium
  const consumePremiumToken = async (): Promise<boolean> => {
    try {
      if (!user) {
        console.error("consumePremiumToken: Aucun utilisateur connecté");
        return false;
      }
      
      if (!isPremiumActive() || premiumTokens <= 0) {
        console.error("consumePremiumToken: Mode premium inactif ou pas de jetons disponibles");
        return false;
      }
      
      console.log("consumePremiumToken: Début de la consommation d'un jeton, jetons actuels:", premiumTokens);
      
      // Consommer un token
      const newTokenCount = premiumTokens - 1;
      console.log("consumePremiumToken: Nouveau nombre de jetons:", newTokenCount);
      
      // Mettre à jour d'abord localement
      setPremiumTokens(newTokenCount);
      localStorage.setItem(`premium_tokens_${user.id}`, newTokenCount.toString());
      
      // Persister également dans Supabase
      console.log("consumePremiumToken: Mise à jour des jetons dans Supabase:", newTokenCount);
      const { error } = await supabase
        .from('users')
        .update({ premium_tokens: newTokenCount })
        .eq('id', user.id);
        
      if (error) {
        console.error("consumePremiumToken: Erreur lors de la mise à jour des jetons premium dans Supabase:", error);
        // Restaurer l'état précédent en cas d'erreur
        setPremiumTokens(premiumTokens);
        localStorage.setItem(`premium_tokens_${user.id}`, premiumTokens.toString());
        return false;
      }
      
      // Vérifier que la mise à jour a bien été effectuée
      console.log("consumePremiumToken: Vérification de la mise à jour");
      
      // Recharger les données premium pour s'assurer que l'affichage est à jour
      await refreshPremiumStatus();
      
      console.log("consumePremiumToken: Jetons après mise à jour:", premiumTokens);
      return true;
    } catch (error) {
      console.error("consumePremiumToken: Exception lors de la consommation d'un jeton:", error);
      return false;
    }
  };
  
  // Fonction pour recharger les données premium depuis Supabase
  const refreshPremiumStatus = async () => {
    if (!user) return;
    
    console.log("Rechargement du statut premium depuis Supabase");
    const { data, error } = await supabase
      .from('users')
      .select('premium_tokens, premium_expiry, is_premium')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error("Erreur lors du rechargement du statut premium:", error);
      return;
    }
    
    if (data) {
      console.log("Données premium récupérées:", data);
      
      // Mettre à jour les tokens - forcer la mise à jour même si la valeur est zéro
      const tokenCount = data.premium_tokens !== null && data.premium_tokens !== undefined ? data.premium_tokens : 0;
      console.log("Mise à jour des tokens à:", tokenCount);
      setPremiumTokens(tokenCount);
      localStorage.setItem(`premium_tokens_${user.id}`, tokenCount.toString());
      
      // Mettre à jour l'expiration
      if (data.premium_expiry) {
        const expiryTime = new Date(data.premium_expiry).getTime();
        if (expiryTime > Date.now()) {
          setPremiumExpiry(expiryTime);
          localStorage.setItem(`premium_expiry_${user.id}`, expiryTime.toString());
        } else {
          // Si expiré, réinitialiser
          setPremiumExpiry(null);
          localStorage.removeItem(`premium_expiry_${user.id}`);
        }
      }
    }
  };
  
  // Fonction pour vérifier si l'abonnement premium est actif
  const isPremiumActive = (): boolean => {
    console.log("Vérification du statut premium:", { 
      premiumTokens, 
      premiumExpiry, 
      now: new Date().toISOString(), 
      expiryDate: premiumExpiry ? new Date(premiumExpiry).toISOString() : null 
    });
    
    // Vérifier si l'expiration est définie et valide
    if (!premiumExpiry) {
      console.log("isPremiumActive: Pas d'expiration définie");
      setPremiumMode(false);
      return false;
    }
    
    // Vérifier si l'abonnement est encore valide
    const isActive = Date.now() < premiumExpiry;
    console.log("isPremiumActive: Expiration valide?", isActive);
    
    // Vérifier également si des jetons sont disponibles
    const hasTokens = premiumTokens > 0;
    console.log("isPremiumActive: A des jetons?", hasTokens);
    
    // L'abonnement est actif seulement si la date est valide ET qu'il reste des jetons
    const isPremium = isActive && hasTokens;
    console.log("isPremiumActive: Résultat final:", isPremium);
    setPremiumMode(isPremium);
    return isPremium;
  };

  // Mettre à jour premiumMode chaque fois que premiumTokens ou premiumExpiry changent
  useEffect(() => {
    isPremiumActive();
  }, [premiumTokens, premiumExpiry]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      isLoading, 
      supabase, 
      signIn, 
      signUp, 
      signOut, 
      refreshUser,
      premiumTokens,
      premiumExpiry,
      activatePremium,
      consumePremiumToken,
      isPremiumActive,
      refreshPremiumStatus,
      premiumMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Ajouter un composant pour afficher les jetons premium
export const PremiumTokensBadge = () => {
  const { premiumTokens, premiumExpiry } = useAuth();
  
  // Calculer si le mode premium est actif
  const isPremiumActive = premiumExpiry && Date.now() < premiumExpiry && premiumTokens > 0;
  
  // Toujours afficher le badge, mais avec un état différent si inactif
  return (
    <div className={`${isPremiumActive ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-gray-100 border-gray-300 text-gray-600'} border px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md hover:shadow-lg transition-all cursor-default`}>
      <span className="mr-1">{isPremiumActive ? '🪙' : '⭐'}</span> 
      {isPremiumActive ? (
        <>{premiumTokens} {premiumTokens > 1 ? 'jetons' : 'jeton'} premium</>
      ) : (
        <>Mode premium inactif</>
      )}
    </div>
  );
};

export default AuthProvider; 