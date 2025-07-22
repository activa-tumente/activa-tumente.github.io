import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import InstitutionSelectPage from '../pages/student/InstitutionSelectPage';
import GroupSelectPage from '../pages/student/GroupSelectPage';
import StudentSelectPage from '../pages/student/StudentSelectPage';
import QuestionnairePage from '../pages/student/QuestionnairePage';
import CompletionScreen from '../pages/student/CompletionScreen';
import Navbar from '../components/layout/Navbar';

const StudentLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar title="Cuestionario Estudiante" />
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Cuestionario Estudiante</h1>
          <nav>
            <Link to="/" className="text-blue-100 hover:text-white">Volver al Inicio</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route index element={<InstitutionSelectPage />} />
          <Route path="select-group/:institutionId" element={<GroupSelectPage />} />
          <Route path="select-student/:groupId" element={<StudentSelectPage />} />
          <Route path="questionnaire/:groupId/:studentId" element={<QuestionnairePage />} />
          <Route path="questionnaire" element={<QuestionnairePage />} />
          <Route path="complete" element={<CompletionScreen />} />
        </Routes>
      </main>
      <footer className="bg-blue-100 text-center p-4 mt-8 text-sm text-gray-600">
        Pie de página Estudiante
      </footer>
    </div>
  );
};

export default StudentLayout;
