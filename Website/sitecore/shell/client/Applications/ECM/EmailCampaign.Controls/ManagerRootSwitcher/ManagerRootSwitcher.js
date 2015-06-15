define(["sitecore"], function(_sc) {
  _sc.Factories.createBaseComponent({
    name: "ManagerRootSwitcher",
    base: "BlockBase",
    selector: ".sc-ecm-managerroot",
    events:
    {
      "click .js-managerroot-btn": "toggleContextMenu",
      "click .root-item": "selectRoot",
      "click .sc-actionpanel-popup": "toggleContextMenu"
    },
    attributes: [
      { name: "isTaskPage", value: "$el.data:sc-istaskpage" },
      { name: "defaultManagerRootId", value: "$el.data:sc-defaultmanagerrootid" },
      { name: "managerRootId", value: "" }
    ],

    initialize: function() {
      var select = "a.root-item[data-root-id=\'" + this.getManagerRootId() + "\']";
      var currentLink = this.$el.find(select).first();
      if (currentLink) {
        this.$el.find(".js-managerroot-btn").find("span:first").text(currentLink.text().toUpperCase());

        $.each(this.$el.find("a.root-item"), function () {
          if ($(this).text() == currentLink.text()) {
            $(this).addClass("current");
            return false;
          }
        });
      }
      setTimeout(function() { $('.sc-ecm-managerroot').fadeIn(800); }, 100);
    },

    getManagerRootId: function () {
      var isTaskPage = this.model.get("isTaskPage");
      if (isTaskPage) {
        sessionStorage.managerRootId = this.model.get("defaultManagerRootId");
      }
      var storedRootId = sessionStorage.managerRootId;
      if (storedRootId === undefined || $.inArray(storedRootId, this.getRootsList()) == -1) {
        storedRootId = this.model.get("defaultManagerRootId");
        sessionStorage.managerRootId = storedRootId;
      }
      this.model.set("managerRootId", storedRootId);
      return storedRootId;
    },

    getRootsList: function() {
      var roots = [];
      var id = "root-id";
      $.each($('div[data-sc-id="EmailManagerRoot"]').find('*[data-' + id + ']'), function() {
        roots.push($(this).data(id));
      });
      return roots;
    },

    toggleContextMenu: function () {
      this.$el.find(".js-managerroot-btn .sc-dropdownbutton-chevron").toggleClass("up");
      this.$el.find(".js-managerroot-list").toggleClass("open");
      this.$el.find(".sc-actionpanel-popup").toggle();
    },

    selectRoot: function(event) {
      var rootId = $(event.target).data("root-id");
      
      $(event.target).parent().siblings().find("a").removeClass("current");
      $(event.target).addClass("current");
      
      sessionStorage.managerRootId = rootId;
      this.$el.find(".js-managerroot-btn").find("span:first").text($(event.target).text().toUpperCase());
      this.model.set("managerRootId", rootId);
      this.toggleContextMenu();
    }
  });
});