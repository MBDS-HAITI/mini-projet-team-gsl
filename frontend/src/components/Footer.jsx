import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  HeartIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: 'Tableau de bord', href: '/dashboard' },
      { name: 'Cours', href: '/courses' },
      { name: 'Mes Notes', href: '/my-grades' },
      { name: 'Profil', href: '/profile' },
    ],
    apropos: [
      { name: 'À Propos', href: '/about' },
      { name: 'Fonctionnalités', href: '/about#features' },
      { name: 'Technologies', href: '/about#tech' },
      { name: 'Contact', href: '/about#contact' },
    ],
    legal: [
      { name: 'Confidentialité', href: '#' },
      { name: 'Conditions d\'utilisation', href: '#' },
      { name: 'Mentions légales', href: '#' },
    ]
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <AcademicCapIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Student App
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gestion moderne et efficace des étudiants, cours et notes académiques.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <HeartIcon className="h-4 w-4 text-red-500" />
              <span>Fait avec passion</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              À Propos
            </h3>
            <ul className="space-y-2">
              {footerLinks.apropos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <a 
                  href="mailto:contact@student-app.com"
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  gsl.mbds@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPinIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Port-au-Prince, Haïti</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Student Management. Tous droits réservés.
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;