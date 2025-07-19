# RJMUN Website — Frontend

This is the **frontend** for the [RJMUN](https://rjmun.in) (Ramakrishna Junior Model United Nations) website, built using **React**, **TypeScript**, and **Vite**. It includes hot module replacement, ESLint rules, and modern tooling for a fast development experience.

> ⚠️ **Note**: This repository is **only one half** of the complete project. The backend is located here:
> 👉 [https://github.com/DebdipWritesCode/RJMUN-Backend](https://github.com/DebdipWritesCode/RJMUN-Backend)

---

## 🚀 Tech Stack 

* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [ESLint](https://eslint.org/) with TypeScript support
* [SWC](https://swc.rs/) or Babel for fast refresh (plugin-based)
* [Razorpay](https://razorpay.com/) integration for payment handling

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DebdipWritesCode/RJMUN-Frontend.git
cd RJMUN-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file at the root of the project with the following values:

```env
VITE_BACKEND_URL=
VITE_RAZORPAY_KEY_ID=
VITE_RAZORPAY_KEY_SECRET=
```

> 📝 Fill in the values based on the backend server and Razorpay credentials.

---

### 4. Start the Development Server

```bash
npm run dev
```

This will spin up the app at [http://localhost:5173](http://localhost:5173) with hot module reloading enabled.

---

## 🔍 Linting & Code Quality

This project uses a customizable ESLint configuration that supports type-aware lint rules with TypeScript. For production-quality apps, you can expand your configuration as needed:

```ts
// eslint.config.js (example snippet)
import { tseslint } from 'typescript-eslint'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

---

## 🛠 Build for Production

```bash
npm run build
```

The output will be placed in the `dist/` folder.

---

## 🧪 Preview the Production Build

```bash
npm run preview
```

---

## 📫 Contact & Contribute

If you'd like to contribute or report an issue, feel free to open a pull request or issue. For backend-related changes, check the [RJMUN Backend Repository](https://github.com/DebdipWritesCode/RJMUN-Backend).