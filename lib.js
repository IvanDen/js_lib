//this library for jQuery
window.Collect = function(form)
{
    var data = {};

    form.find('input:visible, textarea:visible, input[type=hidden]').not('[type=file]').each(function() {
        var value = "";
        var name = $(this).attr('name');

        if (name)
        {
            if ($(this).is('[type=checkbox]'))
            {
                var checked = Number($(this).is(':checked'));
                value = ($(this).attr('id')) ? $(this).attr('id') : checked;

                if (data[name] != undefined)
                    data[name] = data[name] + "," + value;
                else
                    data[name] = value;
            }
            else if ($(this).is('[type=radio]'))
            {
                if ($(this).is(':checked'))
                {
                    value = $(this).val();
                    data[name] = value;
                }
            }
            else
            {
                value = ($(this).attr('data-value')) ? $(this).attr('data-value') : $(this).val();

                if (data[name] != undefined)
                {
                    if (value)
                        data[name] = data[name] + "," + value;
                }
                else
                {
                    data[name] = value
                }
            }
        }
    });

    console.log(data);

    return data;
}

window.Validate = function(wrap)
{
    var inputErrors = 0;
    $(wrap).find('input:visible.js-required, textarea:visible.js-required').each(function() {
        if (!$(this).val())
        {
            $(this).parent().addClass('js-invalid error');
            $(this).parent().find('.js-block-error').slideDown(300);

            inputErrors++;
        }
        else
        {
            if ($(this).hasClass('js-email'))
            {
                if (!EmailValidate($(this).val()))
                {
                    $(this).parent().addClass('js-invalid error');
                    $(this).parent().find('.js-block-error').slideDown(300);

                    inputErrors++;
                }
            }

            if ($(this).attr('name') == "password-confirm")
            {
                var passValue = $(this).parents('.js-form').find('input[name=password]').val();
                if (passValue != $(this).val())
                {
                    $(this).parent().addClass('js-invalid error');
                    inputErrors++;
                }
            }
        }
    });

    if (inputErrors > 0)
    {
        return false;
    }
    else
    {
        $('.js-invalid').parent().find('.js-block-error').slideUp(300);
        $('.js-invalid').removeClass('js-invalid error');

        return true;
    }
}

function Inputs()
{
    $('input, textarea').on('keydown change', function() {
        $(this).parent().removeClass('js-invalid, error');
    });
}

function EmailValidate(email)
{
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(email);
}

window.OpenModal = function(modal, closeall = true)
{
    var modal = $(modal);

    //Close all modals
    if (closeall)
    {
        $('.js-modal').fadeIn(100).hide();
        $('.js-modal').find('.js-modal-content').stop().css('transform', 'scale(0)')
    }

    //Open the called
    setTimeout(function () {
        modal.stop().show();
    }, 30);

    setTimeout(function () {
        modal.find('.js-modal-content').stop().css('transform', 'scale(1)');
        modal.css('opacity', '1');
    }, 60);
}

// Shows a hint when hovering over items
function HintCursor()
{
    $('.js-tip-el').mousemove(function (event)
    {
        var input = $(this);
        var dataTextTip = $(this).attr('data-hint');

        //If there is an asset class and the text would be passed to the variable from the attribute.
        //or if it has a hint class and the text was passed to the variable from the attribute
        if (input.hasClass('js-hint') && dataTextTip)
        {
            $('.js-hint-text').text(dataTextTip).css({
                "top": event.pageY-20,
                "left": event.pageX+5
            }).show().addClass('active');
        }
    }).mouseout(function () {
        $('.js-hint-text').text("")
            .css({
                "top": 0,
                "left": 0
            }).hide().removeClass('active');
    });
}

window.OpenPopup = function ()
{
    $('.js-close-modal').click(function() {
        $(this).parents('.js-modal').fadeOut(500);

    });

    $('.js-open-modal').click(function(event) {
        var modal = $($(this).attr('data-modal'));
        modal.fadeIn(500);
    });

    $('.js-close-modal-no-child').on('mousedown', function(e) {
        var body = $('body');
        var scrollY = body.css('top');

        if (e.target !== this)
            return;

        if ($(this).hasClass('js-modal')){
            $(this).fadeOut(500);
        }

        $(this).parents('.js-modal').fadeOut(500);

    });
}

window.DropMenu = function()
{
    $('.js-burger-menu').on('click', function() {
        console.log("dropted");
        var textAttr = $(this).find('.js-span-attr').attr('data-attribute');
        var textSpan = $(this).find('.js-span-attr').text();

        if ($(this).hasClass('dropted')) {
            $(this).find('.js-menu-wrap').stop().slideUp(300, function ()
            {
                var menu = $(this).parents('.js-burger-menu');
                menu.find('.js-span-attr').text(textAttr);
                menu.find('.js-span-attr').attr('data-attribute', textSpan);
                menu.removeClass('dropted');
                menu.find('.image').removeClass('close');
            });
            return;
        }

        $(this).addClass('dropted');
        $(this).find('.js-span-attr').text(textAttr);
        $(this).find('.js-span-attr').attr('data-attribute', textSpan);
        $(this).find('.image').addClass('close');
        $(this).find('.js-menu-wrap').stop().slideDown(300);
    });

    $('html').on('click touchstart touchend', function (e) {

        var textAttr = $(this).find('.js-span-attr').attr('data-attribute');
        var textSpan = $(this).find('.js-span-attr').text();

        if ($(e.target).parents('.js-burger-menu').length == 0 && !$(e.target).hasClass('js-burger-menu'))
        {
            if($('.js-burger-menu').hasClass('dropted'))
                $('.js-menu-wrap').stop().slideUp(300, function ()
                {
                    var menu = $(this).parents('.js-burger-menu');
                    menu.find('.js-span-attr').text(textAttr);
                    menu.find('.js-span-attr').attr('data-attribute', textSpan);
                    menu.removeClass('dropted');
                    menu.find('.image').removeClass('close');

                });
        }
    });
}

window.SlideContent = function()
{
    $('.js-tab').on('click', function () {
        var name;
        var wrap = $(this).parents('.js-tabs-wrap');
        var eventName = $(this).attr('name');

        if ($(this).hasClass('active'))
        {
            return false;
        }
        else
        {
            wrap.find('.js-content').each(function ()
            {
                if ($(this).hasClass('active'))
                {
                    $(this).hide();
                    $(this).removeClass('active');
                }
                wrap.find('.js-tab').removeClass('active');
            });
            name = $(this).attr('name');

            wrap.find('.js-tab').each(function ()
            {
                if ($(this).is('[name=' + eventName + ']'))
                {
                    $(this).addClass('active');
                }
            });

            $(this).addClass('active');
            wrap.find('.js-' + name).show().addClass('active');
        }
    });
}

//Adds an asset class active to the list-group (user/Category page) depending on the open page.
window.NavMenuActive = function ()
{
    var pageName;
    if ($('.js-tab-page').length > 0) {
        var pageName = $('.js-tab-page:visible').attr('data-attribute');
    }


    $('.js-li-item').each(function () {
        var listAttr = $(this).attr('data-attribute');
        if(pageName == listAttr) {
            $(this).addClass('active');
        }
    });
}
//Displays a message if the file was uploaded successfully.
window.checkFileLoaded = function()
{
    $(".js-id-file").change(function (){
        var wrap = $(this).parent('.js-upload-wrap');
        var fileName = $(this).val();
        wrap.find('.js-img-name').text(fileName);
        console.log("fileName", fileName);
        if (fileName)
        {
            wrap.find('.js-upload-img').hide();
            wrap.find('.js-correct').show();
        }
        else {
            wrap.find('.js-upload-img').show();
            wrap.find('.js-correct').hide();
        }

    });
}

//For this function to work correctly on touch devices, you need a swipe library
function Slider(sliderListWrap, onDisplay, toElem)
{
    var maxWight = 228;
    var minWight = 228;

    $('.' + sliderListWrap).find('.js-list > div').css('margin-left', '10px');
    $('.' + sliderListWrap).find('.js-list > div').css('margin-right', '10px');

    //IE
    toElem = toElem === undefined ? -1 : toElem;

    var sliderList = sliderListWrap+' .js-list';

    var marginRight = $('.'+sliderList+' > *').css('margin-right');
    var marginLeft = $('.'+sliderList+' > *').css('margin-left');

    /* marginRight = Number(marginRight.replace('px', ''));
     marginLeft = Number(marginLeft.replace('px', ''));*/

    marginRight = Number(parseInt(marginRight));
    marginLeft = Number(parseInt(marginLeft));

    /* console.log ("marginRight= ",marginRight);
     console.log ("marginLeft= ",marginLeft);*/

    var elemWidth = minWight + marginRight + marginLeft;

    var count = $('.'+sliderList+' > *').length;
    // console.log("elemWidth : " + elemWidth);

    // var wrapWidth = $('.'+sliderListWrap+' .js-full-wrap').width();
    var wrapWidth = elemWidth * onDisplay;

    // console.log("wrapWidth: " + wrapWidth);

    // var elemWidth = wrapWidth / onDisplay;

    // console.log('1 elemWidth : ' + elemWidth);

    while (elemWidth < minWight)
    {
        onDisplay--;
        elemWidth = wrapWidth / onDisplay;
    }

    var globalWrapWidth = $('.'+sliderListWrap).width();
    // wrapWidth = globalWrapWidth;

    // console.log('globalWrapWidth: ' + globalWrapWidth);
    // console.log("elemWidth: " + elemWidth);

    var sliderWidth = elemWidth * count;
    // console.log("sliderWidth: " + sliderWidth);


    var maxShift = count - onDisplay;
    // console.log("maxShift: " + maxShift);


    $('.'+sliderList+' > *').width(elemWidth - (marginRight + marginLeft));

    $('.'+sliderList).width(sliderWidth);

    if (toElem != -1)
        $('.'+sliderList).attr('data-current', toElem);

    var currentShift = parseInt($('.'+sliderList).attr('data-current'));
    if (currentShift > maxShift)
    {
        $('.'+sliderList).attr('data-current', maxShift);
        currentShift = maxShift;
    }

    // console.log("currentShift: " + currentShift);

    //Обновляем количество points
    var pointsCount = 1 + count - onDisplay;
    // console.log("pointsCount: " + pointsCount);

    $('.'+sliderListWrap).find('.js-points > *').remove();
    for (var i = 0; i < pointsCount; i++)
    {
        var pointTemplate = $('#js-point-template').clone();
        pointTemplate.removeAttr('id');
        $('.'+sliderListWrap).find('.js-points').append(pointTemplate);
    }
    $('.'+sliderListWrap).find('.js-points > *').eq(currentShift).addClass('active');

    //Сдвиг первоначальный
    $('.'+sliderList).css('margin-left', currentShift * -elemWidth);

    // console.log('------------------');

    $('.'+sliderListWrap+' .slider-list-wrap').width(wrapWidth);

    var currentShift = $('.'+sliderList).attr('data-current');

    function CheckCurrentShift()
    {
        if (currentShift >= 0 && currentShift <= count - onDisplay)
        {
            $('.'+sliderList).eq(0).css('margin-left', currentShift * -elemWidth);
            // console.log("Сдвиг первоначальный ", (currentShift * (-elemWidth)));

            $('.'+sliderList).attr('data-current', currentShift);

            //Переключаем пойнты
            $('.'+sliderListWrap).find('.js-points > *').removeClass('active');
            $('.'+sliderListWrap).find('.js-points > *').eq(currentShift).addClass('active');

            if (currentShift == 0)
                $('.' + sliderListWrap + ' .js-slide-to-left').addClass('noactive');
            else
                $('.' + sliderListWrap + ' .js-slide-to-left').removeClass('noactive');

            if (currentShift == count - onDisplay)
                $('.' + sliderListWrap + ' .js-slide-to-right').addClass('noactive');
            else
                $('.' + sliderListWrap + ' .js-slide-to-right').removeClass('noactive');
        }
    }

    $('.' + sliderListWrap + ' .js-slide-to-left, ' + '.' + sliderListWrap + ' .js-slide-to-right').off('click touchend');
    $('.' + sliderListWrap + ' .js-slide-to-left, ' + '.' + sliderListWrap + ' .js-slide-to-right').on('click touchend', function()
    {
        currentShift = $('.'+sliderList).attr('data-current');

        if ($(this).hasClass('js-slide-to-left'))
            currentShift--;
        else
            currentShift++;

        CheckCurrentShift();
    });

//-------Making an event for touchscreen devices-------
    function TouchSwipe()
    {
        var swipeWrap = $("."+sliderListWrap).find('.js-full-wrap');
        // console.log("swipeWrap ", swipeWrap);

        swipeWrap.off('swipeleft');
        swipeWrap.on('swipeleft',  function(){

            currentShift = $('.'+sliderList).attr('data-current');
            currentShift++;
            CheckCurrentShift();
        });

        swipeWrap.off('swiperight');
        swipeWrap.on('swiperight', function() {

            currentShift = $('.'+sliderList).attr('data-current');
            currentShift--;
            CheckCurrentShift();
        });
    }

    TouchSwipe();

    $('.'+sliderListWrap).find('.js-points > *').click(function() {
        $('.'+sliderListWrap).find('.js-points > *').removeClass('active');
        $(this).addClass('active');

        var currentShift = $(this).index();
        $('.'+sliderList).eq(0).css('margin-left', currentShift * -elemWidth);

        $('.'+sliderList).attr('data-current', currentShift);

        if (currentShift == 0)
            $('.' + sliderListWrap + ' .js-slide-to-left').addClass('noactive');
        else
            $('.' + sliderListWrap + ' .js-slide-to-left').removeClass('noactive');

        if (currentShift == count - onDisplay)
            $('.' + sliderListWrap + ' .js-slide-to-right').addClass('noactive');
        else
            $('.' + sliderListWrap + ' .js-slide-to-right').removeClass('noactive');

    });
}

//------The function starts the slider and adapts it depending on the screen size----
function sizeWindow()
{
    function myFunction(x) {

        if (x.matches) { // If media query matches
            Slider('js-slider-wrap', 1);
            Slider('js-slider-wrap-table', 1);
        } else {
            Slider('js-slider-wrap', 3);
            Slider('js-slider-wrap-table', 3);
        }
    }
    var x = window.matchMedia("(max-width: 820px)");
    myFunction(x); // Call listener function at run time
    x.addListener(myFunction); // Attach listener function on state changes
}

//When you press the button, new elements on the page that are currently hidden will be added.
function SeeMoreButton()
{
    $('#see_more').on('click', function (e)
    {
        e.preventDefault();
        $(".js-see-more:hidden").slice(0, 4).slideDown();
        if ($(".js-see-more:hidden").length == 0) {
            $("#see_more").fadeOut('slow');
        }
    });
}

function slideToggleElement()
{
    $('.js-answers-list .faq-question').click(function () {
        $(this).parent('div').find('.faq-answer').stop().slideToggle();
    });
}

function ScrollUp()
{
    if ($('.js-scroll-up').length > 0) {
        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function() {
            scrollFunction()
        };
    }


    function scrollFunction() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            $(".js-scroll-up").show();
        } else {
            $(".js-scroll-up").hide();
        }
    }

// When the user clicks on the button, scroll to the top of the document
    $('.js-scroll-up').click(function() {

        $('body,html').animate({scrollTop:0},800);

    });

    $('.js-paragraph').on('click','a', function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 800);
    });
}

function Dropboxes()
{
    $('.js-dropbox').on('click', function () {

        $('.js-dropbox').each( function ()
        {
            if ($(this).hasClass('active')) {
                $(this).find('.js-dropbox-drop').stop().slideUp(300, function ()
                {
                    $(this).parents('.js-dropbox').removeClass('active');
                });
            }
        });

        $(this).addClass('active');
        $(this).find('.js-dropbox-drop').stop().slideDown(300);
    });


    $('.js-dropbox-drop > *').on('click', function (event) {

        event.stopPropagation();

        if (!$(this).hasClass('js-item-name'))
        {
            var drop = $(this).parents('.js-dropbox');


            var text = $(this).text();

            if ($(this).attr('data-value'))
            {
                var value = $(this).attr('data-value');
                drop.find('input').attr("data-value", value);
            }

            if ($(this).attr('data-alt'))
            {
                var altValue = $(this).attr('data-alt');
                drop.find('input').attr("data-alt", altValue);
            }

            drop.find('input').val(text);
            if (!drop.find('.js-no-highlight').length)
            {
                drop.find('.js-arrow').addClass('remove');
                drop.find('input').addClass('active');
            }

            $(this).parents('.js-dropbox-drop').stop().slideUp(300, function ()
            {
                $(this).parents('.js-dropbox').removeClass('active');
            });
            drop.find('input').trigger('change');
        }
    });

    $('.js-arrow').on('click', function (event)
    {
        if ($(this).hasClass('remove'))
        {
            event.stopPropagation();

            var drop = $(this).parents('.js-dropbox');
            $(this).removeClass('remove');
            drop.find('input').val('');
            drop.find('input').attr('data-alt', '');
            drop.find('input').removeClass('active');
            drop.find('.js-dropbox-drop').stop().slideUp(300, function ()
            {
                $(this).parents('.js-dropbox').removeClass('active');
            });
            drop.find('input').trigger('change');
        }
        else
        {
            $(this).parents('.js-dropbox').addClass('active');
            $(this).find('.js-dropbox-drop').stop().slideDown(300);
        }
    });

    $('html').on('click', function (event) {
        if ($(event.target).parents('.js-dropbox').length == 0 && !$(event.target).hasClass('js-dropbox'))
        {
            $('.js-dropbox').removeClass('active');
            $('.js-dropbox-drop').stop().slideUp(300);
        }
    });
}