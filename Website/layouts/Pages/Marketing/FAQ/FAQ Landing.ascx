<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="FAQ Landing.ascx.cs" Inherits="Website.layouts.Pages.Marketing.FAQ.FAQ_Landing" %>
<%@ Register TagPrefix="cus" TagName="FAQListing" Src="FAQ Listing.ascx" %>

<article class="marketing state-tabs" state-tabs="texas">
	<ul class="tabs-nav">
		<li ng-click="selectPane('texas')" ng-class="{ active: pane == 'texas' }">
			<a href="">
				<span><i class="icon-state-texas"></i></span>
                <sc:FieldRenderer FieldName="Texas Title" runat="server" />
			</a>
		</li>
		<li ng-click="selectPane('georgia')" ng-class="{ active: pane == 'georgia' }">
			<a href="">
				<span><i class="icon-state-georgia"></i></span>
				<sc:FieldRenderer FieldName="Georgia Title" runat="server" />
			</a>
		</li>
		<li ng-click="selectPane('pennsylvania')" ng-class="{ active: pane == 'pennsylvania' }">
			<a href="">
				<span><i class="icon-state-pennsylvania"></i></span>
				<sc:FieldRenderer FieldName="Pennsylvania Title" runat="server" />
			</a>
		</li>
		<li ng-click="selectPane('maryland')" ng-class="{ active: pane == 'maryland' }">
			<a href="">
				<span><i class="icon-state-maryland"></i></span>
				<sc:FieldRenderer FieldName="Maryland Title" runat="server" />
			</a>
		</li>
		<li ng-click="selectPane('newjersey')" ng-class="{ active: pane == 'newjersey' }">
			<a href="">
				<span><i class="icon-state-newjersey"></i></span>
				<sc:FieldRenderer FieldName="New Jersey Title" runat="server" />
			</a>
		</li>
		<li ng-click="selectPane('newyork')" ng-class="{ active: pane == 'newyork' }">
			<a href="">
				<span><i class="icon-state-newyork"></i></span>
				<sc:FieldRenderer FieldName="New York Title" runat="server" />
			</a>
		</li>
		<li ng-click="selectPane('washingtondc')" ng-class="{ active: pane == 'washingtondc' }">
			<a href="">
				<span><i class="icon-state-washingtondc"></i></span>
				<sc:FieldRenderer FieldName="Washington DC Title" runat="server" />
			</a>
		</li>
	</ul>
	<div class="tab-content" ng-class="{ hidden : pane != 'texas' }">
		<div class="tab-header">
			<div class="wrapper"></div>
		</div>
		<div class="wrapper">
			<cus:FAQListing id="faqTexas" runat="server" />
		</div>
	</div>
	<div class="tab" ng-class="{ hidden : pane != 'georgia' }">
		<div class="tab-header">
			<div class="wrapper"></div>
		</div>
		<div class="wrapper">
			<cus:FAQListing id="faqGeorgia" runat="server" />
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'pennsylvania' }">
		<div class="tab-header">
			<div class="wrapper"></div>
		</div>
		<div class="wrapper">
			<cus:FAQListing id="faqPennsylvania" runat="server" />
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'maryland' }">
		<div class="tab-header">
			<div class="wrapper"></div>
		</div>
		<div class="wrapper">
			<cus:FAQListing id="faqMaryland" runat="server" />
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'newjersey' }">
		<div class="tab-header">
			<div class="wrapper"></div>
		</div>
		<div class="wrapper">
			<cus:FAQListing id="faqNewJersey" runat="server" />
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'newyork' }">
		<div class="tab-header">
			<div class="wrapper"></div>
		</div>
		<div class="wrapper">
			<cus:FAQListing id="faqNewYork" runat="server" />
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'washingtondc' }">
		<div class="tab-header">
			<div class="wrapper"></div>
		</div>
		<div class="wrapper">
			<cus:FAQListing id="faqWashingtonDC" runat="server" />
		</div>
	</div>
</article>