/*!
 * HTML5/JS web player Differently imported
 * https://chrome.google.com/webstore/detail/differently-imported-for/bnihjdccalbcoienhgcjjlilfdhacdkf?hl=en&gl=GB
 *
 * phil / @ / pbarton / .co / .uk
 * Copyright 2014, Phil Barton
 * 
    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

 *
 * Includes Loads of things
 * di.js
 * di.css
 * fullpage.html
 * fullpage.css
 * fullpage.js
 * player.js
 * popup.html
 * licence.txt
 *
 *
 * Date: 13th September 2014. 07.00 BST
*/

var frameLength = 5; //ms to display
var bg = chrome.extension.getBackgroundPage();


$(document).ready(function() {
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
        vol = $.cookie("diVol");
        hQ = $.cookie("dihQ");
        leftPos = vol
        if (vol >= 95) {
            leftPos = 98;
        } // set a rightmost limit
        if (vol <= 5) {
            leftPos = 0;
        } // let th
        $("#vKnob").css("left", leftPos + "px"); // move the thingy 
        $('#hQ').val($.cookie("diHq"));
        $('#volBord').attr("title", "Volume " + $.cookie("diVol") + "%");
    } else {
        vol = 75;
        $('#volBord').attr("title", "Volume 75%");
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

    document.getElementById("fsBut").addEventListener('click', function() {
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
        chrome.runtime.sendMessage({
            play: "3"
        });
		if(bg.playing){
		            $("#track").html($.cookie("diChTn") +"<br />" +$.cookie("diChPic"));	
		}
		else{
			$("#track").html($.cookie("diChTn") )
		}


        
        vol = $.cookie("diVol");
        leftPos = vol
        if (vol >= 95) {
            leftPos = 98;
        } // set a rightmost limit
        if (vol <= 5) {
            leftPos = 0;
        } // let th
        $("#vKnob").css("left", leftPos + "px"); // move the thingy 
        $('#volBord').attr("title", "Volume " + $.cookie("diVol") + "%");
        $('#lC').val($.cookie("diChan"));
        //Label some variables
    }
});
$(document).ready(function(e) {
    $('#volume').click(function(e) { // Volume change onClick
        var posX = $(this).position().left; //get some stats 
        leftPos = (e.pageX - posX);
        vol = leftPos;
        if (leftPos >= 95) {
            leftPos = 98;
            vol = 100;
        } // set a rightmost limit
        if (leftPos <= 5) {
            leftPos = 2;
            vol = 0;
        } // let the volume work 0 to 100 without having to hit 1 pixel (bit of a jump at each end tho :p )
        $("#vKnob").css("left", leftPos); // move the thingy 	
        $.cookie("diVol", vol, {
            expires: 365
        });
        $('#volBord').attr("title", "Volume " + $.cookie("diVol") + "%");
        chrome.runtime.sendMessage({
            play: "2", //Send method play:2 == Change player parameter
            vol: vol
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
