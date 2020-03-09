/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.CallHistoryController', []);

AppContoller.controller('CallHistoryController', CallHistoryController);

function CallHistoryController($scope, $rootScope, $state, $stateParams,  $mdDialog, utils,
		searchService, callCenterService, store, sessionStore,agentFactory,bookingService,restaurantDetailService,customToast) {
	$scope.init = init;
	$scope.showBookingDetailsDialog = showBookingDetailsDialog;
	$scope.cancel = cancel;
	$scope.sendPaymentLink = sendPaymentLink;
	
	function showBookingDetailsDialog(bookingId){
		$scope.restaurantDetails = undefined;
		bookingService.getbookingdetailByBookingId(bookingId).then(function(response){
			
			$scope.bookingDetails = response.data.responseBody.data.booking[0];
			restaurantDetailService.getRestaurantDetail($scope.bookingDetails.restaurantId).then(function(resp){
				
				$scope.restaurantDetails =  resp.data.responseBody.data.restaurantDetails[0];
				
				$mdDialog.show({
					  scope: $scope.$new(),
			          templateUrl: 'callcenter/booking/bookingdetailDialog',
			          targetEvent: null,
			          clickOutsideToClose:true,
			          fullscreen: false
			        });
				
			},function (error){
				console.log("something Went Wrong");
			}); 
			
		},function(error){
			console.log("something Went Wrong");
		});
	}
	function cancel(){
		$mdDialog.cancel();
	}
	
	function sendPaymentLink(bookingRefNo){
		bookingService.sendEmail(bookingRefNo)
		.then(function(response){
			customToast.showToast('Payment Link Has been Sent');
			$mdDialog.cancel();
		},function(error){
			console.log("Payment Link Has been Sent");
		});
	}
	
	function init(){
		$scope.limit = 10;
		$scope.agentDetails = agentFactory.getAgentDetails();
		callCenterService.getCallHistoryByAgentNumber($scope.agentDetails.mobileNumber).then(function(response){
			if(response && response.data.responseBody.data.callHistoryDetails)
			$scope.callHistory = response.data.responseBody.data.callHistoryDetails;
		},function(error){
			console.log("something Went Wrong");
		});
	}
	init();
}