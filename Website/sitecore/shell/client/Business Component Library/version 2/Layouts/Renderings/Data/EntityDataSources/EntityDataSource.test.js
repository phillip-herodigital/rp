describe("Given a EntityDataSource component", function() {
  var app = Sitecore.Speak.app,
    component = Sitecore.Speak.app.EntityDataSourceBook;

  it("ServiceUrl property should obtain value from rendering parameters", function() {
    expect(component.ServiceUrl).toBe("/sitecore/api/ssc/speak-guidance/book");
  });

  it("EntityID property should obtain value from rendering parameters", function() {
    expect(component.EntityID).toBe("1");
  });

  it("IsBusy property should be false by default", function() {
    expect(component.IsBusy).toBe(false);
  });

  it("Entity property should be empty object by default", function() {
    expect(component.Entity).toEqual({});
  });

  it("the following properties should be bindable: ServiceUrl, EntityID, IsBusy, Entity", function() {
    expect(app.TextBoxServiceUrl.Value).toBe(component.ServiceUrl);
    expect(app.TextBoxEntityID.Value).toBe(component.EntityID);
    expect(app.TextBoxIsBusy.Value).toBe(component.IsBusy);
    expect(app.TextBoxEntity.Value).toBe(component.Entity);
  });

  describe("when I call refresh() function", function() {
    var log;

    beforeEach(function(done) {
      log = "";

      component.on("change:Entity", function() {
        log += component.IsBusy
          ? "is busy when entity is updating -> "
          : "is not busy when entity is updating -> ";
      });

      component.refresh();

      if (component.IsBusy === true) {
        log += "changed to busy before request -> ";
      }

      var intervalId = setInterval(function() {
        if (!component.IsBusy) {
          clearInterval(intervalId);
          done();
        }
      }, 10);
    });

    afterEach(function() {
      component.off("change:Entity");
    });

    it("component should request entity from server", function() {
      expect(component.Entity.Title).toBe("A Wizard of Earthsea");
    });

    it("IsBusy property should be true while server is processing request", function() {
      if (component.IsBusy === false) {
        log += "changed to not busy after request";
      }

      expect(log).toBe("changed to busy before request -> is busy when entity is updating -> changed to not busy after request");
    });
  });

  describe("when I change EntityID property", function() {
    beforeEach(function(done) {
      component.EntityID = "2";

      var intervalId = setInterval(function() {
        if (!component.IsBusy) {
          clearInterval(intervalId);
          done();
        }
      }, 10);
    });

    it("component should request entity from server", function() {
        expect(component.Entity.Title).toBe("The Last Wish");
    });
  });
});

describe("Given a EntityDataSource component with non-existing EntityId", function() {
  var component = Sitecore.Speak.app.EntityDataSourceWrongId;

  describe("when I call refresh() function", function() {
    beforeEach(function(done) {
      component.refresh();

      var intervalId = setInterval(function() {
        if (!component.IsBusy) {
          clearInterval(intervalId);
          done();
        }
      }, 10);
    });

    it("IsBusy property should not stuck in true state", function() {
      expect(component.IsBusy).toBe(false);
    });
  });
});