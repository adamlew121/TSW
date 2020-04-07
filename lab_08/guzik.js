function cli () {
    var node = document.createElement("LI");  
    node.className = "spec";  
    var labelText = document.createTextNode("nowy");
    node.appendChild(labelText);
    var button = document.createElement("BUTTON");
    var buttonText = document.createTextNode("Spec");
    button.onclick = cli;
    node.appendChild(button);

    var list = document.getElementById("lista");
    list.insertBefore(node, list.childNodes[list.childElementCount + 1]);
}

window.addEventListener('DOMContentLoaded', (event) => {
   // console.log('DOM fully loaded and parsed');
   // console.log(document.getElementsByClassName("spec")[0]);
   document.getElementsByClassName("spec")[0].getElementsByTagName("button")[0].onclick = cli;
});