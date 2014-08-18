(function ($) {
    $.widget("sc.reviewrunner", {
        options: {
            name: '',
            mode: null,
            errorMessage: ''
        },

        _create: function () {
            var self = this;
            this.previewPanel = $(this.element).find('.preview-panel').get(0);
            this.runTestButton = $(this.element).find('.sc-button:first').get(0);
            this.messageVariantsControl = $(this.element).find('.select-variant-group').get(0);
            this.selectedMessageVariantsControl = $(this.element).find('.selcted-variant').children('div:first').get(0);

            if (this.previewPanel) {
                $(this.previewPanel).css('width', this._getMessageVariantsCount() > 0 ? '' : '100%'); // Hide A/B variant selection control if there is only one variant
            }

            if (this.runTestButton) {

                // Create spinner
                this.spinner = $(self.runTestButton).spinner({ type: 'inline', position: 'left', hidetimeout: 0, endless: true }).data('spinner');

                // Handler to check if there any options selected to prevent submit without selecting options
                $(this.runTestButton).off('click').on('click',
                    function (e) {
                        if (!self._getIsOptionSelected()) { // If no options selected
                            $("body").triggerHandler('messagesend', { text: self.options.errorMessage, type: 'error', sticky: true });
                            e.preventDefault(); // Prevent submit
                            return;
                        }

                        self.showSpinner();
                    });

                // Overrides default onclick event to allow it to be cancelled by calling preventDefault
                $(self.runTestButton).data('onclick', self.runTestButton.onclick);
                self.runTestButton.onclick = function (event) {
                    if (event.defaultPrevented) {
                        return false;
                    }

                    $(document).trigger('stoprefreshing', { mode: self.options.mode });
                    $(self.runTestButton).data('onclick').call(self.runTestButton, event || window.event);

                    return true;
                };
            }

            this._initializeMessageVariantsControl();
        },

        _initializeMessageVariantsControl: function () {
            var self = this;
            self._updateSelectedMessageVariants();
            
            if (this.messageVariantsControl) {
                $(this.messageVariantsControl).on('click', function () { self._updateSelectedMessageVariants(); });
            }
        },

        _disableMessageVariantsControl: function () {
            if (this.messageVariantsControl) {
                $(this.messageVariantsControl).off('click');
            }
        },

        _getIsOptionSelected: function () {
            var selectedOptions = $('input[name^="' + this.options.name + '"][name$="Checkboxes"]')[0];
            return (selectedOptions && selectedOptions.value && selectedOptions.value.length != 0);
        },

        _getMessageVariantsCount: function () {
            if (!this.messageVariantsControl) {
                return 0;
            }

            return $(this.messageVariantsControl).find('.abn-button').length;
        },

        _updateSelectedMessageVariants: function () {
            var self = this;

            if (!this.messageVariantsControl || !this.selectedMessageVariantsControl) {
                return '';
            }

            var selectedMessageVariants = [];

            $(this.selectedMessageVariantsControl).empty();

            $(this.messageVariantsControl).find('.abn-button-active').each(function () {
                selectedMessageVariants.push($(this).index());
                $(self.selectedMessageVariantsControl).append($(this).html());
            });

            if ($(this.selectedMessageVariantsControl).is(':empty')) {
                $(this.selectedMessageVariantsControl).parent().children('span:first').hide();
            }
            else {
                $(this.selectedMessageVariantsControl).parent().children('span:first').show();
            }

            return selectedMessageVariants.join(',');
        },

        destroy: function () {
            $.Widget.prototype.destroy.apply(this);

            if (this.spinner) {
                this.spinner.destroy();
            }

            if (this.runTestButton) {
                this.runTestButton.onclick = $(this.runTestButton).data('onclick');
                $(this.runTestButton).removeData('onclick').off('click');
            }

            this._disableMessageVariantsControl();
        },

        showSpinner: function () {
            this.spinner.display();
            this._disableMessageVariantsControl(); // Prevent message variants change while processing request
            $(this.runTestButton).attr('disabled', 'disabled'); // Disable run test button
        },

        hideSpinner: function () {
            this.spinner.hide();
            this._initializeMessageVariantsControl(); // Reinitialize message variants selection control
            $(this.runTestButton).removeAttr('disabled'); // Enable run test button
        }

    });
})(jQuery);