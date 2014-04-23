﻿<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="States Enroll.ascx.cs" Inherits="Website.layouts.Modules.States_Enroll" %>

<article class="marketing state-tabs" state-tabs>
	<ul class="tabs-nav">
		<li ng-click="selectPane('texas')" ng-class="{ active: pane == 'texas' }">
			<a href="">
				<span><i class="icon-state-texas"></i></span>
				Texas
			</a>
		</li>
		<li ng-click="selectPane('georgia')" ng-class="{ active: pane == 'georgia' }">
			<a href="">
				<span><i class="icon-state-georgia"></i></span>
				Georgia
			</a>
		</li>
		<li ng-click="selectPane('pennsylvania')" ng-class="{ active: pane == 'pennsylvania' }">
			<a href="">
				<span><i class="icon-state-pennsylvania"></i></span>
				Pennsylvania
			</a>
		</li>
		<li ng-click="selectPane('maryland')" ng-class="{ active: pane == 'maryland' }">
			<a href="">
				<span><i class="icon-state-maryland"></i></span>
				Maryland
			</a>
		</li>
		<li ng-click="selectPane('newjersey')" ng-class="{ active: pane == 'newjersey' }">
			<a href="">
				<span><i class="icon-state-newjersey"></i></span>
				New Jersey
			</a>
		</li>
		<li ng-click="selectPane('newyork')" ng-class="{ active: pane == 'newyork' }">
			<a href="">
				<span><i class="icon-state-newyork"></i></span>
				New York
			</a>
		</li>
		<li ng-click="selectPane('washingtondc')" ng-class="{ active: pane == 'washingtondc' }">
			<a href="">
				<span><i class="icon-state-washingtondc"></i></span>
				Washington, D.C.
			</a>
		</li>
	</ul>
	<div class="tab-content" ng-class="{ hidden : pane != 'texas' }">
		<div class="tab-header">
			<div class="wrapper">
				<p><a href="#" class="button">View Electricity Rates</a> <a href="#" class="button">Enroll Now</a></p>
			</div>
		</div>
	</div>
	<div class="tab" ng-class="{ hidden : pane != 'georgia' }">
		<div class="tab-header">
			<div class="wrapper">
				<p>Header content here 2.</p>
			</div>
		</div>
		<div class="wrapper">
			<p>Body content here 2.</p>
		</div>
	</div>
</article>