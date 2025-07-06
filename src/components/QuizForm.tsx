import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface QuizData {
  firstName: string;
  lastName: string;
  email: string;
  answers: Record<string, any>;
}

interface QuizFormProps {
  onComplete: (data: QuizData) => void;
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "yes-no" | "scale" | "multiple-select";
  options?: string[];
  category: "sleep" | "diet" | "exercise" | "stress" | "supplements" | "health";
}

const questions: Question[] = [
  {
    id: "sleep_quality",
    question: "How would you rate your overall sleep quality?",
    type: "multiple-choice",
    options: ["Excellent (8+ hours, wake refreshed)", "Good (7-8 hours, mostly refreshed)", "Fair (6-7 hours, sometimes tired)", "Poor (Less than 6 hours, often tired)"],
    category: "sleep"
  },
  {
    id: "sleep_schedule",
    question: "Do you maintain a consistent sleep schedule?",
    type: "yes-no",
    category: "sleep"
  },
  {
    id: "diet_style",
    question: "Which best describes your current diet?",
    type: "multiple-choice", 
    options: ["Standard Western Diet", "Mediterranean", "Low-carb/Keto", "Paleo", "Vegetarian/Vegan", "Intermittent Fasting"],
    category: "diet"
  },
  {
    id: "processed_foods",
    question: "How often do you consume processed foods?",
    type: "multiple-choice",
    options: ["Rarely (1-2 times per week)", "Sometimes (3-4 times per week)", "Often (5-6 times per week)", "Daily or multiple times daily"],
    category: "diet"
  },
  {
    id: "hydration",
    question: "How many glasses of water do you drink daily?",
    type: "multiple-choice",
    options: ["8+ glasses", "6-7 glasses", "4-5 glasses", "Less than 4 glasses"],
    category: "diet"
  },
  {
    id: "exercise_frequency",
    question: "How often do you engage in physical exercise?",
    type: "multiple-choice",
    options: ["5+ times per week", "3-4 times per week", "1-2 times per week", "Rarely or never"],
    category: "exercise"
  },
  {
    id: "exercise_intensity",
    question: "What intensity of exercise do you typically do?",
    type: "multiple-choice",
    options: ["High intensity (HIIT, competitive sports)", "Moderate intensity (jogging, cycling)", "Light intensity (walking, yoga)", "Minimal physical activity"],
    category: "exercise"
  },
  {
    id: "stress_level",
    question: "How would you rate your daily stress levels?",
    type: "scale",
    category: "stress"
  },
  {
    id: "stress_management",
    question: "Do you practice stress management techniques?",
    type: "multiple-choice",
    options: ["Yes, regularly (meditation, yoga, etc.)", "Sometimes (occasional relaxation)", "Rarely (only when very stressed)", "No, I don't have time"],
    category: "stress"
  },
  {
    id: "current_supplements",
    question: "Do you currently take any supplements?",
    type: "yes-no",
    category: "supplements"
  },
  {
    id: "supplement_types",
    question: "Which supplements do you currently take? (Select all that apply)",
    type: "multiple-select",
    options: ["Multivitamin", "Vitamin D", "Omega-3", "Probiotics", "Magnesium", "B-Complex", "Vitamin C", "None"],
    category: "supplements"
  },
  {
    id: "health_symptoms",
    question: "Do you experience any of the following? (Select all that apply)",
    type: "multiple-select", 
    options: ["Joint pain or stiffness", "Chronic fatigue or low energy", "Lack of motivation or energy", "Ear ringing (tinnitus)", "None of the above"],
    category: "health"
  },
  {
    id: "gut_skin_issues",
    question: "Are you experiencing health issues with your gut or skin?",
    type: "yes-no",
    category: "health"
  },
  {
    id: "energy_levels",
    question: "How are your energy levels throughout the day?",
    type: "multiple-choice",
    options: ["Consistently high energy", "Good energy with minor dips", "Moderate energy with afternoon crashes", "Low energy most of the day"],
    category: "health"
  },
  {
    id: "mental_clarity",
    question: "How would you rate your mental clarity and focus?",
    type: "multiple-choice",
    options: ["Excellent focus and sharp thinking", "Good focus with occasional brain fog", "Moderate focus with frequent distractions", "Poor focus and frequent brain fog"],
    category: "health"
  }
];

export const QuizForm = ({ onComplete, onBack }: QuizFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuizData>({
    firstName: "",
    lastName: "", 
    email: "",
    answers: {}
  });
  const [showEmailForm, setShowEmailForm] = useState(false);

  const totalSteps = questions.length + 1; // +1 for name collection
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNameSubmit = () => {
    if (!formData.firstName.trim()) return;
    setCurrentStep(1);
  };

  const handleAnswerSelect = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowEmailForm(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleEmailSubmit = () => {
    if (!formData.email.trim()) return;
    onComplete(formData);
  };

  const isCurrentAnswered = () => {
    if (currentStep === 0) return formData.firstName.trim();
    const currentQuestion = questions[currentStep - 1];
    return formData.answers[currentQuestion.id] !== undefined;
  };

  if (showEmailForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-vitality mb-2">Almost Done! 🎉</CardTitle>
            <p className="text-muted-foreground">
              Enter your email to receive your personalized Longevity Score and recommendations.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
            <Button 
              onClick={handleEmailSubmit} 
              variant="vitality" 
              className="w-full"
              disabled={!formData.email.trim()}
            >
              Get My Longevity Score
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy. Your email will only be used to send you your results.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{currentStep + 1} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            {currentStep === 0 ? (
              // Name Collection Step
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Welcome to Your Longevity Assessment
                  </h2>
                  <p className="text-muted-foreground">
                    Let's start by getting to know you better
                  </p>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name (Optional)</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleNameSubmit} 
                    variant="vitality"
                    disabled={!formData.firstName.trim()}
                  >
                    Start Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              // Quiz Questions
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Hi {formData.firstName}! 👋
                  </h2>
                  <p className="text-muted-foreground capitalize">
                    {questions[currentStep - 1].category} Assessment
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-center text-foreground">
                    {questions[currentStep - 1].question}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentStep - 1].type === "yes-no" && (
                      <div className="grid grid-cols-2 gap-4">
                        {["Yes", "No"].map((option) => (
                          <Button
                            key={option}
                            variant={formData.answers[questions[currentStep - 1].id] === option ? "vitality" : "quiz"}
                            onClick={() => handleAnswerSelect(questions[currentStep - 1].id, option)}
                            className="p-4 text-left justify-start"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}

                    {questions[currentStep - 1].type === "multiple-choice" && (
                      <div className="space-y-3">
                        {questions[currentStep - 1].options?.map((option, index) => (
                          <Button
                            key={index}
                            variant={formData.answers[questions[currentStep - 1].id] === option ? "vitality" : "quiz"}
                            onClick={() => handleAnswerSelect(questions[currentStep - 1].id, option)}
                            className="w-full p-4 text-left justify-start h-auto whitespace-normal"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}

                    {questions[currentStep - 1].type === "multiple-select" && (
                      <div className="space-y-3">
                        {questions[currentStep - 1].options?.map((option, index) => {
                          const currentAnswers = formData.answers[questions[currentStep - 1].id] || [];
                          const isSelected = currentAnswers.includes(option);
                          return (
                            <Button
                              key={index}
                              variant={isSelected ? "vitality" : "quiz"}
                              onClick={() => {
                                const currentAnswers = formData.answers[questions[currentStep - 1].id] || [];
                                const newAnswers = isSelected 
                                  ? currentAnswers.filter((a: string) => a !== option)
                                  : [...currentAnswers, option];
                                handleAnswerSelect(questions[currentStep - 1].id, newAnswers);
                              }}
                              className="w-full p-4 text-left justify-start h-auto whitespace-normal"
                            >
                              {option}
                            </Button>
                          );
                        })}
                      </div>
                    )}

                    {questions[currentStep - 1].type === "scale" && (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Low Stress</span>
                          <span>High Stress</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Button
                              key={value}
                              variant={formData.answers[questions[currentStep - 1].id] === value ? "vitality" : "quiz"}
                              onClick={() => handleAnswerSelect(questions[currentStep - 1].id, value)}
                              className="aspect-square"
                            >
                              {value}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button onClick={handlePrevious} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    variant="vitality"
                    disabled={!isCurrentAnswered()}
                  >
                    {currentStep === questions.length ? "Get Results" : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};