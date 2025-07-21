import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, RadioGroup, Radio, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

// Types
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

// Questions Data
const questions: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    hint: "This city is known as the 'City of Light'.",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    hint: "It's named after the Roman god of war.",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    hint: "This Italian polymath was also known for his inventions and scientific studies.",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean",
    hint: "It covers more than 30% of the Earth's surface.",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Silver", "Oxygen", "Iron"],
    correctAnswer: "Oxygen",
    hint: "It's essential for human respiration.",
  },
];

// Question Navigation Component
const QuestionNavigation: React.FC<{
  questions: Question[];
  currentQuestion: number;
  onQuestionSelect: (index: number) => void;
}> = ({ questions, currentQuestion, onQuestionSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {questions.map((_, index) => (
        <Button
          key={index}
          size="sm"
          variant={currentQuestion === index ? "solid" : "flat"}
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
        className="grid grid-cols-2 gap-4"
      >
        {question.options.map((option, index) => (
          <Card key={index} isPressable>
            <CardBody className="p-3">
              <Radio value={option} className="w-full">
                {option}
              </Radio>
            </CardBody>
          </Card>
        ))}
      </RadioGroup>
      {showHint && (
        <p className="text-sm text-foreground-500 italic">Hint: {question.hint}</p>
      )}
    </div>
  );
};

// Quiz Controls Component
const QuizControls: React.FC<{
  currentQuestion: number;
  totalQuestions: number;
  showHint: boolean;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onToggleHint: () => void;
}> = ({
  currentQuestion,
  totalQuestions,
  showHint,
  onPreviousQuestion,
  onNextQuestion,
  onToggleHint,
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="flat"
        onPress={onToggleHint}
        color={showHint ? "primary" : "default"}
      >
        <Icon icon="lucide:help-circle" className="mr-2" />
        {showHint ? "Hide Hint" : "Show Hint"}
      </Button>
      <div className="flex gap-2">
        <Tooltip content="Previous Question">
          <Button
            isIconOnly
            variant="flat"
            onPress={onPreviousQuestion}
            isDisabled={currentQuestion === 0}
          >
            <Icon icon="lucide:chevron-left" />
          </Button>
        </Tooltip>
        <Tooltip content="Next Question">
          <Button
            isIconOnly
            variant="flat"
            onPress={onNextQuestion}
            isDisabled={currentQuestion === totalQuestions - 1}
          >
            <Icon icon="lucide:chevron-right" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

// Custom Hook
const useQuizState = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowHint(false);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(null);
    setShowHint(false);
  };

  const toggleHint = () => setShowHint(!showHint);

  return {
    currentQuestion,
    selectedAnswer,
    showHint,
    handleNextQuestion,
    handlePreviousQuestion,
    handleQuestionSelect,
    setSelectedAnswer,
    toggleHint,
  };
};

// Main Quiz Container Component
const QuizContainer: React.FC = () => {
  const {
    currentQuestion,
    selectedAnswer,
    showHint,
    handleQuestionSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    setSelectedAnswer,
    toggleHint,
  } = useQuizState();

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Quiz App</h1>
        <QuestionNavigation
          questions={questions}
          currentQuestion={currentQuestion}
          onQuestionSelect={handleQuestionSelect}
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
          onPreviousQuestion={handlePreviousQuestion}
          onNextQuestion={handleNextQuestion}
          onToggleHint={toggleHint}
        />
      </CardBody>
    </Card>
  );
};

export default QuizContainer;