ECMEditorProfile = new function ()
{
  this.userFields = new Array();

  this.CmdInsertUserField = function (token)
  {
    if (token != null)
    {
      Telerik.Web.CommonScripts.radControls[2].pasteHtml("$" + token + "$");
      this.hidePopupMenu();
    }
  }

  this.DownloadDataFields = function ()
  {
    $telerik.$.get('/sitecore%20modules/web/EmailCampaign/GetUserFields.aspx?itemId=' + scItemID, function (data)
    {
      if (data.split == null)
      {
        return;
      }

      var x;
      var fields = data.split('|');
      for (x in fields)
      {
        ECMEditorProfile.userFields[x] = fields[x];
      }

      ECMEditorProfile.createPopupMenu();
    });
  }

  this.GetDataFields = function ()
  {
    return ECMEditorProfile.userFields;
  }

  this.ShowPopup = function (event)
  {
    var div = document.getElementById("InsertFieldDiv");
    if (div != null)
    {
      div.style.display = "block";
    }

    Event.stop(event);
  }

  this.hidePopupMenu = function ()
  {
    var div = document.getElementById("InsertFieldDiv");
    if (div != null)
    {
      div.style.display = "none";
    }
  }

  this.FillUserFields = function ()
  {
    var arr = window.document.getElementsByTagName("span");
    var i;
    var element;
    for (i = 0; i < arr.length; i++)
    {
      element = arr[i];
      if (element.className == "Insert Field")
      {
        var parent = element.parentNode;
        if (parent.className == "reDropdown" && parent.tagName.toLowerCase() == "a")
        {
          parent.id = "InsertField";
          parent.title = "Insert Field";

          element.innerHTML = "Insert Field";

          ECMEditorProfile.addEvent(parent, 'click', ECMEditorProfile.ShowPopup);
        }
      }
    }
  }

  this.Initialize = function ()
  {
    ECMEditorProfile.addEvent(window, 'load', ECMEditorProfile.FillUserFields);

    ECMEditorProfile.DownloadDataFields();
  }

  this.addEvent = function (control, event, method)
  {
    if (control.addEventListener)
    {
      control.addEventListener(event, method, false);
    }
    else if (control.attachEvent)
    {
      control.attachEvent("on" + event, method);
    }
  }

  this.createPopupMenu = function ()
  {
    var dropdownLink = $telerik.$('#InsertField');
    if (dropdownLink == null || dropdownLink.offset() == null)
    {
      setTimeout("ECMEditorProfile.createPopupMenu()", 100);
      return;
    }

    var form = document.forms[0];

    if (form != null)
    {
      var div = document.createElement("div");
      div.setAttribute("id", "InsertFieldDiv");
      div.className = "reDropDownBody";
      div.style.display = "none";
      div.style.position = "absolute";
      div.style.left = dropdownLink.offset().left + "px";
      div.style.top = (dropdownLink.offset().top + dropdownLink.outerHeight()) + "px";
      div.style.zIndex = "100000";
      div.style.height = "189px";
      div.style.width = "200px";
      div.style.borderStyle = "Solid";
      div.style.borderWidth = "1px";
      div.style.borderColor = "#828282";
      div.style.background = "white";
      div.setAttribute("unselectable", "on");
      $telerik.$(div).bind("mouseleave", function () { this.style.display = "none"; });
      //div.style.overflow = "auto";

      var table = document.createElement("table");
      table.setAttribute("cellpadding", "0");
      table.setAttribute("border", "0");
      table.setAttribute("unselectable", "on");
      table.style.cursor = "default";
      table.style.width = "100%";

      var i = 0;
      for (i = 0; i < this.userFields.length; i++)
      {
        var tr = table.insertRow(i);
        tr.setAttribute("unselectable", "on");

        var td = tr.insertCell(0);
        td.style.width = "100%";
        td.style.fontSize = "13px";
        td.style.fontFamily = "arial";
        td.setAttribute("unselectable", "on");

        td.setAttribute("id", this.userFields[i]);
        td.innerHTML = this.userFields[i];

        $telerik.$(td).bind("mouseover", function (e) { e.currentTarget.style.background = '#DFDFDF'; });
        $telerik.$(td).bind("mouseout", function (e) { e.currentTarget.style.background = 'white'; });
        $telerik.$(td).bind("click", function (e) { ECMEditorProfile.CmdInsertUserField(e.currentTarget.id) });
      }

      div.appendChild(table);
      form.appendChild(div);
    }

  }
}

$telerik.$(document).ready(function () { ECMEditorProfile.Initialize(); });