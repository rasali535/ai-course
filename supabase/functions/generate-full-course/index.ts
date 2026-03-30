// @ts-nocheck
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// 🌐 CORS Headers for Hostinger
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { topic, user_id } = await req.json();
    if (!topic || !user_id) throw new Error("Missing topic or user_id.");

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    // 🧠 Leveraging Gemini 3 Flash for advanced reasoning and quiz generation
    const GEMINI_MODEL = "gemini-3-flash"; 
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
      Act as an elite Instructional Designer with expertise in assessment and pedagogical content.
      Generate a comprehensive 'Full Course' for the topic: "${topic}".
      
      Response MUST be valid JSON with this exact schema:
      {
        "title": "string",
        "description": "string",
        "modules": [
          {
            "moduleTitle": "string",
            "lessons": [
               { "title": "string", "content": "long-form high-quality educational text in Markdown format (at least 3 paragraphs with bullet points and code examples if relevant)" }
            ],
            "quiz": [
              { 
                "question": "string", 
                "options": ["option A", "option B", "option C", "option D"], 
                "answer": 0, 
                "explanation": "concise corrective feedback" 
              }
            ]
          }
        ]
      }
      
      Requirements:
      - At least 5 modules.
      - Exactly 3 quiz questions per module.
      - Each lesson MUST have substantive content worth reading (Reader View).
      - Return ONLY the JSON object.
    `;

    // 🚀 AI Generation Sequence
    const aiResponse = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.8,
        },
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      throw new Error(`AI Engine Error: ${errorData.error?.message || "Generation Failed"}`);
    }

    const aiData = await aiResponse.json();
    const courseContent = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // 💾 Secure Database Persistence (Service Role bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("courses")
      .insert([
        {
          user_id: user_id,
          title: courseContent.title,
          description: courseContent.description,
          content: courseContent, // Storing full quiz + structure + lessons
          status: 'draft',
          is_public: false
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Full course with module quizzes generated successfully.",
      course: dbData 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
