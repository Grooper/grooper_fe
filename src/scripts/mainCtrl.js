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

// Grouper Home Controller =======================================================================================

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
    $scope.createGroup = function() {
        // Construct data
        var data = {
            group_name: $scope.group.group_name,
            description: $scope.group.description,
            max_members: $scope.group.max_members,
            location: $scope.group.location,
            date: $scope.group.date
        }

        // Create Group
        api.Group.create(data);

        // Hide and reset modal
        $('#createModal').modal('hide');
        document.getElementById('createGroup').reset();
    };

    // Delete Group
    $scope.deleteGroup = function(groupId) {
        api.Group.delete({id: groupId})
    };

    // Goto
    $scope.goto = function(path) {
        $location.path(path);
    };

}]);

// Grouper Search Controller =======================================================================================

app.controller('searchCtrl', ['$scope', '$location', 'api', function($scope, $location, api) {

    // Query all Groups
    $scope.getAllGroups = function() {
        $scope.allGroups = api.Group.query();
    };

    // Goto
    $scope.goto = function(path) {
        $location.path(path);
    };

    $scope.getAllGroups();

}]);

// Grouper Group Controller =======================================================================================

app.controller('groupCtrl', ['$scope', '$http', '$window', '$location', 'authInterceptor', '$stateParams', 'api', function($scope, $http, $window, $location, authInterceptor, $stateParams, api) {

    // Load Group and Posts for this Group
    $scope.start = function() {
        $scope.getGroup();
        $scope.getPosts();
    };

    // Get the Group
    $scope.getGroup = function() {
        $scope.group = api.Group.get({id: $stateParams.id});
    }

    // Get Posts for this Group
    $scope.getPosts = function() {
        $scope.posts = api.Post.query({whiteboard: $scope.group.whiteboard});
    };

    // Join this Group
    $scope.joinGroup = function(id) {
        api.Group.joinGroup({id: $stateParams.id, route: 'join-group'});
    };

    // Leave this Group
    $scope.leaveGroup = function(id) {
        api.Group.leaveGroup({id: $stateParams.id, route: 'leave-group'});
    };

    // Write a Post to this Group
    $scope.addPost = function() {
        // Construct data
        var data = {
            message: $scope.message,
            whiteboard: $scope.group.whiteboard
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
        $scope.comments = api.Comment.query({post: id});
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
