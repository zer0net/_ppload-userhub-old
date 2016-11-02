app.directive('dosbox', ['$location','$rootScope',
	function($location,$rootScope) {

		var controller = function($scope,$element) {

			// init dosbox
			$scope.initDosBox = function(){
				// dosbox size
				$scope.dosboxSize = 'normal';
				// dosbox config
				var dosbox = new Dosbox({
					id: "dosbox",
					onrun: function (dosbox, app) {
						console.log("App '" + app + "' is runned");
					},
					onload: function (dosbox) {
						console.log($scope.item.title + ' running...');
						dosbox.run("/"+$scope.site_address+"/uploads/games/"+$scope.item.zip_name, "./"+$scope.item.file_name);
					}
				});
			};

			// toggle full screen
			$scope.toggleFullScreen = function(){
				if ($scope.dosboxSize === 'full') { $scope.dosboxSize = 'normal'; }
				else { $scope.dosboxSize = 'full'; }
			};

			// on executable file name change
			$rootScope.$on('onChangeExecutableFile',function(event,mass){
                $scope.item.file_name = mass;
                dosbox.onload = function (dosbox) {
					console.log($scope.item.title + ' running...');
					dosbox.run("/"+$scope.site_address+"/uploads/games/"+$scope.item.zip_name, "./"+$scope.item.file_name);
                }
			});

		};

		var template = 				
		'<div id="dosbox-section" class="{{dosboxSize}} md-whiteframe-1dp" ng-init="initDosBox()">' +
			'<style type="text/css">' +
				'.dosbox-overlay {background-image: url("{{item.img}}");}' +
			'</style>' +
			'<div id="dosbox"></div>' +
			'<div ng-if="dosboxSize === \'full\'" class="dosbox-exit-fullscreen">' +
				'<a ng-click="toggleFullScreen()">Exit Full Screen</a>' +
			'</div>' +
			'<a ng-click="toggleFullScreen()" class="fullscreen-btn"><span class="glyphicon glyphicon-fullscreen"></span></a>' +
		'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);