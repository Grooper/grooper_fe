var app = angular.module('grooper');

app.controller('userCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

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
			    $window.sessionStorage.token = data.token;
				$scope.account = data.account;
				$('#signupModal').modal('hide');
				console.log(data.token);
				console.log(data.account);
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
		    	$window.sessionStorage.token = data.token;
				$scope.account = data.account;
				$('#loginModal').modal('hide');
				console.log(data.token);
				console.log(data.account);
		    })
		    .error(function (data, status, headers, config) {
			    // Erase the token if the user fails to log in
			    delete $window.sessionStorage.token;
		});
	};

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