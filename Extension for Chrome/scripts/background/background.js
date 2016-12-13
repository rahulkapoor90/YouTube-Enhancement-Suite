function audioNotification(){
    var yourSound = new Audio('audio/notification.mp3');
    yourSound.play();
}
chrome.runtime.setUninstallURL('https://rahulkapoor90.github.io/vitacademics-enhancement-suite/uninstall/');
chrome.runtime.onInstalled.addListener(function(details){
      if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        audioNotification();
        var opt = {
          type: "basic",
          title: "Hello Friend!",
          message: "YouTube Enhancement Suite has been updated with new features and bug fixes.",
          iconUrl: chrome.extension.getURL('icons/icon128.png')
        }
            chrome.notifications.create(opt);
    }
});

document.addEventListener('DOMContentLoaded', function () {
		 chrome.storage.local.get("message", function(result)
    {
        if(result.message == null)
        {
            chrome.storage.local.set({"message": "ligado"});
        }
        else if (result.message == "desligado") {
			chrome.storage.local.set({"message": "ligado"});
        }
        else {
            chrome.storage.local.set({"message": "ligado"});
        }

        chrome.storage.set({"message": result.message});
    });
});



chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.greeting == "ligado")
	    	ligado_msg();

		if (request.greeting == "desligado")
	 		desligado_msg();

		if (request.greeting == "mute")
	 		mute();

		if (request.greeting == "unmute")
	 		unmute();
 });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.method == "getLocalStorage")
          sendResponse({data: localStorage[request.key]});
        else
          sendResponse({}); // snub them.
});


// Alertas

// VIMEO

//var tabUpdated = false;
//chrome.tabs.onUpdated.addListener(function (tabId, change, tab){
//	alert(tabUpdated)
//    if (!tabUpdated) {
//	if(tab.url == undefined){
//        return;
//    }
//    else if(tab.url.match(/https:\/\/vimeo\.com\/*/) == null){
//    }
//    else{
//        vimeo();
//		audioElement5.play();
//		 setTimeout(
//		 function somBeep1() {
//        	audioElement5.pause();
//			audioElement5.currentTime = 0;
//		},3000);
//        tabUpdated = true;
//	    localStorage.setItem(tabUpdated, true);
//		alert(tabUpdated)
//    }
//	}
//});


// DEPOIS DE INSTALAR

chrome.runtime.onInstalled.addListener(function() {
	show();
	//audioElement3.play();
//	 setTimeout(
//	 function somStart() {
//        	audioElement3.pause();
//			audioElement3.currentTime = 0;
//	},5000);
//	chrome.tabs.create({
//   		url : "http://www.mini.com.br"
//  	});
});


var audioElement3;
        audioElement3 = new Audio("");
        audioElement3.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        document.body.appendChild(audioElement3);
       // audioElement3.src = chrome.extension.getURL("sons/START.mp3");
        audioElement3.id = "audioElement3";
        audioElement3.addEventListener('canplaythrough3', function() {
            audioElement3.stop();
        }, false);

        audioElement3.onerror = function(event) {
           console.log(event.code);
}

var audioElement4;
        audioElement4 = new Audio("");
        audioElement4.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        document.body.appendChild(audioElement4);
       // audioElement4.src = chrome.extension.getURL("sons/HORN.mp3");
        audioElement4.id = "audioElement4";
        audioElement4.addEventListener('canplaythrough4', function() {
            audioElement4.stop();
        }, false);

        audioElement4.onerror = function(event) {
           console.log(event.code);
}

var audioElement5;
        audioElement5 = new Audio("");
        audioElement5.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        document.body.appendChild(audioElement5);
      //  audioElement5.src = chrome.extension.getURL("sons/BEEP_01.mp3");
        audioElement5.id = "audioElement5";
        audioElement5.addEventListener('canplaythrough5', function() {
            audioElement5.stop();
        }, false);

        audioElement5.onerror = function(event) {
           console.log(event.code);
}

var audioElement6;
        audioElement6 = new Audio("");
        audioElement6.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        document.body.appendChild(audioElement6);
       // audioElement6.src = chrome.extension.getURL("sons/BEEP_02.mp3");
        audioElement6.id = "audioElement6";
        audioElement6.addEventListener('canplaythrough6', function() {
            audioElement6.stop();
        }, false);

        audioElement6.onerror = function(event) {
           console.log(event.code);
}

var audioElement7;
audioElement7 = new Audio("");
audioElement7.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

document.body.appendChild(audioElement7);
//audioElement7.src = chrome.extension.getURL("sons/BEEP_01.mp3");
audioElement7.id = "audioElement7";
audioElement7.addEventListener('canplaythrough7', function() {
    audioElement7.stop();
}, false);

audioElement7.onerror = function(event) {
    console.log(event.code);
}

var audioElement8;
audioElement8 = new Audio("");
audioElement8.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

document.body.appendChild(audioElement8);
//audioElement8.src = chrome.extension.getURL("sons/BEEP_02.mp3");
audioElement8.id = "audioElement8";
audioElement8.addEventListener('canplaythrough8', function() {
    audioElement8.stop();
}, false);

audioElement8.onerror = function(event) {
    console.log(event.code);
}
