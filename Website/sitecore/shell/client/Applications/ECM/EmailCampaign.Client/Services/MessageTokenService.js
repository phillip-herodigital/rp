define([
  "backbone",
  "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/StringHelper.js"
], function (
  backbone,
  serverRequest,
  StringHelper
  ) {

  var messageTokenService = backbone.Model.extend({
    initialize: function() {
      this.set("tokens", null);
      this.set("context", null);
      // default value, can be changed
      this.set("url", "EXM/PersonalizationTokensRequest");
      this.set("selectedToken", null);
      this.on("change:context", this.loadTokens, this);
    },

    loadTokens: function () {
      serverRequest(this.get("url"), {
        data: this.get("context"),
        success: this.onResponse,
        context: this
      });
    },

    decodeTokenNames: function (tokens) {
      _.each(tokens, function (token) {
        token.name = StringHelper.decodeHTMLCharCodes(token.name);
      });
      return tokens;
    },

    onResponse: function (response) {
      if (response.error) {
        alert(response.errorMessage);
        return;
      }

      if (response.comboBoxList && $.type(response.comboBoxList) === 'array') {
        this.set("tokens", [], {silent: true});
        this.set("tokens", this.decodeTokenNames(response.comboBoxList));
      }
    },

    replaceToken: function (text) {
      if (text) {
        _.each(this.get("tokens"), function (item) {
          var find = item.id.replace(/\$/g, '\\$');
          text = text.replace(new RegExp(find, 'g'), item.name);
        });
      }
      return text;
    }
  });

  return new messageTokenService();
});