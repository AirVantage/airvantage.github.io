$(function() {
    var links = $("header nav.navlink a");
    var loc = window.location.href;
    links.each(function(index, item) {
        var split = item.href.split("#");

        if(split.length == 2) {
            console.log('---')
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
                                window.location.href = loc + "#" + split[1];
                            }, 100);
                        }
                    });
                    return false;
                });
            }
        }
    });
    
});