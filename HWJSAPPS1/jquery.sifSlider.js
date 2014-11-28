(function ($) {
	'use strict';
	
	
	var PROP_CONSTS = {
		wide  : 1.7777777777777777777777777777778,
		normal : 1.3333333333333333333333333333333
	},
        
        aux = {
            nav : function (dir, $el, $wrapper, opts, cache) {
                var scroll = 1, idxClicked = 0, factor = 1, $first;

                if (dir === 1) {
                    $wrapper.find('div.sifSlide:lt(' + scroll + ')').each(function (i) {
                        $(this).clone(true).css('left', (cache.totalItems + i) * opts.width + 'px').appendTo($wrapper);
                    });
                } else {
                    $first	= $wrapper.children().eq(0);
                    console.log('div.sifSlide:gt(' + (cache.totalItems  - 1 - scroll) + ')');
                    $wrapper.find('div.sifSlide:gt(' + (cache.totalItems  - 1 - scroll) + ')').each(function (i) {
                        $(this).clone(true).css('left', -(scroll - i) * opts.width + 'px').insertBefore($first);
                    });
                }

                $wrapper.find('div.sifSlide').each(function (i) {
                    var $item	= $(this);
                    $item.stop().animate({
                        left	:  (dir === 1)
                            ? '-=' + (opts.width) + 'px'
                            : '+=' + (opts.width) + 'px'
                    },
                        opts.sliderSpeed,
                        opts.sliderEasing,
                        function () {
                            if ((dir === 1 && $item.position().left < 0) || (dir === -1 && $item.position().left > ((cache.totalItems - 1) * opts.width))) {
                                $item.remove();
                            }
                            cache.isAnimating	= false;
                        });
                });
            }
        },
        methods = {
            init : function (options) {
                if (this.length) {
                    var defaults = {
                        width           : 500,     // width in pxls
                        proportion      : 'wide',  // 16:9 - 'wide', 4:3 - 'normal'
                        sliderSpeed		: 500,	   // speed for the sliding animation
                        sliderEasing	: 'swing', // easing for the sliding animation - 'swing' and 'linear'
                        sideShow		: true,    // is autoplay
                        slideShowSpeed  : 5000     // slideshow speed
                    };

                    return this.each(function () {



                        var settings  = $.extend(true, defaults, options),
                            $this     = $(this),
                            $slides   = $this.find('.sifSlide'),
                            height    = methods.calcHeight(settings),
                            cache     = {},
                            pause	  = false;

                        cache.slideShow = true;

                        cache.totalItems = $slides.length;

                        if (cache.totalItems > 1) {
                            $this.prepend('<div class="sifSliderNav"><span class="sifSliderNav-prev">Previous</span><span class="sifSliderNav-next">Next</span></div>');
                        }

                        var $navPrev		= $this.find('span.sifSliderNav-prev'),
                            $navNext		= $this.find('span.sifSliderNav-next');

                        cache.width = settings.width;

                        $this.addClass('sifSliderWindow');
                        $this.css({
                            'width'  : settings.width,
                            'height' : height
                        });

                        $slides.wrapAll('<div class="sifSliderContainer"></div>');
                        $slides.css({
                            'float'  : 'left',
                            'width'  : settings.width,
                            'height' : height
                        });

                        var	$wrapper = $this.find('.sifSliderContainer');
                        $wrapper.css('overflow', 'hidden');

                        $slides.each(function (i) {
                            $(this).css({
                                position	: 'absolute',
                                left		: i * settings.width + 'px'
                            });
                        });

                        //pause the slideshow on hover
                        $wrapper.bind('mouseenter mouseleave', function () {
                            pause = !pause;
                        });

                        if (settings.sideShow) {
                            var	slideShowInterval = setInterval(function () {
                                    if (cache.isAnimating || pause) return false;
                                    cache.isAnimating	= true;
                                    aux.nav(1, $this, $wrapper, settings, cache);
                                }, settings.slideShowSpeed);
                        }

                        //navigate to prev
                        $navPrev.bind('click.sifSlider', function (event) {
                            if (cache.isAnimating) return false;
                            cache.isAnimating = true;
                            aux.nav(-1, $this, $wrapper, settings, cache);
                        });

                        //navigate to next
                        $navNext.bind('click.sifSlider', function (event) {
                            if (cache.isAnimating) return false;
                            cache.isAnimating	= true;
                            aux.nav(1, $this, $wrapper, settings, cache);
                        });
                    });
                }
            },
            calcHeight : function (sets) {
                var heightCalc;

                if (sets.proportion) {
                    switch (sets.proportion) {
                    case 'wide':
                        heightCalc = Math.round(sets.width / PROP_CONSTS.wide);
                        break;
                    case 'normal':
                        heightCalc = Math.round(sets.width / PROP_CONSTS.normal);
                        break;
                    }
                }
                return heightCalc;
            }
	    };

	$.fn.sifSlider = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.contentcarousel');
		}
	};

}(jQuery));