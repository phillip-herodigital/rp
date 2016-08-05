﻿ngApp.factory('enrollmentService', ['$rootScope', '$http', '$q', 'enrollmentStepsService', 'enrollmentCartService', '$timeout', '$window', function ($rootScope, $http, $q, enrollmentStepsService, enrollmentCartService, $timeout, $window) {

    var service = {},
        urlPrefix = '/api/enrollment/';
    service.validations = [];
    service.isLoading = false;
    service.accountInformation = {
        contactTitle: '',
        contactInfo: {
            name: {
                first: '',
                last: ''
            },
            phone: [{
                number: '',
                category: ''
            }],
            email: {
                address: ''
            }
        },
        socialSecurityNumber: '',
        secondaryContactInfo: {},
    };
    service.loggedInAccountDetails = [];
    service.identityQuestions = [];
    service.paymentError = false;
    service.editPhoneIMEI = "";

    $rootScope.$watch(function () { return service.accountInformation; }, function () {
        enrollmentStepsService.setMaxStep('accountInformation');
    }, true);

    service.setClientData = function (result) {
        service.isLoading = result.isLoading;
        if (result.isLoading) {
            $timeout(function () {
                makeCall('resume', undefined);
            }, 250, false);
        }

        if (result.needsRefresh) {
            window.location.href = window.location.href.substring(0, window.location.href.indexOf("#"));
            return;
        }

        // update our validations - don't make a new array, just copy all the validations over from the returned one. Saves copying back to the scope elsewhere.
        angular.copy(result.validations, service.validation);

        // update the cart
        enrollmentCartService.updateCart(result.cart);

        var serviceIndexErrors = [];
        angular.forEach(result.validations, function (entry) {
            var capture = /^Services\[(\d+)\]/g.exec(entry.memberName);
            if (capture) {
                serviceIndexErrors.push(parseInt(capture[1]));
            }
        });
        if (serviceIndexErrors.length && !_.contains(serviceIndexErrors, enrollmentCartService.getActiveServiceIndex())) {
            enrollmentCartService.setActiveServiceIndex(serviceIndexErrors[0]);
        }
        else if (enrollmentCartService.services.length == 0) {
            // new service
            enrollmentCartService.setActiveService(undefined);
        }

        // copy out the account information the server has
        service.accountInformation.contactInfo = result.contactInfo || {};
        service.contactTitle = result.contactTitle;
        service.accountInformation.secondaryContactInfo = result.secondaryContactInfo || {};
        service.accountInformation.language = result.language;
        service.accountInformation.mailingAddress = result.mailingAddress;
        service.accountInformation.previousAddress = result.previousAddress;
        service.accountInformation.previousProvider = result.previousProvider;
        service.associateInformation = result.associateInformation;
        service.loggedInAccountDetails = result.loggedInAccountDetails;

        // Default these object to prevent errors
        service.accountInformation.contactInfo.phone = service.accountInformation.contactInfo.phone || [{ }];
        service.accountInformation.contactInfo.email = service.accountInformation.contactInfo.email || { };

        // set the identity questions from the server
        service.identityQuestions = result.identityQuestions;

        // show an error message if there is an problem processing payemnt
        service.paymentError = result.paymentError;

        service.isRenewal = result.isRenewal;
        if (result.isRenewal) {
            enrollmentStepsService.setRenewal();
        }

        if (result.isAddLine && result.expectedState == "serviceInformation") {
            enrollmentStepsService.setAddLine(result.addLineAccountNumber);
        }
    };

    function makeCall(urlSuffix, data, mode, overrideServerStep) {
        var isMobile =  enrollmentStepsService.getCurrentFlow() == 'phone';
        if (urlSuffix != 'serviceInformation' || !isMobile ) {
            service.isLoading = true;
        }
        var deferred = $q.defer(),
        start = new Date().getTime();
        mode = mode || 'post';
        overrideServerStep = overrideServerStep || false;

        //Let the 3rd parameter be mode or overrideServerStep
        if(arguments.length == 3) {
            if(typeof arguments[2] == "boolean") {
                overrideServerStep = arguments[2];
                mode = 'post';
            }
        } 

        $http.post(urlPrefix + urlSuffix, data)
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            // Cannot use $location.path; it's only changing hash-tags.
            $window.location.href = '/enrollment/please-contact';
        });

        return deferred.promise.then(function (result) {
            service.setClientData(result);

            if (!overrideServerStep && !result.isLoading) {
                $timeout(function () {
                    enrollmentStepsService.setFromServerStep(result.expectedState, overrideServerStep);
                });
            }

            return result;
        });
    };

    /**
     * Get client data.
     * 
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.getClientData = function () {
        return makeCall('clientData', undefined, 'get');
    };

    /**
     * Reset enrollment process.
     * 
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.resetEnrollment = function () {
        $http.get(urlPrefix + 'reset')
        .success(function () {
            $window.location.reload();
        })
    };

    /**
     * Reset renewal process.
     * 
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.resetRenewal = function () {
        $http.get(urlPrefix + 'reset')
        .success(function () {
            $window.location = '/account/energy-services';
        })
    };

    service.resetAnonymousRenewal = function () {
        $http.get(urlPrefix + 'reset')
        .success(function () {
            $window.location = '/services/one-time-renewal';
        })
    };

    /**
    * Set service information
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setServiceInformation = function (overrideServerStep) {
        //Create our empty locations object
        var data = { 'locations': [] };

        angular.forEach(enrollmentCartService.services, function (address) {
            data.locations.push(address.location);
        });

        return makeCall('serviceInformation', data, overrideServerStep);
    };

    /**
    * Set selected offers
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setSelectedOffers = function (overrideServerStep) {
        if (_(enrollmentCartService.services).pluck('offerInformationByType').flatten().pluck('value').pluck('offerSelections').any(function (selections) { return selections.length > 1; }))
        {
            return service.setAccountInformation(overrideServerStep);
        }

        //Get from the activeServiceAddress object
        var data = {
            'selection': []
        };

        angular.forEach(enrollmentCartService.services, function (address) {
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

        return makeCall('selectedOffers', data, overrideServerStep);
    };

    service.cleanseAddresses = function (addresses) {
        service.isLoading = true;
        var deferred = $q.defer();

        $http.post('/api/addresses/cleanse', addresses)
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            deferred.resolve([]);
        });
        return deferred.promise.then(function (result) {
            service.isLoading = false;
            return result;
        });
    };

    /**
    * Set mobile offers
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setMobileOffers = function () {
        var data = {};
        data.cart = _.map(enrollmentCartService.services, function (cartItem) {
            return {
                location: cartItem.location,
                offerInformationByType: _.map(cartItem.offerInformationByType, function (typedOrderInfo) {
                    return {
                        key: typedOrderInfo.key,
                        value: {
                            offerSelections: _.map(typedOrderInfo.value.offerSelections, function (offerSelection) {
                                return {
                                    offerId: offerSelection.offerId,
                                    offerOption: offerSelection.offerOption
                                };
                            })
                        }
                    };
                })
            };
        });

        return makeCall('accountInformation', data, true);
    };

    /**
    * Set account information
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setAccountInformation = function (overrideServerStep) {
        var data = angular.copy({
            contactInfo: service.accountInformation.contactInfo,
            contactTitle: service.accountInformation.contactTitle,
            companyName: service.accountInformation.companyName,
            doingBusinessAs: service.accountInformation.doingBusinessAs,
            socialSecurityNumber: service.accountInformation.socialSecurityNumber,
            secondaryContactInfo: service.accountInformation.secondaryContactInfo,
            onlineAccount: service.accountInformation.onlineAccount,
            mailingAddress: service.accountInformation.mailingAddress,
            previousAddress: service.accountInformation.previousAddress,
            preferredSalesExecutive: service.accountInformation.preferredSalesExecutive,
            previousProvider: service.accountInformation.previousProvider,
            associateName: service.accountInformation.associateName,
            TrustEvSessionId: window.TrustevV2 ? TrustevV2.SessionId : null
        });
        data.cart = _.map(enrollmentCartService.services, function (cartItem) {
            return {
                location: cartItem.location,
                offerInformationByType: _.map(cartItem.offerInformationByType, function (typedOrderInfo) {
                    return {
                        key: typedOrderInfo.key,
                        value: {
                            offerSelections: _.map(typedOrderInfo.value.offerSelections, function (offerSelection) {
                                return {
                                    offerId: offerSelection.offerId,
                                    offerOption: offerSelection.offerOption
                                };
                            })
                        }
                    };
                })
            };
        });

        if (!data.secondaryContactInfo.first && !data.secondaryContactInfo.last)
            data.secondaryContactInfo = null;
        if (data.onlineAccount && !data.onlineAccount.username)
            data.onlineAccount = null;

        return makeCall('accountInformation', data, overrideServerStep);
    };

    /**
    * Set single page order
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setSinglePageOrder = function (completeOrder) {
        var data = angular.copy({
            contactInfo: service.accountInformation.contactInfo,
            contactTitle: service.accountInformation.contactTitle,
            companyName: service.accountInformation.companyName,
            doingBusinessAs: service.accountInformation.doingBusinessAs,
            socialSecurityNumber: service.accountInformation.socialSecurityNumber,
            secondaryContactInfo: service.accountInformation.secondaryContactInfo,
            onlineAccount: service.accountInformation.onlineAccount,
            mailingAddress: service.accountInformation.mailingAddress,
            previousAddress: service.accountInformation.previousAddress,
            preferredSalesExecutive: service.accountInformation.preferredSalesExecutive,
            previousProvider: service.accountInformation.previousProvider,
            associateName: service.accountInformation.associateName,
            TrustEvSessionId: window.TrustevV2 ? TrustevV2.SessionId : null,
            additionalAuthorizations: completeOrder.additionalAuthorizations,
            agreeToTerms: completeOrder.agreeToTerms,
        });
        data.cart = _.map(enrollmentCartService.services, function (cartItem) {
            return {
                location: cartItem.location,
                offerInformationByType: _.map(cartItem.offerInformationByType, function (typedOrderInfo) {
                    return {
                        key: typedOrderInfo.key,
                        value: {
                            offerSelections: _.map(typedOrderInfo.value.offerSelections, function (offerSelection) {
                                return {
                                    offerId: offerSelection.offerId,
                                    offerOption: offerSelection.offerOption
                                };
                            })
                        }
                    };
                })
            };
        });

        if (!data.secondaryContactInfo.first && !data.secondaryContactInfo.last)
            data.secondaryContactInfo = null;
        if (data.onlineAccount && !data.onlineAccount.username)
            data.onlineAccount = null;

        return makeCall('singlePageOrder', data);
    };

    /**
    * Set verify identity
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setVerifyIdentity = function (identityAnswers) {
        var data = { 'selectedIdentityAnswers': identityAnswers };

        return makeCall('verifyIdentity', data);
    };

    /**
    * Set confirm order
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setConfirmOrder = function (data) {
        return makeCall('confirmOrder', data);
    };

    /**
     * Get locations.
     * 
     * @param {string} val         Location search string
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.getLocations = function (state, customerType, val) {
        var start = new Date().getTime();

        return $http.get('/api/address/lookup/' + state + '/' + customerType + '/' + val)
            .then(function (data) {
                return data;
            });
    };

    service.getPaymentError = function () {
        return service.paymentError;
    };

    return service;
}]);
