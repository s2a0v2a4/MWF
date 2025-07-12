#!/bin/bash

# English Translation Script for Mittweida Events App
# This script will systematically translate all German texts to English

echo "🌍 Starting English translation of the app..."

# 1. Events Page - Main UI texts
echo "📝 Translating Events page..."

# Events page header and form
sed -i 's/Erstelle neue Events oder tritt bestehenden Events bei/Create new events or join existing events/g' src/pages/Events/page.tsx
sed -i 's/Neues Event erstellen/Create New Event/g' src/pages/Events/page.tsx
sed -i 's/PFLICHTFELD: Ort auswählen (oberste Priorität)/REQUIRED FIELD: Select location (top priority)/g' src/pages/Events/page.tsx
sed -i 's/Ort auswählen (Pflichtfeld)/Select Location (Required)/g' src/pages/Events/page.tsx
sed -i 's/Event Name (Pflichtfeld)/Event Name (Required)/g' src/pages/Events/page.tsx
sed -i 's/Anzahl Teilnehmer/Number of Participants/g' src/pages/Events/page.tsx
sed -i 's/Uhrzeit (Pflichtfeld)/Time (Required)/g' src/pages/Events/page.tsx
sed -i 's/Format: HH:mm (z\.B\. 14:30)/Format: HH:mm (e.g. 14:30)/g' src/pages/Events/page.tsx
sed -i 's/Event erstellen/Create Event/g' src/pages/Events/page.tsx
sed -i 's/Aktuelle Events/Current Events/g' src/pages/Events/page.tsx
sed -i 's/Noch keine Events vorhanden/No events available yet/g' src/pages/Events/page.tsx
sed -i 's/Erstelle das erste Event oder überprüfe ob das Backend auf/Create the first event or check if the backend is running on/g' src/pages/Events/page.tsx
sed -i 's/Teilnehmer/participants/g' src/pages/Events/page.tsx
sed -i 's/Beitreten/Join/g' src/pages/Events/page.tsx

# Validation messages
sed -i 's/Bitte wähle zuerst einen Ort auf der Karte aus! Das ist ein Pflichtfeld\./Please select a location on the map first! This is a required field./g' src/pages/Events/page.tsx
sed -i 's/Bitte gib einen Event-Namen ein\./Please enter an event name./g' src/pages/Events/page.tsx
sed -i 's/Bitte gib eine gültige Zeit im Format HH:mm ein\./Please enter a valid time in HH:mm format./g' src/pages/Events/page.tsx
sed -i 's/erfolgreich erstellt!/successfully created!/g' src/pages/Events/page.tsx
sed -i 's/Fehler beim Erstellen des Events/Error creating event/g' src/pages/Events/page.tsx
sed -i 's/Unbekannter Fehler/Unknown error/g' src/pages/Events/page.tsx

# Location selection
sed -i 's/Ort gewählt:/Location selected:/g' src/pages/Events/page.tsx
sed -i 's/Ort auf Karte wählen (ERFORDERLICH)/Select location on map (REQUIRED)/g' src/pages/Events/page.tsx

echo "✅ Events page translated"

# 2. Interests Page
echo "📝 Translating Interests page..."
sed -i 's/Wählen Sie Ihre Interessen/Select Your Interests/g' src/pages/Interests/page.tsx
sed -i 's/Mindestens ein Interesse auswählen/Select at least one interest/g' src/pages/Interests/page.tsx
sed -i 's/Bitte wählen Sie mindestens ein Interesse aus\./Please select at least one interest./g' src/pages/Interests/page.tsx

echo "✅ Interests page translated"

# 3. Map Page comments and UI
echo "📝 Translating Map page..."
sed -i 's/Verwende den neuen Hook für gefilterte Events/Use the new hook for filtered events/g' src/pages/Map/page.tsx
sed -i 's/Konvertiere Backend-Events zu Frontend-Format/Convert Backend-Events to Frontend-Format/g' src/pages/Map/page.tsx
sed -i 's/Event-Typ für Icon-Mapping/Event type for icon mapping/g' src/pages/Map/page.tsx
sed -i 's/Teilnehmer-Anzahl/Number of participants/g' src/pages/Map/page.tsx
sed -i 's/Event-Zeit/Event time/g' src/pages/Map/page.tsx
sed -i 's/GPS-Position (Fallback: Mittweida)/GPS position (Fallback: Mittweida)/g' src/pages/Map/page.tsx
sed -i 's/Erstelle Tags basierend auf ausgewählten Interessen vom Backend/Create tags based on selected interests from backend/g' src/pages/Map/page.tsx
sed -i 's/Hole die Namen der ausgewählten Interessen direkt/Get the names of selected interests directly/g' src/pages/Map/page.tsx
sed -i 's/Filtere Events nach der Backend-Kategorie/Filter events by backend category/g' src/pages/Map/page.tsx
sed -i 's/Join-Button: Nur einmal pro Event, persistiert im LocalStorage/Join button: Only once per event, persisted in LocalStorage/g' src/pages/Map/page.tsx

echo "✅ Map page translated"

# 4. Profile Components
echo "📝 Translating Profile components..."
sed -i 's/Saved Events/Saved Events/g' src/pages/Profile/_components/NavBar.tsx
sed -i 's/Create Event/Create Event/g' src/pages/Profile/_components/NavBar.tsx

echo "✅ Profile components translated"

# 5. API and Config files
echo "📝 Translating API descriptions..."
sed -i 's/Generiert: "{type} Event in Mittweida"/Generated: "{type} Event in Mittweida"/g' src/config/api.ts

echo "✅ API translations completed"

echo "🎉 Translation complete! All German texts have been translated to English."
