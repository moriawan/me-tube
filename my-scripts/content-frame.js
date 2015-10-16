
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


chrome.runtime.onMessage.addListener(onMessageListener);



var sidebarController = function(){

}


sidebarController.prototype.pushCurrent =  function(){

        watchBarContent = document.getElementById("watch7-sidebar-contents");

        watchBarContent.getElementsByTagName("a")

        localArray.pushSidebar( "watchBar", { "watchBar" : watchBarContent.innerHTML, "url" : window.location.href });

        document.getElementById("watch7-sidebar-contents").innerHTML = localArray.getLastLocal( "watchBar" );

}




 var uriChange = function(callBack){

    this.oldHash = window.location.hash;
    this.Check;

    var that = this;
    var detect = function(){
        if(that.oldHash!=window.location.href){
            // alert("HASH CHANGED - new has" + window.location.hash);

            if(typeof callBack === "function")
                callBack();

            that.oldHash = window.location.href;
        }
    }

    this.Check = setInterval(function(){ detect() }, 100);
}


if(window.location.origin.indexOf("youtube") > 0){
    var sc =  new sidebarController();
    var uriChangeObj = new uriChange(sc.pushCurrent());
}


var localArray = {

    "pushLocal" : function(key, obj){

        if(typeof sessionStorage[key] !== "undefined"){
            
            watchBarArray = JSON.parse( sessionStorage[key] );
            watchBarArray.push(JSON.stringify(obj));

            if(watchBarArray instanceof Array && watchBarArray.length > 5 ){
                watchBarArray.shift();
            }
        }
        else {
            watchBarArray = JSON.stringify([obj]);
        }

        sessionStorage[key] = JSON.stringify( watchBarArray );

    }



    getLastLocal : function(key){

        if(typeof sessionStorage[key] !== "undefined"){
            
            watchBarArray = JSON.parse( sessionStorage[key] );

            if(watchBarArray instanceof Array && watchBarArray.length > 1 ){
                
                return watchBarArray[ watchBarArray.length -2 ];
            }
            else return false;

        }
    }

}

