
// Full Screen Utils
function fullScreen() {
    var de = document.documentElement;if(de.requestFullscreen){de.requestFullscreen();}else if (de.mozRequestFullScreen) {de.mozRequestFullScreen();}else if (de.webkitRequestFullScreen){de.webkitRequestFullScreen();}}
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
    var ctn = document.getElementById("Container");
    ctn.appendChild(this.canvas);
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



function saveImg (cvs,filename) {
    var link = document.createElement('a');
    // here is the most important part because if you dont replace you will get a DOM 18 exception.
    var image = cvs.toDataURL("image/png",'haha').replace("image/png", "image/octet-stream");
    link.href = image;
    link.download = filename+".png";
    link.click();
    //window.location.href=image; // it will save locally
}


function drawLine(ctx,sx,sy,ex,ey,width){
    width = width || 1.0;
    ctx.strokeStyle='red';
    ctx.lineWidth=width;
    ctx.lineCap='square';
    ctx.beginPath();
    ctx.moveTo(sx,sy);
    ctx.lineTo(ex,ey);
    ctx.stroke();
    ctx.closePath();

}

function drawGrids(ctx,tb,lb,offsetx,offsety){
    var x = tb.x||0.0;
    var y = tb.y||0.0;
    var w = tb.w||0.0;
    var h = tb.h||0.0;
    var nx = tb.nx||0.0;
    var ny = tb.ny||0.0;

    var dx = w/nx;
    var dy = h/ny;

    // label tags
    var ux = lb.x||0.0;
    var uy = lb.y||0.0;
    var uw = lb.w||0.0;
    var uh = lb.h||0.0;

    var ux_xo = lb.xxo||0.0;
    var ux_yo = lb.xyo||0.0;

    var uy_xo = lb.yxo||0.0;
    var uy_yo = lb.yyo||0.0;


    var udx = uw/nx;
    var udy = uh/ny;

    var i,j;
    // draw horizontal lines

    for(i=0;i<=ny;i++)
    {
        var cy = y+i*dy;
        drawLine(ctx,x,cy,x+w,cy);

        var x_label = uy+udy*i;
        drawText(ctx,x_label.toString(),x+w+ux_xo,cy+ux_yo,8);
    }

    // draw vertical lines
    for(j=0;j<=nx;j++)
    {
        var cx = x+j*dx;
        drawLine(ctx,cx,y,cx,y+h);

        var y_label = ux+udx*j;
        drawText(ctx,y_label.toString(),cx+uy_xo,y+h+8+uy_yo,8);
    }

    // draw texts
}

function drawText(ctx,ctn,x,y,fsize){

    fsize = fsize||"8px";
    ctx.font = "8px Courier New";
    ctx.fillStyle = "red";
    ctx.fillText(ctn, x,y);
}