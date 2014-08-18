(function ($) {
    $.widget('sc.ecmbreadcrumbs', {
        options: {
            template: "<ul>{{each value}}{{if $value.index != undefined}}<li><a href='${$value.url}'{{if $value.title}} title='${$value.title}'{{/if}}>" +
                "{{if $value.icon && ($value.index <= 0 || $index == 0 )}} <span style='background-image: url(${$value.icon})'>${$value.title}</span>{{else}}${$value.title}{{/if}}" +
                "</a></li>{{/if}}{{/each}}</ul>"
        },
        _create: function () {

            if (typeof (Storage) !== "undefined") {

                var arr;

                if (sessionStorage.crumbs) {
                    arr = JSON.parse(sessionStorage.crumbs);
                }

                if (!arr) {
                    arr = [{}, {}, {}];

                    var l = this.options.data.value.length - 1;
                    for (var i = 0; i < l; i++) {
                        arr[i] = this.options.data.value[i];
                    }
                }

                if (this.options.currentpage) {
                    var index = this.options.currentpage.index;
                    arr[index] = this.options.currentpage;
                    for (var i = index + 1; i < arr.length; i++) {
                        arr[i] = {};
                    }

                    this.options.data.value.length = 0;
                    for (var i = 0; i < index; i++) {
                        this.options.data.value.push(arr[i]);
                    }
                }

                sessionStorage.crumbs = JSON.stringify(arr);
            }

            this.element.breadcrumb(this.options);
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);