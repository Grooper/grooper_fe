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

// Grooper UX Controller =======================================================================================

app.controller('uxctrl', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {

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
            email: $scope.email,
            password: $scope.password
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

    $scope.getAllGroops();

 //    $scope.addPost = function() {
 //    	if(!$scope.content || $scope.content === '') {return; }
 //    	$scope.posts.push({
 //    		content: $scope.content,
 //    		upvotes: 0,
 //    		comments: [
	// 		    {author: 'Joe', body: 'Cool post!', upvotes: 0},
	// 		    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
 //  			]
 //    	});
 //    	$scope.content = '';
 //    };

	// $scope.incrementUpvotes = function(post) {
	//   post.upvotes += 1;
	// };

	// $scope.addComment = function(){
	//   if($scope.body === '') { return; }
	//   $scope.post.comments.push({
	//     body: $scope.body,
	//     author: 'user',
	//     upvotes: 0
	//   });
	//   $scope.body = '';
	// };

    // $scope.goto = function(path) {
    //     $location.path(path);
    // };
	
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