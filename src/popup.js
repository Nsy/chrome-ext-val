function getE(id) { return  document.getElementById(id); }

function buildPopup()
{
	var bg = chrome.extension.getBackgroundPage();
	var STREAMER_EXTENSION = bg.STREAMER_EXTENSION;
	var liveStatus = getE("live-status");
	var footer = getE('footer');
	
	getE("twitch-rs").href = STREAMER_EXTENSION._twitch_url;
	getE("youtube-rs").href = STREAMER_EXTENSION._replay_url;
	getE("discord-rs").href = STREAMER_EXTENSION._discord_url;

	if (bg.STREAMER_EXTENSION._isON == true)
	{
		var isOnDiv = getE("online");
		var img = getE("live-image-preview");
		var title = getE("live-title");
		var game = getE("live-game");

		getE("play-link").href = STREAMER_EXTENSION._twitch_url;

		liveStatus.classList.add("label-success");
		liveStatus.textContent = "online"
		isOnDiv.style.visibility = "visible";
		isOnDiv.style.display = "block";
		img.src = STREAMER_EXTENSION._streamData.stream.preview.medium;
		title.textContent = STREAMER_EXTENSION._streamData.stream.channel.status;
		game.textContent = STREAMER_EXTENSION._streamData.stream.game;
	}
	else
	{
		liveStatus.classList.add("label-danger");
		liveStatus.textContent = "offline"
	}

}

document.addEventListener('DOMContentLoaded', function()
{
	buildPopup();
});