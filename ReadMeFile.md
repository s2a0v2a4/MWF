MWF- Mitweida Frontend



The frontend starts with npm run dev
The backend starts with npm run start:dev
The test is running on npm run test (in the frontend)

Frontend port 3000
Backend port 5000

1. http://localhost:3000/interest 
2. enjoy

you can check the Backend:
http://localhost:5000/api/events
http://localhost:5000/api/interests

you can get to the admin panel with:
http://localhost:3000/admin

env:
VITE_API_URL=Network:5000


Card.test.tsx
1. Interaktivität
Test: Card component: Button click event works
Beschreibung: Prüft, ob ein Button-Klick innerhalb der Card den Event-Handler auslöst.
Für Interaktivität

2. Darstellung von Inhalten
Test: Card component: Renders children
Beschreibung: Zeigt, ob die Card-Komponente ihre Kinder korrekt rendert.
Grundfunktionalität

Test: Card component: Renders Card and its children
Beschreibung: Ähnlich wie oben, rendert Card und ihre Kinder zusammen.
Ergänzend

3. Statische Inhalte und Styling
Test: Card component: Renders static content (e.g., button)
Beschreibung: Prüft, ob z. B. Buttons als statischer Inhalt korrekt angezeigt werden.
Für UI Konsistenz

Test: Card component: Has CSS class "card"
Beschreibung: Kontrolliert, ob die CSS-Klasse card am Haupt-Element vorhanden ist.
Für Styling

Profile.test.tsx
4. Nutzerinformationen
Test: Profile component: Displays username, email, and label
Beschreibung: Zeigt, ob Nutzername, E-Mail und der Text „Nutzername:“ dargestellt werden.
Für Benutzerinformationen

6 Test