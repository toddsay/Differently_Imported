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
	   analyseThis();
    if ($.cookie('diKeys') != null) {
        $('#lK').val($.cookie("diKeys"));
        $('#lC').val($.cookie("diChan"));
        $('#server').val($.cookie("Diserver"));
		scrolCh();
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
	if (bg.playing) {
        $("#track").html($.cookie("diChTn"));
        $("#imageContainer").html($.cookie("diChPic"));
    } else {
        $("#track").html(bg.motd);
        $("#imageContainer").html(bg.diIMG);
        $.cookie("diChPic", bg.diIMG, {
            expires: 365
        });
	}
		if (!$.cookie("premium") || $.cookie("premium")  == 0){	
			$("#nag").css({"display":"block"});
		}

  var s_out = true;
 
 $('.settings').click(function(){
	 if (s_out){
	$('.floatysettings').animate({
    left: "+=400"
	}, 800);
	s_out = false;
	 }
	 else{
	$('.floatysettings').animate({
    left: "-=400"
	}, 800);
	s_out = true;	
	}
	
 });

function doFlash(){
	$("#saveS").fadeOut(30).fadeIn(30);

}
$("#saveS").click(function(){
	if(!bg.playing){
	      $.cookie("diHq", $('#hQ').val(), {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("diKeys", $('#lK').val(), {
                    expires: 365
                }); // Store key for next time. 
                volm = $.cookie("diVol"); // Store key for n

	}
	else {
		
		doPlay();
	}
				doFlash();
});



   $("#lC li").click(function() { // onClick for link to display key box

			$.cookie("diChImage", $(this).attr("data-image"), {
                    expires: 365
                }); // Store key for next time.

			$.cookie("diChPt", $(this).text(), {		
									expires: 365
							});
			$.cookie("diChan", $(this).attr("data-trigger"), {
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
	
	
	

    document.getElementById("stBut").addEventListener('click', function() { // On Stop Click
   
        chrome.runtime.sendMessage({
            play: "0"
        }); //Send method play:0 == Stop.
        $("#track").text("Stopped");
		setTimeout(function(){
		 $.cookie("diChImg", bg.diIMG, {
            expires: 365
        });
		
		$("#imageContainer").html(bg.diIMG);
		
        $.cookie("diChTn", "Stopped", {
            expires: 365
        });
		},500);
    });
    document.getElementById("plBut").addEventListener('click', function() { // on Play click
        doPlay();
    });
	 $(".full_screen").click(function() { // on Play click
        window.open("fullpage.html");
    });
	

    disTimer = setInterval(function() {
        getTn();
    }, 500);

    function getTn() {
        chrome.runtime.sendMessage({
            play: "3"
        });
        if ($.cookie("newT") == "1") { //////change only if needs it.	
            $("#track").html($.cookie("diChTn"));
		
			$("#imageContainer").html($.cookie("diChPic"));
            $.cookie("newT", "0", {
                expires: 365
            });
        }
        //Label some variables
    }
	
	setInterval(function(){
		$(".channel li").each(function(){
		if ($.cookie("diChan") == $(this).attr("data-trigger")){
			$(this).addClass( "selected" );
		}
		else{
					$(this).removeClass( "selected" );	
		}
		});
		
	},300);
});	

$(document).ready(function(e) {
    $('#volume').click(function(e) { // Volume change onClick
        var posX = $(this).position().left; //get some stats 
        leftPos = (e.pageX - posX) -9;
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

	
});
function scrolCh(){
	setTimeout(function(){
trappedC = 0;
$(".channel li").each(function(){
		if ($.cookie("diChPt") == $(this).text()){
				newX  = $(this).position().top;
				newX = newX - 150;
				$(".channel").scrollTop(newX);
				trappedC = 1;
			}

});	
	if (trappedC != 1){
		scrolCh();
		
	}		
	},50);
}
function doPlay() {
    var checkKey = $.ajax({
        type: "get",
        url: 'http://listen.di.fm/public3/favorites?' + $('#lK').val(),
        statusCode: {
            200: function() {
          		$("#nag").css({"display":"none"});
                $.cookie("diHq", $('#hQ').val(), {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("diKeys", $('#lK').val(), {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("premium", "1", {
                    expires: 365
                }); // Store key for next time. 
                volm = $.cookie("diVol"); // Store key for next time.
                chrome.runtime.sendMessage({
                    key: $('#lK').val(), //Send key to background player
                    channel:$.cookie("diChan"),
                    vol: volm,
                    server: $('#server').val(),
                    play: "1"
                }); //and method play:1 == Play.
            },
            403: function() {
				$("#nag").css({"display":"block"});
                $.cookie("diHq", "0", {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("diKeys", "", {
                    expires: 365
                }); // Store key for next time. 
                $.cookie("premium", "0", {
                    expires: 365
                }); // Store key for next time. 
                volm = $.cookie("diVol"); // Store key for next time.
                chrome.runtime.sendMessage({
                    key: $('#lK').val(), //Send key to background player
                    channel:$.cookie('diChan'), //with channel selection
                    vol: volm,
                    server: $('#server').val(),
                    play: "1"
                }); //and method play:1 == Play.
            }
        }
    });
}
 maxYLen = 2600;
 scrollStep =9;
 //jQuery ismouseover  method
 //This isn't a licenced method but it saved me ages messing (after a lot of messing around anyway :( ) 
 //so all credit to Ivan Castellanos - http://stackoverflow.com/questions/1273566/how-do-i-check-if-the-mouse-is-over-an-element-in-jquery
(function($){ 
    $.mlp = {x:0,y:0}; // Mouse Last Position
    function documentHandler(){
        var $current = this === document ? $(this) : $(this).contents();
        $current.mousemove(function(e){jQuery.mlp = {x:e.pageX,y:e.pageY}});
        $current.find("iframe").load(documentHandler);
    }
    $(documentHandler);
    $.fn.ismouseover = function(overThis) {  
        var result = false;
        this.eq(0).each(function() {  
                var $current = $(this).is("iframe") ? $(this).contents().find("body") : $(this);
                var offset = $current.offset();             
                result =    offset.left<=$.mlp.x && offset.left + $current.outerWidth() > $.mlp.x &&
                            offset.top<=$.mlp.y && offset.top + $current.outerHeight() > $.mlp.y;
        });  
        return result;
    };  
})(jQuery);

$(document).ready(function(){
	
  $("#lC li").mouseover(function() {
	channel_stuff = $(this).attr("data-trigger");
	channel_name = $(this).text();
	tn_timer = setTimeout(function(){
		x = ":(";
			dP = channel_stuff.indexOf("_"); //parse the value. need both bits. 
			channel_Id = channel_stuff.substring(0, (dP)); // channel id for the trackname
			$.getJSON(bg.apiUrl, function(data) {
				 $.each(data, function(key, val) {
					if (key == channel_Id){
							$('#popup_nowplay').css({'display': 'block'});
							$('#popup_nowplay').html("<span style='font-size:12px;'>Now playing on</span><br/><span style='font-weight:bold; font-size:14px;'> "+channel_name + "</span><br /> <br /> " + val.track);
					}
				});
			});


				
	}, 150);
});



 $("#lC li").mouseout(function() {
		clearTimeout(tn_timer);
		$('#popup_nowplay').css({'display': 'none'});
});
scroll_x = 0; // swap for cookie

$("#down_pad").mouseover(function() {

		scr_timer = setInterval(function(){
				if($("#down_pad").ismouseover()){
					scroll_x = $( ".select" ).scrollTop();
					scroll_x = scroll_x +scrollStep;
					if (scroll_x >= maxYLen){
						scroll_x = maxYLen;
					}
					$( ".select" ).scrollTop( scroll_x );
				}
		}, 23);

});

$("#down_pad").mouseout(function() {
		clearInterval(scr_timer);

});

$("#up_pad").mouseover(function() {
		scr_timer = setInterval(function(){
			if($("#up_pad").ismouseover()){
					scroll_x = $( ".select" ).scrollTop();
					scroll_x = scroll_x - scrollStep;
					if (scroll_x <= 0){
						scroll_x = 0;
					}
					$( ".select" ).scrollTop( scroll_x );
				}
		}, 23);

});

$("#up_pad").mouseout(function() {
		clearInterval(scr_timer);

});
});

var scalec;

var timeDomain = new Uint8Array(2048);
var freqDomain = new Uint8Array(2048);
var bufferLength= 2048;
var canvasX = 220;
var canvasY = 120;
var canvas;
var drawContext;
function analyseThis(){	
	canvas = document.getElementById("visualise_screen");
	drawContext = canvas.getContext("2d");
	go();
}
function go() {
	requestAnimationFrame(go);
	drawContext.save();
    drawContext.clearRect(0, 0, canvasX, canvasY);
    bg.analyser.getByteFrequencyData(freqDomain);
    for (i = 0; i < bg.analyser.frequencyBinCount; i++) {
        value = freqDomain[i];
        percent = value / 256;
        height = canvasY * percent;
        offset = canvasY - height - 1;
        barWidth = canvasX / bg.analyser.frequencyBinCount;
        scalec = (25 / (canvasX / barWidth) * i) + 75;
        drawContext.fillStyle = "hsla(0.5, 0%, " + scalec + "%, 1)";
        drawContext.fillRect(i * barWidth, offset, barWidth, height);
    }
    bg.analyser.getByteTimeDomainData(timeDomain);
    drawContext.lineWidth = 1;
    drawContext.strokeStyle = '#000';
    drawContext.beginPath();
    sliceWidth = canvasX * 1.0 / bufferLength;
    x = 0;
    for (i = 0; i < bufferLength; i++) {
        v = timeDomain[i] / 128.0;
        y = v * canvasY / 2;
        if (i === 0) {
            drawContext.moveTo(x, y);
        } else {
            drawContext.lineTo(x, y);
        }
        x += sliceWidth;
    }
    drawContext.lineTo(canvas.width, canvas.height / 2);
    drawContext.stroke();
	drawContext.restore();

	}
