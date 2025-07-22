import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, RadioGroup, Radio, Tooltip, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from 'react-router-dom';

// Types
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

// Questions Data por tema
const questionsByTopic: Record<string, Question[]> = {
  inecuaciones: [
    {
      question: "¿Cuál es la solución de x + 3 > 7?",
      options: ["x > 4", "x < 4", "x > 10", "x < 10"],
      correctAnswer: "x > 4",
      hint: "Resta 3 a ambos lados de la desigualdad.",
    },
    {
      question: "Resuelve 2x - 5 ≤ 3",
      options: ["x ≤ 4", "x ≥ 4", "x ≤ -1", "x ≥ -1"],
      correctAnswer: "x ≤ 4",
      hint: "Suma 5 a ambos lados primero, luego divide por 2.",
    },
    {
      question: "¿Para qué valores de x se cumple x² - 5x + 6 > 0?",
      options: ["x < 2 o x > 3", "2 < x < 3", "x > 3", "x < 2"],
      correctAnswer: "x < 2 o x > 3",
      hint: "Factoriza el polinomio y analiza los intervalos.",
    },
    {
      question: "Solución de |x - 3| < 5",
      options: ["-2 < x < 8", "x < -2 o x > 8", "x < 8", "x > -2"],
      correctAnswer: "-2 < x < 8",
      hint: "Recuerda que |a| < b equivale a -b < a < b.",
    },
    {
      question: "¿Cuál es el conjunto solución de (x-1)/(x+2) ≥ 0?",
      options: ["x ≤ -2 o x ≥ 1", "-2 < x ≤ 1", "x ≥ 1", "x ≤ -2"],
      correctAnswer: "x ≤ -2 o x ≥ 1",
      hint: "Encuentra los puntos críticos y prueba los intervalos.",
    }
  ],
  derivadas: [
    {
      question: "¿Cuál es la derivada de f(x) = x²?",
      options: ["2x", "x", "2x²", "x³/3"],
      correctAnswer: "2x",
      hint: "Usa la regla de la potencia: d/dx(xⁿ) = n·xⁿ⁻¹",
    },
    {
      question: "Derivada de f(x) = sin(x)",
      options: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"],
      correctAnswer: "cos(x)",
      hint: "La derivada de sin(x) es cos(x).",
    },
    {
      question: "¿Cuál es la derivada de ln(x)?",
      options: ["1/x", "x", "eˣ", "1/x²"],
      correctAnswer: "1/x",
      hint: "La derivada del logaritmo natural es 1/x.",
    },
    {
      question: "Derivada de f(x) = eˣ cos(x)",
      options: ["eˣ(cos(x) - sin(x))", "eˣ(sin(x) - cos(x))", "eˣ(cos(x) + sin(x))", "-eˣ sin(x)"],
      correctAnswer: "eˣ(cos(x) - sin(x))",
      hint: "Usa la regla del producto y las derivadas básicas.",
    },
    {
      question: "Derivada implícita de y² + x² = 9",
      options: ["-x/y", "x/y", "-y/x", "2x + 2y"],
      correctAnswer: "-x/y",
      hint: "Deriva implícitamente y despeja dy/dx.",
    }
  ],
  matrices: [
    {
      question: "¿Cuál es el resultado de sumar [[1,2],[3,4]] + [[5,6],[7,8]]?",
      options: ["[[6,8],[10,12]]", "[[5,12],[21,32]]", "[[1,5],[3,7]]", "[[2,6],[4,8]]"],
      correctAnswer: "[[6,8],[10,12]]",
      hint: "Suma elemento por elemento.",
    },
    {
      question: "¿Cuál es el determinante de [[a,b],[c,d]]?",
      options: ["ad - bc", "ab - cd", "a + d", "b + c"],
      correctAnswer: "ad - bc",
      hint: "Fórmula para determinante 2x2.",
    },
    {
      question: "¿Qué operación no está definida para matrices de 2x3 y 2x3?",
      options: ["Suma", "Multiplicación", "Resta", "Transposición"],
      correctAnswer: "Multiplicación",
      hint: "Para multiplicar matrices, el número de columnas del primero debe igualar filas del segundo.",
    },
    {
      question: "¿Cuál es la inversa de [[1,2],[3,4]]?",
      options: ["[[-2,1],[1.5,-0.5]]", "[[4,-2],[-3,1]]", "[[0.5,1],[1.5,2]]", "No tiene inversa"],
      correctAnswer: "[[-2,1],[1.5,-0.5]]",
      hint: "Calcula el determinante y aplica la fórmula para inversa 2x2.",
    },
    {
      question: "¿Qué representa el rango de una matriz?",
      options: ["Número de filas linealmente independientes", "Número de columnas", "Dimensión de la matriz", "Traza de la matriz"],
      correctAnswer: "Número de filas linealmente independientes",
      hint: "El rango es la dimensión del espacio generado por sus filas o columnas.",
    }
  ],
  // Otros temas...
};

// Resultados del quiz
interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Icon icon="lucide:layout" className="h-6 w-6 text-blue-500 mr-2" />
            <span className="font-bold text-xl">LearningHub</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Inicio
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Progreso
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Perfil
            </a>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Mi cuenta
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Question Navigation Component
const QuestionNavigation: React.FC<{
  questions: Question[];
  currentQuestion: number;
  onQuestionSelect: (index: number) => void;
  answers: Record<number, string>;
}> = ({ questions, currentQuestion, onQuestionSelect, answers }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {questions.map((_, index) => (
        <Button
          key={index}
          size="sm"
          variant={currentQuestion === index ? "solid" : answers[index] ? "flat" : "bordered"}
          color={answers[index] ? "primary" : "default"}
          onPress={() => onQuestionSelect(index)}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  );
};

// Quiz Question Component
const QuizQuestion: React.FC<{
  question: Question;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
  showHint: boolean;
}> = ({ question, selectedAnswer, setSelectedAnswer, showHint }) => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold">{question.question}</h2>
        </CardBody>
      </Card>
      <RadioGroup
        value={selectedAnswer || ""}
        onValueChange={setSelectedAnswer}
        className="grid grid-cols-1 gap-4"
      >
        {question.options.map((option, index) => (
          <Card key={index} isPressable isHoverable>
            <CardBody className="p-4">
              <Radio value={option} className="w-full">
                <span className="ml-2">{option}</span>
              </Radio>
            </CardBody>
          </Card>
        ))}
      </RadioGroup>
      {showHint && (
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700 italic">💡 Hint: {question.hint}</p>
        </div>
      )}
    </div>
  );
};

// Quiz Controls Component
const QuizControls: React.FC<{
  currentQuestion: number;
  totalQuestions: number;
  showHint: boolean;
  selectedAnswer: string | null;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onToggleHint: () => void;
  onFinishQuiz: () => void;
}> = ({
  currentQuestion,
  totalQuestions,
  showHint,
  selectedAnswer,
  onPreviousQuestion,
  onNextQuestion,
  onToggleHint,
  onFinishQuiz,
}) => {
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="flat"
        onPress={onToggleHint}
        color={showHint ? "primary" : "default"}
        startContent={<Icon icon="lucide:help-circle" />}
      >
        {showHint ? "Ocultar pista" : "Mostrar pista"}
      </Button>
      <div className="flex gap-2">
        <Tooltip content="Pregunta anterior">
          <Button
            isIconOnly
            variant="flat"
            onPress={onPreviousQuestion}
            isDisabled={currentQuestion === 0}
          >
            <Icon icon="lucide:chevron-left" />
          </Button>
        </Tooltip>
        
        {isLastQuestion ? (
          <Button 
            color="success" 
            onPress={onFinishQuiz}
            isDisabled={!selectedAnswer}
            endContent={<Icon icon="lucide:check-circle" />}
          >
            Finalizar Quiz
          </Button>
        ) : (
          <Tooltip content="Siguiente pregunta">
            <Button
              isIconOnly
              variant="flat"
              onPress={onNextQuestion}
              isDisabled={!selectedAnswer}
            >
              <Icon icon="lucide:chevron-right" />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

// Results Component
const Results: React.FC<{
  result: QuizResult;
  onRestart: () => void;
  onReturnToDashboard: () => void;
}> = ({ result, onRestart, onReturnToDashboard }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Resultados del Quiz</h2>
        <Progress 
          size="lg" 
          value={result.score} 
          color="success" 
          className="max-w-md mb-4"
        />
        <p className="text-lg mb-2">
          Respuestas correctas: <span className="font-bold">{result.correctAnswers}/{result.totalQuestions}</span>
        </p>
        <p className="text-2xl font-bold text-success">
          Puntuación: {result.score}%
        </p>
      </div>
      <div className="flex gap-4 mt-4">
        <Button 
          color="primary" 
          variant="solid" 
          onPress={onRestart}
          startContent={<Icon icon="lucide:rotate-ccw" />}
        >
          Reintentar Quiz
        </Button>
        <Button 
          color="default" 
          variant="flat" 
          onPress={onReturnToDashboard}
          startContent={<Icon icon="lucide:layout-dashboard" />}
        >
          Volver al Dashboard
        </Button>
      </div>
    </div>
  );
};

// Custom Hook
const useQuizState = (questions: Question[]) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answers[currentQuestion + 1] || null);
        setShowHint(false);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      setShowHint(false);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index] || null);
    setShowHint(false);
  };

  const toggleHint = () => setShowHint(!showHint);

  const finishQuiz = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
    }
    
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    setQuizResult({
      totalQuestions: questions.length,
      correctAnswers: correct,
      score
    });
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowHint(false);
    setAnswers({});
    setShowResults(false);
    setQuizResult(null);
  };

  return {
    currentQuestion,
    selectedAnswer,
    showHint,
    showResults,
    quizResult,
    answers,
    handleNextQuestion,
    handlePreviousQuestion,
    handleQuestionSelect,
    setSelectedAnswer,
    toggleHint,
    finishQuiz,
    restartQuiz,
  };
};

// Main Quiz Container Component
const QuizContainer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'inecuaciones';
  const questions = questionsByTopic[topic] || questionsByTopic.inecuaciones;
  const navigate = useNavigate();

  const {
    currentQuestion,
    selectedAnswer,
    showHint,
    showResults,
    quizResult,
    answers,
    handleNextQuestion,
    handlePreviousQuestion,
    handleQuestionSelect,
    setSelectedAnswer,
    toggleHint,
    finishQuiz,
    restartQuiz,
  } = useQuizState(questions);

  const returnToDashboard = () => {
    navigate('/dashboard');
  };

  // Establecer título del quiz basado en el tema
  const quizTitles: Record<string, string> = {
    inecuaciones: "Inecuaciones",
    derivadas: "Derivadas",
    matrices: "Matrices",
    // Agrega más títulos según los temas
  };

  const quizTitle = quizTitles[topic] || topic;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">Quiz de {quizTitle}</h1>
            {!showResults && (
              <QuestionNavigation
                questions={questions}
                currentQuestion={currentQuestion}
                onQuestionSelect={handleQuestionSelect}
                answers={answers}
              />
            )}
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            {!showResults ? (
              <>
                <QuizQuestion
                  question={questions[currentQuestion]}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                  showHint={showHint}
                />
                <QuizControls
                  currentQuestion={currentQuestion}
                  totalQuestions={questions.length}
                  showHint={showHint}
                  selectedAnswer={selectedAnswer}
                  onPreviousQuestion={handlePreviousQuestion}
                  onNextQuestion={handleNextQuestion}
                  onToggleHint={toggleHint}
                  onFinishQuiz={finishQuiz}
                />
              </>
            ) : (
              quizResult && (
                <Results
                  result={quizResult}
                  onRestart={restartQuiz}
                  onReturnToDashboard={returnToDashboard}
                />
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default QuizContainer;