import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadStudentData();
  }, []);

const loadStudentData = async () => {
  try {
    const token = localStorage.getItem('studentToken');
    
    if (!token) {
      navigate('/student-login');
      return;
    }

    // Charger le profil
    const profileRes = await fetch('http://localhost:8010/api/student/my-profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!profileRes.ok) {
      throw new Error('Non authentifié');
    }
    
    const profileData = await profileRes.json();
    setStudent(profileData);

    // Charger les notes
    const gradesRes = await fetch('http://localhost:8010/api/student/my-grades', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (gradesRes.ok) {
      const gradesData = await gradesRes.json();
      setGrades(gradesData);
    }

  } catch (error) {
    console.error('Erreur:', error);
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/student-login');
  } finally {
    setLoading(false);
  }
};
  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/student-login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:8010/api/auth/student/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      alert('Mot de passe modifié avec succès !');
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error) {
      alert(error.message);
    }
  };

  const stats = {
    total: grades.length,
    moyenne: grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2) : 0,
    reussites: grades.filter(g => g.grade >= 10).length,
    max: grades.length > 0 ? Math.max(...grades.map(g => g.grade)) : 0,
  };

  const recentGrades = [...grades]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8)
    .reverse()
    .map(g => ({
      name: g.course?.code || 'N/A',
      note: g.grade,
    }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mon Espace Étudiant
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {student?.studentNumber} - {student?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChangePassword(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <KeyIcon className="h-5 w-5" />
                Changer mot de passe
              </button>
              <button
                onClick={handleLogout}
                className="btn-primary flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 card dark:bg-gray-800">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-700 dark:text-primary-300">
                {student?.firstName?.[0]}{student?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {student?.firstName} {student?.lastName}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Numéro étudiant : </span>
                  <span className="font-medium text-gray-900 dark:text-white">{student?.studentNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Date d'inscription : </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(student?.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Email : </span>
                  <span className="font-medium text-gray-900 dark:text-white">{student?.email}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Dernière connexion : </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {student?.lastLogin ? new Date(student.lastLogin).toLocaleString('fr-FR') : 'Première connexion'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cours suivis</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <BookOpenIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="card dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne générale</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.moyenne}/20</p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="card dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notes ≥ 10</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.reussites}</p>
              </div>
              <AcademicCapIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="card dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Note maximale</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.max}/20</p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {grades.length > 0 ? (
          <>
            <div className="card dark:bg-gray-800 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Mes notes récentes
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recentGrades}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="note" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Toutes mes notes
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cours</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Note</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Appréciation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {grades.map((grade) => (
                      <tr key={grade._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {grade.course?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {grade.course?.code || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            grade.grade >= 16 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                            grade.grade >= 14 ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                            grade.grade >= 12 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                            grade.grade >= 10 ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' :
                            'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          }`}>
                            {grade.grade}/20
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(grade.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {grade.grade >= 16 ? 'Excellent' :
                           grade.grade >= 14 ? 'Très bien' :
                           grade.grade >= 12 ? 'Bien' :
                           grade.grade >= 10 ? 'Passable' :
                           'Insuffisant'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="card dark:bg-gray-800 text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucune note disponible pour le moment</p>
          </div>
        )}
      </main>

      {showChangePassword && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => setShowChangePassword(false)}></div>
            <div className="inline-block bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Changer le mot de passe
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="input-field"
                    minLength={6}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Au moins 6 caractères
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;