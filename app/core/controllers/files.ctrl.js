app.controller('FilesCtrl', ['$scope','$rootScope',
	function($scope,$rootScope) {

		// on check folder
		$rootScope.$on('onCheckFolder',function(){
			$scope.getFilesInfo();
		});

		// on finished loading
		$rootScope.$on('finishedLoading',function(){
			$scope.fileLoading = false;
		});

	    // get files info
	    $scope.getFilesInfo = function(){

	    	$scope.fileLoading = true;

	    	// old & new file arrays
	    	$scope.fileList = [];
	    	$scope.newFilesList = [];

    		// build fileList array from latest verion of content.json
			$.each( $scope.contentJson, function( key, val ) {
				// every optional file
			   if(key=='files_optional') {
					$.each( val, function( key2, val2 ) {
						// every file in uploads / items
					    if (key2.match('^uploads/'+$scope.media_type+'/')) {
					    	$scope.fileList.push(key2);					
					    }
					});
				}
			});

			// sign content.json & generate new version
			Page.cmd("siteSign",["stored"], function(res){
				// 2nd get content.json
		    	$.getJSON('/'+$scope.site_address+'/content.json',function(data){
		    		// assign latest content.json to scope
					$scope.contentJson = data;
					// build newFileList array
					$.each( data, function( key, val ) {
						// every optional file
					   if(key=='files_optional') {
							$.each( val, function( key2, val2 ) {
								// every file in uploads / items
							    if (key2.match('^uploads/'+$scope.media_type+'/')) {
							    	var file = {
							    		fullName:key2,
							    		name:key2.split('/')[2],
							    		size:val2.size,
							    	};
							    	$scope.newFilesList.push(file);			
							    }
							});
						}
					});
		    		// check for new files
		    		$scope.checkForNewFiles($scope.fileList,$scope.newFilesList);
		    	});
			});
	    };

	    // check for new files
	    $scope.checkForNewFiles = function(fileList,newFilesList){
	    	console.log(fileList);
	    	console.log(newFilesList);
	    	// pending items array
	    	$scope.pendingItems = [];
			// compare old file list with new file list
	    	newFilesList.forEach(function(newFile,index){
	    		// if file exists on both
	    		if (fileList.indexOf(newFile.fullName) > -1){
	    			console.log('file exists');
	    		} 
	    		// if file doesnt exist create new file obj
	    		else {
	    			console.log('add file to pending item');
	    			var item = {
	    				title:newFile.name,
	    				file_name:newFile.name,
	    				file:newFile,
	    			}
	    			$scope.pendingItems.push(item);
	    		}
	    		// finished
	    		if (index === newFilesList.length - 1){
	    			// add new items
	    			$scope.addNewItems($scope.pendingItems);
	    		}
	    	});
	    	// if no new files found
	    	if (newFilesList.length === 0){
	    		// finish loading & apply to scope
	    		$scope.fileLoading = false;	    
	    		$scope.$apply();
	    	}
	    };

	    // add new items
	    $scope.addNewItems = function(pendingItems){
	    	// if pending items
	    	if (pendingItems.length > 0){
	    		// on create items (items.ctrl)
	    		$rootScope.$broadcast('onCreateItems',pendingItems);
	    	} else {
	    		// finish loading & apply to scope	    		
	    		$scope.fileLoading = false;
	    		$scope.$apply();
	    	}
	    };

	}
]);
