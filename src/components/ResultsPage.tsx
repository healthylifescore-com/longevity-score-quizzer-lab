import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QuizData } from "./QuizForm";
import { Trophy, Star, Heart, Zap, ArrowRight, ExternalLink } from "lucide-react";

interface ResultsPageProps {
  quizData: QuizData;
  onRestart: () => void;
}

interface Recommendation {
  category: "supplement" | "diet" | "lifestyle";
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

export const ResultsPage = ({ quizData, onRestart }: ResultsPageProps) => {
  // Calculate Longevity Score based on answers
  const calculateLongevityScore = () => {
    let score = 50; // Base score
    const answers = quizData.answers;

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

  const longevityScore = calculateLongevityScore();

  // Generate recommendations based on answers
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    const answers = quizData.answers;

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
          description: "Scientists have discovered a hidden root cause of stubborn belly fat and low energy. This powerful formula is designed for those struggling with low energy and stubborn belly fat. Experience more energy, healthier skin, better sleep, reduced hunger, clearer thinking, and improved overall health.",
          link: "https://1ae599voosvr3u55ljqrsz1d2y.hop.clickbank.net",
          linkText: "Learn More About HepatoBurn"
        });
      }

      if (answers.health_symptoms?.some((s: string) => s.includes("Ear ringing"))) {
        recommendations.push({
          category: "supplement", 
          title: "Quietum Plus - Ear Health Support",
          description: "Ear ringing and whooshing happen when neural pathways get damaged. The solution is to feed, regenerate and rebuild these pathways so they work in perfect harmony with your brain. Quietum Plus combines powerful plants with modern medicine and technology, backed by hundreds of clinical studies.",
          link: "https://hop.clickbank.net/?affiliate=fitatn&vendor=quietum&tid=track",
          linkText: "Discover Quietum Plus"
        });
      }

      recommendations.push({
        category: "supplement",
        title: "ProstaVive - Comprehensive Health Support", 
        description: "A powerful new formula for boosting overall health and vitality. These specific, unique nutrients support metabolic activity, maintain healthy blood flow, and help support optimal health. Perfect for addressing multiple health concerns simultaneously.",
        link: "https://hop.clickbank.net/?affiliate=fitatn&vendor=provive&tid=track",
        linkText: "Explore ProstaVive"
      });
    }

    if (hasGutSkinIssues) {
      recommendations.push({
        category: "supplement",
        title: "PrimeBiome - Doctor-Endorsed Skin-Gut Gummies",
        description: "PrimeBiome combines unique ingredients designed to support the cell turnover process by maintaining a healthy skin and gut microbiome. The new beneficial bacteria help promote a more youthful appearance while supporting digestive health.",
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
          description: "Transform your health with the scientifically-proven Mediterranean diet. This comprehensive guide includes meal plans, shopping lists for unusual ingredients (they're actually all just at the grocery store!), and step-by-step recipes. Perfect for sustainable weight loss and longevity.",
          link: "https://05a9d6qkbr1l5q48m6jmndvr9e.hop.clickbank.net",
          linkText: "Get The Mediterranean Diet Guide"
        });
      } else {
        // Recommend Keto or Paleo based on current diet
        if (answers.diet_style?.includes("Low-carb") || answers.exercise_frequency?.includes("5+")) {
          recommendations.push({
            category: "diet",
            title: "Advanced Ketogenic Protocol",
            description: "Take your low-carb lifestyle to the next level with our advanced ketogenic protocol. Designed for those ready to optimize their metabolism, boost energy levels, and achieve peak mental clarity through nutritional ketosis.",
            link: "#",
            linkText: "Learn About Keto Optimization"
          });
        } else {
          recommendations.push({
            category: "diet", 
            title: "Paleo Lifestyle Transformation",
            description: "Discover the power of ancestral eating with our comprehensive Paleo guide. Perfect for improving energy, reducing inflammation, and optimizing your health through whole foods nutrition.",
            link: "#",
            linkText: "Explore Paleo Living"
          });
        }
      }
    }

    // Lifestyle recommendations
    recommendations.push({
      category: "lifestyle",
      title: "Optimize Your Sleep for Longevity", 
      description: "Quality sleep is the foundation of longevity. Focus on maintaining consistent sleep schedules, creating a cool, dark environment, and establishing a relaxing bedtime routine to maximize recovery and cellular repair."
    });

    if (answers.stress_level >= 4 || !answers.stress_management?.includes("regularly")) {
      recommendations.push({
        category: "lifestyle",
        title: "Stress Management Mastery",
        description: "Chronic stress accelerates aging at the cellular level. Implement daily meditation, deep breathing exercises, or yoga to activate your parasympathetic nervous system and promote longevity."
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-green-600", icon: <Trophy className="w-5 h-5" /> };
    if (score >= 65) return { level: "Good", color: "text-blue-600", icon: <Star className="w-5 h-5" /> };
    if (score >= 50) return { level: "Fair", color: "text-yellow-600", icon: <Heart className="w-5 h-5" /> };
    return { level: "Needs Improvement", color: "text-red-600", icon: <Zap className="w-5 h-5" /> };
  };

  const scoreLevel = getScoreLevel(longevityScore);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Your Longevity Score Results
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Hello {quizData.firstName}! Here's your comprehensive vitality assessment.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Score Display */}
        <Card className="max-w-2xl mx-auto mb-12 shadow-elegant">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-vitality flex items-center justify-center shadow-vitality">
                  <div className="text-4xl font-bold text-primary-foreground">
                    {longevityScore}
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="px-4 py-1">
                    out of 100
                  </Badge>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">
              Your Biological Vitality Score
            </CardTitle>
            <div className={`flex items-center justify-center gap-2 text-xl font-semibold ${scoreLevel.color}`}>
              {scoreLevel.icon}
              {scoreLevel.level}
            </div>
          </CardHeader>
        </Card>

        {/* Top Recommended Products */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            🎯 Top Recommendations For You
          </h2>
          <div className="grid gap-6 max-w-4xl mx-auto">
            {recommendations.filter(r => r.link).slice(0, 3).map((rec, index) => (
              <Card key={index} className="p-6 hover:shadow-wellness transition-all duration-300 border-2 border-vitality/20">
                <CardContent className="p-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-foreground">{rec.title}</h3>
                    <Badge variant="outline" className="border-vitality text-vitality">
                      #{index + 1} Pick
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {rec.description}
                  </p>
                  {rec.link && (
                    <Button 
                      asChild
                      variant="vitality" 
                      size="lg"
                      className="w-full text-lg font-semibold"
                    >
                      <a href={rec.link} target="_blank" rel="noopener noreferrer">
                        {rec.linkText}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Detailed Analysis */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Your Detailed Health Analysis
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Strengths */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl text-green-600 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Your Health Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                {quizData.answers.sleep_quality?.includes("Excellent") && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Excellent sleep quality
                  </div>
                )}
                {quizData.answers.exercise_frequency?.includes("5+") && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Regular exercise routine
                  </div>
                )}
                {quizData.answers.stress_management?.includes("regularly") && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Active stress management
                  </div>
                )}
                {quizData.answers.hydration?.includes("8+") && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Optimal hydration levels
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Optimization Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                {quizData.answers.sleep_quality?.includes("Poor") && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    Sleep quality improvement needed
                  </div>
                )}
                {quizData.answers.processed_foods?.includes("Daily") && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    Reduce processed food intake
                  </div>
                )}
                {quizData.answers.exercise_frequency?.includes("Rarely") && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    Increase physical activity
                  </div>
                )}
                {(quizData.answers.stress_level >= 4) && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    Stress level management
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Recommendations */}
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Complete Optimization Plan
          </h2>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {rec.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={
                          rec.category === "supplement" 
                            ? "border-vitality text-vitality" 
                            : rec.category === "diet" 
                            ? "border-wellness text-wellness"
                            : "border-energy text-energy"
                        }
                      >
                        {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {rec.description}
                  </p>
                  {rec.link && (
                    <Button asChild variant="outline" className="border-vitality text-vitality hover:bg-vitality hover:text-primary-foreground">
                      <a href={rec.link} target="_blank" rel="noopener noreferrer">
                        {rec.linkText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-vitality/10 to-wellness/10">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Transform Your Health?
              </h3>
              <p className="text-muted-foreground mb-6">
                Your personalized longevity plan is just the beginning. Take action on these recommendations to unlock your full vitality potential.
              </p>
              <div className="grid gap-4 max-w-md mx-auto">
                {recommendations.filter(r => r.link).slice(0, 2).map((rec, index) => (
                  <Button 
                    key={index}
                    asChild 
                    variant="vitality"
                    size="lg"
                    className="w-full"
                  >
                    <a href={rec.link} target="_blank" rel="noopener noreferrer">
                      Start with {rec.title.split(' - ')[0]}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                ))}
              </div>
              <Button 
                onClick={onRestart} 
                variant="outline" 
                className="mt-6"
              >
                Take Assessment Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};