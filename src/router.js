// Module ===============================================================================================

var app = angular.module('grouper', ['ui.router', 'ngResource']);

// App Config ===========================================================================================

app.config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', function($stateProvider, $urlRouterProvider, $resourceProvider) {
    // Register default partial
    $urlRouterProvider.otherwise("/home");

    // Register router routes
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/partials/home.html',
            controller: 'homeCtrl'
        })
        .state('search', {
            url: '/search',
            templateUrl: '/partials/search.html',
            controller: 'searchCtrl'
        })
        .state('group', {
            url: '/group/:id',
            templateUrl: '/partials/group.html',
            controller: 'groupCtrl'
        });

    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

// Create Resource Factory ==============================================================================

app.factory('api', function($resource) {
    return {

        /*===============================================================================================================================
         ======================================================== AUTHENTICATION ========================================================
         ===============================================================================================================================*/
        // Signup
        Signup: $resource('http://localhost:9000/api-signup/', {}, {
            signup: {method: 'POST'}
        }),

        // Login
        Login: $resource('http://localhost:9000/api-login/', {}, {
            login: {method: 'POST'}
        }),

        /*===============================================================================================================================
         ============================================================= CORE =============================================================
         ===============================================================================================================================*/
         // User
        User: $resource('http://localhost:9000/api/users/:id/', {id: '@id'}, {
            get: {method: 'GET'},
            query: {method: 'GET', isArray: true},
            create: {method: 'CREATE'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        }),

        // Group
        Group: $resource('http://localhost:9000/api/groups/:id/:route/', {id: '@id', route: '@route'}, {
            get: {method: 'GET'},
            query: {method: 'GET', isArray: true},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'},
            joinGroup: {method: 'POST'},
            leaveGroup: {method: 'DELETE'}
        }),

        /*===============================================================================================================================
         ========================================================== WHITEBOARD ==========================================================
         ===============================================================================================================================*/
         // Post
        Post: $resource('http://localhost:9000/api/posts/:id/:route', {id: '@id', route: '@route'}, {
            get: {method: 'GET'},
            query: {method: 'GET', isArray: true},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'},
            like: {method: 'POST'}
        }),

        // Comment
        Comment: $resource('http://localhost:9000/api/comments/:id/:route/', {id: '@id', route: '@route'}, {
            get: {method: 'GET'},
            query: {method: 'GET', isArray: true},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'},
            like: {method: 'POST'}
        }),

        // Like
        Like: $resource('http://localhost:9000/api/likes/:id/', {id: '@id'}, {
            get: {method: 'GET'},
            query: {method: 'GET', isArray: true},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        })
    };
});
