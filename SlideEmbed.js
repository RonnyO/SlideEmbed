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
			// Identify the clicked button
			if (btnType.indexOf('fullscreenBtn') > -1) {
				if (inFullscreenMode()) {
					exitFullscreen()
				} else {
					goFullscreen()
				}
			}
			else if (btnType.indexOf('linkBtn') > -1) {
				var url = document.location.href,
					queryStringIdx = url.indexOf('?');
				url = queryStringIdx > -1 ? url.substring(0, queryStringIdx) : url;
				alert(url);
			}
			else if (btnType.indexOf('embedBtn') > -1) {
			}
		});
	})(jQuery);

	injectControls();

});