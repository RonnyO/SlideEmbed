$(function(){
	(function($){
		var helpers = {
			// Get: html string
			// Return: correspondent document fragment
			createFragment: function(htmlStr) {
				var frag = document.createDocumentFragment(),
				temp = document.createElement('div');
				temp.innerHTML = htmlStr;
				while (temp.firstChild) {
					frag.appendChild(temp.firstChild);
				}
				return frag;
			}
		},
		$controls = $('<ul class="embedControls clearfix"> \
						<li class="fullscreenBtn"><a href="javascript:void(0)">Fullscreen</a></li>\
						<li class="linkBtn"><a href="javascript:void(0)">Share</a></li>\
						<li class="embedBtn"><a href="javascript:void(0)">Embed</a></li>\
						</ul>'),
		popup,
		inFullscreenMode = function(){
			return /fullscreen=true/.test(document.location.href);
		},
		isEmbedded = function(){
			return !(window === window.top);
		}
		goFullscreen = function(){
			popup = window.open(
			document.location.href + '?fullscreen=true',
			null,
			'left=0,\
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
			fullscreen=yes'	// Maximized in IE. Solving the concealed control bar problem in the popup window.
			);
		},
		exitFullscreen = function(){
			window.close();
		};
		
		window.injectControls = function(){
			$('body').append($controls);
		};
		
		$('a', $controls).click(function(){
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
				var msgHtml =	'<div class="embedControlsMsg-mask">\
									<div class="embedControlsMsg-wrapper">\
										<div class="embedControlsMsg">\
											<p>Share this slideshow:\
												<code>' + slideshowUrl + '</code>\
											</p>\
											<a class="copyBtn" href="javascript:void(0)">Copy!</a>\
										</div>\
									</div>\
								</div>';
				document.body.insertBefore(helpers.createFragment(msgHtml), document.body.childNodes[0]);
			}
			else if (btnType.indexOf('embedBtn') > -1) {
				var msgHtml =	'<div class="embedControlsMsg-mask">\
									<div class="embedControlsMsg-wrapper">\
										<div class="embedControlsMsg">\
											<p>Use this code to embed the slideshow in your page:\
												<code>&lt;iframe src="' + slideshowUrl + '" frameborder="0" width="800px" height="600px"&gt;&lt;/iframe&gt;</code>\
											</p>\
											<a class="copyBtn" href="javascript:void(0)">Copy!</a>\
										</div>\
									</div>\
								</div>';
				document.body.insertBefore(helpers.createFragment(msgHtml), document.body.childNodes[0]);
			}
		});
	})(jQuery);

	injectControls();

});