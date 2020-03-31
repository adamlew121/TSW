const zadanie1 = () => {
    var node = document.createElement("LI");                 // Create a <li> node
    var textnode = document.createTextNode("Wsparcie telefoniczne 24/7");         // Create a text node
    node.appendChild(textnode);                      

    document.getElementById("pro-plan")
    .getElementsByClassName("list-unstyled mt-3 mb-4")[0]
    .appendChild(node);
};

const zadanie2 = () => {
    var list = document.getElementsByClassName("card-deck text-center")[0];
    list.appendChild(list.firstElementChild);
};

const zadanie3 = () => {

}s