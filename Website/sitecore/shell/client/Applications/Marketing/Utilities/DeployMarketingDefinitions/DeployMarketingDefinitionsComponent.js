define(["sitecore"], function (Sitecore) {
	Sitecore.Factories.createBaseComponent({
		name: "DeployMarketingDefinitions",
		base: "ControlBase",
		selector: ".sc-DeployMarketingDefinitions",
		attributes: [
			{ name: "isBusy", defaultValue: false }
		],

		extendModel: {
		},

		initialize: function () {
			var renderingId = this.model.get("name"),
				deployButton = this.app[renderingId + "btnDeploy"];

			deployButton.on("click", function () {
				this.deployDefinitions();
			}, this); 
		},

		afterRender: function () {
			
		},
		
		deployDefinitions: function () {
			var renderingId = this.model.get("name");
			var self = this;
			var definitionTypes = [];
			
			var campaigns = this.app[renderingId + "cbCampaigns"].get("isChecked");
			if (campaigns)
				definitionTypes.push("campaigns");
			
			var goals = this.app[renderingId + "cbGoals"].get("isChecked"); 
			if (goals)
				definitionTypes.push("goals");
			
			var assets = this.app[renderingId + "cbMarketingAssets"].get("isChecked");
			if (assets)
				definitionTypes.push("marketingassets");
			
			var outcomes = this.app[renderingId + "cbOutcomes"].get("isChecked");
			if (outcomes)
				definitionTypes.push("outcomes");
			
			var publishTaxonomies = this.app[renderingId + "cbTaxonomies"].get("isChecked");

			jQuery.ajax({				
			    type: "POST",
                
				url: "/api/sitecore/DeployMarketingDefinitions/Deploy",
				data: { "definitionTypes": JSON.stringify(definitionTypes), "publishTaxonomies": publishTaxonomies },
				beforeSend: function () {
					self.model.set("isBusy", true);
				},
				success: function (success) {
					if (success) {
						alert('success');
					}
				},
				error: function () {
					
				},
				complete: function () {
					self.model.set("isBusy", false);
				}
			});
		}
	});
});