define(['sitecore'], function(sitecore) {
    var defaultStructure = {
            "totalRecordCount": 12,
            "messages": [],
            "data": {
                "localization": {
                    "fields": []
                },
                "content": []
            }
        },
        reportDataKeyFields = [
            'managerRootId',
            'messageId',
            'messageName',
            'language',
            'url',
            'os',
            'deviceType',
            'browser',
            'country',
            'region',
            'city',
            'event',
            'hour'
        ],
        dataSamples = {
            os: ['WinNT', 'OsX', 'Android', 'KitKat', 'Jelly Bean', 'iOS 6.x', 'iOS 8.x', 'BlackBerry 10.2', 'webOS'],
            messageId: ['message1', 'message2', 'message3', 'message4', 'message5', 'message6', 'message7'],
            messageName: ['Spring offer', 'Welcome bonus', 'Campaign with a long title', 'Sales 2016', 'New spring collection', 'Final clearance', 'Future reductions'],
            language: ['en', 'de', 'da', 'uk', 'jp'],
            managerRootId: ['root1', 'root2', 'root3'],
            url: ['/Promotions/Sales/Coupons.aspx', '/Products/All.aspx', '/Landing.aspx', '/Promotions/Sales.aspx', '/Products/New.aspx', '/Home.aspx', '/AboutUs.aspx'],
            deviceType: ['Comnputer', 'Tablet', 'Mobile', 'Other'],
            browser: ['Chrome', 'Safari', 'Opera', 'IE', 'FireFox'],
            country: ['Danmark', 'Canada', 'Germany', 'Ukraine', 'Sweden'],
            region: ['region1', 'region2', 'region3'],
            city: ['Copenhagen', 'Aarhus', 'Odense', 'Toronto', 'Vancouver', 'Ottawa', 'Cologne', 'Bonn', 'Berlin', 'Kyiv', 'Odesa', 'Lviv', 'Stockholm', 'Lund'],
            event: _.range(1, 6),
            hour: _.range(24)
        },
        generatedKeys = [],
        keyMappingIds = [];

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function DataGenerationService() {
    }

    _.extend(DataGenerationService.prototype, {
        // {keyOptions: {count: 5}, contentOptions: {count: 20, date:{start: '2015-05-05', end: '2016-01-15'}}}
        generate: function (options) {
            this.options = options;
            var data = _.clone(defaultStructure);
            data.data.localization = {};
            data.data.localization.fields = [{ field: 'key', translations: this.generateKeys(options.keyOptions) }];
            data.data.content = this.generateContent(options.contentOptions);
            return data;
        },

        generateKeys: function(options) {
            this.keys = {};
            for (var i = 0; i < options.count; i++) {
                var mappingId = 'id' + i;
                this.keys[mappingId] = this.generateKey(options);
                keyMappingIds.push(mappingId);
            }
            return this.keys;
        },

        generateContent: function(options) {
            var content = [];
            for (var i = 0; i < options.count; i++) {
                content.push(this.generateContentItem(options));
            }
            return content;
        },

        generateContentItem: function (options) {
            var keyName = keyMappingIds[_.random(0, keyMappingIds.length - 1)],
                key = this.keys[keyName],
                contentItem = {
                    date: randomDate(new Date(options.date.start), new Date(options.date.end)),
                    key: keyName,
                    timeOnSite: _.random(0, 50000),
                    pageViews: _.random(0, 5),
                    bounces: _.random(0, 5),
                    count: _.random(0, 10)
                },
                event = this.getEvent(key);

            switch(event) {
                case 5:
                    contentItem.visits = _.random(0, 2);
                    contentItem.value = 0;
                    break;
                case 2:
                    contentItem.visits = _.random(0, 25);
                    contentItem.value = _.random(0, 50);
                    break;
                case 1:
                    contentItem.visits = _.random(0, 50);
                    contentItem.value = 0;
                    break;
                case 4:
                    contentItem.visits = _.random(0, 100);
                    contentItem.value = 0;
                    break;
                default:
                    contentItem.visits = _.random(0, 5);
                    contentItem.value = 0;
                    break;
            }

            return contentItem;
        },

        getEvent: function(key) {
            var eventIndex = _.indexOf(this.options.keyOptions.keyFields || reportDataKeyFields, 'event');
            return key[eventIndex];
        },

        // {count: 5, keyFields: ['managerRootId', 'messageId', 'messageName'], events: [1, 2]}
        generateKey: function(options) {
            var key = [],
                keyFields = options.keyFields || reportDataKeyFields;

            _.each(keyFields, function (field) {
                var dataSample = dataSamples[field];
                if (field === 'messageName') {
                    return;
                }

                if (field === 'event' && options.events) {
                    dataSample = options.events;
                }

                var randomIndex = _.random(0, dataSample.length - 1);
                key.push(dataSample[randomIndex]);
                if (field === 'messageId' && _.indexOf(keyFields, 'messageName') >= 0) {
                    key.push(dataSamples['messageName'][randomIndex]);
                }
            });
            generatedKeys.push(key);
            return key;
        }

    });
    return new DataGenerationService();
});