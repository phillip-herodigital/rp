﻿define(["sitecore"], function (Sitecore) {
  return {
    DataUri: function(initVal) {
      var prefix = "sitecore://";

      this.id = null;
      this.ver = null;
      this.lang = null;
      this.rev = null;

      this.from = function (str) {
        if (str.indexOf(prefix) != 0) {
          return;
        }

        var idEnd = str.indexOf("?") || str.length - 1;
        this.id = str.slice(prefix.length, idEnd);
        this._ensureIdFormat();

        if (idEnd < str.length - 1) {
          var params = Sitecore.Helpers.url.getQueryParameters(str);
          this.ver = params.ver;
          this.lang = params.lang;
          this.rev = params.rev;
        }
      };

      this.fromObject = function (ob) {
        if(ob.ItemID) {
          this.id = ob.ItemID;
          this._ensureIdFormat();
        }
        
        if(ob.Language && ob.Language.Name) {
          this.lang = ob.Language.Name;
        }
        
        if (ob.Version && ob.Version.Number) {
          this.ver = ob.Version.Number;
        }
      };

      this.toString = function () {
        var output = prefix + this.id;
        if (this.ver) {
          output = Sitecore.Helpers.url.addQueryParameters(output, { ver: this.ver });
        }

        if (this.lang) {
          output = Sitecore.Helpers.url.addQueryParameters(output, { lang: this.lang });
        }

        if (this.rev) {
          output = Sitecore.Helpers.url.addQueryParameters(output, { rev: this.rev });
        }

        return output;
      };

      this._ensureIdFormat = function () {
        if (this.id.substring(0, 1) != "{") {
          this.id = "{" + this.id + "}";
        }

        this.id = this.id.toUpperCase();
      };

      if (initVal) {
        if (_.isObject(initVal)) {
          this.fromObject(initVal);
        }
        else {
          this.from(initVal);
        }
      }
    },

    composeUri: function (storage) {
      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      var la = storage.get("languageName") || params.la;
      var id = storage.get("itemId") || params.id;
      var vs = storage.get("version") || params.vs;

      var uri = null;

      if (id != null && vs != null) {
        uri = "sitecore://" + id + "?ver=" + vs;
      }

      if (la != null) {
        uri += "&lang=" + la;
      }

      return uri;
    }
  }
});