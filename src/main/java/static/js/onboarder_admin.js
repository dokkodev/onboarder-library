var iFrameAlreadyLoaded = false;

// 지금 현재 맥시멈 인덱스
var maxOrderIndex = 0;

// 지금 포커스 되어 있는 온보딩 인덱스
var currentOrder = -1;

// 지금 포커스 되어 있는 온보딩 정보들 (위의 current order 와 중복)
var focusOnboarding = {};

var current_url="";

// global 변수 JSON, 페이지 로딩 될때 ($('#iframe').on('load'... 참조) 값이 바뀐다. (밑에는 그냥 format 보여주기 용)
var globalJSON = {
    "url": "naver.html",
    "onboardings": [
        {
            "order":"1",
            "type":"Swipe",
            "name": "blah3",
            "image_url": "swipe1.png"
        },

        {
            "order":"2",
            "type":"Swipe",
            "name": "blah5",
            "image_url": "swipe3.png"
        },
        {
            "order":"3",
            "type": "Sequence",
            "name": "blah",
            "content": "This section allows users to select the type of article they want to view (in this case, sports).",
            "selector": "a",
            "index": "27"
        },
        {
            "order":"4",
            "type":"Swipe",
            "name": "blah4",
            "image_url": "swipe2.png"
        },
        {
            "order":"5",
            "type": "Sequence",
            "name": "blah2",
            "content": "This section shows the current most popular search keyword. :)",
            "selector": "h3",
            "index": "1"
        }
    ]
};

// 현재 포커스를 글로벌에 저장하고 새로운 포커스로 전환한다.
function changeFocus(index) {

    console.log("changing focus to : ", index);
    console.log("current Order: ", currentOrder);

    if (currentOrder != -1 && index != -1) {
        globalJSON.onboardings[currentOrder] = focusOnboarding;
    }
    currentOrder = index;

    if (index != -1) {
        focusOnboarding = globalJSON.onboardings[currentOrder];
    } else {
        focusOnboarding = {};
    }

    console.log("new focus : ", focusOnboarding);

}

// 삭제 버튼을 누르면 오더가 망가짐으로 리셋해야 정상적으로 작동한다.
function resetGlobalsOnDelete(index) {
    globalJSON.onboardings.splice(index, 1);
    changeFocus(-1);
}

// 온보딩들을 UI 에 그린다.
function load_onboardings(onboardingJSONS){
    globalJSON = onboardingJSONS;

    if (!onboardingJSONS) {
        globalJSON = {};
        globalJSON.onboardings = [];
        globalJSON.url = current_url;
    }

    else {
        globalJSON.url = onboardingJSONS['url'];
    }
    $(".onboarding").remove();

    // 각 온보딩에 대해서
    globalJSON['onboardings'].forEach(function(element){
        var icon_src = '';
        var id = '';

        if (element.order > maxOrderIndex) {
            maxOrderIndex = element.order;
        }

        if (element['type']=='Sequence'){
            icon_src = 'speech_bubble_icon.png';
            id = 'speech_bubble';
            // console.log(element['content']);
            // console.log(element['selector']);
            // console.log(element['index']);
        }
        else{
            icon_src = 'swipe_screen_icon.png';
            id = 'swipe_screen';
            // console.log(element['image_url']);
        }

        var icon = $("<img class='icon' />");
        icon.attr('src',icon_src);
        icon.attr('id',id);

        var onboarding_div = $("<div class='onboarding'></div>");
        onboarding_div.data('index', element.order);
        console.log(onboarding_div.data('index'));

        var name = $("<div class='name'>"+element['name']+"</div>");

        // 해당 온보딩을 클릭했을때 해줘야 하는 것들
        name.on('click',function(){
            $('.onboarding').removeClass('selected');
            if (!$(this).parent().hasClass('selected')){
                $(this).parent().addClass('selected');
            }
            //var index = $(this).parent().index()-1;

            // focus 전환
            console.log(onboarding_div.data('index'));
            changeFocus(onboarding_div.data('index'));

            // UI 보여주기
            show_section($(this).parent().find('.icon'),element.order);

            console.log(currentOrder);
        });
        var delete_button = $("<img class='delete_onboarding' />");
        delete_button.attr('src','delete_icon.png');

        // delete 버튼 누르면 ui 에서도 지우고 json 에서도 지운다.
        delete_button.on('click',function(){
            $(this).parent().remove();
            resetGlobalsOnDelete(onboarding_div.data('index'));

            for (var i = 0; i < globalJSON.onboardings.length; i++) {
                globalJSON.onboardings[i].order = i;
            }
            maxOrderIndex--;
        });

        var edit_button = $("<img class='edit_onboarding' />");
        edit_button.attr('src','edit_icon.png');
        // edit 버튼 누르면 역시 focus change 한다.
        edit_button.on('click',function(){
            changeFocus(onboarding_div.data('index'));
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

        $('.new_onboarding').before(onboarding_div);

        show_section(icon, element.order);

    });

}

// 새로운 온보딩을 만드는 function
function new_onboarding(div, new_name, icon){
    var input = $("<input class='new_onboarding_input'/>");
    div.before(icon);
    div.before(input);

    input.val(new_name);
    input.focus();

    // 새로운 온보딩 div 의 focus 가 off 됫을때 부르는 함수
    function focus_off(){
        var new_onboarding_name = $('.new_onboarding_input').val();
        if (new_onboarding_name==''){
            new_onboarding_name = 'Untitled Onboarding';
        }

        var onboarding_div = $("<div class='onboarding'></div>");
        onboarding_div.data('index', focusOnboarding.order);


        var name = $("<div class='name'>"+new_onboarding_name+"</div>");

        // 얘를 다시 누르면 포커스도 바꿔주고 섹션도 보여주자
        name.on('click',function(){
            $('.onboarding').removeClass('selected');
            if (!$(this).parent().hasClass('selected')){
                $(this).parent().addClass('selected');
            }
            //var index = $(this).parent().index()-1;
            changeFocus(onboarding_div.data('index'));
            show_section($(this).parent().find('.icon'),onboarding_div.data('index'));
        });
        var delete_button = $("<img class='delete_onboarding' />");
        delete_button.attr('src','delete_icon.png');
        delete_button.on('click',function(){
            $(this).parent().remove();
            resetGlobalsOnDelete(onboarding_div.data('index'));

            for (var i = 0; i < globalJSON.onboardings.length; i++) {
                globalJSON.onboardings[i].order = i;
            }
            maxOrderIndex--;
        });

        var edit_button = $("<img class='edit_onboarding' />");
        edit_button.attr('src','edit_icon.png');
        edit_button.on('click',function(){
            changeFocus(onboarding_div.data('index'));
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

        //JSON WRITE NAME
        focusOnboarding.name = new_onboarding_name;
        if (!globalJSON) {
            globalJSON = {};
            globalJSON.onboardings = [];
            //TODO
            globalJSON.url = url;
        }

        if(globalJSON.onboardings[focusOnboarding.order]) {
            console.log("Replacing");
            globalJSON.onboardings[focusOnboarding.order] = focusOnboarding;
        } else {
            console.log("Pushing");
            globalJSON.onboardings.push(focusOnboarding);
        }

        $('.new_onboarding_input').replaceWith(onboarding_div);
        show_section(icon, focusOnboarding.order);
    }

    // 엔터 누르면 포커스 오프
    input.on('keypress',function(e){
        if (e.which == 13){
            focus_off();
        }
    });

    // 다른데 클릭해도 포커스 오프
    input.focusout(focus_off);

}

// 온보딩을 중앙화면에 그려줌
function show_section(icon,index){
    $('._section').css('display','none');
    $('.anchor_fix').css('display', 'none');

    if (icon.attr('id')=='popup'){
        $('.popup._section').css('display','inline-block');
    }
    else if (icon.attr('id')=='swipe_screen'){
        $('.swipe_screen._section').css('display','inline-block');
    }
    else{
        $('.bubble._section').css('display','inline-block');
    }

    // LOAD
    if (index>=0){

        // 인덱스로 globalJSON 에서 뽑아온다.
        var element = globalJSON['onboardings'][index];
        var type = element['type'];
        if(type=='Swipe'){
            //CLEAN
            $('.speech_bubble').css('display','none');
            $('.speech_bubble_div').find("img").remove();
            $('.speech_bubble_div').css('display','block');


            // image url 이 없을수도 있음
            if (element.image_url) {
                var img = $("<img src='" + element['image_url'] + "'>");
                img.css('width', '100%');
                $('.speech_bubble_div').append(img);
                $('.speech_bubble_div').css('margin-top', '20px');
            }


            console.log('blah');
        }
        else if(type=='Sequence'){
            //CLEAN
            $('.speech_bubble_div').find("img").remove();
            $('.speech_bubble_div').css('margin-top','4px');
            $('.speech_bubble').css('display','block');
            $('.speech_bubble_div').css('display','block');

            // console.log($('.speech_bubble').css('display'));
            $('.anchor').addClass('anchor_fix');
            $('.anchor_fix').removeClass('anchor');

            $('.anchor_text').text('SCREEN FROZEN');
            // $('.anchor_text').css('color','#4286f4');
            $('#iframe').attr('scrolling','no');


            if (element.selector) {
                var found_div = $('#iframe').contents().find(element['selector']+':eq('+element['index']+')');

                var offset = found_div.offset();
                offset['top'] += $('#iframe').position()['top'];
                offset['left'] += $('#iframe').position()['left'];
                var scrollTop = $('#iframe').contents().scrollTop();
                var scrollLeft = $('#iframe').contents().scrollLeft();

                var height = $('.speech_bubble').outerHeight();

                $('.speech_bubble').css('top',offset['top']-scrollTop-height-10+'px');
                $('.speech_bubble').css('left',offset['left']-scrollLeft+'px');

                $('.bubble_text').val(element['content']);
                $('.speech_bubble').text('');
                $('.speech_bubble').text(element['content']);
                // console.log(element['content']);
                // console.log(element['selector']);
                // console.log(element['index']);
            } else {
                $('.speech_bubble').css('display','none');
                $('.speech_bubble_div').css('display','none');
                $('.bubble_text').val('');
                $('.speech_bubble').text('');

            }
        }
        // console.log(JSON['onboardings_list'][index]);
    }
    //NEW
    else{
        //clean section

    }
}



$(document).ready(function(){


    // 요거 변형 가능하게 해야됨
    var url = 'naver.html';
    $(".url_text").val('naver.html');

    // saveOnboardings(JSON);
    // getOnboardings(JSON);



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

    $('#iframe').attr('src',url);

    // iframe 이 다 로딩되면 그때 온보딩 불러와야 함.
    $('#iframe').on('load',function(){

        // Added by Jae-Seo
        // TODO : 실제 서버코드에서는 윗줄 (getOnboardingsByUrl) 을 써야함 (load_onboardings 대신에)
        if (!iFrameAlreadyLoaded) {
            iFrameAlreadyLoaded = true;
            getOnboardingsByUrl(url);
            //load_onboardings(globalJSON);
        }
        $('.anchor_fix').css('display', 'none');

    });

    $('.anchor_button').on('click',function(){
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
                    $('.anchor_fix').css('display', 'block')
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

                    $('.speech_bubble_div').css('display', 'block');
                    $('.speech_bubble').css('display','block');
                    $('.speech_bubble').css('top',offset['top']-scrollTop-height-10+'px');
                    $('.speech_bubble').css('left',offset['left']-scrollLeft+'px');


                    // GET TAG TECHNOLOGY
                    var tag = $(this).prop("tagName");
                    var list = $('#iframe').contents().find(tag);

                    var this_var = $(this);
                    var index = 0;
                    list.each(function(i){
                        if ($(this).is(this_var)){
                            // console.log('yes');
                            return false;
                        }
                        else{
                            // console.log('no');
                        }
                        index++;
                    });

                    //JSON WRITE TAG(SELECTOR) AND INDEX
                    console.log(tag);
                    console.log(index);
                    focusOnboarding.selector = tag;
                    focusOnboarding.index = index;

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
                $('#iframe').attr( 'src', function ( i, val ) { return val; });
            }

    });

    // url 검색
    $('.url_submit').on('click', function () {
        var new_url = $(".url_text").val();
        url = new_url;
        current_url = new_url;
        iFrameAlreadyLoaded = false;
        focusOnboarding = {};
        currentOrder = -1;
        maxOrderIndex = 0;

        $('.speech_bubble_div').css('display', 'none');
        $('.speech_bubble_div').find("img").remove();
        $('.speech_bubble').css('display', 'none');
        $('._section').css('display','none');


        $('#iframe').attr('src', url);
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

    // new onboarding 버튼을 눌렀을때 일어나는 일들
    function new_onboarding_onclick(){
        $('.property_row').remove();
        choose_div = $("<div class='choose_div'></div>");
        var popup_icon = $("<div class='choose_icon' id='popup'><img src='popup_icon.png' /></div>");
        var swipe_screen_icon = $("<div class='choose_icon' id='swipe_screen'><img src='swipe_screen_icon.png' /></div>");
        var speech_bubble_icon = $("<div class='choose_icon' id='speech_bubble'><img src='speech_bubble_icon.png' /></div>");
        function choose_icon(div){
            var icon_src = div.find('img').attr('src');
            var icon = $("<img class='icon' />");
            icon.attr('id',div.attr('id'));
            icon.attr('src',icon_src);

            var divIdAttr = div.attr('id');

            if (divIdAttr == 'popup'){
                console.log('popup');
            }
            else if (divIdAttr == 'swipe_screen'){
                $('.iframe_overlay').css('display','none');
                console.log('swipe_screen');
            }
            else if (divIdAttr == 'speech_bubble'){
                $('.iframe_overlay').css('display','none');
                console.log('speech_bubble');
            }
            show_section(icon,-1);

            div.parent().remove();
            var new_onboarding_button = $("<div class='new_onboarding'>+ New Onboarding Screen</div>");
            new_onboarding_button.on('click',new_onboarding_onclick);
            $('.onboarding_group').append(new_onboarding_button);

            //JSON WRITE
            // focus onboarding init
            focusOnboarding = {
                "order": maxOrderIndex++,
                "type": divIdAttr == 'swipe_screen' ? 'Swipe' : 'Sequence'
            };

            // 지금 현재 맥시멈 + 1 를 index 로 부여
            currentOrder = maxOrderIndex;
            //CREATE NEW {}
            //WRITE TYPE

            // 실제 온보딩을 만들어 보자
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

        $('.speech_bubble_div').css('display', 'none');
        $('.speech_bubble_div').find("img").remove();
        $('.speech_bubble').css('display', 'none');

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

        $('.file_input').on("change", function() {

            var $files = $(this).get(0).files;

            if ($files.length) {

                // Reject big files
                if ($files[0].size > $(this).data("max-size") * 1024) {
                    console.log("Please select a smaller file");
                    return false;
                }

                // Begin file upload
                console.log("Uploading file to Imgur..");

                // Replace ctrlq with your own API key
                var apiUrl = 'https://api.imgur.com/3/image';
                var apiKey = 'eb13703ce2f6c42';

                var settings = {
                    async: false,
                    crossDomain: true,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    url: apiUrl,
                    headers: {
                        Authorization: 'Client-ID ' + apiKey,
                        Accept: 'application/json'
                    },
                    mimeType: 'multipart/form-data'
                };

                var formData = new FormData();
                formData.append("image", $files[0]);
                settings.data = formData;

                // Response contains stringified JSON
                // Image URL available at response.data.link
                $.ajax(settings).done(function(response) {
                    var ret = JSON.parse(response);
                    focusOnboarding.image_url = ret.data.link;
                    var img = $("<img src='" + focusOnboarding.image_url + "'>");
                    img.css('width', '100%');
                    $('.speech_bubble_div').append(img);
                    $('.speech_bubble_div').css('margin-top', '20px');
                    $('.speech_bubble_div').css('display', 'block');

                });


            }
        });

        //JSON WRITE
        //IMAGE URL
    });

    $('.bubble_text').on('input',function(){
        $('.speech_bubble').text($(this).val());

        //JSON WRITE content
        console.log($(this).val());
        focusOnboarding.content = $(this).val();
    });


});
