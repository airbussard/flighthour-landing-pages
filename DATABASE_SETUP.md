# Datenbank-Setup für Eventhour

## Überblick
Das Projekt nutzt **Supabase** als Backend-as-a-Service, welches PostgreSQL als Datenbank bereitstellt. Prisma ORM wird für das Datenbankschema und die Abfragen verwendet.

## Wann wird die Datenbank aufgebaut?

Die Datenbank wird in **zwei Schritten** eingerichtet:

### 1. Supabase-Projekt erstellen (manuell)
Dies muss **einmalig vor dem ersten Deployment** gemacht werden:
- Gehe zu [supabase.com](https://supabase.com) 
- Erstelle ein neues Projekt
- Notiere dir die Connection-Details

### 2. Schema automatisch deployen
Das Datenbankschema wird **automatisch** beim Deployment erstellt/aktualisiert:
- Beim Build-Prozess: `npm run db:generate` generiert den Prisma Client
- Nach dem Deployment: `npm run db:push` pusht das Schema zur Datenbank
- Optional: `npm run db:seed` fügt Beispieldaten ein

## Schritt-für-Schritt Anleitung

### 1. Supabase-Projekt einrichten

1. Erstelle ein Konto bei [supabase.com](https://supabase.com)
2. Klicke auf "New Project"
3. Wähle folgende Einstellungen:
   - **Name**: eventhour-production
   - **Database Password**: Sicheres Passwort generieren und speichern
   - **Region**: Frankfurt (eu-central-1) für beste Performance in Deutschland
   - **Pricing Plan**: Free tier für Development, Pro für Production

4. Nach der Erstellung findest du die Credentials unter "Settings > API":
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
   SUPABASE_SERVICE_KEY=[SERVICE-KEY]
   ```

5. Unter "Settings > Database" findest du:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 2. Environment Variables in CapRover setzen

1. Logge dich in CapRover ein (http://188.245.100.156:3000)
2. Gehe zu deiner App
3. Klicke auf "App Configs" 
4. Füge unter "Environmental Variables" folgende Variablen hinzu:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://[dein-projekt].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[dein-anon-key]
   SUPABASE_SERVICE_KEY=[dein-service-key]
   DATABASE_URL=postgresql://postgres:[passwort]@db.[projekt].supabase.co:5432/postgres
   ```

### 3. Datenbank-Schema deployen

Nach dem ersten erfolgreichen Deployment in CapRover:

1. SSH in den Container:
   ```bash
   docker exec -it [container-id] sh
   ```

2. Schema zur Datenbank pushen:
   ```bash
   npm run db:push --workspace=@eventhour/database
   ```

3. Optional: Seed-Daten einfügen:
   ```bash
   npm run db:seed --workspace=@eventhour/database
   ```

### 4. Lokale Entwicklung

Für lokale Entwicklung:

1. Erstelle `.env.local` in `/apps/web`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[projekt].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
   SUPABASE_SERVICE_KEY=[service-key]
   ```

2. Erstelle `.env` in `/packages/database`:
   ```env
   DATABASE_URL=postgresql://postgres:[passwort]@db.[projekt].supabase.co:5432/postgres
   ```

3. Führe Migrationen aus:
   ```bash
   npm run db:push --workspace=@eventhour/database
   npm run db:seed --workspace=@eventhour/database
   ```

## Prisma Commands

Im `packages/database` Package sind folgende Commands verfügbar:

- `npm run db:generate` - Generiert Prisma Client
- `npm run db:push` - Pusht Schema zur Datenbank (erstellt/updated Tabellen)
- `npm run db:migrate` - Erstellt und führt Migrationen aus (für Production)
- `npm run db:seed` - Fügt Beispieldaten ein
- `npm run db:studio` - Öffnet Prisma Studio (Datenbank-GUI)

## Schema-Änderungen

Bei Schema-Änderungen:

1. Bearbeite `packages/database/prisma/schema.prisma`
2. Lokal testen:
   ```bash
   npm run db:push --workspace=@eventhour/database
   ```
3. Committe und pushe Änderungen
4. Nach Deployment im Container:
   ```bash
   npm run db:push --workspace=@eventhour/database
   ```

## Troubleshooting

### "Can't reach database server"
- Prüfe DATABASE_URL in Environment Variables
- Stelle sicher, dass Supabase-Projekt aktiv ist
- Überprüfe Firewall-Einstellungen

### "Schema out of sync"
- Führe `npm run db:push` aus
- Bei Problemen: `npm run db:push --force-reset` (ACHTUNG: Löscht alle Daten!)

### "Prisma Client not generated"
- Führe `npm run db:generate` aus
- Stelle sicher, dass `node_modules` korrekt installiert sind

## Backup & Recovery

Supabase erstellt automatisch tägliche Backups (im Pro Plan). 

Manuelles Backup:
```bash
pg_dump $DATABASE_URL > backup.sql
```

Restore:
```bash
psql $DATABASE_URL < backup.sql
```

## Monitoring

- Supabase Dashboard: Zeigt Queries, Performance, Storage
- Prisma Studio: `npm run db:studio` für lokale Datenbank-Verwaltung
- CapRover Logs: Zeigt Datenbankverbindungsfehler

## Sicherheit

- Nutze NIEMALS den Service Key im Frontend
- Aktiviere Row Level Security (RLS) in Supabase für alle Tabellen
- Regelmäßige Passwort-Rotation
- IP-Whitelisting für Production-Datenbank