const { clerkMiddleware, requireAuth: clerkRequireAuth, getAuth } = require('@clerk/express');

// Middleware pour vérifier les rôles
const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { User } = require('../model');
            
            // L'utilisateur authentifié est disponible via req.auth
            const { userId } = getAuth(req);
            
            if (!userId) {
                return res.status(401).json({ 
                    error: 'Non authentifié' 
                });
            }
            
            // Récupérer l'utilisateur depuis la base de données
            const user = await User.findOne({ clerkId: userId });
            
            if (!user) {
                return res.status(404).json({ 
                    error: 'Utilisateur non trouvé' 
                });
            }
            
            // Vérifier si l'utilisateur a le bon rôle
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ 
                    error: 'Accès refusé - rôle insuffisant',
                    requiredRoles: allowedRoles,
                    userRole: user.role
                });
            }
            
            // Attacher l'utilisateur à la requête pour utilisation ultérieure
            req.user = user;
            next();
        } catch (error) {
            console.error('Erreur dans requireRole:', error);
            res.status(500).json({ 
                error: 'Erreur serveur lors de la vérification du rôle' 
            });
        }
    };
};

// Middleware pour récupérer l'utilisateur actuel
const getCurrentUser = async (req, res, next) => {
    try {
        const { User } = require('../model');
        const { userId } = getAuth(req);
        
        if (userId) {
            const user = await User.findOne({ clerkId: userId })
                .populate('studentId');
            req.user = user;
        }
        next();
    } catch (error) {
        console.error('Erreur dans getCurrentUser:', error);
        next();
    }
};

module.exports = {
    clerkMiddleware,
    requireAuth: clerkRequireAuth,
    requireRole,
    getCurrentUser,
    getAuth
};