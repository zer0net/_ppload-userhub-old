app.directive('videoInterface', ['$sce',
	function($sce) {

		// video interface controller
		var controller = function($scope,$element) {

			// init video interface
			$scope.init = function(){
				console.log('init video interface');
				// config form tabs & fields
				$scope.formTabs = [
					{
						title:'Basic Info',
						sections:[{
							type:'column',
							fields: [{
								label:'Title',
								type:'input',
								model:'title',
								flex:'100'
							},{
								label:'Description',
								type:'textarea',
								model:'description',
								flex:'100'
							}]
						}]
					}
				];

				// if mode is create
				if ($scope.mode === 'create'){
					$scope.video = $sce.trustAsResourceUrl($scope.item.file);
				} else {
					$scope.video = '/'+$scope.site_address+'/uploads/videos/'+$scope.item.file_name;
				}
				// read video file
				$scope.readVideoFile();
			};

			// read video file
			$scope.readVideoFile = function(){
				// video player
				$scope.player = {
					autoPlay:true,
					sources: [
						{
							src:$scope.video,
							type:'video/'+$scope.item.file_type
						}
					],
					theme: "/" + $scope.site_address + "/assets/lib/videos/videogular-themes-default/videogular.css"
				};
				// render item
				if ($scope.mode === 'create') $scope.renderItem();
			};

			// capture preview image
			$scope.capturePreviewImage = function(){
				var canvas = document.getElementById('preview-img');
			    var video = document.getElementsByTagName('video')[0];
			    canvas.getContext('2d').drawImage(video, 0, 0, 350, 200);
				$scope.item.img = canvas.toDataURL("image/png").split(',')[1];
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);