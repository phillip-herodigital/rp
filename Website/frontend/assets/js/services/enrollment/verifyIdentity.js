ngApp.factory('verifyIdentityService', [function () {
	var identityQuestions = {};

	return {
		identityQuestions: identityQuestions,
		createPostObject: function(identityQuestions) {
			return { 'selectedIdentityAnswers': identityQuestions };
		}
	};
}]);