// NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <p className="text-2xl font-semibold text-gray-900 mt-4">Page non trouvée</p>
        <p className="text-gray-600 mt-2">La page que vous recherchez n'existe pas.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center mt-6 btn-primary"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}

// Students.jsx - Page placeholder
export function Students() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Étudiants</h1>
        <p className="mt-2 text-sm text-gray-600">
          Liste et gestion de tous les étudiants
        </p>
      </div>
      
      <div className="card">
        <p className="text-gray-600">
          Page de gestion des étudiants - À implémenter
        </p>
      </div>
    </div>
  );
}

// Courses.jsx - Page placeholder
export function Courses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cours</h1>
        <p className="mt-2 text-sm text-gray-600">
          Liste de tous les cours disponibles
        </p>
      </div>
      
      <div className="card">
        <p className="text-gray-600">
          Page des cours - À implémenter
        </p>
      </div>
    </div>
  );
}

// Grades.jsx - Page placeholder (admin)
export function Grades() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Notes</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gestion de toutes les notes des étudiants
        </p>
      </div>
      
      <div className="card">
        <p className="text-gray-600">
          Page de gestion des notes - À implémenter
        </p>
      </div>
    </div>
  );
}

// Users.jsx - Page placeholder (admin)
export function Users() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérer les utilisateurs et leurs rôles
        </p>
      </div>
      
      <div className="card">
        <p className="text-gray-600">
          Page de gestion des utilisateurs - À implémenter
        </p>
      </div>
    </div>
  );
}
