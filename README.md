# STABLETIERS

Minecraft PvP Tierlist im schwarzen/neon-orangen Cyberpunk-Stil.

## Start

```bash
node server.js
```

Dann `http://localhost:3000` öffnen.

## Admin

Das Backend hat geschützte Admin-Endpunkte. Standard-Passwort aus `server.js` über `ADMIN_PASSWORD` ersetzen:

```bash
ADMIN_PASSWORD="DEIN_SICHERES_PASSWORT" node server.js
```

Die öffentliche Seite zeigt Rankings; Admin-Schreibaktionen nutzen `/api/admin/*`.
