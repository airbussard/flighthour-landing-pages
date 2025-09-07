# 🚀 Environment Variables Setup für CapRover

## ❌ KRITISCH FEHLENDE VARIABLE

### DATABASE_URL
**Diese Variable fehlt und ist der Grund warum die Admin-Login-Seite nicht funktioniert!**

#### So findest du die DATABASE_URL in Supabase:
1. Gehe zu deinem Supabase Dashboard
2. Navigate zu: **Settings** → **Database**
3. Scrolle zu **Connection string**
4. Wähle **URI** (nicht "Connection pooling")
5. Kopiere die URL (sie sieht so aus):
```
postgresql://postgres.chmbntoufwhhqlnbapdw:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

⚠️ **WICHTIG**: Füge am Ende der URL diese Parameter hinzu:
```
?pgbouncer=true&connection_limit=1
```

Die finale URL sollte so aussehen:
```
postgresql://postgres.chmbntoufwhhqlnbapdw:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## ✅ Bereits vorhandene Variablen (gut!)
- `NODE_ENV=production`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CONSENT_VERSION=1.0`

## 🔧 So fügst du die DATABASE_URL in CapRover hinzu:

1. Gehe zu deiner App in CapRover
2. Klicke auf **App Configs**
3. Scrolle zu **Environmental Variables**
4. Füge hinzu:
   - Key: `DATABASE_URL`
   - Value: `[Die URL von oben mit deinem Passwort]`
5. Klicke auf **Save & Update**
6. Warte bis der Deploy abgeschlossen ist

## 📝 Optionale aber empfohlene Variablen:

```bash
# App URL
NEXT_PUBLIC_APP_URL=https://flighthourlandingp.immogear.de

# Security (generiere zufällige Strings)
NEXTAUTH_SECRET=generiere-einen-32-zeichen-string
JWT_SECRET=generiere-einen-anderen-string
```

### Zufällige Strings generieren:
```bash
# Linux/Mac:
openssl rand -base64 32

# Oder online:
https://generate-secret.vercel.app/32
```

## 🎯 Nach dem Hinzufügen der DATABASE_URL:
1. Die Admin-Login-Seite sollte funktionieren
2. Du kannst dich mit `admin@eventhour.de` einloggen (Passwort musst du in Supabase Auth setzen)
3. Alle Datenbankfunktionen werden aktiviert

## 🐛 Troubleshooting:
- Wenn immer noch Fehler: Checke die CapRover Logs
- Stelle sicher, dass die DATABASE_URL korrekt kopiert wurde (inkl. Passwort)
- Das Passwort in der URL darf keine Sonderzeichen wie `@` oder `:` enthalten (URL-encode sie)