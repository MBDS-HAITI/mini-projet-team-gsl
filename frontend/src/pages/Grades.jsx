import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { gradeAPI, studentAPI, courseAPI } from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

function Grades() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role || 'visiteur';
  const canEdit = userRole === 'administrateur' || userRole === 'scolarite';

  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    grade: ''
  });

  // Filtres
  const [filters, setFilters] = useState({
    studentId: '',
    courseId: '',
    minGrade: '',
    maxGrade: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  // Filtrage et recherche en temps réel
  useEffect(() => {
    let filtered = [...grades];

    // Recherche textuelle
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(grade => {
        const studentName = `${grade.student?.firstName} ${grade.student?.lastName}`.toLowerCase();
        const courseName = grade.course?.name?.toLowerCase() || '';
        const courseCode = grade.course?.code?.toLowerCase() || '';
        const studentNumber = grade.student?.studentNumber?.toLowerCase() || '';
        
        return studentName.includes(query) ||
               courseName.includes(query) ||
               courseCode.includes(query) ||
               studentNumber.includes(query);
      });
    }

    // Filtres
    if (filters.studentId) {
      filtered = filtered.filter(g => g.student?._id === filters.studentId);
    }
    if (filters.courseId) {
      filtered = filtered.filter(g => g.course?._id === filters.courseId);
    }
    if (filters.minGrade !== '') {
      filtered = filtered.filter(g => g.grade >= parseFloat(filters.minGrade));
    }
    if (filters.maxGrade !== '') {
      filtered = filtered.filter(g => g.grade <= parseFloat(filters.maxGrade));
    }

    setFilteredGrades(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, grades]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradesRes, studentsRes, coursesRes] = await Promise.all([
        gradeAPI.getAll().catch(() => ({ data: [] })),
        studentAPI.getAll().catch(() => ({ data: [] })),
        courseAPI.getAll().catch(() => ({ data: [] }))
      ]);

      setGrades(gradesRes.data || []);
      setFilteredGrades(gradesRes.data || []);
      setStudents(studentsRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student || !formData.course || !formData.grade) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      if (editingGrade) {
        await gradeAPI.update(editingGrade._id, { grade: parseFloat(formData.grade) });
      } else {
        await gradeAPI.create({
          student: formData.student,
          course: formData.course,
          grade: parseFloat(formData.grade)
        });
      }

      setShowModal(false);
      setEditingGrade(null);
      setFormData({ student: '', course: '', grade: '' });
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      student: grade.student?._id || '',
      course: grade.course?._id || '',
      grade: grade.grade.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await gradeAPI.delete(id);
        loadData();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      studentId: '',
      courseId: '',
      minGrade: '',
      maxGrade: ''
    });
    setSearchQuery('');
  };

  const getGradeBadge = (grade) => {
    if (grade >= 16) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (grade >= 14) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (grade >= 12) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (grade >= 10) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getGradeLabel = (grade) => {
    if (grade >= 16) return 'Excellent';
    if (grade >= 14) return 'Très bien';
    if (grade >= 12) return 'Bien';
    if (grade >= 10) return 'Passable';
    return 'Insuffisant';
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGrades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGrades.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notes
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {filteredGrades.length} note(s) {(searchQuery || Object.values(filters).some(v => v !== '')) && 'trouvée(s)'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setEditingGrade(null);
              setFormData({ student: '', course: '', grade: '' });
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Nouvelle note
          </button>
        )}
      </div>

      {/* Recherche et filtres */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Rechercher par étudiant, cours ou numéro..."
            className="flex-1 max-w-md"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <FunnelIcon className="h-5 w-5" />
            Filtres
            {Object.values(filters).some(v => v !== '') && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="card dark:bg-gray-800 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Étudiant
                </label>
                <select
                  value={filters.studentId}
                  onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Tous les étudiants</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cours
                </label>
                <select
                  value={filters.courseId}
                  onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Tous les cours</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note min
                </label>
                <input
                  type="number"
                  value={filters.minGrade}
                  onChange={(e) => setFilters({ ...filters, minGrade: e.target.value })}
                  className="input-field"
                  placeholder="0"
                  min="0"
                  max="20"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note max
                </label>
                <input
                  type="number"
                  value={filters.maxGrade}
                  onChange={(e) => setFilters({ ...filters, maxGrade: e.target.value })}
                  className="input-field"
                  placeholder="20"
                  min="0"
                  max="20"
                  step="0.1"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="btn-secondary text-sm"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                {canEdit && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 5 : 4} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery || Object.values(filters).some(v => v !== '') ? 'Aucune note trouvée' : 'Aucune note'}
                    </p>
                  </td>
                </tr>
              ) : (
                currentItems.map((grade) => (
                  <tr key={grade._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-primary-700 dark:text-primary-300 font-medium">
                              {grade.student?.firstName?.[0]}{grade.student?.lastName?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {grade.student?.firstName} {grade.student?.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {grade.student?.studentNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {grade.course?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {grade.course?.code || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getGradeBadge(grade.grade)}`}>
                        {grade.grade}/20 - {getGradeLabel(grade.grade)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(grade.date).toLocaleDateString('fr-FR')}
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(grade)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(grade._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredGrades.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => setShowModal(false)}></div>
            <div className="inline-block bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingGrade ? 'Modifier la note' : 'Nouvelle note'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Étudiant <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.student}
                    onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                    className="input-field"
                    required
                    disabled={!!editingGrade}
                  >
                    <option value="">Sélectionner un étudiant</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.firstName} {student.lastName} ({student.studentNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cours <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="input-field"
                    required
                    disabled={!!editingGrade}
                  >
                    <option value="">Sélectionner un cours</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Note <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="input-field"
                    min="0"
                    max="20"
                    step="0.1"
                    placeholder="0 à 20"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingGrade ? 'Modifier' : 'Créer'}
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

export default Grades;