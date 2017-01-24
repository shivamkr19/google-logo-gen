var express = require('express'),
	Canvas = require('canvas-prebuilt')
	app	= express(),
	bodyParser = require('body-parser'),
	path = require('path'),
	canvas = new Canvas(1000, 300),
	ctx = canvas.getContext('2d');

// For IIS only, subdirectory slug
var url_prefix = "", port = process.env.PORT || 8080;
// Create Global variables for this project
var colors = ['#4285F4','#EA4335','#FBBC05','#34A853'],
	sampleFont = new Canvas.Font('ShivamKR', path.join(__dirname,'fonts','Bold.ttf')),
	fontSize = 80, lineHeight = 88;
	ctx.addFont(sampleFont);	ctx.font = fontSize+"px ShivamKR";
//application configuration part
app.use(bodyParser.urlencoded({ extended: false }));
// PUBLIC URL
app.use(url_prefix + '/', express.static(path.join(__dirname,'public')));
// API
app.post(url_prefix + '/api', function(req, res){
	var logo_text = req.body.logo_text;
	//clear the canvas first
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	// add text to canvas
	_text(ctx, logo_text, 50, 100)
	// crop the canvas
	var canvasDataUrL = clip2URL(ctx, logo_text)
	// return HTMLImageElement
	res.type('text/html')
	res.send('<img src="' + canvasDataUrL + '" />')
});

app.listen(port, function(){
	console.log("Server listening on port" + port);
});

function _text(context, str, x, y){
	var color= '#4285F4', lastcolor = '#000000'; 
	for(var i=0; i < str.length; ++i){
		while(color === lastcolor){ color = colors[i] || colors[Math.round(Math.random()*3)]; }
		context.fillStyle = color;
		context.fillText(str.charAt(i), x, y);
		x += context.measureText(str.charAt(i)).width;
		lastcolor = color;
	}
}

function clip2URL(context, string){
	// create clipped canvas
	var tempCanvas = new Canvas(context.measureText(string).width + 10 , 98),
    tCtx = tempCanvas.getContext("2d");
 
    tCtx.drawImage(canvas, 45, 60 - 44 + 15,
    	context.measureText(string).width + 10, 98, 0, 0,
    	context.measureText(string).width + 10, 98 );
    return tempCanvas.toDataURL()
}