# Architecture — Olympic Games Starter

Documentation de l’application Angular après refactoring.

## 1. Arborescence

```text
src/app/
├── app.component.ts
├── app.config.ts
├── app.routes.ts                 # Routes lazy-loadées
├── core/
│   ├── constants/
│   │   └── error-messages.ts     # Messages d’erreur utilisateur
│   └── services/
│       └── olympic.service.ts    # Accès aux données olympiques
├── shared/
│   └── components/
│       ├── header/               # Header réutilisable avec titre de page et statistiques optionnels.
│       ├── chart/                # Graphique Chart.js (pie / line)
│       └── spinner/              # Indicateur de chargement
├── pages/
│   ├── dashboard/                # Vue d’ensemble (pie chart)
│   ├── country-detail/           # Détail d’un pays (line chart)
│   └── not-found/                # Page 404 / pays et page introuvable
├── models/
│   ├── olympic.interface.ts # Interface pour le typage des données
│   ├── participation.interface.ts
│   └── stat.interface.ts
└── data/
    └── olympic.mock.ts           # Données mock
```

## 2. Choix techniques globaux

- **Composants standalone** : plus de `NgModule`.
- **Lazy loading** : chaque page est chargée avec `loadComponent` dans `app.routes.ts`.
- **OnPush + signals** : état local réactif dans les pages ; `input()` / `output()` dans les composants partagés.
- **Typage fort** : interfaces `Olympic`, `Participation`, `Stat` — plus de `any` sur les données.
- **États UI** : loading / empty / error gérés dans les pages (spinner, message d'erreur, bouton retour).
- **Responsive** : grille CSS 4 / 8 / 12 colonnes (mobile / tablette / desktop).
- **Accessibilité** : contrastes AA, focus visible, `aria-label`, description textuelle des graphiques.

## 3. Composants et rôles

### Racine

| Élément | Rôle |
|--------|------|
| `AppComponent` | Point d’entrée UI : affiche uniquement le `<router-outlet>`. |
| `app.routes.ts` | Routes : `/` (dashboard), `/country/:id` (détail), `**` (not-found). |

### Pages

| Composant | Rôle |
|-----------|------|
| **Dashboard** | Titre, stats globales (nombre de JO, nombre de pays) et graphique **camembert** des médailles par pays. Clic ou clavier sur une part → navigation vers `/country/:id`. |
| **Country-detail** | Détail d’un pays (entrées, médailles, athlètes) et graphique **courbe** des médailles par année. Redirige vers not-found si l’id / le pays est inconnu. |
| **Not-found** | Page d’erreur pour les URLs invalides (wildcard) et les redirections (message via `router.state`). |

Les pages `consomment` le OlympicService : elles ne lisent plus directement le mock/JSON. Elles se chargent de la transformation pour l’affichage (labels/data du graphique, tableau de Stat) et de la navigation.

### Composants partagés

| Composant | Rôle |
|-----------|------|
| **Header** | Affiche un titre et une liste optionnelle de statistiques (`Stat[]` : label + value). Réutilisé sur l’ensemble des pages. |
| **Chart** | 	Permet d'afficher un graphique avec la librairie Chart.js. Reçoit le type (`pie` / `line`), labels, data, couleurs, etc. Émet un événement chartClick pour la navigation depuis le dashboard vers un pays cible. |
| **Spinner** | Indicateur de chargement réutilisable (`role="status"`). |

### Constantes

| Élément | Rôle |
|---------|------|
| `error-messages.ts` | Messages centralisés (URL inexistante, pays introuvable, données vides, échec de chargement). |

## 4. Service Angular : `OlympicService`

**Fichier :** `src/app/core/services/olympic.service.ts`

### Rôle

Centraliser l’accès aux données olympiques. Les composants demandent des données au service ; ils ne connaissent pas la source concrète (mock aujourd’hui, API demain).

### API actuelle

| Méthode | Description |
|---------|-------------|
| `getOlympics()` | Retourne `Observable<Olympic[]>` — liste complète des pays. |
| `getOlympicById(id)` | Retourne `Observable<Olympic \| undefined>` — un pays par identifiant. |

Source actuelle : `data/olympic.mock.ts` via `of(...).pipe(delay(...))` (le delay simule un chargement pour afficher le spinner).

### Usage dans l’app

- **Dashboard** → `getOlympics()` puis calcul des stats et affichage du pie chart ; navigation par `id` trouvé via le nom du pays cliqué.
- **Country-detail** → `getOlympicById(id)` (paramètre de route `country/:id`) puis calcul des stats et affichage du line chart.

## 5. Gestion des erreurs (côté utilisateur)

| Cas | Comportement |
|-----|--------------|
| URL inexistante | Route `**` → page not-found (message par défaut). |
| Pays / id inexistant | Redirection vers not-found avec message via `navigateByUrl(..., { state })`. |
| Données manquantes | Message « Aucune donnée » sur la page concernée. |
| Échec de chargement | Message d’erreur + bouton retour sur la page concernée. |

## 6. Préparation à une API / back-end

L’architecture est prête pour brancher un vrai back-end sans refonte des pages :

1. **Point unique de changement** : remplacer dans `OlympicService` le `of(olympicMock)` par un `HttpClient.get<Olympic[]>('...')`.
2. **Contrats stables** : les interfaces `Olympic` / `Participation` définissent le format attendu de l’API.
3. **Pages inchangées** : elles s’abonnent déjà à des `Observable` ; un appel HTTP s’intègre naturellement.
4. **Évolutions possibles** : URL dans `environment.ts`, cache (`shareReplay`), gestion d’erreur encore plus centralisée dans le service.

## 7. Flux de données (vue d’ensemble)

```text
olympic.mock.ts  →  OlympicService  →  Pages (dashboard / country-detail)
                                              ↓
                         Header + Chart + Spinner (affichage / états)
                                              ↓
                         Not-found (URL ou pays introuvable)
```

En résumé : **données** (service + models) séparées de **présentation** (pages + shared), avec une gestion d’erreurs et d’états UI explicite, ce qui clarifie les responsabilités et facilite l’évolution vers une API réelle.
