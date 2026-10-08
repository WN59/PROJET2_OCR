# Notes d'architectures et mauvaises pratiques

## Généralités

- Trop d'utilisation de la balise div, il y en a des autres plus pertinentes à utiliser (section, article, etc...)
- Les composants des pages ont plusieurs responsabilités (récupérations de données, logiques métiers, transformation de données, affichage etc...)
- Aucune architecture/organisation du projet, il y a seulement un dossier pages, pas de dossiers services, models, composants réutilisables etc...


## Fichiers

### `app-routing.module.ts`

- Pour la route 'country/:countryName', il est préférable d'envisager l'utilisation d'un id (on peut avoir des problèmes selon le nom du pays, si il comporte des accents, tirets etc...).
- La route 'not-found' n'est pas forcément nécessaire si utilisation de la route wildcard.


## Dossiers

### Pages


#### Composant Home


##### `pages/home/home.component.html`

- Trop d'utilisation de la balise div, il y en a des autres plus pertinentes à utiliser (section, article, etc...)


##### `pages/home/home.component.ts`

- Le composant a trop de responsabilités, il est trop lourd : requête HTTP, transformation des données, calculs, création de graphique, gestion des événements du graphique et navigation.
- Appel HTTP directement dans le composant : il faudrait déplacer l'accès aux données dans un service .
- Utilisation de any non recommandé pour les données : il faudrait créer des interfaces représentant les données .
- Logique de transformation et de calcul de données directement dans le composant : il faudrait déplacer cela vers un service.
- Gestion de Chart.js directement dans le composant de page : il faudrait créer un composant dédié au graphique.
- pipe() vide et donc inutile avant subscribe, on n'extrait/filtre/trie aucune donnée de celui-ci.
- Présence de console.log() dans le composant
- Propriété error renseignée mais pas utilisé dans le html.
- {{ pieChart }} dans le canvas ne sert à rien.
- Les propriétés  comme titlePage pourraient être readonly, on ne les manipules pas spécialement.


#### Composant Country

##### `pages/home/country.component.html`

- Trop d'utilisation de la balise div, il y en a des autres plus pertinentes à utiliser (section, article, etc...)

##### `pages/home/country.component.ts`

- Le composant a trop de responsabilités, il est trop lourd : requête HTTP, transformation des données, calculs, création de graphique, gestion des événements du graphique et navigation.
- Appel HTTP directement dans le composant : il faudrait déplacer l'accès aux données dans un service .
- Utilisation de any non recommandé pour les données : il faudrait créer des interfaces représentant les données .
- Logique de transformation et de calcul de données directement dans le composant : il faudrait déplacer cela vers un service.
- Gestion de Chart.js directement dans le composant de page : il faudrait créer un composant dédié au graphique.
- Propriété error renseignée mais pas utilisé dans le html.


#### Composant Not-found

##### `pages/home/not-found.component.html`

- Utilisation de la balise div non pertinente (on aurait pu utilisé une section)