function audioNotification(){
    var yourSound = new Audio('audio/notification.mp3');
    yourSound.play();
}
chrome.runtime.setUninstallURL('https://rahulkapoor90.github.io/youtube-enhancement-suite/uninstall/');
chrome.runtime.onInstalled.addListener(function(details){
      if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        audioNotification();
        var opt = {
          type: "basic",
          title: "Hello Friend!",
          message: "YouTube™ Enhancement Suite has been updated with new features and bug fixes.",
          iconUrl: chrome.extension.getURL('icons/icon128.png')
        }
            chrome.notifications.create(opt);
    }
});

// For rating preview

// Manual settings
var SHOW_UPDATE_NOTICE = true;
var RESET_PAGE_ICON_ON_UPDATE = false;

// Settings keys
var YTRP_VERSION_KEY = "YTRP_VERSION";
var YTRP_COUNT_KEY = "YTRP_COUNT";
var YTRP_BAR_STYLE_KEY = "YTRP_BAR_STYLE";
var YTRP_BAR_THICKNESS_KEY = "YTRP_BAR_THICKNESS";
var YTRP_HIGHLIGHTED_VIDEOS_KEY = "YTRP_HIGHLIGHTED_VIDEOS";
var YTRP_SHOW_RP_SCORE_KEY = "YTRP_SHOW_RP_SCORE";
var YTRP_BAR_OPACITY_KEY = "YTRP_BAR_OPACITY";
var YTRP_CACHING_KEY = "YTRP_CACHING";
var YTRP_SHOW_PAGE_ICON_KEY = "YTRP_SHOW_PAGE_ICON";


// Default settings
var YTRP_DEFAULT_BAR_STYLE = 1 // Default is 1 (modern) [classic, modern]
var YTRP_DEFAULT_BAR_THICKNESS = 6; // Default is 6
var YTRP_DEFAULT_HIGHLIGHTED_VIDEOS = 0; // Default is 0
var YTRP_DEFAULT_SHOW_RP_SCORE = false; // Default is false
var YTRP_DEFAULT_BAR_OPACITY = 8; // Default is 8 (opaque) [invisible, 20%, 40%, 50%, 60%, 70%, 80%, 90%, opaque]
var YTRP_DEFAULT_CACHING = 3; // Default is 3 (1h) [disabled, 5m, 30m, 1h, 2h, 6h, 12h, 24h]
var YTRP_DEFAULT_SHOW_PAGE_ICON = true; // Default is true

// YouTube API configuration
var YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST = 50; // API maximum is 50
var YOUTUBE_API_DEVELOPER_KEY = "AIzaSyA7uFOAS5kq4So-6tZ67uCXPbFuKA6OMDY"; // RPYT Chrome key

// Configure basic settings
if (localStorage[YTRP_BAR_STYLE_KEY] == undefined)
{
	localStorage[YTRP_BAR_STYLE_KEY] = YTRP_DEFAULT_BAR_STYLE;
}
if (localStorage[YTRP_BAR_THICKNESS_KEY] == undefined)
{
	localStorage[YTRP_BAR_THICKNESS_KEY] = YTRP_DEFAULT_BAR_THICKNESS;
}
if (localStorage[YTRP_HIGHLIGHTED_VIDEOS_KEY] == undefined)
{
	localStorage[YTRP_HIGHLIGHTED_VIDEOS_KEY] = YTRP_DEFAULT_HIGHLIGHTED_VIDEOS;
}
if (localStorage[YTRP_SHOW_RP_SCORE_KEY] == undefined)
{
	localStorage[YTRP_SHOW_RP_SCORE_KEY] = YTRP_DEFAULT_SHOW_RP_SCORE;
}
if (localStorage[YTRP_BAR_OPACITY_KEY] == undefined)
{
	localStorage[YTRP_BAR_OPACITY_KEY] = YTRP_DEFAULT_BAR_OPACITY;
}

// Configure cache
var YTRP_CACHE_ENABLE; // True or false
var YTRP_CACHE_EXPIRATION; // In milliseconds
if (localStorage[YTRP_CACHING_KEY] == undefined)
{
	localStorage[YTRP_CACHING_KEY] = YTRP_DEFAULT_CACHING;
}
configureCache();

// Configure page icon
var YTRP_SHOW_PAGE_ICON; // True or false
if (localStorage[YTRP_SHOW_PAGE_ICON_KEY] == undefined)
{
	localStorage[YTRP_SHOW_PAGE_ICON_KEY] = YTRP_DEFAULT_SHOW_PAGE_ICON;
}
configurePageIcon();

// Set up context menus
chrome.contextMenus.create(
{
	title: "Ratings Preview settings",
	onclick: function (info, tabs)
	{
		chrome.tabs.create({url:chrome.extension.getURL("popup.html")});
	},
	documentUrlPatterns: [ "*://*.youtube.com/*" ]
});

// Check count and new version
var version = chrome.app.getDetails().version;
if (localStorage[YTRP_COUNT_KEY] == undefined)
{
	localStorage[YTRP_COUNT_KEY] = 0;
}
if (localStorage[YTRP_VERSION_KEY] == undefined)
{
	// First install, don't bother the user
	localStorage[YTRP_VERSION_KEY] = version;
}
else if (localStorage[YTRP_VERSION_KEY] != version)
{
	// Update, show update successful page and check if we should reset the page icon
	localStorage[YTRP_VERSION_KEY] = version;
	if (SHOW_UPDATE_NOTICE)
	{
	}
	if (RESET_PAGE_ICON_ON_UPDATE)
	{
		localStorage[YTRP_SHOW_PAGE_ICON_KEY] = YTRP_DEFAULT_SHOW_PAGE_ICON;
		configurePageIcon();
	}
}

// Hashtable holding for every video id, an array of: views [0], likes [1], dislikes [2], and retrieval time [3]
var cacheVideoHashtable = {};
// Hashtable holding for every invalid video id, the retrieval time
var cacheInvalidVideoHashtable = {};

// Wire up the listener of the messages so that we can receive them from the scripts
chrome.runtime.onMessage.addListener(onMessage);

// Handles data sent via chrome.runtime.sendMessage()
function onMessage(messageEvent, sender, callback)
{
	switch (messageEvent.name)
	{
	case "injectionDone":
	{
		if (YTRP_SHOW_PAGE_ICON)
		{
			chrome.pageAction.setIcon({tabId:sender.tab.id, path:{"19":"favicon19gray.png", "38":"favicon38gray.png"}});
			chrome.pageAction.show(sender.tab.id);
		}
		else
		{
			chrome.pageAction.hide(sender.tab.id);
		}
		break;
	}
	case "getStylesheet":
	{
		var stylesheet = chrome.extension.getURL("style.css");
		callback(stylesheet);
		break;
	}
	case "getVideosData":
	{
		fetchVideosData(messageEvent.message, callback);
		return true; // Keep async callback valid (see docs: http://developer.chrome.com/extensions/extension.html#event-onMessage)
		break;
	}
	case "wasSuccessful":
	{
		if (YTRP_SHOW_PAGE_ICON)
		{
			chrome.pageAction.setIcon({tabId:sender.tab.id, path:{"19":"favicon19.png", "38":"favicon38.png"}});
			chrome.pageAction.show(sender.tab.id);
		}
		else
		{
			chrome.pageAction.hide(sender.tab.id);
		}
		break;
	}
	case "clickedWebsiteLink":
	{
		chrome.tabs.create({url:"https://rahulkapoor90.github.io"});
		break;
	}
	case "storage_set_style":
	{
		localStorage[YTRP_BAR_STYLE_KEY] = messageEvent.message;
		break;
	}
	case "storage_set_thickness":
	{
		localStorage[YTRP_BAR_THICKNESS_KEY] = messageEvent.message;
		break;
	}
	case "storage_set_highlighted":
	{
		localStorage[YTRP_HIGHLIGHTED_VIDEOS_KEY] = messageEvent.message;
		break;
	}
	case "storage_set_showrpscore":
	{
		localStorage[YTRP_SHOW_RP_SCORE_KEY] = messageEvent.message;
		break;
	}
	case "storage_set_opacity":
	{
		localStorage[YTRP_BAR_OPACITY_KEY] = messageEvent.message;
		break;
	}
	case "storage_set_caching":
	{
		localStorage[YTRP_CACHING_KEY] = messageEvent.message;
		configureCache();
		break;
	}
	case "storage_set_showpageicon":
	{
		localStorage[YTRP_SHOW_PAGE_ICON_KEY] = messageEvent.message;
		configurePageIcon();
		break;
	}
	case "storage_get_style":
	{
		callback(localStorage[YTRP_BAR_STYLE_KEY]);
		break;
	}
	case "storage_get_thickness":
	{
		callback(localStorage[YTRP_BAR_THICKNESS_KEY]);
		break;
	}
	case "storage_get_highlighted":
	{
		callback(localStorage[YTRP_HIGHLIGHTED_VIDEOS_KEY]);
		break;
	}
	case "storage_get_showrpscore":
	{
		callback(localStorage[YTRP_SHOW_RP_SCORE_KEY]);
		break;
	}
	case "storage_get_opacity":
	{
		callback(localStorage[YTRP_BAR_OPACITY_KEY]);
		break;
	}
	case "storage_get_caching":
	{
		callback(localStorage[YTRP_CACHING_KEY]);
		break;
	}
	case "storage_get_showpageicon":
	{
		callback(localStorage[YTRP_SHOW_PAGE_ICON_KEY]);
		break;
	}
	}
}

// Sets YTRP_CACHE_ENABLE and YTRP_CACHE_EXPIRATION value according to localStorage[YTRP_CACHING_KEY]
function configureCache()
{
	YTRP_CACHE_ENABLE = localStorage[YTRP_CACHING_KEY] > 0;
	YTRP_CACHE_EXPIRATION = 0;
	if (localStorage[YTRP_CACHING_KEY] == 1)
	{
		YTRP_CACHE_EXPIRATION = 5 * 60 * 1000;
	}
	else if (localStorage[YTRP_CACHING_KEY] == 2)
	{
		YTRP_CACHE_EXPIRATION = 30 * 60 * 1000;
	}
	else if (localStorage[YTRP_CACHING_KEY] == 3)
	{
		YTRP_CACHE_EXPIRATION = 60 * 60 * 1000;
	}
	else if (localStorage[YTRP_CACHING_KEY] == 4)
	{
		YTRP_CACHE_EXPIRATION = 2 * 60 * 60 * 1000;
	}
	else if (localStorage[YTRP_CACHING_KEY] == 5)
	{
		YTRP_CACHE_EXPIRATION = 6 * 60 * 60 * 1000;
	}
	else if (localStorage[YTRP_CACHING_KEY] == 6)
	{
		YTRP_CACHE_EXPIRATION = 12 * 60 * 60 * 1000;
	}
	else if (localStorage[YTRP_CACHING_KEY] == 7)
	{
		YTRP_CACHE_EXPIRATION = 24 * 60 * 60 * 1000;
	}
}

// Sets YTRP_SHOW_PAGE_ICON value according to localStorage[YTRP_SHOW_PAGE_ICON_KEY]
function configurePageIcon()
{
	if (String(localStorage[YTRP_SHOW_PAGE_ICON_KEY]) == "false")
	{
		YTRP_SHOW_PAGE_ICON = false;
	}
	else
	{
		YTRP_SHOW_PAGE_ICON = true;
	}
}

// Fetches the data of the videos in the videoIds array
function fetchVideosData(videoIds, callback)
{
	// Return hashtable holding for every video id, an array of: views [0], likes [1], and dislikes [2]
	var videoHashtable = {};

	// If the cache is enabled
	if (YTRP_CACHE_ENABLE)
	{
		// Clear the expired cache
		var time = (new Date()).getTime();
		for (var id in cacheVideoHashtable)
		{
			if (time - cacheVideoHashtable[id][3] > YTRP_CACHE_EXPIRATION)
			{
				delete cacheVideoHashtable[id];
			}
		}
		for (var id in cacheInvalidVideoHashtable)
		{
			if (time - cacheInvalidVideoHashtable[id][3] > YTRP_CACHE_EXPIRATION)
			{
				delete cacheInvalidVideoHashtable[id];
			}
		}

		// Check if the videos are already cached and in that case move them to the result hashtable directly
		for (var i = videoIds.length - 1; i >= 0; i--)
		{
			if (videoIds[i] in cacheVideoHashtable)
			{
				videoHashtable[videoIds[i]] = [cacheVideoHashtable[videoIds[i]][0], cacheVideoHashtable[videoIds[i]][1], cacheVideoHashtable[videoIds[i]][2]];
				videoIds.splice(i, 1);
			}
			else if (videoIds[i] in cacheInvalidVideoHashtable)
			{
				videoIds.splice(i, 1);
			}
		}
	}

	// Check how many requests we have to do depending of YouTube API maximum
	var requestCount = Math.ceil(videoIds.length / YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST);
	var responseCount = 0;

	// If there are no videos to be requested (can happen if all of them are cached), count and callback
	if (videoIds.length == 0)
	{
		localStorage[YTRP_COUNT_KEY] = parseInt(localStorage[YTRP_COUNT_KEY]) + Object.keys(videoHashtable).length;
		callback(videoHashtable);
	}

	// While there are remaining videos to request
	while (videoIds.length > 0)
	{
		// Divide requests in blocks of YouTube API maximum
		var videoIdsBlock = videoIds.splice(0, YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST);

		//DEBUG
		//console.log(videoIdsBlock);

		// Compose GET request
		var url = "https://www.googleapis.com/youtube/v3/videos?id=";
		for (var i = 0; i < videoIdsBlock.length; i++)
		{
			url += videoIdsBlock[i];
			if (i + 1 < videoIdsBlock.length)
			{
				url += ",";
			}
		}
		url += "&part=statistics&key=" + YOUTUBE_API_DEVELOPER_KEY;

		// Prepare GET request
		var req = new XMLHttpRequest();
		req.open("GET", url); // Async request

		// Prepare variable data needed in the callback
		req.videoIdsBlock = videoIdsBlock;

		// Register GET request callback
		req.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//DEBUG
				//console.log(this.responseText.length);

				// Response succesfully received, count and add videos info to the hashtable
				responseCount++;
				processVideosData(this.responseText, videoHashtable, this.videoIdsBlock);

				//DEBUG
				//console.log(JSON.stringify(videoHashtable));

				// If it is the last expected response, count and callback
				if (responseCount == requestCount)
				{
					localStorage[YTRP_COUNT_KEY] = parseInt(localStorage[YTRP_COUNT_KEY]) + Object.keys(videoHashtable).length;
					callback(videoHashtable);
				}
			}
		};

		// Send GET request
		req.send();
	}
}

// Adds the videos info in jsonString to the given video hashtable, updating the cache accordingly taking into account the related videoIdsBlock
function processVideosData(jsonString, hashtable, videoIdsBlock)
{
	// Current time used for caching
	var time = (new Date()).getTime();
	// Flag indicating if at least one valid video was cached
	var validVideosCached = false;

	// Get all items (1 per video)
	var items = JSON.parse(jsonString).items;

	// For each item, get the views, likes and dislikes
	var id;
	var views;
	var likes;
	var dislikes;
	for (var i = 0; i < items.length; i++)
	{
		try
		{
			id = items[i].id;
			views = parseInt(items[i].statistics.viewCount);
			likes = parseInt(items[i].statistics.likeCount);
			dislikes = parseInt(items[i].statistics.dislikeCount);
			hashtable[id] = [views, likes, dislikes];

			// If the cache is enabled, cache valid video
			if (YTRP_CACHE_ENABLE)
			{
				cacheVideoHashtable[id] = [views, likes, dislikes, time];
				validVideosCached = true;
			}
		}
		catch (err)
		{
			// Incorrect entries will not be on the return hashtable, client must check ids
		}
	}

	// If valid videos were cached, find and cache invalid videos
	if (validVideosCached)
	{
		for (var i = 0; i < videoIdsBlock.length; i++)
		{
			var videoId = videoIdsBlock[i];
			if (!(videoId in hashtable))
			{
				cacheInvalidVideoHashtable[videoId] = time;
			}
		}
	}

	//DEBUG
	//var textContent = jsonString;
	//console.log(Object.keys(hashtable).length + " items: " + textContent);
	//if (textContent.indexOf("Quota exceeded") != -1 && textContent.indexOf("too_many_recent_calls") != -1)
	//{
		//console.log("quota exceeded");
	//}

	//DEBUG
	//console.log(Object.keys(cacheVideoHashtable).length + "---" + JSON.stringify(cacheVideoHashtable));
}
