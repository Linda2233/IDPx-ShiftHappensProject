@echo off
title Usability Prototype Server
echo Starte lokalen Server fuer den Prototypen...

:: Navigiere in den build-Ordner
cd /d "%~dp0build"

:: Startet den Standardbrowser mit der Adresse
start http://localhost:8080

:: Startet den Python-Server (blockiert das Fenster, bis es geschlossen wird)
python -m http.server 8080