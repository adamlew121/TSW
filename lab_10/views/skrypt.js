/* globals axios: false */
// https://github.com/axios/axios

window.addEventListener("DOMContentLoaded", () => {
    console.log("Tutaj znajdzie się obsługa interfejsu gry!");


    console.log('form xxd');
    const form = document.querySelector('form');

    const formEvent = form.addEventListener('submit', event => {
        event.preventDefault();

        const size = document.querySelector('#size').value;
        const dim = document.querySelector('#dim').value;
        const max = document.querySelector('#max').value;
        const game = {size, dim, max};
        console.log("game: " + game)
        createGame(game);
    })

    });

    var n;
    var size;
    var dim;
    var max;
    var gameData;
    
    const createGame = (game) => {
        axios.post("/", game)
            .then((resp) => {
                console.log("Odpowiedź serwera na POST /mmind:");
                console.dir(resp.data);
                size = resp.data.params.size;
                dim = resp.data.params.dim;
                max = resp.data.params.max;
                gameData = ["start (size: " + size + ", dim: " + dim + ", max: " + max + ")"];
                console.log("size: " + size + ", dim: " + dim + ", max: " + max)
                n = max;
                
                document.getElementById("table").innerHTML = '';
                gameDescr();
                generateGuessField();
            })
    }

    const checkGuess = () => {
        var line = document.getElementsByClassName("guess")[0].parentNode;
        var input = line.firstChild.value;
        var answer = input.split(',').map(function(num) {
            return parseInt(num, 10);
        });

        if(Object.keys(answer).length != size) {
            console.log("wprowadzono nieprawidlowe dane, wprowadz " + size + " liczb wartosci 0-" + dim + " oddzielonych przecinkami");
        } else {
            gameData.push(answer.join());

            axios.patch("/", answer)
                .then((resp) => {
                    console.log("Odpowiedź serwera na PATCH /mmind:");
                    console.dir(resp.data);
                    if (--n == 0) {
                        line.removeChild(line.childNodes[line.childElementCount - 1]);
                        var result = document.createElement("P");
                        const blackAndWhite = "biale: " + resp.data.params.white + ", czarne: " + resp.data.params.black;
                        var text = document.createTextNode(blackAndWhite);
                        gameData.push(blackAndWhite);

                        result.appendChild(text);
                        line.insertBefore(result, line.childNodes[line.childElementCount + 1]);

                        if(resp.data.params.black == size) {
                            win();
                            gameData.push("win - stopping game");
                            axios.post("/saveGame", gameData)
                                .then((resp) => {
                                    console.log("Odpowiedz serwera na POST /saveGame: ")
                                    console.dir(resp.data);
                                })
                        } else {
                            lose();
                            gameData.push("lose - stopping game");
                            axios.post("/saveGame", gameData)
                                .then((resp) => {
                                    console.log("Odpowiedz serwera na POST /saveGame: ")
                                    console.dir(resp.data);
                                })
                        }
                    
                    }
                    else {
                        line.removeChild(line.childNodes[line.childElementCount - 1]);
                        var result = document.createElement("P");
                        const blackAndWhite = "biale: " + resp.data.params.white + ", czarne: " + resp.data.params.black;
                        var text = document.createTextNode(blackAndWhite);
                        gameData.push(blackAndWhite);

                        result.appendChild(text);
                        line.insertBefore(result, line.childNodes[line.childElementCount + 1]);

                        if(resp.data.params.black == size) {
                            win();
                            console.log('win - teraz gamedata leci');
                            gameData.push("win - stopping game");
                            console.log(gameData);
                            axios.post("/saveGame", gameData)
                                .then((resp) => {
                                    console.log("Odpowiedz serwera na POST /saveGame: ")
                                    console.dir(resp.data);
                                })
                        } else {
                            generateGuessField();
                        }
                    
                    }

                })
            }
    }

    function generateGuessField () {

        var node = document.createElement("LI");
    
        var input = document.createElement("INPUT");
        node.appendChild(input);

        var button = document.createElement("BUTTON");
        var buttonText = document.createTextNode("Sprawdz");
        button.appendChild(buttonText);
        button.className = "guess"
        node.appendChild(button);

        var table = document.getElementById("table");
        table.insertBefore(node, table.childNodes[table.childElementCount + 1]);
        button.onclick = checkGuess;  
    }

    function win () {
        var result = document.createElement("P");
        var text = document.createTextNode("GRATULACJE, WYGRANA");
        result.appendChild(text);
        var table = document.getElementById("table");
        table.insertBefore(result, table.childNodes[table.childElementCount + 1]);
    }

    function lose () {
        var result = document.createElement("P");
        var text = document.createTextNode("KONIEC GRY, PRZEGRANA");
        result.appendChild(text);
        var table = document.getElementById("table");
        table.insertBefore(result, table.childNodes[table.childElementCount + 1]);
    }

    function gameDescr() {
        var h1 = document.createElement("H1");
        var text = document.createTextNode("Odgadnij kombinacje: ")
        h1.appendChild(text)

        var descr = document.createElement("P");
        var text2 = document.createTextNode("ilosc elementow: " + size + ", wartosci elementow: 0-" + dim + ", ilosc dozwolonych ruchow (0 = nieskonczonosc): " + max);
        descr.appendChild(text2);

        var table = document.getElementById("table");
        table.insertBefore(h1, table.childNodes[table.childElementCount + 1]);
        table.insertBefore(descr, table.childNodes[table.childElementCount + 1]);
    }


