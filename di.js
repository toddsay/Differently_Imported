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

var frameLength = 5; // ms to display
var daysToCache = 7; // days between loads of site/channel data
var bg = chrome.extension.getBackgroundPage();

var s_out = true;
var t_out = true;

$(document).ready(function() {
    analyseThis();
    window['__onGCastApiAvailable'] = function(isAvailable) {
        if (isAvailable) {
            cast.framework.CastContext.getInstance().setOptions({
                receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
            });
        }
    };

    if ($.cookie('diChan') != null && $.cookie('diChan') != null) {
        $('#lK').val($.cookie("diKeys"));
        $('#lC').val($.cookie("diChan"));
        $('#server').val($.cookie("Diserver"));
        var listView = $.cookie("Dilistview") ? $.cookie("Dilistview") : "all_channels";
        swap_lists($("." + listView));
        show_stars();

        $('#vol').val($.cookie("diVol"));
        hQ = $.cookie("dihQ");

        $('#hQ').val($.cookie("diHq"));
        $("#mini_tn").text($.cookie("diChPt"));
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

        $('#offAH').val($.cookie("diOffTH"));
        $('#offAM').val($.cookie("diOffTM"));
        $('#onAH').val($.cookie("diOnTH"));
        $('#onAM').val($.cookie("diOnTM"));

        if ($.cookie('lastSK') != null) {
            $.cookie('lastSK', '', {
                'expires': 0
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
            } else {
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
        sleepTracker = setInterval(function() {
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
        $("#trackImage").html($.cookie("diChPic")); // diChPic is the html for the 'now playing' image square
        $("#channelImage").html($.cookie("diChImage")); // diChImage is the html for the current channel
    } else {
        $("#track").html(bg.motd);
        $("#trackImage").html(bg.diIMG);
        $("#channelImage").html(bg.diIMG);
        $.cookie("diChPic", bg.diIMG, {
            expires: 365
        });
    }
    if (!$.cookie("premium") || $.cookie("premium") == 0) {
        $("#nag").css({
            "display": "block"
        });
    }

    loadCurrentTracks();

    $("#vol").on("input change", function() {
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

    $('.popup_last').click(function() {
        alert('This may take a moment, Close the Last.fm page after authing to finish connecting.');
        token = bg.get_token();
    });

    $('.timings').click(function() {
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

    $('.settings').click(function() {
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
        $('.lastNP').click(function() {
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

    $("#saveS").click(function() {
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

    $('.help').click(function() {
        window.open("support.html");
    });

    var ctrlPressed = false;

    function cacheIt(event) {
        ctrlPressed = event.ctrlKey;
    }
    document.onkeydown = cacheIt;
    document.onkeyup = cacheIt;
    $("body").dblclick(function() {
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

    $('body').on('click', '#lC.channel li, #lC.show div', function() {
        var element = $(this);
        if (ctrlPressed) {
            mkdownload($("#server").val(), element.attr("data-trigger"), $.cookie("premium"));
        } else {
            var parent = element.parent();
            $.cookie('lastLiked', '0', { 'expires': 365 })

            if (parent.hasClass('show')) {
                var channelImageHtml = bg.makeHtml($('.selector_choices').children(':visible').first().attr("data-image"));
                $("#channelImage").html(channelImageHtml);
                $.cookie("diChImage", channelImageHtml, { expires: 365 });
                var showImageHtml = bg.makeHtml(parent.attr("data-image"));
                $("#trackImage").html(showImageHtml);
                $.cookie("diChan", parent.attr("data-trigger"), { expires: 365 });
                var showId = element.attr("data-id");
                playShow(showId);
                return;
            }

            // Set channel/track images
            var channelImageHtml = bg.makeHtml(element.attr("data-image"));
            $("#channelImage").html(channelImageHtml);
            $.cookie("diChImage", channelImageHtml, { expires: 365 });

            var nowPlayingImageHtml = channelImageHtml;
            var childDiv = element.find('div').first();
            if (childDiv.length > 0) {
                nowPlayingImageHtml = bg.makeHtml($(childDiv).attr("data-image"));
            }
            $("#trackImage").html(nowPlayingImageHtml);

            var site = element.attr("data-site");
            if (site) {
                bg.setCurrentSite(site);
            }

            $.cookie("diChan", element.attr("data-trigger"), { expires: 365 });
            var channelName = element.find('.channel_name').text();
            $("#mini_tn").text(channelName);
            $.cookie("diChPt", channelName, { expires: 365 });

            if (bg.playing) {
                clearInterval(disTimer);
                setTimeout(function() {
                    disTimer = setInterval(function() {
                        getTn();
                    }, 500);
                }, 750);
            }
            doPlay();
            show_stars();
        }
    });

    $('body').on('click', '#lC.show li', function(event) {
        if (event.target != this) {
            return; // a child node was clicked, so we will play the show via the other handler
        }
        clickShowName($(this));
    });

    $('body').on('selectstart', '#lC li', function() {
        return false; // prevent accidental selection
    });

    document.getElementById("stBut").addEventListener('click', function() { // On Stop Click
        chrome.runtime.sendMessage({
            play: "0"
        }); //Send method play:0 == Stop
        $("#track").text("Stopped");
        setTimeout(function() {
            $.cookie("diChImage", bg.diIMG, {
                expires: 365
            });

            $("#trackImage").html(bg.diIMG);
            $.cookie("diChTn", "Stopped", {
                expires: 365
            });
        }, 500);
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
        if (typeof $.cookie('lastLiked') !== 'undefined') {
            if ($.cookie('lastLiked') == '1') {
                $('#doLike').css({ 'opacity': '1' });
                $('#doLike').attr('title', 'Unlove this');
            } else {
                $('#doLike').css({ 'opacity': '0.3' });
                $('#doLike').attr('title', 'Last.fm: love this track');
            }
        }
        $('#vol').val($.cookie("diVol"));
        chrome.runtime.sendMessage({
            play: "3"
        });
        if ($.cookie("newT") == "1") { //////change only if needs it.
            $("#track").html($.cookie("diChTn"));
            $("#trackImage").html($.cookie("diChPic"));
            $.cookie("newT", "0", {
                expires: 365
            });
            loadCurrentTracks(); // update the list of tracks for the current tab
        }
    }

    setInterval(function() {
        $(".channel li").each(function() {
            if ($.cookie("diChan") == $(this).attr("data-trigger")) {
                $(this).addClass("selected");
            } else {
                $(this).removeClass("selected");
            }
        });
    }, 300);
});

function scrolCh() {
    setTimeout(function() {
        trappedC = 0;
        $(".channel.active li").each(function() {
            if ($.cookie("diChPt") == $(this).text()) {
                $(".channel.active").scrollTop(0);
                newX = $(this).position().top;
                newX = newX - 155;

                $(".channel.active").scrollTop(newX);
                trappedC = 1;
            }
        });
        if (trappedC != 1) {
            scrolCh();
        }
    }, 50);
}

// Play the currently selected channel, or optionally load a specific url (show)
function doPlay(directUrl, directArtist, directTitle) {
    // Just to test that the listen_key is valid (note that the URL changed)
    //var testUrl = "http://listen.di.fm/premium/00sclubhits.pls?listen_key="; // was http://listen.di.fm/public3/favorites?
    var testUrl = "http://listen.di.fm/premium/favorites?listen_key=";

    var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    if (castSession) {
        bg.castSession = castSession;
    }
    // var sess = cast.framework.CastContext.getInstance().requestSession().then(function() {
    //     console.log('foo');
    // });
    // var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    // if (castSession) {
    //     bg.castStream('http://prem4.di.fm/epictrance?feafe5da4f3ea496e3aa1eec', 'audio/mp3');
    //     var mediaInfo = new chrome.cast.media.MediaInfo('http://prem4.di.fm/epictrance?feafe5da4f3ea496e3aa1eec', 'audio/mp3');
    //     var request = new chrome.cast.media.LoadRequest(mediaInfo);
    //     castSession.loadMedia(request).then(
    //         function() { console.log('Load succeed'); },
    //         function(errorCode) { console.log('Error code: ' + errorCode); });
    // }

    var checkKey = $.ajax({
        type: "get",
        url: testUrl + $('#lK').val(),
        statusCode: {
            200: function() {
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
                    directUrl: directUrl,
                    directArtist: directArtist,
                    directTitle: directTitle,
                    vol: volm,
                    server: $('#server').val(),
                    play: "1"
                }); //and method play:1 == Play.
            },
            403: function() {
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

function playShow(showId) {
    var showUrl = "http://www." + getCurrentSiteForShows().url + "/_papi/v1/di/tracks/" + showId;
    $.ajax({
        url: showUrl,
        type: 'GET',
        dataType: 'json',
        headers: { 'X-Api-Key': 'cc04dc88c7d8dce5c8dcad19c152b194' },
        success: function(data) {
            var contentUrl = 'http:' + data.content.assets[0].url;
            var artist = data.display_artist;
            var title = data.display_title;
            doPlay(contentUrl, artist, title);
        },
        error: function() {}
    });
}

maxYLen = 3000;
scrollStep = 9;
//jQuery ismouseover  method
//This isn't a licenced method but it saved me ages messing (after a lot of messing around anyway :( )
//so all credit to Ivan Castellanos - http://stackoverflow.com/questions/1273566/how-do-i-check-if-the-mouse-is-over-an-element-in-jquery
(function($) {
    $.mlp = {
        x: 0,
        y: 0
    }; // Mouse Last Position
    function documentHandler() {
        var $current = this === document ? $(this) : $(this).contents();
        $current.mousemove(function(e) {
            jQuery.mlp = {
                x: e.pageX,
                y: e.pageY
            }
        });
        $current.find("iframe").load(documentHandler);
    }
    $(documentHandler);
    $.fn.ismouseover = function(overThis) {
        var result = false;
        this.eq(0).each(function() {
            var $current = $(this).is("iframe") ? $(this).contents().find("body") : $(this);
            var offset = $current.offset();
            result = offset.left <= $.mlp.x && offset.left + $current.outerWidth() > $.mlp.x &&
                offset.top <= $.mlp.y && offset.top + $current.outerHeight() > $.mlp.y;
        });
        return result;
    };
})(jQuery);

$(document).ready(function() {
    $('#tSave').click(function() {
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

    $('#goSleep').click(function() {
        if (bg.sleepyTime > -1) {
            bg.stopSleep();
            clearInterval(sleepTracker);
            $('#goSleep').text("Go/Stop");
        } else {
            bg.setSleep($('#sleepBox').val() * 60);

            sleepTracker = setInterval(function() {
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

    // var tn_timer;
    // $('body').on('mousemove', '#lC li', function() {
    //     channel_stuff = $(this).attr("data-trigger");
    //     channel_name = $(this).text();
    //     clearTimeout(tn_timer);
    //     tn_timer = setInterval(function() {
    //         if ($("#lC.active").is(':hover')) {
    //             $("#popup_nowplay").css({ "display": "block" });
    //             $("#popup_nowplay").animate({
    //                 opacity: 0.85
    //             }, 125);
    //             dP = channel_stuff.indexOf("_"); //parse the value. need both bits.
    //             channel_Id = channel_stuff.substring(0, (dP)); // channel id for the trackname
    //             var url = buildApiUrl() + '/track_history';
    //             $.getJSON(url, function(data) {
    //                 $.each(data, function(key, val) {
    //                     if (key == channel_Id) {
    //                         $('#popup_nowplay').html(`
    //                         <span style='font-weight:bold; font-size:14px;'> ${channel_name} </span>
    //                         <br /> <br />
    //                         ${descriptions[channel_Id]}
    //                         <br /> <br />
    //                         Now Playing:<br>
    //                         <span style='font-weight:bold; font-size:14px;'> ${val.track} </span>
    //                         `);
    //                     }
    //                 });
    //             });
    //         } else {
    //             $("#popup_nowplay").animate({
    //                 opacity: 0
    //             }, 125, function() {
    //                 $("#popup_nowplay").css({ display: "none" });
    //             });
    //         }
    //     }, 155);
    // });

    $("#popup_nowplay").mouseover(function() {
        // clearTimeout(tn_timer);
        $("#popup_nowplay").animate({
            opacity: 0
        }, 125, function() {
            $("#popup_nowplay").css({ display: "none" });
        });
    });

    scroll_x = 0; // swap for cookie

    $("#down_pad").mouseover(function() {
        scr_timer = setInterval(function() {
            if ($("#down_pad").ismouseover()) {
                scroll_x = $(".select.active").scrollTop();
                scroll_x = scroll_x + scrollStep;
                if (scroll_x >= maxYLen) {
                    scroll_x = maxYLen;
                }
                $(".select.active").scrollTop(scroll_x);
            }
        }, 23);
    });

    $("#down_pad").mouseout(function() {
        clearInterval(scr_timer);
    });

    $("#up_pad").mouseover(function() {
        scr_timer = setInterval(function() {
            if ($("#up_pad").ismouseover()) {
                scroll_x = $(".select.active").scrollTop();
                scroll_x = scroll_x - scrollStep;
                if (scroll_x <= 0) {
                    scroll_x = 0;
                }
                $(".select.active").scrollTop(scroll_x);
            }
        }, 23);
    });

    $("#up_pad").mouseout(function() {
        clearInterval(scr_timer);
    });

    $("#doScrob").click(function() {
        storedhtml = $("#track").html();
        setTimeout(function() {
            $("#track").html(storedhtml);
        }, 250);
        $("#track").html('Scrobbled');
        bg.scrobblage();
    });

    $("#doLike").click(function() {
        storedhtml = $("#track").html();
        setTimeout(function() {
            $("#track").html(storedhtml);
        }, 250);
        $("#track").html('Liked');
        bg.likeage();
    });

    $(".selector_left, .selector_right").click(function() {
        var activeTab = $('.list_selector.active_list');
        var adjustment = $(this).hasClass('selector_left') ? -1 : 1;

        if (activeTab.hasClass('shows')) {
            // Navigating channel selector for shows
            var siteUrl = getCurrentSiteForShows().url;
            var channelId = getCurrentChannelId(siteUrl);
            getSiteDetails(siteUrl, function(siteData) {
                var channelIndex = $('.selector_choices').children(':visible').index();
                channelIndex += adjustment;
                if (channelIndex >= siteData.length) {
                    channelIndex = 0;
                } else if (channelIndex < 0) {
                    channelIndex = siteData.length - 1;
                }
                selectChannel(channelIndex);
            });
        } else {
            // Navigating site selector
            var siteIndex = bg.currentSiteIndex + adjustment;
            if (siteIndex >= bg.SiteList.length) {
                siteIndex = 0;
            } else if (siteIndex < 0) {
                siteIndex = bg.SiteList.length - 1;
            }
            selectSite(siteIndex);
        }
    });

    $('.list_selector').click(function() {
        swap_lists(this);
    });

    $('.add_to_fav').click(function() {
        addToFavorites();
    });
    start_track_duration();
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

    if (bg.analyser == null || bg.analyser.context == null || bg.analyser.context.sampleRate == 0) {
        return; // nothing to see here
    }

    try {
        bg.analyser.getByteFrequencyData(freqDomain);
        var frequencyCap = 18000;
        var frequencyRange = (bg.analyser.context.sampleRate / bg.analyser.fftSize) * bg.analyser.frequencyBinCount;
        var binsToUse = bg.analyser.frequencyBinCount * (frequencyCap / frequencyRange);
        for (i = 0; i < binsToUse; i++) {
            value = freqDomain[i];
            percent = value / 256;
            height = canvasY * percent;
            offset = canvasY - height - 1;
            barWidth = canvasX / binsToUse;
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
    } catch (e) {
        drawContext.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function mkdownload(serverNumber, channelNameID, is_p) {
    chNm = channelNameID.split("_")[1];
    channelNameWord = chNm;
    listenerKey = $.cookie('diKeys');
    isHiQ = "";
    if ($.cookie('diHq') == 1) {
        isHiQ = "_hi";
    }

    if (is_p == 1) {
        chStthing = `http://prem${serverNumber}.di.fm/${chNm}${isHiQ}?${listenerKey}`;
    } else {
        chStthing = `http://pub${serverNumber}.di.fm/di_${chNm}_aac?type=.mp3`;
    }

    thingString = `[playlist]
NumberOfEntries=1
File1=${chStthing}
Title1=Digitally Imported - ${channelNameWord} - assisted by Differently Imported
Length1=-1
Version=2`;

    pls_download('DI.fm -- ' + channelNameWord + ' -- By Differently Imported.pls', thingString);
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

$(document).ready(function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var xmasfrom = new Date(2016, 11, 19);
    var nyfrom = new Date(2016, 11, 31);
    var xmasto = new Date(2016, 11, 31);
    var nyto = new Date(2017, 0, 2);
    var check = new Date(yyyy, mm, dd);

    if (check >= xmasfrom && check < nyto) {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", 'snowstorm.js');
        document.getElementsByTagName("head")[0].appendChild(fileref)
        if (!playing) {
            $('#trackImage img').attr('src', 'DiffXmas.png');
        }
    }
});

function getCurrentSiteForShows() {
    return bg.getSite('di'); // shows only work for di currently
}

function getCurrentChannelId(forSiteUrl) {
    if (forSiteUrl && bg.getCurrentSite().url != forSiteUrl) {
        return null; // wrong site so use default or first channel
    }

    var channel_stuff = $.cookie("diChan");
    dP = channel_stuff.indexOf("_"); // parse the value, need both bits
    channel_Id = channel_stuff.substring(0, (dP)); // channel id for the trackname
    return channel_Id;
}

function getFavorites(callback) {
    chrome.storage.local.get('favorites', function(data) {
        if (!data.favorites) {
            data.favorites = {};
        }
        callback(data.favorites);
    });
}

function saveFavorites(favorites) {
    chrome.storage.local.set({ 'favorites': favorites }, function() {});
}

function addToFavorites() {
    var siteUrl = bg.getCurrentSite().url;
    var channelId = getCurrentChannelId();

    getChannelInfo(siteUrl, channelId, function(channelData) {
        getFavorites(function(favorites) {
            if (favorites[channelId]) {
                delete favorites[channelId];
            } else {
                channelData.sortOrder = favorites.length;
                favorites[channelId] = channelData;
            }
            saveFavorites(favorites);
            show_stars();
        });
    });
}

function getSiteDetails(siteUrl, callback) {
    if (!siteUrl) {
        siteUrl = bg.getCurrentSite().url;
    }
    var site = bg.getSite(siteUrl).site;

    chrome.storage.local.get(siteUrl, function(data) {
        if (data[siteUrl] === undefined || data[siteUrl].expiration == null || data[siteUrl].expiration < new Date()) {
            var stream = siteUrl == 'rockradio.com' ? 'android_premium' : 'premium';
            var configUrl = 'http://listen.' + siteUrl + '/' + stream;
            $.getJSON(configUrl, function(data) {
                var channelData = {};
                // Extract the channel list and sort by name
                channelData.channels = data.sort(function(a, b) {
                    if (a.name > b.name) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                // populate each channel with site info for convenience
                $.each(channelData.channels, function(key, val) {
                    val.site = site;
                    val.siteUrl = siteUrl;
                });

                var expirationDate = new Date();
                expirationDate.setDate(new Date().getDate() + daysToCache);
                channelData.expiration = expirationDate;
                channelData.site = site;

                var cacheData = {};
                cacheData[siteUrl] = channelData;
                chrome.storage.local.set(cacheData, function() {});
                callback(channelData.channels);
            });
        } else {
            callback(data[siteUrl].channels);
        }
    });
}

function getChannelInfo(siteUrl, channelId, callback) {
    getSiteDetails(siteUrl, function(data) {
        $.each(data, function(key, channelData) {
            if (channelData.id == channelId || !channelId) { // selected channel (or first channel if none specified)
                callback(channelData);
            }
        });
    });
}

function buildSiteSelector() {
    var choices = '';
    $.each(bg.SiteList, function(key, site) {
        choices += '<img src="' + site.logo + '">';
    });
    $('.selector_choices').html(choices);
    selectSite(bg.currentSiteIndex);
}

function selectSite(index) {
    bg.setCurrentSite(index);
    $('.selector_choices img').hide();
    $('.selector_choices img').eq(index).show();
    buildChannelList();
}

function buildChannelSelector() {
    var siteUrl = getCurrentSiteForShows().url;
    var currentChannelId = getCurrentChannelId(siteUrl);

    getSiteDetails(siteUrl, function(data) {
        var choices = "";
        var channelIndex = 0;
        $.each(data, function(key, channelData) {
            choices += '<span data-image="' + bg.getChannelImage(channelData) + '">' + channelData.name + '</span>';
            if (channelData.id == currentChannelId) {
                channelIndex = key;
            }
        });
        $('.selector_choices').html(choices);
        selectChannel(channelIndex);
    });
}

function selectChannel(index) {
    $('.selector_choices span').hide();
    $('.selector_choices span').eq(index).show();
    buildShowList();
}

function buildChannelList() {
    var site = bg.getCurrentSite().site;

    getSiteDetails(null, function(data) {
        $('.master_list').empty();
        var channelHtml = "";
        $.each(data, function(key, channelData) {
            channelHtml += '<li data-image="' + bg.getChannelImage(channelData) +
                '" title="' + channelData.name + ' - ' + channelData.description + ' (Ctrl+Click for PLS)" data-trigger="' +
                channelData.id + '_' + channelData.key + '" data-site="' + site + '"><span class="channel_name">' +
                channelData.name + '</span></li>';
        });

        $('.master_list').append($(channelHtml));
        loadCurrentTracks();
        $(".select.active").scrollTop(0);
    });
}

function buildShowList() {
    var site = getCurrentSiteForShows();
    var channelIndex = $('.selector_choices').children(':visible').index();

    getSiteDetails(site.url, function(data) {
        var showsHtml = '';
        var apiUrl = bg.buildApiUrl(site.site);
        var channel = data[channelIndex];
        var channelName = encodeURI(channel.name);
        var showsUrl = apiUrl + '/shows?page=1&per_page=500&facets[channel_name][]=' + channelName;

        $.getJSON(showsUrl, function(data) {
            if (data && data.results) {
                $.each(data.results, function(key, show) {
                    showsHtml += '<li class="show" data-image="' + bg.getChannelImage(show) + '" title="' + show.name +
                        '" data-show="' + show.slug + '" data-trigger="' + channel.id + '_' + channel.key +
                        '">' + show.name + '</li>';
                });
            }
            $('.shows_list').html(showsHtml);
        });
    });
}

function clickShowName(element) {
    var children = element.children();
    if (children.length > 0) {
        children.remove();
        return;
    }

    var showSlug = element.attr("data-show");
    var channel = element.attr("data-trigger");
    buildEpisodeList(channel, showSlug);
}

function buildEpisodeList(channel, slug) {
    var pageSize = 10;
    var apiUrl = bg.buildApiUrl();
    var episodesUrl = apiUrl + '/shows/' + slug + '/episodes?page=1&per_page=' + pageSize;

    $.getJSON(episodesUrl, function(data) {
        $.each(data, function(index, episode) {
            var track = episode.tracks[0];
            var nodeQuery = 'li[data-show="' + slug + '"]';
            appendTrackInfoToChannel(false, nodeQuery, track.display_title, null, track.id);
            //http://content.audioaddict.com/prd/6f50aea1e62c444db5d874def8c2f3c5c3b5bddb3a60811048f120da7cee59a2.mp4?audio_token=0d1e1d58c0c53715cd0ade09642afa24&purpose=playback&exp=2017-03-16T10:36:51Z&auth=5c36a267972c6180ff1cf2e7887bffea50b17447
        });
    });
}

function appendTrackInfoToChannel(replaceExistingDiv, nodeQuery, info, image, id) {
    var liChannel = $('#lC.active').find(nodeQuery);
    if (liChannel.length > 0) {
        trackHtml = '<div';
        if (image) {
            trackHtml += ' data-image="' + image + '"';
        }
        if (id) {
            trackHtml += ' data-id="' + id + '"';
        }
        trackHtml += '>' + info + '</div>';

        if (replaceExistingDiv) {
            childDiv = liChannel.children('div').first();
            if (childDiv.length > 0) {
                childDiv.html(trackHtml);
            } else {
                liChannel.append(trackHtml);
            }
        } else {
            liChannel.append(trackHtml);
        }
    }
}

function loadCurrentTracksForSite(site) {
    var apiUrl = bg.buildApiUrl(site) + '/track_history';
    // Load current track titles for each channel
    $.getJSON(apiUrl, function(data) {
        //TODO: Flip this, loading history for favorites, intead of checking each history for a matching favorite?
        $.each(data, function(key, val) {
            var nodeQuery = 'li[data-trigger^="' + key + '_"]';
            appendTrackInfoToChannel(true, nodeQuery, val.track, bg.getChannelImage(val));
        });
    });
}

function loadCurrentTracks() {
    // Find all sites referenced by the current channels list
    var siteList = {};
    $('#lC.active li').each(function() {
        var site = $(this).attr('data-site');
        if (!siteList[site]) {
            siteList[site] = 1;
        }
    });

    // For each site, load track_history and apply
    $.each(siteList, function(key, val) {
        loadCurrentTracksForSite(key);
    });
}

function buildFavoritesList() {
    getFavorites(function(favoritesObject) {
        // Convert object to array
        var favorites = [];
        $.each(favoritesObject, function(index, val) {
            favorites.push(val);
        });
        // Sort the array of favorites
        favorites = favorites.sort(function(a, b) {
            if (a.sortOrder > b.sortOrder) {
                return 1;
            } else {
                return -1;
            }
        });

        // Build the html for the favorites tab
        var favesHtml = '';
        $('.faves_list').html('');
        if (favorites.length == 0) {
            $('.faves_list').html('You have not added any favourites yet. Click the <img src ="fav_hollow.png"> by the player controls to start adding favourites.');
        } else {
            $.each(favorites, function(index, val) {
                favesHtml += '<li data-image="' + bg.getChannelImage(val) + '" title="' + val.name +
                    '" data-site="' + val.site + '" data-id="' + val.id +
                    '" data-trigger="' + val.id + '_' + val.key + '"><span class="handle"/>' +
                    '<span class="channel_name">' + val.name + '</span></li>';
            });
            var favesList = $('.faves_list');
            favesList.append($(favesHtml));
            favesList.sortable({ handle: '> .handle', update: updateFavoriteOrder });
            loadCurrentTracks();
        }
    });
}

function updateFavoriteOrder(event, ui) {
    getFavorites(function(favorites) {
        faveList = $('.faves_list');
        $.each(favorites, function(index, val) {
            val.sortOrder = faveList.find('li[data-id="' + val.id + '"]').index();
        });
        saveFavorites(favorites);
    });
};

function swap_lists(element) {
    var newlist = '';
    if ($(element).hasClass('all_channels')) {
        newlist = 'all_channels';
        buildSiteSelector();
    } else if ($(element).hasClass('faves')) {
        newlist = 'faves';
        buildFavoritesList();
    } else if ($(element).hasClass('shows')) {
        newlist = 'shows';
        buildChannelSelector();
    } else if ($(element).hasClass('fave_shows')) {
        newlist = 'fave_shows';
    }

    $('.selector_wrapper').toggle(newlist == 'all_channels' || newlist == 'shows');

    $('.master_list').toggle(newlist == 'all_channels');
    $('.master_list').toggleClass('active', newlist == 'all_channels');
    $('.all_channels').toggleClass('active_list', newlist == 'all_channels');

    $('.faves_list').toggle(newlist == 'faves');
    $('.faves_list').toggleClass('active', newlist == 'faves');
    $('.faves').toggleClass('active_list', newlist == 'faves');

    $('.shows_list').toggle(newlist == 'shows');
    $('.shows_list').toggleClass('active', newlist == 'shows');
    $('.shows').toggleClass('active_list', newlist == 'shows');

    $('.fave_shows_list').toggle(newlist == 'fave_shows');
    $('.fave_shows_list').toggleClass('active', newlist == 'fave_shows');
    $('.fave_shows').toggleClass('active_list', newlist == 'fave_shows');

    $.cookie("Dilistview", newlist, {
        expires: 365
    });

    scrolCh();
}

function show_stars() {
    getFavorites(function(favorites) {
        // Enable or disable the favorite 'star'
        var channelId = getCurrentChannelId();
        if (favorites[channelId]) {
            $('.add_to_fav').attr('src', 'fav_filled.png');
        } else {
            $('.add_to_fav').attr('src', 'fav_hollow.png');
        }
    });
}

function start_track_duration() {
    setInterval(function() {
        if ($.cookie('ctractlen') != 0 && $.cookie('ctractstart') != 0) {
            offset = $.cookie('servertimeoffset');
            seconds = new Date().getTime() / 1000;
            t_len = $.cookie('ctractlen');
            t_start = $.cookie('ctractstart');
            // t_pos is pixels across the duration bar.
            t_pos = ($('#trackline').width() / t_len) * (~~seconds - offset - t_start);
            if (t_pos > $('#trackline').width()) {
                t_pos = $('#trackline').width();
            }
            $('.trackpointer').width(t_pos);
        } else {
            $('.trackpointer').width($('#trackline').width());
        }
    }, 10);
}