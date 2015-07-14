// Module ===============================================================================================
var app = angular.module('grooper', ['ngRoute']);

// Route Config =========================================================================================
app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/', {
            templateUrl: '/partials/home.html',
            controller: 'uxctrl'
        }).
        when('/groop', {
            templateUrl: '/partials/groop.html',
            controller: 'uxctrl'
        }).
        when('/profile', {
            templateUrl: '/partials/profile.html',
            controller: 'uxctrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);


