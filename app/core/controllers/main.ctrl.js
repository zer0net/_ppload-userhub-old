app.controller('MainCtrl', ['$scope','$rootScope','$sce','$location','$window',
	function($scope,$rootScope,$sce,$location,$window) {

		/** CONFIG **/

			$scope.site_address = $location.$$absUrl.split('0/')[1].split('/')[0];
			$scope.master_address = '18kT4gHVMcpibg7WcUZ4ixSezhULR5fvet';
			$scope.master_name = 'PPLOAD MASTER';
			$scope.inner_path =  "data/channel.json";
			$scope.media_type = "items";
			$scope.item_type = "item";
			$scope.item_id_name = "item_id";
			$scope.item_file_type = "zip";
			$scope.item_file_name = "zip_name";

		/** /CONFIG **/

		/** UI **/

		    // select user
		    $scope.selectUser = function(){
		    	Page.cmd("certSelect", [["zeroid.bit"]]);
		    };

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

		/** INIT **/

			// init
			$scope.init = function(){
				// get site info
				Page.cmd("siteInfo", {}, function(site_info) {
					// site info
					Page.site_info = site_info;
					// peers
					$scope.peers = Page.site_info.settings.peers;
					// user is owner
					$scope.owner = Page.site_info.settings.own;
					// apply to scope
					$scope.$apply(function(){
						// get jsons
						$scope.getSitesJsons();
					});
				});
				
			};

			// get sites jsons
			$scope.getSitesJsons = function(){
				// get content.json
				Page.cmd("fileGet", { "inner_path": 'content.json', "required": false },function(data) {
		    		// store content.json to scope
		    		$scope.contentJson = JSON.parse(data);
		    		// get channel.json
					Page.cmd("fileGet", { "inner_path": $scope.inner_path, "required": false },function(data) {
						// store channel.json to scope
						$scope.chJson = JSON.parse(data);
						// render channel
						$scope.renderChannel(data);
						// apply to scope
						$scope.$apply();
				    });
		    	});
			};

			// render channel
			$scope.renderChannel = function(data){
				$scope.channelLoading = false;
				var update = false;
				if ($scope.chJson){
					$scope.channel = $scope.chJson.channel;
					if (!$scope.channel.name) {
						update = true;
						$scope.chJson.channel.name = $scope.contentJson.title;
					}
					if (!$scope.channel.description) {
						update = true;
						$scope.chJson.channel.description = $scope.contentJson.description;
					}
					if (update === true){
						$scope.updateChannelJson($scope.chJson);
					}
				}			
			};

		/** INIT **/

		/** UPDATE CHANNEL **/

			// update content json in scope
			$scope.updateContentJson = function(){
		    	// get content.json & store to scope
		    	$.getJSON('/'+$scope.site_address+'/content.json',function(data){
		    		$scope.contentJson = data;
		    	});
			};

			// update & save channel json
			$scope.updateChannelJson = function(){
				var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.chJson, void 0, '\t')));
				// write to file - channel.json
				Page.cmd("fileWrite", [$scope.inner_path, btoa(json_raw)], function(res) {
					// overwrite content.json title & description
					if ($scope.chJson){
						$scope.contentJson.title = $scope.chJson.channel.name;
						$scope.contentJson.description = $scope.chJson.channel.description;
					}
					var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.contentJson, void 0, '\t')));
					// write to file - content.json
					Page.cmd("fileWrite", ['content.json',btoa(json_raw)],function(res){
						// sign & publish
						Page.cmd("sitePublish",["stored"], function(res){
							console.log(res);
							if (res === 'ok'){
								// apply to scope
								$scope.$apply(function(){
									Page.cmd("wrapperNotification", ["done", "Channel Updated!",10000]);
									$window.location.href = '/'+ $scope.site_address +'/';
								});
							} else {
								Page.cmd("wrapperNotification", ["info", "Please clone this site to create your own channel",10000]);							
							}
						});
					});
				});
			};

			// rootScope on update channel
			$rootScope.$on('onUpdateChannel',function(event,mass){
				$scope.showLoadingMsg('updating channel');
				$scope.updateChannelJson();
			});

		/** /UPDATE CHANNEL **/

	}
]);