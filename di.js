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
	
	  if (ctrlPressed) {
		  mkdownload($("#server").val(), $(this).attr("data-trigger"), $.cookie("premium"));
        }
		else{
		
			
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

maxYLen = 3000;
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
    
    descriptions={
        '324':'Your favorite dance tunes from the start of the decade. Familiar hits and overlooked classics in abundance.',
        '12' :'Electronic sounds and atmospheric textures create a genre to enhance your state of mind and take you deeper.',
        '290':'From the funkiest grooves to the dirtiest beats. Hard-hitting, high energy 4/4 club cuts to move the masses.',
        '289':'Blending together elements of house music, speed garage, and techno – it’s all about the low end frequencies.',
        '325':'Heavily focused on breakbeats and dusty samples. A defining 90s musical movement still going strong today.',
        '209':'Fusing together house elements from the past and the present - prime time music full of uplifting high energy.',
        '15':'Inspired by hip hop and UK rave music, breaks features broken up drum loops and creative samples, synths and fx.',
        '400':'The sounds of Chill & Tropical House are expertly made for lounging and dancing alike with it\'s deeper house vibes.',
        '224':'Hip hop, trip hop, downtempo beats and jazz, blended together in a mellow, laid back style for perfect listening.',
        '3':'Electronic sounds, mellow mid-tempo rhythms, and a groove meant to calm the senses and ease the mind.',
        '68':'The perfect musical soundtrack for when you want to close your eyes, get truly comfortable, and drift away.',
        '275':'The brilliant combination of dubstep rhythms with the mellow grooves of chillout. A unique sound all its own.',
        '69':'European pop music born in the 90s full of high energy sounds and big hooks – now heard in gyms and malls worldwide.',
        '183':'Conceived in the European discos in the 70s, evolving through the decades into modern electronic masterpieces.',
        '90':'The classic melodies, the epic breakdowns and gigantic builds. Re-experience Trance music in her prime.',
        '125': 'Classic sounds of Vocal Trance',
        '177':'The bassbin rattling, speaker-freaking hits of Dubstep – all tried, tested and approved to work in the clubs. ',
        '70':'The music heard in the biggest venues worldwide. From prime time pushers to deeper house shakers - the sounds of now. ',
         '181':'Evil, gritty and twisted Drum & Bass. at 160+ BPM, hear the darkest basslines and the hardest hitting percussion.',
        '346':'The darker form of PsyTrance, which is a sound all its own – direct from Goa to your headphones.',
        '174':'House music crafted for the smaller and mid-sized rooms - deeper tracks full of silky, smooth grooves.',
        '137':'Elements of house, funk, and disco. Mid-tempo beats, soulful grooves and head nodding selections.',
        '182':'A fusion of deep house & techno. Punchy grooves, spaced out sounds and forward thinking productions.',
        '353':'Where would dance music be without Detroit? The city that started it all continues to inspire and educate. ',
        '92':'The feel good sound inspired from 70s disco combined with the warm kick drum of modern house music.',
        '10':'From techno, deep house, progressive and trance – check out the sounds of the DJ deep in the mix.',
        '180':'Head nodding beats, chilled vocals, and lush soundscapes to bring down the sun and start the night.',
        '13':'Born in the mid 90s, drum & bass is all about fast breakbeats, urban vibes, and rib rattling basslines.',
        '291':'A hybrid of half-time dubstep and intense drum \'n bass.',
        '348':'An emphasis on the bass and drums, delayed effects, sampled vocals and smokey Reggae inspired vibes.',
        '91':'The wobbles of the bass, the party rocking beats, and the biggest crowd destroying drops.',
        '355':'The beloved sounds of deep techno saturated with tape delays, heavy reverb and ice cold atmospherics.',
        '326':'Originating in the early 80s as a mix of industrial, punk and electropop, EBM changed the landscape of dance music and is still going strong today. ',
        '208':'Creative music influenced from techno to chill out, indie to IDM – a unique and undefinable listening experience.',
        '56':'Buzzing basslines, huge kicks, party rocking drops. House music packed full of gigantic bass and massive synths.',
        '280':'The trailblazers, the renegades and the experimental musicians who gave early inspiration with electronic instruments.',
        '347':'30+ years of open-genre electronic music. From spatial ambient sounds to experimental techno and more. ',
        '286':'Catchy pop music blended together with vintage synthesizers and electronic instrumentation. ',
        '327':'The combination of 1920s-1940s jazz and swing music, big band horns and modern day electro house. ',
        '175':'Trance in its most boisterous form. Uplifting melodies on top of high energy beats create these euphoric anthems.',
        '6':'Pop music infused with a high energy 4/4 pulse. Heavy on the synthesizers, the melodies and the vocals.',
        '58':'Focused on the funkiest grooves, with plenty of the guitar licks and clever samples placed around a 4/4 swing.',
        '401':'Gritty, off-kilter and typically instrumental, the Future Beats sound is perfectly married with modern technology and hip hop idealism.',
        '292':'2step Garage rhythms, chunky bass line driven grooves and plenty of forward thinking innovation.',
        '53':'Finest selection of futurepop and synthpop.',
        '16':'The hardest form of techno with punishing tracks designed to drive the crowds into a sweaty frenzy.',
        '198':'The sound of digital malfunctions, electric hum and bit rate distortions perfectly placed alongside laid-back hip hop beats.',
        '8':'A very psychedelic form of trance, Goa-Psy Trance is a sound full of arpeggiated synths and trippy effects.',
        '176':'A channel showcasing everything from hard dance, trance and happy hardcore to lift the spirits (and the arms).',
        '9':'Strictly for the hardcore. These are the biggest and boldest bangers, and the hardest hitting tracks.',
        '5':'Concrete kicks and punching rhythms, hard dance is a tougher side of music with sharp edges and aggressive power.',
        '60':'Hard techno & hardcore. A global phenomenon with powerful kicks, distorted effects and infectious melodies.',
        '276':'Tough as nails warehouse jams full of cold aggression, sinister structures and pounding rhythms that hit hard.',
        '4':'Born in Chicago and now global, house music is always evolving but remains true to it’s pure 4/4 structure.',
        '350':'Experimental, influential and pushing the boundaries of electronic music. Truly a sound to experience. ',
        '351':'The spirit of Rock & Roll with an electronic soul. Club culture and live music combined.',
        '349':'One of the biggest cultural soundtracks with the infectious thump of house music. Expect sultry saxophones, trumpets, and finger snapping grooves.',
        '293':'Jungle keeps the breakbeat tempos high and celebrates the diverse ideas found within urban and rave music.',
        '117':'The sounds of Salsa, Brazilian beats and Latin Jazz with the steady grooves of modern East Coast dance music.',
        '105':'Smooth as water, with the fast paced rhythms, liquid DNB flows with rolling ease without losing momentum.',
        '184':'Smooth, rolling and steady – this fresh formation of Dubstep keeps the sounds you love with a flowing groove.',
        '352':'The smoother side of Trap but still packed with mechanical grooves and hip hop moods. ',
        '11':'Music to chill to. Music made for when it’s all about kicking off your shoes, laying back, and totally relaxing.',
        '210':'The sound of the largest events. From the gargantuan festivals, the huge main rooms and the biggest DJs.',
        '402':'The melodic side of progressive house, packed with driving rhythms and forward thinking sounds.',
        '59':'Minimal fuses elements of house, techno and electronica and strips it back to focus on the spaces between the sound.',
        '294':'Pitched up vocals, happy hardcore beats, and high energy music non-stop.',
        '295':'Modern disco music blending the familiar funk of the 70s and 80s with futuristic beats and up to date grooves.',
        '124':'Acid, one of the characteristics of the TB-303, is celebrated here with the best tracks from house, techno and trance.',
        '104':'The biggest classics and secret weapons – this is a true treasure chest of house tracks from back in the day.',
        '296':'Grab your whistles, white gloves and reach for the laser beams. This is the sound of raving when raving was new.',
        '7':'Always moving forward, progressive continues to reinvent itself into new sounds and styles made for the floor.',
        '178':'Progress your mind to undiscovered psychedelic dimensions.',
        '285':'The psychedelic side of ambient.',
        '67':'Downtempo psychedelic dub grooves, goa ambient, and world beats.',
        '213':'Russia\'s hottest club hits.',
        '47':'House music saturated with feeling – full of melodies, vocals and true soul. Steady warm 4/4 vibes.',
        '64':'Ambient space music for expanding minds.',
        '66':'Blending the warmth of house music with the cold structural precision of techno, tech house bridges the divide.',
        '36':'Techno is a true musical force full of structure and style. Robotic, mechanical and full of soul, always facing the future.',
        '1':'Emotive high energy dance music which embraces melodies, vocals and a true journey of dance music songwriting.',
        '230':'Born out of Southern Hip-Hop and influenced by techno, trap is analogue drum machines with hip-hop aesthetics.',
        '57':'The percussive side of the house and tech house scene, tribal house takes drums and puts them in the forefront.',
        '215':'UMF Radio 24/7',
        '288':'From gritty Berlin streets to dark corners of Brooklyn, this is techno made by artists pushing the genre further.',
        '142':'Relaxing vibes and a collection of vocal songs providing the laid back soundtrack to your day.',
        '278':'Laid back grooves and a collection of smooth vocals soothe the ears and relax the mind.',
        '2':'Lush vocals paired together with emotive dance music. Beautiful melodies and endless energy.',
        '403': 'Atmospheric Breaks takes the best elements of breakbeat and saturates the music with a heavy heaping of spaced out melodies, laid back synths, and out-of-this-world warm bass frequencies.',
        '404': 'Indie Beats is a wicked blending of laid back rhythms with cutting edge idealism. Smooth vocals round out the sound and make this the perfect indie music for head nodding, and chilling out.'
    }
    var tn_timer;
    
    $("#lC li").mousemove(function () {
        channel_stuff = $(this).attr("data-trigger");
        channel_name = $(this).text();
        clearTimeout(tn_timer);
        tn_timer = setInterval(function () {
             if ($("#lC").is(':hover')) {
                    x = ":(";
                    
                       $( "#popup_nowplay" ).css({"display":"block"});      
                                $( "#popup_nowplay" ).animate({
                                    opacity: 0.85
                                                     
                            }, 125);
                    dP = channel_stuff.indexOf("_"); //parse the value. need both bits. 
                    channel_Id = channel_stuff.substring(0, (dP)); // channel id for the trackname
                    $.getJSON(bg.apiUrl, function (data) {
                        $.each(data, function (key, val) {
                            if (key == channel_Id) {
                                $('#popup_nowplay').html(`
                                <span style='font-weight:bold; font-size:14px;'> ${channel_name} </span>
                                <br /> <br /> 
                                ${descriptions[channel_Id]} 
                                <br /> <br /> 
                                Now Playing:<br>
                                <span style='font-weight:bold; font-size:14px;'> ${val.track} </span>
                                `);
                             
                            } 
                        });
                    });
             } 
             
             else{
                    $( "#popup_nowplay" ).animate({
                        opacity: 0
                    },125, function()
                    {
                        $( "#popup_nowplay" ).css({display:"none"});
                    });     
                 
             }


        }, 155);
    });
     $("#popup_nowplay").mouseover(function () {
                     clearTimeout(tn_timer);
                    $( "#popup_nowplay" ).animate({
                        opacity: 0
                    },125, function()
                    {
                        $( "#popup_nowplay" ).css({display:"none"});
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
    drawContext.clearRect(0, 0, canvasX, canvasY);
    try{
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
    } catch(e){
        drawContext.clearRect(0, 0, canvas.width, canvas.height);
    }

}

function mkdownload(serverNumber, channelNameID, is_p){
	chNm = channelNameID.split("_")[1];
	channelNameWord = chNm;
	listenerKey = $.cookie('diKeys');
	isHiQ = "";
	if ($.cookie('diHq') == 1){
		isHiQ = "_hi";
	}
	
	if (is_p == 1){
		chStthing = `http://prem${serverNumber}.di.fm/${chNm}${isHiQ}?${listenerKey}`;

	}
	else{
		chStthing = `http://pub${serverNumber}.di.fm/di_${chNm}_aac?type=.mp3`;

		}
	
thingString = `[playlist]
NumberOfEntries=1
File1=${chStthing}
Title1=Digitally Imported - ${channelNameWord} - assisted by Differently Imported
Length1=-1
Version=2`;
	
	pls_download('DI.fm -- '+channelNameWord+' -- By Differently Imported.pls', thingString);
	
}


function pls_download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:pls/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  /*Hackety security override Win*/
  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

$(document).ready(function(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 
    var xmasfrom = new Date(2015, 11, 19); 
    var nyfrom = new Date(2015, 11, 31);  
    var xmasto   = new Date(2015, 11, 31);
    var nyto   = new Date(2016, 0, 2);
    var check = new Date(yyyy, mm, dd);

    if(check >= xmasfrom && check < nyto){
       var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", 'snowstorm.js')        
        document.getElementsByTagName("head")[0].appendChild(fileref)
        if (!playing){
        $('#imageContainer img').attr('src', 'DiffXmas.png');
        }
    }   

    
});