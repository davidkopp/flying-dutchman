# Flying Dutchman 12

## General information

This is the repository for the development of the project "Flying Dutchman" of group 12 at Uppsala University in the masters course User Interface Programming I.

**Team members:**

-   [David Kopp](https://github.com/davidkopp)
-   [Paarth Sanhotra](https://github.com/PaarthSan)
-   [Rosemary Lima](https://github.com/Murka2022)

## Development Setup

We use [EditorConfig](https://editorconfig.org/) to apply some configuration across various editors and IDEs.

**Recommended setup:**

-   Editor: [VS Code](https://code.visualstudio.com/)
-   Linting Tool: [ESLint](https://eslint.org/)
-   Server: [VS Code Live Server](https://ritwickdey.github.io/vscode-live-server/)

**Enable ESLint:**

```bash
npm install --save-dev eslint
npm install --save-dev eslint-plugin-jsdoc
```

**File Headers:**

We have to add a file header to every file. You can use the VS Code extention [psioniq File Header](https://marketplace.visualstudio.com/items?itemName=psioniq.psi-header) to automatically add a header to every new file and to update the headers of files you edit.
The template is placed in the workspace settings: `.vscode/settings.json`.

To set the author information you can add the following to your user settings (change `author`, `initials` and `authorEmail`):

```json
"psi-header.config": {
    "forceToTop": true,
    "blankLinesAfter": 1,
    "author": "David Kopp",
    "initials": "DK",
    "authorEmail": "mail@davidkopp.de",
    "creationDateZero": "blank"
}
```
