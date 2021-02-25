$(function () {
	var before_device_type = false,
		device_type,
		mobile,
		tablet,
		desktop,
		init_func = [];
	
	var resize_function = function() {
		device_type = $('#mobile').is(':visible') ? 'mobile' : ($('#tablet').is(':visible') ? 'tablet' : 'desktop');
		mobile = device_type == 'mobile';
		tablet = device_type == 'tablet';
		desktop = device_type == 'desktop';
		
		if(before_device_type==device_type){
			return;
		}
		
		//if(before_device_type==false){
		for(var i =0;i<init_func.length;i++){
			init_func[i]();
		}
		//}
		
		before_device_type = device_type;
	};
	
	$(window).on('resize', resize_function);
	
	//trigger resize when dom is ready (100ms - bug fixing for more browsers)
	setTimeout(function(){
		$(window).trigger('resize');
	}, 100);
	
	//trigger resize when all document full loaded
	$(window).on('load', function(){
		$(window).trigger('resize');
	});
	
	
	$('select').select();
	
	var cursor = $('#cursor');
	var xMousePos = 0;
	var yMousePos = 0;
	var lastScrolledLeft = 0;
	var lastScrolledTop = 0;
	
	$(document).mousemove(function(event) {
		captureMousePosition(event);
	})
	
	$(window).scroll(function(event) {
		if(lastScrolledLeft != $(document).scrollLeft()){
			xMousePos -= lastScrolledLeft;
			lastScrolledLeft = $(document).scrollLeft();
			xMousePos += lastScrolledLeft;
		}
		if(lastScrolledTop != $(document).scrollTop()){
			yMousePos -= lastScrolledTop;
			lastScrolledTop = $(document).scrollTop();
			yMousePos += lastScrolledTop;
		}
		cursor.css({
			left:  xMousePos - $(window).scrollLeft(),
			top:   yMousePos - $(window).scrollTop()
		});
	});
	function captureMousePosition(event){
		xMousePos = event.pageX;
		yMousePos = event.pageY;
		cursor.css({
			left:  xMousePos - $(window).scrollLeft(),
			top:   yMousePos - $(window).scrollTop()
		});
	}
	
	
	init_func.push(function (){
		if (mobile||tablet){
		}else{
		
		}
		
	}
	);
	
	init_func.push(function (){
		if (desktop){
		
		}else{
		}
	});
	
	var hover_link = $('.hover-link,.input-box,.logo-art');
	var cursor_white = $('.cursor_white');
	var no_cursor = $('.no-cursor');
	/*var btn_w = $('.btn-white');*/
	var bg_white = $('.cursor-bg-white');
	
	hover_link.on('mouseenter', function () {
		cursor.addClass('cursor-wide');
	});
	hover_link.on('mouseleave', function () {
		cursor.removeClass('cursor-wide');
	});
	
	/*red button*/
	cursor_white.on('mouseenter', function () {
		cursor.addClass('cursor-wide-white');
	}).on('mouseleave', function () {
		cursor.removeClass('cursor-wide-white');
	});
	/*white*/
	bg_white.on('mouseenter', function () {
		cursor.addClass('cursor-white');
	}).on('mouseleave', function () {
		cursor.removeClass('cursor-white');
	});
	/*no-cursor*/
	no_cursor.on('mouseenter', function () {
		cursor.addClass('hide-cursor');
	}).on('mouseleave', function () {
		cursor.removeClass('hide-cursor');
	});
	/*white*/
	$('.toggle-line.cursor_white').on('mouseenter', function () {
		cursor.addClass('cursor-white');
	});
	bg_white.on('mouseleave', function () {
		cursor.removeClass('cursor-white');
	});
	
	
	
	var body = $('body');
	var header = $('header');
	
	

	
	$('.swich').on('click', function () {
		$(this).toggleClass('active');
	});
	
	init_func.push(function(){
		var bg_svg_grey_el = $('.bg-svg-grey');
		if(bg_svg_grey_el.length>0){
			var bg_section_grey = new Waypoint({
				element: bg_svg_grey_el,
				handler: function(direction) {
					header.toggleClass('header-dark');
				},
				offset: '5%'
			});
		}
		var bg_black_el = $('.bg-black');
		if(bg_black_el.length>0){
			var bg_black = new Waypoint({
				element: bg_black_el,
				handler: function(direction) {
					header.toggleClass('header-dark');
				},
				offset: '5%'
			});
		}
		
		var bg_grey_el = $('.bg-grey');
		if(bg_grey_el.length>0){
			var bg_grey = new Waypoint({
				element: bg_grey_el,
				handler: function(direction) {
					header.toggleClass('header-dark');
				},
				offset: '5%'
			});
		}
	});
	
	if($('#map').length>0){
		ymaps.ready(function () {
			var myMap = new ymaps.Map('map', {
					center: [55.910412,37.725101],
					zoom: 9
				}),
		
				// Создаём макет содержимого.
				myPlacemark = new ymaps.Placemark(myMap.getCenter(), {}, {
					// Опции.
					// Необходимо указать данный тип макета.
					iconLayout: 'default#image',
					// Своё изображение иконки метки.
					iconImageHref: 'images/marker.png',
					// Размеры метки.
					iconImageSize: [50, 55],
					// Смещение левого верхнего угла иконки относительно
					// её "ножки" (точки привязки).
					iconImageOffset: [-25, -55]
				});
		
			myMap.geoObjects
				.add(myPlacemark);
			myMap.behaviors.disable('scrollZoom');
			
			
			var ctrlKey = false;
			var ctrlMessVisible = false;
			var timer;
			
			// Отслеживаем скролл мыши на карте, чтобы показывать уведомление
			myMap.events.add(['wheel', 'mousedown'], function(e) {
				if (e.get('type') == 'wheel') {
					if (!ctrlKey) { // Ctrl не нажат, показываем уведомление
						$('#ymap_ctrl_display').fadeIn(300);
						ctrlMessVisible = true;
						clearTimeout(timer); // Очищаем таймер, чтобы продолжать показывать уведомление
						timer = setTimeout(function() {
							$('#ymap_ctrl_display').fadeOut(300);
							ctrlMessVisible = false;
						}, 1500);
					}
					else { // Ctrl нажат, скрываем сообщение
						$('#ymap_ctrl_display').fadeOut(100);
					}
				}
				if (e.get('type') == 'mousedown' && ctrlMessVisible) { // Скрываем уведомление при клике на карте
					$('#ymap_ctrl_display').fadeOut(100);
				}
			});
			
			// Обрабатываем нажатие на Ctrl
			$(document).keydown(function(e) {
				if (e.which === 17 && !ctrlKey) { // Ctrl нажат: включаем масштабирование мышью
					ctrlKey = true;
					myMap.behaviors.enable('scrollZoom');
				}
			});
			$(document).keyup(function(e) { // Ctrl не нажат: выключаем масштабирование мышью
				if (e.which === 17) {
					ctrlKey = false;
					myMap.behaviors.disable('scrollZoom');
				}
			});
		});
	}
	
	
	/*function scrollNav() {
		$('.anchor').click(function(){
			$('html, body').stop().animate({
				scrollTop: $( $(this).attr('href') ).offset().top - 160
			}, 400);
			return false;
		});
	}
	scrollNav();*/
	
	
	/**/
	var sliders = [];
	init_func.push(function(){
		if(desktop){
			for(var i =0;i<sliders.length;i++){
				sliders[i].destroy();
			}
			sliders = [];
		}else{
			$('.slider-content-custom').each(function (){
				var swiper_pagination = $(this).closest('.swiper-container').find('.custom-slider-pagination');
				
				
				var options = {
					pagination: {
						el: '',
						clickable: true,
					},
					breakpoints: {
						767: {
						},
						1199: {
						}
					}
				};
				
				if($(this).is(".agro-items-slider")){
					options.breakpoints = {
						767: {
						},
						1199: {
						},
						
					};
				}
				
				sliders.push(
					new Swiper($(this)[0], options)
				);
			});
		}
	});
	
	
	
	
	
	
	$('.slider-scroll').each(function (){
		
		var scroll_bar = $(this).closest('.swiper-slide').find('.swiper-scrollbar');
		
		var slider_scroll = new Swiper($(this)[0], {
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollbar: {
				el: scroll_bar[0]
			},
			mousewheel: true,
			on:{
				progress:function (progress) {
					if(progress>=1){
						$(this.$el).addClass('end_scroll')
					}else{
						$(this.$el).removeClass('end_scroll')
					}

					if(progress<=0 || isNaN(progress)){
						$(this.$el).addClass('start_scroll')
					}else{
						$(this.$el).removeClass('start_scroll')
					}
				},
			}
		});
	});
	
	
	$('.client_logo_slider').each(function (){
		
		var client_logo_slider = new Swiper($(this)[0], {
			slidesPerView: 'auto',
			// Responsive breakpoints
			speed: 600,
			allowTouchMove:false,
			breakpoints: {
				767: {
					allowTouchMove:true,
					spaceBetween: 40,
				},
				1149: {
				}
			}
		});
	});
	
	
	
	
	$('.photo_slider').each(function (){
		
		var photo_slider = new Swiper($(this)[0], {
			effect: 'fade',
			allowTouchMove:false,
			fadeEffect: {
				crossFade: true
			},
			autoplay: {
				delay: 3000,
			},
		});
		
		
	});
	
	var slider_popup_wrapper = $("#slider_popup_wrapper"),
		slider_popup = new Swiper(slider_popup_wrapper.find('.slider_popup'), {
			effect: 'fade',
			speed:0,
			/*allowTouchMove:false,*/
			fadeEffect: {
			},
			autoplay: {
				delay: 1000,
				disableOnInteraction: false,
				stopOnLastSlide: false,
			},
		});

	var show_popup = function(photos, pos){
		slider_popup_wrapper.css({'top':pos.y+'px','left':pos.x+'px'});

		var swiper_wrapper = slider_popup_wrapper.find('.swiper-wrapper');
		swiper_wrapper.html('');
		for(var i=0;i<photos.length; i++){
			$('<div/>', {
				'class':"swiper-slide",
				html:
					'<div class="img-box">' +
					'<div class="img" style="background-image:url('+photos[i]+')"></div>' +
					'</div>'
			}).appendTo(swiper_wrapper);
		}

		slider_popup.autoplay.stop();

		slider_popup_wrapper.stop().fadeIn(150);

		setTimeout(function(){

			slider_popup.update();
			slider_popup.slideTo(0, 0);
			slider_popup.autoplay.start();
		}, 0);
	};

	var hide_popup = function(){
		if(slider_popup && slider_popup.autoplay){
			slider_popup.autoplay.stop();
			slider_popup_wrapper.fadeOut(150);
		}
	};
	
	$('body').on('mouseover', '.show_popup_title', function () {
		if(device_type!=='desktop'){
			return;
		}
		var photos = ['images/slide.jpg', 'images/map.jpg'];
		var pos = {
			y:$(this).offset().top-$(window).scrollTop() + $(this).outerHeight() + 10,
			x:$(this).offset().left-$(window).scrollLeft() + 370
		};
		show_popup(photos, pos);
	}).on('mouseleave', '.show_popup_title', function () {
		hide_popup();
	});

	$(window).on('scroll', hide_popup);
	
	
	
	
	// NEWS SLIDER
	
	
	var content_news_slider = new Swiper('.content_news_slider', {
		speed: 300,
		slidesPerView: '1',
		navigation: {
			nextEl: '.slide_news_right',
			prevEl: '.slide_news_left',
		},
		pagination: {
			el: '.swiper-pagination-news',
			type: 'fraction',
		},
		breakpoints: {
			767: {
				
				autoHeight:true,
				slidesPerView: '1',
			},
			1149: {
				slidesPerView: '2',
			}
		},
		on:{
			init: function () {
			},
			slideChange:function(){
			},
		}
		
	});
	
	var content_news_img = new Swiper('.content_news_img', {
		slidesPerView: '1',
		speed: 300,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		on:{
			init: function () {
			},
			slideChange:function(){
			},
		}
	});
	
	content_news_slider.on('slideChange', function() {
		content_news_img.slideTo(this.activeIndex);
	});
	
	
	//
	
	var quote_slider = new Swiper('.quote_slider', {
		
		allowTouchMove:false,
		speed: 600,
		autoHeight:true,
		
		breakpoints: {
			767: {
				speed: 300,
				
				allowTouchMove:true,
			},
			1149: {
				allowTouchMove:true,
			}
		},
		/*on:{
			slideChange:function(){
				quote_slider.slideTo(this.activeIndex);
			}
		}*/
	
	});
	
	var org_logo_slider = new Swiper('.org_logo_slider', {
		initialSlide:4,
		slidesPerView: 'auto',
		freeModeMomentum:true,
		centeredSlides:true,
		speed: 600,
		// slidesPerView: 9,
		/*spaceBetween: 50,*/
		freeMode: true,
		// freeModeSticky:true,
		// watchSlidesVisibility: true,
		// watchSlidesProgress: true,
		allowTouchMove:false,
		slideToClickedSlide:true,
		
		
		breakpoints: {
			767: {
				freeMode: false,
				allowTouchMove:true,
				/*spaceBetween: 20,*/
			},
			1149: {
				freeMode: false,
				allowTouchMove:true,
			}
		},
		
		on:{
			slideChange:function(){
				quote_slider.slideTo(this.activeIndex);
			}
		}
		
	});
	
	quote_slider.on('slideChange', function() {
		org_logo_slider.slideTo(this.activeIndex);
	});
	
	
	
	
	// $('.quote_slider').each(function (){
	// 	thumbs: {
	// 		swiper: galleryThumbs
	// 	}
	//
	// 	var quote_slider = new Swiper($(this)[0], {
	// 		/*allowTouchMove:false,*/
	//
	// 	});
	// });
	
	$('.phrase_slider').each(function (){
		
		var phrase_slider = new Swiper($(this)[0], {
			effect: 'fade',
			allowTouchMove:false,
			fadeEffect: {
				crossFade: true
			},
			autoplay: {
				delay: 3000,
			},
			
			on: {
				slideChange: function () {
					var currSlide = $(this.slides[this.activeIndex]),
						currText = currSlide.text().trim(),
						fx_1 = new TextScramble(currSlide[0], '<span class="slide-name">%s</span>');
					
					fx_1.setText(currText);
					// console.log('scramble : '+ currText);
					
				},
			}
		});
	});
	
	$('.content_news_slider').each(function (){
		
		var phrase_slider = new Swiper($(this)[0], {
			slidesPerView: 1,
			
		});
	});
	
	
	var project_img_slider = new Swiper('.project_img_slider', {
		slidesPerView: '1',
		effect: 'fade',
		allowTouchMove:false,
		fadeEffect: {
			crossFade: true
		},
	});
	

	var project_slider = new Swiper('.project_slider', {
		slidesPerView: 'auto',
		centeredSlides:true,
		freeMode:true,
		sensitivity: 10,
		
		keyboardControl: true,
		mousewheelControl: true,
		mousewheelForceToAxis: true,
		mousewheelReleaseOnEdges: false,
		/*allowTouchMove:false,*/
		// speed: 600,
		mousewheel: {
			eventsTarged:$('body')[0]
		},
		scrollbar: {
			el: '.swiper-scrollbar-project',
			draggable: false,
		},
		breakpoints: {
			767: {
				direction: 'vertical',
				centeredSlides:true,
				freeMode:false,
			},
			1149: {
				direction: 'horizontal',
				centeredSlides:true,
			}
		},
		/*navigation: {
			nextEl: '.slide_project_right',
			prevEl: '.slide_project_left',
		},*/
		on:{
			slideChange:function(){
				project_img_slider.slideTo(this.activeIndex);
				if(this.realIndex == 0){
					header.addClass('header-dark');
				}else{
					header.removeClass('header-dark');
				}
				
			},
			init:function(){
				$(this.slides).on('mouseenter', function () {
					if( !desktop || $(this).is('.swiper-slide-active') ){
						return;
					}
					var curr_slide = $(this).prevAll('.swiper-slide').length;
					if(curr_slide>0){
						project_img_slider.slideTo(curr_slide);
					}
				}).on('mouseleave', function () {
					var curr_slide = project_slider.activeIndex;
					project_img_slider.slideTo(curr_slide);
				});
			}
		}
		
	});
	
	
	
	
	var project_img_slider_content = new Swiper('.project_img_slider_content', {
		slidesPerView: '1',
		effect: 'fade',
		allowTouchMove:false,
		fadeEffect: {
			crossFade: true
		},
		breakpoints: {
			767: {
				allowTouchMove:true,
			},
		},
	});
	
	var project_slider_content = new Swiper('.project_slider_content', {
		slidesPerView: 2,
		/*allowTouchMove:false,*/
		speed: 600,
		breakpoints: {
			767: {
				centeredSlides:true,
				slidesPerView: 1,
			},
			1149: {
				centeredSlides:false,
			}
		},
		navigation: {
			nextEl: '.slide_content_right',
			prevEl: '.slide_content_left',
		},
		on:{
			slideChange:function(){
				project_img_slider_content.slideTo(this.activeIndex);
			},
			init:function(){
				var self = this;
				$('.slide_content_left').on('click', function(){
					if(!desktop){
						return;
					}
					setTimeout(function () {
						project_img_slider_content.slideTo(self.activeIndex);
					}, 0);
				});

				$('.slide_content_right').on('click', function(){
					if(!desktop){
						return;
					}
					setTimeout(function () {
						project_img_slider_content.slideTo(self.activeIndex+1);
					}, 0);
				});

				$(this.slides).on('mouseenter', function () {
					if(!desktop){
						return;
					}
					var curr_slide = $(this).prevAll('.swiper-slide').length;
					project_img_slider_content.slideTo(curr_slide);
				});
			}
		},
	});
	
	var team_img_slider = new Swiper('.team_img_slider', {
		slidesPerView: '1',
		effect: 'fade',
		allowTouchMove:false,
		speed: 1000,
		fadeEffect: {
			crossFade: true
		},
		
	});
	
	var team_slider = new Swiper('.team_slider', {
		/*slidesPerView: 1,*/
		/*/!*autoHeight:true,*!/
		/!*allowTouchMove:false,*!/
		mousewheel: true,*/
		
		
		
		speed: 600,
		direction: 'vertical',
		slidesPerView: 'auto',
		/*autoHeight:true,*/
		mousewheel: true,
		/*freeMode: true,*/
		/*sensitivity:1,*/
		// freeModeMomentum: false,
		// freeModeMomentumBounce: false,
		// freeModeSticky:false,
		
		breakpoints: {
			767: {
			},
			1149: {
			}
		},
		on:{
			init: function () {
				/*team_slider.trigger( "click" );*/
			},
			slideChange:function(){
				team_img_slider.slideTo(this.activeIndex);
			},
		}
		
	});
	
	
	
	
	$('a[href*="#"]').on('click', function(e) {
		e.preventDefault()
		
		$('html, body').animate(
			{
				scrollTop: $($(this).attr('href')).offset().top,
			},
			500,
			'linear'
		)
	})
	
	var popup_request = $('.popup-request');
	
	$('#request_send').on('click', function () {
		popup_request.addClass('open');
	});
	$('.close_popup').on('click', function () {
		popup_request.removeClass('open');
	});
	
	
	$('.toggle-line').bind('click', function () {
		var parent = $(this).parent();
		
		if(parent.hasClass('active')){
			
			$(this).removeClass('cursor_white');
			$(this).addClass('hover-link');
			
			parent.removeClass('active');
			parent.find('.hidden-box').slideUp(300);
			/*$(this).parent().removeClass('active');*/
		}else{
			parent.find('.hidden-box').removeClass('.hidden').slideDown(300);
			parent.addClass('active');
			$(this).addClass('cursor_white');
			$(this).removeClass('hover-link');
		}
	});
	
	
	
	var hamburger = $('#hamburger');
	var filter = $('#filter');
	hamburger.on('click', function () {
		if($(this).is('.is-active')){
			$('.mobile-menu-FILTER,.mobile-menu').removeClass('open');
			$('body').removeClass('mobile_open');
			$(this).removeClass('is-active');
			return;
		}
		$(this).addClass('is-active');
		$('.mobile-menu').addClass('open');
		$('body').addClass('mobile_open');
	});

	$('.btn-FILTER').on('click', function () {
		$('.mobile-menu-FILTER').addClass('open');
		$('body').addClass('mobile_open');
	});
	
	filter.on('click', function () {
		$('.mobile-menu-FILTER').removeClass('open');
		$('body').removeClass('mobile_open');
	});
	
	
	function setBackgroundElems(elems) {
		elems.forEach(function(item, i, arr) {
			setBackground2(item);
		});
	}
	
	function setBackground2(elem) {
		var lPos  = [];
		var element = null;
		var bgImg  = '';
		
		if (typeof elem === 'object') {
			element = $(elem.el);
			bgImg  = elem.bgi;
		} else if (typeof elem === 'string') {
			element = $(elem);
			bgImg = 'url("../images/bg-svg.svg")'
		}
		
		if (elem) {
			lPos.push(Math.round(Math.random() * 100) + '% '
				+ Math.round(Math.random() * 100) + '%');//gen. position
			
			element.css('background-image', bgImg);
			element.css('background-size', '200%');
			element.css('background-position', lPos.join(', '));
		}
		
	}
	// element.css('background-image','url("../images/bg-svg3-dark.svg")');
	setBackgroundElems(
		[
			
			'.bg-svg',
			'#section1',
			'#section2',
			'#section3',
			'#section4',
			'.popup-portfolio-list',
			'.contact-wrapper-page .contact-bg',
			{el:'.bg-svg-dark', bgi:'url("../images/bg-svg-dark.svg")'},
			{el:'.bg-svg-grey', bgi:'url("../images/bg-svg-grey.svg")'},
			{el:'.bg-svg-red', bgi:'url("../images/bg-svg-red.svg")'},
		
		]
	);
	
	
	
	
	
	
	
	/* Tab */
	
	var tab_line = $('.tab-wrapper .control-line').closest('.tab-wrapper');

	
	
	$('.tab-widget').each(function(){
		var check_panel = $(this).find('.tab-btn'),
			tabs = $(this).find('.check-panel');
		
		check_panel.on('click', function () {
			tab_line.toggleClass('mobile-select-open');
			
			if ($(this).is('.active')){
				return;
			}
			
			var tab_name = $(this).attr('data-tab'),
				tabs_buttons = $(this).siblings('.tab-btn');
			
			tabs_buttons.removeClass('active');
			$(this).addClass('active');
			
			tabs.hide().filter('[data-panel="' + tab_name + '"]').fadeIn();
		});
		
		tabs.hide();
		check_panel.eq(0).trigger('click');
	});
	/*

	
	
	
	/**/
	class TextScramble {
		constructor(el, format) {
			this.el = el;
			this.fmtOutput = format;
			this.chars = "артфомул";//"!<>-_\\/[]{}—=+*^?#________";
			this.update = this.update.bind(this);
		}
		
		setText(newText, format) {
			const oldText = "";//this.el.innerText;
			const length = Math.max(oldText.length, newText.length);
			const promise = new Promise(resolve => (this.resolve = resolve));
			this.queue = [];
			
			for (var i = 0; i < length; i++) {
				const from = "";//oldText[i] || "";
				const to = newText[i] || "";
				const start = Math.floor(Math.random() * 10);
				const end = start + Math.floor(Math.random() * 50);
				
				this.queue.push({from, to, start, end});
			}
			cancelAnimationFrame(this.frameRequest);
			this.frame = 0;
			this.update();
			return promise;
		}
		
		update() {
			var output = "";
			var complete = 0;
			for (var i = 0, n = this.queue.length; i < n; i++) {
				
				var {from, to, start, end, char} = this.queue[i];
				
				if (this.frame >= end) {
					complete++;
					output += to;
				} else if (this.frame >= start) {
					if (!char || Math.random() < 0.38) {
						char = this.randomChar();
						this.queue[i].char = char;
					}
					output += `<span class="dud">${char}</span>`;
				} else {
					output += from;
				}
			}
			this.el.innerHTML = !!this.fmtOutput ? this.fmtOutput.replace('%s', output) : output;
			if (complete === this.queue.length) {
				this.resolve();
			} else {
				this.frameRequest = requestAnimationFrame(this.update);
				this.frame++;
			}
		}
		
		randomChar() {
			return this.chars[Math.floor(Math.random() * this.chars.length)];
		}
	}
});


