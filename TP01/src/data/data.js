// src/data/data.js
export const notes = [
    { id: 1, etudiantId: 101, matiereId: 10, note: 14.5 },
    { id: 2, etudiantId: 102, matiereId: 11, note: 9.75 },
    { id: 3, etudiantId: 103, matiereId: 10, note: 17.0 },
];

export const etudiants = [
    { id: 101, nom: "Jean", prenom: "Pierre", email: "jean.pierre@example.com" },
    { id: 102, nom: "Marie", prenom: "Luce", email: "marie.luce@example.com" },
    { id: 103, nom: "Ernst", prenom: "Louis", email: "ernst.louis@example.com" },
];

export const matieres = [
    { id: 10, libelle: "Mathématiques", coeff: 2 },
    { id: 11, libelle: "Physique", coeff: 3 },
    { id: 12, libelle: "Histoire", coeff: 1 },
];
