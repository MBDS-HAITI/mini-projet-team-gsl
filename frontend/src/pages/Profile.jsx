import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userAPI } from '../services/api';
import { UserCircleIcon } from '@heroicons/react/24/outline';

function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getCurrentUser();
      setProfile(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérez vos informations personnelles
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Carte profil */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="h-24 w-24 rounded-full"
                />
              ) : (
                <UserCircleIcon className="h-24 w-24 text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
            <p className="text-xs text-gray-500 mt-2 capitalize">
              {profile?.role?.replace('etudiant', 'Étudiant ')}
            </p>
          </div>
        </div>
        
        {/* Informations détaillées */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations personnelles
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.firstName || '-'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.lastName || '-'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.primaryEmailAddress?.emailAddress || '-'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rôle
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {profile?.role?.replace('etudiant', 'Étudiant ') || '-'}
                </p>
              </div>
              
              {profile?.studentId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ID Étudiant
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {profile.studentId._id}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date d'inscription
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(profile.studentId.enrollmentDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Membre depuis
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(profile?.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Authentification */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Méthodes d'authentification
            </h3>
            
            <div className="space-y-3">
              {user?.externalAccounts?.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 capitalize">
                        {account.provider}
                      </p>
                      <p className="text-gray-600">
                        {account.emailAddress}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connecté
                  </span>
                </div>
              ))}
              
              {user?.passwordEnabled && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        Mot de passe
                      </p>
                      <p className="text-gray-600">
                        Authentification par mot de passe
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activé
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
