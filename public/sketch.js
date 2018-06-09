var socket;
var colorPicker = document.getElementById("colorpicker");
var sizeLine = document.getElementById("sizeLine");
var sharedCanvas

function setup() {
    createCanvas(800, 600);
    background(50);
    sharedCanvas = document.getElementById("defaultCanvas0");
    socket = io();
    socket.on('drawSend', function (data) {
        strokeWeight(data.size);
        stroke(data.cl);
        line(data.x, data.y, data.px, data.py);
    });
    socket.on('userCount', function (data) {
        var title = document.getElementById("numusers");
        title.innerHTML = "Nombre d'utilisateur: " + data;
    });
    socket.on('getCanvas', function (data){
        //on recupere l'image sous forme de dataurl et on l'insere dans le canvas
        //Mais pour le moment ça ne fonctionne pas !
        console.log("je suis censé afficher le Canvas rempli !")
        var imgstore= loadImage(data); 
        image(imgstore,0,0);
        console.log(data);
    });
    socket.on('askCanvas', function (){
        socket.emit('sendCanvas',sharedCanvas.toDataURL());
    });
}

function mouseDragged() {
    console.log(mouseX + "," + mouseY+", selectedIndex:"+sizeLine.selectedIndex);
    var data = {
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY,
        cl: colorPicker.value,
        size: 2*Number(sizeLine.selectedIndex+1)
    }
    
    socket.emit('mouseDraw', data);
    strokeWeight(data.size);
    stroke(data.cl);
    line(data.x, data.y, data.px, data.py);
    
    
}

function draw() {
    
}
