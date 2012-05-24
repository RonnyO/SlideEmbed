/************* Helpers *************/
// Get: html string
// Return: correspondent document fragment
window.createFragment = function(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
};

window.outerHTML = function(node) {
	// if IE, Chrome take the internal method otherwise build one
	return node.outerHTML || (
      function(n) {
          var div = document.createElement('div'), h;
          div.appendChild( n.cloneNode(true) );
          h = div.innerHTML;
          div = null;
          return h;
	})(node);
};

// Not very working...
window.copyToClipboard = function(text) {
/*    if (window.clipboardData) {
        window.clipboardData.setData('text', text);
    } 
	else {
        var clipboarddiv = document.getElementById('divclipboardswf');
        if (!clipboarddiv) {
            clipboarddiv = document.createElement('div');
            clipboarddiv.setAttribute("name", "divclipboardswf");
            clipboarddiv.setAttribute("id", "divclipboardswf");
            document.body.appendChild(clipboarddiv);
        }
        clipboarddiv.innerHTML = '<embed src="clipboard.swf" FlashVars="clipboard=' + encodeURIComponent(text) + '" width="0" height="0" type="application/x-shockwave-flash"></embed>';
    }*/
} 

// Add extend functionality: extend "this" with "properties"
// If "target" is not specified, override "this"
Object.prototype.extend = function(properties, target) {
	target = target || this;
    for (var property in this) {
        if (this.hasOwnProperty[property]);
            target[property] = this[property];
    }
    for (var property in properties) {
        target[property] = properties[property];
    }
    return target;
};

// Add support for a DocumentFragment object to get elements by tag name
DocumentFragment.prototype.getElementsByTagName = function(sTag) {
    var aElements = [],
        fBubble = function(node) {
            if (node.nodeName.toLowerCase() === sTag.toLowerCase()) {
                aElements.push(node);
            }
            if (node.hasChildNodes) {
                var children = node.childNodes;
                for (var i = 0; i < children.length; i++) {
                    fBubble(children[i]);
                }	
            }
            return;
        };
    fBubble(this);
    return aElements;
};
/***********************************/

if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", SlideEmbedNS, false);
}

function SlideEmbedNS() {
	var controls = createFragment('<ul class="embedControls clearfix">' + 
										'\n\t<li class="fullscreenBtn"><a href="javascript:void(0)">Fullscreen</a></li>' +
										'\n\t<li class="linkBtn"><a href="javascript:void(0)">Share</a></li>' +
										'\n\t<li class="embedBtn"><a href="javascript:void(0)">Embed</a></li>' +
									'\n</ul>'),
		// Plugin's Dialog object
		dialog = function(id, settings) {
			var defaultConfig = { msgHtml: '', isPrepend: true },
				config = defaultConfig.extend(settings, {}),
				dialogElement,
				dialogElementHtml = function(innerHtml) { 
					return '<div id="' + id + '" class="embedControlsMsg-mask unseen">' +
								'\n\t<div class="embedControlsMsg-wrapper">' +
									'\n\t\t<a href="javascript:void(0)" class="embedControlsMsg-btnClose" onclick="activeDialog.hide()">X<\a>\n' +
									'\n\t\t<div class="embedControlsMsg">\n' + innerHtml +
									'\n\t\t<\div>' +
								'\n\t<\div>'
							'</div>' 
				},
				msgFrag = createFragment(dialogElementHtml(config.msgHtml)),
				bodyInsertion = config.isPrepend ? 'insertBefore' : 'appendChild',
				stopPropagation = function(e) { e.stopPropagation(); },
				showDialog, hideDialog, htmlDialog;
			
			document.body[bodyInsertion](msgFrag, document.body.childNodes[0]);
			dialogElement = document.getElementById(id);
						
			showDialog = function() {
				setTimeout(function() { 
							dialogElement.className = dialogElement.className.replace("unseen", "seen"); 
							dialogElement.children[0].addEventListener('click', stopPropagation, false);
							document.body.addEventListener('click', hideDialog, false);
						}, 10);
			};
			hideDialog = function() {
				dialogElement.className = dialogElement.className.replace("seen", "unseen");
				document.body.removeEventListener('click', hideDialog, false);
				dialogElement.children[0].removeEventListener('click', stopPropagation, false);
			};
			htmlDialog = function(msgHtml) {
				if (msgHtml) {
					dialogElement.parentNode.replaceChild(createFragment(dialogElementHtml(msgHtml)), dialogElement);
					dialogElement = document.getElementById(id);
				}
				return dialogElement.outerHTML;
			};
			return {
				show: showDialog,
				hide: hideDialog,
				html: htmlDialog
			}
		},
		popup,
		inFullscreenMode = function() {
			return /fullscreen=true/.test(document.location.href);
		},
		isEmbedded = function() {
			return !(window === window.top);
		}
		goFullscreen = function() {
			popup = window.open(
			document.location.href + '?fullscreen=true', null, 'left=0,\
			top=0,\
			width=' + screen.availWidth + '\
			height=' + screen.availHeight + '\
			resizable=no,\
			menubar=no,\
			toolbar=no,\
			location=no,\
			personalbar=no,\
			status=no,\
			scrollbars=no,\
			fullscreen=yes' // Maximized in IE. Solving the concealed control bar problem in the popup window.
			);
		},
		exitFullscreen = function() {
			window.close();
		},
		bindEvents = function() {
			var aControls = controls.getElementsByTagName('a');
			for (var i = 0; i < aControls.length; i++) {
				aControls[i].addEventListener('click', function() {
					var btnType = this.parentNode.className;
					var slideshowUrl = document.location.href,
						queryStringIdx = slideshowUrl.indexOf('?');
					slideshowUrl = queryStringIdx > -1 ? slideshowUrl.substring(0, queryStringIdx) : slideshowUrl;

					// Identify the clicked button
					if (btnType.indexOf('fullscreenBtn') > -1) {
						if (inFullscreenMode()) {
							exitFullscreen();
						} else {
							goFullscreen();
						}
					}
					else if (btnType.indexOf('linkBtn') > -1) {
						if (!window.shareDialog) {
							var code = slideshoeUrl,
								msgHtml = '<p>Share this slideshow:<code>' + code + '</code></p><a class="copyBtn" href="javascript:void(0)" onclick="copyToClipboard(' + code + ')">Copy!</a>';
							window.shareDialog = dialog("embedControls-shareDialog", { msgHtml: msgHtml, isPrepend: true });
						}
						window.activeDialog = shareDialog;
						activeDialog.show();
					}
					else if (btnType.indexOf('embedBtn') > -1) {
						if (!window.embedDialog) {
							var code = '&lt;iframe src="' + slideshowUrl + '" frameborder="0" width="800px" height="600px"&gt;&lt;/iframe&gt;'
								msgHtml = '<p>Use this code to embed the slideshow in your page:<code>' + code + '</code></p><a class="copyBtn" href="javascript:void(0)" onclick="copyToClipboard(' + code + ')">Copy!</a>';
							window.embedDialog = dialog("embedControls-embedDialog", { msgHtml: msgHtml, isPrepend: true });
						}
						window.activeDialog = embedDialog;
						activeDialog.show();
					}
				}, false);
			}
		};

	window.injectControls = function() {
		document.body.appendChild(controls);
	};

	bindEvents();
	injectControls();
};
