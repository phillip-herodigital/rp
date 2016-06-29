define([
    "sitecore",
    "/-/speak/v1/ecm/ReportingBlockBase.js",
    "/-/speak/v1/ecm/MathHelper.js",
    "/-/speak/v1/ecm/constants.js"
], function (sitecore, ReportingBlockBase, MathHelper, Constants) {
    var model = ReportingBlockBase.model.extend({
        reCalculate: function() {
            this.urlGroup = this.getUrlGroup();
            this.set('mostValuable', this.getMostValuable());
            this.set('mostRelevant', this.getMostRelevant());
            this.set('mostClicked', this.getMostClicked());
        },

        getUrlGroup: function () {
            return this.get('dataSource').dimension('url').group({
                click: { $sum: 'visits' },
                value: '$sum',
                pageViews: '$sum'
            });
        },

        getMostValuable: function () {
            var mostValuable = this.urlGroup.order(function (group) {
                return new Number(MathHelper.divide(group.value, group.click));
            }).top(1)[0];

            return mostValuable || this.emptyItem();
        },

        getMostRelevant: function () {
            var mostRelevant = this.urlGroup.orderBy('value').top(1)[0];
            return mostRelevant || this.emptyItem();
        },

        getMostClicked: function () {
            var mostClicked = this.urlGroup.orderBy('click').top(1)[0];
            return mostClicked || this.emptyItem();
        }
    });

    var view = ReportingBlockBase.view.extend({
        childComponents: [
            'LandingInfoMostValuable',
            'LandingInfoMostRelevant',
            'LandingInfoMostClicked',
            'LandingInfoMostAttention'
        ],

        attachHandlers: function () {
            this._super();
            this.model.on({
                'change:mostValuable': this.updateMostValuable,
                'change:mostRelevant': this.updateMostRelevant,
                'change:mostClicked': this.updateMostClicked
            }, this);
        },

        setNoData: function (childName) {
            this.children[childName].set('value',
                    sitecore.Resources.Dictionary.translate("ECM.NoDataToDisplay"));
            this.children[childName].set('description', '');
        },

        updateMostValuable: function () {
            var mostValuable = this.model.get('mostValuable'),
                valuePerVisit = new Number(MathHelper.divide(mostValuable.value.value, mostValuable.value.click, 2));
            
            if (valuePerVisit > 0) {
                this.children.LandingInfoMostValuable.set('value', { title: mostValuable.key, url: mostValuable.key });
                this.children.LandingInfoMostValuable.set('description', valuePerVisit + ' ' +
                    sitecore.Resources.Dictionary.translate("ECM.Reporting.ValuePerVisit"));
            } else {
                this.setNoData('LandingInfoMostValuable');
            }
        },

        updateMostRelevant: function () {
            var mostRelevant = this.model.get('mostRelevant');
            if (mostRelevant.value.value) {
                this.children.LandingInfoMostRelevant.set('value', { title: mostRelevant.key, url: mostRelevant.key });
                this.children.LandingInfoMostRelevant.set('description', mostRelevant.value.value + ' ' +
                    sitecore.Resources.Dictionary.translate("ECM.Reporting.Value"));
            } else {
                this.setNoData('LandingInfoMostRelevant');
            }
        },

        updateMostClicked: function () {
            var mostClicked = this.model.get('mostClicked');
            if (mostClicked.value.click) {
                this.children.LandingInfoMostClicked.set('value', { title: mostClicked.key, url: mostClicked.key });
                this.children.LandingInfoMostClicked.set('description', mostClicked.value.click + ' ' +
                    sitecore.Resources.Dictionary.translate("ECM.Reporting.Clicks"));
            } else {
                this.setNoData('LandingInfoMostClicked');
            }
            
        }
    });

    return sitecore.Factories.createComponent("LandingPagesReport", model, view, ".sc-LandingPagesReport");
});