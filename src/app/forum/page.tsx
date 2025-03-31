"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTokens } from "../TokenProvider";

interface ForumPost {
  sound: string;
  place: string;
  duration: string;
  lang: string;
  comment: string;
  user_name: string;
  created_at?: string;
  premium?: boolean;
}

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState<Omit<ForumPost, 'user_name'>>({ sound: "", place: "", duration: "", lang: "fr", comment: "" });
  const [loading, setLoading] = useState(true);
  const { isPremiumActive } = useTokens();
  const [isPremium, setIsPremium] = useState(false);
  
  // Import du client Supabase depuis le contexte d'authentification global
  const supabase = null; // Nous n'utilisons plus Supabase pour le moment

  useEffect(() => {
    // Utiliser isPremiumActive du contexte de tokens
    setIsPremium(isPremiumActive);
  }, [isPremiumActive]);

  useEffect(() => {
    const fetchPosts = async () => {
      // Pour le moment, on utilise des données statiques
      const staticPosts = [
        {
          sound: "Prouuut",
          place: "métro",
          duration: "5 sec",
          lang: "fr",
          comment: "Un pet qui a fait trembler tout le wagon !",
          user_name: "Pétomax3000"
        },
        {
          sound: "Fsss",
          place: "ascenseur",
          duration: "4 sec",
          lang: "fr",
          comment: "Un pet discret mais efficace",
          user_name: "Gazounet"
        },
        {
          sound: "Paf",
          place: "lit",
          duration: "3 sec",
          lang: "fr",
          comment: "Un pet qui a réveillé tout le monde",
          user_name: "Fartinator"
        },
        {
          sound: "Blurp",
          place: "piscine",
          duration: "2 sec",
          lang: "fr",
          comment: "Un pet sous-marin magnifique",
          user_name: "AquaPeteur",
          premium: true
        },
        {
          sound: "Bzzzzt",
          place: "bibliothèque",
          duration: "6 sec",
          lang: "fr",
          comment: "Le silence s'est transformé en cauchemar",
          user_name: "LecteurSilencieux",
          premium: true
        }
      ];
      
      // Filtrer les posts si l'utilisateur n'est pas premium
      const filteredPosts = isPremium 
        ? staticPosts 
        : staticPosts.filter(post => !post.premium);
        
      setPosts(filteredPosts);
      setLoading(false);
    };
    
    fetchPosts();
  }, [isPremium]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.sound || !newPost.place || !newPost.duration) return;

    try {
      const response = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      const data = await response.json();
      
      // Ajouter le nouveau post à la liste
      setPosts([
        { 
          sound: newPost.sound, 
          place: newPost.place, 
          duration: newPost.duration, 
          lang: newPost.lang, 
          comment: data.comment, 
          user_name: "Anonyme"
        }, 
        ...posts
      ]);
      setNewPost({ sound: "", place: "", duration: "", lang: "fr", comment: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Fond avec dégradé */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/Forum.png")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      {/* Menu de navigation */}
      <nav className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 relative z-10">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0 justify-center">
          <Link
            href="/"
            className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-purple-700 transition duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg text-sm sm:text-base"
          >
            <span className="mr-1">🏠</span> Accueil
          </Link>
          <Link
            href="/dictionary"
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg text-sm sm:text-base"
          >
            <span className="mr-1">📚</span> Dictionnaire
          </Link>
          <Link
            href="/forum"
            className="bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-700 transition duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg text-sm sm:text-base"
          >
            <span className="mr-1">💬</span> Forum
          </Link>
          <Link
            href="/foods"
            className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-red-700 transition duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg text-sm sm:text-base"
          >
            <span className="mr-1">🍲</span> Aliments
          </Link>
        </div>
        <select
          className="p-2 border-2 border-orange-400 rounded-lg bg-yellow-100 text-orange-800 focus:outline-none focus:border-orange-600 transform hover:scale-105 transition-transform"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </nav>

      <div className="relative z-10">
        <h1 className="text-center mb-6 sm:mb-10 drop-shadow-lg">
          <span className="block text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-2">
            💬 Forum des
          </span>
          <span className="block text-5xl sm:text-7xl md:text-8xl font-extrabold text-yellow-300 drop-shadow-xl">
            Pétards 💨
          </span>
        </h1>
      </div>
      
      {/* Section des posts du forum */}
      <div className="w-full max-w-4xl z-10 mb-6 sm:mb-10">
        <div className="grid gap-4 sm:gap-6">
          {posts.map((post, index) => (
            <div key={index} className="bg-white bg-opacity-90 border-b border-orange-200 pb-4 hover:bg-orange-50 transition-colors p-4 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <h3 className="text-lg sm:text-xl font-bold text-orange-700 hover:text-orange-500 transition-colors mb-2 sm:mb-0">
                  {post.user_name} : {post.sound} dans {post.place}, {post.duration}
                </h3>
                <span className="bg-yellow-400 text-orange-800 text-xs px-2 py-1 rounded-full w-fit mb-2 sm:mb-0">
                  HOT 🔥
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 text-sm">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.user_name.charAt(0)}
                  </div>
                  <span className="text-orange-700">{post.user_name}</span>
                </div>
                <div className="text-orange-600">
                  {post.comment}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between gap-4 sm:gap-6 z-10 mb-6">
        <div className="bg-white bg-opacity-80 p-4 sm:p-6 rounded-xl shadow-xl flex-1 mb-4 md:mb-0">
          <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">👑</span> Top Péteurs
          </h3>
          <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
            <ul className="space-y-2">
              {[
                { name: "Beethoven_du_Pet", posts: 128, badge: "💎 Légendaire" },
                { name: "Dr_Prout", posts: 96, badge: "🥇 Expert" },
                { name: "PetDiscret", posts: 87, badge: "🥈 Maître" },
                { name: "NinjaGazeux", posts: 65, badge: "🥉 Vétéran" },
                { name: "MalChanceux", posts: 42, badge: "🏅 Débutant" },
                { name: "GazMoustache", posts: 14, badge: "🌱 Novice" },
                { name: "PetitPéteur", posts: 9, badge: "🌱 Novice" },
                { name: "FlatulenceGirl", posts: 7, badge: "🌱 Novice" },
                { name: "ChouCroute31", posts: 5, badge: "🔰 Nouveau" },
                { name: "AnalysteGazeux", posts: 4, badge: "🔰 Nouveau" },
                { name: "MamiePéteuse", posts: 3, badge: "🔰 Nouveau" },
                { name: "GrandTimide", posts: 2, badge: "🔰 Nouveau" },
                { name: "PremierPet", posts: 1, badge: "🔰 Nouveau" }
              ].map((user, index) => (
                <li key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 hover:bg-orange-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-2 mb-1 sm:mb-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-orange-700 text-sm sm:text-base">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-10 sm:ml-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{user.posts} posts</span>
                    <span className="bg-yellow-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {user.badge}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-80 p-4 sm:p-6 rounded-xl shadow-xl flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">🔥</span> Sujets Tendances
          </h3>
          <ul className="space-y-2 sm:space-y-3">
            {[
              { 
                id: "dogs", 
                title: "Mon chien a l'air dégoûté quand je pète, est-ce normal ?",
                author: "MaîtreCanin",
                comment: "Les chiens ont un odorat 40x plus sensible, ils souffrent en silence",
                badge: "🐕 Animaux",
                premium: false
              },
              { 
                id: "climate", 
                title: "Les pets ont-ils un impact sur le réchauffement climatique ?",
                author: "EcoFartologue",
                comment: "Mes recherches montrent que 1000 pets = 1 vache en terme de méthane !",
                badge: "🌍 Écologie",
                premium: false
              },
              { 
                id: "support", 
                title: "Péteurs anonymes : groupe de soutien virtuel",
                author: "ThérapeuteDuVent",
                comment: "Accepter son corps et ses fonctions naturelles est la première étape",
                badge: "🧘 Bien-être",
                premium: false
              },
              { 
                id: "history", 
                title: "Histoire des pets à travers les siècles - Un art perdu",
                author: "ProfesseurProut",
                comment: "De l'antiquité à nos jours, comment le pet est passé d'art noble à tabou",
                badge: "📜 Histoire",
                premium: false
              },
              { 
                id: "contest", 
                title: "CONCOURS : Le pet le plus long jamais enregistré",
                author: "ChampionDuMonde",
                comment: "18 secondes est le record actuel, qui peut faire mieux ?",
                badge: "🏆 Concours",
                premium: true
              },
              { 
                id: "music", 
                title: "La symphonie intestinale : classifier les pets par notes musicales",
                author: "MozartDuDerrière",
                comment: "J'ai identifié des Do, des La et même un Si bémol occasionnel",
                badge: "🎵 Musique",
                premium: true
              },
              { 
                id: "science", 
                title: "Étude scientifique : pourquoi certains pets sont silencieux mais mortels",
                author: "DocteurGaz",
                comment: "L'équation parfaite entre pression et viscosité intestinale",
                badge: "🔬 Science",
                premium: true
              },
              { 
                id: "legal", 
                title: "Aspects juridiques : peut-on être poursuivi pour flatulence en public ?",
                author: "AvocatFlatulent",
                comment: "Analyse des cas de jurisprudence dans différents pays",
                badge: "⚖️ Juridique",
                premium: true
              }
            ].filter(topic => !topic.premium || isPremium).map((topic, index) => {
              const isPremiumTopic = topic.premium;
              
              return (
                <li key={topic.id} className={`p-2 hover:bg-orange-50 rounded-lg transition-colors ${isPremiumTopic ? 'bg-yellow-50' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex items-start">
                      <span className="mr-2 text-xl">{index + 1}.</span>
                      <div>
                        <h4 className="font-medium text-orange-800 hover:text-orange-600 transition-colors flex items-center">
                          {topic.title}
                          {isPremiumTopic && (
                            <span className="ml-2 text-xs bg-yellow-400 text-orange-800 px-1 py-0.5 rounded-full">
                              PREMIUM
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">Par <span className="text-orange-700">{topic.author}</span></p>
                        <p className="text-sm text-gray-600 mt-1">{topic.comment}</p>
                      </div>
                    </div>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full w-fit">
                      {topic.badge}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      <div className="w-full max-w-4xl bg-white bg-opacity-90 p-4 sm:p-8 rounded-xl shadow-2xl z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-4 sm:mb-6">Partagez Votre Expérience</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Son</label>
              <input
                type="text"
                value={newPost.sound}
                onChange={(e) => setNewPost({ ...newPost, sound: e.target.value })}
                className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
                placeholder="Prouuut, Fsss, Paf..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Lieu</label>
              <input
                type="text"
                value={newPost.place}
                onChange={(e) => setNewPost({ ...newPost, place: e.target.value })}
                className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
                placeholder="Métro, ascenseur, lit..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Durée</label>
              <input
                type="text"
                value={newPost.duration}
                onChange={(e) => setNewPost({ ...newPost, duration: e.target.value })}
                className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
                placeholder="5 sec, 3 sec..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Langue</label>
              <select
                value={newPost.lang}
                onChange={(e) => setNewPost({ ...newPost, lang: e.target.value })}
                className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">Commentaire</label>
            <textarea
              value={newPost.comment}
              onChange={(e) => setNewPost({ ...newPost, comment: e.target.value })}
              className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none h-24"
              placeholder="Décrivez votre expérience..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 transform hover:scale-105"
          >
            Publier
          </button>
        </form>
      </div>
      
      <div className="mt-8 sm:mt-12 w-full max-w-lg text-center relative z-10 bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-2xl">
        <p className="text-white font-bold">
          © 2024 Pétomane Studio - 100% sans filtres à charbon
        </p>
      </div>
    </div>
  );
}