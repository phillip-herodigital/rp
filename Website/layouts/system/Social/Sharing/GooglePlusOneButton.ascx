<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.GooglePlus.Client.Sharing.Controls.GooglePlusOneButton" %>
<%@ Import Namespace="Sitecore.Social.Client.Common.Helpers" %>
<script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>
<div style="float:right;">
  <div class="g-plusone" data-href="<%= SharingHelper.GetSharePageUrlWithAnalyticsParameters(this.CampaignId) %>" data-callback="googlePlusOneSubscribe" data-size="medium"></div>
</div>
