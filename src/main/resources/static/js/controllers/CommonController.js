/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.CommonController', []);

AppContoller.controller('CommonController', CommonController);

function CommonController($scope, $rootScope, $state, $mdDialog, utils, searchService,callCenterService,store,sessionStore,$filter) {

	$rootScope.closeMdDialog = closeMdDialog;
	$rootScope.imagegallery = imagegallery;
	$rootScope.closeImageGallery = closeImageGallery;
	
	$scope.calldetails = "";
	$scope.callerDetails = "";
	$scope.readonly = true;
	$scope.changeCity = changeCity;
	$scope.getCity = getCity;
	$scope.gotCall = gotCall;
	$scope.callerumber = '';
	$rootScope.isOffersExpired = function(endDate){
	    	if(utils.isNotNullAndEmpty(endDate)){
	    		var currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
	    		var endDate = $filter('date')(endDate, "yyyy-MM-dd");
	    		if(endDate >= currentDate || endDate === '1970-01-01')
	    			return true;
	    		else return false;
	    		
	    	}else {
	    		return true;
	    	}
	    }
	function closeMdDialog(){
		$mdDialog.cancel();
	}
	
	function changeCity(city){
		$rootScope.selectedCity = city;
	}
	
	function closeImageGallery() {
		$mdDialog.cancel();
    }
	
	function imagegallery(images,currentSlideIndex) {
   		 
		$scope.elements = images;
		if(utils.isNullAndEmpty(currentSlideIndex))
			$scope.currentSlideIndex = 0;
		else{
			try{
				$scope.currentSlideIndex = parseInt(currentSlideIndex);
			}catch(e){
				$scope.currentSlideIndex = 0;
			}
   		 }
   		 
   		 $mdDialog.show({
   		      templateUrl: 'callcenter/common/imageDialoge.html',
   		      parent: angular.element(document.body),
   		      clickOutsideToClose:true,
   		      animate: 'full-screen-dialog',
   		      scope : $scope.$new()
   		 });
   	 }
	
	function getCity(){
		searchService.getCities($scope.city,$scope.limit).then(
			function(resp) {
				$scope.cities = resp.data.responseBody.metaData.aggregations[0].aggregationValues;
			},
			function(error){
		});
	}
	
	function gotCall(){
		console.log('got a call');
		if(sessionStore.get('callerDetails')){
			$scope.callerDetails = sessionStore.get('callerDetails');
		}
		if(sessionStore.get('calldetails')){
			$scope.calldetails = sessionStore.get('calldetails');
		}
		callCenterService.letsPerformGotACall().then(function(resp){
			if(resp.data.responseBody.data.callcenter!=null && resp.data.responseBody.data.callcenter != undefined) 
			{
				$scope.calldetails = resp.data.responseBody.data.callcenter[0];
				sessionStore.set('calldetails',$scope.calldetails);
			}
			if(resp.data.responseBody.data.callerDetails!=null && resp.data.responseBody.data.callerDetails != undefined)
			{
				$scope.callerDetails = resp.data.responseBody.data.callerDetails[0];
				$scope.fullname = $scope.callerDetails.fname+' '+$scope.callerDetails.lname; 
				sessionStore.set('callerDetails',$scope.callerDetails);
			}
		},function(error){
			console.log(error);
		});
	}
	
	function init(){
	}
	
	init();
	
}