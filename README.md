# Olympic Games App

Application Angular affichant les résultats olympiques par pays : dashboard (graphique en secteurs) et détail d’un pays (graphique en ligne).

Projet OpenClassRooms — Angular 22 (standalone).

## Prérequis

- [Node.js](https://nodejs.org/) **LTS** (v20 ou v22 recommandé)
- npm (inclus avec Node.js)

## Installation

```bash
npm install
```

## Lancer le projet

```bash
npm start
```

Puis ouvrir [http://localhost:4200/](http://localhost:4200/).

| Commande        | Description                          |
|-----------------|--------------------------------------|
| `npm start`     | Serveur de développement             |
| `npm run build` | Build de production (`dist/`)        |
| `npm test`      | Lancer les tests unitaires           |

## Fonctionnalités

- **Dashboard** : médailles par pays (pie chart), stats (nombre de JO / pays)
- **Détail pays** : évolution des médailles (line chart), stats (participations, médailles, athlètes)
- **Navigation** : clic ou clavier (Tab + flèches + Entrée) sur le pie pour ouvrir un pays
- **États UI** : loading (spinner), empty (« Aucune donnée »), error + bouton retour
- **404** : route wildcard pour URL ou pays inexistant
- **Responsive** : grille 4 / 8 / 12 colonnes (mobile / tablette / desktop)
- **Accessibilité** : contrastes AA, focus visible, `aria-label`, description textuelle des graphiques

## Structure

```
src/
├── app/
│   ├── core/
│   │   ├── constants/          # Messages d’erreur
│   │   └── services/           # OlympicService
│   ├── models/                 # Interfaces (Olympic, Participation, Stat)
│   ├── pages/
│   │   ├── dashboard/          # Accueil
│   │   ├── country-detail/     # Détail d’un pays
│   │   └── not-found/          # Page d’erreur
│   └── shared/components/
│       ├── header/             # Titre + stats
│       ├── chart/              # Graphiques Chart.js
│       └── spinner/            # Indicateur de chargement
└── assets/mock/
    └── olympic.json            # Données olympiques
```

### Routes

| URL             | Page          |
|-----------------|---------------|
| `/`             | Dashboard     |
| `/country/:id`  | Détail pays   |
| `/**` (autres)  | Not found     |

## Dépendances principales

| Package       | Rôle                                      |
|---------------|-------------------------------------------|
| Angular 22    | Framework (standalone, signals, router)   |
| Chart.js 4    | Graphiques pie & line                     |
| RxJS 7        | Observables (service / chargement)        |

Les données sont chargées depuis `assets/mock/olympic.json` via `OlympicService` (`HttpClient`).

## Auteur

WN59 | Projet réalisé dans le cadre de la formation OpenClassRooms (Projet2).
