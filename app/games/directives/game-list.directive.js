app.directive('gameList', ['$mdDialog','$mdMedia',
	function($mdDialog,$mdMedia) {

		// game interface controller
		var controller = function($scope,$element) {

		    // game preview dialog
			$scope.gamePreviewDialog = function(ev,item) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = '<md-dialog aria-label="{{items.item.title}}">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>{{items.item.title}}</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<md-content id="dosbox-dialog-contaner" style="width:700px;">' +
												'<dosbox ng-if="items.item" ng-init="initDosBox(items.item)"></dosbox>' +
											'</md-content>' +
									    '</md-dialog-content>' +
									  '</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,
					locals: {
						items: {
							item:item
						}
					}
			    });

			};

		};

		// dialog controller
		var DialogController = function($scope, $mdDialog,$rootScope,items) {

			// items
			$scope.items = items;

			$scope.hide = function() {
				$mdDialog.hide();
			};
			
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			
			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};

		};


		var template =  '<ul class="item-list">' +
							'<li ng-if="item.published !== false"' +
								'ng-repeat="item in chJson.games | orderBy:\'-date_added\' track by $index">' +
								'<!-- item info -->' +
								'<div class="item-info">' +
							    	'<span ng-click="gamePreviewDialog($event,item)" class="title">{{item.title}} • </span>' +
									'<span ng-if="item.genre">{{item.genre}} • </span>' +
									'<span ng-if="item.year">{{item.year}} • </span>' +
									'<span ng-if="item.zip_size">{{item.zip_size|filesize}} • </span>' +
									'<span><i am-time-ago="item.date_added"></i></span>' +
								'</div>' +
								'<!-- /item info -->' +
								'<!-- item options menu -->' +
								'<div class="item-options" ng-if="owner">' +
									'<span ng-click="deleteItem(item)" class="glyphicon glyphicon-trash"></span>' +
									'<a href="/{{site_address}}/edit.html?item={{item.game_id}}type=game">' +
									'<span class="glyphicon glyphicon-pencil"></span></a>' +
									'<span ng-click="gamePreviewDialog($event,item)" class="glyphicon glyphicon-eye-open"></span>' +
								'</div>' +
								'<!-- /item options menu -->' +
							'</li>' +
						'</ul>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);