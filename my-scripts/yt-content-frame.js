///// auxillary functions and factories /////

function simulateClick(el) {
    var evt;

    if (document.createEvent) {
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    (evt) ? el.dispatchEvent(evt) : (el.click && el.click());
}


function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}


sendMessageToInjected = function(messageObject){
    var event = new CustomEvent('metubeEvent', { 'detail': messageObject });
    document.dispatchEvent(event);
}


//////////////////// message commands ////////////////////

var sendResponse = function(){

    return {'type':'acknowledge'};
}

var onMessageListener = function(request, sender, sendResponse) {

    if(request.type == "playerAction"){

        console.log(request, "do this action");

        switch(request.message.command) {
            case "yt-next":
                var el = document.getElementsByClassName("ytp-next-button")[0];
                break;
            case "yt-prev":
                var el = document.getElementsByClassName("ytp-prev-button")[0];
                if(el.style.display == "none"){

                    var prev = history.state["spf-referer"];

                    if(prev.indexOf("youtube.com") > 0)
                        window.history.back();
                }
                break;
            case "yt-pause-play":
                var el = document.getElementsByClassName("ytp-play-button")[0];
                break;
            case "yt-seek":
                console.log("seeking content frame", request)
                sendMessageToInjected(request.message)
                return;

        }

        console.log("el", el)

        simulateClick(el);
    }

    return true;
}

chrome.runtime.onMessage.addListener(onMessageListener);

//////////////////////////////////////////////////////////

document.addEventListener("injectedEvent", function(message) {

    switch(message.detail.type){
        case "propagate":
            // console.log("propogate metubeEvent", message.detail.message);
            break;
        case "stateChange":
            break;
        case "metube-pause-button":
            break;
        case "metube-play-button":
            break;

    }
    
    chrome.runtime.sendMessage(message.detail, function(response) {
        // console.log("send to background", response);
    });

});


///////////// run //////////////

// inject communication script
injectScript( chrome.extension.getURL('/my-scripts/inject/command-reader.js'), 'body');
// console.log(chrome.runtime.id, "chrome.runtime.id");
