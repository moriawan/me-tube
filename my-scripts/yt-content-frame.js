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


function fromOld(){

    if(sessionStorage["sideBarPage"] !== "undefined" && parseInt(sessionStorage["sideBarPage"]) == 0 ){
        return true;
    }
    else return false;

}

function remove(element) {
    element.parentNode.removeChild(element);
}

// local storage as a dictionary storage //

var localArray = {

    "pushLocal" : function(key, obj){

        if(typeof sessionStorage[key] !== "undefined"){

            sessionArray = JSON.parse( sessionStorage[key] );

            if(sessionArray instanceof Array ){
                
                if(sessionArray.length > 1){

                    if( fromOld() ){
                        sessionArray.pop();
                    }
                    else{
                        sessionArray.shift();
                    }
                }
                
                sessionArray.push(  obj );

            }
            else console.log("failed push into existing");
        }
        else {
            sessionArray = [ obj ] ;
        }

        sessionStorage[key] = JSON.stringify( sessionArray );

    },

    getLocalAt : function(key, index){

        if(typeof sessionStorage[key] !== "undefined"){
            
            sessionArray = JSON.parse( sessionStorage[key] );

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

////

// obseerver factory //
var domObserver = {

    newObserver : function(target, id, params, callback){

        // console.log( "observer", target, id);

        var obs = new MutationObserver(function(mutations, observer) {
            for(var i=0; i<mutations.length; ++i) {
                

                for(var j=0; j<mutations[i].addedNodes.length; ++j) {
                    
                    // console.log( mutations[i].addedNodes[j].id, "added" );
                    // console.log( "compare to ", id );

                    if(typeof mutations[i].addedNodes[j].id !== "undefined"){
                        if(mutations[i].addedNodes[j].id == id ) {
                            
                            // console.log(id + " !!!!! pushed into dom, rejoice !!!!", params.log );

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
////



///////////////////// side bar ///////////////////////////

var sidebarController = function(){
}

sidebarController.prototype.pageChange = function(direction, pages){

    if(direction == "left" && sessionStorage["sideBarPage"] == 1 ){

        sessionStorage["sideBarPage"] = 0;
        document.getElementById("metube-right7").style.display = "block";
        document.getElementById("metube-left7").style.display = "none";
        
        this.resolveCurrent.call(this);

    }
    else if(direction == "right"  && sessionStorage["sideBarPage"] == 0 ){

        sessionStorage["sideBarPage"] = 1;
        document.getElementById("metube-right7").style.display = "none";
        document.getElementById("metube-left7").style.display = "block";

        this.resolveCurrent.call(this);

    }

    console.log(  "page change dir ", direction , "this", this )
}

sidebarController.prototype.sideBarPage = function(){

    if(!("sideBarPage" in sessionStorage)){
        sessionStorage["sideBarPage"] = 0;
    }

    return sessionStorage["sideBarPage"];
}

sidebarController.prototype.resolveCurrent =  function(){
    document.getElementById("watch7-sidebar-modules").innerHTML = decodeURI(localArray.getLocalAt( "watchBar", this.sideBarPage() )["html"]);
}

sidebarController.prototype.pushCurrent =  function(noUI){

    if(typeof noUI === "undefined")
        noUI = false;

    watchBarContent = document.getElementById("watch7-sidebar-modules");

    localArray.pushLocal( "watchBar", { "html" : encodeURI( watchBarContent.innerHTML ), "url" : window.location.href });

    if(fromOld()){
        this.resolveCurrent();
    }

    if( !("sideBarPage" in sessionStorage)){
        sessionStorage["sideBarPage"] = 1;
    }
    

    console.log("sidebarpage", sessionStorage["sideBarPage"])

    if(noUI)
        return;


    for(var i =1; i < 3 ; i++){

        var elem = document.createElement("div");
        
        elem.style.position ="absolute";
        elem.style.zIndex = 100;
        elem.style.height = "98%";
        elem.style.width = "10px";

        elem.style.top = "1%";
        elem.style.backgroundColor = "rgba(123, 199, 0, 0.29)"
        
        if(i==1){

            elem.id = "metube-left7";
            elem.style.left = "-8px";

            if(fromOld()){
                elem.style.display = "none" ;
            }

            elem.addEventListener('click', function(){
               
                console.log("sc page change, left", this.pageChange);
                this.pageChange.call(this, "left");

            }.bind(this), false)
        }
        else{
            elem.id = "metube-right7";
            elem.style.right = "-8px";

            if(!fromOld()){
                elem.style.display = "none" ;
            }
            

            elem.addEventListener('click', function(){

                console.log("sc page change, left", this);
                this.pageChange.call(this, "right");
            
            }.bind(this), false)
        }

        var existElem = document.getElementById(elem.id);

        if(existElem){
            existElem.parentNode.removechild(existElem)
        }

        document.getElementById("watch7-sidebar").appendChild(elem);

    }
}

var bindListners = function(){

    // bind buttons

    document.getElementById("eow-title").addEventListener("click", function(){
        
        sc.pageChange("left");

    }, false );


    document.getElementById("watch8-sentiment-actions").addEventListener("click", function(){
        
        sc.pageChange("right");

    }, false );
}

var afterContainer = function(){

    var params = {
           childList:true, 
           // log:true,
           subtree:true
        }

    var target = document.getElementById("watch7-container")
    var id = "watch7-main-container";

    window.obs = domObserver.newObserver(target, id, params, function(){
        window.sc.pushCurrent.call(sc);
    });

}

///////////////////////////////////

sendMessageToInjected = function(messageObject){
    // var event = document.createEvent('Event');
    // event.initEvent('metubeEvent');
    
    var event = new CustomEvent('metubeEvent', { 'detail': messageObject });
    document.dispatchEvent(event);
}

///////////// run //////////////


console.log("sidebar init");
window.sc =  new sidebarController();

// var uriChangeObj = new uriChange(sc.pushCurrent);
var target = document.getElementsByTagName("body")[0];
var id = "watch7-container";
var params = {
       childList:true, 
       subtree:true,
    }

window.ob = domObserver.newObserver(target, id, params, afterContainer);

sc.pushCurrent.call(sc, true);

// inject communication script
injectScript( chrome.extension.getURL('/my-scripts/inject/command-reader.js'), 'body');
// console.log(chrome.runtime.id, "chrome.runtime.id");


//////////////////// message commands ////////////////////

var sendResponse = function(){

    return {'type':'acknowledge'}
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
                console.log("seeking")
                sendMessageToInjected(request.message)
                break;

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

