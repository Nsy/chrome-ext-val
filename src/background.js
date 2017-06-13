var STREAMER_EXTENSION = {

    init: function()
    {
        this.get_parameters();
        console.log("PARAMETERS:");
        console.log(STREAMER_EXTENSION._parameters);
        STREAMER_EXTENSION._isON = false;
        STREAMER_EXTENSION._streamData = null;
        STREAMER_EXTENSION._self = this;
    },

    refresh: function()
    {
      STREAMER_EXTENSION.init();  
    },

    get_parameters: function()
    {  
        var xhr = new XMLHttpRequest();
		xhr.open('GET', '../parameters.json', false);

		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == xhr.DONE && xhr.status == 200)
			{
				var response = JSON.parse(xhr.responseText);
				STREAMER_EXTENSION._parameters = response;
                console.log("parameters.json loaded");
			}
		}
		xhr.send(); 
    },

    sendNotification: function()
    {
        console.log(STREAMER_EXTENSION);
        console.log(STREAMER_EXTENSION._isON);
        if (STREAMER_EXTENSION._isON == false)
        {
            console.error('Trying to send notification when stream is offline');
            return;
        }
        if (STREAMER_EXTENSION._streamData.stream.channel)
        {
            if (STREAMER_EXTENSION._streamData.stream.channel.game && STREAMER_EXTENSION._streamData.stream.channel.status)
            var opt =
            {
                type: "basic",
                title: "",
                message: "",
                iconUrl: "icons/icon_notification.png",
                isClickable: true
            };
            opt.message = STREAMER_EXTENSION._streamData.stream.channel.status + " - " +  STREAMER_EXTENSION._streamData.stream.channel.game;
            opt.title = STREAMER_EXTENSION._parameters.notification_title;
            chrome.notifications.create('notifyON', opt, function(id) {});
            console.log('Notification sent for stream ' + STREAMER_EXTENSION._parameters.streamer.twitch_id + ' (Title:' + STREAMER_EXTENSION._streamData.stream.channel.status + ', Game:' + STREAMER_EXTENSION._streamData.stream.game + ')');
        }
    },

    setBrowserIcon: function(badge_text, title_hover, img)
    {
        chrome.browserAction.setBadgeText({"text": badge_text});
        chrome.browserAction.setTitle({
            title: title_hover
        });
        chrome.browserAction.setIcon({
            path: img
        });
    },

    setBrowserIconOnline: function setBrowserIconOnline()
    {
        chrome.browserAction.setBadgeBackgroundColor({color: "#07d21f"});
        this.setBrowserIcon("live", STREAMER_EXTENSION._parameters.badge.title_online, "icons/logo_on_38.png");
    },

    setBrowserIconOffline: function setBrowserIconOffline()
    {
        this.setBrowserIcon("", STREAMER_EXTENSION._parameters.badge.title_offline, "icons/logo_off_38.png");
    },

    request: function()
    {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {

            if (xmlhttp.readyState == xmlhttp.DONE && xmlhttp.status == 200) {

                STREAMER_EXTENSION._streamData = JSON.parse(xmlhttp.responseText);
                if (STREAMER_EXTENSION._streamData.stream) {
                    if (!STREAMER_EXTENSION._isON) {
                        STREAMER_EXTENSION._isON = true;
                        console.log("Live is on is now set to true");
                        STREAMER_EXTENSION.setBrowserIconOnline();
                        STREAMER_EXTENSION.sendNotification();
                    }
                } else {
                    STREAMER_EXTENSION._isON = false;
                    console.log("Live is on is now set to false");
                    STREAMER_EXTENSION.setBrowserIconOffline();
                }

            }
        };

        xmlhttp.open("GET", STREAMER_EXTENSION._parameters.api.url +
            STREAMER_EXTENSION._parameters.streamer.twitch_id +
            "?client_id=" +
            STREAMER_EXTENSION._parameters.api.client, true);
        xmlhttp.send();
    }
}

STREAMER_EXTENSION.init();
setInterval(function () {
        STREAMER_EXTENSION.request();
    }, 45000);
STREAMER_EXTENSION.request();
