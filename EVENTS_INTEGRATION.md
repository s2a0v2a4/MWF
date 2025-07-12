# Events Backend Integration

## ✅ Status: ERFOLGREICH INTEGRIERT!

Das Frontend ist jetzt vollständig mit dem Backend für Events verbunden.

## 🔗 Backend-Integration Details

### API-Endpunkte
- **Event erstellen**: `POST /api/events`
- **Events abrufen**: `GET /api/events`
- **Backend URL**: `http://localhost:5000`

### 🎯 Type-Mapping (Frontend → Backend)

```typescript
const typeToCategoryMap = {
  'Walking': 'Sport',
  'Picnic': 'Sport', 
  'Concert': 'Musik',
  'Exhibition': 'Kunst',
  'Sports': 'Sport',
  'Cycling': 'Sport',
  'Swimming': 'Sport',
  'Hiking': 'Sport',
  'Theater': 'Kunst'
}
```

### 📊 Datenstrukturen

**Frontend Event:**
```typescript
{
  id?: string;
  name: string;           // Event-Name
  position: [lat, lng];   // GPS-Koordinaten
  participants: number;   // Anzahl Teilnehmer
  time: string;          // "HH:mm" Format
  type: string;          // Walking, Picnic, etc.
}
```

**Backend Event:**
```typescript
{
  id?: number;
  title: string;         // name → title
  description: string;   // Generiert: "{type} Event in Mittweida"
  category: string;      // Gemappt via typeToCategoryMap
  time: string;          // Bleibt gleich (HH:mm)
  type?: string;         // Optional, für Filtering
  participants?: number; // Aktuell immer 0 vom Backend
}
```

### 🔄 Automatisches Mapping

Die Funktion `mapToBackendFormat()` in `src/config/api.ts` konvertiert automatisch:

```typescript
// Frontend Input:
{
  name: "Picknick im Park",
  type: "Picnic",
  position: [50.9866, 12.971],
  participants: 8,
  time: "14:00"
}

// Backend Output:
{
  title: "Picknick im Park",
  description: "Picnic Event in Mittweida",
  category: "Sport",         // Picnic → Sport
  time: "14:00",
  type: "Picnic"
}
```

## 🚀 Funktionen

### ✅ Implementiert:
- **Event-Erstellung** mit vollständiger Backend-Integration
- **Automatisches Type-Mapping** (Frontend-Typen → Backend-Kategorien)
- **Form-Validierung** (Name, Zeit, Position erforderlich)
- **Error-Handling** mit benutzerfreundlichen Meldungen
- **Events laden** vom Backend und Anzeige in der UI
- **Erfolgs-Feedback** mit Backend-Response-Details

### 🔍 Event-Erstellung Flow:
1. Benutzer füllt Formular aus (Name, Typ, Zeit, Position)
2. Frontend validiert Eingaben
3. `mapToBackendFormat()` konvertiert Frontend → Backend-Format
4. `POST /api/events` sendet Daten an Backend
5. Backend erstellt Event und gibt Response zurück
6. Frontend zeigt Erfolg mit Event-ID und Kategorie
7. Events-Liste wird automatisch neu geladen

### ⚠️ Bekannte Einschränkungen:
- **Position/GPS-Koordinaten** werden noch nicht im Backend gespeichert
- **Teilnehmer-Anzahl** wird vom Backend ignoriert (immer 0)

### 🎯 Event-Anzeige:
- **Nur Backend-Events** werden angezeigt
- **Keine Demo-Events** mehr vorhanden
- **Loading-State** während des Ladens
- **Empty-State** wenn keine Events vorhanden

## 🛠️ Verwendung

1. **Backend starten**: `http://localhost:5000`
2. **Frontend starten**: `npm run dev` → `http://localhost:3000`
3. **Event erstellen**: Gehe zu Events-Seite → Formular ausfüllen → Absenden
4. **Events anzeigen**: Nur Backend-Events werden automatisch geladen (keine Dummy-Events)

## 📱 Testing

### Event erstellen testen:
1. Öffne `http://localhost:3000`
2. Navigiere zu Events
3. Fülle Formular aus:
   - Name: "Test Event"
   - Typ: "Walking" 
   - Zeit: "15:30"
   - Position: Auf Karte auswählen
4. Absenden → Backend-Response sollte sichtbar sein
5. Event erscheint automatisch in der Liste (nur Backend-Events)

### Backend-Validierung:
- **Valide Kategorien**: Sport, Musik, Kunst
- **Zeit-Format**: HH:mm (z.B. "14:30")
- **Pflichtfelder**: title, description, category, time

## 🔧 Konfiguration

### Environment Variables (.env.development):
```bash
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

### API-Konfiguration (src/config/api.ts):
- Automatische URL-Erkennung (Development/Production)
- Error-Handling und Logging
- Type-safe API-Calls

---

**Status**: ✅ Vollständig funktionfähig!  
**Letzte Aktualisierung**: 12. Juli 2025  
**Integration von**: Backend Events API → Frontend Events UI
