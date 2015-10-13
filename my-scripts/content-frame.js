
function simulateClick(el) {
    var evt;
    if (document.createEvent) {
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    (evt) ? el.dispatchEvent(evt) : (el.click && el.click());
}

// var foo = document.getElementById("hey");

// foo.onclick = function () {alert("bar");}

// simulateClick("hey");


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


chrome.runtime.onMessage.addListener(onMessageListener);

