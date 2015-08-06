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

app.controller('homeCtrl', ['$scope', '$http', '$window', '$location', 'authInterceptor', 'groopsFactory', function($scope, $http, $window, $location, authInterceptor, groopsFactory) {

    $scope.signUp = function() {
        var credentials = {
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            email: $scope.email,
            password: $scope.password,
            gender: $scope.gender
        };
        
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

    // $scope.signup = function() {

    //     var credentials = {
    //         first_name: $scope.first_name,
    //         last_name: $scope.last_name,
    //         email: $scope.email,
    //         password: $scope.password,
    //         gender: $scope.gender
    //     };

    //     request({
    //         url: 'http://localhost:9000/api-signup/',
    //         method: 'POST',
    //         body: credentials
    //     }, function (error, response, body) {
    //         if (error) {
    //             // Erase the token if the user fails to log in
    //             delete $window.sessionStorage.token;
    //             return console.log('Error:', error);
    //         }
    //         else {
    //             $window.sessionStorage.token = body.jwt;
    //             $scope.user = body.user;
    //             $('#signupModal').modal('hide');
    //             console.log(body.jwt);
    //             console.log(body.user);
    //         }
    //     });
    // };

    $scope.login = function () {

        var credentials = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        $http.post('http://localhost:9000/api-login/', credentials)
            .success(function (data, status, headers, config) {
                $window.sessionStorage.token = data.jwt;
                $scope.user = data.user;
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

    // $scope.login = function() {

    //     var credentials = {
    //         email: $scope.user.email,
    //         password: $scope.user.password
    //     };

    //     request({
    //         url: 'http://localhost:9000/api-login/',
    //         method: 'POST',
    //         body: credentials
    //     }, function (error, response, body) {
    //         if (error) {
    //             // Erase the token if the user fails to log in
    //             delete $window.sessionStorage.token;
    //             return console.log('Error:', error);
    //         }
    //         else {
    //             $window.sessionStorage.token = body.jwt;
    //             $scope.user = body.user;
    //             $('#loginModal').modal('hide');
    //             console.log(body.jwt);
    //             console.log(body.user);
    //         }
    //     });
    // };

    $scope.logout = function () {
        delete $window.sessionStorage.token;
        $window.sessionStorage.clear();
        $scope.goto('/home');
    };

    $scope.createGroop = function() {
    	var groop = {
            group_name: $scope.groop.group_name,
            description: $scope.groop.description,
    		max_members: $scope.groop.max_members,
    		location: $scope.groop.location,  
            date: $scope.groop.date
    	}
    	$http.post('http://localhost:9000/api/groups/', groop)
            .success(function() {
                $('#createModal').modal('hide');
                document.getElementById("createGroop").reset();
            });
    };

    $scope.deleteGroop = function(groopId) {
        $http.delete('http://localhost:9000/api/groups/' + groopId + '/');
    };

    // $scope.createGroop = function() {

    //     var groop = {
    //         name: $scope.groop.name,
    //         min_members: $scope.groop.min,
    //         max_members: $scope.groop.max,
    //         location: $scope.groop.location,
    //         date: $scope.groop.date,
    //         description: $scope.groop.description
    //     }

    //     request({
    //         url: 'http://localhost:9000/api/groups/',
    //         method: 'POST',
    //         body: groop
    //     }, function (error, response, body) {
    //         if (error) {
    //             return console.log('Error:', error);
    //         }
    //         else {
    //             $('#createModal').modal('hide');
    //             document.getElementById('createGroop').reset();
    //         }
    //     });
    // };

    $scope.goto = function(path) {
        $location.path(path);
    };
	
}]);

// Grooper Search Controller =======================================================================================

app.controller('searchCtrl', ['$scope', '$window', '$location', 'authInterceptor', 'groopsFactory', '$stateParams', '$http', function($scope, $window, $location, authInterceptor, groopsFactory, $stateParams, $http) {

    $scope.getAllGroops = function() {
        $http.get('http://localhost:9000/api/groups/')
            .success(function(data) {
                $scope.allGroops = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // $scope.getAllGroops = function() {
    //     request.get('http://localhost:9000/api/groups/', function (error, response, body) {
    //         if (error) {
    //             return console.log('Error:', error);
    //         }
    //         else {
    //             $scope.allGroops = body;
    //             console.log(body);
    //         }
    //     });
    // };

    $scope.goto = function(path) {
        $location.path(path);
    };

    $scope.getAllGroops();
    
}]);

// Grooper Groop Controller =======================================================================================

app.controller('groopCtrl', ['$scope', '$http', '$window', '$location', 'authInterceptor', 'groopsFactory', '$stateParams', function($scope, $http, $window, $location, authInterceptor, groopsFactory, $stateParams) {

    $scope.start = function() {
        $scope.getGroop();
        $scope.getPosts();
        //console.log($scope.user.id);
    };

    $scope.getGroop = function() {
        $http.get('http://localhost:9000/api/groups/' + $stateParams.id + '/')
            .success(function(data) {
                $scope.groop = data;
                $scope.user = $window.sessionStorage.getItem("user");
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    $scope.joinGroop = function(id) {
        $http.post('http://localhost:9000/api/groups/' + id + '/join-group/')
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // $scope.joinGroop = function(id) {
    //     request.post('http://localhost:9000/api/groups/' + id + '/join-group/', function (error, response, body) {
    //         if (error) {
    //             return console.log('Error:', error);
    //         }
    //     });
    // };
    
    $scope.leaveGroop = function(id) {
        $http.delete('http://localhost:9000/api/groups/' + id + '/leave-group/')
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // $scope.leaveGroop = function(id) {
    //     request.delete('http://localhost:9000/api/groups/' + id + '/leave-group/', function (error, response, body) {
    //         if (error) {
    //             return console.log('Error:', error);
    //         }
    //     });
    // };

    $scope.getPosts = function() {
        $http.get('http://localhost:9000/api/posts/?whiteboard=' + $stateParams.myParam)
            .success(function(data) {
                $scope.posts = data;
                console.log($scope.posts);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.addPost = function() {
        var data = {
            message: $scope.message,
            whiteboard: $scope.groop.whiteboard         
        }
        $http.post('http://localhost:9000/api/posts/', data)
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // $scope.addPost = function() {
    //     request({
    //         url: 'http://localhost:9000/api/posts/',
    //         method: 'POST',
    //         body: message
    //     }, function (error, response, body) {
    //         if (error) {
    //             return console.log('Error:', error);
    //         }
    //     });
    // };

    $scope.likePost = function(id) {
        $http.post('http://localhost:9000/api/posts/' + id + '/like/')
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deletePost = function(id) {
        $http.delete('http://localhost:9000/api/posts/' + id + '/')
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

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

    $scope.addComment = function(id) {
        var data = {
            message: $scope.newComment,
            post: id
        }
        $http.post('http://localhost:9000/api/comments/', data)
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.likeComment = function(id) {
        $http.post('http://localhost:9000/api/comments/' + id + '/like/')
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.goto = function(path) {
        $location.path(path);
    };

    $scope.start();
    
}]);

// app.factory('groopsFactory', function () {
//        var groopsInstance = {
//             user: {}
//        }
//        return groopsInstance; 
// });

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