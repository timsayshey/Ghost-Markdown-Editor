(function ($, ShowDown, CodeMirror) {
    "use strict";

    $.fn.ghostDown = function() {

        var self = this;

        var converter = new ShowDown.converter();

        var editor = CodeMirror.fromTextArea(this.find('textarea')[0], {
                mode: 'markdown',
                tabMode: 'indent',
                lineWrapping: true
            });

        // Really not the best way to do things as it includes Markdown formatting along with words
        function updateWordCount() {
            var wordCount = self.find('.entry-word-count'),
                editorValue = editor.getValue();

            if (editorValue.length) {
                wordCount.html(editorValue.match(/\S+/g).length + ' words');
            }
        }

        function updatePreview() {
            var preview = self.find('.rendered-markdown');
            preview.html(converter.makeHtml(editor.getValue()));
            updateWordCount();
        }

        $('.entry-markdown header, .entry-preview header', self).click(function (e) {
            $('.entry-markdown, .entry-preview', self).removeClass('active');
            $(e.target, self).closest('section').addClass('active');
        });

        editor.on("change", function () {
            updatePreview();
        });

        updatePreview();

        // Sync scrolling
        function syncScroll(e) {
            // vars
            var $codeViewport = $(e.target, self),
                $previewViewport = $('.entry-preview-content', self),
                $codeContent = $('.CodeMirror-sizer', self),
                $previewContent = $('.rendered-markdown', self),

            // calc position
                codeHeight = $codeContent.height() - $codeViewport.height(),
                previewHeight = $previewContent.height() - $previewViewport.height(),
                ratio = previewHeight / codeHeight,
                previewPostition = $codeViewport.scrollTop() * ratio;

            // apply new scroll
            $previewViewport.scrollTop(previewPostition);
        }

        // TODO: Debounce
        $('.CodeMirror-scroll', self).on('scroll', syncScroll);

        // Shadow on Markdown if scrolled
        $('.CodeMirror-scroll', self).scroll(function() {
            if ($('.CodeMirror-scroll', self).scrollTop() > 10) {
                $('.entry-markdown', self).addClass('scrolling');
            } else {
                $('.entry-markdown', self).removeClass('scrolling');
            }
        });
        // Shadow on Preview if scrolled
        $('.entry-preview-content', self).scroll(function() {
            if ($('.entry-preview-content', self).scrollTop() > 10) {
                $('.entry-preview', self).addClass('scrolling');
            } else {
                $('.entry-preview', self).removeClass('scrolling');
            }
        });

        $.fn.ghostDown.getMarkdown = function() {
            return editor.getValue();
        };

        $.fn.ghostDown.getHtml = function() {
            return $('.rendered-markdown', self).html();
        };

        return this;
    };
}(jQuery, Showdown, CodeMirror));
