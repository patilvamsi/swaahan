/**
 * 
 */
var AppController = angular.module('CallCenterApp.ResortDetailsController',[]);

AppController.controller('ResortDetailsController',['$scope', '$http', '$rootScope', '$state','$stateParams','$filter','utils','$mdDialog'
                                   ,'commonBookingFactory', 'resortDetailFactory','resortDetailService','restaurantDetailService', ResortDetailsController]);


function ResortDetailsController($scope, $http, $rootScope, $state,$stateParams,$filter,utils
		,$mdDialog ,commonBookingFactory,resortDetailFactory,resortDetailService,restaurantDetailService){

	$scope.wentFors = ['dayVocher','roomVocher','generalVocher'];
	$scope.showReviewSubmitButton = true;
	$scope.showCommentSubmitButton = true;
	$scope.voucherShow = false;
	$scope.dayVoucherSleak=true;
	$scope.roomVoucherSleak=true;
	$scope.generalVoucherSleak=true;
	$scope.reviewHeading = false;
//	$scope.showComments = false;
	
	$scope.selectedCity = $stateParams.city;
	$scope.resortId = $scope.id;
	//$scope.type = $stateParams.type;
	//$scope.type = 'overview';
	$scope.resortName = $stateParams.resortName;
	
	$scope.type = "booking";
	$scope.current =  {
		location : 'current-location'
	}
	
	$scope.setType = function(element){
		if(element.toLowerCase() === 'booking')
			 $scope.type = element;
		 else{
			 $scope.$parent.type = element;
			 var resortDetails = $scope.resorts.responseBody.data.resorts[0];
			 $rootScope.$broadcast('breadcrumb:change',breadcrumbFactory.getResortProfileLink(resortDetails.resortCity,resortDetails.resortArea,resortDetails.resortName,resortDetails.resortId,element));			 
		 }
	}
	
	
	$scope.toggleComments = function(value){
		$scope.showComments = value;
	}
	$scope.setReviewHeading = function(){
		$scope.reviewHeading = true;
	}
	
	$scope.toggleSleak=function(sleakType){
		if(sleakType!=null &&sleakType!=undefined && sleakType==='day'){
			$scope.dayVoucherSleak=!$scope.dayVoucherSleak;
		}
		if(sleakType!=null &&sleakType!=undefined && sleakType==='room'){
			$scope.roomVoucherSleak=!$scope.roomVoucherSleak;
		}
		if(sleakType!=null &&sleakType!=undefined && sleakType==='general'){
			$scope.generalVoucherSleak=!$scope.generalVoucherSleak;
		}
	}
	
	$scope.showPrerenderedDialog = function(ev) {
	    $mdDialog.show({
	      contentElement: '#myDialog',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose: true
	    });
	  };
	  $scope.cancel = function() {
	      $mdDialog.cancel();
	  }; 
	 $scope.windowHeight = function(){
	    	var width = window.innerWidth;
	    	if(width > 830){
	    		$scope.size = 3;
	    	}else if(width > 601 && width < 830){
	    		$scope.size = 2;
	    	}else{
	    		$scope.size = 1;
	    	}
	    }
	 
	
	$scope.imagegallery = function(images,index) {
		 utils.setElements(images);
		 utils.setIndex(index);
		 $mdDialog.show({
		      templateUrl: 'party/imageDialoge.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		      animate: 'full-screen-dialog',
		      locals: {
		          images: images
		      },
		    controller: 'DialogController'
		    })
	 };
	
	function getBasicResortDetails(resortDetails){
		return resortDetailFactory.getBasicResortDetails(resortDetails);
	}
	 $scope.getSize = function(value){
		 if(utils.isNullAndEmpty(value)){
			 return true;
		 }else{
			 return false;
		 }
	 }
	$scope.fetchResortDetails = function(){
		
		if(utils.isNullAndEmpty($rootScope.coverImageNumber)){
			$rootScope.coverImageNumber = 0;
		}else{
			if($rootScope.coverImageNumber === 13)
				$rootScope.coverImageNumber = 0;
			else
				$rootScope.coverImageNumber = $rootScope.coverImageNumber+1;
		}
		
		$scope.id = $stateParams.id;
		
		commonBookingFactory.init();
		resortDetailService
		.getResortDetail($scope.id)
		.then(
				function(resp){
					$scope.details = resp.data;
					$scope.resorts = resp.data;
					var response = resp.data.responseBody.data.resorts;
					if(utils.isNotNullAndEmpty(response)){
						var resort = response[0];
						var name = $filter('removeSpecialChars')(resort.resortName.toLowerCase());
						
						if($scope.type.toLowerCase() === 'booking'  && ($scope.$parent.type === undefined || $scope.$parent.type === 'booking') && $scope.resorts.responseBody.data.resorts.length>0){
							var resortDetails = $scope.resorts.responseBody.data.resorts[0];
						}
						try{
							$scope.basicRestaurantDetail = getBasicResortDetails($scope.resorts.responseBody.data.resorts[0]);
						}catch(e){
							console.log("Resorts Is Empty");
						}
						$scope.currentPage = 2;
					}else{
						$state.go('_404');
					}
				},
				function(error){
				});
		
		restaurantDetailService.getRestaurantContactNumbers($scope.id).then(
				function(response){
					$scope.restaurantContactInfos = response.data.responseBody.data.callcenter;
				},
				function(err){
					
				}
			);
	}
	$scope.validateVoucher = function(resort){
		if(resort.dayVoucher.length > 0 || resort.roomVoucher.length > 0 || resort.generalVoucher.length > 0){
			$scope.voucherShow = true;
		}
	}
	
	$scope.fetchResortDetails();
	
	}