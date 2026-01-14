import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { PaperAirplaneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

function ContactAdmin() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      setSending(true);

      const token = await window.Clerk.session.getToken();
      const response = await fetch('http://localhost:8010/api/emails/send-to-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'envoi');
      }

      alert('Message envoyé avec succès !');
      setFormData({ subject: '', message: '' });

    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contacter l'Administration
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Envoyez un message à l'équipe administrative
        </p>
      </div>

      <div className="card dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <EnvelopeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Nouveau message
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              De : {user?.firstName} {user?.lastName} ({user?.primaryEmailAddress?.emailAddress})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sujet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="input-field"
              placeholder="Ex: Question sur mes notes"
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
              rows={8}
              placeholder="Écrivez votre message ici..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              {sending ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Conseil :</strong> Soyez le plus précis possible dans votre message pour obtenir une réponse rapide.
          </p>
        </div>
      </div>

      <div className="card dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Informations de contact
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>📧 Email : admin@student-app.com</p>
          <p>📞 Téléphone : +509 1234 5678</p>
          <p>🕐 Horaires : Lundi - Vendredi, 8h - 17h</p>
        </div>
      </div>
    </div>
  );
}

export default ContactAdmin;