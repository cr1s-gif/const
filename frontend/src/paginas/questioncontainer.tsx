import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, RadioGroup, Radio, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkAPIHealth, generateMathQuestions as fetchQuestions, generateMathQuestions } from '../services/apiService';

// Definir la interfaz GeneratedQuestion
export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
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

const QuestionNavigation = ({ questions, currentQuestion, onQuestionSelect, answers }: {
  questions: GeneratedQuestion[];
  currentQuestion: number;
  onQuestionSelect: (index: number) => void;
  answers: Record<number, string>;
}) => (
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

const QuizQuestion = ({ question, selectedAnswer, setSelectedAnswer, showHint }: {
  question: GeneratedQuestion;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
  showHint: boolean;
}) => (
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
            <Radio value={option}>
              <span className="ml-2">{option}</span>
            </Radio>
          </CardBody>
        </Card>
      ))}
    </RadioGroup>
    {showHint && (
      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-700 italic">💡 Pista: {question.hint}</p>
      </div>
    )}
  </div>
);

const QuizControls = ({
  currentQuestion,
  totalQuestions,
  showHint,
  selectedAnswer,
  onPreviousQuestion,
  onNextQuestion,
  onToggleHint,
  onFinishQuiz
}: {
  currentQuestion: number;
  totalQuestions: number;
  showHint: boolean;
  selectedAnswer: string | null;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onToggleHint: () => void;
  onFinishQuiz: () => void;
}) => (
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
      <Button
        isIconOnly
        variant="flat"
        onPress={onPreviousQuestion}
        isDisabled={currentQuestion === 0}
      >
        <Icon icon="lucide:chevron-left" />
      </Button>
      {currentQuestion === totalQuestions - 1 ? (
        <Button 
          color="success" 
          onPress={onFinishQuiz}
          isDisabled={!selectedAnswer}
          endContent={<Icon icon="lucide:check-circle" />}
        >
          Finalizar
        </Button>
      ) : (
        <Button
          isIconOnly
          variant="flat"
          onPress={onNextQuestion}
          isDisabled={!selectedAnswer}
        >
          <Icon icon="lucide:chevron-right" />
        </Button>
      )}
    </div>
  </div>
);

const useQuizState = (questions: GeneratedQuestion[], topic: string) => {
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

  const finishQuiz = () => {
    const results: QuizResult[] = questions.map((q, i) => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      userAnswer: answers[i] || "No respondida",
      explanation: q.explanation,
      options: q.options,
      hint: q.hint
    }));
    navigate('/resultados', { state: { results, topic } });
  };

  return {
    currentQuestion,
    selectedAnswer,
    showHint,
    answers,
    handleNextQuestion,
    handlePreviousQuestion: () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedAnswer(answers[currentQuestion - 1] || null);
        setShowHint(false);
      }
    },
    handleQuestionSelect: (index: number) => {
      setCurrentQuestion(index);
      setSelectedAnswer(answers[index] || null);
      setShowHint(false);
    },
    setSelectedAnswer,
    toggleHint: () => setShowHint(!showHint),
    finishQuiz
  };
};

const QuizContainer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'matematicas';
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

// En QuizContainer.tsx, dentro del useEffect principal
useEffect(() => {
  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verificar primero que el backend esté disponible
      const isHealthy = await checkAPIHealth();
      if (!isHealthy) {
        throw new Error('El servidor de preguntas no está disponible');
      }

      // Mostrar progreso de carga
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 1000);

      // Llamada al backend para generar preguntas
      const generatedQuestions = await generateMathQuestions(topic, 5);
      setQuestions(generatedQuestions);
      
      clearInterval(interval);
      setProgress(100);
    } catch (err) {
      console.error("Error al generar preguntas:", err);
      setError(`Error al generar preguntas: ${(err as Error).message}`);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadQuestions();
}, [topic]);

  const quizTitle = topic.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4 p-4">
          <Icon icon="svg-spinners:bars-scale" className="w-16 h-16 text-blue-500" />
          <h2 className="text-xl font-semibold text-center">
            Generando preguntas sobre {quizTitle} con IA
          </h2>
          <Progress
            value={progress}
            size="sm"
            className="max-w-md w-full"
            aria-label="Cargando modelo de IA..."
          />
          <p className="text-sm text-gray-500">
            Esto puede tomar unos momentos la primera vez...
          </p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <Icon icon="ion:warning" className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">
              Error al generar el quiz
            </h2>
            <p className="mb-4">
              {error || "No se pudieron generar preguntas para este tema."}
            </p>
            <div className="flex justify-center gap-3">
              <Button 
                color="primary"
                onPress={() => window.location.reload()}
                startContent={<Icon icon="lucide:refresh-ccw" />}
              >
                Recargar
              </Button>
              <Button 
                variant="flat"
                onPress={() => window.location.href = '/'}
              >
                Volver al inicio
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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