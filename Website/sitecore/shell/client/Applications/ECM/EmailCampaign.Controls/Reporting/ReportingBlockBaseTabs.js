define([
    "sitecore",
    "/-/speak/v1/ecm/ReportingBlockBase.js"
], function (sitecore, ReportingBlockBase) {
    var view = ReportingBlockBase.view.extend({
        initialize: function () {
            this._super();
            this.charts = this.findCharts();
            this.initTabs();
        },

        initTabs: function () {
            if (this.children.Tabs) {
                this.tabContents = this.getTabContents();
                this.bindTabs();
                this.showTab(this.children.Tabs.get('selectedTabIndex'));
            }
        },

        getTabContents: function () {
            var tabContents = {};
            _.each(this.children, _.bind(function (child, key) {
                if (key.indexOf('TabContent') >= 0) {
                    tabContents[key] = child;
                }
            }, this));
            return tabContents;
        },

        hideTabContents: function () {
            _.each(this.tabContents, function (tabContent) {
                tabContent.set('isVisible', false);
            });
        },

        bindTabs: function () {
            this.children.Tabs.on('change:selectedTabIndex', function () {
                this.showTab(this.children.Tabs.get('selectedTabIndex'));
            }, this);
        },

        showTab: function (index) {
            this.hideTabContents();
            var tabContent = this.tabContents['TabContent' + index];
            if (tabContent) {
                tabContent.set('isVisible', true);
                this.updateCharts();
            }
        },

        updateCharts: function() {
            _.each(this.charts, function (chart) {
                if (chart.viewModel.$el.is(':visible') && !chart._renderedOnce) {
                    chart.viewModel.refresh(false);
                }
            });
        },

        findCharts: function () {
            var charts = [];
            _.each(this.children, function (child) {
                if (child.componentName.indexOf('Chart') >= 0) {
                    charts.push(child);
                }
            });
            return charts;
        }
    });

    return { model: ReportingBlockBase.model, view: view };
});