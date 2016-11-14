app.directive('siteHeader', ['$rootScope','$location','$mdDialog','$mdMedia',
	function($rootScope,$location,$mdDialog,$mdMedia) {

		// site header controller
		var controller = function($scope,$element) {

		    // check folder
		    $scope.checkFolder = function(){
		    	$rootScope.$broadcast('onCheckFolder');
		    };

		    // open help dialog
			$scope.openHelpDialog = function(ev) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = 
			    '<md-dialog aria-label="How To?">' +
				    '<md-toolbar>' +
				    	'<div class="md-toolbar-tools">' +
					        '<h2>How to add videos?</h2>' +
				    	'</div>' +
				    '</md-toolbar>' +
				    '<md-dialog-content layout-padding>' +
						'<md-content id="how-to-section">' +
							'<p></p>' +
							'<ul style="list-style-type: none; padding-left: 15px;padding-right: 15px;">' +
								'<li>0. if this is not your own channel - clone this site & continue with next step then</li>' +
								'<li>1. navigate to this sites folder ('+$scope.site_address+') and create the directories <b>uploads/videos</b>  </li>' +
								'<li>2. copy files to new directory - make sure the file name doesnt contain spaces or special chars!  </li>' +
								'<li>3. click on the "check folder" button in the navigation menu of the site  </li>' +
								'<li>4. view your new videos to confirm & publish!  </li>' +
							'</ul>' +
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
							chJson:$scope.chJson
						}
					}
			    });

			};

			// open edit channel dialog
			$scope.openChannelEditDialog = function(ev) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = 
			    '<md-dialog aria-label="Edit Channel">' +
				    '<md-toolbar>' +
				    	'<div class="md-toolbar-tools">' +
					        '<h2>Edit Channel Info</h2>' +
				    	'</div>' +
				    '</md-toolbar>' +
				    '<md-dialog-content layout-padding>' +
						'<md-content my-channel ng-init="initChannelEdit(items.chJson)">' +
							'<div class="section-body" layout="row">' +
								'<figure flex="20">' +
									'<img style="width:100%;" ng-src="uploads/images/{{chJson.channel.img}}" ng-show="chJson.channel.img" id="image"/>' +
									'<button dropzone="dropzoneConfig" ng-hide="imgSrc"> Drag and drop files here or click to upload</button>' +
									'<img style="width:100%;" ng-src="{{imgSrc}}" ng-show="imgSrc" id="image"/>' +
								'</figure>' +
								'<div class="channel-info" flex="80" layout-padding>' +
						        '<md-input-container class="md-block" flex-gt-sm>' +
						          	'<label>Channel Name</label>' +
									'<input type="text" ng-model="chJson.channel.name">' +
						        '</md-input-container>' +
						        '<md-input-container class="md-block" flex-gt-sm>' +
						          	'<label>Channel Description</label>' +
									'<textarea ng-model="chJson.channel.description"></textarea>' +
						        '</md-input-container>' +
								'<md-button class="md-primary md-raised edgePadding pull-right" ng-click="saveChannelDetails(chJson)">' +
						        	'<label>Update Channel</label>' +
						        '</md-button> ' +
								'</div>' +
							'</div>' +
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
					locals: {
						items:{
							chJson:$scope.chJson
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
			
			$scope.updateChannelJson = function(){
				$scope.hide();
				$rootScope.$broadcast('onUpdateChannel');
			};

		};

		// site header template
		var template = 	
		'<md-toolbar layout-padding class="md-hue-2 header" layout="row">' + 
			'<div class="pull-left col-xs-5">' + 
				'<h3><a href="/{{master_address}}">{{master_name}}</a></h3>' + 
				'<div class="site-title" ng-show="chJson">' + 
					'<h3>' + 
						'<a href="/{{site_address}}">Channel: {{chJson.channel.name}}</a>' + 
						'<small ng-if="owner">' + 
							'<a ng- ng-click="openChannelEditDialog(chJson)">' + 
								'<span class="glyphicon glyphicon-pencil"></span>' + 
							'</a>' + 
						'</small>' + 
					'</h3>' + 
					'<div class="sub-title">' + 
						'<small>{{chJson.channel.description}}</small>' + 
						'<small>{{peers}} peers' +
						'<span ng-repeat="type in media_types"> • {{chJson[type].length}} {{type}}</span>' +
						'</small>' + 
					'</div>' + 
				'</div>' + 
			'</div>' + 
			'<div class="pull-right col-xs-7">' + 
				'<ul>' + 
					'<li  ng-if="owner">' + 
						'<a href="/{{site_address}}/upload.html">' + 
							'<md-button class="md-primary md-raised edgePadding pull-left">Upload</md-button>' + 
				        '</a>' + 
		        	'</li>' + 
					'<li  ng-if="owner">' + 
						'<a ng-click="checkFolder()">   ' + 
							'<md-button class="md-primary md-raised edgePadding pull-left">Scan Folder</md-button>' + 
				        '</a>' + 
		        	'</li>' + 
					'<li  ng-if="owner">' + 
		        		'<a href="/{{master_address}}/register.html">' + 
		        			'<md-button class="md-primary md-raised edgePadding pull-left">Register</md-button>' + 
				        '</a>' + 
					'</li>' + 
					'<li>' + 
		        		'<a ng-click="openHelpDialog()" class="how-to-btn">' + 
		        			'<md-button class="md-primary md-raised edgePadding pull-left">?</md-button>' + 
				        '</a>' + 
					'</li>' + 
				'</ul>' + 
	        '</div>' + 
		'</md-toolbar>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);