

var onMessageListener = function(message, sender, sendResponse) {

	console.log(message);
	
    switch(message) {
        case "yt-next":
        	console.log("next");
            $(".ytp-next-button").trigger("click");
            break;
        case "yt-prev":
            $(".ytp-prev-button").trigger("click");
            break;
        case "yt-pause-play":
            $(".ytp-play-button").trigger("click");
            break;
    }
    return true;
}


chrome.runtime.onMessage.addListener(onMessageListener);
