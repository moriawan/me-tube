// The ID of the extension we want to talk to.
var metubeExtensionId = "abcdefghijklmnoabcdefhijklmnoabc";

console.log("injected script", yt);

onPlayerStateChange = function (state) {
    sendMessageToMetube({type:"stateChange", message: {newState:state}});
};


sendMessageToMetube = function(messageObject){
	var event = new CustomEvent('injectedEvent', { 'detail': messageObject });
	document.dispatchEvent(event);
}

function dispatchCustomEvent(doc) {
  
}


playerRef = yt.player.getPlayerByElement("player-api");

playerRef.addEventListener("onStateChange", "onPlayerStateChange");

var playerStatePropagate = setInterval(function() {
	if (playerRef.isReady()) {

		data = {
			type:"propagate", 
			message: {
				duration: playerRef.getDuration(),
				current: playerRef.getCurrentTime(),
				title: playerRef.getCurrentVideoConfig().args.title,
				thumbnailUrl: playerRef.getCurrentVideoConfig().args.thumbnail_url,
				avgRating: playerRef.getCurrentVideoConfig().args.avg_rating,
				buffered: playerRef.getProgressState().loaded,
				state : playerRef.getPlayerState()
			}
		}

		sendMessageToMetube(data)
		// clearInterval(playerStatePropagate);
	}
}, 1000);


// metubeEvent


document.addEventListener("metubeEvent", function(message) {
    console.log("message recieved from extension", message)

    if(message.type == "metubeEvent"){
	    switch(message.detail.command){
	        case "pause":
	            break;
	        case "play":
	            break;
	        case "yt-seek":
		        console.log("seek request", message.detail.time);
		        playerRef.seekTo(message.detail.time);
	            break;
	        case "change":
	            break;
	        case "cue":
	            break;

	    }
    }
});

