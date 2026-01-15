const { User, Student } = require('../model');
const { Webhook } = require('svix');
const { getAuth } = require('../middleware/auth');

// Webhook pour synchroniser les utilisateurs de Clerk avec MongoDB
exports.clerkWebhook = async (req, res) => {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        
        if (!WEBHOOK_SECRET) {
            throw new Error('CLERK_WEBHOOK_SECRET manquant');
        }
        
        // Vérifier la signature du webhook
        const headers = req.headers;
        const payload = JSON.stringify(req.body);
        
        const wh = new Webhook(WEBHOOK_SECRET);
        let evt;
        
        try {
            evt = wh.verify(payload, {
                'svix-id': headers['svix-id'],
                'svix-timestamp': headers['svix-timestamp'],
                'svix-signature': headers['svix-signature'],
            });
        } catch (err) {
            console.error('Erreur de vérification webhook:', err);
            return res.status(400).json({ error: 'Webhook invalide' });
        }
        
        const eventType = evt.type;
        
        // Gérer la création d'un utilisateur
        if (eventType === 'user.created') {
            const { id, email_addresses, first_name, last_name } = evt.data;
            
            // Créer l'utilisateur dans MongoDB
            const newUser = new User({
                clerkId: id,
                email: email_addresses[0].email_address,
                firstName: first_name || '',
                lastName: last_name || '',
                role: 'etudiant' // Rôle par défaut
            });
            
            await newUser.save();
            
            // Créer automatiquement un profil étudiant
            const newStudent = new Student({
                firstName: first_name || '',
                lastName: last_name || '',
                userId: newUser._id
            });
            
            await newStudent.save();
            
            // Lier l'étudiant à l'utilisateur
            newUser.studentId = newStudent._id;
            await newUser.save();
        }
        
        // Gérer la mise à jour d'un utilisateur
        if (eventType === 'user.updated') {
            const { id, email_addresses, first_name, last_name } = evt.data;
            
            await User.findOneAndUpdate(
                { clerkId: id },
                {
                    email: email_addresses[0].email_address,
                    firstName: first_name || '',
                    lastName: last_name || '',
                    updatedAt: Date.now()
                }
            );
        }
        
        // Gérer la suppression d'un utilisateur
        if (eventType === 'user.deleted') {
            const { id } = evt.data;
            
            const user = await User.findOne({ clerkId: id });
            if (user && user.studentId) {
                await Student.findByIdAndDelete(user.studentId);
            }
            
            await User.findOneAndDelete({ clerkId: id });
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erreur webhook:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer le profil de l'utilisateur actuel
exports.getCurrentUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        const user = await User.findById(req.user._id)
            .populate('studentId');
        
        res.json(user);
    } catch (error) {
        console.error('Erreur getCurrentUserProfile:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour le rôle d'un utilisateur (admin uniquement)
exports.updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        
        const validRoles = ['etudiant1', 'etudiant2', 'etudiant3', 'administrateur'];
        
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                error: 'Rôle invalide',
                validRoles 
            });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { role, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Erreur updateUserRole:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer tous les utilisateurs (admin uniquement)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate('studentId')
            .sort({ createdAt: -1 });
        
        res.json(users);
    } catch (error) {
        console.error('Erreur getAllUsers:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer un utilisateur par ID (admin uniquement)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('studentId');
        
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Erreur getUserById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
