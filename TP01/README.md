Session 1 : Concepts de bases React
TD00 : Créer et initialiser un projet React
Installer NodeJS
Créer un projet React en utilisant Vite
npm create vite@latest
Exécuter le projet
npm run dev
Essayer de modifier le contenu du fichier App.jsx puis enregistrer le fichier, vérifier que votre changement s'affiche instantannément dans le navigateur (pas besoin de recharger la page)
Remplacer le contenu du fichier index.ccs par celui inclut dans ce repository
Créer un commit avec le message "TD00 : Initialisation du projet"
Push
TD01 : Votre premier composant React
Créer un composant Header contenant les éléments suivant :
Logo de votre formation
Titre : "Introduction à React"
Sous-Titre : "A la découverte des premières notions de React"
Commit avec le message "TD01 : Ajouter un composant Header dans la page"
Créer un second composant MainContent, permettant d'afficher le text suivant "Ici, nous afficherons des informations interessantes :) "
Commit avec le message "TD01 : Ajouter un composant pour le contenu principal de la page"
Ajouter un composant Footer contenant le texte "Tous droits réservés - [Nom] [Prénom]" - Le texte doit s'afficher tout en bas de la page et centré au millieu
Commit avec le message "TD01 : Ajouter un footer"
Push
TD02 : Contenu dynamique
Modifier le composant MainContent du TD précédent pour afficher le texte suivant "Bonjour, on est le [Jour], [Mois], [Annee] et il est [Heure]:[Minute]:[Second]"
Commit avec le message "TD02: Afficher la date et l'heure du jour"
Modifier le footer pour y afficher également l'année, au format "© [Annee] - [Prenom].[Nom], Tous droits réservés."
Commit avec le message "TD02 : Afficher l'année dans le Footer"
Push
TD03 : Utiliser les props
Considérer les données du fichier data.json
Créer une fonction permettant de trier alléatoirement un item de la liste
Créer un composant permettant d'afficher un élément du tableau.
Libre à vous de définir le style et la disposition des éléments (vous pouvez inclure des librairies css externes)

Commit avec le message "TD03 : Afficher les détails d'une note"
Push
TD04 : Gestion d'événements
Ajouter un menu en haut à gauche de votre application
Considérer les éléments suivants (Notes, Etudiants, Matières, A propos)
Afficher une alerte contenu le text de l’élément cliqué
Commit avec le message “Add menu”
Push
Session 02 : Gestion des listes dynamiques
Objectifs de la session :
Manipuler des listes d'objets
Utiliser de tableaux
Gestion d'événements
Utilisation de librairies (eg. material ui)
Gestion dynamique de contenu
Etape 1: Menu dynamique
Modifier le composant du Menu pour utiliser une liste afin d'éviter la répétition de codes
Faire en sorte que l'item selectionné dans le menu soit actif
Créer un composent dédié permettant d'afficher le contenu lié au menu selectionné.
Pour l'instant, afficher simplement un text avec le nom du menu dans le contenu de chaque composant, on les complètera dans les étapes suivantes

Commit avec le messaage "TD04 : Gestion de menu dynamique"
Etape 2: Gestion de données des composants
Dans cette section, vous allez gérer le contenu des composants liés au menu en utilisant des liste d'objects statiques. Pour cela, récupérer le fichier data.json et importez les dans un dossier data de votre projet.

Attention, cette étape contient plusieurs tâches, une par menu

Mettre à jour les dépendances du projet en y intégrant les libraries material ui [https://mui.com/material-ui/getting-started/installation/]
Se familliariser avec les composants Table [https://mui.com/material-ui/react-table/] -- Commencer par le Basic Table pour l'instant
Utiliser les données du fichier data.js pour remplir le contenu des composants en utilisant des tableaux
Commmiter avec le message "TD05: Remplir le contenu du composant [XXX]"
Push
Répéter les étapes 1 à 5 pour les composants Notes, Etudiants et Matières. Remplir le composant lié au Menu A propos avec vos coordonnées (eg. Ce projet est réalisé par XXX YYYY)

Etape 3: Optimisez la page
Mettre à jour le CSS pour avoir un rendu plus user-friendly
Optimisez l'affichage des données en incluant : la recherche, la pagination et l'ordonnancement (croissante/decroissante) des colonnes.
Ajoutez une animation quand on change de menu (eg. fadein/fadeout)