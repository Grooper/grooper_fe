// Module ===============================================================================================
var app = angular.module('grooper', ['ui.router']);

// Route Config =========================================================================================

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/partials/home.html',
            controller: 'homeCtrl'
        })
        .state('searchList', {
            url: '/searchList',
            templateUrl: '/partials/searchList.html',
            controller: 'searchCtrl'
        })
        .state('groop', {
            url: '/groop',
            templateUrl: '/partials/groop.html',
            controller: 'groopCtrl'
        });
}]);

