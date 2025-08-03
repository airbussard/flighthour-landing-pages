# CapRover Deployment - Schritt-für-Schritt Anleitung

## Voraussetzungen

- CapRover Server läuft und ist erreichbar
- GitHub Repository ist erstellt und Code ist gepusht
- CapRover CLI ist installiert (optional, aber empfohlen)

## 1. CapRover CLI Installation (optional)

```bash
npm install -g caprover

# Mit CapRover Server verbinden
caprover login
# Folge den Anweisungen:
# - CapRover URL eingeben (z.B. https://captain.deinserver.de)
# - Passwort eingeben
```

## 2. Neue App in CapRover erstellen

### Option A: Über die Web-Oberfläche

1. Logge dich in dein CapRover Dashboard ein
2. Gehe zu **"Apps"** → **"Create A New App"**
3. App Name: `flighthour-geschenke` (oder ähnlich)
4. Klicke auf **"Create New App"**

### Option B: Über CLI

```bash
caprover apps:create flighthour-geschenke
```

## 3. App-Konfiguration

1. In der App-Übersicht, klicke auf deine App
2. Gehe zu **"App Configs"**
3. Setze folgende Einstellungen:

### Port Mapping

- Container HTTP Port: `3000`

### Environmental Variables

Füge folgende Umgebungsvariablen hinzu:

```
NODE_ENV=production
PORT=3000
```

### Domain konfigurieren

1. Gehe zu **"HTTP Settings"**
2. Aktiviere **"Enable HTTPS"**
3. Optional: Füge eine eigene Domain hinzu:
   - Klicke auf **"Connect New Domain"**
   - Gib deine Domain ein (z.B. `geschenke.flighthour.de`)
   - Stelle sicher, dass der DNS A-Record auf deinen CapRover Server zeigt

## 4. Deployment einrichten

### Option A: GitHub Integration (Empfohlen)

1. In der App-Übersicht, gehe zu **"Deployment"**
2. Wähle **"Deploy from GitHub/Bitbucket/Gitlab"**
3. Repository URL: `https://github.com/DEIN_USERNAME/flighthour-landing-pages`
4. Branch: `main`
5. Klicke auf **"Save & Update"**
6. Klicke auf **"Force Build"** für das erste Deployment

### Option B: Manuelles Deployment via CLI

```bash
# Im Projektverzeichnis
caprover deploy -a flighthour-geschenke
```

### Option C: Git Remote Deployment

```bash
# CapRover als Git Remote hinzufügen
git remote add caprover https://captain.deinserver.de/git/flighthour-geschenke

# Code zu CapRover pushen
git push caprover main
```

## 5. Automatisches Deployment (CI/CD)

### GitHub Webhook einrichten

1. Gehe zu deinem GitHub Repository
2. Settings → Webhooks → **"Add webhook"**
3. Payload URL: `https://captain.deinserver.de/api/v2/user/apps/webhooks/triggerbuild`
4. Content type: `application/json`
5. Secret: Leer lassen
6. Events: **"Just the push event"**
7. Active: ✓
8. Klicke auf **"Add webhook"**

### Webhook Token in CapRover

1. In CapRover, gehe zu deiner App → **"Deployment"**
2. Kopiere den **"Webhook Token"**
3. Füge diesen Token zu deiner Webhook URL hinzu:
   ```
   https://captain.deinserver.de/api/v2/user/apps/webhooks/triggerbuild?namespace=captain&token=DEIN_WEBHOOK_TOKEN&appName=flighthour-geschenke
   ```

## 6. Deployment überwachen

1. Gehe zu **"Deployment"** → **"Build Logs"**
2. Beobachte den Build-Prozess
3. Nach erfolgreichem Build wird die App automatisch gestartet

## 7. App testen

1. Öffne die App-URL:
   - Standard: `https://flighthour-geschenke.captain.deinserver.de`
   - Eigene Domain: `https://geschenke.flighthour.de`
2. Überprüfe alle Funktionen der Landing Page

## 8. Monitoring & Logs

### App Logs anzeigen

- Web UI: App → **"App Logs"**
- CLI: `caprover logs -a flighthour-geschenke`

### Monitoring

- CPU und Memory Usage in der App-Übersicht
- Setze Alerts für hohe Ressourcennutzung

## Troubleshooting

### Build fehlgeschlagen

1. Überprüfe die Build Logs
2. Stelle sicher, dass `captain-definition` und `Dockerfile` korrekt sind
3. Überprüfe, ob alle Dependencies in `package.json` definiert sind

### App startet nicht

1. Überprüfe die App Logs
2. Stelle sicher, dass Port 3000 korrekt konfiguriert ist
3. Überprüfe Umgebungsvariablen

### HTTPS funktioniert nicht

1. Warte 1-2 Minuten nach Aktivierung
2. Stelle sicher, dass Port 80 und 443 offen sind
3. Überprüfe DNS-Einstellungen

## Nützliche Befehle

```bash
# App Status
caprover apps:list

# Logs anzeigen
caprover logs -a flighthour-geschenke

# App neustarten
caprover apps:restart flighthour-geschenke

# Umgebungsvariablen setzen
caprover apps:envvars:set -a flighthour-geschenke KEY=value
```

## Best Practices

1. **Staging Environment**: Erstelle eine separate App für Tests
2. **Backups**: Aktiviere regelmäßige Backups in CapRover
3. **Monitoring**: Nutze externe Monitoring-Tools für Uptime
4. **Skalierung**: Bei Bedarf kannst du die App auf mehrere Instanzen skalieren

## Support

- CapRover Docs: https://caprover.com/docs
- CapRover Community: https://github.com/caprover/caprover/issues
