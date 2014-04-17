<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="HTML Layout.aspx.cs" Inherits="Website.layouts.HTML_Layout" %>


<!DOCTYPE html>
<!--[if IE 8]>         <html ng-app="ngApp" class="no-js ie8 lt-ie10 lt-ie9"> <![endif]-->
<!--[if IE 9]>         <html ng-app="ngApp" class="no-js ie9 lt-ie10"> <![endif]-->
<!--[if gt IE 8]><!--> <html ng-app="ngApp" class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8" />

	<title>Title</title>

	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<link rel="shortcut icon" type="image/ico" href="assets/i/favicon.ico" />
	<link href="assets/css/global.css" rel="stylesheet" />

	<script src="assets/js/libs/jquery/dist/jquery.min.js"></script>
	<script src="assets/js/libs/modernizr/modernizr.js"></script>
	<script src="assets/js/libs/angular/angular.min.js"></script>
	<script src="assets/js/libs/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
	<script src="assets/js/libs/angular-ui-utils/ui-utils.min.js"></script>

	<script src="assets/js/app.js"></script>
	<script src="assets/js/controllers/main.js"></script>
	<script src="assets/js/controllers/marketing.js"></script>

	<script type="text/javascript" src="//use.typekit.net/hag0zvs.js"></script>
	<script type="text/javascript">try { Typekit.load(); } catch (e) { }</script>

</head>
<body ng-controller="MainCtrl">
	<div class="page-wrapper" ng-class="{open:sidebarOpen}">
		<nav>
			<ul>
				<li ng-repeat="item in navLinks">
					<a href="{{item.href}}">{{item.name}}</a>
				</li>
			</ul>
		</nav>
		<div class="page-content">
			<header class="site-header">
				<div class="wrapper">
					<a href="/" class="logo">Logo</a>
					<p class="utility"><a href="#">Manage My Account</a></p>
					<a href="" class="nav-toggle icon-hamburger" ng-click="toggleSidebar()">Toggle Nav</a>
				</div>
				<nav>
					<ul class="wrapper">
						<li><a href="#">Rates, Products, &amp; Services</a></li>
						<li class="selected"><a href="#">Opportunity</a></li>
						<li><a href="#">Company</a></li>
						<li><a href="#">Contact Us</a></li>
						<li><a href="#">Pay My Bill</a></li>
					</ul>
				</nav>
			</header>

			<div class="banner marketing" style="background-image: url(assets/i/marketing/header-home-01.jpg)">
				
			</div>

			
			<section class="layout cols-1">
				
				<sc:placeholder key="content" runat="server" />

			</section>

			<footer class="site-footer">
				<div class="super-footer">
					<div class="wrapper">
						<div class="grid three">
							<div class="col">
								<ul>
									<li><a href="#"><img src="assets/i/img-footer-get-free-energy.png" alt="Get Free Energy" width="159" height="44" /></a></li>
									<li><a href="#"><img src="assets/i/img-footer-renew-my-contract.png" alt="Renew My Contract" width="120" height="45" /></a></li>
								</ul>
							</div>
							<div class="col quick-links">
								<h2><i class="icon-quicklinks"></i> Quick Links</h2>
								<ul>
									<li><a href="#">Account Overview</a></li>
									<li><a href="#">Utility Services</a></li>
									<li><a href="#">Homelife Services</a></li>
									<li><a href="#">My Profile</a></li>
								</ul>
							</div>
							<div class="col social">
								<h2><i class="icon-social"></i> Social</h2>
								<ul>
									<li><a href="#"><i class="icon-facebook"></i> Facebook</a></li>
									<li><a href="#"><i class="icon-twitter"></i> Twitter</a></li>
									<li><a href="#"><i class="icon-youtube"></i> YouTube</a></li>
									<li><a href="#"><i class="icon-pinterest"></i> Pinterest</a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="wrapper copyright">
					<p>&copy; 2005-2013 SGE IP Holdco, LLC. All rights reserved. Licensed in TX, GA, PA, MD, NJ, NY, &amp; DC<br />
					(TX #10104, GA #GM-38, NJ #ESL-0109 &amp; GSL-0120, PA #A-2010-2181867 &amp; A-2012-2308991, MD #IR-2072 &amp; IR-2742, NY #STRM, DC EA11-11)</p>
					<ul>
						<li><a href="#"><i class="icon-bbb"></i></a></li>
						<li><a href="#"><i class="icon-dsa"></i></a></li>
					</ul>
				</div>
			</footer>
		</div>
	</div>

</body>
</html>