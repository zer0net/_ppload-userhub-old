app.directive('gameInterface', [
	function() {

		// game interface controller
		var controller = function($scope,$element) {

			// init game interface
			$scope.init = function(){
				console.log('init game interface');
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
								label:'Executable File Name',
								type:'executable-file',
								model:'file_name',
								flex:'100'
							}]
						}]
					},{
						title:$scope.item.media_type + ' Info',
						sections:[{
							type:'row',
							fields:[{
								label:'Publisher',
								type:'input',
								model:'publisher',
								flex:'70'
							},{
								label:'Year',
								type:'input',
								model:'year',
								flex:'10'
							},{
								label:'Genre',
								type:'select',
								model:'genre',
								flex:'20',
								options:[
									'Action',
									'Platform',
									'RPG',
									'Shooter',
									'Sport'
								]
							}]
						},{
							type:'column',
							fields:[{
								label:'Description',
								type:'textarea',
								model:'description',
								flex:'100'
							}]
						}]
					}
				];
				// determine game type acording to file type
				if ($scope.item.file_type === 'zip'){
					$scope.game_type = 'DOS';
					// if mode is create
					if ($scope.mode === 'create'){
						$scope.readZipFile();
					}
				} else if ($scope.item.file_type === 'nes'){
					$scope.game_type = 'NES';
					if ($scope.mode === 'create') $scope.renderItem();
				}
			};

			// read zip file
			$scope.readZipFile = function(){
				console.log('read zip file');				
				// loading
				$scope.showLoadingMsg('reading zip file');
				// js zip instance
				var zip = new JSZip();
				// item zip file size
				$scope.item.zip_size = $scope.file.size;
				// js zip - loop through files in zip in file
				zip.loadAsync($scope.file).then(function(zip) { 
					// for every file in zip
					for (var i in zip.files){ var file = zip.files[i];
						// if file is .com / .exe
						if (file.name.indexOf(".COM") > -1 || 
							file.name.indexOf(".EXE") > -1 || 
							file.name.indexOf(".com") > -1 ||
							file.name.indexOf(".exe") > -1){
							// apply to item as file_name
							$scope.item.file_name = file.name;
						}
					}
					// render item (item-create.direcrtive.js)
					$scope.$apply();					
					if ($scope.mode === 'create') $scope.renderItem();
				});
			};

		};

		var template = '<div class="game-interface" style="padding: 0;" ng-init="init()">' +
							'<!-- form -->' +
							'<item-form ng-if="formTabs"></item-form>' +
							'<!-- /form -->' +
							'<!-- player -->' +
							'<div id="dosbox-container" ng-show="game_type === \'DOS\'">' +
								'<dosbox ng-init="initDosBox(item)"></dosbox>' +
							'</div>' +
							'<div id="nes-container" ng-show="game_type === \'NES\'">' +
								'<nes-emulator ng-init="initNesEmulator(item)"></nes-emulator>' +
							'</div>' +							
							'<!-- /player -->' +
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);