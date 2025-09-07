# CapRover Build Arguments Configuration

## Wichtig: Build-Args in CapRover setzen

Die Supabase-Werte müssen als Build-Arguments in CapRover konfiguriert werden, damit sie beim Docker-Build verfügbar sind.

### So konfigurierst du Build-Args in CapRover:

1. **Gehe zu deiner App in CapRover**
2. **Klicke auf "App Configs"**
3. **Scrolle zu "Docker Build Arguments"**
4. **Füge diese Build-Args hinzu:**

```
NEXT_PUBLIC_SUPABASE_URL=https://chmbntoufwhhqlnbapdw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobWJudG91ZndoaHFsbmJhcGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjExNjAsImV4cCI6MjA3MjczNzE2MH0.SzUhKEvQycnoNYvYjefcBApKlX_yTovEL6_g1iPzWqY
```

5. **Klicke auf "Save & Update"**
6. **Force Build**: Klicke auf "Force Build" um sicherzustellen, dass die neuen Build-Args verwendet werden

### Warum Build-Args?

- **Sicherheit**: Keys sind nicht im Git-Repository
- **Flexibilität**: Verschiedene Werte für verschiedene Deployments
- **Next.js Requirement**: NEXT_PUBLIC_* Variablen müssen zur Build-Zeit verfügbar sein

### Alternative: Environment Variables File

Falls Build-Args nicht funktionieren, kannst du auch eine `.env.production.local` Datei direkt auf dem CapRover-Server erstellen:

1. SSH in den CapRover-Server
2. Navigiere zum App-Verzeichnis
3. Erstelle `.env.production.local` mit den Werten
4. Rebuild die App

### Wichtige Hinweise:

- Die NEXT_PUBLIC_* Variablen werden zur **Build-Zeit** in den Code kompiliert
- Änderungen an den Environment-Variablen erfordern einen neuen Build
- Der ANON_KEY ist öffentlich und kann im Frontend verwendet werden
- Verwende NIEMALS den SERVICE_ROLE_KEY im Frontend!