import React from 'react';
import { 
  AcademicCapIcon, 
  UsersIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

function About() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Gestion des Notes',
      description: 'Suivez et gérez facilement toutes les notes des étudiants avec des statistiques détaillées.'
    },
    {
      icon: UsersIcon,
      title: 'Gestion des Étudiants',
      description: 'Administrez les profils étudiants, les inscriptions et les informations personnelles.'
    },
    {
      icon: ChartBarIcon,
      title: 'Statistiques Avancées',
      description: 'Visualisez les performances avec des graphiques interactifs et des analyses détaillées.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sécurité & Authentification',
      description: 'Authentification multi-providers sécurisée avec gestion des rôles et permissions.'
    },
    {
      icon: LightBulbIcon,
      title: 'Interface Intuitive',
      description: 'Design moderne et responsive avec mode sombre pour une expérience utilisateur optimale.'
    },
    {
      icon: HeartIcon,
      title: 'Open Source',
      description: 'Projet développé avec des technologies modernes et des meilleures pratiques.'
    },
  ];

  const technologies = [
    { name: 'React', description: 'Framework frontend moderne' },
    { name: 'Node.js & Express', description: 'Backend performant' },
    { name: 'MongoDB', description: 'Base de données NoSQL' },
    { name: 'Clerk', description: 'Authentification sécurisée' },
    { name: 'Tailwind CSS', description: 'Design responsive' },
    { name: 'Recharts', description: 'Graphiques interactifs' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          À Propos de Student Management
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Une solution complète et moderne pour la gestion des étudiants, des cours et des notes académiques.
        </p>
      </div>

      {/* Mission Section */}
      <div className="card dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Notre Mission
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Ce travail a été donné dans le cadre du cours de développement web dirigé par le professeur Édouard Amos.
          Il s'agit de la version finale d'une suite de TP dont l'objectif est de créer une application de Student Management
          pour simplifier la gestion académique et offrir une expérience utilisateur exceptionnelle aux administrateurs et aux étudiants.
          Notre objectif est de fournir un outil puissant, intuitif et accessible qui facilite le suivi des performances académiques et
          améliore la communication entre tous les acteurs de l'éducation.
        </p>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Fonctionnalités Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Section */}
      <div className="card dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Technologies Utilisées
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {tech.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card dark:bg-gray-800 text-center">
          <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            100%
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Open Source
          </div>
        </div>
        <div className="card dark:bg-gray-800 text-center">
          <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            24/7
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Disponibilité
          </div>
        </div>
        <div className="card dark:bg-gray-800 text-center">
          <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            ∞
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Évolutivité
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="card dark:bg-gray-800 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Une Question ?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          N'hésitez pas à nous contacter pour toute question ou suggestion d'amélioration.
        </p>
        <a 
          href="mailto:contact@student-management.com"
          className="btn-primary inline-block"
        >
          Nous Contacter
        </a>
      </div>
    </div>
  );
}

export default About;