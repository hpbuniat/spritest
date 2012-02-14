window.spriteConfig = null;
(function($) {
    $.spriteReader = function(target) {
        var classes = $.getClasses(),
            aClasses,
            namespace = target.data('namespace'),
            i, k,
            additionalClass = target.data('class');

        for (i in classes) {
            aClasses = classes[i].split(' ');
            for (k in aClasses) {
                if (namespace.length === 0 || aClasses[k].indexOf(namespace) > -1) {
                    target.append('<div class="' + additionalClass + ' ' + aClasses[k].substr(1) + '" />');
                }
            }
        }
    };

    $.getClasses = function() {
        var sheet, rules, decl, i, k, classes = [];
        for (sheet = 0; sheet < document.styleSheets.length; sheet++) {
            rules = document.styleSheets[sheet].cssRules ? document.styleSheets[sheet].cssRules : document.styleSheets[sheet].rules;
            for (i = 0; i < rules.length; i++) {
                decl = rules[i].style;
                for (k = 0; k < decl.length; k++) {
                    if (decl[k] === "background-position") {
                        classes.push(rules[i].selectorText);
                    }
                }
            }
        }

        return classes;
    };

    $.loadSprite = function(sName) {
        var c = window.spriteConfig[sName],
            head = $('head');

        $('<div/>', {
            "id" : "spritest",
            "class" : "fll",
            "data-namespace" : c.namespace,
            "data-class": c.class
        }).appendTo($('#container').empty());
        $('style[data-sprite="true"],link[data-sprite="true"]').remove();
        $('<link/>', {
            "data-sprite" : "true",
            "rel" : "stylesheet",
            "type" : "text/css",
            "href" : c.href,
            "media" : "all"
        }).appendTo(head).load(function() {
            $.spriteReader($('#spritest'));
        });
        head.append('<style data-sprite="true" type="text/css">#spritest div {' + c.style + '}</style>');
    };
})(jQuery);

$(function() {
    var nav = $('#nav'),
        hash = window.location.hash;
    $.getJSON('sprites.json', function(d) {
        window.spriteConfig = d;
        $.each(d, function(k, v) {
            $('<h3><a href="#' + k + '">' + v.title + '</a></h3>').appendTo(nav);
        });

        $('a', nav).click(function() {
            $.loadSprite(jQuery(this).attr('href').substr(1));
        });

        if (hash !== '' && hash !== '#') {
            $.loadSprite(hash.substr(1));
        }
    });
});