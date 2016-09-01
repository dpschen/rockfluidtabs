/*jslint browser: true, devel: true */
/*global jQuery */

(function ($) {

    'use strict';

    $.rockFluidTabs = function (el, options) {

        var base = this,
            animating = false,
            $nextTab = null, //tab that will be opened next
            curTabID = null, //the current tab ID
            historyRockFluidTabs;
        base.$el = $(el);
        base.elID = $(base.$el).attr('id');
        base.$nav = null;
        base.$allTabWrap = null;

        base.changeTab = function ($newTab, hashSet) {

            var newHeight,

            // Figure out ID of new tab
                newTabID = $newTab.attr('href').substring(1);

            // if $nextTab should have been opened it should open right now
            $nextTab = null;

            // Update URL bar, retain state
            window.history.pushState({
                rockFluidTabs : {
                    baseElID: base.elID,
                    state: newTabID
                }
            }, window.document.title, window.location.pathname + '#' + newTabID);

            // Remove highlighting - Add to just-clicked tab
            base.$nav.find('a').removeClass(base.options.currentClass.substring(1));
            $newTab.addClass(base.options.currentClass.substring(1));

            // prevent two tab transitions at the same time
            if (animating !== true) {
                animating = true;

                // check if clicked on current tab
                if ((newTabID !== curTabID) && (newTabID.length > 0) && (base.$el.find(":animated").length === 0)) {

                    // no animation if hash is set
                    if (hashSet !== true) {

                        // prevent content from flowing over
                        base.$allTabWrap.css({
                            overflow: 'hidden',
                            position: 'relative'
                        });

                        // display newTab to make it possible to calculate height
                        base.$el.find('#' + newTabID).css({
                            display: '', // standard display
                            opacity: 0,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%'
                        });

                        // Fade out current tab
                        base.$el.find('#' + curTabID).velocity({ opacity: 0 }, {
                            display: 'none',
                            duration: base.options.speed,
                            easing: base.options.easing,
                            complete: function () {

                                // remove unnecessary styles
                                $(this).css({
                                    opacity: ''
                                });


                            }
                        });

                        // Fade in new tab on callback
                        base.$el.find('#' + newTabID).velocity({ opacity: 1 }, {
                          duration: base.options.speed,
                          easing: base.options.easing,
                          complete: function () {

                            // remove unnecessary styles
                            $(this).css({
                              opacity: '',
                              position: '',
                              top: '',
                              left: '',
                              width: ''
                            });
                          }
                        });

                        // Adjust outer wrapper to fit new tab snuggly
                        newHeight = base.$el.find('#' + newTabID).outerHeight(true);

                        base.$allTabWrap.velocity({ height: newHeight }, {
                            easing: base.options.easing,
                            duration: base.options.speed,
                            complete: function () {

                                // remove unnecessary styles
                                // $(this).css({ height: ''}); // height seems to be needed to prevent flickering

                                animating = false;
                                curTabID = newTabID;
                                if ($nextTab !== $newTab && $nextTab !== null) {
                                    base.changeTab($nextTab);
                                }
                            }
                        });
                    } else {
                        // just show the right tab
                        base.$el.find('#' + curTabID).hide();
                        base.$el.find('#' + newTabID).show();

                        // Adjust outer wrapper to fit new tab
                        newHeight = base.$el.find('#' + newTabID).outerHeight(true);
                        base.$allTabWrap.velocity({ height: newHeight }, {
                            easing: base.options.easing,
                            duration: base.options.speed / 2,
                            complete: function () {

                                // remove unnecessary styles
                                // $(this).css({ height: '' }); // height seems to be needed to prevent flickering

                                animating = false;
                                curTabID = newTabID;
                            }
                        });
                    }
                } else {
                    animating = false;
                }
            } else {
                $nextTab = $newTab;
            }
        };

        // Cycle through nav options and search for the toOpenTabID item
        base.findLinkForID = function (toFindLinkID) {
            var toFindLink = null;
            base.$nav.find('a').each(function (index, element) {
                if (element.getAttribute('href') === toFindLinkID) {
                    toFindLink = $(element);
                }
            });
            return toFindLink;
        };

        base.init = function () {
            base.options = $.extend({}, $.rockFluidTabs.defaultOptions, options);

            // set elements from options
            base.$nav = base.$el.find(base.options.nav);
            base.$allTabWrap = base.$el.find(base.options.tabWrap);


            var curTabLink;

            // if there is a location.hash
            if (location.hash !== '') {
                curTabLink = base.$nav.find('[href="' + location.hash + '"]');
                // check if there is one link with location.hash in our nav
                if (curTabLink.length === 1) {

                    // we found our current Tab ID
                    curTabID = location.hash.substring(1);

                    // remove currentClass from dom (because location hash is more important)
                    base.$nav.find('a').removeClass(base.options.currentClass.substring(1));
                }
            }

            // if current tab ID is still unknown find it by searching for a nav item with the current class
            curTabID = curTabID || base.$nav.find(base.options.currentClass).attr('id');

            // if still no current tab ID is found take the first nav element
            // https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
            // took this solution because else JSLint error
            if (curTabID === undefined || curTabID === null) {
                curTabLink = base.$nav.find('a').first();
                curTabID = curTabLink.attr("href").substring(1);
            }
            curTabLink.addClass(base.options.currentClass.substring(1));


            // hide tabs that are not active
            base.$allTabWrap.css({ overflow: 'hidden'});
            base.$allTabWrap.children().not('#' + curTabID).css({
                display: 'none'
            });

            base.$nav.on("click", "a", function () {
                // change tab to this
                base.changeTab($(this));

                // Don't behave like a regular link
                // Stop propegation and bubbling
                return false;
            });

            // // // check for window.state, if exists then activate
            // if (history.state && history.state.length !== 0) {
            //     if (history.state.hasOwnProperty('rockFluidTabs')) { // check for the rockFluidTabsState key
            //
            //         // TODO: pull back in all of the var declarations so that they're accessible at start
            //
            //         //historyObject;
            //         historyRockFluidTabs = [history.state.rockFluidTabs];
            //
            //         console.log(historyRockFluidTabs);
            //
            //         // search for a history entry
            //         // todo: will the tab change several times if there is more than one entry?
            //         var i;
            //         for (i = 0; i < historyRockFluidTabs.length; i += 1) {
            //
            //             // check if history entry is from this instance
            //             if (historyRockFluidTabs[i].baseElID === base.elID) {
            //
            //                 base.changeTab(base.findLinkForID('#' + historyRockFluidTabs[i].state));
            //             }
            //         }
            //
            //     }
            // }

            if (window.hasOwnProperty('onhashchange')) {
                // console.log("The browser supports the hashchange event!");
                window.onhashchange = function () {
                    var linkToChangeTo = base.findLinkForID(location.hash);
                    if (linkToChangeTo !== null) {
                        base.changeTab(linkToChangeTo);
                    }
                };
            }

            // change height of base.$allTapWrap when resizing window
            $(window).resize(function () {
                base.$allTabWrap.css({
                    height: base.$allTabWrap.find('#' + curTabID).outerHeight(true)
                });
            });
        };
        base.init();
    };

    $.rockFluidTabs.defaultOptions = {
        speed: 400,
        easing: 'easeInOutQuart',
        nav: '.nav',
        currentClass: '.current',
        tabWrap: '.tab-wrap'
    };

    $.fn.rockFluidTabs = function (options) {
        return this.each(function () {
            new $.rockFluidTabs(this, options);
        });
    };

}(jQuery));
