$(function() {
    // make code pritty
    $('pre:has(code:not(.language-txt))').addClass('prettyprint');
    window.prettyPrint && prettyPrint();

    var links = $("header nav.navlink a");
    var loc = window.location.href;
    links.each(function(index, item) {
        var split = item.href.split("#");

        if(split.length == 2) {
            var target = $("#" + split[1]);
            if(target) {
                if(window.location.hash == ('#' + split[1]))
                    $(item).addClass("link-selected");

                var duration = 1000;
                $(item).click(function(e) {
                    links.each(function(index, link) {
                        $(link).removeClass("link-selected");
                    });
                    $(this).addClass("link-selected");
                    e.preventDefault();
                    var offset = target.offset();
                    $("body,html,document").animate({scrollTop: offset.top}, {
                        "duration": duration,
                        "complete": function() {
                            var div = $("<div style='height: 101%;'></div>");
                            $("body").append(div);
                            setTimeout(function() {
                                div.remove();
                                window.location.hash = "#" + split[1];
                            }, 100);
                        }
                    });
                    return false;
                });
            }
        }
    });
    
});


$(function(){

    $.fn.shuffle = function() {
        return this.each(function(){
            var items = $(this).children().clone(true);
            return (items.length) ? $(this).html($.shuffle(items)) : this;
        });
    }
    
    $.shuffle = function(arr) {
        for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }

     $('#authors').shuffle();
    
});

/*** DEVKIT ***/
$(function() {
    var galleryDiv = $("#devkit-gallery");

    $("#devkit-buttons").children().hover(function() {
            galleryDiv.removeClass();
            galleryDiv.addClass( "gallery-" + $(this).attr('id') );
    });
    
});

$(window).load(function() {
  $('.flexslider').flexslider({
    animation: "slide",
    slideshow: true
  });
});




