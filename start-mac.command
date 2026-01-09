#!/bin/bash

# Setzt das Arbeitsverzeichnis auf den Ordner, in dem das Skript liegt
cd "$(dirname "$0")/build"

echo "Starte lokalen Server für den Prototypen..."

# Öffnet die URL im Standardbrowser
open "http://localhost:8080"

# Startet den Python-Server
python3 -m http.server 8080