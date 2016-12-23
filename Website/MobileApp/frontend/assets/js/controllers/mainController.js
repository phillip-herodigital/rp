// create the controller and inject Angular's $scope
streamApp.controller('mainController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $scope.pageClass = 'page-home';

    $scope.checkMenu = function () {
        alert("in")
        if ($scope.showMenu) {
            showMenu = false;
        }
    }
});

streamApp.controller('aboutController', function ($scope) {
    $scope.message = 'Look! I am an about page.';
    $scope.pageClass = 'page-about';
});

streamApp.controller('contactController', function ($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
    $scope.pageClass = 'page-contact';
});