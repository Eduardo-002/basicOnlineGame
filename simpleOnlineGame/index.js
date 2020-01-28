// working

var express = require('express');
var socket = require('socket.io');


var app = express();
var server = app.listen(8080);
var io = socket(server);

app.use(express.static('public'));
console.log('App Running');


let LENGHT = 25;
let players = {};
let fruits = [];

let updater = setInterval(()=>{
    Object.entries(players).forEach((elem)=>{elem[1].upd()});
    io.emit("updateGame",{players:players,fruits:fruits});
},1000/30);

let fruitGenerator = setInterval(()=>{
    fruits.push(new Fruit());
},3000);

io.sockets.on('connection',(socket)=>{
    console.log('new connection');

    players[socket.id] = new Player(socket.id);
    console.log(players);
    //console.log(Object.entries(players)[0]);

    socket.emit('setDef',{
        id:socket.id,
        length:LENGHT
    });

    socket.on('move',(data)=>{
        players[socket.id].p.x += data.x;
        players[socket.id].p.y += data.y;
        if(players[socket.id].p.x<0)players[socket.id].p.x=0;
        if(players[socket.id].p.x>=LENGHT)players[socket.id].p.x=LENGHT-1;
        if(players[socket.id].p.y<0)players[socket.id].p.y=0;
        if(players[socket.id].p.y>=LENGHT)players[socket.id].p.y=LENGHT-1;
    });


    socket.on('disconnect',()=>{
        delete players[socket.id];
    })
})

class Player{
    constructor(id){
        this.id = id;
        this.p = {x:Math.floor(Math.random()*LENGHT),y:Math.floor(Math.random()*LENGHT)};
        this.points = 0;
        this.nick = Math.floor(Math.random()*100)+"";
    }

    upd(){
        for(let i=0;i<fruits.length;i++){
            if(fruits[i].p.x == this.p.x && fruits[i].p.y == this.p.y){
                fruits.splice(i,1);
                this.points+=1;
            }
        }
    }

    draw(){
        fill(200,150,60);
        rect(this.p.x*width/length+(width/length)*0.1,this.p.y*height/length+(height/length)*0.1,width/length-(width/length)*0.2,height/length-(width/length)*0.2);
    }
}

class Fruit{
    constructor(){
        this.p = {x:Math.floor(Math.random()*LENGHT),y:Math.floor(Math.random()*LENGHT)};
    }
}