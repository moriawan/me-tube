
var dispatchCommand = function(request){

    chrome.tabs.query({url: "*://www.youtube.com/*"}, function(tabs){
        tabs.forEach(function(tab, index){
            chrome.tabs.sendMessage(tab.id, request, function(){
                console.log("dispatched ",{"ori gin":"youtube+", "command":request}, "to", tab.title)
            })
        })
    })
}

var propogateState = function(request){
    
    chrome.tabs.query({url: "*://*/*"}, function(tabs){
        tabs.forEach(function(tab, index){
            chrome.tabs.sendMessage(tab.id, request, function(){
                // console.log("dispatched ",{"origin":"youtube+", "command":command}, "to", tab.title)
            })
        })
    })
}

chrome.topSites.get(function(urlList){
    console.log(urlList);
})


chrome.commands.onCommand.addListener(function(command) {

    dispatchCommand({
        'type':'playerAction',
        'message' : {
            'command':command
            }
        });

});




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension", request);
    
    if(!(chrome && chrome.runtime)) {
        console.log("chrome runtime error")
        return;
    }

    if (request.type == "playerAction"){
        dispatchCommand(request);
    }
    else if(request.type == "propagate"){
        propogateState(request)
    }

});

// dispatchCommand({'type':'playerAction', 'command':'yt-next'})