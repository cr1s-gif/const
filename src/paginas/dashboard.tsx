import React, { ReactNode } from "react";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody } from "@heroui/react";

// Componente Navbar (modificado para ajustarse al dashboard)
const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Icon icon="lucide:layout" className="h-6 w-6 text-blue-500 mr-2" />
            <span className="font-bold text-xl">Dashboard</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Overview
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Reports
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Settings
            </a>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Notifications
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Componente Sidebar
const Sidebar = () => {
  return (
    <aside className="w-64 bg-content2 p-4 flex flex-col border-r border-default-200">
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Button
              variant="light"
              color="default"
              startContent={<Icon icon="lucide:home" />}
              className="w-full justify-start"
            >
              Home
            </Button>
          </li>
          <li>
            <Button
              variant="light"
              color="default"
              startContent={<Icon icon="lucide:bar-chart" />}
              className="w-full justify-start"
            >
              Analytics
            </Button>
          </li>
          <li>
            <Button
              variant="light"
              color="default"
              startContent={<Icon icon="lucide:users" />}
              className="w-full justify-start"
            >
              Users
            </Button>
          </li>
          <li>
            <Button
              variant="light"
              color="default"
              startContent={<Icon icon="lucide:settings" />}
              className="w-full justify-start"
            >
              Settings
            </Button>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-default-200">
        <Button
          variant="light"
          color="danger"
          startContent={<Icon icon="lucide:log-out" />}
          className="w-full justify-start"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
};

// Componente MainContent
const MainContent = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 bg-content1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-default-500">Welcome back! Here's what's happening today.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="w-full aspect-square" isHoverable>
            <CardBody className="flex flex-col justify-center items-center">
              <h2 className="text-lg font-semibold mb-2">Card {index + 1}</h2>
              <p className="text-default-500 text-center">
                This is a sample square card content.
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
};

// Componente Layout
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

// Componente principal del Dashboard
const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <MainContent />
    </Layout>
  );
};

export default DashboardPage;