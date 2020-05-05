/*global io: false */
/* globals axios: false */
// https://github.com/axios/axios
"use strict";
// Inicjalizacja UI
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        const chatStatus	= document.getElementById("chatStatus");
        const newsStatus	= document.getElementById("newsStatus");
        const open	      = document.getElementById("open");
        const close	      = document.getElementById("close");
        const chatSend	  = document.getElementById("chatSend");
        const newsSend	  = document.getElementById("newsSend");
        const chatText 	  = document.getElementById("chatText");
        const newsText 	  = document.getElementById("newsText");
        const chatMessage	= document.getElementById("chatMessage");
        const newsMessage	= document.getElementById("newsMessage");
        const greenBullet = "img/bullet_green.png";
        const redBullet   = "img/bullet_red.png";
        const newTitle = document.getElementById("newTitle");
        const createRoom = document.getElementById("createRoom");
        const chatRooms = document.getElementById("chatRooms");
        refreshChatRooms();

        let chat, news; 

        close.disabled = true;
        chatSend.disabled = true;
        newsSend.disabled = true;
        // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
        open.addEventListener("click", () => {
            open.disabled = true;
            chat = io(`https://${location.host}/chat`);
            news = io(`https://${location.host}/news`);

            chat.on("connect", () => {
                close.disabled = false;
                chatSend.disabled = false;
                chatStatus.src = greenBullet;
                console.log("Nawiązano połączenie z kanałem „/chat”");
            });
            news.on("connect", () => {
                close.disabled = false;
                newsSend.disabled = false;
                newsStatus.src = greenBullet;
                console.log("Nawiązano połączenie z kanałem „/news”");
            });
            chat.on("disconnect", () => {
                open.disabled = false;
                chatStatus.src = redBullet;
                console.log("Połączenie z kanałem „/chat” zostało zakończone");
            });
            news.on("disconnect", () => {
                open.disabled = false;
                newsStatus.src = redBullet;
                console.log("Połączenie z kanałem „/news” zostało zakończone");
            });
            chat.on("message", (data) => {
                chatMessage.textContent = data;
            });
            news.on("message", (data) => {
                newsMessage.textContent = data;
            });
        });
        // Zamknij połączenie po kliknięciu guzika „Rozłącz”
        close.addEventListener("click", () => {
            close.disabled = true;
            chatSend.disabled = true;
            newsSend.disabled = true;
            chatMessage.textContent = "";
            newsMessage.textContent = "";
            chat.disconnect();
            news.disconnect();
        });
        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        chatSend.addEventListener("click", () => {
            chat.emit("message", chatText.value);
            console.log(`Wysłałem wiadomość /chat: ${chatText.value}`);
            chatText.value = "";
        });
        newsSend.addEventListener("click", () => {
            news.emit("message", newsText.value);
            console.log(`Wysłałem wiadomość /news: ${newsText.value}`);
            newsText.value = "";
        });

        createRoom.addEventListener("click", () => {
            console.log('createRoom click ;**');
            axios.post("/chat", {title: newTitle.value})
                .then((resp) => {
                    console.log('odpowiedz serwera na post /chat');
                    //console.dir(resp.data);
                    console.log('later...');
                    refreshChatRooms();
                });
        });
    }
};

function refreshChatRooms () {
    var tempList = [];
    axios.get("/chatRooms")
        .then((resp) => {
            console.log('odpowiedz serwera na get /chatRooms');
            console.dir(resp.data);
            tempList = resp.data;

            chatRooms.innerHTML = '';
            var index;

            for(index = 0; index < tempList.length; ++index) {
                const title = (tempList[index]).title;
                var node = document.createElement("LI");
                var labelText = document.createTextNode(title);
                node.appendChild(labelText);
                var button = document.createElement("BUTTON");
                var buttonText = document.createTextNode("Enter chatroom");
                button.appendChild(buttonText);
                button.addEventListener('click', function() {
                    enterChatroom(title);
                });
                node.appendChild(button);
                chatRooms.insertBefore(node, chatRooms.childNodes[chatRooms.childElementCount + 1]);
            }
        }); 
}

function enterChatroom (chatroom) {
    console.log("Entering chatroom: " + chatroom);
    chat = io(`https://${location.host}/` + chatroom);
    
    chat.on("connect", () => {
        close.disabled = false;
        chatSend.disabled = false;
        chatStatus.src = greenBullet;
        console.log("Nawiązano połączenie z kanałem „/" + chatroom + "”");
    });
    chat.on("disconnect", () => {
        open.disabled = false;
        chatStatus.src = redBullet;
        console.log("Połączenie z kanałem „/chat” zostało zakończone");
    });
    chat.on("message", (data) => {
        chatMessage.textContent = data;
    });

    chatSend.addEventListener("click", () => {
        chat.emit("message", chatText.value);
        console.log(`Wysłałem wiadomość /chat: ${chatText.value}`);
        chatText.value = "";
    });
}

function generateChatData (chatroom) 

