/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsCalendarCtrl', ['$scope', '$rootScope', '$http', '$compile', function ($scope, $rootScope, $http, $compile) {
    $scope.weeks = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    $scope.weekAbbrs = [ 'Sn', 'M', 'T', 'W', 'Th', 'F', 'St' ];
    $scope.months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    var eventHtml = "<div class='grid'><div class='col'>" + "<img src='/~/media/Images/Currents/Calendar/Vegas.ashx?la=en'>" +
        "<div class='event-heading'><div class='event-title'>Lorem Ipsum Dolor Sit Amet.</div>" + 
        "<div class='event-date'>April 29 - 31, 2015</div><div class='event-location'>MGM Grand Hotel - Las Vegas, Nevada</div></div>" + 
        "<div class='event-summary'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>" + 
        "</div><div class='col map'><img src='/~/media/Images/Currents/Calendar/VegasMap.ashx?la=en'></div>" +
        "</div><div class='event-links'><a href='http://google.com' class='register'>Register Here</a><a href='http://google.com' class='view-map'>View Map</a><a href='http://google.com' class='info'>Hotel / Travel Info</a></div>";
    $scope.events = {
        '07-01-2015' : ['<a href="#" popover-append-to-body="true"  data-popover-html="' + eventHtml +'\">Test Event</a>'],
        '07-02-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 2 is really long</a>'},
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\" class="events">Test Event 3</a>'},
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\" class="promotions">Test Event 4</a>'},
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\" class="recognition">Test Event 5</a>'}
            ],
        '07-07-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 6 is really long</a>'},
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\" class="events">Test Event 7</a>'},
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\"class="promotions">Test Event 8</a>'},
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\" class="recognition">Test Event 9</a>'}
            ],
        '07-19-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 10 is really long</a>'}
            ],
        '07-20-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 10 is really long</a>'}
            ],
        '07-21-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 10 is really long</a>'}
            ],
        '07-22-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 10 is really long</a>'}
            ],
        '07-23-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 10 is really long</a>'}
            ],
        '07-24-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 10 is really long</a>'}
            ],
        '07-25-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 10 is really long</a>'}
            ],
    };

    $scope.cal = $('#calendar').calendario({
            weeks : $scope.weeks,
            weekabbrs : $scope.weekAbbrs,
            months : $scope.months,
            displayWeekAbbr : true,
            displayMonthAbbr : false,
            startIn : 0,
            caldata : $scope.events,
    });

    $scope.previousMonth = function() {
        var currentMonth = $scope.cal.getMonth() - 1;
        var currentYear = $scope.cal.getYear();
        var previousMonth = currentMonth > 0 ? --currentMonth : 11;
        var previousYear = previousMonth < 11 ? currentYear : --currentYear;
        return $scope.months[previousMonth] + ' ' + previousYear;
    };

    $scope.nextMonth = function() {
        var currentMonth = $scope.cal.getMonth() - 1;
        var currentYear = $scope.cal.getYear();
        var nextMonth = currentMonth < 11 ? ++currentMonth : 0;
        var nextYear = nextMonth > 0 ? currentYear : ++currentYear;
        return $scope.months[nextMonth] + ' ' + nextYear;
    };

    $scope.searchCalendar = function () {
        $scope.events = {
            '07-02-2015' : [ 
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\">Test Event 2 is really long</a>'},
            {content: '<a href="#" popover-append-to-body="true" data-popover-html="' + eventHtml +'\" class="recognition">Test Event 5</a>'}
            ],
        };
        $scope.cal.setData($scope.events, true);
    };

}]);