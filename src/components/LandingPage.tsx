import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Heart, Brain, Zap, Shield } from "lucide-react";
import heroImage from "@/assets/hero-longevity.jpg";

interface LandingPageProps {
  onStartQuiz: () => void;
}

export const LandingPage = ({ onStartQuiz }: LandingPageProps) => {
  const benefits = [
    {
      icon: <Heart className="w-6 h-6 text-vitality" />,
      title: "Sleep Quality Assessment",
      description: "Evaluate your sleep patterns and recovery"
    },
    {
      icon: <Brain className="w-6 h-6 text-wellness" />,
      title: "Dietary Analysis", 
      description: "Comprehensive nutrition and supplement review"
    },
    {
      icon: <Zap className="w-6 h-6 text-energy" />,
      title: "Energy & Exercise",
      description: "Physical activity and vitality evaluation"
    },
    {
      icon: <Shield className="w-6 h-6 text-calm" />,
      title: "Stress Management",
      description: "Mental wellness and stress level analysis"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "This quiz opened my eyes to areas I never considered. My energy levels have improved dramatically!",
      score: "Vitality Score: 87"
    },
    {
      name: "Mike R.", 
      text: "The personalized recommendations transformed my health approach. Highly recommend!",
      score: "Vitality Score: 92"
    },
    {
      name: "Lisa K.",
      text: "Finally, a holistic assessment that considers everything. The supplement recommendations were spot-on.",
      score: "Vitality Score: 89"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Longevity and wellness" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              What's Your{" "}
              <span className="bg-gradient-to-r from-primary-glow to-wellness bg-clip-text text-transparent">
                Longevity Score?
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Discover your biological vitality through our comprehensive assessment covering sleep, diet, supplements, exercise, and stress management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={onStartQuiz}
                variant="hero" 
                size="lg"
                className="px-12 py-6 text-xl animate-glow"
              >
                Take Your Free Assessment
              </Button>
              <p className="text-primary-foreground/80 text-sm">
                ✨ Takes only 3-5 minutes • Get instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Your Complete Vitality Assessment
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our scientifically-backed assessment evaluates the key pillars of longevity to give you a comprehensive vitality score and personalized recommendations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-vitality transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-gradient-vitality">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* What You'll Get Section */}
          <div className="bg-gradient-to-r from-vitality/10 to-wellness/10 rounded-2xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-center text-foreground mb-8">
              What You'll Discover
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-vitality mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Your Biological Vitality Score</h4>
                    <p className="text-muted-foreground">A comprehensive score reflecting your overall health status</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-vitality mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Personalized Diet Recommendations</h4>
                    <p className="text-muted-foreground">Ketogenic or Paleo diet guidance based on your profile</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-vitality mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Targeted Supplement Protocol</h4>
                    <p className="text-muted-foreground">Science-backed supplements for your specific needs</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-vitality mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Lifestyle Optimization Plan</h4>
                    <p className="text-muted-foreground">Actionable steps to enhance your longevity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-vitality mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Expert Resources & Links</h4>
                    <p className="text-muted-foreground">Access to proven health and wellness solutions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-vitality mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Detailed Health Analysis</h4>
                    <p className="text-muted-foreground">Comprehensive breakdown of your results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-wellness transition-all duration-300">
                <CardContent className="p-0">
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-vitality font-medium">{testimonial.score}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Unlock Your Longevity Potential?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands who have discovered their path to optimal health and vitality. Your comprehensive assessment awaits.
          </p>
          <Button 
            onClick={onStartQuiz}
            variant="hero"
            size="lg" 
            className="px-12 py-6 text-xl animate-glow"
          >
            Start Your Assessment Now
          </Button>
          <p className="text-primary-foreground/70 text-sm mt-4">
            100% Free • No Hidden Costs • Instant Results
          </p>
        </div>
      </section>
    </div>
  );
};