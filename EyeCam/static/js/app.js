/**
 * Created by Yuntian Chai on 15-3-21.
 */

var APP = {
    version:0.1,
    dependency:[pupil,camera]

};


var config = function(){
    this.distance = 100;
    this.delay = 300; // miliseconds
};

config.prototype.Save=function(k,v)
{
    this[k] = v;
    // Save to local storage
    window.localStorage[k] = v;
};


var process = function(imgdata,w,h){

        var  grayData= pupil.gs(imgdata.data);
        //var  grayInvs = pupil.invs(grayData);
        //var  grayBin = pupil.bin(grayInvs,200,0);
        //var  grayCny = pupil.cny(grayData,w,h);
        //var  grayCut2 = pupil.bin(grayCny,150);
        //var  graySb = pupil.sbl(grayData,w,h,pupil.kernel.k0);

        //var  thres = pupil.fT(pupil.hist(graySb),w*h,0.1);
        var  thres = pupil.fT(pupil.hist(grayData),w*h,0.1);
        var  grayCut = pupil.bin(grayData,thres);
        var  grayInvs = pupil.invs(grayCut);
        //var  grayCut = pupil.dcut(grayCny,135,0);
        var  data = grayInvs;

        return data;
};

var cfg = new config();

var canvas = new Cvs();
canvas.clear();
var circles = new Circles(canvas.canvas.width,canvas.canvas.height,cfg.distance,5,"#FF0000");
circles.drawAll(canvas.ctx);
// Handle Resize Event
window.addEventListener( 'resize', function(){
    //canvas.canvas.width=window.innerWidth;
    //canvas.canvas.height=window.innerHeight;
    circles = new Circles(canvas.canvas.width,canvas.canvas.height,cfg.distance,5,"#FF0000");
    canvas.clear();
    circles.drawAll(canvas.ctx);

}, false );


var btnOK = document.getElementById("btnOK");

btnOK.hide = function(){
    btnOK.parentNode.removeChild(btnOK);
};


function saveImg (cvs,filename) {
    var link = document.createElement('a');
    // here is the most important part because if you dont replace you will get a DOM 18 exception.
    var image = cvs.toDataURL("image/png",'haha').replace("image/png", "image/octet-stream");
    link.href = image;
    link.download = filename+".png";
    link.click();
    //window.location.href=image; // it will save locally
}


var tempCanvas = document.createElement("canvas");


tempCanvas.save = function(filename,data,w,h){

    tempCanvas.width = w;
    tempCanvas.height =h;
    var ctx = tempCanvas.getContext('2d');
    var imgData=ctx.createImageData(w,h);
    for(var x=0;x<w;x++)
    {
        for(var y=0;y<h;y++)
        {
            var k = x+y*w;
            var k2 = k*4;
            imgData.data[k2]=data[k];
            imgData.data[k2+1]=data[k];
            imgData.data[k2+2]=data[k];
            imgData.data[k2+3]=data[k];
        }
    }
    ctx.putImageData(imgData,0,0);
    saveImg(tempCanvas,filename);

};



var getimage = false;

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

        console.log(getimage);
        getimage = true;
    }

    if(keyID===32)
    {
        //fullScreen();

        for(var i=0;i<imageList.length;i++)
        {
            tempCanvas.save('test'+i,imageList[i],640,480);

        }
    }

}

window.document.onkeydown = keydown;

//window.addEventListener('keydown', keydown,true);

//canvas.addEventListener('keydown',keydown,true);
//circles.drawOne(canvas.ctx,1);

// TO DO
// Add Camera Read and take screen shot



function ScreenShotCall()
{
    getimage = true;
}

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
            tempCanvas.save("test",img,w,h);

            console.log(imageList.length);//For test.
        }
    },

    onSuccess: function() {
        // stream succesfully started, yay!

        console.log("success");
    },

    onError: function(error) {
        // something went wrong on initialization
    },

    onNotSupported: function() {
        // instruct the user to get a better browser
    }
});




var main = function()
{
    //fullScreen();


    if (screenfull.enabled) {
        screenfull.request();
    }
    btnOK.hide();
    camera.start();
};




btnOK.onclick = main;

//main();



