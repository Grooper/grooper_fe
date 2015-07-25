// Module ===============================================================================================
var app = angular.module('grooper', ['ui.router']);

// Route Config =========================================================================================

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/partials/home.html',
            controller: 'uxctrl'
        })
        .state('searchList', {
            url: '/searchList',
            templateUrl: '/partials/searchList.html',
            controller: 'uxctrl'
        })
        .state('groop', {
            url: '/groop',
            templateUrl: '/partials/groop.html',
            controller: 'uxctrl'
        });
}]);

