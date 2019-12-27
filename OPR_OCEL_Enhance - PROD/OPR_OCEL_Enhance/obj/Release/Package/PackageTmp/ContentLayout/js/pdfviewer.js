/*
 * Copyright 2019 IT Lab ADP
 *
 * Project : Very simple PDF viewer jQuery plugin Combine with Pdf.Js
 * Version : 0.1
 * author: Adi Pranoto (chusmitaadi0516@gmail.com)
 * limitations under the License.
 */
(function($) {

    var customStyle = {
        width: '100px',
        height: '100px',
        overflow: 'scroll',
        position: 'absolute',
        top: '-9999px'
    };

    var $scrollDiv = $("<div>").css(customStyle);
    var scrollDiv = $scrollDiv.get(0);
    $("body").append($scrollDiv);

    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    var scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;
    document.body.removeChild(scrollDiv);

    $.scrollbar = {
        width: function() {
            return scrollbarWidth;
        },

        height: function() {
            return scrollbarHeight;
        }
    };
})(jQuery);

(function($) {

    var js_loader = {
        assets: {},
        include: function(asset_name, callback) {
            if (typeof callback != 'function')
                callback = function() {
                    return false;
                };

            if (typeof this.assets[asset_name] != 'undefined')
                return callback();


            var html_doc = document.getElementsByTagName('head')[0];
            var st = document.createElement('script');
            st.setAttribute('language', 'javascript');
            st.setAttribute('type', 'text/javascript');
            st.setAttribute('src', asset_name);
            st.onload = function() {
                js_loader._script_loaded(asset_name, callback);
            };
            html_doc.appendChild(st);
        },
        _script_loaded: function(asset_name, callback) {
            this.assets[asset_name] = true;
            callback();
        }
    };

    $.js_loader = js_loader;
})(jQuery);

(function($) {
    $.pdfviewer = function(element, options) {

        var defaults = {
            href: '',
            scale: 1.0,
            autoFit: true,
            toolbar_template: '<div class="pdf-toolbar">' +
                '<button type="button" class="btn btn-primary btn-sm" id="pdf-prev">Previous</button>' +
                '<button type="button" class="btn btn-success btn-sm" id="pdf-next">Next</button>' +
                
				'<button type="button" class="btn btn-default btn-sm" id="pdf-autofit-height" hidden>Adjust Height</button>' +
                '<button type="button" class="btn btn-info btn-sm" id="pdf-autofit-width">Adjust Width</button>' +
                '<button type="button" class="btn btn-warning btn-sm" id="pdf-autofit">Auto fit</button></div>' +
                '<div class="pull-right">'+
				'<span class="pdf-pager">'+
				'Page:<span id="pdf-page-num"></span>/<span id="pdf-page-count"></span></span>' +
				
                '</div>',
            viewer_template: '<div class="pdf-canvas"><canvas id="pdf-the-canvas"></canvas></div>',

            onPrevPage: function() {
                return true;
            },
            onNextPage: function() {
                return true;
            },
            onDocumentLoaded: function() {},
            onBeforeRenderPage: function(num) {
                return true;
            },
            onRenderedPage: function(num) {}
        }

        var plugin = this;

        plugin.settings = {};

        var $element = $(element),
            element = element,
            elt_width = $element.innerWidth(),
            elt_heigth = $element.innerHeight();

        var pdfDoc = null,
            pageNum = 1,
            pageRendering = true,
            pageNumPending = null,
            scale = 1.0,
            canvas = null,
            ctx = null;

        var initialize = function() {
            PDFJS.workerSrc = (function() {
                'use strict';
                var scriptTagContainer = document.body ||
                    document.getElementsByTagName('head')[0];
                var pdfjsSrc = $("script[src*='pdf.js']").get(0).src;
                return pdfjsSrc && pdfjsSrc.replace(/(\.js$)|(\.js(\?.*))$/i, '.worker.js$3');
            })();

            PDFJS.disableWorker = true;

            scale = plugin.settings.scale;
            canvas = $('#pdf-the-canvas', element).get(0);
            ctx = canvas.getContext('2d');
		

            $('#pdf-prev', element).on('click', plugin.prevPage);
            $('#pdf-next', element).on('click', plugin.nextPage);
            $('#pdf-autofit-height', element).on('click', plugin.autoFitScaleByHeight);
            $('#pdf-autofit-width', element).on('click', plugin.autoFitScaleByWidth);
            $('#pdf-autofit', element).on('click', plugin.autoFit);

            /**
             * Asynchronously downloads PDF.
             */
            PDFJS.getDocument(plugin.settings.href).then(function(pdfDoc_) {
                pdfDoc = pdfDoc_;
                plugin.settings.onDocumentLoaded.call(element);

                $('#pdf-page-count', element).text(pdfDoc.numPages);

                // Initial/first page rendering
                plugin.renderPage(pageNum);
            });

        }

        plugin.init = function() {

            options = options || {};
            options.href = options.href || $element.data('href');

            plugin.settings = $.extend({}, defaults, options);

            $element.html(build());

            if ('undefined' != typeof PDFJS) {
                initialize();
            } else {
                console.log('pdf.js not loaded. Try to dynamicly load "pdf.js" to your page.');

                var scriptTagContainer = document.body || document.getElementsByTagName('head')[0];
                var pdfjsSrc = $("script[src*='pdfviewer.js']").get(0).src;
                pdfjsSrc = pdfjsSrc.replace(/(pdfviewer\.js$)|(pdfviewer\.js(\?.*))$/i, 'pdfjs-dist/build/pdf.js$3');

                $.js_loader.include(pdfjsSrc, initialize);

                return plugin;
            }
        };


        plugin.renderPage = function(num) {

            if (!plugin.settings.onBeforeRenderPage.call(element, num)) return;

            pageRendering = true;
            pdfDoc.getPage(num).then(function(page) {
                var viewport = page.getViewport(scale);
                canvas.height = viewport.height;
                canvas.width = viewport.width;

				$('.pdf-canvas').css('margin-top', -2);
                if (canvas.width < $(canvas).parent().width() - 20)
                    $(canvas).css('margin-left', (($(canvas).parent().width() - canvas.width) / 2));
                else
                    $(canvas).css('margin-left', 0);

                var devicePixelRatio = window.devicePixelRatio || 1,
                    backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio || 1,

                    ratio = devicePixelRatio / backingStoreRatio;

                if (devicePixelRatio !== backingStoreRatio) {

                    var oldWidth = canvas.width;
                    var oldHeight = canvas.height;

                    canvas.width = oldWidth * ratio;
                    canvas.height = oldHeight * ratio;

                    canvas.style.width = oldWidth + 'px';
                    canvas.style.height = oldHeight + 'px';

                    ctx.scale(ratio, ratio);

                }

                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);

                renderTask.promise.then(function() {
                    pageRendering = false;

                    plugin.settings.onRenderedPage.call(element, num);

                    if (pageNumPending !== null) {
                        plugin.renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });

            // Update page counters
            $('#pdf-page-num', element).text(pageNum);
        };

        plugin.currentPage = function() {
            return pageNum;
        };

        plugin.pages = function() {
            return pdfDoc.numPages;
        };

        /**
         * Displays previous page.
         */
        plugin.prevPage = function() {
            if (!plugin.settings.onPrevPage.call(element)) return;

            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        };

        /**
         * Displays next page.
         */
        plugin.nextPage = function() {
            if (!plugin.settings.onNextPage.call(element)) return;

            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        }

        plugin.autoFit = function() {
            pdfDoc.getPage(pageNum).then(function(page) {
                var parentHeight = $(canvas).parent().height();
                var parentWidth = $(canvas).parent().width();
                var viewport = page.getViewport(1.0);

                if (parentHeight <= parentWidth)
                    plugin.autoFitScaleByHeight();
                else
                    plugin.autoFitScaleByWidth();
            });
        }


        plugin.autoFitScaleByHeight = function() {
            pdfDoc.getPage(pageNum).then(function(page) {
                var parentHeight = $(canvas).parent().height() - 1;
                var parentWidth = $(canvas).parent().width() - 1;

                var viewport = page.getViewport(1.0);
                scale = parentHeight / viewport.height;

                if (scale * viewport.width >= parentWidth)
                    scale = (parentHeight - $.scrollbar.height()) / viewport.height;

                queueRenderPage(pageNum);
            });
        }

        plugin.autoFitScaleByWidth = function() {
            pdfDoc.getPage(pageNum).then(function(page) {
                var parentWidth = $(canvas).parent().width() - 1;
                var parentHeight = $(canvas).parent().height() - 1;

                var viewport = page.getViewport(1.0);
                scale = parentWidth / viewport.width;

                if (scale * viewport.height >= parentHeight)
                    scale = (parentWidth - $.scrollbar.width()) / viewport.width;

                queueRenderPage(pageNum);
            });
        }

        var build = function() {
            return plugin.settings.toolbar_template + plugin.settings.viewer_template;
        }
		
        var queueRenderPage = function(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                plugin.renderPage(num);
            }
        }

        plugin.init();
    }

    $.fn.pdfviewer = function(options) {

        return this.each(function() {

            if (undefined == $(this).data('pdfviewer')) {

                var plugin = new $.pdfviewer(this, options);
                $(this).data('pdfviewer', plugin);

            }

        });

    }

})(jQuery);