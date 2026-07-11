# Wright Home Bar

A standalone personal cocktail app built around the bottles, mixers, pantry staples, adjuncts, produce, and wines in the Wright home bar.

## Features

- A 365+ recipe core library with dynamically loaded classic, modern, adjunct, wine, and experimental expansions
- A v5 expansion containing 309 curated candidates, with automatic exact-name deduplication against the existing catalog
- Strong emphasis on absolute classics, shaken cocktails, and drinks served up
- IBA classics, modern classics, forgotten standards, tiki, craft, Michigan spirits, seasonal, dessert, low-ABV, spirit-forward, wine, and cutting-edge tags
- Advanced Drink Discovery filtered by availability, era, base, service, technique, mood, difficulty, and tasting history
- Discovery remembers up to 200 recent results and strongly suppresses repeats
- Editable browser-based inventory manager covering spirits, mixers, produce, syrups, bitters, garnishes, specialty prep, and wine
- Full, low, empty, and wishlist stock states
- Opened-date tracking and freshness guidance for wine, vermouth, sherry, port, Madeira, syrups, and perishables
- Exact-match, pantry-assumption, approved-substitute, component-prep, and missing-ingredient indicators
- Bottle-based recipe browsing with recipe, favorite, stock, freshness, and untried counts
- Tonight Mode with mood, guest count, three makeable options, and automatic batching
- Four-course menu generator
- Prep Dashboard for homemade and perishable ingredients
- Tasting journal with times made, last-made date, ratings, notes, and a Make Again flag
- Clickable shopping optimizer showing which recipes each purchase unlocks
- Inventory Sync JSON/CSV export for applying bar changes back to the GitHub defaults
- 1×, 2×, 4×, and 8× bartender batching
- Local ratings, notes, favorites, inventory, stock, and tasting history
- JSON backup and restore for all personal data
- Responsive retro cocktail-book design with mobile bartender controls

## v5 cocktail expansion

The v5 data pack contains 309 candidate recipes: 239 tagged as shaken, 227 designed for up service, 54 tagged IBA Classic, 72 modern classics, and 65 cutting-edge options. Existing cocktail names are skipped when the pack loads, so the live increase is the deduplicated remainder rather than a second copy of drinks already in the bar book.

The cutting-edge section explores tea, pandan, miso, koji, shiso, yuzu, savory ingredients, fermentation, shrubs, clarified milk punches, fat-washing, freezer service, acid adjustment, and elevated tropical formats. These are clearly tagged separately from established classics.

## Wine inventory

The wine module adds recipes using Prosecco, sparkling wine, dry red wine, dry white wine, dry rosé, fino sherry, amontillado sherry, ruby port, white port, and Madeira. These begin as unchecked inventory items and appear in the shopping optimizer until added through the Inventory Manager.

For opened wines and fortified wines, enter the opened date in the Inventory Manager. The app will display a practical freshness estimate and highlight bottles that should be used soon.

## Storage

Ratings, notes, favorites, inventory changes, stock levels, opened dates, and tasting history are stored in the browser. Use **Backup & Restore** to download a portable JSON backup before clearing browser data or moving to another device.

## GitHub Pages

The repository publishes directly from the root of the `main` branch.