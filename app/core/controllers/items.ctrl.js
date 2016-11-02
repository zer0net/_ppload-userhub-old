 app.controller('ItemsCtrl', ['$scope','$rootScope','$location',
	function($scope,$rootScope,$location) {

		/** INIT **/

			$scope.getItem = function(){
				$scope.showLoadingMsg('Loading ' + $scope.item_type);
				var itemId = parseInt($location.$$absUrl.split('item=')[1].split('z')[0]);
				$scope.chJson[$scope.media_type].forEach(function(item,index){
					if (item[$scope.item_id_name] === itemId){
						$scope.item = item;
						$scope.itemIndex = index;
						$scope.finishLoading();
					}
				});
			};

			// init list
			$scope.initList = function(){
				// if channel json has items
				if ($scope.chJson[$scope.media_type]){
					// loop through items in channel.json
					$scope.chJson[$scope.media_type].forEach(function(item,index){
						// if at least one item is unpublished, show unpublished items section
						if (item.published === false){
							$scope.unpublished_items = true;
						}
					});
				}
			};

		/** /INIT **/

		/** UPLOAD **/

			// upload item
			$scope.uploadItem = function() {
				// loading
				$scope.showLoadingMsg('uploading ' + $scope.item_type );
				// file path
				var itemPath = 'uploads/'+ $scope.media_type +'/' + $scope.item[$scope.item_file_name];
				Page.cmd("fileWrite",[itemPath, $scope.item.file.split('base64,')[1] ], function(res) {
					if (res === 'ok'){
						if ($scope.img){
							$scope.uploadPosterImage();
						} else {
							$scope.createItem();
						}
					}
				});
			};

			// upload poster image
			$scope.uploadPosterImage = function(){
				$scope.showLoadingMsg('uploading poster image');
				var posterPath = 'uploads/posters/' + $scope.item[$scope.item_file_name].split('.' + $scope.item_file_type)[0] + '.png';
				Page.cmd("fileWrite",[posterPath, $scope.img.split('base64,')[1] ], function(res) {
					$scope.item.img = posterPath;
					if ($scope.mode === 'create'){
						$scope.createItem();
					} else if ($scope.mode === 'edit') {
						$scope.updateItem();
					}
				});
			};

		/** /UPLOAD **/

		/** CRUD **/

			// create item
			$scope.createItem = function(){
				// loading message
				$scope.showLoadingMsg('creating ' + $scope.item_type + ' record');
				if (!$scope.chJson[$scope.media_type]){
					$scope.chJson.next_item_id = 1;
					$scope.chJson[$scope.media_type] = [];
				}
				// remove file property from item
				delete $scope.item.file;
				// item id
				$scope.item[$scope.item_id_name] = $scope.chJson.next_item_id;				
				// item channel
				$scope.item.channel = $scope.site_address;
				// item date added
				$scope.item.date_added = +(new Date);
				// item published
				$scope.item.published = true;
				// item id update
				$scope.chJson.next_item_id += 1;
				// push item to channel json items
				$scope.chJson[$scope.media_type].push($scope.item);
				// update channel json
				$scope.updateChannelJson();
			};

			// create items - bulk
			$rootScope.$on('onCreateItems',function(event,mass){
				mass.forEach(function(itm,index){
			    	// new item
					item = {
						"channel":$scope.site_address,
						"title": itm.title,
						"description":itm.description,
						"zip_size": itm.file.size,
						"date_added": +(new Date),
						"published":false
					};
					// item file name
					item[$scope.item_file_name] = itm.file_name;					
					// item id
					item[$scope.item_id_name] = $scope.chJson.next_item_id;
					// item id update
					$scope.chJson.next_item_id += 1;
					// push item to channel json items
					$scope.chJson[$scope.media_type].push(item);
				});
				// update channel json
				$scope.updateChannelJson();
			});

			// update item
			$scope.updateItem = function(){
				$scope.showLoadingMsg('updating ' + $scope.item_type + ' record');
				if ($scope.item.file_name) {
					$scope.item.published = true;
				}
				$scope.chJson[$scope.media_type].splice($scope.itemIndex,1);
				$scope.chJson[$scope.media_type].push($scope.item);
				$scope.updateChannelJson();
			};

			// delete item
			$scope.deleteItem = function(item) {
				$scope.showLoadingMsg('deleting ' + $scope.item_type);
				var itemIndex;
				$scope.chJson[$scope.media_type].forEach(function(itm,index) {
					if (item[$scope.item_id_name] === itm[$scope.item_id_name]){
						itemIndex = index;
					}
				});

				$scope.chJson[$scope.media_type].splice(itemIndex,1);
				var itemPath = 'uploads/' + $scope.media_type + '/' + item[$scope.item_file_name];
				Page.cmd("fileDelete", [itemPath], function(res) {	
					var posterPath = 'uploads/posters' + item.file_name.split('.')[0] + '.png';
					Page.cmd("fileDelete", [posterPath], function(res) {
						$scope.updateChannelJson();
					});
				});
			};

		/** /CRUD **/

		/** UI **/

			// loading & msg
			$scope.showLoadingMsg = function(msg){
				$scope.msg = msg;
				$scope.loading = true;
			};

			// finish loading
			$scope.finishLoading = function(){
				$scope.loading = false;
			};

		/** /UI **/

	}
]);
