app.directive('editItem', [
	function() {

		// site header controller
		var controller = function($scope,$element) {

			// init edit view
			$scope.init = function(){
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
					if (property.key !== 'channel' && property.key !== 'img'){ 
						// push to item properties array
						$scope.itemProperties.push(property); 
					}
				}
			};

			// on update item
			$scope.onUpdateItem = function(){
				if ($scope.img){
					$scope.uploadPosterImage();
				} else {
					$scope.updateItem();
				}
			};


		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);