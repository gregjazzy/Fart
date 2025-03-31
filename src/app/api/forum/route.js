import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const sound = data.sound || "prouuut";
  const place = data.place || "chiottes";
  const duration = data.duration || "2 sec";
  const lang = data.lang || "fr";
  const isFake = data.isFake || false;

  const prompt = `${
    lang === "fr"
      ? "Commente ce pet de manière loufoque et drôle"
      : lang === "en"
      ? "Comment on this fart in a wacky and funny way"
      : "Kommentiere diesen Furz auf eine verrückte und lustige Weise"
  }: bruit=${sound}, lieu=${place}, durée=${duration}${isFake ? " (poste un commentaire complètement barré)" : ""}`;

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-medium-latest",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 1.2,
      }),
    });

    const result = await response.json();
    const comment = result.choices[0]?.message?.content || "Ce pet est trop fou pour moi !";

    return NextResponse.json({ comment });
  } catch (error) {
    return NextResponse.json({ comment: "Une erreur s'est produite lors du traitement de la requête !" }, { status: 500 });
  }
} 