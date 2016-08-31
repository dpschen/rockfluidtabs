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
        base.$nav = base.$el.find('.nav');

        base.changeTab = function ($newTab, hashSet) {

            var $allTabWrap, curTabHeight, newHeight,

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
            // console.log('current element: ' + base.$el.find('.nav li a').attr('href'));
            base.$el.find('.nav li a').removeClass('current');
            $newTab.addClass('current');

            // prevent two tab transitions at the same time animations
            if (animating !== true) {
                animating = true;

                // Set outer wrapper height to (static) height of current inner tab
                $allTabWrap = base.$el.find(".tab-wrap");
                curTabHeight = $allTabWrap.height();
                $allTabWrap.height(curTabHeight);

                // check if clicked on current tab
                if ((newTabID !== curTabID) && (newTabID .length > 0) && (base.$el.find(":animated").length === 0)) {

                    // no animation if hash is set
                    if (hashSet !== true) {

                        // prevent content from flowing over
                        $allTabWrap.css({ overflow: 'hidden'});
                        base.$el.find('#' + curTabID).velocity({ opacity: 0 }, {
                            display: 'none',
                            duration: base.options.speed / 2,
                            easing: 'easeInQuad',
                            complete: function () {
                                // Fade in new tab on callback
                                base.$el.find('#' + newTabID).velocity({ opacity: 1 }, {
                                    display: 'block',
                                    duration: base.options.speed / 2,
                                    easing: 'easeOutQuad'
                                });

                            }
                        });
                        // Adjust outer wrapper to fit new tab snuggly
                        newHeight = base.$el.find('#' + newTabID).height();
                        $allTabWrap.velocity({ height: newHeight }, {
                            easing: base.options.easing,
                            duration: base.options.speed,
                            complete: function () {

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
                        newHeight = base.$el.find('#' + newTabID).height();
                        $allTabWrap.velocity({ height: newHeight }, {
                            easing: base.options.easing,
                            duration: base.options.speed / 2,
                            complete: function () {
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

        base.init = function () {
            // console.log('base.elID: ' + base.$el.attr('id'));
            base.options = $.extend({}, $.rockFluidTabs.defaultOptions, options);

            // Figure out current tab via CSS class
            var curTabLink = base.$el.find("a.current");
            if (curTabLink.length === 0) {
              curTabID = base.$nav.find('li:first-child a')
                .addClass('current')
                .attr("href").substring(1);
            } else {
              curTabID = curTabLink.attr("href").substring(1);
            }

            base.$nav.on("click", "a", function () {
                // change tab to this
                base.changeTab($(this));

                // Don't behave like a regular link
                // Stop propegation and bubbling
                return false;
            });

            // check for window.state, if exists then activate
            if (history.state && history.state.length !== 0) {
                if (history.state.hasOwnProperty('rockFluidTabs')) { // check for the rockFluidTabsState key

                    // pull back in all of the var declarations so that they're accessible at start
                    var toOpenTabID,
                        $toOpenTab,
                        i;

                    //historyObject;
                    historyRockFluidTabs = [history.state.rockFluidTabs];

                    // search for a history entry
                    for (i = 0; i < historyRockFluidTabs.length; i += 1) {

                        if (historyRockFluidTabs[i].baseElID === base.elID) {
                            toOpenTabID = historyRockFluidTabs[i].state;

                            // Cycle through nav options and search for the toOpenTabID item
                            base.$el.find(".nav li a").each(function () {
                                if ($(this).attr("href") === "#" + toOpenTabID) {
                                    $toOpenTab = $(this);
                                    base.changeTab($toOpenTab, true);
                                }
                            });
                        }
                    }

                }
            }
        };
        base.init();
    };

    $.rockFluidTabs.defaultOptions = {
        speed: 400,
        easing: 'easeInOutQuart'
    };

    $.fn.rockFluidTabs = function (options) {
        return this.each(function () {
            (new $.rockFluidTabs(this, options));
        });
    };

}(jQuery));
