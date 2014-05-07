<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="HTML Layout.aspx.cs" Inherits="StreamEnergy.MyStream.layouts.HTML_Layout" %>

<!DOCTYPE html>
<!--[if IE 8]>         <html ng-app="ngApp" class="no-js ie8 lt-ie10 lt-ie9"> <![endif]-->
<!--[if IE 9]>         <html ng-app="ngApp" class="no-js ie9 lt-ie10"> <![endif]-->
<!--[if gt IE 8]><!--> <html ng-app="ngApp" class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8" />

	<title>Title</title>

	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<link rel="shortcut icon" type="image/ico" href="/frontend/assets/i/favicon.ico" />
	<link href="/frontend/assets/css/global.css" rel="stylesheet" />

	<script src="/frontend/assets/js/libs/modernizr/modernizr.js"></script>
	<script src="/frontend/assets/js/libs/angular/angular.min.js"></script>
	<script src="/frontend/assets/js/libs/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
	<script src="/frontend/assets/js/libs/angular-ui-utils/ui-utils.min.js"></script>

	<script src="/frontend/assets/js/app.js"></script>

    <script src="/frontend/assets/js/directives/main-nav.js"></script>
    <script src="/frontend/assets/js/directives/state-tabs.js"></script>

	<script src="/frontend/assets/js/controllers/main.js"></script>
	<script src="/frontend/assets/js/controllers/marketing.js"></script>
    <script src="/frontend/assets/js/controllers/loginHorizontal.js"></script>

	<script type="text/javascript" src="//use.typekit.net/hag0zvs.js"></script>
	<script type="text/javascript">try { Typekit.load(); } catch (e) { }</script>

</head>
<body ng-controller="MainCtrl">
    <form runat="server">
	<div class="page-wrapper" ng-class="{open:sidebarOpen}">
		<nav>
			<ul>
				<li ng-repeat="item in navLinks">
					<a href="{{item.href}}">{{item.name}}</a>
				</li>
			</ul>
		</nav>
		<div class="page-content">
			<header class="site-header" main-nav>
				<div class="wrapper">
					<a href="/" class="logo">Logo</a>
					<p class="utility"><a href="#">Manage My Account</a></p>
					<a href="" class="nav-toggle icon-hamburger" ng-click="toggleSidebar()">Toggle Nav</a>
                    <nav class="main-nav">
					    <ul class="wrapper">
                            <asp:Repeater ID="rptNavigationItems" runat="server">
                                <ItemTemplate>
                                    <li <%# Eval("SubNavAttributes") %> class="<%# Eval("CssClass") %>"><a href="<%# Eval("URL") %>"><%# Eval("Text") %></a></li>
                                </ItemTemplate>
                            </asp:Repeater>
					    </ul>
				    </nav>
				</div>
                <nav class="sub-nav">
                    <ul class="wrapper" ng-class="{ hidden: subnav != 0 }" ng-mouseover="showSubnav(0)" ng-mouseout="hideSubnav()">
						<li><a>&nbsp;</a></li>
					</ul>
                    <asp:Repeater ID="rptSubNavs" runat="server">
                        <ItemTemplate>
                            <ul class="wrapper" ng-class="{ hidden: subnav != <%# Eval("SubNavNum") %> }" ng-mouseover="showSubnav(<%# Eval("SubNavNum") %>)" ng-mouseout="hideSubnav()">
                                <asp:Repeater ID="rptSubNavItems" runat="server">
                                    <ItemTemplate>
                                        <li><a href="<%# Eval("URL") %>"><%# Eval("Text") %></a></li>
                                    </ItemTemplate>
                                </asp:Repeater>
					        </ul>
                        </ItemTemplate>
                    </asp:Repeater>
				</nav>
			</header>

			<div id="divBanner" class="banner marketing" runat="server">
				
			</div>

			
			<section class="layout cols-1">
				
				<sc:placeholder key="content" runat="server" />

			</section>

			<sc:placeholder key="footer" runat="server" />
		</div>
	</div>
    </form>
</body>
</html>