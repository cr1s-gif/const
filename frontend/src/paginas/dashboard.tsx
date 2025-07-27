import React, { ReactNode, useState } from "react";
import { Icon } from "@iconify/react";
import { 
  Button, 
  Card, 
  CardBody, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from "@heroui/react";
import { useNavigate } from "react-router-dom";

// Implementación alternativa de useDisclosure
const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(!isOpen);

  return { isOpen, onOpen, onClose, onToggle };
};

// Definición de tipos TypeScript
type ModalOption = {
  id: string;
  title: string;
  quizTopic: string;
  description: string;
};

type CardOption = {
  id: string;
  title: string;
  description: string;
  modalOptions: ModalOption[];
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
      name: "Cálculo",
      icon: "lucide:home",
      cards: [
        {
          id: "derivadas",
          title: "Derivadas",
          description: "Ejercicios de derivadas",
          modalOptions: [
            {
              id: "derivadas-basicas",
              title: "Derivadas Básicas",
              quizTopic: "derivadas-basicas",
              description: "Derivadas de funciones elementales"
            },
            {
              id: "derivadas-implicitas",
              title: "Derivadas Implícitas",
              quizTopic: "derivadas-implicitas",
              description: "Derivación implícita de funciones"
            },
            {
              id: "regla-cadena",
              title: "Regla de la Cadena",
              quizTopic: "regla-cadena",
              description: "Derivadas compuestas usando regla de la cadena"
            }
          ]
        },
        {
          id: "integrales",
          title: "Integrales",
          description: "Ejercicios de integrales",
          modalOptions: [
            {
              id: "integrales-indefinidas",
              title: "Integrales Indefinidas",
              quizTopic: "integrales-indefinidas",
              description: "Integrales básicas y métodos de integración"
            },
            {
              id: "integrales-definidas",
              title: "Integrales Definidas",
              quizTopic: "integrales-definidas",
              description: "Cálculo de áreas bajo la curva"
            }
          ]
        }
      ]
    },
    {
      id: "algebra",
      name: "Álgebra",
      icon: "lucide:bar-chart",
      cards: [
        {
          id: "matrices",
          title: "Matrices",
          description: "Ejercicios de matrices",
          modalOptions: [
            {
              id: "operaciones-matrices",
              title: "Operaciones con Matrices",
              quizTopic: "operaciones-matrices",
              description: "Suma, resta y multiplicación de matrices"
            },
            {
              id: "determinantes",
              title: "Determinantes",
              quizTopic: "determinantes",
              description: "Cálculo de determinantes y propiedades"
            }
          ]
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

// Componente CardWithModal
const CardWithModal = ({ card }: { card: CardOption }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOptionSelect = (quizTopic: string) => {
    onClose();
    navigate(`/quizcontainer?topic=${quizTopic}`);
  };

  return (
    <>
      <Card 
        className="w-full aspect-square" 
        isHoverable
        isPressable
        onPress={onOpen}
      >
        <CardBody className="flex flex-col justify-center items-center p-6">
          <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
          <p className="text-default-500 text-center mb-4">
            {card.description}
          </p>
          <Button color="primary" className="mt-4">
            Ver opciones
          </Button>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {card.title}
            <p className="text-sm text-default-500">{card.description}</p>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 gap-4">
              {card.modalOptions.map((option) => (
                <Card 
                  key={option.id}
                  isHoverable
                  isPressable
                  onPress={() => handleOptionSelect(option.quizTopic)}
                  className="hover:bg-content2 transition-colors"
                >
                  <CardBody>
                    <h3 className="font-semibold">{option.title}</h3>
                    <p className="text-sm text-default-500">{option.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
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
            <CardWithModal key={card.id} card={card} />
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