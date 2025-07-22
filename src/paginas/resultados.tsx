import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Tooltip, RadioGroup, Radio, Chip, Badge, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

// Types
interface QuizQuestion {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  options?: string[];
  hint?: string;
}

// Quiz Data
const quizData: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    correctAnswer: "Paris",
    userAnswer: "Paris",
    explanation: "Paris is the capital and most populous city of France, known for its iconic landmarks like the Eiffel Tower and the Louvre Museum.",
    options: ["London", "Berlin", "Paris", "Madrid"],
    hint: "This city is known as the 'City of Light'."
  },
  {
    question: "Which planet is known as the Red Planet?",
    correctAnswer: "Mars",
    userAnswer: "Venus",
    explanation: "Mars is often called the Red Planet due to its reddish appearance caused by iron oxide (rust) on its surface.",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    hint: "It's named after the Roman god of war."
  },
  {
    question: "Who painted the Mona Lisa?",
    correctAnswer: "Leonardo da Vinci",
    userAnswer: "Leonardo da Vinci",
    explanation: "The Mona Lisa is a famous Renaissance painting created by Italian artist Leonardo da Vinci in the early 16th century.",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    hint: "This Italian polymath was also known for his inventions and scientific studies."
  },
  {
    question: "What is the largest mammal in the world?",
    correctAnswer: "Blue Whale",
    userAnswer: "Elephant",
    explanation: "The Blue Whale is the largest animal known to have ever existed, reaching lengths of up to 100 feet and weighing up to 200 tons.",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    hint: "It lives in the ocean."
  }
];

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Icon icon="lucide:layout" className="h-6 w-6 text-blue-500 mr-2" />
            <span className="font-bold text-xl">QuizApp</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Home
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Quiz
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Results
            </a>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Quiz Summary Component
const QuizSummary: React.FC<{ totalQuestions: number; correctAnswers: number }> = ({ totalQuestions, correctAnswers }) => {
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <>
      <p className="text-foreground-500">
        You got {correctAnswers} out of {totalQuestions} questions correct!
      </p>
      <div className="flex items-center gap-2">
        <Badge color="success" variant="flat">
          Score: {score}%
        </Badge>
        {correctAnswers === totalQuestions && (
          <Badge color="primary" variant="flat">
            <Icon icon="lucide:award" className="mr-1" />
            Perfect Score!
          </Badge>
        )}
      </div>
    </>
  );
};

// Quiz Result Component
const QuizResult: React.FC<{ question: QuizQuestion; questionNumber: number }> = ({ question, questionNumber }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const isCorrect = question.userAnswer === question.correctAnswer;

  return (
    <Card className="mb-4 last:mb-0">
      <CardBody>
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Question {questionNumber}</h2>
          {isCorrect ? (
            <Chip color="success" variant="flat">Correct</Chip>
          ) : (
            <Chip color="danger" variant="flat">Incorrect</Chip>
          )}
        </div>
        <p className="text-foreground-700 mb-4">{question.question}</p>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground-600">Your answer:</span>
            <span className={isCorrect ? "text-success" : "text-danger"}>{question.userAnswer}</span>
          </div>
          {!isCorrect && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground-600">Correct answer:</span>
              <span className="text-success">{question.correctAnswer}</span>
            </div>
          )}
        </div>
        {isCorrect ? (
          <p className="text-success flex items-center gap-2">
            <Icon icon="lucide:check-circle" />
            Congratulations! Your answer is correct.
          </p>
        ) : (
          <div>
            <Button
              color="primary"
              variant="flat"
              onPress={() => setShowExplanation(!showExplanation)}
              endContent={<Icon icon={showExplanation ? "lucide:chevron-up" : "lucide:chevron-down"} />}
            >
              {showExplanation ? "Hide" : "Show"} Explanation
            </Button>
            {showExplanation && (
              <div className="mt-4 p-4 bg-content2 rounded-medium">
                <p className="text-foreground-700">{question.explanation}</p>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

// Quiz Results Page Component
const QuizResultsPage: React.FC = () => {
  const totalQuestions = quizData.length;
  const correctAnswers = quizData.filter(q => q.userAnswer === q.correctAnswer).length;

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Quiz Results</h1>
          <QuizSummary totalQuestions={totalQuestions} correctAnswers={correctAnswers} />
        </CardHeader>
        <Divider />
        <CardBody>
          {quizData.map((question, index) => (
            <QuizResult key={index} question={question} questionNumber={index + 1} />
          ))}
          <div className="mt-6 flex justify-center">
            <Button
              color="primary"
              endContent={<Icon icon="lucide:arrow-right" />}
              onPress={() => console.log("Navigate to dashboard")}
            >
              Return to Dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Main App Component
const Resultados: React.FC = () => {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {showResults ? (
        <QuizResultsPage />
      ) : (
        <div className="flex-grow flex items-center justify-center p-4">
          <Button color="primary" onPress={() => setShowResults(true)}>
            Show Quiz Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default Resultados;