'use strict'

/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.AuthModule', []);

AppContoller.controller('LoginController', [ '$state', '$scope', '$auth', '$rootScope', '$mdDialog', 'utils', 'agentFactory',
                                             'callCenterService', LoginController ]);

function LoginController($state, $scope, $auth, $rootScope, $mdDialog, utils, agentFactory, callCenterService) {
	
	
	$scope.agentMobileNumbers = [];

	$scope.login = login;
	
	$scope.getMobileNumbersOfAgent = getMobileNumbersOfAgent;

	
	function getMobileNumbersOfAgent(agentName){
		callCenterService.getMobileNumbersOfAgent(agentName).then(
			function(resp){
				$scope.agentMobileNumbers = resp.data.responseBody.data.callcenter;
			},
			function(err){
				
			}
		);
	}
	
	function login(userName, mobileNumber, password){
		if(this.loginForm.$invalid)
			alert("Error");
		else{
			agentFactory.setUserName(userName);
			agentFactory.setPassword(password);
			agentFactory.setMobileNumber(mobileNumber);

			$auth.login(agentFactory.getAgentDetails(), false).then(
				function(resp){
//					console.log(resp);
					agentFactory.setAgentDetails(resp.data.callCenterAgent);
					$state.go('dashboard');
//		        	alert("Login Successful");
				},
				function(err){
					alert("Login Failed");
				}
			);
		}
	}
	
	function init() {
		agentFactory.init();
		
		callCenterService.getAllAgentNames().then(
				function(resp){
					$scope.allAgentNames =  resp.data.responseBody.data.callcenter;
				},
				function(err){
				}
		);;
	}

	init();
}