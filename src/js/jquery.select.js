/*  select  */
(function($){
	var sel_enter = false;
	$(document).on("mouseenter"," .select_wrapper",function(){
		sel_enter = true;
	}).on("mouseleave",".select_wrapper", function(){
		sel_enter = false;
	});


	var option_slide_up = function(){
		$(this).css({'overflow':'', 'height':''}).closest('.select_wrapper');
	};

	var sel_open = false;
	$(document).on("click",".select_wrapper .select", function(e){
		var options = $(this).closest('.select').next('.option_wrapper');
		if(options.is(":visible")){
			sel_open = false;
			options.stop().scrollTop(0).slideUp(300, option_slide_up).closest('.select_wrapper').removeClass('open');
		}else{
			sel_open = true;
			$(".option_wrapper").stop().scrollTop('0').slideUp(300, option_slide_up).closest('.select_wrapper').removeClass('open');
			options.stop().slideDown(300);
			$(this).closest('.select_wrapper').addClass('open').find('select').trigger('focus');
		}
	}).on("click", ".option", function(e, data){
		var parent = $(this).parent();
		parent.prev().find(".selected_text").text($(this).text());
		var select = parent.parent().find("select");
		var options = $("option", select);
		var need_select = $(this).prevAll(".option").length;
		var curr_selected = options.filter(':selected').prevAll('option').length;

		$(this).addClass('selected').siblings('.selected').removeClass('selected');

		if(need_select!=curr_selected){
			options.eq(need_select).prop("selected",true);

			if(data==undefined){
				select.trigger("change");
			}
		}
		sel_open = false;
		parent.stop().scrollTop(0).slideUp(300, option_slide_up).closest('.select_wrapper').removeClass('open');
	}).on("click",function(e){
		if(sel_enter==false && sel_open==true){
			$(".option_wrapper").stop().slideUp(300, option_slide_up).closest('.select_wrapper').removeClass('open');
		}
	});

	$.fn.select = function(options){
		this.each(function(){
			var parent = $(this).wrap($("<div/>",{'class':'select_wrapper'})).css("display","none").parent();

			$("<div/>", {'class':"select", html:
				'<div class="selected_text">'+$(this).find("option:selected").text()+'</div>'+
				'<div class="arrow"></div>'
			}).appendTo(parent);

			$("<div/>",{'class':"option_wrapper"}).appendTo(parent);

			var options_wrapper = parent.find(".option_wrapper");
			$(this).find("option").each(function(){
				$("<div/>", {'class':"option"+($(this).is(':selected') ? ' selected' : ''),text:$(this).text()}).appendTo(options_wrapper);
			});

			$(this).on('update', function(){
				var options = $(this).closest('.select_wrapper').find('.option_wrapper').find(".option");
				options.eq( $(this).find("option:checked").prevAll('options').length ).trigger('click', true);
			});

			return this;
		});
		return this;
	};
})(jQuery);