# GitHub Repository Setup - Schritt-für-Schritt Anleitung

## 1. Neues Repository auf GitHub erstellen

1. Gehe zu [GitHub.com](https://github.com) und melde dich an
2. Klicke auf das **"+"** Symbol oben rechts und wähle **"New repository"**
3. Repository-Einstellungen:
   - **Repository name**: `flighthour-landing-pages`
   - **Description**: "Marketing Landing Pages für Flighthour.de"
   - **Visibility**: Private (oder Public, je nach Präferenz)
   - **NICHT** "Initialize this repository with a README" ankreuzen
   - **NICHT** .gitignore oder License hinzufügen
4. Klicke auf **"Create repository"**

## 2. Lokales Repository mit GitHub verbinden

Führe diese Befehle in deinem Terminal aus (im Projektverzeichnis):

```bash
# Remote hinzufügen (ersetze USERNAME mit deinem GitHub-Benutzernamen)
git remote add origin https://github.com/USERNAME/flighthour-landing-pages.git

# Branch umbenennen zu main (falls nötig)
git branch -M main

# Ersten Commit erstellen
git add .
git commit -m "Initial commit: Projekt-Setup mit Next.js Konfiguration"

# Zum GitHub Repository pushen
git push -u origin main
```

## 3. Personal Access Token erstellen (für HTTPS)

Falls du nach Credentials gefragt wirst:

1. Gehe zu GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klicke auf **"Generate new token"**
3. Gib dem Token einen Namen (z.B. "flighthour-landing-pages")
4. Wähle Berechtigungen:
   - ✅ repo (vollständiger Zugriff)
   - ✅ workflow (für GitHub Actions)
5. Klicke auf **"Generate token"**
6. **WICHTIG**: Kopiere den Token sofort (wird nur einmal angezeigt!)
7. Verwende diesen Token als Passwort beim Git push

## 4. Alternative: SSH Setup

Falls du SSH bevorzugst:

```bash
# SSH-Key generieren (falls noch nicht vorhanden)
ssh-keygen -t ed25519 -C "deine-email@example.com"

# SSH-Key zum ssh-agent hinzufügen
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Public Key anzeigen
cat ~/.ssh/id_ed25519.pub
```

1. Kopiere den gesamten Output
2. Gehe zu GitHub → Settings → SSH and GPG keys
3. Klicke auf **"New SSH key"**
4. Füge den Key ein und speichere

```bash
# Remote URL zu SSH ändern
git remote set-url origin git@github.com:USERNAME/flighthour-landing-pages.git
```

## 5. Repository-Einstellungen für CapRover

1. Gehe zu deinem Repository auf GitHub
2. Settings → Webhooks → **"Add webhook"**
3. CapRover Webhook-Einstellungen werden später bei der CapRover-Konfiguration hinzugefügt

## 6. Nützliche Git-Befehle

```bash
# Status prüfen
git status

# Änderungen hinzufügen
git add .

# Commit erstellen
git commit -m "Beschreibung der Änderungen"

# Zum GitHub pushen
git push

# Änderungen von GitHub holen
git pull

# Branch erstellen und wechseln
git checkout -b feature/neue-funktion

# Branches anzeigen
git branch -a
```

## 📝 Tipps

- Committe regelmäßig mit aussagekräftigen Nachrichten
- Verwende Branches für neue Features
- Erstelle Pull Requests für Code-Reviews
- Nutze GitHub Issues für Task-Tracking

## 🔒 Sicherheit

- Committe NIEMALS Secrets, API-Keys oder Passwörter
- Verwende `.env.local` für lokale Umgebungsvariablen
- Prüfe `.gitignore` bevor du commitest