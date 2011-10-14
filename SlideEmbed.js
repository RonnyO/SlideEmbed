$(function(){
	(function($){
		var $controls = $('<ul class="embedControls clearfix"> \
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
			scrollbars=no'
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
					exitFullscreen()
				} else {
					goFullscreen()
				}
			}
			else if (btnType.indexOf('linkBtn') > -1) {
				alert(slideshowUrl);
			}
			else if (btnType.indexOf('embedBtn') > -1) {
				alert('<iframe src="' + slideshowUrl + '" frameborder="0" width="800px" height="600px"></iframe>');
			}
		});
	})(jQuery);

	injectControls();

});