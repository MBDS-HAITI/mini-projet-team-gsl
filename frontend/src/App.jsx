import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { SignIn, SignUp } from '@clerk/clerk-react';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Grades from './pages/Grades';
import MyGrades from './pages/MyGrades';
import Users from './pages/Users';
import SendEmail from './pages/SendEmail';
import ContactAdmin from './pages/ContactAdmin';
import About from './pages/About';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import PublicPage from './pages/PublicPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const userRole = user?.publicMetadata?.role;

  if (!userRole || userRole === 'visiteur') {
    return <Navigate to="/public" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/public" replace />;
  }

  return children;
}

function RoleBasedRedirect() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const userRole = user?.publicMetadata?.role;

  if (!userRole || userRole === 'visiteur') {
    return <Navigate to="/public" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ====================================== */}
        {/* ROUTES PUBLIQUES (sans authentification) */}
        {/* ====================================== */}
        
        {/* Connexion étudiant JWT */}
        <Route path="/student-login" element={<StudentLogin />} />
        
        {/* Connexion/Inscription Clerk - SANS SignedIn wrapper */}
        <Route 
          path="/sign-in/*" 
          element={<SignIn routing="path" path="/sign-in" />} 
        />
        <Route 
          path="/sign-up/*" 
          element={<SignUp routing="path" path="/sign-up" />} 
        />

        {/* ====================================== */}
        {/* ROUTES PROTÉGÉES CLERK */}
        {/* ====================================== */}

        {/* Page publique pour visiteurs */}
        <Route 
          path="/public" 
          element={
            <SignedIn>
              <PublicPage />
            </SignedIn>
          } 
        />

        {/* Redirection racine */}
        <Route 
          path="/" 
          element={
            <>
              <SignedIn>
                <RoleBasedRedirect />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } 
        />

        {/* Routes Admin/Scolarité/Étudiant Clerk */}
        <Route 
          path="/" 
          element={
            <SignedIn>
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            </SignedIn>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route 
            path="students" 
            element={
              <ProtectedRoute allowedRoles={['administrateur', 'scolarite']}>
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route path="courses" element={<Courses />} />
          <Route 
            path="grades" 
            element={
              <ProtectedRoute allowedRoles={['administrateur', 'scolarite']}>
                <Grades />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="my-grades" 
            element={
              <ProtectedRoute allowedRoles={['etudiant']}>
                <MyGrades />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <ProtectedRoute allowedRoles={['administrateur']}>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="send-email" 
            element={
              <ProtectedRoute allowedRoles={['administrateur', 'scolarite']}>
                <SendEmail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="contact-admin" 
            element={
              <ProtectedRoute allowedRoles={['etudiant']}>
                <ContactAdmin />
              </ProtectedRoute>
            } 
          />
          <Route path="about" element={<About />} />
        </Route>

        {/* ====================================== */}
        {/* ROUTES ÉTUDIANTS JWT */}
        {/* ====================================== */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* ====================================== */}
        {/* 404 */}
        {/* ====================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;