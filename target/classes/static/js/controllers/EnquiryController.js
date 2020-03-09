'use strict';

/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.EnquiryController', []);

AppContoller.controller('EnquiryController', ['$scope', '$rootScope', '$state', 'searchService', '$mdDialog', '$http', '$q',
                                              '$filter', 'enquiryFactory', 'agentFactory', 'callCenterService', 'customToast','sessionStore', EnquiryController]);

function EnquiryController($scope, $rootScope, $state, searchService, $mdDialog, $http, $q, $filter, enquiryFactory, agentFactory, 
							callCenterService, customToast,sessionStore) {
	
	$scope.enquiry = {};
	$scope.enquiry.callType = 'Enquiry';
	$scope.enquiry.selectedCity = $rootScope.selectedCity;
	$scope.enquiry.mobileNumber=984987494;
	$scope.calldetails = "";
	$scope.callerDetails = "";
	
	$scope.changeCity = changeCity;
	$scope.submitEnquiry = submitEnquiry;
	$scope.setRestaurant = setRestaurant;
	$scope.getdetails = function(){
		if(sessionStore.get('callerDetails'))
		{
			$scope.callerDetails = sessionStore.get('callerDetails');
			$scope.enquiry.name = $scope.callerDetails.fname + ' '+ $scope.callerDetails.lname ;
			$scope.enquiry.emailId = $scope.callerDetails.emailId;
			$scope.enquiry.mobileNumber = $scope.callerDetails.mbNumber;
		}
		if(sessionStore.get('calldetails'))
		{
			$scope.calldetails = sessionStore.get('calldetails');
			$scope.enquiry.mobileNumber =  angular.copy($scope.calldetails.callFrom.replace('+91','').trim());
			$scope.enquiry.callSid =  angular.copy($scope.calldetails.callSid);
			$scope.enquiry.createdDate = angular.copy($scope.calldetails.createdDate);
		}
	}
	
	function changeCity(city){
		$rootScope.selectedCity = city;
		 
			   if($scope.cityChange){
			    var confirm = $mdDialog.confirm()
			          .title('By Selecting Different City Restaurant Data Will Be Lost')
			          .ariaLabel('Lucky day')
			          .targetEvent(null)
			          .ok('Yes')
			          .cancel('No');
			    
			         $mdDialog.show(confirm).then(function() {
			        	 $state.reload();
			   	  $scope.cityChange=false;
			    }, function() {
			      $scope.status = '';
			    });
			 
			   
	}}
	
	function setRestaurant(item){
		$scope.restaurantDetails = item;
	}
	
	
	
	function getCity(){
		searchService.getCities($scope.city,$scope.limit).then(
			function(resp) {
				$scope.cities = resp.data.responseBody.metaData.aggregations[0].aggregationValues;
			},
			function(error){
		});
	}
	
	function submitEnquiry(enquiry){

		if (this.enquiryForm.$valid || enquiry.callType === 'Other'){
			
			var userName = agentFactory.$get().userName;
			enquiryFactory.setEnquiryFormDetails(enquiry.remarks, enquiry.callType, userName, enquiry.name, enquiry.mobileNumber, enquiry.emailId, enquiry.restaurantid, enquiry.callSid, enquiry.createdDate, enquiry.selectedCity);
			
			callCenterService.saveEnquiry(enquiryFactory.getEnquiryFormDetails()).then(
				function(resp){
					if(resp.data.result)
						{
							customToast.showToast('Enquiry submitted',2);
							$state.go('dashboard');
						}
					else
						customToast.showToast('Some Occured '+resp.data.message);
				},
				function(err){
					customToast.showToast('Some Error Occured '+err);
				}
			);
		}
		else
			{
			customToast.showToast('Please enter valid details',4);
			}
	}
	$scope.cityChange=false;
	 $scope.$on('SelectedRestaurant', function (event, args) {
		 $scope.enquiry.restaurantid = args.message;
		 $scope.cityChange=true;
		 });
	function init(){
		getCity();
	}
	
	init();
	
}