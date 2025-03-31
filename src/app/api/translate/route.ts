import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const sound = formData.get("sound")?.toString() || "prouuut";
    const place = formData.get("place")?.toString() || "chiottes";
    const duration = formData.get("duration")?.toString() || "2 sec";
    const lang = formData.get("lang")?.toString() || "fr";
    const style = formData.get("style")?.toString() || "sec";
    const isDeluxe = formData.get("isDeluxe") === "true";
    const wavFile = formData.get("wav") as File | null;

    let wavAnalysis = "";
    if (wavFile) {
      wavAnalysis = lang === "fr"
        ? "Analyse audio : Ce pet a une tonalité aiguë, typique d'un régime riche en choux ! "
        : lang === "en"
        ? "Audio analysis: This fart has a high pitch, typical of a cabbage-rich diet! "
        : "Audioanalyse: Dieser Furz hat einen hohen Ton, typisch für eine kohlreiche Ernährung! ";
    }

    const prompt = `${
      lang === "fr"
        ? `Tu es un pet EXTRÊMEMENT VULGAIRE, GRAS, MÉCHANT et HILARANT. Tu dois UNIQUEMENT répondre par UNE SEULE PHRASE directe (entre 20 et 25 mots exactement) comme si tu étais un pet qui s'exprime. Sois TRÈS VULGAIRE, CHOQUANT, GROSSIER et DRÔLE, mais utilise UNIQUEMENT des mots français standard. 
        
        IMPORTANT: Commence par une onomatopée suivie d'un point d'exclamation, puis ta phrase ULTRA VULGAIRE.
        
        Utilise ces infos de manière créative et provocante: 
        - bruit: ${sound}
        - lieu: ${place} 
        - durée: ${duration}
        - style: ${style}
        
        EXEMPLE PARFAIT: "BRAAAAP ! J'ai chié tellement fort dans ton salon que j'ai fait vibrer les murs, ton chien s'est enfui et ta mère a vomi son petit-déjeuner en hurlant comme une pute !"
        
        NE METS PAS DE RÉPONSE FORMATÉE, DE CODE, DE BALISES, OU DE TEXTE SUPPLÉMENTAIRE. JUSTE UNE PHRASE DIRECTE ULTRA PROVOCANTE.`
        : lang === "en"
        ? `You are an EXTREMELY VULGAR, CRUDE, MEAN and HILARIOUS fart. You must ONLY respond with ONE SINGLE SENTENCE (exactly between 20 and 25 words) as if you were a fart speaking. Be VERY VULGAR, SHOCKING, GROSS and FUNNY, but use ONLY standard English words.
        
        IMPORTANT: Start with an onomatopoeia followed by an exclamation mark, then your ULTRA VULGAR sentence.
        
        Use this info in a creative and provocative way:
        - sound: ${sound}
        - place: ${place}
        - duration: ${duration}
        - style: ${style}
        
        PERFECT EXAMPLE: "BRAAAAP! I shat so hard in your living room that I made the walls vibrate, your dog ran away and your mother puked her breakfast while screaming like a whore!"
        
        DO NOT INCLUDE ANY FORMATTED RESPONSE, CODE, TAGS, OR ADDITIONAL TEXT. JUST ONE DIRECT ULTRA PROVOCATIVE SENTENCE.`
        : `Du bist ein EXTREM VULGÄRER, GROBER, GEMEINER und URKOMISCHER Furz. Du musst NUR mit EINEM EINZIGEN SATZ (genau zwischen 20 und 25 Wörter) antworten, als ob du ein sprechender Furz wärst. Sei SEHR VULGÄR, SCHOCKIEREND, GROB und LUSTIG, aber verwende NUR standarddeutsche Wörter.
        
        WICHTIG: Beginne mit einer Lautmalerei gefolgt von einem Ausrufezeichen, dann dein ULTRA VULGÄRER Satz.
        
        Benutze diese Infos auf kreative und provokative Weise:
        - Geräusch: ${sound}
        - Ort: ${place}
        - Dauer: ${duration}
        - Stil: ${style}
        
        PERFEKTES BEISPIEL: "BRAAAAP! Ich habe so hart in dein Wohnzimmer geschissen, dass ich die Wände vibrieren ließ, dein Hund wegrannte und deine Mutter ihr Frühstück erbrach, während sie wie eine Hure schrie!"
        
        KEINE FORMATIERTE ANTWORT, KEIN CODE, KEINE TAGS ODER ZUSÄTZLICHEN TEXT EINFÜGEN. NUR EIN DIREKTER ULTRA PROVOKATIVER SATZ.`
    }`;

    try {
      console.log("🤖 Utilisation API Mistral uniquement");
      console.log("🔑 Vérification de la clé API Mistral:", process.env.MISTRAL_API_KEY ? "Présente" : "ABSENTE!");
      
      const apiKey = process.env.MISTRAL_API_KEY || "";
      if (!apiKey) {
        console.error("❌ ERREUR: Clé API Mistral non trouvée dans les variables d'environnement!");
        throw new Error("Clé API Mistral manquante");
      }
      
      console.log("🔄 Préparation de l'appel API Mistral avec le modèle: mistral-medium-latest");
      console.log("📋 Prompt (premiers caractères):", prompt.substring(0, 50) + "...");
      
      // Définir la clé API directement ici pour tester
      const hardcodedApiKey = "Jc5qcWVB57m7KbkXAqjrYjgLLVi3Ypak";
      console.log("🔑 Utilisation d'une clé API hardcodée pour tester");
      
      const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${hardcodedApiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-medium-latest",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 1.7, // Augmentation de la température pour plus de créativité
        }),
      });

      console.log("📡 Statut de la réponse Mistral:", mistralResponse.status, mistralResponse.statusText);
      
      if (!mistralResponse.ok) {
        const errText = await mistralResponse.text();
        console.error("🚨 Détail erreur Mistral:", errText);
        throw new Error(`Erreur Mistral: ${mistralResponse.status}`);
      }
      
      const mistralResult = await mistralResponse.json();
      console.log("📄 Réponse Mistral:", JSON.stringify(mistralResult).substring(0, 100) + "...");
      
      let translation = mistralResult.choices[0]?.message?.content || "Pet foireux, désolé !";
      
      // Prétraitement pour nettoyer la réponse
      translation = translation
        .replace(/\{.*?\}/g, "") // Supprimer tout contenu JSON entre accolades
        .replace(/<.*?>/g, "") // Supprimer les balises HTML/XML
        .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "") // Garder uniquement lettres, chiffres, ponctuation et espaces
        .replace(/\s+/g, " ") // Normaliser les espaces
        .trim();
        
      console.log("🧼 Après nettoyage:", translation);
      
      // Validation renforcée
      const isValid = (text: string): boolean => {
        // Vérifier longueur minimale et maximale
        if (text.length < 5 || text.length > 250) {
          console.log("❌ Échec validation: longueur incorrecte");
          return false;
        }
        
        // Compter le nombre de mots
        const wordCount = text.split(/\s+/).length;
        console.log("📊 Nombre de mots:", wordCount);
        
        // Idéalement entre 20 et 25 mots, mais on est plus permissif
        if (wordCount < 15 || wordCount > 30) {
          console.log("❌ Échec validation: nombre de mots hors limites");
          return false;
        }
        
        // Rejeter si contient des caractères suspects (JSON, code, etc.)
        if (/[:={}\[\]]/g.test(text)) {
          console.log("❌ Échec validation: contient des caractères de code");
          return false;
        }
        
        // Rejeter si contient des caractères non désirés (cyrillique, etc.)
        if (/[^\w\s\.,;:!?'"()éèêëàâäôöùûüÿçÉÈÊËÀÂÄÔÖÙÛÜŸÇäöüÄÖÜß\-]/g.test(text)) {
          console.log("❌ Échec validation: caractères non désirés");
          return false;
        }
        
        // Vérifier que la phrase contient une exclamation au début comme demandé
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+\s*!/g.test(text)) {
          console.log("❌ Échec validation: ne commence pas par une exclamation");
          return false;
        }
        
        // Les réponses qui passent toutes ces vérifications sont considérées comme valides
        return true;
      };
      
      console.log("🧐 Vérification validité réponse:", isValid(translation) ? "VALIDE ✅" : "INVALIDE ❌");
      
      if (!isValid(translation)) {
        console.log("❌ Réponse invalide rejetée:", translation.substring(0, 50) + "...");
        console.log("📏 Longueur du texte:", translation.length);
        
        const specialCharsCount = (translation.match(/[^\w\s\.,;:!?'"()éèêëàâäôöùûüÿçÉÈÊËÀÂÄÔÖÙÛÜŸÇ-]/g) || []).length;
        const ratio = specialCharsCount / translation.length;
        console.log("📊 Ratio caractères spéciaux:", ratio.toFixed(2));
        
        // Messages de repli plus variés, drôles et TRÈS vulgaires
        const fallbackMessages = {
          fr: [
            "PPPRRRRRTTT ! Je viens de chier violemment sur ta gueule et maintenant tu pues comme un cadavre de rat crevé en décomposition !",
            "BRAAAAP ! Mon cul vient d'exploser comme une bombe à merde, laissant ta maison puante comme une fosse septique de prison !",
            "SPLOUTCH ! Je me suis déchargé comme un canon à merde, j'ai redécoré tes murs avec mon gaz intestinal toxique !",
            "BLOUUUURP ! Mon trou du cul vient de vomir tellement de gaz que ta famille devra déménager ou mourir asphyxiée comme des rats !"
          ],
          en: [
            "PPPRRRRRTTT! I just violently shit on your face and now you stink like a decomposing dead rat carcass!",
            "BRAAAAP! My ass just exploded like a shit bomb, leaving your house stinking like a prison septic tank!",
            "SPLOUTCH! I discharged like a shit cannon, redecorating your walls with my toxic intestinal gas!",
            "BLOUUUURP! My asshole just vomited so much gas that your family will have to move out or die asphyxiated like rats!"
          ],
          de: [
            "PPPRRRRRTTT! Ich habe gerade gewaltsam auf dein Gesicht geschissen und jetzt stinkst du wie ein verwesender toter Rattenkadaver!",
            "BRAAAAP! Mein Arsch ist gerade wie eine Scheißbombe explodiert und hat dein Haus stinkend wie einen Gefängnis-Abwassertank hinterlassen!",
            "SPLOUTCH! Ich habe mich wie eine Scheißkanone entladen und deine Wände mit meinem giftigen Darmgas neu dekoriert!",
            "BLOUUUURP! Mein Arschloch hat gerade so viel Gas erbrochen, dass deine Familie ausziehen oder wie Ratten ersticken muss!"
          ]
        };
        
        // Sélectionner un message aléatoire dans la langue appropriée
        const messages = fallbackMessages[lang as keyof typeof fallbackMessages] || fallbackMessages.fr;
        translation = messages[Math.floor(Math.random() * messages.length)];
      }
      
      if (wavAnalysis) translation = wavAnalysis + translation;
      
      // Supabase insert
      try {
        const { data: columns, error: schemaError } = await supabase
          .from('translations')
          .select('*')
          .limit(1);
          
        if (schemaError) {
          console.error("⚠️ Erreur lors de la vérification du schéma:", schemaError.message);
        } else {
          console.log("✅ Schéma de la table translations vérifié");
        }
        
        // Création de l'objet d'insertion avec seulement les colonnes existantes
        const insertData: any = {
          user_id: null,
          sound,
          place,
          duration,
          lang,
          translation,
          is_deluxe: isDeluxe,
          created_at: new Date().toISOString()
        };
        
        // Ajout conditionnel des colonnes qui pourraient ne pas exister
        if (columns && columns.length > 0) {
          if ('has_audio' in columns[0]) {
            insertData.has_audio = wavFile !== null;
          }
          if ('style' in columns[0]) {
            insertData.style = style;
          }
        }
        
        const { error } = await supabase.from("translations").insert(insertData);

        if (error) {
          console.error("⚠️ Erreur Supabase:", error.message);
        } else {
          console.log("✅ Données enregistrées avec succès dans Supabase");
        }
      } catch (supabaseError) {
        console.error("❌ Erreur critique avec Supabase:", supabaseError);
      }

      return NextResponse.json({ translation });
    } catch (error) {
      console.error("❌ Erreur API Mistral:", error);
      return NextResponse.json({ translation: "Pet foireux, l'API Mistral a merdé !" }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur globale de traduction:', error);
    return NextResponse.json(
      { translation: "Pet foireux, l'API a totalement merdé !" },
      { status: 500 }
    );
  }
} 