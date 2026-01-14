import React, { useState } from 'react';
import { emailAPI } from '../services/api';
import { 
  PaperAirplaneIcon,
  CheckIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

function EmailStudent() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setSending(true);
      setResult(null);
      
      await emailAPI.sendToAdmin({
        subject: formData.subject,
        message: formData.message,
      });
      
      setResult({
        success: true,
        message: 'Votre message a été envoyé à l\'administration avec succès !',
      });
      
      // Réinitialiser le formulaire
      setFormData({ subject: '', message: '' });
    } catch (error) {
      console.error('Erreur envoi email:', error);
      setResult({
        success: false,
        message: error.response?.data?.error || 'Erreur lors de l\'envoi du message',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
          <EnvelopeIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contacter l'Administration
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Envoyez un message à l'administration pour toute question ou demande
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
              {result.success && (
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  L'administration vous répondra dans les plus brefs délais.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="card dark:bg-gray-800">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sujet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Ex: Question sur mes notes"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Votre message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Décrivez votre demande ou votre question..."
              rows={10}
              className="input-field resize-none"
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {formData.message.length} caractères
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData({ subject: '', message: '' });
                setResult(null);
              }}
              className="btn-secondary"
              disabled={sending}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={sending}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              {sending ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </div>
        </div>
      </form>

      {/* Informations supplémentaires */}
      <div className="card dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📋 Avant d'envoyer votre message
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Vérifiez que votre question n'est pas déjà dans la FAQ</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Soyez précis et clair dans votre demande</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>L'administration répond généralement sous 24-48h</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Pour les urgences, contactez directement le secrétariat</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EmailStudent;