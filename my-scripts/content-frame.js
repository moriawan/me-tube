
function pushController(){
    
    return;

    var elem = document.createElement("div");
    elem.className = "metube-control";

    elem.style.position = "fixed";
    elem.style.width = "500px";
    elem.style.height = "50px";
    elem.style.backgroundColor = "rgba(0, 0, 0, 0.61)";
    elem.style.bottom = "20px";
    elem.style.left = "20px";
    elem.style.borderRadius= "10px";
                
    
    var playButt = document.createElement("div");
    playButt.className = "metube-play-button"

    playButt.style.backgroundImage = "url('../icons/play.png')";
    playButt.style.position = "absolute";

    var pauseButt = document.createElement("div");

    pauseButt.className = "metube-pause-button"


    pauseButt.style.backgroundImage = "url('../icons/play.png')"
    pauseButt.style.position = "absolute";

    elem.appendChild(playButt);
    elem.appendChild(pauseButt);


    var body = document.getElementsByTagName("body")[0];

    body.appendChild(elem);

    console.log(elem);

}



// $("#watch7-sidebar-contents")


function simulateClick(el) {
    var evt;
    if (document.createEvent) {
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    (evt) ? el.dispatchEvent(evt) : (el.click && el.click());
}


var onMessageListener = function(message, sender, sendResponse) {

	console.log(message, "atleast show thiss");
	
    // return;

    switch(message) {
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
    }

    simulateClick(el);

    return true;
}


pushController();

chrome.runtime.onMessage.addListener(onMessageListener);

