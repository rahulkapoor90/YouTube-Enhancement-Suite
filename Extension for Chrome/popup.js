/*
Ratings Preview for YouTube
Copyright (C) 2011-2015 Cristian Perez <http://www.cpr.name>
All rights reserved.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL CRISTIAN PEREZ BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function updateStyle(automatic)
{
	var newValue = document.getElementById("select_style").value;
	updateBarStyle(newValue);
	chrome.runtime.sendMessage({name:"storage_set_style", message:newValue});
	if (automatic !== true) showRefreshNotice();
}

function updateThickness(automatic)
{
	var newValue = document.getElementById("range_thickness").value;
	document.getElementById("label_thickness").textContent = newValue + " pixels";
	updateBarThickness(newValue);
	chrome.runtime.sendMessage({name:"storage_set_thickness", message:newValue});
	if (automatic !== true) showRefreshNotice();
}

function updateHighlighted(automatic)
{
	var newValue = document.getElementById("range_highlighted").value;
	if (newValue == 0)
	{
		document.getElementById("label_highlighted").textContent = "Disabled";
		document.getElementById("demo_thumbnail").style.opacity = "0.2";
		document.getElementById("demo_thumbnail_timenode").style.opacity = "0.2";
	}
	else if (newValue == 1)
	{
		document.getElementById("label_highlighted").textContent = "1 video";
		document.getElementById("demo_thumbnail").style.opacity = "1.0";
		document.getElementById("demo_thumbnail_timenode").style.opacity = "1.0";
	}
	else
	{
		document.getElementById("label_highlighted").textContent = newValue + " videos";
		document.getElementById("demo_thumbnail").style.opacity = "1.0";
		document.getElementById("demo_thumbnail_timenode").style.opacity = "1.0";
	}
	chrome.runtime.sendMessage({name:"storage_set_highlighted", message:newValue});
	if (automatic !== true) showRefreshNotice();
}

function updateShowRpScore(automatic)
{
	var newValue = document.getElementById("checkbox_showrpscore").checked;
	var imgTimeNodes = document.getElementsByClassName("ytrp_demo_timenode");
	for (var i = 0; i < imgTimeNodes.length; i++)
	{
		imgTimeNodes[i].src = String(newValue) == "true" ? "icons/timenodescore.png" : "icons/timenode.png";
	}
	chrome.runtime.sendMessage({name:"storage_set_showrpscore", message:newValue});
	if (automatic !== true) showRefreshNotice();
}

function updateOpacity(automatic)
{
	var newValue = document.getElementById("range_opacity").value;
	var text = "Invisible";
	if (newValue == 1)
	{
		text = "20%";
	}
	else if (newValue == 2)
	{
		text = "40%";
	}
	else if (newValue == 3)
	{
		text = "50%";
	}
	else if (newValue == 4)
	{
		text = "60%";
	}
	else if (newValue == 5)
	{
		text = "70%";
	}
	else if (newValue == 6)
	{
		text = "80%";
	}
	else if (newValue == 7)
	{
		text = "90%";
	}
	else if (newValue == 8)
	{
		text = "Opaque";
	}
	document.getElementById("label_opacity").textContent = text;
	updateBarOpacity(newValue);
	chrome.runtime.sendMessage({name:"storage_set_opacity", message:newValue});
	if (automatic !== true) showRefreshNotice();
	// After the automatic setup, re-enable opacity transitions after 0.2s (transition duration)
	if (automatic === true)
	{
		setTimeout(function ()
		{
			var noTransitions = document.getElementsByClassName("no_transition");
			while (noTransitions.length > 0) // noTransitions is a live NodeList
			{
				noTransitions[0].className = noTransitions[0].className.replace("no_transition", "");
			}
		}, 200);
	}
}

function updateCaching(automatic)
{
	var newValue = document.getElementById("range_caching").value;
	var text = "Disabled";
	if (newValue == 1)
	{
		text = "5 minutes";
	}
	else if (newValue == 2)
	{
		text = "30 minutes";
	}
	else if (newValue == 3)
	{
		text = "1 hour";
	}
	else if (newValue == 4)
	{
		text = "2 hours";
	}
	else if (newValue == 5)
	{
		text = "6 hours";
	}
	else if (newValue == 6)
	{
		text = "12 hours";
	}
	else if (newValue == 7)
	{
		text = "24 hours";
	}
	document.getElementById("label_caching").textContent = text;
	chrome.runtime.sendMessage({name:"storage_set_caching", message:newValue});
	if (automatic !== true) showRefreshNotice();
}

function updateShowPageIcon(automatic)
{
	var newValue = document.getElementById("checkbox_showpageicon").checked;
	chrome.runtime.sendMessage({name:"storage_set_showpageicon", message:newValue});
	if (automatic !== true) showRefreshNotice();
}

document.addEventListener("DOMContentLoaded", function()
{
	document.getElementById("select_style").addEventListener("change", updateStyle);
	document.getElementById("range_thickness").addEventListener("input", updateThickness);
	document.getElementById("range_highlighted").addEventListener("input", updateHighlighted);
	document.getElementById("checkbox_showrpscore").addEventListener("change", updateShowRpScore);
	document.getElementById("range_opacity").addEventListener("input", updateOpacity);
	document.getElementById("range_caching").addEventListener("input", updateCaching);
	document.getElementById("checkbox_showpageicon").addEventListener("change", updateShowPageIcon);

	document.getElementById("logo").addEventListener("click", function()
	{
		chrome.runtime.sendMessage({name:"clickedWebsiteLink"});
	});

	chrome.runtime.sendMessage({name:"storage_get_style"}, function(value)
	{
		document.getElementById("select_style").value = value;
		updateStyle(true);
	});
	chrome.runtime.sendMessage({name:"storage_get_thickness"}, function(value)
	{
		document.getElementById("range_thickness").value = value;
		updateThickness(true);
	});
	chrome.runtime.sendMessage({name:"storage_get_highlighted"}, function(value)
	{
		document.getElementById("range_highlighted").value = value;
		updateHighlighted(true);
	});
	chrome.runtime.sendMessage({name:"storage_get_showrpscore"}, function(value)
	{
		document.getElementById("checkbox_showrpscore").checked = String(value) == "true";
		updateShowRpScore(true);
	});
	chrome.runtime.sendMessage({name:"storage_get_opacity"}, function(value)
	{
		document.getElementById("range_opacity").value = value;
		updateOpacity(true);
	});
	chrome.runtime.sendMessage({name:"storage_get_caching"}, function(value)
	{
		document.getElementById("range_caching").value = value;
		updateCaching(true);
	});
	chrome.runtime.sendMessage({name:"storage_get_showpageicon"}, function(value)
	{
		document.getElementById("checkbox_showpageicon").checked = String(value) == "true";
		updateShowPageIcon(true);
	});
});

var refreshTimer;

function showRefreshNotice()
{
	clearTimeout(refreshTimer);
	document.getElementById("changes_notice").style.visibility = "visible";
	refreshTimer = setTimeout(function ()
	{
		document.getElementById("changes_notice").style.visibility = "hidden";
	}, 10000); // Hide notice after 10 seconds without change
}

var cssBarStyle = undefined;
var cssBarThickness = undefined;
var cssBarOpacity = undefined;

function updateBarStyle(newValue)
{
	if (cssBarStyle == undefined)
	{
		var style = document.createElement("style");
		style.setAttribute("type", "text/css");
		cssBarStyle = document.createTextNode(getBarStyleCSS(newValue));
		style.appendChild(cssBarStyle);
		document.getElementsByTagName("head")[0].appendChild(style);
	}
	else
	{
		cssBarStyle.textContent = getBarStyleCSS(newValue);
	}
}

function updateBarThickness(newValue)
{
	if (cssBarThickness == undefined)
	{
		var style = document.createElement("style");
		style.setAttribute("type", "text/css");
		cssBarThickness = document.createTextNode(getBarThicknessCSS(newValue));
		style.appendChild(cssBarThickness);
		document.getElementsByTagName("head")[0].appendChild(style);
	}
	else
	{
		cssBarThickness.textContent = getBarThicknessCSS(newValue);
	}
}

function updateBarOpacity(newValue)
{
	if (cssBarOpacity == undefined)
	{
		var style = document.createElement("style");
		style.setAttribute("type", "text/css");
		cssBarOpacity = document.createTextNode(getBarOpacityCSS(newValue));
		style.appendChild(cssBarOpacity);
		document.getElementsByTagName("head")[0].appendChild(style);
	}
	else
	{
		cssBarOpacity.textContent = getBarOpacityCSS(newValue);
	}
}

function addRuleToCSS(_class, _element, _value, _css)
{
	return _css + "\n" + _class + " { " + _element + ": " + _value + "; }\n";
}

function getBarStyleCSS(newValue)
{
	var css = "";
	newValue = parseInt(newValue); // Otherwise it is considered a string
	if (newValue == 0)
	{
		// Classic style
		css = addRuleToCSS(".ytrp_rb_bg", "background", "#FFF", css);
		css = addRuleToCSS(".ytrp_rb_fg_like", "background", "#060", css);
		css = addRuleToCSS(".ytrp_rb_fg_dislike", "background", "#C00", css);
		css = addRuleToCSS(".ytrp_rb_fg_dislike", "border-left", "1px solid #FFF", css);
		css = addRuleToCSS(".ytrp_rb_fg_hl", "background", "#00F", css);
	}
	else if (newValue == 1)
	{
		// Modern style
		css = addRuleToCSS(".ytrp_rb_bg", "background", "#CCC", css);
		css = addRuleToCSS(".ytrp_rb_fg_like", "background", "#2793e6", css);
		css = addRuleToCSS(".ytrp_rb_fg_dislike", "background", "#CCC", css);
		css = addRuleToCSS(".ytrp_rb_fg_dislike", "border-left", "1px solid #CCC", css);
		css = addRuleToCSS(".ytrp_rb_fg_hl", "background", "#cc181e", css);
	}
	return css;
}

function getBarThicknessCSS(newValue)
{
	var css = "";
	newValue = parseInt(newValue); // Otherwise it is considered a string
	css = addRuleToCSS(".ytrp_rb_bg_bottom", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_top", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_left", "top", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_left", "bottom", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_left", "width", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_right", "top", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_right", "bottom", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_right", "width", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_like", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_dislike", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_hl_bottom", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_hl_top", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_hl_left", "width", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_hl_right", "width", newValue + "px", css);
	css = addRuleToCSS(".ytrp_demo_timenode", "margin-top", (7 - newValue) + "px", css);
	return css;
}

function getBarOpacityCSS(newValue)
{
	var css = "";
	newValue = parseInt(newValue); // Otherwise it is considered a string
	if (newValue == 0)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "0", css);
	}
	else if (newValue == 1)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "0.2", css);
	}
	else if (newValue == 2)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "0.4", css);
	}
	else if (newValue == 3)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "0.5", css);
	}
	else if (newValue == 4)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "0.6", css);
	}
	else if (newValue == 5)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "0.7", css);
	}
	else if (newValue == 6)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "0.8", css);
	}
	else if (newValue == 7)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "0.9", css);
	}
	else if (newValue == 8)
	{
		css = addRuleToCSS(".ytrp_wrapper", "opacity", "1", css);
	}
	return css;
}
