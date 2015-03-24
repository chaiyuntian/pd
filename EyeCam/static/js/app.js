/**
 * Created by Yuntian Chai on 15-3-21.
 */

var APP = {
    version:0.1,
    dependency:[pupil,camera]

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
    window.localStorage[k] = v;
};



//进入全屏
function fullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}
//退出全屏
function exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}


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
    this.ctx.fillStyle="#000000";
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

Circles.prototype.drawAll= function(ctx)
{
    for(var i=0;i< this.children.length;i++)
    {
        drawCircle(ctx,this.children[i]);
    }

};

Circles.prototype.drawOne= function(ctx,index)
{
    drawCircle(ctx,this.children[index]);
};

var process = function(imgdata,w,h){

        var  grayData= pupil.gs(imgdata.data);
        //var  grayInvs = pupil.invs(grayData);


        //var  grayBin = pupil.bin(grayInvs,200,0);
        //var  grayCny = pupil.cny(grayData,w,h);
        //var  grayCut2 = pupil.bin(grayCny,150);
        var  graySb = pupil.sbl(grayData,w,h,pupil.kernel.k0);

        var  thres = pupil.fT(pupil.hist(graySb),w*h,0.1);

        var  grayCut = pupil.bin(graySb,thres);
        //var  grayCut = pupil.dcut(grayCny,135,0);
        var  data = graySb;

        return data;


};



var main=function()
{
    var cfg = new config();
    var canvas = new Cvs();
    canvas.clear();
    var circles = new Circles(canvas.canvas.width,canvas.canvas.height,cfg.distance,5,"#FF0000");
    circles.drawAll(canvas.ctx);
    // Handle Resize Event
    window.addEventListener( 'resize', function(){
        canvas.canvas.width=window.innerWidth;
        canvas.canvas.height=window.innerHeight;
        circles = new Circles(canvas.canvas.width,canvas.canvas.height,cfg.distance,5,"#FF0000");
        canvas.clear();
        circles.drawAll(canvas.ctx);

    }, false );


    // For Test Usage
    function keydown(e)
    {
        /*
        keycode 49 = 1 exclam onesuperior
        keycode 50 = 2 quotedbl twosuperior
        keycode 51 = 3 section threesuperior
        keycode 52 = 4 dollar
        keycode 53 = 5 percent
        keycode 54 = 6 ampersand
        keycode 55 = 7 slash braceleft
        keycode 56 = 8 parenleft bracketleft
        keycode 57 = 9 parenright bracketright
        */

        var keyID = e.keyCode ? e.keyCode :e.which;
        if(keyID>=49&&keyID<=57) {
            canvas.clear();
            circles.drawOne(canvas.ctx, keyID - 49);
            /* TODO:Test the proper delay time and Set getImage in a delay callback
             *
             */

            getimage = true;
        }

        if(keyID===32)
        {
            fullScreen();
        }

    }




//circles.drawOne(canvas.ctx,1);

// TO DO
// Add Camera Read and take screen shot

    var getimage = false;
    var imageList = [];
    var w = 640,h = 480;
    camera.init({
        width: w, // default: 640
        height: h, // default: 480
        fps: 30, // default: 30
        mirror: true,  // default: false
        targetCanvas: null, // default: null

        onFrame: function(canvas) {
            // do something with image data found in the canvas argument
            if(getimage){
                getimage = false;
                var data = canvas.getContext('2d').getImageData(0,0,w,h);
                var img = process(data,w,h);
                imageList.push(img);

                console.log(imageList.length);//For test.
            }
        },

        onSuccess: function() {
            // stream succesfully started, yay!
        },

        onError: function(error) {
            // something went wrong on initialization
        },

        onNotSupported: function() {
            // instruct the user to get a better browser
        }
    });


    window.addEventListener('keydown', keydown,true);

    camera.start();
};

main();



