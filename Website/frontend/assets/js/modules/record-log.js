angular.module('recordLog', []).provider('logger', function() {
	var validSeverities = ['Debug', 'Notice', 'Warning', 'Error', 'FatalError'];

	this.$get =  ['$http', function($http) {
		return {
			log: function(message, severity, data) {
				if (validSeverities.indexOf(severity) < 0) {
					severity = 'Debug';
				}
				$http({
					method: 'POST',
					url: '/api/logRecorder/record',
					data: {
						Message: message,
						Severity: severity,
						Data: data
					}
				}).then(function successCallback(response) {
					// TODO: implement
				}, function errorCallback(response) {
					// TODO: implement
				});
			}
		}
	}]
});
		