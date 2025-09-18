# EventHour Landing Pages - Claude Documentation

## 📋 Projekt-Übersicht

**Stand:** 11. September 2025  
**Projekt:** EventHour - Plattform für Erlebnisse und Gutscheine  
**URL:** https://flighthourlandingp.immogear.de  
**Repository:** https://github.com/airbussard/flighthour-landing-pages

### Statistiken
- **Codezeilen:** ~26.000
- **TypeScript/TSX:** 17.862 Zeilen (68,6%)
- **Dateien:** 123 TypeScript/TSX, 7 JS/JSX, 4 CSS

## 🛠 Technologie-Stack

### Core
- **Framework:** Next.js 14.2.3 (App Router)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom @eventhour/ui Package
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Deployment:** Docker/CapRover
- **Build Tool:** Turborepo (Monorepo)

### Struktur
```
/apps
  /web         - Hauptwebsite & Kundenportal
  /admin       - Admin-Dashboard
  /partner     - Partnerportal
/packages
  /ui          - Wiederverwendbare UI-Komponenten
  /database    - Datenbankzugriff (Supabase)
  /auth        - Authentifizierung
  /consent     - Cookie-Consent
  /payments    - Zahlungsabwicklung
```

## ✅ Implementierte Features

### 1. **Kundenbereich (Komplett implementiert)**
- ✅ Registrierung mit E-Mail-Bestätigung
- ✅ Login mit Rolle-basierter Weiterleitung
- ✅ Passwort vergessen Funktion
- ✅ Konto-Dashboard mit Statistiken
- ✅ Profilverwaltung
- ✅ Bestellhistorie
- ✅ Gutscheinverwaltung
- ✅ Passwort ändern

### 2. **E-Mail-Bestätigung**
- ✅ Bestätigungsroute `/auth/confirm`
- ✅ Client-seitige Token-Verarbeitung
- ✅ Deutsches E-Mail-Template
- ✅ Erfolgs-/Fehlermeldungen

### 3. **Homepage & Suche**
- ✅ Landingpage mit Hero-Section
- ✅ Beliebte Erlebnisse
- ✅ Kategorien-Übersicht
- ✅ Suchfunktion mit Filtern
- ✅ Erlebnis-Detailseiten

### 4. **Admin-Bereich**
- ✅ Dashboard mit Statistiken
- ✅ Erlebnisse verwalten (CRUD)
- ✅ Bildupload mit Drag & Drop
- ✅ Partner-Verwaltung
- ✅ Bestellungen einsehen
- ✅ Benutzer-Verwaltung

### 5. **UI/UX**
- ✅ Responsive Design
- ✅ EventHour Branding (Gelb/Schwarz)
- ✅ Logo mit Light/Dark Variante
- ✅ Payment Icons
- ✅ Cookie-Consent Banner
- ✅ Ladeanimationen

## ⚙️ Wichtige Konfigurationen

### Supabase Dashboard Einstellungen

#### Authentication → URL Configuration
```
Site URL: https://flighthourlandingp.immogear.de
Redirect URLs:
- https://flighthourlandingp.immogear.de/*
- http://localhost:3000/*
```

#### Authentication → Email Templates → Confirm signup
```html
{{ .SiteURL }}/auth/confirm#access_token={{ .Token }}&type=signup
```
*Oder verwende das custom HTML-Template aus `supabase-email-template-confirm-signup.html`*

### Umgebungsvariablen (.env.production)
```env
NEXT_PUBLIC_SUPABASE_URL="https://chmbntoufwhhqlnbapdw.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
NEXT_PUBLIC_SITE_URL="https://flighthourlandingp.immogear.de"
```

## 🔑 Wichtige Passwörter & Zugänge

### Website-Passwort (EventHour Seite)
- **Passwort:** `flighthourwins` (in PasswordProtection.tsx)

### Admin-Zugang
- **E-Mail:** admin@eventhour.de
- **Rolle:** Hardcoded in AuthService

## 🐛 Bekannte Issues & Lösungen

### 1. E-Mail-Bestätigung
**Problem:** "Email not confirmed" Fehler beim Login  
**Lösung:** 
- Implementierte `/auth/confirm` Route für Hash-Token-Verarbeitung
- `emailRedirectTo` in signUp hinzugefügt
- Client-seitige Token-Verarbeitung

### 2. Footer Logo Sichtbarkeit
**Problem:** Dunkles "HOUR" auf dunklem Footer  
**Lösung:** Logo-Komponente mit `variant="light"` Option erweitert

### 3. Bilder in Suchansicht
**Problem:** Bilder wurden nicht angezeigt  
**Lösung:** `experience_images` Relation in SearchService hinzugefügt

## 📝 Nächste Schritte / TODOs

### Priorität Hoch
- [ ] Checkout/Bezahlprozess implementieren
- [ ] Stripe/PayPal Integration
- [ ] Gutschein-Einlösung
- [ ] PDF-Generierung für Gutscheine

### Priorität Mittel
- [ ] Partner-Portal Features erweitern
- [ ] E-Mail-Benachrichtigungen
- [ ] Erweiterte Suchfilter
- [ ] Bewertungssystem

### Priorität Niedrig
- [ ] Mehrsprachigkeit
- [ ] Social Media Integration
- [ ] Analytics Dashboard
- [ ] A/B Testing

## 🚀 Wichtige Befehle

### Entwicklung
```bash
# Entwicklungsserver starten
npm run dev

# Build erstellen
npm run build

# Linting
npm run lint

# Type-Check
npm run type-check
```

### Git
```bash
# Commit mit Co-Author
git commit -m "feat: Beschreibung

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Deployment
```bash
# Automatisches Deployment via GitHub Actions
git push origin main
```

## 📚 Projektstruktur Details

### Datenbank-Schema (Supabase)
- `users` - Benutzer mit Rollen (CUSTOMER, PARTNER, ADMIN)
- `customer_profiles` - Erweiterte Kundendaten
- `experiences` - Erlebnisse/Produkte
- `experience_images` - Bilder zu Erlebnissen
- `partners` - Partner-Informationen
- `orders` - Bestellungen
- `order_items` - Bestellpositionen
- `vouchers` - Gutscheine
- `categories` - Kategorien

### API-Routen
- `/api/auth/*` - Authentifizierung
- `/api/customers/*` - Kundenbereich
- `/api/admin/*` - Admin-Funktionen
- `/api/partner/*` - Partner-Funktionen
- `/api/experiences/*` - Öffentliche Erlebnisse
- `/api/search` - Suche

## 🔒 Sicherheit

- Supabase Row Level Security (RLS) aktiviert
- Service Role Key nur server-seitig
- CORS konfiguriert für Production URL
- Passwort-Anforderungen implementiert
- E-Mail-Verifizierung erforderlich

## 📞 Support & Kontakt

Bei Fragen zum Code oder zur Implementierung:
- GitHub Issues: https://github.com/airbussard/flighthour-landing-pages/issues
- E-Mail: support@eventhour.de (fiktiv)

---

*Letzte Aktualisierung: 11. September 2025*  
*Erstellt mit Claude Code*