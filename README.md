# MWF – Mitweida Frontend #


MWF ist das Frontend einer Event-Plattform, mit der Nutzer Veranstaltungen nach ihren Interessen entdecken und erstellen kann, wo interessen nach persönlichkeit in der map gefiltert werden können

Die Anwendung funktioniert sowohl über GitHub Pages als auch lokal – das Backend ist für beide Umgebungen konfiguriert

---------------------------------------------------------------------------------------------------------------
Local: 
Frontend MWF: npm run dev
Backend MWB: npm run start:dev
das funktioniert einwandfrei

Über Local:
1. Interessen auswählen 
   Wähle zuerst deine Interessen aus
http://localhost:3000/interests 

2. Registrieren / Anmelden 
   Danach wirst du weitergeleitet zur Login-Seite:  
   http://localhost:3000/login

3. Profil einsehen
   Zeigt deine Nutzerinformationen an:  
   http://localhost:3000/profile

4. Events entdecken in der Karte (sendet ans Backend siehe swagger) 
   Aktive Events auf der Karte entdecken, beitreten oder speichern:  
   http://localhost:3000/map

5. Eigenes Event erstellen  
   Ort, Zeit und Aktivität selbst festlegen:  
   http://localhost:3000/events






Über Git:
1. Interessen auswählen 
   Wähle zuerst deine Interessen aus
   https://s2a0v2a4.github.io/MWF/interests

2. Registrieren / Anmelden 
   Danach wirst du weitergeleitet zur Login-Seite:  
   https://s2a0v2a4.github.io/MWF/login

3. Profil einsehen
   Zeigt deine Nutzerinformationen an:  
   https://s2a0v2a4.github.io/MWF/profile

4. Events entdecken in der Karte (sendet ans Backend siehe swagger) 
   Aktive Events auf der Karte entdecken, beitreten oder speichern:  
   https://s2a0v2a4.github.io/MWF/map

5. Eigenes Event erstellen  
   Ort, Zeit und Aktivität selbst festlegen:  
   https://s2a0v2a4.github.io/MWF/events



  Swagger:
http://localhost:5000/api/docs
 
Interests
GET /api/interests
Ruft die Interessen des eingeloggten Nutzers ab.
POST /api/interests
Speichert die ausgewählten Interessen des Nutzers.
GET /api/interests/categories
Gibt alle verfügbaren Interessenkategorien zurück.

Events
GET /api/events
Listet alle Events auf, optional gefiltert nach Kategorien.
POST /api/events
Erstellt ein neues Event mit den angegebenen Daten.
POST /api/events/{id}/join
Der Nutzer tritt dem Event mit der angegebenen ID bei.

---------------------------------------------------------------------------------------------------------------


Frontend port 3000
Backend port 5000

Backend überprüfen:
http://localhost:5000/api/events
http://localhost:5000/api/interests

env:
VITE_API_URL=Network:5000

---------------------------------------------------------------------------------------------------------------
Tests
Card.test.tsx
Interaktivität
Test: Button click event works
Überprüft, ob ein Klick auf den Button in der Card den zugehörigen Event-Handler auslöst.

Inhalte richtig darstellen
Test: Renders children
Stellt sicher, dass Inhalte (Children) korrekt innerhalb der Card angezeigt werden.
Test: Renders Card and its children
Testet zusätzlich, ob die Card gemeinsam mit ihren Inhalten sauber gerendert wird.

Statische Elemente & Styling
Test: Renders static content (e.g., button)
Kontrolliert, ob feste Elemente wie Buttons korrekt dargestellt werden.
Test: Has CSS class "card"
Stellt sicher, dass die Hauptkomponente die erwartete CSS-Klasse enthält.

Profile.test.tsx
Nutzerinformationen
Test: Displays username, email, and label
Prüft, ob Username, E-Mail und Beschriftungen wie „Nutzername:“ korrekt angezeigt werden.



---------------------------------------------------------------------------------------------------------------



npm run build
git add docs
git commit -m "Fix: Production API URL"
git push