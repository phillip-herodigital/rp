<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Facebook.Client.Sharing.Controls.LikeButton" %>
<%@ Import Namespace="Sitecore.Social.Client.Common.Helpers" %>
<script src="http://connect.facebook.net/en_US/all.js#xfbml=1"></script>
<div style="float: right;">
    <fb:like href="<%= SharingHelper.GetSharePageUrlWithAnalyticsParameters(this.CampaignId) %>" layout="button_count" show_faces="true"></fb:like>
</div>