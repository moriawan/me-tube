
function simulateClick(el) {
    var evt;

    if(typeof el === "undefined")
        el = document.getElementById(elId);

    if (document.createEvent) {
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    (evt) ? el.dispatchEvent(evt) : (el.click && el.click());
}



var onMessageListener = function(message, sender, sendResponse) {

	console.log(message);
	
    switch(message) {
        case "yt-next":
        	console.log("next");
            el = document.getElementsByClassName("ytp-next-button")[0]
            break;
        case "yt-prev":
            console.log("prev");
            el = document.getElementsByClassName("ytp-prev-button")[0]
            break;
        case "yt-pause-play":
            console.log("play/pause");
            el = document.getElementsByClassName("ytp-play-button")[0]
            break;
    }
    return true;
}


chrome.runtime.onMessage.addListener(onMessageListener);
