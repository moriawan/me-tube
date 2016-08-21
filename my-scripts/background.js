// ytp-next-button
// ytp-play-button
// ytp-prev-button

//ytp-next-button ytp-button

var dispatchCommand = function(commandObj){

    console.log(commandObj, chrome, chrome.runtime)
    if(chrome && chrome.runtime) {
        chrome.tabs.query({url: "*://www.youtube.com/*"}, function(tabs){
            tabs.forEach(function(tab, index){
                chrome.tabs.sendMessage(tab.id, commandObj, function(){
                    console.log("dispatched ",{"ori gin":"youtube+", "command":commandObj}, "to", tab.title)
                })
            })
        })
    }
}

var propogateState = function(stateObj){
    
    chrome.tabs.query({url: "*://*/*"}, function(tabs){
        tabs.forEach(function(tab, index){
            // console.log(tab, tab.id);

            chrome.tabs.sendMessage(tab.id, stateObj, function(){
                // console.log("dispatched ",{"origin":"youtube+", "command":command}, "to", tab.title)
            })
        })
    })
}

chrome.topSites.get(function(urlList){
    console.log(urlList);
})


chrome.commands.onCommand.addListener(function(command) {

    dispatchCommand({'type':'playerButton', 'command':command})

});




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension", request);
    
    if(!(chrome && chrome.runtime)) {
        console.log("chrome runtime error")
        return;
    }

    if (request.type == "playerButton"){
        dispatchCommand(request.command);
    }
    else if(request.type == "propagate"){
        propogateState(request)
    }

});

// dispatchCommand({'type':'playerButton', 'command':'yt-next'})