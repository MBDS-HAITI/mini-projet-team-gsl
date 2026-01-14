import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { studentAPI } from '../services/api';
import { 
  PaperAirplaneIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

function SendEmail() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role || 'etudiant';
  const isAdmin = userRole === 'administrateur';
  const isScolarite = userRole === 'scolarite';
  const canSend = isAdmin || isScolarite;

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (canSend) {
      loadStudents();
    }
  }, [canSend]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      setStudents(response.data || []);
    } catch (error) {
      console.error('Erreur chargement étudiants:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      alert('Veuillez sélectionner au moins un étudiant');
      return;
    }

    if (!formData.subject || !formData.message) {
      alert('Veuillez remplir le sujet et le message');
      return;
    }

    try {
      setSending(true);
      setResult(null);

      const token = await window.Clerk.session.getToken();
      const response = await fetch('http://localhost:8010/api/emails/send-to-students', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentIds: selectedStudents,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setResult(data);
      setFormData({ subject: '', message: '' });
      setSelectedStudents([]);
      setSelectAll(false);

      alert(`Email envoyé avec succès à ${data.results.filter(r => r.success).length} étudiant(s) !`);

    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    } finally {
      setSending(false);
    }
  };

  if (!canSend) {
    return (
      <div className="card dark:bg-gray-800 text-center py-12">
        <XCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Accès réservé aux administrateurs et à la scolarité
        </p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Envoyer un Email
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Envoyez un email groupé aux étudiants sélectionnés
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des étudiants */}
        <div className="lg:col-span-1">
          <div className="card dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Destinataires
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedStudents.length} / {students.length}
              </span>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <label className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                  Sélectionner tout ({students.length})
                </span>
              </label>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Aucun étudiant disponible
                  </p>
                </div>
              ) : (
                students.map((student) => (
                  <label
                    key={student._id}
                    className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleSelectStudent(student._id)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {student.email}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Composer le message
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sujet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  placeholder="Ex: Information importante concernant les examens"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field"
                  rows={12}
                  placeholder="Écrivez votre message ici..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Le message sera envoyé tel quel à tous les étudiants sélectionnés
                </p>
              </div>

              {selectedStudents.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Destinataires ({selectedStudents.length}) :</strong>
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {students
                          .filter(s => selectedStudents.includes(s._id))
                          .map(s => `${s.firstName} ${s.lastName}`)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sending || selectedStudents.length === 0}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                  {sending ? 'Envoi en cours...' : `Envoyer à ${selectedStudents.length} étudiant(s)`}
                </button>
              </div>
            </div>
          </form>

          {result && (
            <div className="card dark:bg-gray-800 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Résultat de l'envoi
              </h3>

              <div className="space-y-2">
                {result.results.map((res, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded ${
                      res.success
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {res.success ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {res.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {res.email}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${
                      res.success
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {res.success ? 'Envoyé' : 'Échec'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Résumé :</strong> {result.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SendEmail;