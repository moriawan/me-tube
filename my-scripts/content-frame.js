function setCommonButtonStyle(buttonElem, param) {

    buttonElem.style.backgroundSize = "contain";

    buttonElem.style.position = "absolute";
    buttonElem.style.top = "0px";
    buttonElem.style.left = "50px";

    buttonElem.style.width = "50px";
    buttonElem.style.height = "50px";

    return buttonElem;
}


console.log("in content page");

function replaceIconPath(toReplace, byReplace, str){
    return str.replace(toReplace, chrome.extension.getURL(byReplace));
}

var renderHtml = function() {
    // var fileUrl = chrome.extension.getURL('/my-scripts/inject/metube.html');
    // $.get(chrome.extension.getURL(fileUrl), function(data) {
    //     $(data).appendTo('body');

    // });
    console.log(':render');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('/my-scripts/inject/metube.html'), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            //... The content has been read in xhr.responseText
            // console.log(xhr.responseText);

            var elem = document.createElement("div");
            elem.style.position = 'fixed';
            elem.style.zIndex = '999999';
            elem.style.bottom = '10px';
            elem.style.right = '10px';
            elem.draggable ="true";

            var htmlStr = replaceIconPath("play-back-ico", "icons/prevme.png", xhr.responseText);
            htmlStr = replaceIconPath("play-pause-ico","icons/pauseme.png",htmlStr);
            htmlStr = replaceIconPath("play-forword-ico","icons/nextme.png",htmlStr);

            elem.innerHTML = htmlStr;

            var oldScreenX = 0;
            var oldScreenY = 0;
         
            param = {
                "type": "playerButton",
            }

            var body = document.getElementsByTagName("body")[0];
            body.appendChild(elem);

            elem.addEventListener("dragstart", function(ev){
                
                oldScreenX = ev.screenX
                oldScreenY = ev.screenY;


            }, false );

            elem.addEventListener("dragend", function(ev){
                
                var diffX = oldScreenX - ev.screenX; 
                var diffY = oldScreenY - ev.screenY;

                var currRight = ev.srcElement.style.right.replace("px", "");
                currRight = parseInt(currRight);

                var currBottom = ev.srcElement.style.bottom.replace("px", "");
                currBottom = parseInt(currBottom);

                ev.srcElement.style.right = (diffX + currRight) + "px";
                ev.srcElement.style.bottom = (diffY + currBottom) + "px";

            }, false);

            elem.querySelectorAll(".metube-button").forEach(function(item, index){
                item.addEventListener("click", controllerButton);
            })

            elem.querySelector(".seekbar").addEventListener('mouseup', function(evt){
                // console.log(evt.layerX, evt.offsetX)
                controllerSeek(evt.offsetX);
            })

            elem.querySelector(".seekbar").addEventListener('mouseover', function(){
                elem.querySelector('.seek-done').style.opacity = '0.6';
                elem.querySelector(".title").style.display = 'none';
            })

            elem.querySelector(".seekbar").addEventListener('mouseout', function(){
                elem.querySelector('.seek-done').style.opacity = '0.2';
                elem.querySelector(".title").style.display = 'block';
            })
        }
    };
    xhr.send();


}



var sendResponse = function() {

    return { 'type': 'acknowledge' }
}

var onMessageListener = function(message, sender, sendResponse) {

    var seek = document.querySelector('#metube-control .seek-done');
    var title = document.querySelector('#metube-control .title');

    if (message.type == "propagate") {
        // console.log(message.message)
        var elapsed = message.message.current * 200 / message.message.duration;
        seek.style.width = elapsed + 'px';

        title.innerHTML = message.message.title
    }

}


///////////////////////////////////// run //////////////////////

// pushPlayerController();

function controllerButton() {
    // console.log("hello", this.id)
    request = {
        "type": "playerAction",

    }

    switch (this.id) {
        case "metube-next-button":
            request["message"] = {"command" : "yt-next"};
            break;
        case "metube-prev-button":
            request["message"] ={"command" : "yt-prev"};
            break;
        case "metube-play-button":
            request["message"] = {"command" : "yt-pause-play"};
            break;

    }
    propagateInput(request);
}


function controllerSeek(percent){
    console.log("control seek", percent);
    propagateInput({
        "type": "playerAction",
        "message": {
            "command": "yt-seek",
            "seek_time": percent

        }
    })
}

// seek to {"command" : "yt-seek", "time" : time}

// search + callback {"command" : "yt-search", "query" : query}

function propagateInput(request, callback){
    if(typeof callback === "undefinedd"){
        callback = function(response){
            console.log("input reponse", response);
        }
    }

    chrome.runtime.sendMessage(request, callback);

}


chrome.runtime.onMessage.addListener(onMessageListener);

renderHtml()
