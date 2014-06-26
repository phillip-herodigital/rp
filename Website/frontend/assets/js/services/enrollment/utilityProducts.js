ngApp.factory('utilityProductsService', ['$filter', function ($filter) {
	var addresses = [],
		activeServiceAddress = {},
		availableOfferTypes = [],
		isNewServiceAddress = true;

	return {
		addresses: addresses,
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
			    this.isNewServiceAddress = true;
			} else {
			    activeServiceAddress = this.findMatchingAddress(address);
			    this.isNewServiceAddress = false;
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
		 * Get an array of the selected plan IDs for the current service address
		 * @param  {Object} location Address to get selected plan IDs for. If not provided
		 *                           default to activeServiceAddress
		 * @return {Array}
		 */
		getSelectedPlanIds: function(location) {
			location = (typeof location == 'undefined') ? activeServiceAddress : location;

			return _(location.offerInformationByType)
                .map(function (offers) { return offers.value.offerSelections }).flatten()
                .map(function (selection) { return selection.offerId; }).value();
		},

		/**
		 * Return the selected plans, with details, for the location
		 * @return {[Object]} An object with the selected plans details and offer types as keys
		 */
        // TODO - eliminate this
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
		selectOffers: function (plans) {
		    //Set the active plans
		    _(plans).keys().forEach(function (key) {
		        var offerInformationForType = _(activeServiceAddress.offerInformationByType).where({ key: key }).first();
		        offerInformationForType.value.offerSelections = _(plans[key]).map(function (plan) { return { offerId: plan }; }).value();
		    });

		    console.log(activeServiceAddress.offerInformationByType);
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
			    var serviceStatusCapability = {};
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
		    if (serviceInformation.isNewService === undefined && !this.isNewServiceAddress) {
		        var target = _(activeServiceAddress.location.capabilities).find({ capabilityType: "ServiceStatus" });
                if (target) 
                {
                    serviceInformation.location.capabilities.push(target);
                }
		    }
		    else {
		        //Add capabilities object to the location object
		        serviceInformation.location.capabilities.push({ "capabilityType": "ServiceStatus", "isNewService": !!parseInt(serviceInformation.isNewService, 10) });
		    }

		    if (!this.isNewServiceAddress) {
		        angular.copy(serviceInformation.location, activeServiceAddress.location);
		    } else {
		        addresses.push({ location: serviceInformation.location });
		    }

		}	
	};
}]);