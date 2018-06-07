//on utilise express
const express = require("express");
const app = express();
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
//on utilise socket.io
const io = require("socket.io")(server);
//si un client se connecte...
io.on("connection", function (socket) {
    nbusers++;
    io.sockets.emit('userCount',nbusers);
    console.log("Nb users: "+nbusers);
    socket.on('mouseDraw',function(data){
        socket.broadcast.emit('drawSend', data);
        console.log(data.x+","+data.y);
    });
    socket.on("disconnect", function(socket){
        nbusers--;
        io.sockets.emit('userCount',nbusers);
        console.log("Nb users: "+nbusers);
    });
});
