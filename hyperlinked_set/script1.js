document.addEventListener("DOMContentLoaded", function() {
    const intervalId = setInterval(drawRandomText, 200);  
    setTimeout(function() {
        clearInterval(intervalId); 
    }, 60000); 
});

function drawRandomText() {
    const textArray1 = ["WHY","IS","CAT","EVERYWHERE"];

    const x = Math.random() * (window.innerWidth);  
    const y = Math.random() * (window.innerHeight); 

    const div = document.createElement('div');
    const p = document.createElement('p');

  
    p.innerText = textArray1[Math.floor(Math.random() * textArray1.length)];


    div.style.position = "absolute";
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.backgroundColor = "black";
    div.style.color = "white";
    div.style.border = "none";
    div.style.borderRadius = "20px";
    div.style.padding = "20px 40px";
    div.style.cursor = "pointer";
    div.style.fontFamily = "'Proxima Nova', sans-serif";
    div.style.fontSize = "20px";

    p.style.margin = "0";
    p.style.textDecoration = "none";

    div.appendChild(p);
    document.body.appendChild(div);
}
