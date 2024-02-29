# TODO

set cookie's secure to true

modifier création de jeu pour choisir si le forul doit être publique + rajouter en DB une ligne isPublic

Ajout d'une liste d'utilisateur avec modfication possible de certaines informations, ajout de pagination syr cette derniere ainsi que pour la liste des différents poste. Création d'un espace profil pour tout les utilisateurs où ils pourront modifier leur adresse mail et leur mot de passe. Gestion des images lors de l'ajout et modification des postes et des réponses. La semaine prochaine sera orienté vers la sécurisation des différentes requetes, , le reformatage du code afin d'améliorer la lecture, ainsi que le design front-end du site.

Le projet avance à grand pas, les fonctionnalités principales sont désormais terminées, les travaux restants se concentre autour de l'architecture du projet, éliminer les failles de sécurité restantes, réutiliser le code utilisé à plusieurs endroits et réaliser le design front-end du site. Lors de cette dernière semaine, j'ai restructuré la partie back-end du projet et ajouté un error handler global. Il me parait raisonable de penser que je suis capable d'opérer en toute autonomie pour la fin de ce projet et au delà.

Bilan de l'avancée du projet, Thomas m'a montré ce qu'il a fait. C'est structuré, code "joli".
Quelques vérifications supplémentaires à réaliser pour éviter les requêtes inutiles.
Back sécurisé, aucune faille de sécurité.
L'ensemble du CRUD est là. Des requêtes avec des COUNT(), ORDER BY, INNER JOIN, LEFT JOIN, GROUP BY, ...
Un DISTINCT sera cool.
Améliorer la partie qui touche à l'age de l'utilisateur et donc du cookie.
Améliorer la partie "role" avec un INNER JOIN avec la table "role"
Il restera à réaliser un HTML structuré avec les bonnes balises sémantiques et le CSS avec SASS
+ commenter le code au endroit stratégique(requete SQL complexe)
+ empecher les emails avec +1 