<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Twitter.Client.Sharing.Controls.TweetButton" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Import Namespace="Sitecore.Social.Client.Common.Helpers" %>

<div style="float: right;" runat="server" id="TButton">
    <a href="https://twitter.com/share"
       class="twitter-share-button"
       data-url="<%= HttpUtility.UrlPathEncode(SharingHelper.GetSharePageUrlWithAnalyticsParameters(this.CampaignId))%>"
       data-counturl="<%= HttpUtility.UrlPathEncode(SharingHelper.GetSharePageUrlWithAnalyticsParameters(this.CampaignId))%>"
       data-count="horizontal"><%= Translate.Text(Sitecore.Social.Twitter.Common.Texts.Tweet)%></a>
    <script type="text/javascript" src="https://platform.twitter.com/widgets.js">
    </script>
</div>