# Flying Dutchman 12

## General information

This is the repository for the development of the project "Flying Dutchman" of group 12 at Uppsala University in the masters course [User Interface Programming I](https://www.uu.se/en/admissions/exchange/courses/list/course-description/?kKod=1MD002&typ=1).

**Team members:**

-   [David Kopp](https://github.com/davidkopp)
-   [Paarth Sanhotra](https://github.com/PaarthSan)
-   [Rosemary Lima](https://github.com/Murka2022)
-   [Abdullah Abdullah](https://github.com/Abdullah30jul)

## Coordination

We use a WhatsApp group for quick communication and the GitHub project board for the organization of the tasks:
https://github.com/davidkopp/flying-dutchman/projects/1

## Development Setup

We use [EditorConfig](https://editorconfig.org/) to apply some configuration across various editors and IDEs.

**Recommended setup:**

-   Editor: [VS Code](https://code.visualstudio.com/)
-   Linting Tool: [ESLint](https://eslint.org/)
-   Server: [VS Code Live Server](https://ritwickdey.github.io/vscode-live-server/)
-   Unit Tests: [Jasmine](https://jasmine.github.io/)

**Enable ESLint:**

```bash
npm install --save-dev eslint
npm install --save-dev eslint-plugin-jasmine
npm install --save-dev eslint-plugin-jsdoc
```

**Run Unit Tests:**

Open `SpecRunner.html` in your browser.

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
    "authorEmail": "mail@example.com",
    "creationDateZero": "blank"
}
```
