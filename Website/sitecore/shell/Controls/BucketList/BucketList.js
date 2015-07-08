var Sitecore = Sitecore || {};

Sitecore.InitBucketList = function (id, clientId, pageNumber, searchHandlerUrl, filter, databaseUrlParameter, typeToSearchString, of, enableSetStartLocation) {
    var self = {};

    self.id = id;
    self.clientId = clientId;
    self.pageNumber = pageNumber;
    self.searchHandlerUrl = searchHandlerUrl;
    self.filter = filter;
    self.databaseUrlParameter = databaseUrlParameter;
    self.typeToSearchString = typeToSearchString;
    self.of = of;
    self.enableSetStartLocation = (enableSetStartLocation.toLowerCase() === 'true');

    self.currentPage = 1;
    self.selectedId = '';

    self.doneTypingInterval = 2000; //time in ms, 2 second for example

    var typingTimer;

    self.format = function (template) {
        var args = arguments;
        return template.replace(/\{(\d+)\}/g, function (m, n) { return args[parseInt(n) + 1]; });
    };

    // Sends 'GET' request to url specified by parameter
    // and apply success handler to multilist element
    self.sendRequest = function (url, multilist) {
        new Ajax.Request(url,
            {
                method: 'GET',
                onSuccess: new self.SuccessHandler(multilist)
            });
    };

    // Cunstructor for request success handler
    self.SuccessHandler = function (multilist) {
        return function (request) {
            var response = eval(request.responseText);
            multilist.options.length = 0;
            multilist.removeClassName('loadingItems');

            for (var i = 0; i < response.items.length; i++) {
                multilist.options[multilist.options.length] = new Option(response.items[i].Name + ' (' + response.items[i].TemplateName + ' - ' + response.items[i].Bucket + ')', response.items[i].ItemId);
            }

            self.pageNumber = response.PageNumbers;
            $('pageNumber' + self.clientId).innerHTML = self.format(self.of, self.currentPage, self.pageNumber);
        };
    };

    // Return id of selected item
    self.getSelectedItemId = function () {
        var all = scForm.browser.getControl(self.id + '_unselected');

        for (var n = 0; n < all.options.length; n++) {
            var option = all.options[n];

            if (option.selected) {
                return option.value;
            }
        }

        return null;
    };

    self.onFilterFocus = function (filterBox) {
        if (filterBox.value == self.typeToSearchString) {
            filterBox.value = '';
        }

        filterBox.addClassName('active').removeClassName('inactive');
    };

    self.onFilterBlur = function (filterBox) {
        if (!filterBox.value) {
            filterBox.value = self.typeToSearchString;
        }

        filterBox.removeClassName('active').addClassName('inactive');
    };

    self.multilistValuesMoveRight = function (allOptions) {
        var all = scForm.browser.getControl(self.id + '_unselected');
        var multilistValues = document.getElementById('multilistValues' + self.id);
        for (var n = 0; n < all.options.length; n++) {
            var option = all.options[n];
            if (option.selected || allOptions) {
                var opt = option.innerHTML + ',' + option.value + ',';
                multilistValues.value = multilistValues.value.replace(opt, '');
            }
        }
    };

    self.multilistValuesMoveLeft = function (allOptions) {
        var selected = scForm.browser.getControl(self.id + '_selected');
        var multilistValues = document.getElementById('multilistValues' + self.id);
        for (var n = 0; n < selected.options.length; n++) {
            var option = selected.options[n];
            if (option.selected || allOptions) {
                var opt = option.innerHTML + ',' + option.value + ',';
                multilistValues.value += opt;
            }
        }
    };

    self.moveToCurrentPage = function () {
        var filterBox = document.getElementById('filterBox' + self.clientId);
        var filterValue = (filterBox.value && filterBox.value != self.typeToSearchString) ? filterBox.value : '*';

        var multilist = $(self.clientId + '_unselected').addClassName('loadingItems');
        var savedStr = encodeURI(filterValue);
        var filterString = self.enableSetStartLocation ? self.getOverrideString('&location=') : self.filter;

        self.sendRequest(self.searchHandlerUrl + '?fromBucketListField=' + savedStr + filterString + '&pageNumber=' + self.currentPage + self.databaseUrlParameter, multilist);
    };

    // Replaces overrideKey value in filter by value from ovverrideInput
    self.getOverrideString = function (overrideKey) {
        var overrideInput = document.getElementById('locationOverride' + self.clientId);

        if (!overrideInput || !overrideInput.value.length > 0) {
            return self.filter;
        }

        var replaceStartIndex = self.filter.indexOf(overrideKey);

        if (!~replaceStartIndex) {
            return self.filter;
        }

        var replaceEndIndex = self.filter.indexOf('&', replaceStartIndex + 1);

        if (!~replaceEndIndex) {
            replaceEndIndex = self.filter.length;
        }

        var stringToReplace = self.filter.substring(replaceStartIndex, replaceEndIndex);

        return self.filter.replace(stringToReplace, overrideKey + overrideInput.value);
    };

    self.initEventHandlers = function () {
        $('filterBox' + self.clientId).observe('focus', function () {
            self.onFilterFocus($('filterBox' + self.clientId));
        });

        $('filterBox' + self.clientId).observe('blur', function () {
            self.onFilterBlur($('filterBox' + self.clientId));
        });

        $('filterBox' + self.clientId).observe('keyup', function () {
            typingTimer = setTimeout(function () { self.currentPage = 1; self.moveToCurrentPage(); }, self.doneTypingInterval);
        });

        $('filterBox' + self.clientId).observe('keydown', function () {
            clearTimeout(typingTimer);
        });

        $('next' + self.clientId).observe('click', function () {
            if (self.currentPage + 1 <= self.pageNumber) {
                self.currentPage++;
                self.moveToCurrentPage();
            }
        });

        $('prev' + self.clientId).observe('click', function () {
            if (self.currentPage > 1) {
                self.currentPage--;
                self.moveToCurrentPage();
            }
        });

        $(self.id + '_unselected').observe('dblclick', function () {
            self.multilistValuesMoveRight();
            javascript: scContent.multilistMoveRight(self.id);
        });

        $(self.id + '_selected').observe('dblclick', function () {
            self.multilistValuesMoveLeft();
            javascript: scContent.multilistMoveLeft(self.id);
        });

        $(self.id + '_unselected').observe('click', function () {
            self.selectedId = self.getSelectedItemId();
        });

        $(self.id + '_selected').observe('click', function () {
            self.selectedId = self.getSelectedItemId();
        });

        $('btnRight' + self.id).observe('click', function () {
            self.multilistValuesMoveRight();
            javascript: scContent.multilistMoveRight(self.id);
        });

        $('btnLeft' + self.id).observe('click', function () {
            self.multilistValuesMoveLeft();
            javascript: scContent.multilistMoveLeft(self.id);
        });

        $('refresh' + self.clientId).observe('click', function () {
            self.currentPage = 1;
            self.moveToCurrentPage();
        });

        $('goto' + self.clientId).observe('click', function () {
            scForm.postRequest('', '', '', 'contenteditor:launchtab(url=' + self.selectedId + ')');
            return false;
        });
    };

    $('pageNumber' + self.clientId).innerHTML = self.format(self.of, self.currentPage, self.pageNumber);
    self.initEventHandlers();
};