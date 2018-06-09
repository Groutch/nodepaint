//on utilise express
const express = require("express");
const app = express();
var fs = require("fs");
//const p5 = require("p5");
//on utilise le moteur de template ejs
app.set("view engine", "ejs");
//middleware: on indique que les fichiers statiques
//(css, stripts js...) sont dans le dossier public
app.use(express.static("public"));
//si un client accede à la racine, on affiche le fichier index.ejs
app.get("/", function (req, res) {
    res.render("index");
});
server = app.listen(process.env.PORT || 8080);
var nbusers=0;
var imgURL="";
//on utilise socket.io
const io = require("socket.io")(server);
//si un client se connecte...
io.on("connection", function (socket) {
    nbusers++;
    //on envoie le nombre d'utilisateur à tous les clients
    io.sockets.emit('userCount',nbusers);
    console.log("Nb users: "+nbusers);
    //on envoie la requette du canvas à tous AUTRES clients
    socket.broadcast.emit('askCanvas');
    //lorsqu'on on reçoit un canvas d'un client sous forme d'url on le sauvegarde 
    socket.on('sendCanvas',function(data){
        //fs.writeFile("canvasurl",data);
        imgURL=data;
    });
    //puis on l'envoie uniquement au client qui s'est connecté
    if (imgURL!=""){
        socket.emit('getCanvas', imgURL);
    }
    //Lorsqu'un client dessine, on envoie ce qu'il dessine à tous les autres clients
    socket.on('mouseDraw',function(data){
        socket.broadcast.emit('drawSend', data);
        //console.log(data.x+","+data.y);
    });
    socket.on("disconnect", function(socket){
        nbusers--;
        io.sockets.emit('userCount',nbusers);
        console.log("Nb users: "+nbusers);
    });
});
