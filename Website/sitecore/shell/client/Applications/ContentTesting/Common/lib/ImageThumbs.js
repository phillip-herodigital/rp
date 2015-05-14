var arResComponents;
if (window.location.host && window.location.host != '') { // launching when address to web-page
  arResComponents = [
                      "/-/speak/v1/contenttesting/TooltipCustom.js",
                      "/-/speak/v1/contenttesting/RequestUtil.js"
  ];
}
else { // launching of the code-coverage estemating
  arResComponents = [];
}

define(arResComponents, function (tooltip, requestUtil) {
  return {
    ImageThumbs: function (options) {
      var safeOptions = options || {};
      return {
        dictionary: safeOptions.dictionary || null,

        _tooltip: undefined,

        populateImage: function (item, imgElement, imgContainer, getUrl, callback) {

          var self = this;

          this._tooltip = new TooltipCustom(false);

          var attrs = item.attrs;
          if (typeof attrs == 'undefined')
            attrs = {};

          var url = getUrl + "?id= " + attrs.id;
          if (attrs.version) { url += "&version=" + attrs.version; }
          if (attrs.combination) { url += "&combination=" + attrs.combination; }
          if (attrs.mvvariants) { url += "&mvvariants=" + attrs.mvvariants; }
          if (attrs.rules) { url += "&rules=" + attrs.rules; }
          if (item.name) { url += "&itemName=" + item.name; }
          if (attrs.compareVersion) { url += "&compareVersion=" + attrs.compareVersion; }
          if (attrs.revision) { url += "&revision=" + attrs.revision; }
          if (attrs.language) { url += "&language=" + attrs.language; }

          var ajaxOptions = {
            cache: false,
            url: url,
            context: this,
            success: function(data) {
              if (data && data.pathImage && data.pathImage != "") {
                imgElement.attr("src", data.pathImage);

                if (imgContainer) {
                  var content = self.getTooltipContent(item);
                  self._tooltip.setTarget(imgContainer, content);
                }

                if (callback) {
                  callback(item, imgElement, imgContainer, data.pathImage);
                }
              }
            },
            error: function(req, status, error) {
              console.log("ImageThumbs ajax call failed");
              console.log(status);
              console.log(error);
              console.log(req);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        },

        populateImages: function (items, imgElementLocator, getUrl, itemCallback, finishCallback) {
          var self = this;
          this._tooltip = new TooltipCustom(false);

          var data = _.map(items, function (item) {
            var attrs = item.attrs;
            if (typeof attrs == 'undefined')
              attrs = {};

            return {
              id : attrs.id,
              version: attrs.version,
              language: attrs.language,
              mvvariants : attrs.mvvariants,
              combination : attrs.combination,
              rules : attrs.rules,
              itemName : item.name,
              compareVersion : attrs.compareVersion,
              revision: attrs.revision,
              uid: item.uId
            };
          });

          var ajaxOptions = {
            cache: false,
            url: getUrl,
            type: "POST",
            data: { items: JSON.stringify(data) },
            context: this,
            success: function (data) {
              if (data) {
                _.each(data, function (t) {
                  var el;
                  if (imgElementLocator) {
                    el = imgElementLocator(t.uid);
                    el.attr("src", t.url);
                  }

                  if (itemCallback) {
                    itemCallback(t.uid, el, t.url);
                  }
                });
              }

              if (finishCallback)
                finishCallback();
            },
            error: function (req, status, error) {
              console.log("ImageThumbs ajax call failed");
              console.log(status);
              console.log(error);
              console.log(req);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        },

        populateImages: function (items, imgElementLocator, startGetUrl, endGetUrl, itemCallback, finishCallback) {
          var self = this;
          this._tooltip = new TooltipCustom(false);

          if (items && imgElementLocator && imgElementLocator != null) {
            _.each(items, function (item) {
              var el = imgElementLocator(item.uId);
              if (el && el.length > 0) {
                var infoElem;
                if (el[0].id.toLowerCase().indexOf("before") >= 0) {
                  infoElem = el.parent().parent().find("#imgInfoBefore");
                } else {
                  infoElem = el.parent().parent().find("#imgInfoAfter");
                }
                if (infoElem) {
                  var content = self.getTooltipContent(item);
                  self._tooltip.setTarget(infoElem, content);
                }
              }
            });
          }

          var data = _.map(items, function (item) {
            var attrs = item.attrs;
            if (typeof attrs == 'undefined')
              attrs = {};

            return {
              id: attrs.id,
              version: attrs.version,
              language: attrs.language,
              mvvariants: attrs.mvvariants,
              combination: attrs.combination,
              rules: attrs.rules,
              itemName: item.name,
              compareVersion: attrs.compareVersion,
              revision: attrs.revision,
              uid: item.uId
            };
          });

          var ajaxOptions = {
            cache: false,
            url: startGetUrl,
            type: "POST",
            data: { items: JSON.stringify(data) },
            context: this,
            success: function (data) {
              if (data) {
                if (data.urls) {
                  _.each(data.urls, function (t) {
                    self._setImage(t.uid, t.url, imgElementLocator, itemCallback);
                  });
                }
                if (data.handle) {
                  self._tryFinishPopulateImages({
                    endGetUrl: endGetUrl,
                    handle: data.handle,
                    imgElementLocator: imgElementLocator,
                    itemCallback: itemCallback,
                    finishCallback: finishCallback
                  });
                }
                else if (finishCallback) {
                  finishCallback();
                }
              }
            },
            error: function (req, status, error) {
              console.log("ImageThumbs ajax call failed");
              console.log(status);
              console.log(error);
              console.log(req);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        },

        _tryFinishPopulateImages: function (params) {
          var self = this;

          var ajaxOptions = {
            cache: false,
            url: params.endGetUrl + "?handle=" + params.handle,
            type: "GET",
            context: this,
            success: function (data) {
              if (data) {
                if (data.urls) {
                  _.each(data.urls, function (t) {
                    self._setImage(t.uid, t.url, params.imgElementLocator, params.itemCallback);
                  });
                }
                if(data.IsDone) {
                  if (params.finishCallback) {
                    params.finishCallback();
                  }
                }
                else {
                  setTimeout(function () {
                    self._tryFinishPopulateImages(params), {
                      endGetUrl: params.endGetUrl,
                      handle: params.handle,
                      imgElementLocator: params.imgElementLocator,
                      itemCallback: params.itemCallback,
                      finishCallback: params.finishCallback
                    }
                  }, 1500);
                }
              }
            },
            error: function (req, status, error) {
              console.log("ImageThumbs ajax call failed");
              console.log(status);
              console.log(error);
              console.log(req);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        },

        _setImage: function(uid, url, imgElementLocator, itemCallback) {
          var el;
          var updated = true;
          if (imgElementLocator) {
            el = imgElementLocator(uid);
            if (el.attr("src") != url) {
              el.attr("src", url);
            }
            else {
              updated = false;
            }
          }

          if (itemCallback && updated) {
            itemCallback(uid, el, url);
          }
        },

        getTooltipContent: function (item) {
          // todo: Skynet: translate
          var info = "<span><b>" + this.dictionary.get("Variation information:") + "</b></span></br>";
          info += this.getVariationInfo(item);
          return info;
        },

        getVariationInfo: function (item) {
          var info = "";
          if (item.testType) {
            info += this.dictionary.get("Type:") + " " + this.dictionary.get(item.testType) + "</br>";
          }
          if (item.testType == "Content") {
            if (item.attrs.path && item.attrs.path != "")
              info += this.dictionary.get("Item:") + " " + item.attrs.path + "</br>";

            if (item.attrs.version && item.attrs.version != "") {
              var version = item.attrs.version;
              if (item.attrs.language && item.attrs.language != "")
                version += "-" + item.attrs.language;
              info += this.dictionary.get("Version:") + " " + version + "</br>";
            }

            if (item.createdDate) {
              var d = new Date(parseInt(item.createdDate.substr(6)));
              if (d) {
                year = d.getFullYear();
                month = this.pad(d.getMonth() + 1, 2);
                day = this.pad(d.getDate(), 2);
                finalDate = day + "-" + month + "-" + year;
                info += this.dictionary.get("Created:") + " " + finalDate + "</br>";
              }
            }
          }
          else if (item.testType == "Component") {
            if (item.attrs.componentname && item.attrs.componentname != "") {
              info += this.dictionary.get("Name:") + " " + item.attrs.componentname + "</br>";
            }
            if (item.attrs.item && item.attrs.item != "")
              info += this.dictionary.get("Item:") + " " + item.attrs.item + "</br>";
            if (item.attrs.hidden && item.attrs.hidden != "")
              info += this.dictionary.get("Hidden") + ": " + this.dictionary.get(item.attrs.hidden) + "</br>";
          }
          else if (item.testType == "Personalization") {
            if (item.attrs.condition && item.attrs.condition != "") {
              info += this.dictionary.get("Condition:") + " " + item.attrs.condition + "</br>";
            }
            if (item.attrs.componentname && item.attrs.componentname != "") {
              info += this.dictionary.get("Name:") + " " + item.attrs.componentname + "</br>";
            }
            if (item.attrs.personalizedcontent && item.attrs.personalizedcontent != "")
              info += this.dictionary.get("Personalized content:") + " " + item.attrs.personalizedcontent + "</br>";
            if (item.attrs.hidden && item.attrs.hidden != "")
              info += this.dictionary.get("Hidden") + ": " +  this.dictionary.get(item.attrs.hidden) + "</br>";
          }

          return info;
        },

        pad: function (number, length) {
          var str = '' + number;
          while (str.length < length) {
            str = '0' + str;
          }
          return str;
        }
      }
    },

  }
});