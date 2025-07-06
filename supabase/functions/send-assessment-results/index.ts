import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuizData {
  firstName: string;
  lastName: string;
  email: string;
  answers: Record<string, any>;
}

interface Recommendation {
  category: "supplement" | "diet" | "lifestyle";
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

const calculateLongevityScore = (answers: Record<string, any>) => {
  let score = 50; // Base score

  // Sleep scoring
  if (answers.sleep_quality?.includes("Excellent")) score += 10;
  else if (answers.sleep_quality?.includes("Good")) score += 7;
  else if (answers.sleep_quality?.includes("Fair")) score += 3;
  else score -= 5;

  if (answers.sleep_schedule === "Yes") score += 5;

  // Diet scoring
  if (answers.diet_style?.includes("Mediterranean") || answers.diet_style?.includes("Keto") || answers.diet_style?.includes("Paleo")) score += 8;
  else if (answers.diet_style?.includes("Vegetarian")) score += 5;
  else score += 2;

  if (answers.processed_foods?.includes("Rarely")) score += 8;
  else if (answers.processed_foods?.includes("Sometimes")) score += 4;
  else score -= 3;

  if (answers.hydration?.includes("8+")) score += 5;
  else if (answers.hydration?.includes("6-7")) score += 3;

  // Exercise scoring
  if (answers.exercise_frequency?.includes("5+")) score += 10;
  else if (answers.exercise_frequency?.includes("3-4")) score += 7;
  else if (answers.exercise_frequency?.includes("1-2")) score += 3;
  else score -= 5;

  // Stress scoring
  if (answers.stress_level <= 2) score += 8;
  else if (answers.stress_level <= 3) score += 5; 
  else if (answers.stress_level >= 4) score -= 5;

  if (answers.stress_management?.includes("Yes, regularly")) score += 6;

  // Health symptoms penalty
  if (answers.health_symptoms?.length > 0 && !answers.health_symptoms.includes("None of the above")) {
    score -= answers.health_symptoms.length * 3;
  }

  // Energy and mental clarity
  if (answers.energy_levels?.includes("Consistently high")) score += 8;
  else if (answers.energy_levels?.includes("Good energy")) score += 5;
  else if (answers.energy_levels?.includes("Low energy")) score -= 8;

  if (answers.mental_clarity?.includes("Excellent focus")) score += 6;
  else if (answers.mental_clarity?.includes("Poor focus")) score -= 6;

  return Math.max(0, Math.min(100, Math.round(score)));
};

const generateRecommendations = (answers: Record<string, any>): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Check for symptoms that indicate supplement needs
  const hasSymptoms = answers.health_symptoms?.some((symptom: string) => 
    symptom.includes("Joint pain") || 
    symptom.includes("fatigue") || 
    symptom.includes("energy") || 
    symptom.includes("Ear ringing")
  );

  const hasGutSkinIssues = answers.gut_skin_issues === "Yes";

  if (hasSymptoms) {
    if (answers.health_symptoms?.some((s: string) => s.includes("fatigue") || s.includes("energy"))) {
      recommendations.push({
        category: "supplement",
        title: "HepatoBurn - Energy & Metabolism Support",
        description: "Scientists have discovered a hidden root cause of stubborn belly fat and low energy. This powerful formula is designed for those struggling with low energy and stubborn belly fat.",
        link: "https://1ae599voosvr3u55ljqrsz1d2y.hop.clickbank.net",
        linkText: "Learn More About HepatoBurn"
      });
    }

    if (answers.health_symptoms?.some((s: string) => s.includes("Ear ringing"))) {
      recommendations.push({
        category: "supplement", 
        title: "Quietum Plus - Ear Health Support",
        description: "Ear ringing and whooshing happen when neural pathways get damaged. The solution is to feed, regenerate and rebuild these pathways so they work in perfect harmony with your brain.",
        link: "https://f51a2arnlkwqcualzhmmyc0f8r.hop.clickbank.net",
        linkText: "Discover Quietum Plus"
      });
    }

    recommendations.push({
      category: "supplement",
      title: "ProstaVive - Comprehensive Health Support", 
      description: "A powerful new formula for boosting overall health and vitality. These specific, unique nutrients support metabolic activity, maintain healthy blood flow, and help support optimal health.",
      link: "https://hop.clickbank.net/?affiliate=fitatn&vendor=provive&tid=track",
      linkText: "Explore ProstaVive"
    });
  }

  if (hasGutSkinIssues) {
    recommendations.push({
      category: "supplement",
      title: "PrimeBiome - Doctor-Endorsed Skin-Gut Gummies",
      description: "PrimeBiome combines unique ingredients designed to support the cell turnover process by maintaining a healthy skin and gut microbiome.",
      link: "https://51a483kplq0keu0m6g-cc5xkrr.hop.clickbank.net",
      linkText: "Try PrimeBiome"
    });
  }

  // Diet recommendations
  if (!hasSymptoms || recommendations.length < 2) {
    if (answers.diet_style?.includes("Standard Western") || answers.processed_foods?.includes("Often") || answers.processed_foods?.includes("Daily")) {
      recommendations.push({
        category: "diet",
        title: "The Mediterranean Diet Guide",
        description: "Transform your health with the scientifically-proven Mediterranean diet. This comprehensive guide includes meal plans, shopping lists, and step-by-step recipes.",
        link: "https://05a9d6qkbr1l5q48m6jmndvr9e.hop.clickbank.net",
        linkText: "Get The Mediterranean Diet Guide"
      });
    }
  }

  // Lifestyle recommendations
  recommendations.push({
    category: "lifestyle",
    title: "Optimize Your Sleep for Longevity", 
    description: "Quality sleep is the foundation of longevity. Focus on maintaining consistent sleep schedules, creating a cool, dark environment, and establishing a relaxing bedtime routine."
  });

  if (answers.stress_level >= 4 || !answers.stress_management?.includes("regularly")) {
    recommendations.push({
      category: "lifestyle",
      title: "Stress Management Mastery",
      description: "Chronic stress accelerates aging at the cellular level. Implement daily meditation, deep breathing exercises, or yoga to promote longevity."
    });
  }

  return recommendations;
};

const getScoreLevel = (score: number) => {
  if (score >= 80) return { level: "Excellent", color: "#059669" };
  if (score >= 65) return { level: "Good", color: "#2563eb" };
  if (score >= 50) return { level: "Fair", color: "#d97706" };
  return { level: "Needs Improvement", color: "#dc2626" };
};

const generateEmailHTML = (quizData: QuizData, longevityScore: number, recommendations: Recommendation[]) => {
  const scoreLevel = getScoreLevel(longevityScore);
  const topRecommendations = recommendations.filter(r => r.link).slice(0, 3);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Longevity Assessment Results</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #8b5cf6, #06b6d4); padding: 40px 20px; text-align: center; color: white; }
        .content { padding: 30px 20px; }
        .score-circle { background: ${scoreLevel.color}; color: white; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; font-weight: bold; }
        .score-level { color: ${scoreLevel.color}; font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 30px; }
        .recommendation { border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .rec-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
        .rec-description { color: #6b7280; line-height: 1.6; margin-bottom: 15px; }
        .btn { background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Longevity Assessment Results</h1>
          <p>Hello ${quizData.firstName}! Here's your comprehensive vitality assessment.</p>
        </div>
        
        <div class="content">
          <div class="score-circle">${longevityScore}</div>
          <div class="score-level">${scoreLevel.level} - ${longevityScore}/100</div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">🎯 Top Recommendations For You</h2>
          
          ${topRecommendations.map((rec, index) => `
            <div class="recommendation">
              <div class="rec-title">#${index + 1} Pick: ${rec.title}</div>
              <div class="rec-description">${rec.description}</div>
              <a href="${rec.link}" class="btn">${rec.linkText}</a>
            </div>
          `).join('')}
          
          <h3 style="color: #1f2937; margin-top: 30px;">Complete Optimization Plan</h3>
          ${recommendations.map(rec => `
            <div style="margin-bottom: 15px;">
              <strong>${rec.title}</strong><br>
              <span style="color: #6b7280;">${rec.description}</span>
              ${rec.link ? `<br><a href="${rec.link}" style="color: #8b5cf6;">${rec.linkText}</a>` : ''}
            </div>
          `).join('')}
        </div>
        
        <div class="footer">
          <p>Thank you for taking the Longevity Assessment!</p>
          <p>This personalized report is based on your responses and designed to help optimize your health and vitality.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const quizData: QuizData = await req.json();
    console.log("Processing quiz submission for:", quizData.email);

    // Calculate score and generate recommendations
    const longevityScore = calculateLongevityScore(quizData.answers);
    const recommendations = generateRecommendations(quizData.answers);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store submission in database
    const { error: dbError } = await supabase
      .from('quiz_submissions')
      .insert({
        first_name: quizData.firstName,
        last_name: quizData.lastName,
        email: quizData.email,
        answers: quizData.answers,
        longevity_score: longevityScore
      });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    // Generate and send email
    const emailHTML = generateEmailHTML(quizData, longevityScore, recommendations);

    const emailResponse = await resend.emails.send({
      from: "Longevity Assessment <onboarding@resend.dev>",
      to: [quizData.email],
      subject: `Your Longevity Score: ${longevityScore}/100 - Personalized Health Recommendations`,
      html: emailHTML,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      longevityScore,
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-assessment-results function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);