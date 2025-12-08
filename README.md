# Ichglaubs Bestellsystem

Ein modernes Bestellsystem basierend auf SvelteKit, TypeScript und Supabase.

## 📋 Übersicht

Das Ichglaubs Bestellsystem ist eine vollständige Webanwendung zur Verwaltung von Bestellungen. Es bietet Authentifizierung, Dashboard-Funktionalität und eine Admin-Oberfläche.

## 🚀 Features

- **Benutzerauthentifizierung** - Login und Registrierung mit Supabase Auth
- **Dashboard** - Übersichtliche Darstellung von Bestellungen
- **Admin-Bereich** - Verwaltungsfunktionen für Administratoren
- **Responsive Design** - Mit TailwindCSS und DaisyUI
- **TypeScript** - Typsichere Entwicklung
- **Realtime Updates** - Dank Supabase

## 🛠️ Tech Stack

- **Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Sprache:** TypeScript
- **Backend/DB:** [Supabase](https://supabase.com/)
- **Styling:** 
  - [TailwindCSS](https://tailwindcss.com/)
  - [DaisyUI](https://daisyui.com/)
- **Deployment:** Vercel (Adapter konfiguriert)

## 📦 Installation

### Voraussetzungen

- Node.js (empfohlen: siehe `.tool-versions`)
- pnpm (oder npm/yarn)
- Supabase Account und Projekt

### Setup

1. **Repository klonen:**
   ```bash
   git clone <repository-url>
   cd ichglaubs-ordersystem
   ```

2. **Dependencies installieren:**
   ```bash
   pnpm install
   ```

3. **Umgebungsvariablen einrichten:**
   
   Erstelle eine `.env` Datei im Root-Verzeichnis:
   ```env
   PUBLIC_SUPABASE_URL=deine-supabase-url
   PUBLIC_SUPABASE_KEY=dein-supabase-anon-key
   ```

4. **Supabase Projekt einrichten:**
   - Erstelle ein neues Projekt in [Supabase](https://app.supabase.com/)
   - Konfiguriere die benötigten Tabellen in deiner Datenbank
   - Kopiere die URL und den Anon-Key in deine `.env` Datei

## 🏃‍♂️ Entwicklung

### Development Server starten

```bash
pnpm dev
```

Die Anwendung ist dann unter `http://localhost:5173` erreichbar.

### Mit Browser öffnen

```bash
pnpm dev -- --open
```

## 🔨 Build & Deployment

### Production Build erstellen

```bash
pnpm build
```

### Production Build lokal testen

```bash
pnpm preview
```

### Deployment

Das Projekt ist für Vercel konfiguriert (`@sveltejs/adapter-vercel`). 

Für Deployment auf Vercel:
1. Repository mit Vercel verbinden
2. Umgebungsvariablen in Vercel setzen
3. Deploy ausführen

## 🧪 Code Quality

### Type-Checking

```bash
pnpm check
```

Mit Watch-Modus:
```bash
pnpm check:watch
```

### Linting

```bash
pnpm lint
```

### Code-Formatierung

Code formatieren:
```bash
pnpm format
```

Formatierung überprüfen:
```bash
prettier --check --plugin-search-dir=. .
```

## 📁 Projektstruktur

```
ichglaubs-ordersystem/
├── src/
│   ├── components/          # Wiederverwendbare Svelte-Komponenten
│   │   ├── Drawer.svelte
│   │   ├── LeftMenu.svelte
│   │   ├── NavigationMenu.svelte
│   │   ├── OrderMenuContent.svelte
│   │   └── ...
│   ├── lib/                 # Shared Libraries
│   │   ├── db.ts           # Supabase Client Setup
│   │   ├── dbAPI.ts        # Datenbank API Funktionen
│   │   ├── stores.ts       # Svelte Stores
│   │   └── utils.ts        # Hilfsfunktionen
│   ├── routes/             # SvelteKit Routes
│   │   └── (app)/          # App Layout Group
│   │       ├── admin/      # Admin-Bereich
│   │       ├── dashboard/  # Dashboard
│   │       ├── logout/     # Logout-Route
│   │       └── signup/     # Registrierung
│   ├── app.css             # Globale Styles
│   ├── app.html            # HTML Template
│   └── hooks.server.ts     # Server Hooks (Auth)
├── static/                 # Statische Assets
└── package.json
```

## 🔐 Authentifizierung

Das Projekt nutzt Supabase Auth mit den `@supabase/auth-helpers-sveltekit`. Die Authentifizierung wird über Server-Hooks (`hooks.server.ts`) verwaltet.

## 🎨 Styling

Das Projekt verwendet:
- **TailwindCSS** für Utility-First CSS
- **DaisyUI** für vorgefertigte UI-Komponenten
- **Autoprefixer** für Browser-Kompatibilität

Konfigurationsdateien:
- `tailwind.config.cjs`
- `postcss.config.cjs`

## 📝 Lizenz

Alle Rechte vorbehalten.

## 👨‍💻 Entwicklung

Entwickelt mit ❤️ unter Verwendung von SvelteKit und Supabase.