<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Grid Promos.ascx.cs" Inherits="Website.layouts.Modules.GridPromos" %>

<article class="marketing gridPromos">
	<div class="wrapper">
		<div class="grid three">
            <asp:Repeater ID="rptPromoItems" DataSource="<%# (PromoItems) %>" runat="server">
                <ItemTemplate>
                    <div class="col accent-blue">
				        <i class="icon-lightbulb-large"></i>
				        <h4><strong>Become</strong> A Customer</h4>
				        <p>It&#8217;s easy.<br />
				        Click here to start today.</p>
				        <p><a href="#" class="button">Sign Up</a></p>
			        </div>
                </ItemTemplate>
            </asp:Repeater>
			<div class="col accent-blue">
				<i class="icon-lightbulb-large"></i>
				<h4><strong>Become</strong> A Customer</h4>
				<p>It&#8217;s easy.<br />
				Click here to start today.</p>
				<p><a href="#" class="button">Sign Up</a></p>
			</div>
			<div class="col accent-green">
				<i class="icon-freeenergy-large"></i>
				<h4><strong>Get</strong> Free Energy</h4>
				<p>Say goodbye to gas and electric bills forever<sup>1</sup>.</p>
				<p><a href="#" class="button">Free Energy</a></p>
			</div>
			<div class="col accent-orange">
				<i class="icon-money-large"></i>
				<h4><strong>Build</strong> Residual Income</h4>
				<p>Earn monthly income with The Ignite Opportunity.</p>
				<p><a href="#" class="button">Opportunity</a></p>
			</div>
		</div>
	</div>
</article>