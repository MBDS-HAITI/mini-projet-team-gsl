import React, { useEffect, useState } from 'react';
import { emailAPI } from '../services/api';
import { 
  PaperAirplaneIcon,
  UserGroupIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

function EmailAdmin() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await emailAPI.getStudentsList();
      setStudents(res.data);
    } catch (error) {
      console.error('Erreur chargement étudiants:', error);
      alert('Erreur lors du chargement des étudiants');
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
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setSending(true);
      setResult(null);
      
      const res = await emailAPI.sendToStudents({
        studentIds: selectedStudents,
        subject: formData.subject,
        message: formData.message,
      });
      
      setResult({
        success: true,
        message: res.data.message,
        details: res.data,
      });
      
      // Réinitialiser le formulaire
      setFormData({ subject: '', message: '' });
      setSelectedStudents([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Erreur envoi emails:', error);
      setResult({
        success: false,
        message: error.response?.data?.error || 'Erreur lors de l\'envoi des emails',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Envoyer un Email aux Étudiants
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Envoyez des messages importants à vos étudiants
        </p>
      </div>

      {/* Message de résultat */}
      {result && (
        <div className={`card ${result.success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.success ? <CheckIcon className="h-6 w-6" /> : '❌'}
            </div>
            <div className="ml-3">
              <p className={`font-medium ${result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {result.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection des étudiants */}
        <div className="lg:col-span-1">
          <div className="card dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5" />
                Destinataires
              </h3>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                {selectAll ? 'Tout déselectionner' : 'Tout sélectionner'}
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <label
                  key={student._id}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleSelectStudent(student._id)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {student.email}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>{selectedStudents.length}</strong> étudiant(s) sélectionné(s)
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire d'email */}
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
                  placeholder="Ex: Important - Changement d'horaire"
                  className="input-field"
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
                  placeholder="Écrivez votre message ici..."
                  rows={12}
                  className="input-field resize-none"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.message.length} caractères
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ subject: '', message: '' });
                    setSelectedStudents([]);
                    setSelectAll(false);
                    setResult(null);
                  }}
                  className="btn-secondary"
                  disabled={sending}
                >
                  Réinitialiser
                </button>
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
        </div>
      </div>
    </div>
  );
}

export default EmailAdmin;