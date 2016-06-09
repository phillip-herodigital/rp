(function (speak) {
    define( ["knockout", "/sitecore/shell/client/Business Component Library/version 2/Assets/lib/scUserProfile"], function ( ko ) {
    var collapseOnBodyClick = function (e) {
      e.stopPropagation();
      if ($(e.target).closest('.sc-dropdownbutton').size() == 0) {
        this.IsOpen = false;
      }
    };
    
    var ActionModel = function (action, component) {
      this.component = component;
      this.Id = ko.observable(action.Id);
      this.Text = ko.observable(action.Text);
      this.Tooltip = ko.observable(action.Tooltip);
      this.ImageUrl = ko.observable(action.ImageUrl);
      
      this.IsIcon = ko.computed(function () {
        return (this.ImageUrl) ? true : false;
      }, this);
      
      this.BackgroundPosition = ko.observable(action.BackgroundPosition);
      this.IsFavorite = ko.observable(action.IsFavorite);
      this.IsFavoriteIconEnable = ko.observable(true);
      this.IsDefaultAction = ko.observable(action.IsDefaultAction);
      this.Click = ko.observable(action.Click);
      this.IsEnabled = ko.observable(action.IsEnabled || true);
      this.Disable = function () {
        this.isEnabled(false);
      };
      this.Enable = function () {
        this.isEnabled(true);
      };
      this.togglefavorite = function () {
        this.IsFavorite(!this.IsFavorite());
        
        this.component.upDateFavorite(this, this.IsFavorite());
      };
    };

    ActionModel.prototype.invoke = function () {
      var click = this.Click();

      if (!this.IsEnabled) {
        return;
      }

      if (this.Click) {
        var i = click.indexOf(":");
        if (i <= 0) {
          throw "Invocation is malformed (missing 'handler:')";
        }

        speak.module("pipelines").get("Invoke").execute({
          control: this,
          app: this.app,
          handler: click.substr(0, i),
          target: click.substr(i + 1)
        });
      }
    };

    speak.component({
      name: "ActionControl",
      initialize: function () {
        this.defineProperty( "Favorites", [] );
        this.defineProperty( "ActionStatus", [] );
      },
      initialized: function () {
        var userProfile = Sitecore.Speak.module( 'userProfile' ).UserProfile;

        this.UserProfile = new userProfile( this );
        this.ActionStatus = this.UserProfileState;

        var actionColumnsObject = JSON.parse(this.ActionColumnsJSON);
        var favorites = [];
        var self = this;
        actionColumnsObject.forEach(function (column) {
          column.ActionGroups.forEach(function (group) {
            var newActionLinks = [];
            group.ActionLinks.forEach(function (actionLink) {
              var actionLinkModel = new ActionModel(actionLink, self);
              newActionLinks.push(actionLinkModel);

              var isFavorite = actionLink.IsFavorite;
              
              if (self.ActionStatus.length > 0) {
                var actStatus = speak.utils.array.find(self.ActionStatus, function (act) {
                  return act.id === actionLink.Id;
                });
                
                isFavorite = actStatus ? true : false;
              }
              if (isFavorite) {
                favorites.push(actionLinkModel);
              }
            });
            group.ActionLinkModels = newActionLinks;
          });
        });
        
        this.ActionColumns = actionColumnsObject;
        this.Favorites = favorites;
        this.on("change:IsOpen", this.changeStatus, this);
      },
      changeStatus: function () {
        if (this.IsOpen) {
          $(document).off("click").on("click", $.proxy(collapseOnBodyClick, this));
        } else {
          $(document).off("click");
        }
      },
      toggleIsOpen: function () {
        this.IsOpen = !this.IsOpen;
      },
      upDateFavorite: function (actionLink, isFavorite) {
        if (!isFavorite) {
          this.viewModel.Favorites.remove(actionLink);
        } else {
          this.viewModel.Favorites.push(actionLink);
        }
        this.updateUserSettings();
      },
      updateUserSettings: function () {
        
        var self = this;
        this.ActionStatus = [];
        this.viewModel.Favorites().forEach(function (fav) {
          self.ActionStatus.push({
            id: fav.Id(),
            favorite: fav.IsFavorite()
          });
        });

        this.UserProfileState = this.ActionStatus;
      }
    });
  });
})(Sitecore.Speak);