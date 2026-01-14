import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import Footer from '../components/Footer'; 

function PublicPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Système de Gestion Académique
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Plateforme moderne pour la gestion des étudiants, cours et notes.
              Suivez votre parcours académique en temps réel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/" className="btn-primary text-lg px-8 py-4">login</a>
              <button
                onClick={() => navigate('/student-login')}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                <AcademicCapIcon className="h-6 w-6" />
                Connexion Étudiant
              </button>
              {/* <button
                onClick={() => navigate('/sign-in')}
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              >
                <UsersIcon className="h-6 w-6" />
                Connexion Administration
              </button> */}
              <button
                onClick={() => {
                  console.log('🔘 Bouton cliqué - Redirection vers /sign-in');
                  window.location.href = '/sign-in';
                }}
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              >
                <UsersIcon className="h-6 w-6" />
                Connexion Administration
              </button>
            </div>

            {user && (
              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-primary-700 dark:text-primary-300 font-bold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connecté en tant que :</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Vous n'avez pas de rôle assigné. Cette page contient des informations publiques.
                  Si vous êtes étudiant, utilisez la connexion étudiante ci-dessus.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fonctionnalités
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tout ce dont vous avez besoin pour gérer votre parcours académique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card dark:bg-gray-800 text-center hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                <AcademicCapIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Gestion des Étudiants
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Créez et gérez les profils étudiants avec un système d'authentification sécurisé.
              </p>
            </div>

            <div className="card dark:bg-gray-800 text-center hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <BookOpenIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Catalogue de Cours
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organisez vos cours avec codes, crédits et descriptions détaillées.
              </p>
            </div>

            <div className="card dark:bg-gray-800 text-center hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Suivi des Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Consultez vos notes en temps réel avec statistiques et graphiques détaillés.
              </p>
            </div>

            <div className="card dark:bg-gray-800 text-center hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <EnvelopeIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Notifications Email
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recevez automatiquement vos identifiants et notifications importantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-primary-100">Étudiants Inscrits</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50+</p>
              <p className="text-primary-100">Cours Disponibles</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">95%</p>
              <p className="text-primary-100">Taux de Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Inscription
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    L'administration crée votre compte et vous envoie vos identifiants par email.
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-primary-200 dark:bg-primary-800 -z-10"></div>
            </div>

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Connexion
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connectez-vous avec vos identifiants et changez votre mot de passe.
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-primary-200 dark:bg-primary-800 -z-10"></div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Consultation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Accédez à vos notes, statistiques et suivez votre progression.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Besoin d'aide ?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Notre équipe est là pour vous accompagner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card dark:bg-gray-800 text-center">
              <PhoneIcon className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Téléphone</h3>
              <p className="text-gray-600 dark:text-gray-400">+509 1234 5678</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Lun-Ven 8h-17h</p>
            </div>

            <div className="card dark:bg-gray-800 text-center">
              <EnvelopeIcon className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">contact@school.edu</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Réponse sous 24h</p>
            </div>

            <div className="card dark:bg-gray-800 text-center">
              <MapPinIcon className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Adresse</h3>
              <p className="text-gray-600 dark:text-gray-400">Cap-Haïtien, Haïti</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Bureau principal</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Connectez-vous dès maintenant et accédez à votre espace personnel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/student-login')}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Espace Étudiant
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/sign-in')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Espace Administration
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PublicPage;