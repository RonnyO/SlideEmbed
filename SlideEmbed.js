$(function(){
	(function($){
		var $controls = $('<ul class="embedControls clearfix"> \
						<li class="fullscreenBtn"><a href="#">Fullscreen</a></li>\
						</ul>'),
		popup,
		inFullscreenMode = function(){
			return /fullscreen=true/.test(document.location.href);
		},
		isEmbedded = function(){
			return !(window === window.top);
		}
		goFullscreen = function(){
			console.log('goFullscreen');
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
			console.log('exitFullscreen');
			window.close();
		};
		
		window.injectControls = function(){
			if (isEmbedded()) {
				$('body').append($controls);
			}
		};
		
		
		$('.fullscreenBtn a', $controls).click(function(){
			if (inFullscreenMode()) {
				exitFullscreen()
			} else {
				goFullscreen()
			}
		});
	})(jQuery);

	injectControls();

});