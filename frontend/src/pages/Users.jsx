import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userAPI } from '../services/api';
import { 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  UserGroupIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Pagination from '../components/Pagination';

function Users() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role || 'etudiant';
  const isAdmin = userRole === 'administrateur';

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'visiteur',
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const itemsPerPage = 10;

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (roleFilter === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(u => u.role === roleFilter));
    }
    setCurrentPage(1);
  }, [roleFilter, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModal = (editUser) => {
    setEditingUser(editUser);
    setFormData({
      firstName: editUser.firstName || '',
      lastName: editUser.lastName || '',
      email: editUser.email || '',
      role: editUser.role || 'visiteur',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ firstName: '', lastName: '', email: '', role: 'visiteur' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingUser.clerkId === user.id && formData.role !== editingUser.role) {
      if (!window.confirm('Attention : Vous modifiez votre propre rôle. Vous pourriez perdre l\'accès à cette page. Continuer ?')) {
        return;
      }
    }

    try {
      setSubmitting(true);
      await userAPI.update(editingUser._id, formData);
      handleCloseModal();
      loadUsers();
      
      if (editingUser.clerkId === user.id) {
        alert('Votre rôle a été modifié. Veuillez vous déconnecter et reconnecter pour que les changements prennent effet.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.error || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (deleteUser) => {
    if (deleteUser.clerkId === user.id) {
      alert('Vous ne pouvez pas supprimer votre propre compte.');
      return;
    }

    if (!window.confirm(`Supprimer ${deleteUser.firstName} ${deleteUser.lastName} ?\n\nCela supprimera aussi le profil étudiant associé le cas échéant.`)) {
      return;
    }

    try {
      await userAPI.delete(deleteUser._id);
      loadUsers();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.error || 'Erreur');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      administrateur: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
      scolarite: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
      etudiant: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      visiteur: 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400',
    };
    return badges[role] || badges.visiteur;
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'administrateur').length,
    scolarite: users.filter(u => u.role === 'scolarite').length,
    etudiants: users.filter(u => u.role === 'etudiant').length,
  };

  if (!isAdmin) {
    return (
      <div className="card dark:bg-gray-800 text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Accès réservé aux administrateurs
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Utilisateurs</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Gestion des comptes utilisateurs
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-gray-600 dark:text-gray-400" />
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.admins}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Scolarité</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.scolarite}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Étudiants</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.etudiants}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Tous ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('administrateur')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === 'administrateur'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Admins ({stats.admins})
            </button>
            <button
              onClick={() => setRoleFilter('scolarite')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === 'scolarite'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Scolarité ({stats.scolarite})
            </button>
            <button
              onClick={() => setRoleFilter('etudiant')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === 'etudiant'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Étudiants ({stats.etudiants})
            </button>
          </div>
        </div>
      </div>

      {/* Note info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Les utilisateurs sont créés automatiquement lors de l'inscription via Clerk. 
          Les comptes étudiants avec authentification séparée sont créés via la page "Étudiants".
        </p>
      </div>

      {/* Table */}
      <div className="card dark:bg-gray-800 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Aucun utilisateur</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rôle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date création</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((usr) => (
                    <tr key={usr._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">
                              {usr.firstName?.[0]}{usr.lastName?.[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {usr.firstName} {usr.lastName}
                            </div>
                            {usr.clerkId === user.id && (
                              <span className="text-xs text-primary-600 dark:text-primary-400">Vous</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {usr.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadge(usr.role)}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(usr.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button onClick={() => handleOpenModal(usr)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 mr-4">
                          <PencilIcon className="h-5 w-5 inline" />
                        </button>
                        <button 
                          onClick={() => handleDelete(usr)} 
                          disabled={usr.clerkId === user.id}
                          className={`${
                            usr.clerkId === user.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-900 dark:text-red-400'
                          }`}
                        >
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredUsers.length} itemsPerPage={itemsPerPage} />
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={handleCloseModal}></div>
            <div className="inline-block bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Modifier l'utilisateur
                    </h3>
                    <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                      <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                      <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
                      <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-field">
                        <option value="visiteur">Visiteur</option>
                        <option value="etudiant">Étudiant</option>
                        <option value="scolarite">Scolarité</option>
                        <option value="administrateur">Administrateur</option>
                      </select>
                    </div>
                    {editingUser?.clerkId === user.id && formData.role !== editingUser.role && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Attention : Vous modifiez votre propre rôle. Déconnexion/reconnexion requise.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 sm:flex sm:flex-row-reverse gap-2">
                  <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                    {submitting ? 'Enregistrement...' : 'Modifier'}
                  </button>
                  <button type="button" onClick={handleCloseModal} className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0">Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;