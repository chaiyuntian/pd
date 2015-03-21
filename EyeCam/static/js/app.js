/**
 * Created by Yuntian Chai on 15-3-21.
 */

var APP = {
    version:0.1,
    dependency:pupil

};
/*
*
* */
var circle = function(x,y,r,c)
{
    this.x = x||0.0;
    this.y = y||0.0;
    this.r = r||1.0;
    this.c = c||'0xFFFFFF';
    //this.l = this.x-this.r*0.5;
    //this.t = this.y-this.r*0.5;
};

circle.prototype.changeColor=function(c)
{
    this.c = c;
};


var config = function(){
    this.distance = 100;

};

config.prototype.Save=function(k,v)
{
    this[k] = v;
    // Save to local storage
};


// canvas tha manage the 9 points on the screen
var Cvs = function(cvsId)
{
    var id = cvsId||"canvas";
    this.canvas = document.getElementById(id);
    this.canvas.width=window.innerWidth;
    this.canvas.height=window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    //return this;
};

Cvs.prototype.clear=function()
{
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
};


var drawCircle = function(ctx,circle)
{

    ctx.fillStyle = circle.c;//设置样式
    ctx.beginPath();//创建路径
    ctx.arc(circle.x, circle.y,circle.r, 0, Math.PI * 2, true);//绘制图形
    ctx.closePath();//关闭路径
    ctx.fill();//填充

};

var InitCircles = function(w,h,sp,r,c)
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
    circles.push(new circle(left,cy,r,c));
    circles.push(new circle(left,bottom,r,c));

    // center row
    circles.push(new circle(cx,top,r,c));
    circles.push(new circle(cx,cy,r,c));
    circles.push(new circle(cx,bottom,r,c));

    // bottom row
    circles.push(new circle(right,top,r,c));
    circles.push(new circle(right,cy,r,c));
    circles.push(new circle(right,bottom,r,c));

    return circles;

};


var canvas = new Cvs();
//var c = new circle(0,0,15,"#FF0000");
canvas.clear();
//drawCircle(canvas.ctx,c);
var circles = InitCircles(canvas.canvas.width,canvas.canvas.height,200,5,"#FF0000");
for(var i=0;i< circles.length;i++)
{
    drawCircle(canvas.ctx,circles[i]);
}


