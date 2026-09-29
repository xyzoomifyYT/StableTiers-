STABLETIERS — MCTiers-style package

Website
-------
Stabletiers-Website/index.html is a self-contained front-end matching the supplied Stabletiers screenshot:
- Minecraft item icons for every mode
- Real Minecraft head rendering through mc-heads.net
- Ranking list with search, region filter and point/tier sorting
- Player profile modal with tier overview
- Tier assignment/removal UI stored in browser localStorage
- Responsive desktop/mobile layout

Minecraft plugin
----------------
Stabletiers-Minecraft is the server-side part. It displays the highest player tier in the tab list and nametag and provides:
  /tier profile [player]
  /tier get [player]
  /tier set <player> <crystal|pearl|mace|armor|sword|pot> <HT1..LT4>
  /tier remove <player> <mode>
  /tier reload

The plugin.yml main-class typo from the supplied archive was corrected to:
net.stabletier.plugin.StableTierPlugin

Important
---------
The website is a front-end demo unless connected to your own backend/database. Its admin changes are saved only in that browser via localStorage.
Minecraft server tier changes use the plugin config.yml and require stabletier.admin (default: OP).
