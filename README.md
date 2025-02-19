# Prezentacja sterowana gestami

## Opis projektu
Projekt zakłada stworzenie interaktywnego systemu do prezentacji zarządzanego gestami dłoni. Wykorzystuje technologię MediaPipe Hands do rozpoznawania gestów oraz Next.js + React do budowy interfejsu użytkownika.

## Architektura systemu

### Komponenty główne
- **Frontend**: Next.js + React
- **Detekcja gestów**: MediaPipe Hands
- **Routing**: Next.js Router
- **Zarządzanie stanem**: React Hooks

### Struktura projektu
```
docs/
src/
  app/
    layout.tsx
    page.tsx
  components/
    HandGestureControls.tsx
    Sidebar.tsx
    SlideContent.tsx
```

## Funkcjonalności
### Kontrola gestów
System pozwala na sterowanie slajdami za pomocą gestów dłoni:
- **Wskazanie w lewo** - przejście do poprzedniego slajdu
- **Wskazanie w prawo** - przejście do następnego slajdu

## Wymagania
- Nowoczesna przeglądarka internetowa (Chrome 88+, Firefox 85+, Safari 14+)
- Obsługa WebGL
- Włączona obsługa JavaScript
- Dostęp do kamery

## Instalacja i uruchomienie

### Za pomocą Docker
1. Pobierz najnowszą wersję obrazu Dockera z repozytorium GitHub:
   ```
   https://github.com/ZegarekPL/Gesture-Controlled-Presentation-Tool---Frontend/releases
   ```
2. Załaduj obraz do Dockera:
   ```bash
   docker load -i gesture_controlled_presentation_tool_frontend-v0.1.1.tar
   ```
3. Uruchom aplikację w kontenerze:
   ```bash
   docker run -d -p 3000:3000 gesture_controlled_presentation_tool_frontend:v0.1.1
   ```
4. Aplikacja będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

### Za pomocą VSCode/WebStorm
#### Instalacja zależności
```bash
npm install
# lub
yarn install
```
#### Uruchomienie aplikacji
```bash
npm run dev
# lub
yarn dev
```

## Autorzy
- **Filip Kula**
- **Wiktor Mazur**

