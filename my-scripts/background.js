// ytp-next-button
// ytp-play-button
// ytp-prev-button

//ytp-next-button ytp-button

chrome.topSites.get(function(urlList){
    console.log(urlList);
})


chrome.commands.onCommand.addListener(function(command) {

    console.log("command", command);

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

});

