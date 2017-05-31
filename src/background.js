const idClientTwitch = "rpidprrpvo8taysa9yujqu7kcqztwi";
const DEBUG = false;
const TITLE_ONLINE = "Stream - Online";
const TITLE_OFFLINE = "Stream - Offline";
const NOTIFICATION_TITLE = "Twitch : Un live est en cours !";
const YOUTUBE_PROFILE = "https://www.youtube.com/channel/UC8d8zrRsYoHBHMBHnK5GlOQ";
const TWITCH_PROFILE = "https://www.twitch.tv/valryantv";
const TWITCH_ID_CHANNEL = "valryantv";
const DISCORD_LINK = "https://discord.gg/cTzkRWB";

var STREAMER_EXTENSION = {

    init: function(channel_name, replay_url, discord_url)
    {
        STREAMER_EXTENSION._chanel_name = channel_name;
        STREAMER_EXTENSION._replay_url = replay_url;
        STREAMER_EXTENSION._discord_url = discord_url;
        STREAMER_EXTENSION._twitch_url = "https://www.twitch.tv/" + STREAMER_EXTENSION._chanel_name;
        STREAMER_EXTENSION._isON = false;
        STREAMER_EXTENSION._streamData = null;
        STREAMER_EXTENSION._self = this;
    },

    refresh: function()
    {
      STREAMER_EXTENSION.init();  
    },

    sendNotification: function()
    {
        write_d(STREAMER_EXTENSION);
        write_d(STREAMER_EXTENSION._isON);
        if (STREAMER_EXTENSION._isON == false)
        {
            write_d('Trying to send notification when stream is offline');
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
            opt.title = NOTIFICATION_TITLE;
            chrome.notifications.create('notifyON', opt, function(id) {});
            console.log('Notification sent for stream ' + STREAMER_EXTENSION._chanel_name + ' (Title:' + STREAMER_EXTENSION._streamData.stream.channel.status + ', Game:' + STREAMER_EXTENSION._streamData.stream.game + ')');

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
        this.setBrowserIcon("live", TITLE_ONLINE, "icons/logo_on_38.png");
    },

    setBrowserIconOffline: function setBrowserIconOffline()
    {
        this.setBrowserIcon("", TITLE_OFFLINE, "icons/logo_off_38.png");
    },

    request: function()
    {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {

            if (xmlhttp.readyState == xmlhttp.DONE && xmlhttp.status == 200) {

                STREAMER_EXTENSION._streamData = JSON.parse(xmlhttp.responseText);
                write_d(STREAMER_EXTENSION._streamData);
                if (STREAMER_EXTENSION._streamData.stream) {
                    if (!STREAMER_EXTENSION._isON) {
                        STREAMER_EXTENSION._isON = true;
                        write_d("is on is now set to true");
                        STREAMER_EXTENSION.setBrowserIconOnline();
                        STREAMER_EXTENSION.sendNotification();
                    }
                } else {
                    STREAMER_EXTENSION._isON = false;
                    write_d("is on is now set to false");
                    STREAMER_EXTENSION.setBrowserIconOffline();
                }

            }
        };

        xmlhttp.open("GET","https://api.twitch.tv/kraken/streams/" +
            STREAMER_EXTENSION._chanel_name +
            "?client_id=" +
            idClientTwitch, true);
        xmlhttp.send();
    }

}

function write_d(text)
{
    if (DEBUG)
        console.log(text);
}

STREAMER_EXTENSION.init(TWITCH_ID_CHANNEL, YOUTUBE_PROFILE, DISCORD_LINK);
setInterval(function () {
        STREAMER_EXTENSION.request();
    }, 40000);
STREAMER_EXTENSION.request();
