import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer'; 

function MainLayout() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = user?.publicMetadata?.role || 'etudiant';
  const isAdmin = userRole === 'administrateur';
  const isScolarite = userRole === 'scolarite';
  const isStudent = userRole === 'etudiant';

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, show: true },
    { name: 'Étudiants', href: '/students', icon: UsersIcon, show: isAdmin || isScolarite },
    { name: 'Cours', href: '/courses', icon: BookOpenIcon, show: true },
    { name: 'Notes', href: '/grades', icon: AcademicCapIcon, show: isAdmin || isScolarite },
    { name: 'Mes Notes', href: '/my-grades', icon: ChartBarIcon, show: isStudent },
    { name: 'Utilisateurs', href: '/users', icon: UserGroupIcon, show: isAdmin },
    { name: 'Envoyer Email', href: '/send-email', icon: EnvelopeIcon, show: isAdmin || isScolarite },
    { name: 'Contacter Admin', href: '/contact-admin', icon: EnvelopeIcon, show: isStudent },
    { name: 'À propos', href: '/about', icon: InformationCircleIcon, show: true },
  ];

  const filteredNavigation = navigation.filter(item => item.show);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Student App
              </h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-primary-700 dark:text-primary-300 font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Student App
              </h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center w-full">
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-primary-700 dark:text-primary-300 font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100 dark:bg-gray-950">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-6">
                <div></div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </div>
              </div>
              <Outlet />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;