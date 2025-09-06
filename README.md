# Eventhour - Erlebnisportal

Ein modernes Erlebnisportal built mit Next.js 14, Turborepo und Supabase.

## 🚀 Projekt-Struktur

Dies ist ein Turborepo Monorepo mit folgenden Apps und Packages:

### Apps

- `web` - Hauptportal für Kunden (Port 3000)
- `admin` - Admin-Dashboard (Port 3001)
- `partner` - Partner-Portal (Port 3002)

### Packages

- `@eventhour/ui` - Gemeinsame UI-Komponenten
- `@eventhour/database` - Prisma Schema und Datenbank-Utils
- `@eventhour/auth` - Authentifizierungs-Logik
- `@eventhour/payments` - Payment-Provider (Debug & Stripe)
- `@eventhour/consent` - DSGVO Cookie-Management

## 📦 Installation

```bash
# Dependencies installieren
npm install

# Prisma Setup
npm run db:push
npm run db:seed
```

## 🛠️ Entwicklung

```bash
# Alle Apps im Dev-Modus starten
npm run dev

# Einzelne App starten
npm run dev --filter=@eventhour/web

# Build
npm run build

# Lint
npm run lint

# Type-Check
npm run type-check
```

## 🎨 Design-System

Das Projekt verwendet das Eventhour Design-System:

- **Primärfarbe**: Gelb (#FBB928)
- **Sekundärfarbe**: Schwarz (#000001)
- **Schriftarten**: ITC Avant Garde Gothic (Headlines), Poppins (Text)
- **Komponenten**: Button-System, Cards, Forms mit Tailwind CSS
- **Animationen**: Framer Motion für Scroll-Animationen

## 🔐 Environment Variables

Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/eventhour"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx"
SUPABASE_SERVICE_ROLE_KEY="eyJxxx"

# Payment (Debug-Modus)
PAYMENT_MODE=debug
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
```

## 📚 Dokumentation

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)

## 🚢 Deployment

Das Projekt ist für CapRover-Deployment vorbereitet. Siehe `Dockerfile` und `captain-definition` für Details.

## 📝 Lizenz

Proprietary - Alle Rechte vorbehalten
