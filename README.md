# landb.github.io

Static pages for the Couples Cycle app (working title).

- `join/` — the invite link page. Links look like `https://landb.github.io/join/#<token>`; the token
  after `#` never reaches the server. The page offers to open the app with
  `couplescycle://join?token=…` and explains how to use the typed code instead.

- `index.html` — a placeholder home page.
- `favicon.svg`, `apple-touch-icon.png`, `mark.css` and `mark.js` — the app's mark ("Knockout"
  with a face on the partner's circle). `mark.css` draws it and makes it blink; `mark.js` orbits
  it once on load, the same motion as the app's `AppMark`: the eyes squint while it turns, then
  it smiles wider and tilts its head (all skipped with reduced motion).
  The colors and proportions come from `design/tokens.json` and DESIGN.md › Mark and Motion in
  the app repo; the touch icon is the app icon at 180 px.

No analytics, cookies or third-party scripts (only Google Fonts for the type). When the app moves to its own domain (and the
paid Apple Developer Program is active), an `apple-app-site-association` file turns these into
universal links.
