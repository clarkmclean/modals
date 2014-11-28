/*
 * To build an "auto-popup" query string you need:
 *
 * 1. http://www.rcwilley.com/Example.jsp?popup=true
 * 2. http://www.rcwilley.com/Example.jsp?popup=true&popupOptions={ options }
 * 
 *      ---Options---
 *      String      type:           (inline, iframe, image, ajax, or actual contents)
 *      Boolean     modal
 *      String      url             (Must be URL encoded)
 *      Integer     width
 *      Integer     height
 *      Boolean     imageviewer
 *      Integer     mdCloseDelay:   milliseconds
 *      String      title:          First <h1> in contents
 *      
 * 3. Delimiters for name/value are '+' and '_'. (i.e. { name1 }_{ value1 }+{ name2 }_{ value2 })
 * 
 *      ---YouTube---
 *      http://www.rcwilley.com/Example.jsp?youtube={ youtube_id }
 *      
 */

var mdiframe;
var Popup = {
    targetMap: {},
    modalCount: 1,
    ajax: function() {
        var that = this;
        var url = this.href.indexOf('?') !== -1 ? this.href + '&ajax=true' : this.href + '?ajax=true';
        $.get(url, function(data) {
            that.create(data);
        });
    },
    //TODO: Always bring container. See mobile menus. And forms.
    inline: function() {
        var $el = $(this.href), isForm = $el.is('form');
        if (this.href === '#menu')
        {
            if (!($el = $('.sideBar:eq(0)')).length)
                $el = $('<div />', {'class': 'sideBar'});
            $el.append($('.mobileLinks').removeClass('hide'));
        }
        this.create(isForm ? $el : $el.html());
        isForm ? $el.removeClass('hide') : $el.remove();
    },
    iframe: function() {
        var that = this;

        mdiframe = document.createElement("iframe");
        mdiframe.style.display = "none";
        mdiframe.scrolling = "no";
        mdiframe.width = "100%";
        mdiframe.height = "100%";
        // this function will called when the iframe loaded
        mdiframe.onload = function() {
            mdiframe.style.display = "inherit";
            mdiframe.height = that.options.height + 'px';
            mdiframe.width = (that.options.width == null ? '100%' : that.options.width + 'px');
            mdiframe.frameBorder = "0";
            mdiframe.seamless = "seamless";
            mdiframe.className = "grid-full";

        };
        // set the src last.
        mdiframe.src = this.href;

        this.create(null);
    },
    popupMessage: function() {
        this.create('<span class="md-message icon-info">' + this.href + '</span>');
    },
    image: function() {
        var that = this;
        if ($('.md-imageviewer').length)
        {
            this._open($('.md-imageviewer'));
            
        }
        else {
            var imageCode = "<img src='" + replaceImage(that.href) + "' style='display:block;margin:10px auto 0px; width:" + (that.options.width ? that.options.width : 'auto') + ";'/>";
            that.create(imageCode);
        }
    },
    create: function(html) {
        var that = this;
        $('.md-overlay').before(this.targetMap[this.href] = $('<div class="md-modal a250' + (that.options.imageviewer ? ' md-imageviewer ' : '') + (that.options.type == 'popupMessage' ? ' md-message-style ' : '') + (mobileMode ? (this.href == '#menu' ? ' md-menu ' : ' md-mobile ') : ' md-scale ') + '"><div class="md-content a250"><div class="md-title-style">' + (this.options.modal == true ? '' : '<a href="#" class="md-close"></a>') + '</div></div></div>').css({width: this.options.width + 'px'}));
        this.targetMap[this.href].find('.md-content').append(html || mdiframe);
        if (that.options.imageviewer) {
            load(['/script/flexViewer.js', '/styles/imageviewer.css'], function() {
                $('img', that.targetMap[that.href]).flexViewer();
                if(typeof product != 'undefined')
                {
                    for (var index = 1; index <= product.imageCount; index++)
                    {                    
                        $("#popupThumbs").append('<span><img src="' +
                            replaceImage(product.imagePrefix + 'image' + index + '.jpg?r=' + product.revision, {width: 100})
                                + '"></span>');
                    }
                }
            });
        }

        var $modal = $(this.targetMap[this.href]);
        if (this.options.type == 'iframe')
        {
            $('.md-content').addClass('md-iframe');
        }
        if (this.options.mdCloseDelay != null)
        {
            setTimeout(function() {
                that.close();
            }, that.options.mdCloseDelay);
        }
        $modal.find('.md-title-style').prepend('<h1 class="md-title">' + (this.options.title || $modal.find('h1:first-of-type').text() || $modal.find('.header:eq(0)').text()) + '</h1>');
        this._open($modal);
        return this;
    },
    open: function(href, options) {
        if (isFrame)
        {
            return;
        }
        this.options = $.extend({}, Popup.defaults, options);
        if (!$('.md-overlay').length) {
            $('body').append('<div class="md-overlay">' + (this.options.modal == true ? '' : '<a href="#" class="md-close"></a>') + '</div>');
        }
        if (this.targetMap[href]) {
            this._open(this.targetMap[href]);
        }
        else {
            if (isUndefined(this.options.type)) {
                var newType = 'ajax', firstChar = href.charAt(0);
                if (firstChar === '#') {
                    newType = 'inline';
                }
                else if (firstChar !== '/' && isSecure !== ('https:' === href.substr(0, 6))) {
                    newType = 'iframe';
                }
                else if (/\.(gif|jpg|svg|png).*?/.test(href)) {
                    newType = 'image';
                }
                else if (firstChar === '<')
                {
                    this.create(this.href);
                }
                this.options.type = newType;
            }
            this.href = href;
            this[this.options.type]();
        }

    },
    _open: function($modal) {
        if (this.options.type == 'iframe')
        {
            $modal.children('.md-content').css('height', (this.options.height + 74) + 'px');
        }
        //adds classes
        setTimeout(function() {
            $modal.addClass('md-show');
            $('html').css({'height': '100%'});
            $('html').css({'overflow': 'hidden'});
        }, 200);
    },
    close: function() {
        
        $('.md-show').removeClass('md-show');
        $('html').css({'height': 'auto'});
        $('html').css({'overflow': 'auto'});
        if(Boolean.parse(this.options.imageviewer)){
            delete this.targetMap[this.href];
            $('.md-imageviewer').remove();
        }
        if(this.options.type != 'inline'){
            delete this.targetMap[this.href];
            $('.md-modal').remove();
        }
    },
    defaults: {
    }
};
