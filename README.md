# MineRanks

Eine eigenständige, MCTiers-ähnliche Minecraft-PvP-Tierlisten-Webseite.

## Starten
Am einfachsten:
1. Alle Dateien in denselben Ordner legen.
2. `index.html` öffnen.

Für einen lokalen Server:
```bash
python -m http.server 8080
```
Dann `http://localhost:8080` öffnen.

## Enthalten
- Startseite
- Tier-System HT1/LT1 bis HT5/LT5
- Spielerprofile
- Suche
- Leaderboard
- Demo-Adminbereich
- Spieler hinzufügen/löschen
- Speicherung per localStorage

## Für eine echte öffentliche Version
Für mehrere Benutzer brauchst du noch:
- Login/Registrierung
- Datenbank
- echtes Backend/API
- Tester-/Admin-Rechte
- Match-/Testsystem
- Minecraft-UUID/Profil-Anbindung
- Hosting und Domain

Das Projekt ist bewusst ohne Verbindung zu MCTiers gebaut.
