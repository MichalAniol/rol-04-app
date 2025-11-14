# Podkład

## instalacja

Z terminala wchodzimy w katalog projektu i uruchamiany ```npm i```, powinny się zainstalować wszystkie ```./node moules```

## uruchamianie

Otwieramy trzy okna terminala, wszystkie w katalogu projektu. najłatwiej z użyciem VSCode/VSCodium. W każdym kolejno wpisujemy:

1. ```npm run g``` - uruchamia składanie kodu ```*.html``` i ```*.css``` z katalogu ```src``` do katalogu ```prod```. obserwacja zmian jest ciągła i po zapisaniu pliku ```*.html``` lub ```*.css``` w katalogu ```src``` następuje ponowne złożenie plików.

2. ```npm run w``` - uruchamia local serwer z katalogu ```prod``` pod adresem ```http://localhost:3030``` (możliwość zmiany w pliku ```watch.js```). serwer przeładowuje się automatycznie przy zmianie któregokolwiek z plików w katalogu ```prod```.

3. ```npm run tsw``` - uruchamia składanie kodu ```*.js``` z katalogu ```src``` do katalogu ```prod```. obserwacja zmian jest ciągła i po zapisaniu pliku ```*.js``` w katalogu ```src``` następuje ponowne złożenie plików według kolejności zdefiniowanej w ```tsconfig.json```. Dla pojedynczego złożenia (bez ciągłości obserwacji plików) można użyć ```npm run tsb```. W VSCode/VSCodium można też użyć kombinacji klawiszy ```shift``` + ```ctrl``` + ```B``` i wybrać  ```tsc: monitoruj``` lub ```tsc: kompilacja```. Jeśli nie działa to zainstaluj: ```npm install -g typescript```.



```npx serve dist```
mkcert 192.168.1.109


