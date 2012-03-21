/* use jquery as container */
(function($) {
    $.spritest = {
        /* the configuration */
        config: null,
        /**
         * Create all element container
         *
         * @param target-container
         */
        createElements: function(target) {
            var i, k, aClasses,
                classes = this.getClasses(),
                namespace = target.data('namespace'),
                additionalClass = target.data('class');

            for (i in classes) {
                aClasses = classes[i].split(' ');
                for (k in aClasses) {
                    if (namespace.length === 0 || aClasses[k].indexOf(namespace) > -1) {
                        target.append('<p class="title">' + aClasses[k].substr(1) + '</p><div title="' + aClasses[k].substr(1) + '" class="' + additionalClass + ' ' + aClasses[k].substr(1) + '" />');
                    }
                }
            }

            return this;
        },
        /**
         * Read all stylesheet rules and pre-filter those containing a "background-position"
         *
         * @returns {Array}
         */
        getClasses: function() {
            var sheet, rules, decl, i, k, classes = [], bFound;
            for (sheet = 0; sheet < document.styleSheets.length; sheet++) {
                rules = document.styleSheets[sheet].cssRules ? document.styleSheets[sheet].cssRules : document.styleSheets[sheet].rules;
                for (i = 0; i < rules.length; i++) {
                    decl = rules[i].style;
                    bFound = false;
                    for (k = 0; k < decl.length; k++) {
                        if (decl[k] === "background-position" && rules[i].style.backgroundPosition.match(/\d/)) {
                            classes.push(rules[i].selectorText);
                            bFound = true;
                        }
                    }

                    if (bFound === false) {
                        rules[i].style.backgroundPosition = '';
                    }
                }
            }

            return classes;
        },
        /**
         * Load a specific test-view
         *
         * @param string sName
         */
        load: function(sName) {
            var c = this.config[sName],
                head = $('head'),
                me = this;

            /* (re-)create the element container */
            $('<div/>', {
                "id" : "spritest",
                "class" : "fll",
                "data-namespace" : c.namespace,
                "data-class": c.classname
            }).appendTo($('#container').empty());

            /* remove all existing stylesheets */
            $('style[data-sprite="true"],link[data-sprite="true"]').remove();

            /* add the specific stylesheet to the dom */
            $('<link/>', {
                "data-sprite" : "true",
                "rel" : "stylesheet",
                "type" : "text/css",
                "href" : c.href,
                "media" : "all"
            }).appendTo(head).load(function() {
                me.createElements($('#spritest'));
            });
            head.append('<style data-sprite="true" type="text/css">#spritest div {' + c.style + '}</style>');
        },
        /**
         * Init spritest - callback for $.getJSON
         *
         * @param  object The configuration
         */
        init: function(value) {
            var nav = $('#nav'),
                hash = window.location.hash,
                me = this;

            me.config = value;
            $.each(me.config, function(k, v) {
                $('<h3><a href="#' + k + '">' + v.title + '</a></h3>').appendTo(nav);
            });

            $('a', nav).click(function() {
                me.load($(this).attr('href').substr(1));
            });

            if (hash !== '' && hash !== '#') {
                me.load(hash.substr(1));
            }
        }
    };
})(jQuery);

/* init on dom-ready */
$(function() {
    /* load the configuration and init spritest */
    var callback = function(d) {
        $.spritest.init(d);
    };

    $.ajaxSetup({ cache: false });
    $.getJSON('sprites.json', callback).error(function() {
        $.getJSON('sprites.dist.json', callback);
    });
});