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
	
 *
 * Date: 3rd March 2015. 16.33 GMT
*/
var frameLength = 5; //ms to display
var bg = chrome.extension.getBackgroundPage();

var s_out = true;
var t_out = true;
$(document).ready(function () {
    analyseThis();
    if ($.cookie('diChan') != null) {
        $('#lK').val($.cookie("diKeys"));
        $('#lC').val($.cookie("diChan"));
        $('#server').val($.cookie("Diserver"));
        scrolCh();
        $('#vol').val($.cookie("diVol"));
        hQ = $.cookie("dihQ");

        $('#hQ').val($.cookie("diHq"));
        $("#miniChannel").text($.cookie("diChPt"));
        if ($.cookie("diOnTrig") == "1") {
            $('#playAlarm').prop('checked', true);
        }
        if ($.cookie("diOffTrig") == "1") {
            $('#stopAlarm').prop('checked', true);
        }
        if ($.cookie("dailyPlay") == "1") {
            $('#dailyPlay').prop('checked', true);
        }
        if ($.cookie("dailyStop") == "1") {
            $('#dailyStop').prop('checked', true);
        }

        dailyStop
        $('#offAH').val($.cookie("diOffTH"));
        $('#offAM').val($.cookie("diOffTM"));
        $('#onAH').val($.cookie("diOnTH"));
        $('#onAM').val($.cookie("diOnTM"));
        //.popup_last,#doScrob

        if ($.cookie('lastSK') != null) {
            $.cookie('lastSK', '', {
                'expires':0
            });
            alert('Following feedback, the option to "love" and "unlove" tracks is here. However your last.fm account needs to be reconnected. Please head to settings and reconnect your account to continue Scrobbling. Check out "Help" -> "Last.fm setup" to read about the changes.');
        }
 
        if ($.cookie('lastSKey') != null) {
             $('#doLike').css('display', 'block');
             $('#track').css('width', '365px');
            $('.popup_last').css('display', 'none');
            $('#npScrob').css('display', 'block');
            if ($.cookie('lastNP') == true) {
                $('.lastNP').text('Turn off AutoScrobbling');
            }
            else{
                  $('#doScrob').css('display', 'block');

            }

        }
    } else {
        $('#vol').val(75);
        $('#offAH').val(00);
        $('#offAM').val(00);
        $('#onAH').val(00);
        $('#onAM').val(00);


    }
    var sleepTracker;
    if (bg.sleepyTime > -1) {
        sleepTracker = setInterval(function () {
            var minTrack = Math.floor(bg.sleepyTime / 60);
            var secTrack = bg.sleepyTime - minTrack * 60;
            $('#goSleep').text(minTrack + ":" + secTrack);
            if (bg.sleepyTime == -1) {
                $('#goSleep').text("Go/Stop");
                clearInterval(sleepTracker);
            }
        }, 1000);
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
    if (!$.cookie("premium") || $.cookie("premium") == 0) {
        $("#nag").css({
            "display": "block"
        });
    }


    $("#vol").on("input change", function () {
        vol = $('#vol').val();
        $.cookie("diVol", vol, {
            expires: 365
        });
        chrome.runtime.sendMessage({
            play: "2", //Send method play:2 == Change player parameter
            vol: vol
        }); // player.js receives message and volume. does the doo.
        // Store volume for next time. 

    });

    $('.popup_last').click(function () {
        alert('This may take a moment, Close the Last.fm page after authing to finish connecting.');
        token = bg.get_token();
    });

    $('.timings').click(function () {
        if (!s_out) {
            $('.floatysettings').animate({
                left: "-=400"
            }, 800);
            s_out = true;
        }
        // var t_out = true;
        if (t_out) {
            $('.floatytimings').animate({
                left: "+=400"
            }, 800);
            t_out = false;
        } else {
            $('.floatytimings').animate({
                left: "-=400"
            }, 800);
            t_out = true;
        }

    });
    $('.settings').click(function () {
        if (!t_out) {
            $('.floatytimings').animate({
                left: "-=400"
            }, 800);
            t_out = true;
        }
        if (s_out) {
            $('.floatysettings').animate({
                left: "+=400"
            }, 800);
            s_out = false;
        } else {
            $('.floatysettings').animate({
                left: "-=400"
            }, 800);
            s_out = true;
        }
        $('.lastNP').click(function () {
            if ($.cookie('lastNP') == '1') {
                $('.lastNP').text('Turn on Scrobbling');
                $.cookie("lastNP", "0", {
                    expires: 365
                });
                  $('#doScrob').css('display', 'block');

            } else {
                $('.lastNP').text('Turn off AutoScrobbling');
                $.cookie("lastNP", "1", {
                    expires: 365
                });
                  $('#doScrob').css('display', 'none');
                
            }
        });
    });

    function doFlash() {
        $("#saveS").fadeOut(30).fadeIn(30);

    }
    $("#saveS").click(function () {
        if (!bg.playing) {
            $.cookie("diHq", $('#hQ').val(), {
                expires: 365
            }); // Store key for next time. 
            $.cookie("diKeys", $('#lK').val(), {
                expires: 365
            }); // Store key for next time. 
            volm = $.cookie("diVol"); // Store key for n

        } else {

            doPlay();
        }

        doFlash();
        if (!s_out) {
            $('.floatysettings').animate({
                left: "-=400"
            }, 800);
            s_out = true;
        }
    });


    $('.help').click(function () {
        window.open("support.html");
    });

    var ctrlPressed = false;

    function cacheIt(event) {
        ctrlPressed = event.ctrlKey;
    }
    document.onkeydown = cacheIt;
    document.onkeyup = cacheIt;
    $("body").dblclick(function () {

        if (ctrlPressed) {
            chrome.windows.create({
                'url': 'popup.html',
                'width': 430,
                'height': 460,
                'focused': true,
                'type': 'panel'
            });
        }
    });

    $("#lC li").click(function () { // onClick for link to display key box

        $.cookie('lastLiked','0',{'expires': 365})
        $.cookie("diChImage", $(this).attr("data-image"), {
            expires: 365
        }); // Store key for next time.

        $.cookie("diChPt", $(this).text(), {
            expires: 365
        });
        
        $("#miniChannel").text($(this).text());
        $.cookie("diChan", $(this).attr("data-trigger"), {
            expires: 365
        }); // Store key for next time.

        if (bg.playing) {
            clearInterval(disTimer);
            setTimeout(function () {
                disTimer = setInterval(function () {
                    getTn();
                }, 500);
            }, 750);
            doPlay();
        }
    });




    document.getElementById("stBut").addEventListener('click', function () { // On Stop Click

        chrome.runtime.sendMessage({
            play: "0"
        }); //Send method play:0 == Stop.
        $("#track").text("Stopped");
        setTimeout(function () {
            $.cookie("diChImg", bg.diIMG, {
                expires: 365
            });

            $("#imageContainer").html(bg.diIMG);

            $.cookie("diChTn", "Stopped", {
                expires: 365
            });
        }, 500);
    });
    document.getElementById("plBut").addEventListener('click', function () { // on Play click
        doPlay();
    });
    $(".full_screen").click(function () { // on Play click
        window.open("fullpage.html");
    });


    disTimer = setInterval(function () {
        getTn();
    }, 500);

    function getTn() {
        if (typeof $.cookie('lastLiked') !== 'undefined'){
            if ($.cookie('lastLiked') == '1'){
                $('#doLike').css({'opacity': '1'});
                $('#doLike').attr('title', 'Unlove this');
            }
            else{
                $('#doLike').css({'opacity': '0.3'});
                $('#doLike').attr('title', 'Last.fm: love this track');
            }
        }
        $('#vol').val($.cookie("diVol"));
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

    setInterval(function () {
        $(".channel li").each(function () {
            if ($.cookie("diChan") == $(this).attr("data-trigger")) {
                $(this).addClass("selected");
            } else {
                $(this).removeClass("selected");
            }
        });

    }, 300);
});

function scrolCh() {
    setTimeout(function () {
        trappedC = 0;
        $(".channel li").each(function () {
            if ($.cookie("diChPt") == $(this).text()) {
                newX = $(this).position().top;
                newX = newX - 155;
                $(".channel").scrollTop(newX);
                trappedC = 1;
            }

        });
        if (trappedC != 1) {
            scrolCh();

        }
    }, 50);
}

function doPlay() {
    var checkKey = $.ajax({
        type: "get",
        url: 'http://listen.di.fm/public3/favorites?' + $('#lK').val(),
        statusCode: {
            200: function () {
                $("#nag").css({
                    "display": "none"
                });
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
                    channel: $.cookie("diChan"),
                    vol: volm,
                    server: $('#server').val(),
                    play: "1"
                }); //and method play:1 == Play.
            },
            403: function () {
                $("#nag").css({
                    "display": "block"
                });
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
                    channel: $.cookie('diChan'), //with channel selection
                    vol: volm,
                    server: $('#server').val(),
                    play: "1"
                }); //and method play:1 == Play.
            }
        }
    });
}

maxYLen = 2600;
scrollStep = 9;
//jQuery ismouseover  method
//This isn't a licenced method but it saved me ages messing (after a lot of messing around anyway :( ) 
//so all credit to Ivan Castellanos - http://stackoverflow.com/questions/1273566/how-do-i-check-if-the-mouse-is-over-an-element-in-jquery
(function ($) {
    $.mlp = {
        x: 0,
        y: 0
    }; // Mouse Last Position
    function documentHandler() {
        var $current = this === document ? $(this) : $(this).contents();
        $current.mousemove(function (e) {
            jQuery.mlp = {
                x: e.pageX,
                y: e.pageY
            }
        });
        $current.find("iframe").load(documentHandler);
    }
    $(documentHandler);
    $.fn.ismouseover = function (overThis) {
        var result = false;
        this.eq(0).each(function () {
            var $current = $(this).is("iframe") ? $(this).contents().find("body") : $(this);
            var offset = $current.offset();
            result = offset.left <= $.mlp.x && offset.left + $current.outerWidth() > $.mlp.x &&
                offset.top <= $.mlp.y && offset.top + $current.outerHeight() > $.mlp.y;
        });
        return result;
    };
})(jQuery);

$(document).ready(function () {
    $('#tSave').click(function () {
        if ($('#playAlarm').attr('checked')) {
            $.cookie("diOnTrig", "1", {
                expires: 365
            }); // Store key for next time. 
        } else {
            $.cookie("diOnTrig", "0", {
                expires: 365
            }); // Store key for next time. 	
        }
        if ($('#stopAlarm').attr('checked')) {
            $.cookie("diOffTrig", "1", {
                expires: 365
            }); // Store key for next time. 
        } else {
            $.cookie("diOffTrig", "0", {
                expires: 365
            }); // Store key for next time. 	
        }
        if ($('#dailyPlay').attr('checked')) {
            $.cookie("dailyPlay", "1", {
                expires: 365
            }); // Store key for next time. 
        } else {
            $.cookie("dailyPlay", "0", {
                expires: 365
            }); // Store key for next time. 	
        }

        if ($('#dailyStop').attr('checked')) {
            $.cookie("dailyStop", "1", {
                expires: 365
            }); // Store key for next time. 
        } else {
            $.cookie("dailyStop", "0", {
                expires: 365
            }); // Store key for next time. 	
        }
        $.cookie("diOffTH", $('#offAH').val(), {
            expires: 365
        }); // Store key for next time. 
        $.cookie("diOffTM", $('#offAM').val(), {
            expires: 365
        }); // Store key for next time. 
        $.cookie("diOnTH", $('#onAH').val(), {
            expires: 365
        }); // Store key for next time. 
        $.cookie("diOnTM", $('#onAM').val(), {
            expires: 365
        }); // Store key for next time. 				

        bg.makeTS();
        if (!t_out) {
            $('.floatytimings').animate({
                left: "-=400"
            }, 800);
            t_out = true;
        }
    });
    /*
    var sleepTracker;
    	if(bg.sleepyTime > -1){
    			sleepTracker = setInterval(function(){
    				$('#goSleep').text(bg.SleepyTime);
    			}, 1000);		
    	}

    */

    $('#goSleep').click(function () {
        if (bg.sleepyTime > -1) {
            bg.stopSleep();
            clearInterval(sleepTracker);
            $('#goSleep').text("Go/Stop");
        } else {
            bg.setSleep($('#sleepBox').val() * 60);

            sleepTracker = setInterval(function () {
                var minTrack = Math.floor(bg.sleepyTime / 60);
                var secTrack = bg.sleepyTime - minTrack * 60;
                $('#goSleep').text(minTrack + ":" + secTrack);
                if (bg.sleepyTime == -1) {
                    $('#goSleep').text("Go");
                    clearInterval(sleepTracker);
                }
            }, 1000);

        }

    });

    $("#lC li").mouseover(function () {
        channel_stuff = $(this).attr("data-trigger");
        channel_name = $(this).text();
        tn_timer = setTimeout(function () {
            x = ":(";
            dP = channel_stuff.indexOf("_"); //parse the value. need both bits. 
            channel_Id = channel_stuff.substring(0, (dP)); // channel id for the trackname
            $.getJSON(bg.apiUrl, function (data) {
                $.each(data, function (key, val) {
                    if (key == channel_Id) {
                        $('#popup_nowplay').css({
                            'display': 'block'
                        });
                        $('#popup_nowplay').html("<span style='font-size:12px;'>Now playing on</span><br/><span style='font-weight:bold; font-size:14px;'> " + channel_name + "</span><br /> <br /> " + val.track);
                    }
                });
            });



        }, 155);
    });



    $("#lC li").mouseout(function () {
        clearTimeout(tn_timer);
        $('#popup_nowplay').css({
            'display': 'none'
        });
    });
    scroll_x = 0; // swap for cookie

    $("#down_pad").mouseover(function () {

        scr_timer = setInterval(function () {
            if ($("#down_pad").ismouseover()) {
                scroll_x = $(".select").scrollTop();
                scroll_x = scroll_x + scrollStep;
                if (scroll_x >= maxYLen) {
                    scroll_x = maxYLen;
                }
                $(".select").scrollTop(scroll_x);
            }
        }, 23);

    });

    $("#down_pad").mouseout(function () {
        clearInterval(scr_timer);

    });

    $("#up_pad").mouseover(function () {
        scr_timer = setInterval(function () {
            if ($("#up_pad").ismouseover()) {
                scroll_x = $(".select").scrollTop();
                scroll_x = scroll_x - scrollStep;
                if (scroll_x <= 0) {
                    scroll_x = 0;
                }
                $(".select").scrollTop(scroll_x);
            }
        }, 23);

    });

    $("#up_pad").mouseout(function () {
        clearInterval(scr_timer);

    });

    $("#doScrob").click(function () {
        storedhtml = $("#track").html();
        setTimeout(function () {
            $("#track").html(storedhtml);
        }, 250);
        $("#track").html('Scrobbled');
        bg.scrobblage();
    });
    
    $("#doLike").click(function () {
        storedhtml = $("#track").html();
        setTimeout(function () {
            $("#track").html(storedhtml);
        }, 250);
        $("#track").html('Liked');
        bg.likeage();
    });


});

var scalec;

var timeDomain = new Uint8Array(2048);
var freqDomain = new Uint8Array(2048);
var bufferLength = 2048;
var canvasX = 155;
var canvasY = 80;
var canvas;
var drawContext;

function analyseThis() {
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
