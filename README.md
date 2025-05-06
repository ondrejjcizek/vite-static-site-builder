# ⚡ Vite Static Builder

A powerful and flexible Vite-based static site builder with:

- ✨ Handlebars partials & metadata injection
- ✉️ MJML email template compilation
- 🖼 Image optimization with WebP output
- 🔤 Icon font generation from SVGs
- 🛠 Custom plugin support
- 🎨 Stylus-based styling system

---

## 📦 Clean Build Output

After building, your output will look like this:

```
build/
├── assets/
│   ├── css/
│   ├── img/
│   ├── js/
│   ├── other/
│   └── webmanifest/
├── about.html
└── index.html
```

---

## 📁 Project Structure

```
src/
├── index.html
├── about.html
├── _metadata.json
├── icons/
├── partials/
├── fonts/
├── js/
├── img/
├── mails/
├── css/
```

---

## 🔧 Getting Started

```bash
pnpm install       # Install dependencies
pnpm dev           # Start dev server
pnpm build         # Build project to `build/`
pnpm preview       # Preview production build
```

---

## 📋 Scripts

```bash
pnpm lint          # Lint all files
pnpm fix           # Auto-fix lint issues
```

---

## 🔌 Custom Vite Plugins

### 🔤 `fantasticonPlugin`

- Generates icon fonts from `src/icons/`
- Outputs: `.woff`, `.woff2`, `.svg`, preview HTML + CSS variables

### 🖼 `sharpPlugin`

- Optimizes images using `sharp` and `svgo`
- Adds `.webp` versions
- Excludes: favicon, `og.png`, `fantasticon.svg`

### ✉️ `mjmlCompilator`

- Compiles MJML emails from `src/mails/mjml/` to HTML
- Live reload during development

### 🧩 `postBuild`

- Fixes asset paths in CSS (e.g., `/assets/` ➝ relative)

---

## 🧪 Tech Stack

- **Vite** — bundler and dev server
- **Handlebars** — templating engine
- **Stylus** — CSS preprocessor
- **MJML** — email markup language
- **Lefthook** — Git hooks
- **Prettier + ESLint** — code formatting

---

## 📄 License

MIT
