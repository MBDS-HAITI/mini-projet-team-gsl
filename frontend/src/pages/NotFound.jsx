import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

function NotFound() {
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

export default NotFound;
