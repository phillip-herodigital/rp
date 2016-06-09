(function (_sc) {
  describe("Given a Menu component", function () {
    var sut = _sc.app.Menu,
        $sutEl = $(sut.el);
    afterEach(function () {
      sut.MenuStatus = [];
      sut.setStatusInUserProfile();
    });

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("IsVisible should exist", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("IsEnabled should exist", function () {
      expect(sut.IsEnabled).toBeDefined();
    });

    it("should have (in this example) 14 menuitems", function () {
      expect($(".menuItem").length).toEqual(17);
    });
    it("when I expand a Category, it should open it.", function () {
      var $categoryContainer = $("[sc-guid='{6C288D57-026A-472F-9407-699BCF54C11B}']");
      var $category = $("[sc-guid='{6C288D57-026A-472F-9407-699BCF54C11B}']").parent().find(">.header");
      if (!$category.hasClass("open")) {
        $category.click();
      }

      expect($category.hasClass("open")).toEqual(true);
      expect($categoryContainer.css("display")).toEqual("block");

    });

    it("when I click on an item it should have SelectedItemId and SelectedItemName properties set", function () {
      var $menuItem = $("[data-sc-menuitemid='{CE79CC80-8F61-4E1E-9068-897D5F320F82}']");
      $menuItem.click();

      expect(sut.SelectedItemId).toBe("{CE79CC80-8F61-4E1E-9068-897D5F320F82}");
      expect(sut.SelectedItemName).toBeDefined("HLB - target - No Click");
    });

    it("it should have '.disableMask' visible when IsEnabled = false'", function () {
      sut.IsEnabled = false;
      expect($sutEl.find(".disableMask").css('display')).toBe("block");
    });

    it("it should have '.disableMask' not visible when IsEnabled = true'", function () {
      sut.IsEnabled = true;
      expect($sutEl.find(".disableMask").css('display')).toBe("none");
    });

    it("when clicking a collapsed first menu item it should expand it's content", function () {
      var secondFirstLevelMenu = $($sutEl.find(".header.menuItem")[1]);
      var secondFirstLevelMenuLink = $(secondFirstLevelMenu.find("a"));

      if (secondFirstLevelMenu && secondFirstLevelMenuLink) {
        if (secondFirstLevelMenu.attr('isopen') != "true") {
          secondFirstLevelMenuLink.click();
        }
        expect(secondFirstLevelMenu.next().css('display')).toBe("block");
        expect(secondFirstLevelMenu.attr('isopen')).toBe("true");
      }
    });

    it("when clicking the arrow of a second level menu item it should expand it's content", function () {
      var firstFirstLevelMenu = $($sutEl.find(".header.menuItem")[0]);
      if (firstFirstLevelMenu) {
        var firstNestedItem = firstFirstLevelMenu.next().find(".itemRow.menuItem.depth2");
        var arrow = firstNestedItem.find(".leftcolumn .arrowcontainer");
        if (firstNestedItem.attr('isopen') != "true") {
          arrow.click();
        }

        expect(firstNestedItem.attr('isopen')).toBe("true");
      }
    });

    it("when selecting a second level menu item and then collapsing it's first level parent, the parent content is collapsed and the parent looks selected", function () {
      var firstFirstLevelMenu = $($sutEl.find(".header.menuItem")[0]);
      if (firstFirstLevelMenu) {
        if (firstFirstLevelMenu.attr('isopen') != "true") {
          firstFirstLevelMenu.click();
        }
        expect(firstFirstLevelMenu.attr('isopen')).toBe("true");
        var topLevelContainer = firstFirstLevelMenu.next();
        expect(topLevelContainer.css('display')).toBe("block");

        var firstNestedItem = topLevelContainer.find(" > div > .itemRow.menuItem.depth2")[4];
        var href = $(firstNestedItem).find("a");
        href.click();

        firstFirstLevelMenu.click();
        expect(firstFirstLevelMenu.hasClass('selected')).toBe(false);
      }
    });
  });

})(Sitecore.Speak);