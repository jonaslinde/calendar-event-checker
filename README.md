
# Exampel links to ics calendars

## Ibis
| Lag | Serie | Id | Kalender link |
|---|---|---|---|
| Malmö FBC Dam A| Svenska Superligan Damer | 4503 | https://api.innebandy.se/v2/api/calendars/team/4503 |
| Malmö FBC Dam U| Damer Div 2 Skåne | 41965 | https://api.innebandy.se/v2/api/calendars/team/41965 |
| Malmö FBC Dam JAS| Juniorallsvenskan H DJ18 | 41556 | https://api.innebandy.se/v2/api/calendars/team/41556 |
| Malmö FBC Dam Junior 18| Damjunior 18 Halland/Skåne | 41967 | https://api.innebandy.se/v2/api/calendars/team/41967 |
| IK Stanstad Dam A| Damer Div 2 Skåne |4164 | https://api.innebandy.se/v2/api/calendars/team/4164 |
| IK Stanstad F08/09| Pantamera Flickor A | 41958 | https://api.innebandy.se/v2/api/calendars/team/41958 |
| IK Stanstad F10/11| Pantamera Flickor B | 41963 | https://api.innebandy.se/v2/api/calendars/team/41963 |
| IK Stanstad F10/11| Pantamera Flickor C | 41962 | https://api.innebandy.se/v2/api/calendars/team/41962 |

### Sources
* [Svenska Superligan Damer](http://statistik.innebandy.se/ft.aspx?scr=table&ftid=40695)
* [Damer Div 2 Skåne](http://statistik.innebandy.se/ft.aspx?scr=table&ftid=41965)
* [Juniorallsvenskan H DJ18](http://statistik.innebandy.se/ft.aspx?scr=table&ftid=41556)
* [Damjunior 18 Halland/Skåne](http://statistik.innebandy.se/ft.aspx?scr=table&ftid=41967)
* [Pantamera Flickor A](http://statistik.innebandy.se/ft.aspx?scr=table&ftid=41958)
* [Pantamera Flickor B](http://statistik.innebandy.se/ft.aspx?scr=table&ftid=41963)
* [Pantamera Flickor C Svår](http://statistik.innebandy.se/ft.aspx?scr=table&ftid=41961)
* [Pantamera Flickor C](http://statistik.innebandy.se/ft.aspx?scr=table&ftid=41962)

## Sportadmin
| Lag | Kalender link | 
|---|---|
| Malmö FBC Dam A| https://publicweb.sportadmin.se/webcal?id=68aff6be-ccc0-40a1-8596-7deed0332be3 |
| Malmö FBC Dam U| https://publicweb.sportadmin.se/webcal?id=2618eb3b-7611-4e4a-925d-ff1c18dc1396 |
| Malmö FBC Dam JAS| https://publicweb.sportadmin.se/webcal?id=f2130b10-f469-4921-8f05-a495fd4bc5d5 |
| Malmö FBC Dam Junior 18| https://publicweb.sportadmin.se/webcal?id=df7d78af-d9b6-41c6-a6ec-dc499843338c |
| IK Stanstad Dam A| https://publicweb.sportadmin.se/webcal?id=2f11fa7e-191c-46f6-948f-05f9a48e582a |
| IK Stanstad F08/09| https://publicweb.sportadmin.se/webcal?id=28517d81-0b0e-4c7e-bdc9-37cd126cffac |
| IK Stanstad F10/11| https://publicweb.sportadmin.se/webcal?id=90667599-aa7e-4bc0-b9df-4790c8af0239 |

### Sources
* [Malmö FBC Dam A](https://malmofbc.web.sportadmin.se/start/?ID=183037)
* [Malmö FBC Dam U](https://malmofbc.web.sportadmin.se/start/?ID=183045)
* [Malmö FBC Dam JAS](https://malmofbc.web.sportadmin.se/start/?ID=264671)
* [Malmö FBC Dam Junior 18](https://malmofbc.web.sportadmin.se/start/?ID=183069)
* [IK Stanstad Dam A](https://ikstanstad.web.sportadmin.se/start/?ID=103171)
* [IK Stanstad F08/09](https://ikstanstad.web.sportadmin.se/start/?ID=119117)
* [IK Stanstad F10/11](https://ikstanstad.web.sportadmin.se/start/?ID=228248)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
