const { Course } = require('../model');

// Récupérer tous les cours
exports.getAll = async (req, res) => {
    try {
        const courses = await Course.find().sort({ name: 1 });
        res.json(courses);
    } catch (error) {
        console.error('Erreur getAll courses:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer un cours par ID
exports.getById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ error: 'Cours non trouvé' });
        }
        
        res.json(course);
    } catch (error) {
        console.error('Erreur getById course:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Créer un cours (admin uniquement)
exports.create = async (req, res) => {
    try {
        const { name, code, description, credits } = req.body;
        
        // Validation
        if (!name || !code) {
            return res.status(400).json({ 
                error: 'Le nom et le code du cours sont requis' 
            });
        }
        
        // Vérifier si le code existe déjà
        const existingCourse = await Course.findOne({ code });
        if (existingCourse) {
            return res.status(400).json({ 
                error: 'Un cours avec ce code existe déjà' 
            });
        }
        
        // Créer le cours
        const course = new Course({
            name,
            code,
            description: description || '',
            credits: credits || 3,
        });
        
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error('Erreur create course:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un cours (admin uniquement)
exports.update = async (req, res) => {
    try {
        const { name, code, description, credits } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (code) updateData.code = code;
        if (description !== undefined) updateData.description = description;
        if (credits !== undefined) updateData.credits = credits;
        
        // Si le code est modifié, vérifier qu'il n'existe pas déjà
        if (code) {
            const existingCourse = await Course.findOne({ 
                code, 
                _id: { $ne: req.params.id } 
            });
            
            if (existingCourse) {
                return res.status(400).json({ 
                    error: 'Un cours avec ce code existe déjà' 
                });
            }
        }
        
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!course) {
            return res.status(404).json({ error: 'Cours non trouvé' });
        }
        
        res.json(course);
    } catch (error) {
        console.error('Erreur update course:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un cours (admin uniquement)
exports.delete = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        
        if (!course) {
            return res.status(404).json({ error: 'Cours non trouvé' });
        }
        
        res.json({ message: 'Cours supprimé avec succès' });
    } catch (error) {
        console.error('Erreur delete course:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};