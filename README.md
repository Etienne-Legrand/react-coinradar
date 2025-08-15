# Coin Radar

Coin Radar est une extension Chromium qui permet de suivre les prix des 10 crypto les plus capitalisées en temps réel.

![Démo de l'application](src/assets/demo.png)

## Fonctionnalités

- Affiche les 10 crypto les plus capitalisées en temps réel.
- Actualisation automatique des prix toutes les 10 secondes.
- Choix de la devise d'affichage (USD, EUR, BTC).
- Sélection de la plateforme d'échange pour les données de prix.
- Graphiques sur 7 jours par crypto.
- Mode sombre/clair.

## Prérequis

1. Node.js 18+
2. pnpm (recommandé) ou npm
3. Navigateur Chromium

## Installation en mode développeur

1. Clonez ce dépôt sur votre machine locale.
2. Installez les dépendances avec `pnpm install`.
3. Construisez l'extension avec `pnpm build`.
4. Ouvrez votre navigateur et accédez à `chrome://extensions/` sur Google Chrome.
5. Activez le **Mode développeur** en haut à droite de la page.
6. Cliquez sur le bouton **Charger l'extension non empaquetée** et sélectionnez le dossier `dist` généré.
7. L'extension devrait maintenant apparaître dans la liste des extensions installées.

## Utilisation

1. Cliquez sur l'icône de l'extension dans la barre d'outils de Chrome pour ouvrir l'interface.
