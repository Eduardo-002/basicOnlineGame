const DIRECTION = {right:{x:1,y:0},up:{x:0,y:-1},left:{x:-1,y:0},down:{x:0,y:1}};

let players = {};

let fruits = [];

let socket; // socket.io variable
let myId = "";
let length = 1;

function setup(){
    createCanvas(window.innerHeight*0.6,window.innerHeight*0.6);
    noStroke();

    socket = io.connect(window.location.href);
    socketFuncks();
}

function draw(){
    // draw grid
    fill(230);
    rect(0,0,width,height);
    for(let y=0;y<length;y++){
        for(let x=y%2;x<length;x+=2){
            fill(220);
            rect(x*width/length,y*width/length,width/length,height/length);
        }
    }

    //fruits.forEach((elem)=>{elem.draw()});
    //players.forEach((elem)=>{elem.draw()});
    for(let i=0;i<Object.entries(fruits).length;i++){
        //console.log(Object.entries(players)[i][0]);
        let p = Object.entries(fruits)[i][1].p;
        fill(200,150,100);
        rect(p.x*width/length+(width/length)*0.1,p.y*height/length+(height/length)*0.1,width/length-(width/length)*0.2,height/length-(width/length)*0.2);
    }

    //console.log(Object.entries(players)[0]);
    let myp = {};
    let tempPlayer = Object.entries(players);
    for(let i=0;i<tempPlayer.length;i++){
        //console.log(Object.entries(players)[i][0]);
        if(myId==tempPlayer[i][0]){
            myp = tempPlayer[i][1].p;
        }else{ 
            let p = tempPlayer[i][1].p;
            fill(150);
            rect(p.x*width/length+(width/length)*0.1,p.y*height/length+(height/length)*0.1,width/length-(width/length)*0.2,height/length-(width/length)*0.2);
        }
    }
    fill(100,200,100);
    rect(myp.x*width/length+(width/length)*0.1,myp.y*height/length+(height/length)*0.1,width/length-(width/length)*0.2,height/length-(width/length)*0.2);
}

function keyPressed(){
    if(keyCode === RIGHT_ARROW){
        socket.emit("move",DIRECTION['right']);
    }
    if(keyCode === UP_ARROW){
        socket.emit("move",DIRECTION['up']);
    }
    if(keyCode === LEFT_ARROW){
        socket.emit("move",DIRECTION['left']);
    }
    if(keyCode === DOWN_ARROW){
        socket.emit("move",DIRECTION['down']);
    }
}

function socketFuncks(){
    socket.on('setDef',(data)=>{
        myId = data.id;
        length = data.length;
    });

    socket.on('updateGame',(data)=>{
        players = data.players;
        fruits = data.fruits;
    })
}

class Fruit{
    constructor(x,y){
        this.p = {x:x,y:y};
    }

    draw(){
        fill(150,220,100);
        rect(this.p.x*width/length+(width/length)*0.1,this.p.y*height/length+(height/length)*0.1,width/length-(width/length)*0.2,height/length-(width/length)*0.2);
    }
}

