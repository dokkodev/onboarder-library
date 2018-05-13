$(document).ready(function(){


    function getRotated(){
        return $('.fixed_bar_rotate_screen').hasClass('rotated');
    }

    function getScale(){
        return parseInt($('.scale_dropdown_btn').text().slice(0,-1))/100;
    }

    function getDeviceDims(){
        list = [];
        list['Galaxy S5'] = [360,640];
        list['Pixel 2'] = [411,731];
        list['iPhone 6/7/8'] = [375,667];
        list['iPhone X'] = [375,812];
        list['iPad'] = [768,1024];
        list['iPad Pro'] = [1024,1366];

        device_dims = list[$('.device_dropdown_btn').text().slice(0,-1)];
        return device_dims;
    }

    function sizeIframe(){
        scale = getScale();
        device_dims = getDeviceDims();

        device_width = device_dims[0];
        device_height = device_dims[1];
        $('.phone_top').width(device_width*scale);
        $('.phone_bottom').width(device_width*scale);
        $('.phone_bottom').css('top',device_height*scale-10+'px');
        $('.iframe_div').width(device_width*scale);
        $('.iframe_div').height('auto');
        $('.anchor_div').css('margin-top',(20*(1-scale))+'px');
        $('.anchor_div').css('margin-left','0px');

        $('.speech_bubble_div').css('margin-top',(20*(1-scale))+'px');
        $('.speech_bubble_div').css('margin-left','0px');



        if (getRotated()){
            device_width = device_dims[1];
            device_height = device_dims[0];
            $('.phone_left').height(device_height*scale);
            $('.phone_right').height(device_height*scale);
            $('.phone_right').css('left',device_width*scale-10+'px');
            $('.iframe_div').height(device_height*scale);
            $('.iframe_div').width('auto');
            $('.anchor_div').css('margin-top','0px');
            $('.anchor_div').css('margin-left',(20*(1-scale))+'px');

            $('.speech_bubble_div').css('margin-top','0px');
            $('.speech_bubble_div').css('margin-left',(20*(1-scale))+'px');
        }


        $('#iframe').width(device_width);
        $('#iframe').height(device_height);
        $('.iframe_overlay').width(device_width);
        $('.iframe_overlay').height(device_height);
        $('.anchor_div').width(device_width);
        $('.anchor_div').height(device_height);
        $('.speech_bubble_div').width(device_width);
        $('.speech_bubble_div').height(device_height);

        $('#iframe').css('transform','translateX(-'+(1-scale)/2*100+'%) translateY(-'+(1-scale)/2*100+'%) scale('+scale+')');
        $('.iframe_overlay').css('transform','translateX(-'+(1-scale)/2*100+'%) translateY(-'+(1-scale)/2*100+'%) scale('+scale+')');
        $('.anchor_div').css('transform','translateX(-'+(1-scale)/2*100+'%) translateY(-'+(1-scale)/2*100+'%) scale('+scale+')');
        $('.speech_bubble_div').css('transform','translateX(-'+(1-scale)/2*100+'%) translateY(-'+(1-scale)/2*100+'%) scale('+scale+')');
    }


    $('.device_dropdown_btn').on('click',function(){
        $(this).toggleClass('clicked');
        if ($(this).hasClass('clicked')){
            $('.device_dropdown_content').css('display','block');
            $('.scale_dropdown_btn').removeClass('clicked');
            $('.scale_dropdown_content').css('display','none');
        }
        else{
            $('.device_dropdown_content').css('display','none');
        }
    });


    $('.device_dropdown_content .option').on('click',function(){
        var p = $(this).find('p');
        p.remove();
        $('.device_dropdown_btn').text($(this).text());
        $(this).append(p);
        $('.device_dropdown_btn').append("<div class='down_arrow'>▼</div>");
        $('.device_dropdown_btn').toggleClass('clicked');
        $('.device_dropdown_content').css('display','none');

        sizeIframe();
    });

    $('.scale_dropdown_btn').on('click',function(){
        $(this).toggleClass('clicked');
        if ($(this).hasClass('clicked')){
            $('.scale_dropdown_content').css('display','block');
            $('.device_dropdown_btn').removeClass('clicked');
            $('.device_dropdown_content').css('display','none');
        }
        else{
            $('.scale_dropdown_content').css('display','none');
        }
    });


    $('.scale_dropdown_content .option').on('click',function(){
        $('.scale_dropdown_btn').text($(this).text());
        $('.scale_dropdown_btn').append("<div class='down_arrow'>▼</div>");
        $('.scale_dropdown_btn').toggleClass('clicked');
        $('.scale_dropdown_content').css('display','none');

        sizeIframe();
    });





    sizeIframe();

    $('.phone_left').css('display','none');
    $('.phone_right').css('display','none');


    $('.fixed_bar_rotate_screen').on('click',function(){

        $(this).toggleClass('rotated');

        sizeIframe();

        if ($(this).hasClass('rotated')){
            //HORIZONTAL
            $('.phone_bottom').css('display','none');
            $('.phone_top').css('display','none');
            $('.phone_left').css('display','inline-block');
            $('.phone_right').css('display','inline-block');
            $('.section').css('display','block');
            $('.section').css('width','600px');
            $('.section').css('height','290px');
            $('.iframe_overlay').css('top','0');
            $('.iframe_overlay').css('left','20px');

        }
        else{
            //VERTICAL
            $('.phone_bottom').css('display','block');
            $('.phone_top').css('display','block');
            $('.phone_left').css('display','none');
            $('.phone_right').css('display','none');
            $('.section').css('display','inline-block');
            $('.section').css('height','550px');
            $('.section').css('width','300px');
            $('.iframe_overlay').css('top','20px');
            $('.iframe_overlay').css('left','0');
        }

        $('.scale_dropdown_btn').removeClass('clicked');
        $('.scale_dropdown_content').css('display','none');

        $('.device_dropdown_btn').removeClass('clicked');
        $('.device_dropdown_content').css('display','none');

    });

    $('.anchor_icon').attr('src','anchor_icon.jpg');

    var url = 'naver.html';
    $('#iframe').attr('src',url);

    $('#iframe').on('load',function(){
        $('.anchor_button').toggleClass('waiting');
    });

    $('.anchor_button').on('click',function(){
        if (!$('.anchor_button').hasClass('waiting')){
            $('.anchor_button').toggleClass('ON');
            if ($('.anchor_button').hasClass('ON')){
                $('.anchor_text').text('ANCHORING ON');
                // $('.anchor_text').css('color','#1A7448');

                // ANCHOR SELECTOR
                $('#iframe').contents().find('body').find('*').hover(
                    function(e){
                        e.stopPropagation();

                        var offset = $(this).offset();
                        offset['top'] += $('#iframe').position()['top'];
                        offset['left'] += $('#iframe').position()['left'];
                        var height = $(this).outerHeight();
                        var width = $(this).outerWidth();
                        var border_radius = $(this).css('border-radius');
                        var scrollTop = $('#iframe').contents().scrollTop();
                        var scrollLeft = $('#iframe').contents().scrollLeft();

                        $('.anchor').css('display','block');
                        $('.anchor').css('height',height-4);
                        $('.anchor').css('width',width-4);
                        $('.anchor').css('border-radius',border_radius);
                        $('.anchor').css('top',offset['top']-scrollTop+'px');
                        $('.anchor').css('left',offset['left']-scrollLeft+'px');
                        $('.anchor').css('display','block');
                    },
                    function(e){
                        e.stopPropagation();
                        $('.anchor').css('display','none');
                    }
                );

                $('#iframe').contents().find('body').find('*').on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $('.anchor').addClass('anchor_fix');
                    $('.anchor_fix').removeClass('anchor');

                    $('.anchor_text').text('SCREEN FROZEN');
                    // $('.anchor_text').css('color','#4286f4');
                    $('#iframe').attr('scrolling','no');

                    // $('.iframe_overlay').css('background-image','none');
                    // $('.iframe_overlay').css('display','block');
                    // $('.iframe_overlay').css('opacity','0.5');

                    var offset = $(this).offset();
                    offset['top'] += $('#iframe').position()['top'];
                    offset['left'] += $('#iframe').position()['left'];
                    var scrollTop = $('#iframe').contents().scrollTop();
                    var scrollLeft = $('#iframe').contents().scrollLeft();

                    var height = $('.speech_bubble').outerHeight();

                    $('.speech_bubble').css('display','block');
                    $('.speech_bubble').css('top',offset['top']-scrollTop-height-10+'px');
                    $('.speech_bubble').css('left',offset['left']-scrollLeft+'px');

                    console.log($(this).offset());
                    console.log($(this).css(''));
                    $(this).unbind('hover').hover();
                });

            }
            else{
                $('.anchor_text').text('ANCHORING OFF');

                $('.speech_bubble').css('display','none');

                // $('.anchor_text').css('color','#575B52');

                $('#iframe').attr('scrolling','auto');
                $('.anchor_fix').addClass('anchor');
                $('.anchor').removeClass('anchor_fix');
                $('.anchor').css('display','none');

                // RELOAD IFRAME
                $('.anchor_button').toggleClass('waiting');
                $('#iframe').attr( 'src', function ( i, val ) { return val; });
            }
        }
    });

    //   $('.bubble').on('click',function(){
    //   	var clone = $(this).clone();
    //   	$('.anchor_fix').after(clone);
    //   	clone.css('position','absolute');
    //   	clone.css('margin','0');
    // var offset = $('.anchor_fix').position();
    // clone.css('top',offset['top']-65+'px');
    // clone.css('left',offset['left']);
    //   });

    //NEW ONBOARDING
    function new_onboarding(div, new_name, icon){
        var input = $("<input class='new_onboarding_input'/>");
        div.before(icon);
        div.before(input);

        input.val(new_name);
        input.focus();

        function focus_off(){
            var new_onboarding_name = $('.new_onboarding_input').val();
            if (new_onboarding_name==''){
                new_onboarding_name = 'Untitled Onboarding';
            }

            var onboarding_div = $("<div class='onboarding'></div>");

            var name = $("<div class='name'>"+new_onboarding_name+"</div>");
            name.on('click',function(){
                $('.onboarding').removeClass('selected');
                if (!$(this).parent().hasClass('selected')){
                    $(this).parent().addClass('selected');
                }
                show_section($(this).parent().find('.icon'));
            });
            var delete_button = $("<img class='delete_onboarding' />");
            delete_button.attr('src','delete_icon.png');
            delete_button.on('click',function(){
                $(this).parent().remove();
            });

            var edit_button = $("<img class='edit_onboarding' />");
            edit_button.attr('src','edit_icon.png');
            edit_button.on('click',function(){
                new_onboarding($(this).parent(),$(this).parent().find('.name').text(),icon);
                $(this).parent().remove();
            });

            icon.css('margin-left','0');
            onboarding_div.append(icon);
            onboarding_div.append(name);
            onboarding_div.append(delete_button);
            onboarding_div.append(edit_button);

            $('.onboarding').removeClass('selected');
            if (!onboarding_div.hasClass('selected')){
                onboarding_div.addClass('selected');
            }

            $('.new_onboarding_input').replaceWith(onboarding_div);
        }

        input.on('keypress',function(e){
            if (e.which == 13){
                focus_off();
            }
        });

        input.focusout(focus_off);

    }

    function show_section(icon){
        $('._section').css('display','none');
        if (icon.attr('id')=='popup'){
            $('.popup._section').css('display','inline-block');
        }
        else if (icon.attr('id')=='swipe_screen'){
            $('.swipe_screen._section').css('display','inline-block');
        }
        else{
            $('.bubble._section').css('display','inline-block');
        }
    }


    function new_onboarding_onclick(){
        choose_div = $("<div class='choose_div'></div>");
        var popup_icon = $("<div class='choose_icon' id='popup'><img src='popup_icon.png' /></div>");
        var swipe_screen_icon = $("<div class='choose_icon' id='swipe_screen'><img src='swipe_screen_icon.png' /></div>");
        var speech_bubble_icon = $("<div class='choose_icon' id='speech_bubble'><img src='speech_bubble_icon.png' /></div>");
        function choose_icon(div){
            var icon_src = div.find('img').attr('src');
            var icon = $("<img class='icon' />");
            icon.attr('id',div.attr('id'));
            icon.attr('src',icon_src);
            if (div.attr('id') == 'popup'){
                console.log('popup');
            }
            else if (div.attr('id') == 'swipe_screen'){
                $('.iframe_overlay').css('display','none');
                console.log('swipe_screen');
            }
            else if (div.attr('id') == 'speech_bubble'){
                $('.iframe_overlay').css('display','none');
                console.log('speech_bubble');
            }
            show_section(icon);

            div.parent().remove();
            var new_onboarding_button = $("<div class='new_onboarding'>+ New Onboarding Screen</div>");
            new_onboarding_button.on('click',new_onboarding_onclick);
            $('.onboarding_group').append(new_onboarding_button);
            new_onboarding(new_onboarding_button,'',icon);
        }
        choose_div.append(popup_icon);
        choose_div.append(swipe_screen_icon);
        choose_div.append(speech_bubble_icon);

        $('.new_onboarding').replaceWith(choose_div);

        $('.choose_icon').on('click',function(){
            choose_icon($(this));
        });

        popup_icon.hover(function(){
            $('.iframe_overlay').css('display','block');
            $('.iframe_overlay').css('background', '#000000 url("popup_image.png") no-repeat right top');
            $('.iframe_overlay').css('background-size','contain');
        },function(){
            $('.iframe_overlay').css('display','none');
        });
        swipe_screen_icon.hover(function(){
            $('.iframe_overlay').css('display','block');
            $('.iframe_overlay').css('background', '#000000 url("swipe_image.png") no-repeat right top');
            $('.iframe_overlay').css('background-size','contain');
        },function(){
            $('.iframe_overlay').css('display','none');
        });
        speech_bubble_icon.hover(function(){
            $('.iframe_overlay').css('display','block');
            $('.iframe_overlay').css('background', '#000000 url("highlight_image.png") no-repeat right top');
            $('.iframe_overlay').css('background-size','contain');
        },function(){
            $('.iframe_overlay').css('display','none');
        });

    }

    $('._section').css('display','none');

    $('.new_onboarding').on('click',new_onboarding_onclick);


    function edit_property(div){
        var input = $("<input class='edit_property_value_input'/>");
        div.before(input);
        input.focus();
        input.val(div.text());
        div.remove();

        function focus_off(){
            var property_value = $('.edit_property_value_input').val();
            var property_value_div = $("<div class='property_value'>"+property_value+"</div>");
            property_value_div.on('click',function(){
                edit_property($(this));
            });
            $('.edit_property_value_input').replaceWith(property_value_div);
        }

        input.on('keypress',function(e){
            if (e.which == 13){
                focus_off();
            }
        });

        input.focusout(focus_off);
    }
    $('.property_value').on('click',function(){
        edit_property($(this));
    });

    //INIT SECTIONS
    var slider = $('.section .slider');

    slider.on('input',function(){
        $('.iframe_overlay').css('opacity',this.value/100)
        console.log(this.value/100);
    });

    $('.position_dropdown_btn').on('click',function(){
        console.log('blah');
        $(this).toggleClass('clicked');
        if ($(this).hasClass('clicked')){
            $('.position_dropdown_content').css('display','block');
            // $('.position_dropdown_btn').removeClass('clicked');
            // $('.position_dropdown_content').css('display','none');
        }
        else{
            $('.position_dropdown_content').css('display','none');
        }
    });


    $('.position_dropdown_content .option').on('click',function(){
        $('.position_dropdown_btn').text($(this).text());
        $('.position_dropdown_btn').append("<div class='down_arrow'>▼</div>");
        $('.position_dropdown_btn').toggleClass('clicked');
        $('.position_dropdown_content').css('display','none');
    });

    $('.add_screen_btn').on('click',function(){
        var num = $(this).attr('number');
        var temp_div = $("<div class='property_row'><div class='property_name'>Image "+num+"</div><input type='file' class='file_input'></div></div>");
        $(this).attr('number',parseInt(num)+1);
        $(this).parent().find('.screen_list').append(temp_div);

    })

    $('.bubble_text').on('input',function(){
        $('.speech_bubble').text($(this).val());
        console.log($(this).val());
    });

    $('.save_button').on('click',function(){
        console.log('blahs');
    });
    // $('#URL').keypress(function(e){
    // 	if (e.which == 13){
    // 		var url = location.protocol+'//'+location.hostname+'/naver.html';
    // 		$('#iframe').attr('src',url);
    // 		console.log(url);
    // 		// console.log($($('#iframe').get(0).contentDocument).find('#query'));
    // 	}
    // });

    //SIDE BAR SWITCH
    // $('.side_bar_switch').on('click',function(){
    // 	if ($('.side_bar').hasClass('opened')){
    // 		$('.side_bar').css('width','30px');
    // 		$(this).html('>');
    // 	}
    // 	else{
    // 		$('.side_bar').css('width','300px');
    // 		$(this).html('<');
    // 	}
    // 	$('.side_bar').toggleClass('opened');
    // });


    //DRAG DIV
    //Make the DIV element draggagle:
    // dragElement(document.getElementById(("mydiv")));
    // $('#mydiv').resizable();

    // function dragElement(elmnt) {
    // 	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // 	if (document.getElementById(elmnt.id + "header")) {
    // 		/* if present, the header is where you move the DIV from:*/
    // 		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    // 	}
    // 	else {
    // 		/* otherwise, move the DIV from anywhere inside the DIV:*/
    // 		elmnt.onmousedown = dragMouseDown;
    // 	}

    // 	function dragMouseDown(e) {
    // 		e = e || window.event;
    // 		// get the mouse cursor position at startup:
    // 		pos3 = e.clientX;
    // 		pos4 = e.clientY;
    // 		document.onmouseup = closeDragElement;
    // 		// call a function whenever the cursor moves:
    // 		document.onmousemove = elementDrag;
    // 	}

    // 	function elementDrag(e) {
    // 		e = e || window.event;
    // 		// calculate the new cursor position:
    // 		pos1 = pos3 - e.clientX;
    // 		pos2 = pos4 - e.clientY;
    // 		pos3 = e.clientX;
    // 		pos4 = e.clientY;
    // 		// set the element's new position:
    // 		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    // 		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    // 	}

    // 	function closeDragElement() {
    // 		/* stop moving when mouse button is released:*/
    // 		document.onmouseup = null;
    // 		document.onmousemove = null;
    // 	}
    // }

});