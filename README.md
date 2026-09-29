# STABLETIERS – fertige Tierlist

## Start
Voraussetzung: Node.js 18+.

```bash
cd Stabletiers-Website
node server.js
```
Dann `http://localhost:3000` öffnen.

## Admin
Das Admin-Passwort wird **nicht** im Frontend gespeichert. Standardmäßig ist es:

`CHANGE_ME_NOW_123!`

Für den echten Betrieb unbedingt ändern:

Linux/macOS:
```bash
ADMIN_PASSWORD='DEIN_STARKES_PASSWORT' node server.js
```

Windows PowerShell:
```powershell
$env:ADMIN_PASSWORD='DEIN_STARKES_PASSWORT'; node server.js
```

## Admin-Funktionen
- Login / Logout
- Spieler hinzufügen, bearbeiten und löschen
- Name, Region und Combat-Rang ändern
- Website-Rang vergeben: User, Tester, Media, Helper, Moderator, Admin, Owner
- Tier für jedes Gamemode setzen
- Website-Name, Server-IP, Servername und Discord ändern
- Daten bleiben in `data.json` gespeichert

## API
- `GET /api/data`
- `GET /api/players`
- `GET /api/players/:name`

Admin-Endpunkte benötigen die Admin-Session:
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/admin/players`
- `PUT /api/admin/players/:name`
- `DELETE /api/admin/players/:name`
- `PUT /api/admin/settings`

## Hinweis
Das Layout ist eine eigenständige Umsetzung, die sich an den bereitgestellten MCTiers-Referenzbildern orientiert. Es verwendet keinen kopierten MCTiers-Quellcode.
