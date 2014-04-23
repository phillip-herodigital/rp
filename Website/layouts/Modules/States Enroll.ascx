<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="States Enroll.ascx.cs" Inherits="Website.layouts.Modules.States_Enroll" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing state-tabs states-enroll" state-tabs="texas">
	<ul class="tabs-nav">
		<li ng-click="selectPane('texas')" ng-class="{ active: pane == 'texas' }">
			<a href="">
				<span><i class="icon-state-texas"></i></span>
				<%=FieldRenderer.Render(CurrentContextItem, "Texas State Text") %>
			</a>
		</li>
		<li ng-click="selectPane('georgia')" ng-class="{ active: pane == 'georgia' }">
			<a href="">
				<span><i class="icon-state-georgia"></i></span>
				<%=FieldRenderer.Render(CurrentContextItem, "Georgia State Text") %>
			</a>
		</li>
		<li ng-click="selectPane('pennsylvania')" ng-class="{ active: pane == 'pennsylvania' }">
			<a href="">
				<span><i class="icon-state-pennsylvania"></i></span>
				<%=FieldRenderer.Render(CurrentContextItem, "Pennsylvania State Text") %>
			</a>
		</li>
		<li ng-click="selectPane('maryland')" ng-class="{ active: pane == 'maryland' }">
			<a href="">
				<span><i class="icon-state-maryland"></i></span>
				<%=FieldRenderer.Render(CurrentContextItem, "Maryland State Text") %>
			</a>
		</li>
		<li ng-click="selectPane('newjersey')" ng-class="{ active: pane == 'newjersey' }">
			<a href="">
				<span><i class="icon-state-newjersey"></i></span>
				<%=FieldRenderer.Render(CurrentContextItem, "New Jersey State Text") %>
			</a>
		</li>
		<li ng-click="selectPane('newyork')" ng-class="{ active: pane == 'newyork' }">
			<a href="">
				<span><i class="icon-state-newyork"></i></span>
				<%=FieldRenderer.Render(CurrentContextItem, "New York State Text") %>
			</a>
		</li>
		<li ng-click="selectPane('washingtondc')" ng-class="{ active: pane == 'washingtondc' }">
			<a href="">
				<span><i class="icon-state-washingtondc"></i></span>
				<%=FieldRenderer.Render(CurrentContextItem, "Washington DC State Text") %>
			</a>
		</li>
	</ul>
	<div class="tab-content" ng-class="{ hidden : pane != 'texas' }">
		<div class="tab-header">
			<div class="wrapper">
				<p>
                    <a href="https://secure.streamenergy.net/tx_rates.asp?CO_LA=" class="button white"><%=FieldRenderer.Render(CurrentContextItem, "View Rates Text") %></a>
                    <a href="https://secure.streamenergy.net/signup_customer.asp?BC_ID=1&RefSite=SCS&CO_LA=US_EN&State=TX&AccountType=R" class="button green"><%=FieldRenderer.Render(CurrentContextItem, "Enroll Now Text") %></a>
                </p>
			</div>
		</div>
	</div>
	<div class="tab" ng-class="{ hidden : pane != 'georgia' }">
		<div class="tab-header">
			<div class="wrapper">
				<p>
                    <a href="https://secure.streamenergy.net/ga_rates.asp?CO_LA=" class="button white"><%=FieldRenderer.Render(CurrentContextItem, "View Rates Text") %></a>
                    <a href="https://secure.streamenergy.net/signup_customer.asp?BC_ID=1&amp;RefSite=SCS&amp;CO_LA=US_EN&amp;State=GA&amp;AccountType=R" class="button green"><%=FieldRenderer.Render(CurrentContextItem, "Enroll Now Text") %></a>
                </p>
			</div>
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'pennsylvania' }">
		<div class="tab-header">
			<div class="wrapper">
				<p>
                    <a href="https://secure.streamenergy.net/pa_rates.asp?CO_LA=" class="button white"><%=FieldRenderer.Render(CurrentContextItem, "View Rates Text") %></a>
                    <a href="https://secure.streamenergy.net/enroll_redir.asp?BC_ID=1&amp;RefSiteId=6&amp;St=PA&amp;AccountType=R&amp;CO_LA=US_EN" class="button green"><%=FieldRenderer.Render(CurrentContextItem, "Enroll Now Text") %></a>
                </p>
			</div>
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'maryland' }">
		<div class="tab-header">
			<div class="wrapper">
				<p>
                    <a href="https://secure.streamenergy.net/md_rates.asp?CO_LA=" class="button white"><%=FieldRenderer.Render(CurrentContextItem, "View Rates Text") %></a>
                    <a href="https://secure.streamenergy.net/enroll_redir.asp?BC_ID=1&amp;RefSiteId=6&amp;St=MD&amp;AccountType=R&amp;CO_LA=US_EN" class="button green"><%=FieldRenderer.Render(CurrentContextItem, "Enroll Now Text") %></a>
                </p>
			</div>
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'newjersey' }">
		<div class="tab-header">
			<div class="wrapper">
				<p>
                    <a href="https://secure.streamenergy.net/nj_rates.asp?CO_LA=" class="button white"><%=FieldRenderer.Render(CurrentContextItem, "View Rates Text") %></a>
                    <a href="https://secure.streamenergy.net/enroll_redir.asp?BC_ID=1&amp;RefSiteId=6&amp;St=NJ&amp;AccountType=R&amp;CO_LA=US_EN" class="button green"><%=FieldRenderer.Render(CurrentContextItem, "Enroll Now Text") %></a>
                </p>
			</div>
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'newyork' }">
		<div class="tab-header">
			<div class="wrapper">
				<p>
                    <a href="https://secure.streamenergy.net/ny_rates.asp?CO_LA=" class="button white"><%=FieldRenderer.Render(CurrentContextItem, "View Rates Text") %></a>
                    <a href="https://secure.streamenergy.net/enroll_redir.asp?BC_ID=1&amp;RefSiteId=6&amp;St=NY&amp;AccountType=R&amp;CO_LA=US_EN" class="button green"><%=FieldRenderer.Render(CurrentContextItem, "Enroll Now Text") %></a>
                </p>
			</div>
		</div>
	</div>
    <div class="tab" ng-class="{ hidden : pane != 'washingtondc' }">
		<div class="tab-header">
			<div class="wrapper">
				<p>
                    <a href="https://secure.streamenergy.net/dc_rates.asp?CO_LA=" class="button white"><%=FieldRenderer.Render(CurrentContextItem, "View Rates Text") %></a>
                    <a href="https://secure.streamenergy.net/enroll_redir.asp?BC_ID=1&amp;RefSiteId=6&amp;St=DC&amp;AccountType=R&amp;CO_LA=US_EN" class="button green"><%=FieldRenderer.Render(CurrentContextItem, "Enroll Now Text") %></a>
                </p>
			</div>
		</div>
	</div>
</article>