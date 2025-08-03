# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektübersicht

**Flighthour Landing Pages** - Marketing-Landing-Pages für Flighthour.de

- **Sprache**: Deutsch (Code-Kommentare und UI)
- **Framework**: Next.js 14 mit App Router
- **Styling**: Tailwind CSS
- **Animationen**: Framer Motion
- **Deployment**: CapRover
- **Erste Landing Page**: Flighthour als Geburtstagsgeschenk

## Design-System (basierend auf flighthour.de)

### Farben

- Primär: Gelb (#FBB928)
- Sekundär: Schwarz (#000001)
- Neutral: Weiß, Grautöne

### Typografie

- Hauptschrift: ITC Avant Garde Gothic
- Sekundärschrift: Poppins
- Gewichtungen: 400, 500, 700

### UI-Komponenten

- Abgerundete Buttons (10px Radius)
- Klare Call-to-Actions
- Grid-basiertes Layout

## Entwicklungsbefehle

```bash
# Installation
npm install

# Entwicklungsserver starten
npm run dev

# Production Build
npm run build

# Production Server starten
npm start

# Code-Qualität prüfen
npm run lint
npm run type-check

# Tests ausführen
npm test
```

## Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root Layout mit Metadaten
│   ├── page.tsx           # Homepage (Geburtstagsgeschenk)
│   └── globals.css        # Globale Styles
├── components/            # React Komponenten
│   ├── ui/               # Wiederverwendbare UI-Komponenten
│   ├── sections/         # Landing Page Sektionen
│   └── layout/           # Layout-Komponenten (Header, Footer)
├── lib/                   # Utility-Funktionen
├── public/               # Statische Assets
│   ├── images/           # Bilder und Grafiken
│   └── fonts/            # Lokale Schriftarten
├── styles/               # Zusätzliche Styles
├── types/                # TypeScript Definitionen
└── config/               # Konfigurationsdateien

```

## SEO-Strategie

- Meta-Tags für jede Seite
- Open Graph Tags für Social Media
- Strukturierte Daten (JSON-LD)
- Optimierte Bilder mit Next.js Image
- Sitemap.xml und robots.txt

## Deployment mit CapRover

1. **Dockerfile** für Next.js Standalone Build
2. **captain-definition** mit korrekter Konfiguration
3. Umgebungsvariablen in CapRover setzen
4. GitHub Repository als App-Source verbinden

## Medien-Platzhalter

Die Landing Page verwendet Platzhalter für folgende Medien:

- **Hero-Bild**: Glückliches Geburtstagskind im Flugsimulator (1920x1080)
- **Zielgruppen**: Split-Screen Jung/Alt (je 800x600)
- **Paket-Icons**: SVG-Icons für Erlebnispakete
- **Testimonial-Fotos**: Portraits zufriedener Kunden (400x400)

## Links zu Flighthour.de

Alle rechtlichen Links verweisen auf die Hauptseite:

- Impressum: https://flighthour.de/impressum
- AGB: https://flighthour.de/agb
- Datenschutz: https://flighthour.de/datenschutz

## Entwicklungshinweise

- Alle Komponenten sind in TypeScript geschrieben
- Verwende Tailwind-Klassen für konsistentes Styling
- Framer Motion für Scroll-Animationen und Übergänge
- Mobile-First Responsive Design
- Barrierefreiheit (ARIA-Labels, Semantic HTML)

## Git Workflow für Claude

### Automatisches Commit & Push

Nach jeder Änderung am Code sollst du:

1. **ESLint prüfen**: `npm run lint`
2. **TypeScript prüfen**: `npm run type-check`
3. **Prettier formatieren**: `npm run format` (falls vorhanden)
4. **Git commit**: Mit aussagekräftiger Nachricht
5. **Git push**: Änderungen zu GitHub pushen

### Commit-Nachrichten Format

```
feat: Neue Funktion hinzugefügt
fix: Fehler behoben
style: Code-Formatierung
docs: Dokumentation aktualisiert
refactor: Code umstrukturiert
test: Tests hinzugefügt/geändert
```

### Beispiel-Workflow

```bash
# Nach Änderungen
npm run lint
npm run type-check
git add .
git commit -m "feat: Hero-Section Animationen verbessert"
git push
```

**WICHTIG**: Immer Lint und Type-Check ausführen vor dem Commit!
