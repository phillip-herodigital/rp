// Hack described here http://www.telerik.com/community/forums/sharepoint-2007/full-featured-editor/paragraph-style-names-don-t-match-config.aspx
function OnClientSelectionChange(editor, args) {
  var tool = editor.getToolByName("FormatBlock");
  if (tool) {
    setTimeout(function () {
      var defaultBlockSets = [
        ["p", "Normal"],
        ["h1", "Heading 1"],
        ["h2", "Heading 2"],
        ["h3", "Heading 3"],
        ["h4", "Heading 4"],
        ["h5", "Heading 5"],
        ["menu", "Menu list"],
        ["pre", "Formatted"],
        ["address", "Address"]];

      var value = tool.get_value();

      var block = Prototype.Browser.IE
        ? defaultBlockSets.find(function (element) { return element[1] == value; })
        : [value];

      if (block) {
        var tag = block[0];
        var correctBlock = editor._paragraphs.find(function (element) { return element[0].indexOf(tag) > -1; });
        if (correctBlock) {
          tool.set_value(correctBlock[1]);
        }
      }
    }, 0);
  }
}

// Fix mentioned here http://www.telerik.com/community/forums/aspnet-ajax/editor/html-entity-characters-are-not-escaped-on-hyperlink-editor-email-subject.aspx
function OnClientPasteHtml(sender, args) {
  var commandName = args.get_commandName();
  var value = args.get_value();
  if (Prototype.Browser.IE && (commandName == "LinkManager" || commandName == "SetLinkProperties")) {
    if (/<a[^>]*href=['|"]mailto:.*subject=/i.test(value)) {
      var hrefMarker = 'href=';

      // quote could be ' or " depending on subject content
      var quote = value.charAt(value.indexOf(hrefMarker) + hrefMarker.length);
      var regex = new RegExp(hrefMarker + quote + 'mailto:.*subject=.*' + quote, 'i');
      var fixedValue = value.replace(regex, function (str) { return str.replace(/</g, "&lt;").replace(/>/g, "&gt;"); });
      args.set_value(fixedValue);
    }
  } else if (commandName == "Paste") {
    // The StripPathsFilter() method receives as a parameter an array of strings (devided by a white space) that will be stripped from the absolute links.
    var relativeUrl = getRelativeUrl(); //returns the relative url.
    var domainUrl = window.location.protocol + '//' + window.location.host;
    if (relativeUrl) {
      var filter = new Telerik.Web.UI.Editor.StripPathsFilter([relativeUrl, domainUrl]); //strip the domain name from the absolute path

      var contentElement = document.createElement("SPAN");
      contentElement.innerHTML = value;
      var newElement = filter.getHtmlContent(contentElement);
      value = newElement.innerHTML;
      if (scForm.browser.isFirefox) {
        value = value.replace(/%7e\//ig, '~/');
      }

      args.set_value(value);  //set the modified pasted content in the editor
    }
  }

  if (Prototype.Browser.IE) {
    var helperIframe = $$("iframe[title^='Paste helper']:first")[0];
    if (helperIframe) {
      Element.setStyle(helperIframe, { widht: 0, height: 0 });
    }
  }
}

function getRelativeUrl() {
  var result = window.location.href;
  if (result) {
    var query = window.location.search;
    if (query) {
      result = result.substring(0, result.length - query.length);
    }

    var slashPosition = result.lastIndexOf('/');
    if (slashPosition > -1) {
      result = result.substring(0, slashPosition + 1);
    }
  }

  return result;
}

function fixIeObjectTagBug() {
  var objects = Element.select($('Editor_contentIframe').contentWindow.document, 'object');
  var i;
  for (i = 0; i < objects.length; i++) {
    if (!objects[i].id || objects[i].id.indexOf('IE_NEEDS_AN_ID_') > -1) {
      objects[i].id = 'IE_NEEDS_AN_ID_' + i;
    }
  }
}