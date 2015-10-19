
function setCommonButtonStyle(buttonElem, param){

    buttonElem.style.backgroundSize = "contain";

    buttonElem.style.position = "absolute";
    buttonElem.style.top = "0px";
    buttonElem.style.left = "50px";

    buttonElem.style.width = "50px";
    buttonElem.style.height = "50px";
    
    return buttonElem;
}


function pushPlayerController(){

    var elem = document.createElement("div");
    elem.className = "metube-control";

    elem.style.position = "fixed";
    elem.style.width = "500px";
    elem.style.height = "50px";
    elem.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    elem.style.bottom = "20px";
    elem.style.left = "20px";
    elem.style.borderRadius= "10px";
            


            
    var playButt = document.createElement("div");
    playButt.className = "metube-play-button";

    setCommonButtonStyle(playButt);

    playButt.style.backgroundImage = "url('" + chrome.extension.getURL('../icons/play.png') + "')";
    playButt.style.opacity = "0.85"

    

    var pauseButt = document.createElement("div");
    pauseButt.className = "metube-pause-button";

    setCommonButtonStyle(pauseButt);
   
    pauseButt.style.backgroundImage = "url('" + chrome.extension.getURL('../icons/pause.png') + "')";
    pauseButt.style.opacity = "0.75"
    pauseButt.style.display = "none";


    

    var nextButt = document.createElement("div");
    nextButt.className = "metube-pause-button";

    setCommonButtonStyle(nextButt);
   
    nextButt.style.backgroundImage = "url('" + chrome.extension.getURL('../icons/next.png') + "')";
    nextButt.style.opacity = "0.9"
    nextButt.style.left = "100px";
    // nextButt.style.display = "none";



    var prevButt = document.createElement("div");
    prevButt.className = "metube-pause-button";

    setCommonButtonStyle(prevButt);
   
    prevButt.style.backgroundImage = "url('" + chrome.extension.getURL('../icons/prev.png') + "')";
    prevButt.style.opacity = "0.9"
    prevButt.style.left = "0px";
    // prevButt.style.display = "none";




    elem.appendChild(playButt);
    elem.appendChild(pauseButt);
    elem.appendChild(nextButt);
    elem.appendChild(prevButt);


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


///// auxillary functions /////

function fromOld(){

    if(sessionStorage["sideBarPage"] !== "undefined" && parseInt(sessionStorage["sideBarPage"]) == 0 ){
        return true;
    }
    else return false;

}

function remove(element) {
    element.parentNode.removeChild(element);
}

//////////////////////////////

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

    // console.log( "changing current watchBar", this.sideBarPage() );

    // console.log( localArray.getLocalAt( "watchBar", this.sideBarPage() )["html"] );

    document.getElementById("watch7-sidebar-modules").innerHTML = decodeURI(localArray.getLocalAt( "watchBar", this.sideBarPage() )["html"]);

}


sidebarController.prototype.pushCurrent =  function(noUI){

    if(typeof noUI === "undefined")
        noUI = false;

    console.log("push current");

    // watchBarContent = { innerHTML : ' +sessionStorage["sideBarPage"]' + sessionStorage["sideBarPage"] }
    watchBarContent = document.getElementById("watch7-sidebar-modules");

    // console.log("pushSidebar current", watchBarContent.innerHTML, encodeURI( watchBarContent.innerHTML ) );

    localArray.pushLocal( "watchBar", { "html" : encodeURI( watchBarContent.innerHTML ), "url" : window.location.href });

    // add buttons

    if(fromOld()){
        alert("from old reject change");
        this.resolveCurrent();
    }

    if( !("sideBarPage" in sessionStorage)){
        sessionStorage["sideBarPage"] = 1;
    }
    

    console.log("sidebarpage", sessionStorage["sideBarPage"])

    if(noUI)
        return;


    for(var i =1; i < 3 ; i++){
   
    // position: absolute;
    // z-index: 100;
    // height: 98%;
    // width: 10px;
    // top: 1%;
    // left: -8px;
    // display: block;
    // background-color: rgba(230, 33, 23, 0.54902);


        var elem = document.createElement("div");
        
        elem.style.position ="absolute";
        elem.style.zIndex = 100;
        elem.style.height = "98%";
        elem.style.width = "10px";

        elem.style.top = "1%";
        elem.style.backgroundColor = "rgba(230, 33, 23, 0.54902)"
        
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
        
        // console.log("control pushed", elem)

        var existElem = document.getElementById(elem.id);

        if(existElem){
            existElem.parentNode.removechild(existElem)
        }

        document.getElementById("watch7-sidebar").appendChild(elem);

    }


    
}




var localArray = {

    "pushLocal" : function(key, obj){

        // console.log("pushing into sessionStorage", key, obj);

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
                console.log("pushed into existing");

            }
            else console.log("failed push into existing");
        }
        else {
            sessionArray = [ obj ] ;
            console.log("content new sessionArray ", sessionArray);
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
    

        console.log( "observer", target, id);

        var obs = new MutationObserver(function(mutations, observer) {
            for(var i=0; i<mutations.length; ++i) {
                

                for(var j=0; j<mutations[i].addedNodes.length; ++j) {
                    
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








///////////////////////////////////// run //////////////////////





pushPlayerController();

chrome.runtime.onMessage.addListener(onMessageListener);

var afterContainer = function(){
    
    var params = {
           childList:true, 
           // log:true,
           subtree:true
        }

    var target = document.getElementById("watch7-container")
    var id = "watch7-main-container";

    window.obs = domObserver.newObserver(target, id, params, function(){
        console.log(document.getElementById("watch7-sidebar-modules"));

        window.sc.pushCurrent.call(sc);
        // alert()
    });

    console.log("new observer bound");


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

    sc.pushCurrent.call(sc, true);

}

