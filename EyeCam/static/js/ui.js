
// Full Screen Utils
function fullScreen() {var de = document.documentElement;if(de.requestFullscreen){de.requestFullscreen();}else if (de.mozRequestFullScreen) {de.mozRequestFullScreen();}else if (de.webkitRequestFullScreen){de.webkitRequestFullScreen();}}
function exitFullscreen() {var de = document;if (de.exitFullscreen) {de.exitFullscreen();}else if (de.mozCancelFullScreen) {de.mozCancelFullScreen();}else if (de.webkitCancelFullScreen) {de.webkitCancelFullScreen();}}

/*
 * Main calibration function utils
 *
 * */

// canvas tha manage the 9 points on the screen
var Cvs = function()
{
    var canvas = document.createElement('canvas');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    document.body.appendChild(this.canvas);
    window.addEventListener( 'resize', function(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    },false);
};

Cvs.prototype.clear=function()
{
    this.ctx.fillStyle="#000000";
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
};

var circle = function(x,y,r,c)
{
    this.x = x||0.0;
    this.y = y||0.0;
    this.r = r||1.0;
    this.c = c||'0xFFFFFF';
};

var drawCircle = function(ctx,circle)
{
    ctx.fillStyle = circle.c;//设置样式
    ctx.beginPath();//创建路径
    ctx.arc(circle.x, circle.y,circle.r, 0, Math.PI * 2, true);//绘制图形
    ctx.closePath();//关闭路径
    ctx.fill();//填充
};

// Circles for calibration
var Circles = function(w,h,sp,r,c)
{
    var circles = [];
    var cx = w/2.0;// screen center x;
    var cy = h/2.0// screen center y
    var left = cx - sp;
    var right = cx + sp;
    var top = cy-sp;
    var bottom = cy+sp;

    //The arrangment and the index of the nine points
    //1,2,3
    //4,5,6
    //7,8,9

    // top row
    circles.push(new circle(left,top,r,c));
    circles.push(new circle(cx,top,r,c));
    circles.push(new circle(right,top,r,c));

    // center row
    circles.push(new circle(left,cy,r,c));
    circles.push(new circle(cx,cy,r,c));
    circles.push(new circle(right,cy,r,c));

    // bottom row
    circles.push(new circle(left,bottom,r,c));
    circles.push(new circle(cx,bottom,r,c));
    circles.push(new circle(right,bottom,r,c));
    this.children = circles;

};

Circles.prototype.drawAll= function(ctx){for(var i=0;i< this.children.length;i++){drawCircle(ctx,this.children[i]);}};
Circles.prototype.drawOne= function(ctx,index){drawCircle(ctx,this.children[index]);};
