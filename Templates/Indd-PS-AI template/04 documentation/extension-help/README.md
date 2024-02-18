# Instrukcja

Template
=================

Wszelkie prawa zastrzeżone.

Wersja beta.

Wstęp
-----

##extensionName## jest rozszerzeniem dla programów z pakietu Adobe CC: InDesign, Photoshop oraz Illustrator. Dodaje nowe funkcjonalności lub usprawnia istniejące.

Jego głównym przeznaczeniem jest podniesienie komfortu pracy w DTP. Usprawnia najbardziej uciążliwe prace przy składzie i projektowaniu.

Pierwsze uruchomienie
---------------------

### Instalacja

#### Windows

Rozszerzenie jest dostarczane w pakiecie z automatycznym instalatorem. Przed jego uruchomieniem należy zamknąć wszystkie aplikacje Adobe.

![](images/installer-file.png)

Następnie należy uruchomić instalator i poczekać na zakończenie operacji.

![](images/installer.png)

#### Mac OS X

Dla komputerów Macintosh rozszerzenie jest w postaci archiwum 7-zip. Należy rozpakować pliki i przenieść folder z rozszerzeniem do katalogu Extensions.

### Uruchomienie w aplikacji

W InDesign w menu górnym rozwijamy pozycję "Window", a następnie z pola "Extensions" wybieramy nazwę rozszerzenia .

![Extensions menu in InDesign](images/menu-extensions.png)

Menu z rozszerzeniami w InDesign.

### Interfejs

Funkcje są dostępne z poziomu paletki, jako przyciski lub w menu bocznym. Paletka podzielona jest na panele z kategoriami według zastosowań. Każdy panel zawiera dedykowane do danego działania przyciski.

![Main palette screen](images/main-palette.png)

Obraz paletki rozszerzenia Multitool.

Panele można przełączać, klikając w ich nazwę. Na grafice są widoczne dwa, w miarę rozwoju rozszerzenia, może się pojawić ich więcej.

![](images/panel-buttons.png)  ![](images/panel-text.png)

Przyciski paneli "Narzędzia" i "Grep".

Przyciski mają krótkie opisy, które pokazują się nad wybranym elementem po przytrzymaniu na nim kursora przez dwie sekundy.

![Tool-tip screen](images/tool-tip.png)

Dymek pomocy.

Kliknięcie na ikonkę w prawym górnym rogu paletki wyświetla menu boczne.

![Side menu](images/menu-screen.png)

Opcje dostępne w menu bocznym.

Funkcjonalności
---------------

### Panel Narzędzia

#### Narzędzia obrazów

Grupa narzędzi dedykowana do konwersji elementów graficznych.

![](images/icon-graphic-1.png) 

Rasteryzuje zaznaczenie.

![](images/icon-graphic-2.png)

Spłaszcza wszystkie warstwy.

#### Uniwersalne

![](images/icon-universal-1.png)

Pokaż wszystkie ukryte elementy.

![](images/icon-universal-2.png)

Kasuje wszystkie linie pomocnicze w dokumencie.

![](images/icon-universal-3.png)

Tworzy nowy dokument.

![](images/icon-universal-4.png)

Odblokowuje wszystkie elementy w dokumencie.

![](images/icon-universal-5.png)

Rozdziela wszystkie grupy w dokumencie.

#### Narzędzia tekstowe

![](images/icon-text-1.png)

Dodaje tekst.

### Panel Lista

#### Lista tekstowa

Demonstracja działania listy rozwijanej.

![](images/list-add-text-2.png)

![](images/list-add-text-1.png)

Dodaje tekst wybrany z listy.

### Menu boczne

#### Ustawienia

Pozwala na wybranie dodatkowych ustawień rozszerzenia. Np. zmianę języka interfejsu.

![](images/settings-panel-screen.png)

Wraz z rozwojem rozszerzenia pojawi się więcej opcji w panelu ustawień.

#### Wyświetl plik pomocy

Wyświetla w domyślnej przeglądarce plik pomocy.

#### Informacje

Wyświetla informacje na temat wersji rozszerzenia. Dzięki temu możemy sprawdzić, czy mamy zainstalowaną najnowszą wersję.

![](images/about-panel-screen.png)

#### Reset konfiguracji

Resetuje wszystkie ustawienia rozszerzenia do domyślnych. Opcja przydatna w przypadku nieprawidłowego działania rozszerzenia.

Skróty klawiaturowe
-------------------

Rozszerzenia daje możliwość zdefiniowania skrótów klawiszowych do niektórych funkcjonalności. Skróty definiujemy przez standardowy panel ustawień InDesign dostępny w menu "Edit".

![](images/keyboard-shortcuts-screen.png)

Wywoływanie panelu skrótów klawiaturowych z menu.

Po wywołaniu panelu, wybieramy z listy "Product Area" pozycję "Scripts". Następnie szukamy na liście pozycji zaczynającej się od "User:" i nazwy naszego rozszerzenia. Na końcu jest nazwa dostępnej funkcji.

![](images/keyboard-shortcuts-set-screen.png)

Przypisywanie skrótu do funkcjonalności rozszerzenia.

Zaznaczamy pozycję z wyszukaną funkcją i klikamy w okienko "New Shortcut". Teraz każde naciśnięcie dowolnej kombinacji klawiszy powoduje wpisanie jej do okienka. Pod okienkiem wyświetlana jest informacja, czy wybrany skrót jest już do czegoś używany. Wybór zatwierdzamy przyciskiem "Assign". Zdefiniowany skrót pojawia się na liście "Current Shortcuts".

Po zdefiniowaniu skrótu należy jeszcze zapisać w aplikacji całe ustawienia przyciskiem "Save".