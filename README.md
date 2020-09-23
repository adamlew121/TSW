# TSW

Vue / Express / WebSockets / MongoDB

Serwis aukcyjny oferujący poniższe funkcjonalności:

* Obsługa użytkowników (rejestracja, uwierzytelnianie)
* Zalogowani użytkownicy mogą wystawiać oferty aukcyjne
* Aukcja może być jednego z dwóch typów: "licytacja" oraz "kup teraz"
* Udział w aukcji mogą brać wyłącznie zalogwani użytkownicu
* Przeglądać oferty oraz śledzić postęp licytacji można również nie będąć zerejestrowanym użytkownikiem. Taki obserwator nie ma jenak dostępu do danych licytacji "na żywo"
* Lista ofert udostępniana jest w postaci stronicowanej
* Zarejestrowani użytkownicy mogą komunikować się pomiędzy sobą za pomoca wbudowanego w serwis komunikatora. Komunikator obsługuje historię rozmów
* Każdy zarejestrowany użytkownik ma dostęp do historii aukcji
* Każdy zarejestrowany użytkownik posiada panel, w którym na bieżąco obserwuje postęp wszystkich aukcji, w których bierze udział (jako licytujący). Z poziomu panelu może również podbijać aukcję.
