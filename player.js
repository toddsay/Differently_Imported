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

var context;
var source;
var analyser;
var audioContext;
var apiUrl = "http://api.audioaddict.com/v1/di/track_history";
var diIMG="<img src='diffI.png' style='border:1px solid white; margin-top:20px; margin-left:15px; height:155px; width:155px;'>";
var playing = false;
$(document).ready(function() { //Set some vars 
 chrome.commands.onCommand.addListener(function(command) {
  if (command == "toggle-play"){
		if (!playing){
			 playing = true;
            server = $.cookie("Diserver");
            key = $.cookie("diKeys");
            channel = $.cookie("diChan");
            vol = $.cookie("diVol");
            play(channel, key, vol, server);
            pollFlag = 1;
            var audio = document.getElementById('diPlyr');
            audio.volume = $.cookie("diVol") / 100;
			
		}
		else{
			   playing = false;
				stop();	
		}
  }

});
setTimeout(function(){
makeTS();
timeEngine();
},2000);

    capAudio = document.getElementById('diPlyr');
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source = audioContext.createMediaElementSource(capAudio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    pollFlag = 1;
    pollTime = 0;
    playing = false;
    newSess = true;
    var server = "";
    var key = "";
    var channel = "";
    var vol = "";
	if (!$.cookie("diVol")){	
    $.cookie("diChan", "324_00sclubhits", {
            expires: 365
        });
	$.cookie("diVol", "75", {
            expires: 365
        });
		
		$.cookie("diChPt", "00's Club Hits", {		
									expires: 365
							});
	$.cookie("diChPic", "http://api.audioaddict.com/v1/assets/image/1f2189badb0bb9ccba20e54163afff69.png?size=145x145", {
                                expires: 365
                            });							
	}
	
	motd = "<span>Differently Imported v4.2.1 <br /><a href ='https://www.facebook.com/DifferentlyImported' target='_blank'> <span style='color:#cdcdcd;  text-decoration: underline;'>Facebook</span></a> / <a href='https://chrome.google.com/webstore/detail/differently-imported-for/bnihjdccalbcoienhgcjjlilfdhacdkf' target='_blank'> <span style='color:#cdcdcd; text-decoration: underline;'>Feedback</span></a></span>";
    $.cookie("diChTn", motd, {
        expires: 365
    });
	
    $.cookie("newT", "1", {
        expires: 365
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: "#cccccc"
    });
    chrome.browserAction.setBadgeText({
        text: " "
    });
    chrome.runtime.onMessage.addListener(function(action) { //Start the message listener and set some actions
        if (action.play == "0") { // Play is a flag to control the player. 
            playing = false;
            stop();
        }
        if (action.play == "1") {
            playing = true;
            server = action.server;
            key = action.key;
            channel = action.channel;
            vol = 0.5;
            play(channel, key, vol, server);
            pollFlag = 1;
            var audio = document.getElementById('diPlyr');
            audio.volume = action.vol / 100;
        }
        if (action.play == "2") {
            var audio = document.getElementById('diPlyr');
            audio.volume = action.vol / 100;
        }
        if (action.play == "3") {
            if (playing) {
                showTrack();
            }
            if (newSess == true) {
                newSess = false;
                $.cookie("diChTn", motd, {
                    expires: 365
                });
                $.cookie("newT", "1", {
                    expires: 365
                });
                $.cookie("diHq", "1", {
                    expires: 365
                });
            }
        }
    });

    function stop() {
        scrollIcon(false); // disable the play badge on the icon
        $("#diPlyr").attr("src", "");
        $("#diPlyr").remove();
        if (playing == "false") {
            $.cookie("diChTn", motd, {
                expires: 365
            });
            $.cookie("newT", "1", {
                expires: 365
            });
        } else {}
    }

    function play(ch, ky, vol, server) {
        delimitPos = ch.indexOf("_"); //parse the value. need both bits. 
        chLength = ch.length;
        channelId = ch.substring(0, (delimitPos)); // channel id for the trackname
        chUrl = ch.substring(delimitPos + 1, chLength); //channel name for the url
        if ($.cookie("premium") == "1") {
            if ($.cookie("diHq") == "1") {
                chUrl = chUrl + "_hi"; // high or low quality stream
            }
            url = "http://prem" + server + ".di.fm:80/" + chUrl + "?" + ky;
        } else {
            url = "http://pub" + server + ".di.fm/di_" + chUrl + "_aac?type=.mp3";
        }
        $.cookie("diChId", channelId, {
            expires: 365
        }); // save em for later
        $.cookie("Diserver", server, {
            expires: 365
        });
        if ($('#diPlyr').attr('src') != url) { //if something changed  
            playing = false;
            stop(); // kill the player thats happening now.
            pollFlag = 1;
        }
        vol = vol / 100;
        if ($('#diPlyr').length != 1) { // if there is already a player and nothing changed do nothing. 
            scrollIcon(true); // enable the play badge on the icon
            audio = $('<audio />', { // otherwise build a player 
                controls: 'controls',
                id: 'diPlyr',
                autoPlay: 'autoplay',
                src: url,
                volume: vol
            });
            audio.appendTo('body');
            capAudio = document.getElementById('diPlyr');
            source = audioContext.createMediaElementSource(capAudio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
        }
        playing = true;
        showTrack(); // and kick off tracklist API
        //document.getElementById('diPlyr').addEventListener("stalled", showErr, false);
        document.getElementById('diPlyr').addEventListener("error", showErr, false);
        //document.getElementById('diPlyr').addEventListener("emptied", showErr, false);
    }
    var anim = [". . . . ", "> . . .", ">> . .", ">>> .", ">>>>", ". >>>", ". . >>", ". . . >", ". . . . "];
    var ts = 0;
    var txTim;

   function scrollIcon(flag) {
          if (flag) {
              if (!txTim) {
                  txTim = setInterval(function() {
                      txtAnim = anim[ts];
                      ts++;
                      if (ts >= 8) {
                          ts = 0;
                      }
                      chrome.browserAction.setBadgeText({
                          text: txtAnim
                      });
                  }, 200);
              }
          } else {
              clearInterval(txTim);
              txTim = false;
              chrome.browserAction.setBadgeText({
                  text: " "
              });
          }
      }
        
        //-----------------------------------------------
    var tl;
    var ts;
    var tp;
    var tr;

    //var nexttime = (2000 + (Math.round(+new Date()/1000)));
    function showTrack() { // tracklist api call. timed with flags to stop server hammerage. 
            unix = Math.round(+new Date() / 1000);
            if (unix >= $.cookie("diPt")) {
                pollFlag = 1;
            }
            /* 	if (unix <= nexttime){pollflag = 0;}
		else {nexttime = (2000 + (Math.round(+new Date()/1000)));} */
            if (pollFlag == 1) {
                chId = $.cookie("diChId");
                $.getJSON(apiUrl, function(data) {
                    $.each(data, function(key, val) {
                        if (key == chId) {
                            tl = val.duration;
                            ts = val.started;
                            tr = "<span title='" + val.track + "'>" + val.track + "</span>";
                            tp = val.art_url;
                            pollTime = parseInt(tl) + parseInt(ts);
                            $.cookie("diPt", pollTime, {
                                expires: 365
                            });
                                if (tp != null) {
                                    tp = stripslashes(tp);
                                    tp = makeHtml(tp);
                                }
								else{
						tp = makeHtml($.cookie("diChImage"));
								}
                            $.cookie("diChTn", tr, {
                                expires: 365
                            });
                            $.cookie("newT", "1", {
                                expires: 365
                            });
							$.cookie("diChPic", tp, {
                                expires: 365
                            });
                        }
                    });
                });
                pollFlag = 0;
            }
        }
        //-----------------------------------------------

    function showErr(event) {
            if (playing == true) {
                $.cookie("diChTn", "Network Error! Check Server; Lower Quality; Remove non-premium Keys", {
                    expires: 365
                });
                $.cookie("newT", "1", {
                    expires: 365
                });
            } else {
                $.cookie("diChTn", motd, {
                    expires: 365
                });
                $.cookie("newT", "1", {
                    expires: 365
                });
            }
        }
        //-----------------------------------------------

    function stripslashes(urlIn) {
            urlIn = urlIn.replace("\\", "");
            return ("http:" + urlIn);
        }
        //-----------------------------------------------

    function makeHtml(image) {
        var html = "<img title='drag and drop this album art into your browser to view full size.' src='" + image + "' style='border:1px solid white; margin-top:20px; margin-left:15px; height:155px; width:155px;'>";
        return (html)
    }


function timeEngine(){
			var currentD = new Date();
            if (($.cookie("diOnTrig") =="1") && (alOn <= currentD.getTime())){
                	if (!playing){    
						playing = true;
						server = $.cookie("Diserver");
						key = $.cookie("diKeys");
						channel = $.cookie("diChan");
						vol = $.cookie("diVol");
						play(channel, key, vol, server);
						pollFlag = 1;
						var audio = document.getElementById('diPlyr');
						audio.volume = $.cookie("diVol") / 100;
					}
					if ($.cookie("dailyPlay") !="1"){
						$.cookie("diOnTrig", "0", {
							expires: 365
						});
					}
					else{
						makeTS();
					}
            }
			
			if (($.cookie("diOffTrig") == '1') && (alOff <= currentD.getTime())){
                playing = false;
				stop();	
				if ($.cookie("dailyStop") !="1"){
					$.cookie("diOffTrig", "0", {
						expires: 365
					});
				}
				else{
					makeTS();
				}
				
			}
			setTimeout(function(){timeEngine();}, 1000);

}

});
	var alOff ;
	var alOn;
function makeTS(){
			onH =$.cookie("diOnTH");
			onM=$.cookie("diOnTM");
			offH=$.cookie("diOffTH");
			offM=$.cookie("diOffTM");
			var currentD = new Date();
		   alOff = new Date();
		   alOff.setHours(offH,offM,00); 
			if(currentD >= alOff ){
				alOff.setDate(alOff.getDate() + 1);
				alOff.setHours(offH,offM,00); 
			}
			 alOn = new Date();
			alOn.setHours(onH,onM,00); 
			if(currentD >= alOn ){
				alOn.setDate(alOn.getDate() + 1);
				alOn.setHours(onH,onM,00); 
			}
			alOn = alOn.getTime();
			alOff = alOff.getTime();		
}
var sleepyTime = -1;
var sleepNumber;
var sleepyTimer;
function setSleep(inSleeps){
	sleepyTime = inSleeps;
	sleepNumber = setInterval(function(){
					sleepyTime = sleepyTime - 1;
			}, 1000);		
	sleepyTimer = setTimeout(function(){
			   stopSleep();
			   playing = false;
				stop();
		 }, sleepyTime*1000);
}
function stopSleep(){
		sleepyTime = -1;
		clearInterval(sleepNumber);
		clearTimeout(sleepyTimer);
		
}