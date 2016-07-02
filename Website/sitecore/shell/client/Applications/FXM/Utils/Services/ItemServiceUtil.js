define(["/-/speak/v1/client/itemservice.js"], function () {
    var itemService = new ItemService({ url: '/sitecore/api/ssc/item' });
    
    return {
        instance: itemService,
        create: function(entity, parentPath) {
            var handle = itemService.create(entity);
            if (!!parentPath) {
                handle = handle.path(parentPath);
            }

            return handle.execute();
        },
        fetchItem: function(id, standardFields) {
            return itemService.fetchItem(id)
                .includeStandardTemplateFields(!!standardFields)
                .execute();
        }
    }
});