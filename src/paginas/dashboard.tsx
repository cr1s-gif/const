import React, { ReactNode, useState } from "react";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

// Definición de tipos TypeScript
type ModalOption = {
  id: string;
  title: string;
  content: string;
};

type CardOption = {
  id: string;
  title: string;
  description: string;
  modals?: ModalOption[];
  quizTopic?: string;
};

type SidebarOption = {
  id: string;
  name: string;
  icon: string;
  cards: CardOption[];
};

type DashboardData = {
  sidebarOptions: SidebarOption[];
};

// Datos del dashboard
const dashboardData: DashboardData = {
  sidebarOptions: [
    {
      id: "calculo",
      name: "Calculo",
      icon: "lucide:home",
      cards: [
        {
          id: "inecuaciones",
          title: "Inecuaciones",
          description: "Ejercicios de inecuaciones",
          quizTopic: "inecuaciones"
        },
        {
          id: "derivadas",
          title: "Derivadas",
          description: "Ejercicios de derivadas",
          quizTopic: "derivadas"
        },
        {
          id: "integrales",
          title: "Integrales",
          description: "Ejercicios de integrales",
          quizTopic: "integrales"
        }
      ]
    },
    {
      id: "algebra",
      name: "Algebra",
      icon: "lucide:bar-chart",
      cards: [
        {
          id: "matrices",
          title: "Matrices",
          description: "Ejercicios de matrices",
          quizTopic: "matrices"
        },
        {
          id: "vectores",
          title: "Vectores",
          description: "Ejercicios de vectores",
          quizTopic: "vectores"
        }
      ]
    },
    {
      id: "fisica",
      name: "Fisica",
      icon: "lucide:users",
      cards: [
        {
          id: "cinematica",
          title: "Cinemática",
          description: "Ejercicios de cinemática",
          quizTopic: "cinematica"
        },
        {
          id: "dinamica",
          title: "Dinámica",
          description: "Ejercicios de dinámica",
          quizTopic: "dinamica"
        }
      ]
    },
    {
      id: "programacion",
      name: "Programacion",
      icon: "lucide:settings",
      cards: [
        {
          id: "react",
          title: "React",
          description: "Ejercicios de React",
          quizTopic: "react"
        },
        {
          id: "typescript",
          title: "TypeScript",
          description: "Ejercicios de TypeScript",
          quizTopic: "typescript"
        }
      ]
    }
  ]
};

// Componente Navbar
const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
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
    </header>
  );
};

// Componente Sidebar
const Sidebar = ({ options, selectedOption, setSelectedOption }: {
  options: SidebarOption[];
  selectedOption: string | null;
  setSelectedOption: (id: string) => void;
}) => {
  return (
    <aside className="w-64 bg-content2 p-4 flex flex-col border-r border-default-200">
      <nav className="flex-1">
        <ul className="space-y-2">
          {options.map((option) => (
            <li key={option.id}>
              <Button
                variant={selectedOption === option.id ? "solid" : "light"}
                color={selectedOption === option.id ? "primary" : "default"}
                startContent={<Icon icon={option.icon} />}
                className="w-full justify-start"
                onClick={() => setSelectedOption(option.id)}
              >
                {option.name}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-default-200">
        <Button
          variant="light"
          color="danger"
          startContent={<Icon icon="lucide:log-out" />}
          className="w-full justify-start"
        >
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
};

// Componente CardWithQuiz
const CardWithQuiz = ({ card }: { card: CardOption }) => {
  const navigate = useNavigate();

  const handleQuizClick = () => {
    if (card.quizTopic) {
      navigate(`/quizcontainer?topic=${card.quizTopic}`);
    }
  };

  return (
    <Card className="w-full aspect-square" isHoverable>
      <CardBody className="flex flex-col justify-center items-center p-6">
        <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
        <p className="text-default-500 text-center mb-4">
          {card.description}
        </p>
        {card.quizTopic && (
          <Button 
            color="primary" 
            onPress={handleQuizClick}
            className="mt-4"
          >
            Iniciar Quiz
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

// Componente MainContent
const MainContent = ({ selectedOption, options }: {
  selectedOption: string | null;
  options: SidebarOption[];
}) => {
  const selectedOptionData = options.find(opt => opt.id === selectedOption);

  return (
    <main className="flex-1 overflow-y-auto p-4 bg-content1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {selectedOptionData ? selectedOptionData.name : "Dashboard"} 
        </h1>
        <p className="text-default-500">
          {selectedOptionData 
            ? `Selecciona un tema para practicar`
            : "Seleccione una categoría del menú"}
        </p>
      </div>
      
      {selectedOptionData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedOptionData.cards.map((card) => (
            <CardWithQuiz key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-default-400">
          Seleccione una categoría para ver el contenido
        </div>
      )}
    </main>
  );
};

// Componente Layout
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// Componente principal del Dashboard
const DashboardPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>("calculo");

  return (
    <Layout>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          options={dashboardData.sidebarOptions} 
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <MainContent 
          selectedOption={selectedOption} 
          options={dashboardData.sidebarOptions}
        />
      </div>
    </Layout>
  );
};

export default DashboardPage;