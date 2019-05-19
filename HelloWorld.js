
const cvs = document.getElementById("air");
const ctx = cvs.getContext('2d');

const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "RED"
}

const user = {
    x : 0, 
    y : (cvs.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "BLACK"
}

const com = {
    x : cvs.width - 10, 
    y : (cvs.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "BLACK"
}

const net = {
    x : (cvs.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "#808080"
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}


function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function resetBall()
{
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function drawNet(){
    for(let i = 0; i <= cvs.height; i+=10){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "60px arial";
    ctx.fillText(text, x, y);
}




function render(){
    

    drawRect(0, 0, cvs.width, cvs.height, "#36594a");

   if(user.score >= 7 || com.score >= 7)
   {
       if(user.score == 7 )
    drawText("User",0,cvs.height/5);
    else
    drawText("Computer",0,cvs.height/5);
   
    drawText("Wins",3*cvs.width/4,cvs.height/5);
    return;
   }
   drawText(user.score,cvs.width/4,cvs.height/5);
    
   
   drawText(com.score,3*cvs.width/4,cvs.height/5);
   
    
    drawNet();
    
    
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

cvs.addEventListener("mousemove", getMousePos);

function getMousePos(evt)
{
    let rect = cvs.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

function collision(b,p)
{
    b.top = b.y - b.radius;
    b.bottom = b.y +b.radius;
    b.left = b.x -b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right>p.left && b.bottom >p.top && b.left < p.right && b.top< p.bottom;
}
function update()
{
    if(ball.x - ball.radius <0)
    {
        com.score++;

        resetBall();
    }
    else if(ball.x + ball.radius > cvs.width)
    {
        user.score++;
        
        resetBall();
    }
   

    ball.x += ball.velocityX;
    ball.y +=ball.velocityY;

    let margin = 0.11;
    com.y +=(ball.y - (com.y + com.height/2)) * margin;
    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius<0)
    {ball.velocityY = -ball.velocityY;
     
    }
     let player = (ball.x < cvs.width/2) ? user :com;
    if(collision(ball,player))
    {
        let collidePoint = ball.y - (player.height/2 + player.y);
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4)*collidePoint;

        let direction = (ball.x + ball.radius < cvs.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed* Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed +=0.5;
    }

}

function game(){
    update();
    render();
}
let framePerSecond = 50;
let loop = setInterval(game,1000/framePerSecond);
