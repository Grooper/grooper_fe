var app = angular.module('grooper');

// Converts an object of objects into an array of objects
app.filter('array', function() {
    return function(items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
    return filtered;
    };
});

// Grooper Home Controller =======================================================================================

app.controller('homeCtrl', ['$scope', '$http', '$window', '$location', 'authInterceptor', 'api', function($scope, $http, $window, $location, authInterceptor, api) {

    // User Signup
    $scope.signup = function() {
        // Construct credentials
        var credentials = {
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            email: $scope.email,
            password: $scope.password,
            gender: $scope.gender
        };

        // Create User
        // Store JWT Token and User data on successful signup
        $http.post('http://localhost:9000/api-signup/', credentials)
            .success(function (data, status, headers, config) {
                $window.sessionStorage.token = data.jwt;
                $scope.user = data.user;
                $window.sessionStorage.setItem("user", data.user);
                $('#signupModal').modal('hide');
                console.log(data.jwt);
                console.log(data.user);
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;
        });
    };

    // User Login
    $scope.login = function () {
        // Construct Credentials
        var credentials = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        // Get User
        // Store JWT Token and User data on successful login
        $http.post('http://localhost:9000/api-login/', credentials)
            .success(function (data, status, headers, config) {
                $window.sessionStorage.token = data.jwt;
                $window.user = data.user;
                $window.sessionStorage.setItem("user", data.user);
                $('#loginModal').modal('hide');
                console.log(data.jwt);
                console.log(data.user);
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;
        });
    };

    // User Logout
    $scope.logout = function () {
        // Delete stored JWT Token and user
        delete $window.sessionStorage.token;
        delete $window.user;
        $window.sessionStorage.clear();
        $scope.goto('/home');
    };

    // Create Group
    $scope.createGroop = function() {
        // Construct data
        var data = {
            group_name: $scope.groop.group_name,
            description: $scope.groop.description,
            max_members: $scope.groop.max_members,
            location: $scope.groop.location,
            date: $scope.groop.date
        }

        // Create Group
        api.Group.create(data);

        // Hide and reset modal
        $('#createModal').modal('hide');
        document.getElementById('createGroop').reset();
    };

    // Delete Group
    $scope.deleteGroop = function(groopId) {
        api.Group.delete({id: groopId})
    };

    // Goto
    $scope.goto = function(path) {
        $location.path(path);
    };

}]);

// Grooper Search Controller =======================================================================================

app.controller('searchCtrl', ['$scope', '$location', 'api', function($scope, $location, api) {

    // Query all Groups
    $scope.getAllGroops = function() {
        $scope.allGroops = api.Group.query();
    };

    // Goto
    $scope.goto = function(path) {
        $location.path(path);
    };

    $scope.getAllGroops();

}]);

// Grooper Groop Controller =======================================================================================

app.controller('groopCtrl', ['$scope', '$http', '$window', '$location', 'authInterceptor', '$stateParams', 'api', function($scope, $http, $window, $location, authInterceptor, $stateParams, api) {

    // Load Group and Posts for this Group
    $scope.start = function() {
        $scope.getGroop();
        $scope.getPosts();
    };

    // Get the Group
    $scope.getGroop = function() {
        $scope.groop = api.Group.get({id: $stateParams.id});
    }

    // Get Posts for this Group
    $scope.getPosts = function() {
        $http.get('http://localhost:9000/api/posts/?whiteboard=' + $scope.groop.whiteboard)
            .success(function(data) {
                $scope.posts = data;
                console.log($scope.posts);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Join this Group
    $scope.joinGroop = function(id) {
        api.Group.joinGroup({id: $stateParams.id, route: 'join-group'});
    };

    // Leave this Group
    $scope.leaveGroop = function(id) {
        api.Group.leaveGroup({id: $stateParams.id, route: 'leave-group'});
    };

    // Write a Post to this Group
    $scope.addPost = function() {
        // Construct data
        var data = {
            message: $scope.message,
            whiteboard: $scope.groop.whiteboard
        }

        // Create Post
        api.Post.create(data);
    };

    // Like a Post
    $scope.likePost = function(id) {
        api.Post.like({id: id, route: 'like'});
    };

    // Delete a Post
    $scope.deletePost = function(id) {
        api.Post.delete({id: id});
    };

    // Get Comments for this Post
    $scope.getComments = function(id) {
        $http.get('http://localhost:9000/api/comments/?post=' + id)
            .success(function(data) {
                $scope.comments = data;
                console.log($scope.comments);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Write a Comment to this Post
    $scope.addComment = function(id) {
        // Construct data
        var data = {
            message: $scope.newComment,
            post: id
        }

        // Create Comment
        api.Comment.create(data);
    };

    // Like a Comment
    $scope.likeComment = function(id) {
        api.Comment.like({id: id, route: 'like'});
    };

    // Goto
    $scope.goto = function(path) {
        $location.path(path);
    };

    $scope.start();

}]);

app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'JWT ' + $window.sessionStorage.token;
      }
      return config;
    },
    responseError: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});