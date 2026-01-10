import mongoose from 'mongoose';

export const initDb = () => {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', true);
    mongoose.connect(process.env.DATABASE_URL)
        .then(
            () => {
                console.log("Connexion à la base OK");
            },
            err => {
                console.log('Erreur de connexion: ', err);
            }
        );
};