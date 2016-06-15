(function (speak) {
  require.config({
    paths: {
      dialog: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/dialog"
    },
    shim: {
      'dialog': { deps: ['sitecore'] },
    }
  });
  
  var selectors = {
    headerSelector: ".sc-dialogWindow-header",
    contentSelector: ".sc-dialogWindow-body",
    footerSelector: ".sc-dialogWindow-buttons"
  };

  var getContentHeight = function(component) {
    var header = component.$el.find(selectors.headerSelector),
      footer = component.$el.find(selectors.footerSelector),
      content = component.$el.find(selectors.contentSelector),
      headerHeight = header && header.length ?
        (header.is(":visible") ? header.outerHeight() : actualSize(header).outerHeight) : 0,
      footerHeight = footer && footer.length ?
        (footer.is(":visible") ? footer.outerHeight() : actualSize(footer).outerHeight) : 0,
      contentHeight = component.$el.data('height') || (content && content.length ?
        (content.is(":visible") ? content.outerHeight() : actualSize(content).outerHeight) : 0);

    return contentHeight - (headerHeight + footerHeight);
  };
  
  var actualSize = function(element) {
    var clone = element.clone(false), size;

    $('body').append(clone.css({ position: "absolute", top: -1000, left: 0 }).show());
    size = {
      width: clone.width(),
      height: clone.height(),
      outerWidth: clone.outerWidth(),
      outerHeight: clone.outerHeight()
    };
    clone.remove();

    return size;
  };
  
  var raiseEvent = function (eventDescriptor, e, data) {
    if (eventDescriptor.on) {
      this[eventDescriptor.on](e, data);
    }
    this.app.trigger(eventDescriptor.name + ":" + this.id, e, data);
  };
  
  var setupEvents = function (component) {
    component.events.forEach(function (eventDescriptor) {
      var self = this;
      var func = function(e, data) {
        raiseEvent.call(self, eventDescriptor, e, data);
      };
      self.$el.on(eventDescriptor.name, func);
    }, component);
  };

  speak.component(["dialog"], {
    name: "DialogWindow",
    events:
    [
      { name: "show", on: "onShow" },
      { name: "hide", on: "onHide" }
    ],
    initialize: function () {
      this.defineProperty("Replace", true);
      this.defineProperty("FocusOn", "");
      this.defineProperty("ConsumeTab", true);
      this.defineProperty("ModalOverflow", false);
      this.$el = $(this.el);
      setupEvents(this);
    },
    initialized: function () {
      if(this.$el.data("height"))
      {
        var contentHeight = getContentHeight(this);
        this.$el.data("height", contentHeight);
      }
    },
    toggle: function () {
      this.$el.modal("toggle");
    },
    show: function () {
      this.$el.modal('show');
    },
    hide: function () {
      this.$el.modal("hide");
    },
    loading: function () {
      this.$el.modal("loading");
    },
    onShow: function () {
      this.trigger("show");
    },
    onHide: function () {
      this.trigger("hide");
    }
  });
})(Sitecore.Speak);