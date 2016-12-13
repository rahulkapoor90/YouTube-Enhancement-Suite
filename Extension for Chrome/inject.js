var acelerador = '';
var speedNome = '';

chrome.extension.sendMessage({}, function(response) {

    var tc = {
        settings: {
            speed: 1.0,
            speedStep: 16,
			mute: false
        }
    };
    var controllerAnimation;
    var readyStateCheckInterval;
    chrome.storage.local.get(tc.settings, function(storage) {
        tc.settings.speed = Number(storage.speed);
        tc.settings.speedStep = Number(storage.speedStep);
        tc.settings.rewindTime = Number(storage.rewindTime);
        tc.settings.advanceTime = Number(storage.advanceTime);
        tc.settings.resetKeyCode = Number(storage.resetKeyCode);
        tc.settings.rewindKeyCode = Number(storage.rewindKeyCode);
        tc.settings.slowerKeyCode = Number(storage.slowerKeyCode);
        tc.settings.fasterKeyCode = Number(storage.fasterKeyCode);
        tc.settings.advanceKeyCode = Number(storage.advanceKeyCode);
        tc.settings.rememberSpeed = Boolean(storage.rememberSpeed);
        tc.settings.mute = Boolean(storage.mute);
        tc.settings.first = Boolean(storage.first);
		console.log(tc.settings);
        readyStateCheckInterval = setInterval(initializeVideoSpeed, 10);
    });

    function initializeVideoSpeed() {
        if (document.readyState === 'complete') {
            clearInterval(readyStateCheckInterval);

            tc.videoController = function(target) {
                this.video = target;
                var el = this;
                if (!tc.settings.rememberSpeed) {
                    tc.settings.speed = 1.0;
                }
                this.video.oncanplaythrough = function() {
                    this.focus();
                }
				if (!this.video.dataset.minicooper) {
					this.initializeControls();
				}

                target.addEventListener('play', function(event) {
                    target.playbackRate = tc.settings.speed;
                });

                target.addEventListener('ratechange', function(event) {
                    if (target.readyState === 0) {
                        return;
                    }
                    var speed = this.getSpeed();
                    this.speedIndicator.innerHTML = speedNome;
                    tc.settings.speed = speed;
                    chrome.storage.local.set({
                        'speed': speed
                    });
                }.bind(this));

                target.playbackRate = tc.settings.speed;
            };

			document.getElementById('audioElement').muted = tc.settings.mute;
			document.getElementById('audioElement2').muted = tc.settings.mute;

			tc.videoController.prototype.getSpeed = function() {
                return parseFloat(this.video.playbackRate).toFixed(2);
            }

            tc.videoController.prototype.remove = function() {
                this.parentElement.removeChild(this);
            }

            tc.videoController.prototype.initializeControls = function() {
                var fragment = document.createDocumentFragment();
                var container = document.createElement('div');
                var speedIndicator = document.createElement('span');

                var controls = document.createElement('span');
                var advanceButton = document.createElement('span');

                speedIndicator.innerHTML = '';

                controls.appendChild(advanceButton);

                container.appendChild(speedIndicator);

                container.classList.add('tc-videoController');
                controls.classList.add('tc-controls');

                fragment.appendChild(container);
                this.video.parentElement.insertBefore(fragment, this.video);
				this.video.dataset.minicooper = "true";
                var speed = parseFloat(tc.settings.speed).toFixed(2);
                speedIndicator.innerHTML = speedNome;
                this.speedIndicator = speedIndicator;
            }

            function setSpeed(v, speed) {
                v.playbackRate = speed;
            }

            function runAction(action) {
                var videoTags = document.getElementsByTagName('video');
                videoTags.forEach = Array.prototype.forEach;
                videoTags.forEach(function(v) {
                    if (!v.classList.contains('vc-cancelled') && !v.paused) {
                        if (action === 'faster') {
                            // Maxium playback speed in Chrome is set to 16:
                            // https://code.google.com/p/chromium/codesearch#chromium/src/media/blink/webmediaplayer_impl.cc&l=64
                            var s = Math.min(v.playbackRate + tc.settings.speedStep, 16);
                            setSpeed(v, s);
                            audioElement.play();
                        } else if (action === 'reset') {
                            setSpeed(v, 1.0);
                            audioElement2.play();
                            audioElement.currentTime = 0;
                        }
                    }
                });
            }
            document.body.addEventListener('keydown', function(e) {
                if (e.keyCode == acelerador) {
                    speedNome = '<div class="monster"></div>';
                    runAction('faster')
                } else if (e.keyCode == "") {
                    runAction('reset')
                    setSpeed(v, 1.0);
                }

            });

            document.body.addEventListener('keyup', function(e) {
                var v = document.getElementsByTagName('video');
                if (e.keyCode == acelerador) {
                    runAction('reset')
                    speedNome = '<div class="monster2"></div>';
                    audioElement.pause();
                    audioElement.currentTime = 0;
                    setTimeout(
                        function somBrake() {
                            audioElement2.pause();
                            audioElement2.currentTime = 0;
                        }, 1000);
                    setSpeed(v, 1.0);
                } else if (e.keyCode == "") {
                    runAction('reset')
                    setSpeed(v, 1.0);


                }
            });



            document.addEventListener('keypress', function(event) {
                var keyCode = String.fromCharCode(event.keyCode).toUpperCase().charCodeAt();
                if (document.activeElement.nodeName === 'INPUT' && document.activeElement.getAttribute('type') === 'text') {
                    return false;
                }

                if (keyCode == tc.settings.rewindKeyCode) {
                    runAction('rewind')
                } else if (keyCode == tc.settings.advanceKeyCode) {
                    runAction('advance')
                } else if (keyCode == tc.settings.fasterKeyCode) {
                    runAction('faster')
                } else if (keyCode == tc.settings.slowerKeyCode) {
                    runAction('slower')
                } else if (keyCode == tc.settings.resetKeyCode) {
                    runAction('reset')
                }

                return false;
            }, true);

            document.addEventListener('DOMSubtreeModified', function(event) {
                var node = event.target || null;
                if (node && node.nodeName === 'VIDEO') {
                    new tc.videoController(node);
                }
            });

            var videoTags = document.getElementsByTagName('video');
            videoTags.forEach = Array.prototype.forEach;
            videoTags.forEach(function(video) {
                var control = new tc.videoController(video);
            });
        }
    }
});


// SONS


var audioElement;
audioElement = new Audio("");
audioElement.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

document.body.appendChild(audioElement);
//audioElement.src = chrome.extension.getURL("sons/ACCELERATION.mp3");
audioElement.id = "audioElement";
if (audioElement.length > 0) {
    audioElement.addEventListener('canplaythrough', function() {
        audioElement.stop();
    }, false);
}
audioElement.onerror = function(event) {
    console.log(event.code);
}

var audioElement2;
audioElement2 = new Audio("");
audioElement2.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

document.body.appendChild(audioElement2);
//audioElement2.src = chrome.extension.getURL("sons/BRAKE.mp3");
audioElement2.id = "audioElement2";
audioElement2.addEventListener('canplaythrough2', function() {
    audioElement2.stop();
}, false);

audioElement2.onerror = function(event) {
    console.log(event.code);
}

chrome.runtime.onMessage.addListener(
    chrome.storage.local.get("message", function(result) {
        if (result.message === "ligado") {
            acelerador = "83"
            speedNome = '<div class="monster2"></div>'
                //alert(acelerador);
                //storage_name();
        } else if (result.message === "desligado") {
            speedNome = '';
            acelerador = ""
                //alert(acelerador);
                //storage_name();
        }
    })
);
