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
var last_response = {};
var diIMG = "<img src='diffI.png' style='border:1px solid white; margin-top:20px; margin-left:15px; height:155px; width:155px;'>";
var playing = false;
var appTitle = 'Differently Imported+';

var currentSiteIndex = 0;
var SiteList = [
    { site: 'di', url: 'di.fm', desc: 'Digitally Imported', logo: 'http://cdn.audioaddict.com/di.fm/assets/network_site_logos_2x/di-825c83af566b394c18cc132ec2c7132a.png' },
    { site: 'radiotunes', url: 'radiotunes.com', desc: 'RadioTunes', logo: 'http://cdn.audioaddict.com/di.fm/assets/network_site_logos_2x/radiotunes-8f6b58a3539aae382863302c1ae8fe5b.png' },
    { site: 'rockradio', url: 'rockradio.com', desc: 'ROCKRADIO', logo: 'http://cdn.audioaddict.com/di.fm/assets/network_site_logos_2x/rockradio-1323bbe051c0d79ec49de6e9e37e73cb.png' },
    { site: 'jazzradio', url: 'jazzradio.com', desc: 'JAZZRADIO', logo: 'http://cdn.audioaddict.com/di.fm/assets/network_site_logos_2x/jazzradio-8866b0d7ef949f7ef6f0c39c73cca097.png' },
    //{ site: 'classicalradio', url: 'classicalradio.com', desc: 'ClassicalRadio', logo: 'http://cdn.audioaddict.com/di.fm/assets/network_site_logos_2x/classicalradio-f46ea4db6ead9edf082f6b0e6ec8d72b.png' }, // Channel list doesn't seem to work here
];

function getCurrentSite() {
    var site = SiteList[currentSiteIndex];
    return site;
}

function setCurrentSite(site) {
    if (isNaN(site)) {
        var foundSite = getSite(site);
        currentSiteIndex = SiteList.indexOf(foundSite);
    } else {
        currentSiteIndex = site;
    }
}

function getSite(siteIdOrUtl) {
    var foundSite = getCurrentSite();
    $.each(SiteList, function(key, data) {
        if (data.site == siteIdOrUtl || data.url == siteIdOrUtl) {
            foundSite = SiteList[key];
        }
    });

    return foundSite;
}

function buildApiUrl(site) {
    if (!site) {
        site = getCurrentSite().site;
    }
    //return 'http://www.' + currentSite.url + '/_papi/v1/' + currentSite.site;
    return 'http://api.audioaddict.com/v1/' + site;
}

function getChannelImage(channelData) {
    var image = 'diffI.png';
    if (channelData) {
        if (channelData.images && channelData.images.compact) {
            image = channelData.images.compact.replace(/{.*/, '');
        } else if (channelData.art_url) {
            image = channelData.art_url;
        } else if (channelData.asset_url) {
            image = channelData.asset_url;
        }
    }
    return image.replace(/^\/\//, 'http://');
}

$(document).ready(function() { //Set some vars
    chrome.commands.onCommand.addListener(function(command) {
        if (command == "toggle-play") {
            if (!playing) {
                playing = true;
                server = $.cookie("Diserver");
                key = $.cookie("diKeys");
                channel = $.cookie("diChan");
                vol = $.cookie("diVol");
                play(channel, key, vol, server);
                pollFlag = 1;
                var audio = document.getElementById('diPlyr');
                audio.volume = $.cookie("diVol") / 100;
            } else {
                playing = false;
                stop();
            }
        }
    });
    setTimeout(function() {
        makeTS();
        timeEngine();
    }, 2000);

    capAudio = document.getElementById('diPlyr');
    pollFlag = 1;
    pollTime = 0;
    playing = false;
    newSess = true;
    var server = "";
    var key = "";
    var channel = "";
    var vol = "";
    if (!$.cookie("diVol")) {
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
    var xmasfrom = new Date(2015, 11, 19);
    var nyfrom = new Date(2015, 11, 31);
    var xmasto = new Date(2015, 11, 31);
    var nyto = new Date(2016, 0, 2);
    var check = new Date(yyyy, mm, dd);

    if (check >= xmasfrom && check < xmasto) {
        motd = "<span>Happy Holidays from Phil @ Differently Imported<br /><a href ='https://www.facebook.com/DifferentlyImported' target='_blank'> <span style='color:#cdcdcd;  text-decoration: underline;'>Facebook</span></a> / <a href='https://chrome.google.com/webstore/detail/differently-imported-for/bnihjdccalbcoienhgcjjlilfdhacdkf' target='_blank'> <span style='color:#cdcdcd; text-decoration: underline;'>Feedback</span></a></span>";
        diIMG = "<img src='diffXmas.png' style='border:1px solid white; margin-top:20px; margin-left:15px; height:155px; width:155px;'>";
    } else if (check >= nyfrom && check <= nyto) {
        motd = "<span>Happy New Year from Phil @ Differently Imported<br /><a href ='https://www.facebook.com/DifferentlyImported' target='_blank'> <span style='color:#cdcdcd;  text-decoration: underline;'>Facebook</span></a> / <a href='https://chrome.google.com/webstore/detail/differently-imported-for/bnihjdccalbcoienhgcjjlilfdhacdkf' target='_blank'> <span style='color:#cdcdcd; text-decoration: underline;'>Feedback</span></a></span>";
        diIMG = "<img src='diffXmas.png' style='border:1px solid white; margin-top:20px; margin-left:15px; height:155px; width:155px;'>";
    } else {
        motd = "<span>Differently Imported. <a href='support.html' target='_blank'><span style='color:#cdcdcd;  text-decoration: underline;'>All User Requested features.</span></a> Thanks for your input. V4.3.70 <br><a href ='https://www.facebook.com/DifferentlyImported' target='_blank'> <span style='color:#cdcdcd;  text-decoration: underline;'>Facebook</span></a> / <a href='https://chrome.google.com/webstore/detail/differently-imported-for/bnihjdccalbcoienhgcjjlilfdhacdkf' target='_blank'> <span style='color:#cdcdcd; text-decoration: underline;'>Feedback</span></a></span>";
    }

    $.cookie("diChTn", motd, {
        expires: 365
    });
    $.cookie('ctractlen', 0, { 'expires': 365 });
    $.cookie('ctractstart', 0, { 'expires': 365 });

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
            if (playing) {
                stop();
            }
            playing = true;
            server = action.server;
            key = action.key;
            channel = action.channel;
            directUrl = action.directUrl;
            directArtist = action.directArtist;
            directTitle = action.directTitle;
            vol = 0.5;
            play(channel, key, vol, server, directUrl, directArtist, directTitle);
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
                $.cookie('ctractlen', 0, { 'expires': 365 });
                $.cookie('ctractstart', 0, { 'expires': 365 });
                $.cookie("newT", "1", {
                    expires: 365
                });
                // Not sure if this is ever needed but it is resetting my configured value
                // $.cookie("diHq", "1", {
                //     expires: 365
                // });
            }
        }
    });

    function stop() {
        scrollIcon(false); // disable the play badge on the icon
        chrome.browserAction.setTitle({ title: appTitle });
        $("#diPlyr").attr("src", "");
        $("#diPlyr").remove();
        try {
            audioContext.close().then(function() {});
        } catch (e) {}
        if (playing == "false") {
            $.cookie("diChTn", motd, {
                expires: 365
            });
            $.cookie('ctractlen', 0, { 'expires': 365 });
            $.cookie('ctractstart', 0, { 'expires': 365 });
            $.cookie("newT", "1", {
                expires: 365
            });
        }
    }

    // Play the specified channel. Optionally if directUrl is specified, play a specific url (show).
    function play(ch, ky, vol, server, directUrl, directArtist, directTitle) {
        delimitPos = ch.indexOf("_"); //parse the value. need both bits.
        chLength = ch.length;
        channelId = ch.substring(0, (delimitPos)); // channel id for the trackname

        if (directUrl) {
            url = directUrl;
            last_response['last_np_artist'] = directArtist;
            last_response['last_np_track'] = directTitle;
        } else {
            chUrl = ch.substring(delimitPos + 1, chLength); //channel name for the url
            var domain = "." + getCurrentSite().url;
            if ($.cookie("premium") == "1") {
                if ($.cookie("diHq") == "1") {
                    chUrl = chUrl + "_hi"; // high or low quality stream
                }
                url = "http://prem" + server + domain + "/" + chUrl + "?" + ky;
            } else {
                url = "http://pub" + server + domain + "/di_" + chUrl + "_aac?type=.flv";
            }
        }

        $.cookie("diChId", channelId, {
            expires: 365
        }); // save em for later
        $.cookie("Diserver", server, {
            expires: 365
        });
        $.cookie("diDirectUrl", directUrl ? directUrl : '', {
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
            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
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
                    if (playing) {
                        txtAnim = anim[ts];
                        ts++;
                        if (ts >= 8) {
                            ts = 0;
                        }
                        chrome.browserAction.setBadgeText({
                            text: txtAnim
                        });
                    } else {
                        clearInterval(txTim);
                        txTim = false;
                        chrome.browserAction.setBadgeText({
                            text: " "
                        });
                        stop();
                    }
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
            $.cookie('ctractlen', 0, { 'expires': 365 });
            $.cookie('ctractstart', 0, { 'expires': 365 });
            $.cookie("newT", "1", {
                expires: 365
            });
        }
    }

    //-----------------------------------------------

    function timeEngine() {

        if ($.cookie('lastNP') == '1') {
            nowplayLast();
        }

        var currentD = new Date();
        if (($.cookie("diOnTrig") == "1") && (alOn <= currentD.getTime())) {
            if (!playing) {
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
            if ($.cookie("dailyPlay") != "1") {
                $.cookie("diOnTrig", "0", {
                    expires: 365
                });
            } else {
                makeTS();
            }
        }

        if (($.cookie("diOffTrig") == '1') && (alOff <= currentD.getTime())) {
            stop();
            playing = false;
            if ($.cookie("dailyStop") != "1") {
                $.cookie("diOffTrig", "0", {
                    expires: 365
                });
            } else {
                makeTS();
            }
        }
        setTimeout(function() {
            timeEngine();
        }, 1000);
    }
});

var alOff;
var alOn;

function makeTS() {
    onH = $.cookie("diOnTH");
    onM = $.cookie("diOnTM");
    offH = $.cookie("diOffTH");
    offM = $.cookie("diOffTM");
    var currentD = new Date();
    alOff = new Date();
    alOff.setHours(offH, offM, 00);
    if (currentD >= alOff) {
        alOff.setDate(alOff.getDate() + 1);
        alOff.setHours(offH, offM, 00);
    }
    alOn = new Date();
    alOn.setHours(onH, onM, 00);
    if (currentD >= alOn) {
        alOn.setDate(alOn.getDate() + 1);
        alOn.setHours(onH, onM, 00);
    }
    alOn = alOn.getTime();
    alOff = alOff.getTime();
}

var sleepyTime = -1;
var sleepNumber;
var sleepyTimer;

function setSleep(inSleeps) {
    sleepyTime = inSleeps;
    sleepNumber = setInterval(function() {
        sleepyTime = sleepyTime - 1;
    }, 1000);
    sleepyTimer = setTimeout(function() {
        stopSleep();
        playing = false;
        stop();
    }, sleepyTime * 1000);
}

function stopSleep() {
    sleepyTime = -1;
    clearInterval(sleepNumber);
    clearTimeout(sleepyTimer);
}

var last_fm_key = 'a215d8f01fed30fa10b7fb9c2e82a54d';
var last_url = "http://ws.audioscrobbler.com/2.0/";
var tokenUrl = 'http://ws.audioscrobbler.com/2.0/?method=auth.gettoken&api_key=a215d8f01fed30fa10b7fb9c2e82a54d&format=json';

function get_token() {
    $.ajax({
        type: "POST",
        url: tokenUrl,
        data: {},
        success: function(res) {
            last_response['lt'] = res['token'];
            var lastwin = window.open('http://www.last.fm/api/auth/?api_key=a215d8f01fed30fa10b7fb9c2e82a54d&token=' + last_response['lt']);
            var last_tmer = setInterval(function() {
                if (lastwin.closed) {
                    clearInterval(last_tmer);
                    last_get_token(last_response['lt']);
                }
            }, 1000);
        },
        dataType: 'json'
    });
}

function last_call(method, data, sign) {
    last_response[method] = false;
    data['api_key'] = last_fm_key;
    data['method'] = method;
    if (sign) {
        post_data = last_sign(data);
    } else {
        post_data = data;
    }
    post_data['format'] = 'json';
    $.ajax({
        type: "post",
        url: last_url,
        data: post_data,
        success: function(res) {
            last_response[method] = JSON.stringify(res);
            doCallbackJS(JSON.stringify(res), method);
            // Do something with response.
        },
        dataType: 'json'
    });
}

//-***************************************--------------------------------
function doCallbackJS(data, method) {
    console.log("LC: " + JSON.parse(last_response[method]));
    //return last_response[method];
    datafornow = JSON.parse(last_response[method]);
    if (datafornow["error"] == 9) {
        console.log('autherror');
        alert('Last.FM has been disconnected from Differently Imported. Please reconnect through \'Settings\'');
        $.cookie("lastSKey", '', {
            expires: 0
        });
        $.cookie("lastToken", '', {
            expires: 0
        });
    }
    if (method == 'auth.getSession') {
        $.cookie("lastSKey", datafornow['session']['key'], {
            expires: 365
        });
        $.cookie("lastToken", last_response['lt'], {
            expires: 365
        });
        $.cookie("lastUsername", datafornow['session']['name'], {
            expires: 365
        });
    } else if (method == 'track.updateNowPlaying') {
        console.log('Now Playing Captured');
    } else if (method == 'track.love' || method == 'track.unlove') {
        trackgetInfo(last_response['last_np_artist'], last_response['last_np_track']);
    } else if (method == 'track.getInfo') {
        if (typeof datafornow['track']['userloved'] !== 'undefined') {
            $.cookie('lastLiked', datafornow['track']['userloved'], {
                'expires': 1
            });
        }

        if (last_response['nextFunc'] == 'track.scrobble') {
            last_response['nextFunc'] = 0;
            params = {
                'token': $.cookie("lastToken"),
                'artist': datafornow['track']['artist']['name'],
                'track': datafornow['track']['name'],
                'chosenByUser': '0',
                'timestamp': Math.floor((new Date).getTime() / 1000),
                'sk': $.cookie("lastSKey")
            }
            console.log(params);
            result = last_call('track.scrobble', params, true);
        } else if (last_response['nextFunc'] == 'track.updateNowPlaying') {
            last_response['nextFunc'] = 0;
            params = {
                'token': $.cookie("lastToken"),
                'artist': datafornow['track']['artist']['name'],
                'track': datafornow['track']['name'],
                'sk': $.cookie("lastSKey")
            }
            console.log(params);
            result = last_call('track.updateNowPlaying', params, true);
        }
    } else if (method == 'track.scrobble') {
        console.log('Scrobbled');
    }
}

//-***************************************--------------------------------
function scrobblage() {
    /*
    artist[i] (Required) : The artist name.
    track[i] (Required) : The track name.
    timestamp[i] (Required) : The time the track started playing, in UNIX timestamp format (integer number of seconds since 00:00:00, January 1st 1970 UTC). This must be in the UTC time zone.
    api_key (Required) : A Last.fm API key.
    api_sig (Required) : A Last.fm method signature. See authentication for more information.
    sk (Required) : A session key generated
    last_response['last_np_artist'] = val.artist;
                                last_response['last_np_track'] = val.title;
    */
    trackgetInfo(last_response['last_np_artist'], last_response['last_np_track']);
    last_response['nextFunc'] = 'track.scrobble';
}

function likeage() {
    if ($.cookie('lastLiked') == '1') {
        thefunk = 'track.unlove';
    } else {
        thefunk = 'track.love';
    }
    params = {
        'token': $.cookie("lastToken"),
        'artist': last_response['last_np_artist'],
        'track': last_response['last_np_track'],
        'sk': $.cookie("lastSKey")
    }
    console.log(params);
    result = last_call(thefunk, params, true);
}

var tl;
var ts;
var tp;
var tr;

function get_time() {
    time_ping_url = "http://api.audioaddict.com/v1/ping.json";
    $.get(time_ping_url, function(timeinfo) {
        server_time = timeinfo['time'];
        server_time = new Date(server_time).getTime() / 1000;
        local_time = new Date().getTime() / 1000;
        time_offset = (~~local_time - server_time);
        $.cookie('servertimeoffset', time_offset, { 'expires': 365 });
    });
}

function showTrack() { // tracklist api call. timed with flags to stop server hammerage.
    unix = Math.round(+new Date() / 1000);
    if (unix >= $.cookie("diPt")) {
        console.log('need new track');
        pollFlag = 1;
    }
    if (pollFlag == 1) {
        chId = $.cookie("diChId");
        directUrl = $.cookie("diDirectUrl");
        if (directUrl.length) {
            return; // no tracklist, just one show
        }

        get_time();
        var url = buildApiUrl() + '/track_history';

        $.getJSON(url, function(data) {
            $.each(data, function(key, val) {
                if (key == chId) {
                    tl = val.duration;
                    ts = val.started;
                    $.cookie('ctractlen', tl, { 'expires': 365 });
                    $.cookie('ctractstart', ts, { 'expires': 365 });
                    if (last_response['last_np_artist'] != val.artist) {
                        $.cookie('lastLiked', '0', { 'expires': 365 });
                    }
                    tr = "<span title='" + val.track + "'>" + val.track + "</span>";
                    tp = getChannelImage(val); //val.art_url;
                    last_response['last_np_artist'] = val.artist;
                    last_response['last_np_track'] = val.title;
                    pollTime = parseInt(tl) + parseInt(ts);
                    chrome.browserAction.setTitle({ title: val.title });
                    $.cookie("diPt", pollTime, {
                        expires: 365
                    });
                    if (tp != null) {
                        tp = makeHtml(tp);
                    } else {
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

function stripslashes(urlIn) {
    urlIn = urlIn.replace("\\", "");
    return ("http:" + urlIn);
}
//-----------------------------------------------

function makeHtml(image) {
    var html = "<img title='drag and drop this album art into your browser to view full size.' src='" + image + "' style='border:1px solid white; margin-top:20px; margin-left:15px; height:155px; width:155px;'>";
    return (html)
}

function trackgetInfo(artist, track) {
    /*
    artist[i] (Required) : The artist name.
    track[i] (Required) : The track name.
    utocorrect[0|1] (Op
    api_key (Required) : A Last.fm API key.
    */
    params = {
        'artist': last_response['last_np_artist'],
        'track': last_response['last_np_track'],
        'autocorrect': 1,
        'username': $.cookie('lastUsername')
    }

    method = 'track.getInfo';
    result = last_call(method, params, false);
}

npt = "";
npa = "";
nptimer = false;

function nowplayLast() {
    // returns session key.
    //      artist (Required) : The artist name.
    //track (Required) : The track name.//
    //api_key (Required) : A Last.fm API key.
    //api_sig (Required) : A Last.fm method signature. See authentication for more information.
    //sk (Required)
    if (playing) {
        if (nptimer == false) {
            nptimer = setTimeout(function() {
                showTrack();
                nptimer = false
            }, 5000);
        }
        if (last_response['last_np_artist'] != npa && last_response['last_np_track'] != npt && last_response['last_np_artist'] !== 'undefined') {
            npa = last_response['last_np_artist'];
            npt = last_response['last_np_track'];
            trackgetInfo(last_response['last_np_artist'], last_response['last_np_track']);
            last_response['nextFunc'] = 'track.updateNowPlaying';
            setTimeout(function() {
                scrobblage();
            }, 1500);
        }
    }
}

function last_get_token(token) {
    // returns session key.
    // api_key: Your 32-character API Key.
    // token: The authentication token received at your callback url as a GET variable.
    // api_sig: Your 32-character API method signature, as explained in Section 6
    var method = 'auth.getSession';
    result = last_call(method, {
        'token': last_response['lt']
    }, true);
}

function last_sign(params) {
    ss = "";
    st = []
    so = {}
    Object.keys(params).forEach(function(key) {
        st.push(key);
    });
    st.sort();
    st.forEach(function(std) {
        ss = ss + std + params[std];
        so[std] = params[std];
    });
    var secret = 'fbfe3fec71f925e72dbeb638c561eab8';
    ss = ss + secret;
    hashed_sec = unescape(encodeURIComponent($.md5(ss)));
    so['api_sig'] = hashed_sec;
    return so;
}