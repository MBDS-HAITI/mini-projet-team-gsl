import React, { useEffect, useState } from 'react';
import { gradeAPI } from '../services/api';
import { AcademicCapIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function MyGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const response = await gradeAPI.getMyGrades();
      setGrades(response.data || []);
    } catch (error) {
      console.error('Erreur chargement notes:', error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: grades.length,
    moyenne: grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2) : 0,
    reussites: grades.filter(g => g.grade >= 10).length,
    max: grades.length > 0 ? Math.max(...grades.map(g => g.grade)) : 0,
  };

  const chartData = grades.map(g => ({
    course: g.course?.name?.substring(0, 15) || 'N/A',
    note: g.grade
  }));

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Notes</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Consultez vos résultats académiques
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total notes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <AcademicCapIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.moyenne}/20</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Réussites</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.reussites}</p>
            </div>
            <AcademicCapIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Meilleure note</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.max}/20</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Graphique */}
      {grades.length > 0 && (
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mes notes par cours
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
              <XAxis dataKey="course" angle={-45} textAnchor="end" height={100} />
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
      )}

      {/* Liste des notes */}
      <div className="card dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Toutes mes notes
        </h3>
        {grades.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucune note disponible</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default MyGrades;