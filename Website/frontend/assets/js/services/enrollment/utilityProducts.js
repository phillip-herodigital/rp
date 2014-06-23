ngApp.factory('utilityProductsService', ['$filter', function ($filter) {
	var addresses = [],
		activeServiceAddress = {},
		availableOfferTypes = [],
		isNewServiceAddress = true,
    	states = [
        {
            'class': 'icon texas',
            'name': 'Texas',
            'value': 'TX'
        },
        {
            'class': 'icon georgia',
            'name': 'Georgia',
            'value': 'GA'
        },
        {
            'class': 'icon pennsylvania',
            'name': 'Pennsylvania',
            'value': 'PA'
        },
        {
            'class': 'icon maryland',
            'name': 'Maryland',
            'value': 'MD'
        },
        {
            'class': 'icon new-jersey',
            'name': 'New Jersey',
            'value': 'NJ'
        },
        {
            'class': 'icon new-york',
            'name': 'New York',
            'value': 'NY'
        },
        {
            'class': 'icon washington-dc',
            'name': 'Washington, DC',
            'value': 'DC'
        }
    ];

	return {
		addresses: addresses,
		states: states,
		isNewServiceAddress: isNewServiceAddress,
		
		/**
		 * Update the list of service addresses. This is use primarily when
		 * data is returned from the server. We simply copy the cart back over
		 *
		 * This may need to be updated to filter out other cart items when new
		 * products are added
		 * 
		 * @param {Array} cart
		 */
		updateCart: function (cart) {
			//Map out the location items
			angular.copy(cart, addresses);
		},

		/**
		 * Remove a service address from the current list
		 * @param  {[type]} address
		 * @return {[type]}
		 */
		deleteServiceAddress: function(address) {

		},

		/**
		 * Get a list of all service addresses currently in use
		 * @return {[type]}
		 */
		getAddresses: function() {
			return addresses;
		},

		/**
		 * Get the active service address
		 * @return {[type]}
		 */
		getActiveServiceAddress: function() {
			return activeServiceAddress;
		},

		/**
		 * Set the current service address
		 * @param {[type]} address
		 */
		setActiveServiceAddress: function(address) {
			//Set the active service address by checking against the current cart
			//If address is missing, set it to empty
			if(typeof address == 'undefined') {
				activeServiceAddress = this.getServiceInformationObject();
			} else {
			    activeServiceAddress = this.findMatchingAddress(address);
            }
		},

		findMatchingAddress: function(address) {
		    var result;
		    angular.forEach(addresses, function(item) {
		        if($filter('address')(address) == $filter('address')(item.location.address)) {
		            result = item;
		        }
		    });
		    return result;
		},

		/**
		 * Get an array of the available offer types for the current service address
		 * @return {[type]}
		 */
		getAvailableOfferTypes: function() {
			availableOfferTypes = [];
			angular.forEach(activeServiceAddress.offerInformationByType, function(entry) {
				availableOfferTypes.push(entry.key);
			});

			return availableOfferTypes;
		},

		/**
		 * Get an array of the selected plan IDs for the current service address
		 * @param  {Object} location Address to get selected plan IDs for. If not provided
		 *                           default to activeServiceAddress
		 * @return {Array}
		 */
		getSelectedPlanIds: function(location) {
			var selectedPlans = [],

			location = (typeof location == 'undefined') ? activeServiceAddress : location;
			
			angular.forEach(location.offerInformationByType, function (entry) {
			    if (entry.value.offerSelections.length) {
			        selectedPlans.push(entry.value.offerSelections[0].offerId);
				}
			});

			return selectedPlans;
		},

		/**
		 * Get an array of the selected plan types for the current service address
		 * @param  {Object} location Address to get selected plan IDs for. If not provided
		 *                           default to activeServiceAddress
		 * @return {Array}
		 */
		getSelectedPlanTypes: function(location) {
			var selectedPlans = [];

			location = (typeof location == 'undefined') ? activeServiceAddress : location;

			angular.forEach(location.offerInformationByType, function(entry) {
			    if (entry.value.offerSelections.length) {
			        selectedPlans.push(entry.value.offerSelections[0].optionRules.optionRulesType);
				}
			});

			return selectedPlans;
		},

		/**
		 * Return the selected plans, with details, for the location
		 * @return {[Object]} An object with the selected plans details and offer types as keys
		 */
		getSelectedPlans: function(location) {
			var selectedPlans = {};

			if(location.offerInformationByType) {
				angular.forEach(location.offerInformationByType, function(offers, index) {
					if(offers.value.offerSelections.length) {
						angular.forEach(offers.value.availableOffers, function(availableOffer) {
							if(availableOffer.id == offers.value.offerSelections[0].offerId) {
								selectedPlans[offers.key] = availableOffer;
								selectedPlans[offers.key].selectionDetails = offers.value.offerSelections[0];
							}
						});
					}
				});
			}
			
			return selectedPlans;
		},

		/**
		 * Set the plan for the current service address based on the offer type
		 * Since only one plan can be selected per type, we simply add to [0] element
		 * @param  {[type]} plan
		 */
		selectPlan: function (plan) {
		    function getFirstMatching(arr, predicate)
		    {
                // TODO - replace this with a data manipulation js library if we ever use one
		        var result;
		        angular.forEach(arr, function (entry) {
		            if (predicate(entry))
		                result = entry;
		        });
		        return result;
		    }
			//Set the active plans
			angular.forEach(plan, function(value, key) {
				//Only adding to the first, can't have multiple plans per type

			    var offerInformationForType = getFirstMatching(activeServiceAddress.offerInformationByType, function (e) { return e.key == key; });
				if(value ==  null) {
				    offerInformationForType.value.offerSelections.pop();
				} else {
				    offerInformationForType.value.offerSelections[0] = {
						'offerId': value,
						'optionRules': { 'optionRulesType': key }
					};
				}
			});
		},

		/**
		 * Return the states object. Used in the typeahead input field
		 * @return {Object}
		 */
		getStates: function() {
			return states;
		},

		/**
		 * The default service information or if a location is passed in, create the object
		 * @param  {[type]} location [description]
		 * @return {Object}
		 */
		getServiceInformationObject: function(location) {
			if(typeof location == 'undefined') {
				//This can be changed to return by IP or however
				return {
					location: {
						address: {},
					},
					serviceState: 'TX',
					isNewService: -1
				};
			} else {
			    var serviceStatusCapability;
			    for (var i = 0; i < location.location.capabilities.length; i++)
			    {
			        if (location.location.capabilities[i].capabilityType == 'ServiceStatus') {
			            serviceStatusCapability = location.location.capabilities[i];
			            break;
			        }
			    }
				return {
					location: {
						address: location.location.address,
						capabilities: location.location.capabilities
					},
					serviceState: location.location.address.stateAbbreviation,
					isNewService: serviceStatusCapability.isNewService
				};
			}
		},

		/**
		 * Create the object to POST for /api/enrollment/serviceInformation
		 * @param  {Object} serviceInformation
		 * @return {Object}
		 */
		addOrUpdateAddress: function (serviceInformation) {
		    //Add capabilities object to the location object
		    serviceInformation.location.capabilities.push({ "capabilityType": "ServiceStatus", "isNewService": !!parseInt(serviceInformation.isNewService, 10) });

		    if (!this.isNewServiceAddress) {
		        angular.copy(serviceInformation.location, activeServiceAddress.location);
		    } else {
		        addresses.push({ location: serviceInformation.location });
		    }

		},

		/**
		 * Create the object to POST for /api/enrollment/selectedOffers
		 * @return {Object}
		 */
	    createOffersPostObject: function() {
	        //Get from the activeServiceAddress object
	        var data = { 
	        	'selection': []
	        };

	        angular.forEach(addresses, function (address) {
	            var selectedPlans = [];
	            angular.forEach(address.offerInformationByType, function (entry) {
	                if (entry.value.offerSelections.length) {
	                    selectedPlans.push(entry.value.offerSelections[0].offerId);
	                }
	            });

	            data.selection.push({
	                'location': address.location,
	                'offerIds': selectedPlans
	            });
	        });

	        return data;
	    }		
	};
}]);