-- Création de la table users
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID NOT NULL PRIMARY KEY,
  "username" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "is_premium" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout de commentaires
COMMENT ON TABLE "users" IS 'Table qui stocke les informations des utilisateurs';
COMMENT ON COLUMN "users"."id" IS 'ID de l''utilisateur (correspondant à l''ID d''auth.users)';
COMMENT ON COLUMN "users"."username" IS 'Nom d''utilisateur affiché';
COMMENT ON COLUMN "users"."email" IS 'Adresse email de l''utilisateur';
COMMENT ON COLUMN "users"."is_premium" IS 'Si l''utilisateur a un abonnement premium';

-- Création d'une politique RLS pour permettre à l'utilisateur de lire son propre profil
CREATE POLICY "Les utilisateurs peuvent lire leur propre profil"
  ON "users"
  FOR SELECT
  USING (auth.uid() = id);

-- Création d'une politique RLS pour permettre à l'utilisateur de mettre à jour son propre profil
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON "users"
  FOR UPDATE
  USING (auth.uid() = id);

-- Activation de la Row Level Security sur la table users
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Permettre aux fonctions de service d'accéder à cette table
CREATE POLICY "Service access" ON "users" FOR ALL USING (true); 