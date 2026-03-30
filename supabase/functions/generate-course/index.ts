// index.ts - Advanced Supabase Edge Function for Multimodal Course Gen
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// 🌐 CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { topic, user_id } = await req.json();
    if (!topic || !user_id) throw new Error("Missing topic or user_id.");

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    // 🚀 Upgrading to Gemini 2.0 Flash for 2026 Multimodal Capabilities
    const GEMINI_MODEL = "gemini-2.0-flash"; 
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
      Act as a world-class Multimodal Educator and Instructional Designer.
      Generate a comprehensive video-first course for the topic: "${topic}".
      
      The output MUST be valid JSON with this structure:
      {
        "title": "Elite Course Title",
        "description": "A high-conversion overview of the learning outcome.",
        "modules": [
          {
            "title": "Module Name",
            "lessons": [
              {
                "title": "Lesson Title",
                "content": "Detailed educational text (3-4 paragraphs).",
                "video_script": "A word-for-word voiceover script for an AI avatar or instructor.",
                "visual_prompt": "A detailed descriptive prompt for a video generation model (like Veo or Sora) to create the background/visuals for this lesson.",
                "duration_estimate": "3-5 minutes"
              }
            ]
          }
        ]
      }
      
      Specifications:
      - At least 5 Modules.
      - Each lesson MUST include a 'video_script' and 'visual_prompt'.
      - High academic quality and professional tone.
      - Return ONLY raw JSON.
    `;

    // 🧠 AI Generation
    const aiResponse = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.7,
        },
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      throw new Error(`AI Gateway Error: ${errorData.error?.message || "Generation Failed"}`);
    }

    const aiData = await aiResponse.json();
    const courseContent = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // 💾 Database Persistence
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error: dbError } = await supabaseAdmin
      .from("courses")
      .insert([
        {
          user_id: user_id,
          title: courseContent.title,
          description: courseContent.description,
          content: courseContent, // Stores scripts, prompts, and lessons
          status: 'draft',
          is_public: false
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Multimodal course generated with video scripts.",
      course: data 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
