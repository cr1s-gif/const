import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Badge, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from 'react-router-dom';

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  options?: string[];
  hint?: string;
}

interface ResultsState {
  results: QuizQuestion[];
  topic: string;
}

const QuizResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], topic = '' } = (location.state || {}) as ResultsState;
  
  const totalQuestions = results.length;
  const correctAnswers = results.filter(q => q.userAnswer === q.correctAnswer).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const returnToDashboard = () => {
    navigate('/dashboard');
  };

  const restartQuiz = () => {
    navigate(`/quizcontainer?topic=${topic}`);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Resultados del Quiz: {topic}</h1>
          <div className="flex flex-col gap-2">
            <p className="text-foreground-500">
              Respondiste correctamente {correctAnswers} de {totalQuestions} preguntas
            </p>
            <div className="flex items-center gap-4">
              <Badge color="success" variant="flat">
                Puntuación: {score}%
              </Badge>
              {correctAnswers === totalQuestions && (
                <Badge color="primary" variant="flat">
                  <Icon icon="lucide:award" className="mr-1" />
                  ¡Perfecto!
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {results.map((question, index) => {
            const isCorrect = question.userAnswer === question.correctAnswer;
            
            return (
              <Card key={index} className="border border-default-200">
                <CardBody>
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold">Pregunta {index + 1}</h2>
                    {isCorrect ? (
                      <Chip color="success" variant="flat">Correcta</Chip>
                    ) : (
                      <Chip color="danger" variant="flat">Incorrecta</Chip>
                    )}
                  </div>
                  
                  <p className="text-foreground-700 mb-3">{question.question}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className={`p-3 rounded-medium ${isCorrect ? 'bg-success-50' : 'bg-danger-50'}`}>
                      <p className="text-sm font-medium text-foreground-500">Tu respuesta:</p>
                      <p className={isCorrect ? 'text-success-600' : 'text-danger-600'}>
                        {question.userAnswer}
                      </p>
                    </div>
                    
                    {!isCorrect && (
                      <div className="p-3 rounded-medium bg-success-50">
                        <p className="text-sm font-medium text-foreground-500">Respuesta correcta:</p>
                        <p className="text-success-600">{question.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 rounded-medium bg-content2">
                    <p className="text-sm font-medium text-foreground-500 mb-2">Explicación:</p>
                    <p className="text-foreground-700">{question.explanation}</p>
                    {question.hint && (
                      <p className="text-sm text-foreground-500 mt-2 italic">💡 Pista: {question.hint}</p>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Button 
              color="primary" 
              variant="solid" 
              onPress={restartQuiz}
              startContent={<Icon icon="lucide:rotate-ccw" />}
            >
              Reintentar Quiz
            </Button>
            <Button 
              color="default" 
              variant="flat" 
              onPress={returnToDashboard}
              startContent={<Icon icon="lucide:layout-dashboard" />}
            >
              Volver al Dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const Resultados: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <QuizResultsPage />
    </div>
  );
};

export default Resultados;