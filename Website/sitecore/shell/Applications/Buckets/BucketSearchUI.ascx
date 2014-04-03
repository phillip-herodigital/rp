<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="BucketSearchUI.ascx.cs" Inherits="Sitecore.Buckets.Module.BucketSearchUI" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Import Namespace="Sitecore.Buckets.Localization" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>

<div id="MainPanel">
  <div class="content">
    <div class="box">
      <div id="ui_element" class="sb_wrapper">
        <span id="views">
          <a class="active list" id="list" title="<%= Translate.Text(Texts.ListView)%>"></a>
          <a class="grid" id="grid" title="<%= Translate.Text(Texts.GridView)%>"></a>
        </span>
        <div class="sb_search_container">
          <span class="sb_down" title="<%= Translate.Text(Texts.MoreSearchOptions)%>"> &nbsp;</span>
          <ul class="token-input-list-facebook boxme">
            <li class="token-input-input-token-facebook">
              <input class="addition" id="token-input-demo-input-local" type="text" />
            </li>
          </ul>
          <input class="sb_input" id="typesearch" type="text" />
          <input class="sb_clear" onclick="onSbClearClick()" tabindex="-1" title="<%= Translate.Text(Texts.Clear)%>" type="button" value="" />
          <input class="sb_search" title="<%= Translate.Text(Texts.Search)%>" type="button" value="" />
        </div>

        <div id="slider"></div>
        <div class="hastip" title="<%= Translate.Text(Texts.NeedToEnterSomeSearchText)%>">
          <p><%= Translate.Text(Texts.NeedToEnterSomeSearchText)%></p>
        </div>
        <div class="errortip" title="<%= Translate.Text(Texts.ErrorThatStoppedSearch)%>">
          <p><%= Translate.Text(Texts.ErrorThatStoppedSearch)%></p>
        </div>
        <div class="sb_dropdown" style="display: none;"></div>
      </div>

    </div>

    <div id="resultInfoMessage"></div>
    <div class="contentAreaWrapper">
      <div class="pageSection" style="float: left">
        <div class="loadingSection" id="loadingSection"></div>
        <div class="selectable" id="results">
        </div>
      </div>
      <div class="facets" style="float: right">
        <div class="navAlpha slide-out-div"></div>
      </div>
    </div>
  </div>
</div>
