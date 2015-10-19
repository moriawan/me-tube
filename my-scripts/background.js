// ytp-next-button
// ytp-play-button
// ytp-prev-button

//ytp-next-button ytp-button

var dispatchCommand = function(command){

    if(chrome && chrome.runtime) {

        chrome.tabs.query({url: "*://www.youtube.com/*"}, function(tabs){
            tabs.forEach(function(tab, index){
                console.log(tab, tab.id);

                chrome.tabs.sendMessage(tab.id, command, function(){
                    console.log("dispatched ",{"origin":"youtube+", "command":command}, "to", tab.title)
                })
            })
        })
    }
}


chrome.topSites.get(function(urlList){
    console.log(urlList);
})


chrome.commands.onCommand.addListener(function(command) {

    console.log("command", command);
    dispatchCommand(command)

});




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.type == "playerButton"){
        dispatchCommand(request.command);
    }


  });