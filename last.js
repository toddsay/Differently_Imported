// Last.fm callback function. 
// Triggers background page registration mumbo jumbo which enables all the scrobbly things. 

$(document).ready(function(){
    var bg = chrome.extension.getBackgroundPage();
    var last_token = window.location.href.slice(window.location.href.indexOf('?') + 1).split('=')[1];
    result = bg.last_res(last_token);
    if (result == true){
        $('#success').css({'display':'block'});
    }
    else{
        $('#failretry').css({'display':'block'});
    }
    
});
