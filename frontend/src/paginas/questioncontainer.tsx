import React, { useState } from 'react';
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

interface QuizResult {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  options?: string[];
  hint?: string;
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
  ]
};

const explanationsByTopic: Record<string, Record<string, string>> = {
  inecuaciones: {
    "x > 4": "Para resolver x + 3 > 7, restamos 3 a ambos lados: x > 7 - 3 → x > 4",
    "x ≤ 4": "Para resolver 2x - 5 ≤ 3: 1) Sumamos 5: 2x ≤ 8, 2) Dividimos por 2: x ≤ 4",
    "x < 2 o x > 3": "Factorizamos x² - 5x + 6 = (x-2)(x-3) > 0. Solución: x < 2 o x > 3",
    "-2 < x < 8": "La desigualdad |x - 3| < 5 equivale a -5 < x - 3 < 5 → -2 < x < 8",
    "x ≤ -2 o x ≥ 1": "Los puntos críticos son x = -2 y x = 1. Probando intervalos: solución x ≤ -2 o x ≥ 1"
  },
  derivadas: {
    "2x": "La derivada de x² es 2x por la regla de la potencia: d/dx(xⁿ) = n·xⁿ⁻¹",
    "cos(x)": "La derivada de sin(x) es cos(x), una de las derivadas trigonométricas básicas",
    "1/x": "La derivada de ln(x) es 1/x, una de las derivadas logarítmicas fundamentales",
    "eˣ(cos(x) - sin(x))": "Aplicamos la regla del producto: d/dx(eˣcos(x)) = eˣcos(x) - eˣsin(x) = eˣ(cos(x) - sin(x))",
    "-x/y": "Derivando implícitamente: 2y dy/dx + 2x = 0 → dy/dx = -2x/(2y) = -x/y"
  },
  matrices: {
    "[[6,8],[10,12]]": "Suma elemento por elemento: 1+5=6, 2+6=8, 3+7=10, 4+8=12",
    "ad - bc": "El determinante de [[a,b],[c,d]] se calcula como ad - bc",
    "Multiplicación": "Para multiplicar matrices A×B, el número de columnas de A debe igualar filas de B",
    "[[-2,1],[1.5,-0.5]]": "Inversa de [[a,b],[c,d]] es (1/det)[[d,-b],[-c,a]]. Aquí det = -2",
    "Número de filas linealmente independientes": "El rango es la dimensión del espacio generado por las filas/columnas"
  }
};

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

// Custom Hook
const useQuizState = (questions: Question[], topic: string) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const navigate = useNavigate();

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowHint(false);
      } else {
        finishQuiz();
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
    const quizResults: QuizResult[] = questions.map((q, index) => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      userAnswer: answers[index] || "No respondida",
      explanation: explanationsByTopic[topic]?.[q.correctAnswer] || "Explicación no disponible",
      options: q.options,
      hint: q.hint
    }));

    navigate('/resultados', { 
      state: { 
        results: quizResults,
        topic: topic
      } 
    });
  };

  return {
    currentQuestion,
    selectedAnswer,
    showHint,
    answers,
    handleNextQuestion,
    handlePreviousQuestion,
    handleQuestionSelect,
    setSelectedAnswer,
    toggleHint,
    finishQuiz,
  };
};

// Main Quiz Container Component
const QuizContainer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'inecuaciones';
  const questions = questionsByTopic[topic] || questionsByTopic.inecuaciones;

  const {
    currentQuestion,
    selectedAnswer,
    showHint,
    answers,
    handleNextQuestion,
    handlePreviousQuestion,
    handleQuestionSelect,
    setSelectedAnswer,
    toggleHint,
    finishQuiz,
  } = useQuizState(questions, topic);

  const quizTitles: Record<string, string> = {
    inecuaciones: "Inecuaciones",
    derivadas: "Derivadas",
    matrices: "Matrices",
  };

  const quizTitle = quizTitles[topic] || topic;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">Quiz de {quizTitle}</h1>
            <QuestionNavigation
              questions={questions}
              currentQuestion={currentQuestion}
              onQuestionSelect={handleQuestionSelect}
              answers={answers}
            />
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default QuizContainer;