/* Mobile Plans Details Controller
 *
 */
ngApp.controller('VideoPlayerCtrl', ['$scope', '$http', '$sce', 'urlService', function ($scope, $http, $sce, urlService) {
	var videoGuid = urlService.getParameterByName('video');
    $http.get('/api/marketing/getVideo/' + videoGuid)
        .success(function (data) {
        	$scope.video = data;
        	$scope.embedUrl = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + $scope.video.youtubeId);
		});
}]);