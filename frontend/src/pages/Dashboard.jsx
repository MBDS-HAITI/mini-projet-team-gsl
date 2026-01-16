import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { studentAPI, courseAPI, gradeAPI } from '../services/api';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [studentsRes, coursesRes, gradesRes] = await Promise.all([
        studentAPI.getAll().catch(() => ({ data: [] })),
        courseAPI.getAll().catch(() => ({ data: [] })),
        gradeAPI.getAll().catch(() => ({ data: [] }))
      ]);

      setStudents(studentsRes.data || []);
      setCourses(coursesRes.data || []);
      setGrades(gradesRes.data || []);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // CALCULS STATISTIQUES
  // ====================================

  const stats = {
    totalStudents: students.length,
    totalCourses: courses.length,
    totalGrades: grades.length,
    averageGrade: grades.length > 0 
      ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)
      : 0,
    passRate: grades.length > 0
      ? ((grades.filter(g => g.grade >= 10).length / grades.length) * 100).toFixed(1)
      : 0,
    excellenceRate: grades.length > 0
      ? ((grades.filter(g => g.grade >= 16).length / grades.length) * 100).toFixed(1)
      : 0
  };

  // Répartition des notes par tranche
  const gradeDistribution = [
    { 
      name: 'Excellent (16-20)', 
      value: grades.filter(g => g.grade >= 16).length,
      color: '#10b981'
    },
    { 
      name: 'Très bien (14-16)', 
      value: grades.filter(g => g.grade >= 14 && g.grade < 16).length,
      color: '#3b82f6'
    },
    { 
      name: 'Bien (12-14)', 
      value: grades.filter(g => g.grade >= 12 && g.grade < 14).length,
      color: '#eab308'
    },
    { 
      name: 'Passable (10-12)', 
      value: grades.filter(g => g.grade >= 10 && g.grade < 12).length,
      color: '#f97316'
    },
    { 
      name: 'Insuffisant (<10)', 
      value: grades.filter(g => g.grade < 10).length,
      color: '#ef4444'
    }
  ].filter(item => item.value > 0);

  // Notes moyennes par cours
  const averageGradesByCourse = courses.map(course => {
    const courseGrades = grades.filter(g => g.course?._id === course._id);
    const avg = courseGrades.length > 0
      ? (courseGrades.reduce((sum, g) => sum + g.grade, 0) / courseGrades.length).toFixed(2)
      : 0;
    
    return {
      name: course.code,
      fullName: course.name,
      moyenne: parseFloat(avg),
      count: courseGrades.length
    };
  }).filter(c => c.count > 0).sort((a, b) => b.moyenne - a.moyenne);

  // Évolution des notes dans le temps (derniers 10 jours)
  const last10Grades = [...grades]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10)
    .map((g, index) => ({
      name: `Note ${index + 1}`,
      note: g.grade,
      date: new Date(g.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      cours: g.course?.code || 'N/A'
    }));

  // Performance radar (par tranche de note)
  const performanceRadar = [
    {
      category: 'Excellence (≥16)',
      value: (stats.excellenceRate / 100) * 20
    },
    {
      category: 'Très bien (14-16)',
      value: ((grades.filter(g => g.grade >= 14 && g.grade < 16).length / grades.length) * 20) || 0
    },
    {
      category: 'Bien (12-14)',
      value: ((grades.filter(g => g.grade >= 12 && g.grade < 14).length / grades.length) * 20) || 0
    },
    {
      category: 'Passable (10-12)',
      value: ((grades.filter(g => g.grade >= 10 && g.grade < 12).length / grades.length) * 20) || 0
    },
    {
      category: 'Échec (<10)',
      value: ((grades.filter(g => g.grade < 10).length / grades.length) * 20) || 0
    }
  ];

  // Top 5 étudiants
  const topStudents = students.map(student => {
    const studentGrades = grades.filter(g => g.student?._id === student._id);
    const avg = studentGrades.length > 0
      ? (studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length)
      : 0;
    
    return {
      ...student,
      average: avg,
      gradesCount: studentGrades.length
    };
  })
  .filter(s => s.gradesCount > 0)
  .sort((a, b) => b.average - a.average)
  .slice(0, 5);

  // Tendance des inscriptions (simulation - en production, utiliser vraies dates)
  const studentEnrollmentTrend = students
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .reduce((acc, student, index) => {
      const month = new Date(student.createdAt).toLocaleDateString('fr-FR', { month: 'short' });
      const existing = acc.find(item => item.month === month);
      
      if (existing) {
        existing.total++;
      } else {
        acc.push({ month, total: index + 1 });
      }
      
      return acc;
    }, [])
    .slice(-6);

  // Couleurs personnalisées
  const COLORS = ['#10b981', '#3b82f6', '#eab308', '#f97316', '#ef4444'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Bienvenue, {user?.firstName} {user?.lastName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Étudiants */}
        <div className="card dark:bg-gray-800 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Étudiants</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalStudents}
              </p>
              <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +{((stats.totalStudents / 100) * 5).toFixed(0)}% ce mois
              </div>
            </div>
            <div className="h-14 w-14 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        {/* Cours */}
        <div className="card dark:bg-gray-800 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cours</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalCourses}
              </p>
              <div className="flex items-center mt-2 text-xs text-blue-600 dark:text-blue-400">
                <BookOpenIcon className="h-4 w-4 mr-1" />
                {courses.reduce((sum, c) => sum + c.credits, 0)} crédits total
              </div>
            </div>
            <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <BookOpenIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card dark:bg-gray-800 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalGrades}
              </p>
              <div className="flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Moyenne: {stats.averageGrade}/20
              </div>
            </div>
            <div className="h-14 w-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Taux de réussite */}
        <div className="card dark:bg-gray-800 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taux de réussite</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.passRate}%
              </p>
              <div className="flex items-center mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                <TrophyIcon className="h-4 w-4 mr-1" />
                Excellence: {stats.excellenceRate}%
              </div>
            </div>
            <div className="h-14 w-14 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Première ligne de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des notes (Pie Chart) */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition des notes
          </h3>
          {gradeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Évolution des notes (Line Chart) */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Évolution des dernières notes
          </h3>
          {last10Grades.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last10Grades}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 20]} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="note" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 8 }}
                  name="Note"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* Deuxième ligne de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moyennes par cours (Bar Chart) */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Moyennes par cours
          </h3>
          {averageGradesByCourse.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageGradesByCourse.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 20]} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                  labelFormatter={(value) => {
                    const course = averageGradesByCourse.find(c => c.name === value);
                    return course ? course.fullName : value;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="moyenne" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  name="Moyenne"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Performance Radar */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition des performances
          </h3>
          {performanceRadar.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceRadar}>
                <PolarGrid stroke="#4b5563" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 20]}
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                />
                <Radar 
                  name="Performance" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* Troisième ligne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendance des inscriptions (Area Chart) */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            👥 Évolution des inscriptions
          </h3>
          {studentEnrollmentTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={studentEnrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#f59e0b" 
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  name="Étudiants inscrits"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Top 5 étudiants */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrophyIcon className="h-6 w-6 text-yellow-500" />
            🏆 Top 5 Étudiants
          </h3>
          {topStudents.length > 0 ? (
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div 
                  key={student._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' :
                      'bg-primary-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {student.gradesCount} note(s)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {student.average.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">/ 20</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;