
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



var sidebarController = function(){

}


sidebarController.prototype.pageChange = function(direction, pages){

    if(typeof pages === "undefined"){
        
        if(direction == "left"){
            pages = -1;
        }
        else if(direction == "right"){
            pages = 1;
        }
    }

    console.log("pages", pages);

    if(typeof sessionStorage["sideBarPage"] === "undefined"){
        sessionStorage["sideBarPage"] = 0;
    }
    else if(parseInt(sessionStorage["sideBarPage"]) + pages > 0){
        sessionStorage["sideBarPage"] = parseInt(sessionStorage["sideBarPage"]) + pages;
    }
    else {
        sessionStorage["sideBarPage"] = 0;
    }

    console.log( pages, "page change dir ", direction , "this", this )

    this.resolveCurrent().apply(this);

}



sidebarController.prototype.sideBarPage = function(){

    if(typeof sessionStorage["sideBarPage"] === "undefined"){
        sessionStorage["sideBarPage"] = 0;
    }

    return sessionStorage["sideBarPage"];

}


sidebarController.prototype.resolveCurrent =  function(){

    console.log( "changing current watchBar", this.sideBarPage() );

    console.log( localArray.getLocalAt( "watchBar", this.sideBarPage() )["html"] );

    document.getElementById("watch7-sidebar-modules").innerHTML = decodeURI(localArray.getLocalAt( "watchBar", this.sideBarPage() )["html"]);

}


sidebarController.prototype.pushCurrent =  function(){

    console.log("push current");

    watchBarContent = document.getElementById("watch7-sidebar-modules");

    console.log("pushSidebar current", watchBarContent.innerHTML, encodeURI( watchBarContent.innerHTML ) );

    localArray.pushLocal( "watchBar", { "html" : encodeURI( watchBarContent.innerHTML ), "url" : window.location.href });

    // add buttons
    
    if(typeof sessionStorage["sideBarPage"] === "undefined"){
        sessionStorage["sideBarPage"] = 0;
    }
    else sessionStorage["sideBarPage"] = parseInt(sessionStorage["sideBarPage"]) + 1;

    var elem = document.createElement("div");
    elem.id = "metube-left7";

    elem.style.position ="fixed";
    elem.style.height = "50px";
    elem.style.width = "50px";

    elem.style.top = "50px";
    elem.style.right = "50px";

    elem.style.backgroundColor = "red"

    console.log(this, "this from class def")

    elem.addEventListener('click', function(){
       
        console.log("sc page change, left", this);
        this.pageChange("left").apply(this);

    }.bind(this), false)

    body.appendChild(elem);


    // var target = document.getElementsByTagName("body")[0];
    // var id = "eow-title";

    // var ob = domObserver.newObserver(target, id, bindListners);


}




var localArray = {

    "pushLocal" : function(key, obj){

        console.log("pushing into sessionStorage", key, obj);

        if(typeof sessionStorage[key] !== "undefined"){
            

            sessionArray = JSON.parse( sessionStorage[key] );

            if(sessionArray instanceof Array ){
                sessionArray.push(  obj );
                
                if(sessionArray.length > 5)
                    sessionArray.shift();

                console.log("pushed into existing");
            }
            else console.log("failed push into existing");
        }
        else {
            sessionArray = [ obj ] ;
        }

        sessionStorage[key] = JSON.stringify( sessionArray );

    },

    getLocalAt : function(key, index){

        console.log( "retrieve session", key, index );

        if(typeof sessionStorage[key] !== "undefined"){
            
            sessionArray = JSON.parse( sessionStorage[key] );
            // sessionArray = JSON.parse( sessionArray );

            if(sessionArray instanceof Array && sessionArray.length > 1 ){
                
                if(index < 0){
                    index = sessionArray.length + index - 1
                }

                return sessionArray[ index ];
            }
            else return false;

        }
    }

}



var bindListners = function(){


    // bind buttons

    console.log(document.getElementById("eow-title"), document.querySelector('#eow-title'),  "bind to ")

    document.getElementById("eow-title").addEventListener("click", function(){
        
        console.log("sc page change, left");

        sc.pageChange("left");

    }, false );


    document.getElementById("watch8-sentiment-actions").addEventListener("click", function(){
        
        console.log("sc page change right" );

        sc.pageChange("right");

    }, false );

}





var domObserver = {

    newObserver : function(target, id, params, callback){
    
        // have the observer observe foo for changes in children

        console.log( "observer", target, id);

        var obs = new MutationObserver(function(mutations, observer) {
            // look through all mutations that just occured
            for(var i=0; i<mutations.length; ++i) {
                // look through all added nodes of this mutation
                
                // console.log( "mutations", mutations)

                for(var j=0; j<mutations[i].addedNodes.length; ++j) {
                    // was a child added with ID of 'bar'?
                    
                    // console.log( mutations[i].addedNodes[j].id, "added" );
                    // console.log( "compare to ", id );

                    if(typeof mutations[i].addedNodes[j].id !== "undefined"){
                        if(mutations[i].addedNodes[j].id == id ) {
                            
                            console.log(id + " !!!!! pushed into dom, rejoice !!!!", params.log );
                            // console.log(document.getElementById(id).innerHTML);

                            if(typeof callback === "function"){
                                // console.log("callback", callback)
                                callback();
                            }
                        }
                    }
                    else if( mutations[i].target.className !== "ytp-bound-time-right" && mutations[i].target.className !== "ytp-bound-time-left" ){
                        if(typeof params.log !== "undefined" && params.log )
                            console.log("terminated", mutations[i].addedNodes[j], mutations[i].target );


                    }
                }
            }
        });

        obs.observe( target, params);

        return obs;

    }

}

if(window.location.origin.indexOf("youtube") > 0){

    console.log("sidebar init");
    window.sc =  new sidebarController();

    // var uriChangeObj = new uriChange(sc.pushCurrent);


    console.log("DOM change subscribed");

    var target = document.getElementsByTagName("body")[0];
    var id = "watch7-container";
    var params = {
           childList:true, 
           subtree:true,
        }

    window.ob = domObserver.newObserver(target, id, params, afterContainer);

    // sc.pushCurrent().bind(sc);

}


function afterContainer(){
    
    // sc.pushCurrent.bind(sc);
    
    window.ob.disconnect();
    
    // alert();

    var params = {
           childList:true, 
           log:true,
           subtree:true
        }

    var target = document.getElementById("watch7-container")
    var id = "watch7-main-container";

    window.obs = domObserver.newObserver(target, id, params, function(){
        console.log(document.getElementById("watch7-sidebar-modules"));

        window.sc.pushCurrent().bind(sc);
        // alert()
    });

    console.log("new observer bound");


}

//  var uriChange = function(callBack){

//     this.oldHash = window.location.hash;

//     var that = this;
//     var detect = function(){
//         if(that.oldHash!=window.location.href){
//             // alert("HASH CHANGED - new has" + window.location.hash);

//             console.log("uri changed")

//             if(typeof callBack === "function")
//                 callBack();

            

//             that.oldHash = window.location.href;
//         }
//     }

//     this.Check = setInterval(function(){ detect() }, 100);
// }

