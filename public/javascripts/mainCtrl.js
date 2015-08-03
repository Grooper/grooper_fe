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

app.controller('homeCtrl', ['$scope', '$http', '$window', '$location', 'authInterceptor', function($scope, $http, $window, $location, authInterceptor) {

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
                $('#signupModal').modal('hide');
                console.log(data.jwt);
                console.log(data.user);
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;
        });
    };

    $scope.logIn = function () {

        var credentials = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        $http.post('http://localhost:9000/api-login/', credentials)
            .success(function (data, status, headers, config) {
                $window.sessionStorage.token = data.jwt;
                $scope.user = data.user;
                $('#loginModal').modal('hide');
                console.log(data.jwt);
                console.log(data.user);
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;
        });
    };

    $scope.logout = function () {
        delete $window.sessionStorage.token;
        $window.sessionStorage.clear();
        $scope.goto('home');
    };

    $scope.createGroop = function() {
    	var groop = {
            name: $scope.groop.name,
    		min_members: $scope.groop.min,
    		max_members: $scope.groop.max,
    		location: $scope.groop.location,
            date: $scope.groop.date,
            description: $scope.groop.description
    	}
    	$http.post('http://localhost:9000/api/groups/', groop)
            .success(function() {
                $('#createModal').modal('hide');
                document.getElementById("createGroop").reset();
            });
    };

    $scope.getAllGroops = function() {
    	$http.get('http://localhost:9000/api/groups/')
    		.success(function(data) {
    			$scope.allGroops = data;
    		})
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.goto = function(path) {
        $location.path(path);
    };

    // $scope.getAllGroops();
	
}]);

// Grooper Search Controller =======================================================================================

app.controller('searchCtrl', ['$scope', '$http', '$window', '$location', 'authInterceptor', 'groopsFactory', '$stateParams', function($scope, $http, $window, $location, authInterceptor, groopsFactory, $stateParams) {


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
                $('#signupModal').modal('hide');
                console.log(data.jwt);
                console.log(data.user);
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;
        });
    };

    $scope.logIn = function () {

        var credentials = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        $http.post('http://localhost:9000/api-login/', credentials)
            .success(function (data, status, headers, config) {
                $window.sessionStorage.token = data.jwt;
                $scope.user = data.user;
                $('#loginModal').modal('hide');
                console.log(data.jwt);
                console.log(data.user);
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;
        });
    };

    $scope.logout = function () {
        delete $window.sessionStorage.token;
        $window.sessionStorage.clear();
        $scope.goto('home');
    };

    $scope.createGroop = function() {
        var groop = {
            name: $scope.groop.name,
            min_members: $scope.groop.min,
            max_members: $scope.groop.max,
            location: $scope.groop.location,
            date: $scope.groop.date,
            description: $scope.groop.description
        }
        $http.post('http://localhost:9000/api/groups/', groop)
            .success(function() {
                $('#createModal').modal('hide');
                document.getElementById("createGroop").reset();
            });
    };

    $scope.getAllGroops = function() {
        $http.get('http://localhost:9000/api/groups/')
            .success(function(data) {
                $scope.allGroops = data;
                groopsFactory.groops = $scope.allGroops;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.goto = function(path) {
        $location.path(path);
    };

    $scope.getGroopById = function(id) {
        $http.get('http://localhost:9000/api/groups/' + id + '/')
            .success(function(data) {
                $scope.groop = data;
                groopsFactory.groop = $scope.groop;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getAllGroops();
    
}]);

// Grooper Groop Controller =======================================================================================

app.controller('groopCtrl', ['$scope', '$http', '$window', '$location', 'authInterceptor', 'groopsFactory', '$stateParams', function($scope, $http, $window, $location, authInterceptor, groopsFactory, $stateParams) {

    // $scope.groop = groopsFactory.groops[$stateParams.id];
    // $scope.groop = localStorage.getItem('groop');
    // $scope.id = localStorage.getItem('id');

    $scope.start = function() {
        $http.get('http://localhost:9000/api/groups/' + $stateParams.id + '/')
            .success(function(data) {
                $scope.groop = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.joinGroop = function(id) {
        $http.post('http://localhost:9000/api/groups/' + id + '/join-group/');
    };
    
    $scope.leaveGroop = function(id) {
        $http.delete('http://localhost:9000/api/groups/' + id + '/leave-group/');
    };

    $scope.addPost = function() {
        var message = $scope.message;
        var boardId = $scope.groop.whiteboard;
        $http.post('http://localhost:9000/api/posts/', message, boardId);
    }

    $scope.goto = function(path) {
        $location.path(path);
    };

    $scope.getPosts = function() {
        $http.get('http://localhost:9000/api/posts/');
    }

    $scope.start();
    
}]);

app.factory('groopsFactory', function () {
       var groopsInstance = {
            groops: []
       }
       return groopsInstance; 
});

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