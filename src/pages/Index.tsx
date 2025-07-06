import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { QuizForm, QuizData } from "@/components/QuizForm";
import { ResultsPage } from "@/components/ResultsPage";

type AppState = "landing" | "quiz" | "results";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const handleStartQuiz = () => {
    setCurrentState("quiz");
  };

  const handleQuizComplete = (data: QuizData) => {
    setQuizData(data);
    setCurrentState("results");
  };

  const handleBackToLanding = () => {
    setCurrentState("landing");
  };

  const handleRestart = () => {
    setQuizData(null);
    setCurrentState("landing");
  };

  if (currentState === "landing") {
    return <LandingPage onStartQuiz={handleStartQuiz} />;
  }

  if (currentState === "quiz") {
    return (
      <QuizForm 
        onComplete={handleQuizComplete} 
        onBack={handleBackToLanding}
      />
    );
  }

  if (currentState === "results" && quizData) {
    return (
      <ResultsPage 
        quizData={quizData} 
        onRestart={handleRestart}
      />
    );
  }

  return <LandingPage onStartQuiz={handleStartQuiz} />;
};

export default Index;
