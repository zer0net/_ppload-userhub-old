app.directive('fileUpload', [
	function() {

		// image upload controller
		var controller = function($scope,$element) {
			
			// upload zone text
			$scope.upload_zone_text	= 'Drag and drop .zip archives of dos games here or click to upload';

			// file upload config
			$scope.fileUploadConfig = {
				// ignore
			    'options': { // passed into the Dropzone constructor
			      'url': 'upload.php'
			    },
				'eventHandlers': {
					'sending': function (file, xhr, formData) {
						// function to be triggerd upon file add
						$scope.readFile(file);
					}
				}
			};	

			// read zip file
			$scope.readFile = function(file){
				// loading
				$scope.showLoadingMsg('preparing file');
				// reader instance
				$scope.reader = new FileReader();
				// reader onload
				$scope.reader.onload = function(){
					// apply reader info to scope
					$scope.file = file;
					// render file name
					var file_name = $scope.file.name.split(' ').join('_').normalize('NFKD').replace(/[\u0300-\u036F]/g, '').replace(/ß/g,"ss");
					// get file type
					var file_type = this.result.split(';base64,')[0].split('/')[1];
					// apply to scope item
					$scope.item.title = file_name.split('.'+file_type)[0];
					// item file
					$scope.item.file = this.result;
					// item zip file name
					$scope.item[$scope.item_file_name] = file_name;
					// if zip file
					if (file_type === 'zip'){
						$scope.readZipFile();
					}

				};
				// reader read file
				$scope.reader.readAsDataURL(file);
			};

			// read zip file
			$scope.readZipFile = function(){
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
					$scope.renderItem();
				});
			};

		};

		var template = '<div class="upload-button-container md-whiteframe-1dp" flex layout="row" layout-padding>' +
			'<button style="width:100%;height:400px;" dropzone="fileUploadConfig">{{upload_zone_text}}</button>' +
		'</div>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);