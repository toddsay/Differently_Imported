/*!
 * HTML5/JS web player Differently imported
 * https://chrome.google.com/webstore/detail/differently-imported-for/bnihjdccalbcoienhgcjjlilfdhacdkf
 *
 * phil / @ / pbarton / .co / .uk
 * Copyright 2014, Phil Barton
 * 
 
	This library is free to use, and always will be however the source is the property of the original developer. 
	
	You may make any modifications to the source for your own personal use, but you may not release or offer a 
	modified copy of this software under any terms of any licence. Modified source code must not be made public. 
	Any modifications that may be seen as useful or an improvement may be sent to the author for review.
	Any inclusion will be made with full credit however inclusion is solely at the discretion of the author. 
	Who knows, enough mods offered and I can throw a plugin library together. Feel free to code Mlkdrop for me! :) 
	(Fork Milkshake on Github) 
	
	Any components listed specifically as being under the terms of a different License will fall under the  
	terms of that Licence and no other. These components will be clearly commented within the source code along 
	with any acknowledgements to original authors.
	
    This library is distributed and free to be modified with the ideal that openness and honesty with code 
	is the key to security and trust, but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
	
	More importantly I hope you enjoy using the App. 
	
 * Date: 3rd March 2015. 16.33 GMT
*/

var frameLength = 5; //ms to display
var bg = chrome.extension.getBackgroundPage();
showControl = false;
doShowC = false;
function showCont(){
	clearTimeout(showControl);
	$( "#controls" ).css({"opacity": 1});	
	showControl = setTimeout(function(){
			$( "#controls" ).fadeTo( "fast" , 0);
	},1000);
	
}		

$(document).ready(function() {
showCont();
$('#controls').mouseout(function(){
		showCont();
});
$('#controlP').mouseout(function(){
		showCont();
});
$('#channel').mouseout(function(){
		showCont();
	});
	$('#vol').mouseout(function(){
		showCont();
	});
		
		$('#controls').mouseover(function(){
		showCont();
	});
		$('#controlP').mouseover(function(){
		showCont();
	});
	$('#channel').mouseover(function(){
		showCont();
	});
	$('#vol').mouseover(function(){
		showCont();
	});
	
	$('#controls').mousemove(function(){
		showCont();
	});
		$('#controlP').mousemove(function(){
		showCont();
	});
	$('#channel').mousemove(function(){
		showCont();
	});
	$('#vol').mousemove(function(){
		showCont();
	});
    document.getElementById("lC").addEventListener('change', function() { // onClick for link to display key box

			
			$.cookie("diChPt", $("#lC option:selected").text(), {		
									expires: 365
							});
			$.cookie("diChImage", $("#lC option:selected").attr("data-image"), {		
					expires: 365
			});
			$.cookie("diChan", $(this).val(), {
                    expires: 365
                }); // Store key for next time.
        if (bg.playing) {
            clearInterval(disTimer);
            setTimeout(function() {
                disTimer = setInterval(function() {
                    getTn();
                }, 500);
            }, 750);
            doPlay();
        }
    });
    if ($.cookie('diKeys') != null) {
        $('#newtop').css("display", "none");
        $('#top').css("display", "block");
        $('#lK').val($.cookie("diKeys"));
        $('#lC').val($.cookie("diChan"));
        $('#server').val($.cookie("Diserver"));
        $('#vol').val( $.cookie("diVol"));
        hQ = $.cookie("dihQ");
        $('#hQ').val($.cookie("diHq"));

	}
    document.getElementById("stBut").addEventListener('click', function() { // On Stop Click
        $('#plBut').css("background-color", "#222");
        $('#stBut').css("background-color", "#000");
        chrome.runtime.sendMessage({
            play: "0"
        }); //Send method play:0 == Stop.
        $("#track").text("Stopped");
        $.cookie("diChTn", "Stopped", {
            expires: 365
        });
    });
    document.getElementById("plBut").addEventListener('click', function() { // on Play click
        doPlay();
    });
    ws = 0;
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            doScreenBig(1);
        } // esc
    });
	
	$(document).dblclick(function() {
		doScreenBig(0);
	});

    document.getElementById("full_screen").addEventListener('click', function() {
        doScreenBig(0);
    });
    document.getElementById("setCBut").addEventListener('click', function() {
        if (meltme) {
            meltme = false;
        } else {
            meltme = true;
        }
    });

    function doScreenBig(trigger) {
        chrome.windows.getCurrent(function(win) {
            chrome.windows.get(win.id, function(chromeWindow) {
                if (chromeWindow.state === "fullscreen") {
                    chrome.windows.update(win.id, {
                        state: "maximized"
                    });
                } else {
                    if (trigger != 1) {
                        chrome.windows.update(win.id, {
                            state: "fullscreen"
                        });
                    }
                }
            });
        });
    }
    $("#track").html($.cookie("diChTn"));
    disTimer = setInterval(function() {
        getTn();
    }, 1000);

    function getTn() {
		if(!$('#vol').mousedown()){
		$('#vol').val($.cookie("diVol"));
		}
        chrome.runtime.sendMessage({
            play: "3"
        });
		if(bg.playing){
		            $("#track").html($.cookie("diChTn") +"<br />" +"<span class='imgBox'>"+$.cookie("diChPic")+"</span>");	
		}
		else{
			$("#track").html($.cookie("diChTn") )
		}
     
        $('#lC').val($.cookie("diChan"));
        //Label some variables
    }
	
});
$(document).ready(function(e) {
   $("#vol").on("input change", function() { 

        $.cookie("diVol",   ($('#vol').val()),
 {
            expires: 365
        });
		
		
        chrome.runtime.sendMessage({
            play: "2", //Send method play:2 == Change player parameter
            vol: ($('#vol').val())
        }); // player.js receives message and volume. does the doo.
        // Store volume for next time. 
    });

    analyse_this();
});

function doPlay() {
    var checkKey = $.ajax({
        type: "get",
        url: 'http://listen.di.fm/public3/favorites?' + $('#lK').val(),
        statusCode: {
            200: function() {
                $('#plBut').css("background-color", "#000");
                $('#stBut').css("background-color", "#222");
                $.cookie("diHq", $('#hQ').val(), {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("diKeys", $('#lK').val(), {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("diChan", $('#lC').val(), {
                    expires: 365
                }); // Store key for next time.
                $.cookie("premium", "1", {
                    expires: 365
                }); // Store key for next time. 
				
                volm = $.cookie("diVol"); // Store key for next time.
                chrome.runtime.sendMessage({
                    key: $('#lK').val(), //Send key to background player
                    channel: $('#lC').val(), //with channel selection
                    vol: volm,
                    server: $('#server').val(),
                    play: "1"
                }); //and method play:1 == Play.
            },
            403: function() {
                $('#plBut').css("background-color", "#000");
                $('#stBut').css("background-color", "#222");
                $.cookie("diHq", "0", {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("diKeys", "", {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("premium", "0", {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("diChan", $('#lC').val(), {
                    expires: 365
                }); // Store for next time.
                volm = $.cookie("diVol"); // Store key for next time.
                chrome.runtime.sendMessage({
                    key: $('#lK').val(), //Send key to background player
                    channel: $('#lC').val(), //with channel selection
                    vol: volm,
                    server: $('#server').val(),
                    play: "1"
                }); //and method play:1 == Play.
            }
        }
    });
}
var z = 0;
var zz = 0;
var j;
var colorshift;
var changes;
var meltme = true;
var thisline;
var bufferLength=2048;
var timeDomain = new Uint8Array(2048);
var freqDomain = new Uint8Array(2048);
var canvasX = 0;
var canvasY = 0;
var drawContext;
var canvas;

function analyse_this() {
canvas = document.getElementById("visualise_screen");
drawContext = canvas.getContext("2d");
go();
}
function go(){
	requestAnimationFrame(go);
	drawContext.save();
    drawContext.clearRect(0, 0, canvasX, canvasY);
    canvasX = drawContext.canvas.width = window.innerWidth;
    canvasY = drawContext.canvas.height = window.innerHeight;
    fakebufferlength = bufferLength - 150; //mp3 has dead frequencies where codec cuts off. 
    binX = canvasX / (fakebufferlength / 2);
    bg.analyser.getByteFrequencyData(freqDomain);	
    numBins = canvasX / binX
    for (i = 0; i < numBins; i++) {
        colorshift = 360 / numBins;
        value = freqDomain[i];
        percent = value / 400; // smaller is taller
        height = (canvasY * percent);
        offset = canvasY - height;
        thisbar = ""
        if (meltme) {
            thisbar = "hsl(" + (colorshift * i) + ", " + 85 + "%, " + 37 + "%)";
            drawContext.fillStyle = thisbar;
        } else {
            scalec = (50 / (canvasX / binX) * i) + 50;
            drawContext.fillStyle = "hsla(0, 0%, " + scalec + "%, 1)";
        }
        drawContext.fillRect(binX * i, offset, binX, height);
    }
    thisbar = ""
    if (meltme) {
        for (j = 0; j < 6; j++) {
            thisbar = "hsl(" + (colorshift * i) + ", " + 85 + "%, " + 37 + "%)";
        }
        drawContext.fillStyle = thisbar;
    } else {
        scalec = (50 / (canvasX / binX) * i) + 50;
        drawContext.fillStyle = "hsla(0, 0%, " + scalec + "%, 1)";
    }
    //--------------------------------------------------------------------
    bg.analyser.getByteTimeDomainData(timeDomain);
    drawContext.lineWidth = 2;
    if (meltme) {
        var change = Math.floor(Math.random() * 100);
        if (change < 5) {
            thisline = "hsl(" + Math.floor(Math.random() * 360) + ", " + 75 + "%, " + 75 + "%)";
        }
    } else {
        thisline = "#000";
    }
    drawContext.strokeStyle = thisline;
    drawContext.beginPath();
    sliceWidth = (canvasX / bufferLength) + 0.008;
    x = 0;
    for (i = 0; i < bufferLength; i++) {
        v = (timeDomain[i] / 128.0);
        y = (v * (canvasY / 2 - ((canvasX / 100) * 10)));
        if (i == 0) {
            drawContext.moveTo(x, y);
        } else {
            drawContext.lineTo(x, y);
        }
        x += sliceWidth;
    }
    drawContext.lineTo(canvas.width, canvas.height / 2);
    drawContext.stroke();
    if (meltme) {
        z++;
        if (z > 360) {
            z = 0;
            zz++;
        }
        if (zz > 10) {
            zz = 3;
        }
        $('body').css({
            'background-color': "hsl(" + (z) + ", " + 75 + "%, " + zz + "%)"
        });
    } else {
        $('body').css({
            'background-color': "#555"
        });
    }
	drawContext.restore();

}
