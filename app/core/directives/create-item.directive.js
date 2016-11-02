app.directive('createItem', [
	function() {

		// site header controller
		var controller = function($scope,$element) {
			// init create item view
			$scope.init = function(){
				// generate empty game
				$scope.item = {};
				// apply scope mode var				
				$scope.mode = 'create';
			};
			// render item
			$scope.renderItem = function(){
				// generate items properties array
				$scope.itemProperties = [];
				for (var i in $scope.item){
					// create property obj
					var property = {
						key:i.split('_').join(' '),
						value:$scope.item[i]
					};
					// set property type
					if (property.key.indexOf('size') > -1) {property.type = 'size'}
					else if (property.key.indexOf('date') > -1) {property.type = 'date'}
					else {property.type = 'normal'}
					// ommit redundant properties
					if (property.key !== 'channel' && property.key !== 'img' && property.key !== 'file'){ 
						// push to item properties array
						$scope.itemProperties.push(property); 
					}
				}
				// finish loading
				$scope.finishLoading();
				// apply to scope
				$scope.$apply();
			};
		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);