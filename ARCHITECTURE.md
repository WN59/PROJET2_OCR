# Architecture — Olympic Games Starter

Documentation de l’application Angular après refactoring. 

## 1. Arborescence

```text
src/app/
├── app.component.ts          
├── app.config.ts             
├── app.routes.ts             # Routes lazy-loadées
├── core/
│   └── services/
│       └── olympic.service.ts    # Accès aux données olympiques
├── shared/
│   └── components/
│       ├── header/               # Header réutilisable avec titre + statistiques liés à un pays et sa participation au JO
│       └── chart/                # Graphique réutilisable et personnalisable
├── pages/
│   ├── dashboard/                # Vue d’ensemble des pays avec graphique
│   ├── country-detail/           # Détail d'un pays avec graphique
│   └── not-found/                # Page 404
├── models/
│   ├── olympic.interface.ts       # Interface de typage de données
│   ├── participation.interface.ts
│   └── stat.interface.ts
└── data/
    └── olympic.mock.ts           # Données mock 
```


## 2. Choix techniques globaux

- **Composants standalone** : plus de `NgModule`.
- **Lazy loading** : chaque page est chargée avec `loadComponent` dans `app.routes.ts`.
- **OnPush + signals** : état local réactif dans les pages ; inputs/outputs et signaux dans les composants.
- **Typage fort** : interfaces `Olympic`, `Participation`, `Stat` — plus de `any` sur les données récupérése.

## 3. Composants et rôles

### Racine

| Élément | Rôle |
|--------|------|
| `AppComponent` | Point d’entrée UI : affiche uniquement le `<router-outlet>`. |
| `app.routes.ts` | Définit les routes : `/` (dashboard), `/country/:countryName` (détail), `**` (not-found). |

### Pages

| Composant | Rôle |
|-----------|------|
| **Dashboard** | Affiche le titre, les stats globales (nombre de pays, nombre de JO) et un graphique **camembert** des médailles par pays. Au clic sur une part, navigue vers le détail du pays. |
| **Country-detail** | Affiche le détail d’un pays (entrées, médailles, athlètes) et un graphique **courbe** des médailles par année. Redirige vers not-found si le pays est inconnu. |
| **Not-found** | Page d’erreur pour les URLs invalides (route wildcard). |

Les pages **consomment** le `OlympicService` : elles ne lisent plus directement le mock/JSON. Elles se chargent de la transformation pour l’affichage (labels/data du graphique, tableau de `Stat`) et de la navigation.

### Composants partagés

| Composant | Rôle |
|-----------|------|
| **Header** | Affiche un titre et une liste optionnelle de statistiques (`Stat[]` : label + value). Réutilisé sur l'ensemble des pages |
| **Chart** | Permet d'afficher un graphique avec la librairie Chart.js. Reçoit le type (`pie` / `line`), labels, data, couleurs, etc. Émet un événement `chartClick` pour la navigation depuis le dashboard vers un pays cible. |


## 4. Service Angular : `OlympicService`

**Fichier :** `src/app/core/services/olympic.service.ts`  

### Rôle

Centraliser l’accès aux données olympiques. Les composants demandent des données au service ; ils ne connaissent pas la source concrète (mock aujourd’hui, API demain).

### API actuelle

| Méthode | Description |
|---------|-------------|
| `getOlympics()` | Retourne `Observable<Olympic[]>` — liste complète des pays. |
| `getOlympicByCountry(countryName)` | Retourne un pays par nom, ou `undefined`. |
| `getOlympicById(id)` | Retourne un pays par identifiant, ou `undefined`. |

Source actuelle : `data/olympic.mock.ts` via `of()`.

### Usage dans l’app

- **Dashboard** → `getOlympics()` puis calcul des stats et du graphique pie chart.
- **Country-detail** → `getOlympicByCountry(countryName)` puis calcul des stats et du graphique line chart.

## 5. Préparation à une API / back-end

L’architecture est déjà prête pour brancher un vrai back-end sans refonte des pages :

1. **Point unique de changement** : remplacer dans `OlympicService` le `of(olympicMock)` par un `HttpClient.get<Olympic[]>('...')`.
2. **Contrats stables** : les interfaces `Olympic` / `Participation` définissent le format attendu de l’API.
3. **Pages inchangées** : elles s’abonnent déjà à des `Observable` ; un appel HTTP s’intègre naturellement.
4. **Évolutions possibles** : URL dans `environment.ts`, gestion d’erreur centralisée dans le service, route par `id` plutôt que par nom de pays (plus robuste pour l’API).

## 6. Flux de données (vue d’ensemble)

```text
olympic.mock.ts  →  OlympicService  →  Pages (dashboard / country-detail)
                                              ↓
                                    Header + Chart (affichage)
```

En résumé : **données** (service + models) séparées de **présentation** (pages + shared), ce qui clarifie les responsabilités et facilite l’évolution vers une API réelle.
