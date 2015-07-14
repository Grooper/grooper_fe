var grooper = angular.module('grooper');

// Converts an object of objects into an array of objects
grooper.filter('array', function() {
	return function(items) {
    	var filtered = [];
    	angular.forEach(items, function(item) {
        	filtered.push(item);
    	});
    return filtered;
  	};
});

// Grooper UX Controller =======================================================================================

grooper.controller('uxctrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
	

    $scope.signUp = function() {
    	var user = {
    		first_name: $scope.first_name,
    		last_name: $scope.last_name,
    		email: $scope.email,
    		password: $scope.password,
    		gender: $scope.gender
    	};
		var credentials = {
			email: $scope.email,
			password: $scope.password
		};
		$http.post('http://localhost:9000/api/accounts/', user)
			.success(function() {
		    	$http.post('http://localhost:9000/api-login/', credentials)
		    		.success(function(data) {
		    			$scope.token = data.token;
		    			$scope.account = data.account;
		    			console.log(data.token);
		    			console.log(data.account);
		    			$('#signupModal').modal('hide');
		    		});
			});
    };

    $scope.logIn = function() {
		var credentials = {
			email: $scope.email,
			password: $scope.password
		};

    	$http.post('http://localhost:9000/api-login/', credentials)
    		.success(function(data) {
    			$scope.token = data.token;
    			$scope.account = data.account;
    			console.log(data.token);
    			console.log(data.account);
    			$('#loginModal').modal('hide');
    		});
    };

    $scope.createGroop = function() {
    	var groop = {
    		min_members: $scope.min_members,
    		max_members: $scope.max_members,
    		name: $scope.name,
    		description: $scope.groop_description,
    		location: $scope.groop_location
    	}
    	$http.post('http://localhost:9000/api/groups/', groop);
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

	$scope.users = [];
	
}]);