///#source 1 1 /sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/src/Collection-FieldNameDisplay.js
(function(Speak) {

  define("Collection/DisplayFieldName", [], function () {

    return {
      /**
       * Returns the value of the DisplayFieldName property on the given item.
       * 
       * @example
       * myComponent.DisplayFieldName = "name";
       * 
       * var newItem = { name: "Martin" };
       * myComponent.add(newItem);
       * 
       * var displayName = myComponent.getDisplayName(newItem);
       * console.log(displayName); // outputs: Martin
       * 
       * @param {Object} item - The item to get the display name from.
       * @alias Collection#getDisplayName
       */
      getDisplayName: function (item) {
        item = item[0] || item;
        return item[this.DisplayFieldName];
      }
    }

  });

})(Sitecore.Speak);
///#source 1 1 /sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/src/Collection-FieldNameValue.js
(function(Speak) {

  define("Collection/ValueFieldName", [], function () {

    return {

      /**
       * Similar to findWhere but does a search specifically on the ValueFieldName property.
       * Returns the first item that has a value matching <b>value</b>.
       * @param {*} value - The value that should be searched for.
       * @alias Collection#getByValue
       */
      getByValue: function (value) {
        var attributes = {};
        attributes[this.ValueFieldName] = value;

        return this.findWhere(attributes);
      },

      /**
       * Returns the value of the ValueFieldName property on the given item.
       * 
       * @example
       * myComponent.ValueFieldName = "age";
       * 
       * var newItem = { name: "John", age: 30 };
       * myComponent.add(newItem);
       * 
       * var value = myComponent.getValue(newItem);
       * console.log(value); // outputs: 30
       * 
       * @param {Object} item - The item to read the value field of.
       * @alias Collection#getValue
       */
      getValue: function (item) {
        item = item[0] || item;
        return item[this.ValueFieldName];
      }
    }


  });

})(Sitecore.Speak);
///#source 1 1 /sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/src/Collection-Data.js
(function(Speak) {
  define('Collection/Data', [], function () {
    
    function createItems(data) {
      var alreadyCalled = false;
      var hook = {
        data: data,
        wait: false,

        /**
         * @callback hookCallback
         * @param {Object|Array} result - The value to apply after hook is finished.
         */
        result: function (result) {
          alreadyCalled = true;

          /**
           * Triggers Whenever the list of items change
           * @event Collection#change:Items
           * @type {Object[]}
           */
          // slice(0) makes a copy which enforces a change event
          this.Items = result || data.slice(0);
        }.bind(this)
      };
      
      /**
       * hook:Items event that allows you to decorate DynamicData with view specific details
       * and apply that to the Items property whenever the DynamicData changes.
       * 
       * @event Collection#hook:Items
       * @type {Object}
       * @property {Object[]} data - The DynamicData property being passed along.
       * @property {boolean} wait - If you need to handle the hook async set the wait flag to true.
       * @property {hookCallback} result - Call this method when you have modified the data, to apply it to the Items property.
       * @example <caption>How to set up a hook and set the Items property to decorated list of data. This would be added inside the initialized method.
       * So <i>this</i> refers to your component implementation.</caption>
       * this.on("hook:Items", function(hook) {
       *   var newData = hook.data.map(myDecorateFunc.bind(this));
       *   hook.result(newData);
       * }, this);
       */
      this.trigger("hook:Items", hook);

      if (hook.wait || alreadyCalled)
        return;

      hook.result();
    }

    /**
     * The property that collection use to set and access data. Avoid using this property directly instead use 
     * provided methods for modifying this property. If you want to bind You control to this property, instead use
     * the {@link Collection#Items Items} property.
     * 
     * @name Collection#DynamicData
     * @type {Object[]}
     * @default []
     */
    return {
      initialize: function () {
        /**
         * Should be used for rendering. It is in most cases a shallow copy of DynamicData. However, it is possible to
         * add a {@link Collection#hook:Items hook}, that allows you to modify your data to suit your view.
         * 
         * The hook event allows you to decorate your data with view specific details. So Items can be thought of as a
         * decorated version of DynamicData. Items should only be used by the control and should not be modified ouside
         * of the hook event.
         * 
         * @name Collection#Items
         * @type {Object[]}
         * @default []
         */
        this.defineProperty("Items", []);
      },

      initialized: function () {
        var arr = (typeof this.DynamicData == "string") ? JSON.parse(this.DynamicData) : [];
        this.on("change:DynamicData", createItems, this);
        this.reset(arr);
      },

      /**
       * If you want a new set of data to be applied to your control the reset method is a good place to start.
       * The reset method will remove all old data and replace any new given data. When used it will trigger a
       * change event on the DynamicData property along with a reset event.
       * 
       * @param {Object[]} [items] - New items that should be set instead of the old ones.
       * @alias Collection#reset
       */
      reset: function(items) {
        var newList = [];

        if (Array.isArray(items)) {
          newList = newList.concat(items);
        }

        this.DynamicData = newList;

        /**
         * Triggers when the reset method is called. The newly added items passed along.
         * @event Collection#reset
         * @type {Object[]}
         */
        this.trigger("reset", items);
        this.trigger("change:DynamicData", this.DynamicData);
      },

      /**
       * Allows you to add one item to the DynamicData property. Will trigger a change on DynamicData.
       * It also triggers an 'add' event, if you want to know when something was specifically added.
       * 
       * @example
       * // Add one item
       * myComponent.add({ foo: "bar" });
       * 
       * @param {Object} item - The item that should be added to the end of the list.
       * @alias Collection#add
       */
      add: function(item) {
        this.DynamicData.push(item);

        /**
         * Triggers when add is called. The newly added item is passed along with the event.
         * @event Collection#add
         */
        this.trigger("add", item);
        this.trigger("change:DynamicData", this.DynamicData);
      },

      /**
       * Remove one item from the DynamicData property. Will trigger a change on DynamicData property.
       * It also triggers a 'remove' event, if you want to know when something was specifically removed.
       * 
       * @example
       * // Remove first item in the list
       * var item = myComponent.at(0);
       * myComponent.remove(item);
       * 
       * @param {Object} item - The item to be removed. If you try to remove an item not in the list it will throw an exception.
       * @alias Collection#remove
       */
      remove: function(item) {
        var index = this.DynamicData.indexOf(item);
        if (index === -1)
          throw "Item does not exist and cannot be removed";

        this.DynamicData.splice(index, 1);

        /**
         * Triggers when remove is called. The removed item is passed along.
         * @event Collection#remove
         */
        this.trigger("remove", item);
        this.trigger("change:DynamicData", this.DynamicData);
      },

      /**
       * Remove an item at a given index. Visually the items might be sorted. But this will always refer to the original pre-sorted order.
       * @param {number} index - An integer between 0 and the number of items -1. If provided index is not available it will throw an exception.
       * @alias Collection#removeAt
       */
      removeAt: function (index) {
        return this.remove(this.at(index));
      },

      /**
       * Looks through the DynamicData list and returns the first item that matches all of the key-value pairs listed in <b>attributes</b>.
       * 
       * @example <caption>Find first item where title attribute is "The Castle".</caption>
       * var item = myComponent.findWhere({ title: "The Castle" });
       * 
       * @example <caption>Find first item matching multiple attributes.</caption>
       * var item = myComponent.findWhere({ name: "john", age: 30 });
       * 
       * @param {Object} attributes - Set of key-value pairs to match
       * @alias Collection#findWhere
       */
      findWhere: function(attributes) {
        return _.findWhere(this.DynamicData, attributes);
      },

      /**
       * Looks through the DynamicData list and returns all items that matches all of the key-value pairs listed in <b>attributes</b>.
       * 
       * @example <caption>Find all items where year attribute is 1930.</caption>
       * var booksFrom1930 = myComponent.where({ year: 1930 });
       * 
       * @example <caption>Find all items matching multiple attributes.</caption>
       * var items = myComponent.where({ author: "john doe", year: 1930 });
       * 
       * @param {Object} attributes - Set of key-value pairs to match
       * @alias Collection#where
       */
      where: function (attributes) {
        return _.where(this.DynamicData, attributes);
      },

      /**
       * Find an item at a given index. Visually the items might be sorted. But this will always refer to the original pre-sorted order.
       * 
       * @example
       * var firstItem = myComponent.at(0);
       * @param {number} index - First item is 0.
       * @alias Collection#at
       */
      at: function(index) {
        return this.DynamicData[index];
      },

      /**
       * Find the index of an item.
       * @param {Object} item - The item to search for.
       * @alias Collection#indexOf
       */
      indexOf: function(item) {
        return this.DynamicData.indexOf(item);
      },

      /**
       * Returns <i>true</i> if item is present in {@link Collection#DynamicData DynamicData}.
       * @param {Object} item - The item to search for.
       * @alias Collection#contains
       */
      contains: function(item) {
        return this.indexOf(item) !== -1;
      },

      /**
       * Return <i>true</i> if {@link Collection#DynamicData DynamicData} has any items.
       * @alias Collection#hasData
       */
      hasData: function() {
        return this.DynamicData.length > 0;
      },

      /**
       * Returns the length of {@link Collection#DynamicData DynamicData}.
       * @alias Collection#getNumOfItems
       */
      getNumOfItems: function() {
        return this.DynamicData.length;
      }
    }
  });
})(Sitecore.Speak);
///#source 1 1 /sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/src/Collection-Main.js
define(["Collection/Data", "Collection/DisplayFieldName", "Collection/ValueFieldName"], function (Data, DisplayFieldName, ValueFieldName) {

  /**
   * By default Collection ships with special attributes. But if you do not need the all of special attributes
   * the assemle method lets you create a custom Collection only containing the basics of data handling and an
   * optional amount of special attributes.
   * 
   * @example
   * var ValueFieldCollection = Collection.assemble({ ValueFieldName: true });
   * 
   * @param {assembleOptions} include - What parts to include besides the basics.
   * @memberOf Collection
   */
  function assemble(include) {
    /**
     * @typedef {Object} assembleOptions
     * @alias assembleOptions
     * @property {boolean} [DisplayFieldName] - Include DisplayFieldName related methods and properties.
     * @property {boolean} [ValueFieldName] - Include ValueFieldName related methods and properties.
     */
    include = include || {};

    /**
     * The mixin <b>Collection</b> is intended to be used whenever you have a Control that should render a list of
     * elements.<br> The collection is meant to be used as an extension of your component, meaning it will add
     * properties and methods to your component.
     * 
     * <p>A custom build can be done by using the static {@link Collection.assemble} method, to exclude some of the featues.</p>
     * 
     * @example <caption>Loading and extending a component with Collection</caption>
     * (function (Speak) {
     *   var collectionPath = "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection.js";
     *
     *   Speak.component([collectionPath], function (Collection) {
     *     
     *     return Speak.extend({}, Collection.prototype, {
     *       initialized: function () {
     *         Collection.prototype.initialized.call(this); // call super
     * 
     *         this.on("change:Items", this.render, this);
     *       },
     * 
     *       render: function () {
     *         $(this.el).empty();
     *         this.Items.forEach(function (item) {
     *            $(this.el).append("<li>" + this.getDisplayName(item) + "</li>");
     *         }, this);
     *       }
     *     };
     * 
     *   }, "ListComponent");
     * 
     * })(Sitecore.Speak);
     * 
     * @constructor
     * @mixin Collection
     */
    var Custom = function () { };
    Custom.prototype.constructor = Custom;

    var dfn = include.DisplayFieldName ? DisplayFieldName : {},
      vfn = include.ValueFieldName ? ValueFieldName : {};

    Custom.prototype = Sitecore.Speak.extend({}, Data, dfn, vfn);
    return Custom;
  }

  var Collection = assemble({ ValueFieldName: true, DisplayFieldName: true });
  Collection.assemble = assemble;
  return Collection;
});
