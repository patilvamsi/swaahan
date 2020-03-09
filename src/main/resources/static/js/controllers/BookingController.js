'use strict'

/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.BookingController', []);

AppContoller.controller('BookingController', ['$scope', '$state', '$mdDialog', '$dateParser', 'ngCart', 'commonBookingFactory', 'tableBookingFactory',
                                      		'restaurantDetailFactory', 'bookingService', 'restaurantDetailService', 'Account','sessionStore', 'customToast',
                                    		'resortBookingFactory', 'campaignService', '$q', 'utils', 'callCenterService','agentFactory', BookingController]);

function BookingController($scope, $state, $mdDialog, $dateParser, ngCart, commonBookingFactory, tableBookingFactory,
		restaurantDetailFactory, bookingService, restaurantDetailService, Account,sessionStore, customToast,
		resortBookingFactory, campaignService, $q, utils, callCenterService, agentFactory){
	
	
	/*
	 * Directly Initialized Functions
	 * */
	$scope.calldetails = "";
	$scope.callerDetails = "";
	$scope.userbutton = 'Get User Details';
	$scope.enquiryNormalBooking=null;
	
	$scope.changeFirstName = function(firstName){
		$scope.firstName = firstName;
	}

	$scope.changeLastName = function(lastName){
		$scope.lastName = lastName;
	}

	/*$scope.changeContactNo = function(contactNo){
		$scope.contactNo = contactNo;
	}*/

	$scope.changeEmailId = function(emailId){
		$scope.emailId = emailId;
	}
	
	$scope.changeContactNo = function(contactNo){
		$scope.contactNo=contactNo;
	}
	$scope.changeSpecialRequest = function(specialRequest){
		$scope.userSpecialRequest=specialRequest;
	}
	$scope.changeSpecialRequest = function(specialRequest){
		$scope.userSpecialRequest=specialRequest;
	}
	
	/* $scope.$watch('value', function(value) {
	       console.log(value);
	    });*/
	/*
	 * Initialized Variables
	 * */
	$scope.edit=true;
	$scope.invalidCoupon = false;
	
	/*$scope.firstName = "";
	$scope.lastName = "";
	$scope.emailId = "";
	$scope.contactNo = "";*/
	
	$scope.errorOfInputs = '';

	/*
	 * Functions With Defined Below
	 * */
	$scope.showConfirm = showConfirm;
	$scope.closeCouponModal = closeCouponModal;
	$scope.setCoupon = setCoupon;
	$scope.changeCashbackUseValue = changeCashbackUseValue;
	$scope.viewAllPromoCode = viewAllPromoCode;
	$scope.resetAppliedCouponCode = resetAppliedCouponCode;
	$scope.getCouponsFromPromise = getCouponsFromPromise;
	$scope.validateCoupon = validateCoupon;
	$scope.changedvalue = changedvalue ;
	$scope.changeEdit = changeEdit;
	$scope.saveBookingDetails = saveBookingDetails;
	$scope.updateCartToStore = updateCartToStore;
	$scope.setQuantityInCart = setQuantityInCart;
	$scope.changeUserWantPayStatus = changeUserWantPayStatus;
	
	function changedvalue(myVar){	
		$scope.enquiryNormalBooking=myVar;
	}
	
    function showConfirm(ev) {
		$scope.showloading=false;
	    var confirm = $mdDialog.confirm()
	          .title('Please choose any option..!')
	          .textContent('Booking has been done succesfully. Select send payment link option to send mail else Select go to home')
	          .ariaLabel('EVF')
	          .targetEvent(ev)
	          .ok('Send Payment Link')
	          .cancel('Home');

	    $mdDialog.show(confirm).then(function() {
	    	$scope.sendEmail($scope.bookingRefNo);
	    }, function() {
	    	customToast.showToast('Booking Done');
	    	$state.go('enquiry');
	    });
	  };
	
	$scope.getUserDetails = function(emailId, mobileNumber, firstName, lastName){
		if(emailId != "" || emailId != undefined){
			if(emailId.match('test')){
				if(mobileNumber != "" || mobileNumber != undefined )
						$scope.contactNo  = mobileNumber;
				$scope.loginId=1;
				return;
			}
		}
		if(mobileNumber == "" || mobileNumber == undefined ){
			if($scope.calldetails!=undefined || $scope.calldetails != "" ){
				mobileNumber = $scope.calldetails.callFrom.replace('+91','0').trim();
				$scope.contactNo = angular.copy(mobileNumber);
			}
		}
		if(emailId == "" || emailId == undefined){
			if($scope.calldetails!=undefined || $scope.calldetails != "" ){
				$scope.emailId = $scope.callerDetails.emailId;
				$scope.emailId = angular.copy(emailId);
			}
		}
		if(emailId == "" && mobileNumber == "" ){
			$scope.edit = false;
			$scope.errorOfInputs = 'Please Fill Proper Details.';
		}else{
			$scope.errorOfInputs = '';
			bookingService.getUserDetails(emailId, mobileNumber, firstName, lastName).then(
				function(resp){
					var userDetails = resp.data.responseBody.data.user[0];
					if(userDetails==undefined || userDetails == null || (userDetails.emailId == undefined && userDetails.mbNumber == undefined)){
						$scope.errorOfInputs = 'No User Found with provided email/Mobile. Please get enter user details manually';
						$scope.userbutton = 'Save and Get User Details';
						return;
					} else{
								if(userDetails.isDuplicateUser=="Yes"){
									// existing user
									var confirm = $mdDialog.confirm()
								    .title('You May Loss The Existing User Details')
								    .targetEvent(null)
								    .ok('Please do it!')
								    .cancel("No I don't Want");
									
									$mdDialog.show(confirm).then(function() {
										 $scope.lastName = userDetails.lname;
										 $scope.firstName= userDetails.fname;
										 $scope.email    = angular.copy(userDetails.emailId);
										 $scope.contactNo= userDetails.mbNumber;
										 //for overring purpase
										var myEl = angular.element( document.querySelector( '#userfname' ) );
										myEl.val(userDetails.fname);
										angular.element( document.querySelector( '#userfname' ) ).triggerHandler('input');
										var myEl2 = angular.element( document.querySelector( '#userlname' ) );
										myEl2.val(userDetails.lname);
										angular.element(document.querySelector('#userlname')).triggerHandler('input');
										var myEl3 = angular.element(document.querySelector('#useremail'));
										myEl3.val(userDetails.emailId);
										angular.element(document.querySelector('#useremail')).triggerHandler('input');
										var myEl4 = angular.element(document.querySelector('#userphnbr'));
										myEl4.val(userDetails.mbNumber);
				                     }, function() {
				        		    	
				        		    });
								}else{
							          	}
							
									 try{
										campaignService.getUserWallet(parseInt($scope.loginId) ,restaurantDetailFactory.getRestaurantId() ).then(
											function(resp){
												$scope.userWallet = resp.data.responseBody.data.coupon[0];
												var restCashback = 0;
												if(utils.isNotNullAndEmpty($scope.userWallet.restWallet) && $scope.userWallet.restWallet.length > 0){
													angular.forEach($scope.userWallet.restWallet,function(restaurantCashback){
														restCashback += restaurantCashback.amount;
													});
												}
												$scope.userWallet.restCashback = restCashback;
											},function(error){
												
											});
									}catch(e){}
			        		    
			        		  };
				
					  },
					function(error){});
			}
	}
	
	function changeUserWantPayStatus(){
		if($scope.userWantToPay === 'yes'){
			$scope.userWantToPay = 'no';
			commonBookingFactory.resetCashbackDetails();
		}else
			$scope.userWantToPay = 'yes';
	}
	
	function changeEdit(editChange){
		if(this.$parent.someForm.$invalid ){
			$scope.edit = false;
			$scope.errorOfInputs = 'Please enter all values';
		}else{
			$scope.edit = !editChange;
		}
	}
	
	function closeCouponModal(){
		   $mdDialog.hide();
	}
	
	function setCoupon(couponcode,quantity,amount,id , bookingType){
		validateCoupon(couponcode,quantity,amount,id , bookingType);
		$mdDialog.hide();
	}
	
	
	function changeCashbackUseValue(type,value){
		if(type === "CASHBACK"){
			if(utils.isNullAndEmpty(value)){
				value = $scope.userWallet.cashback;
				$("#simpleCashback").val(value);
				$scope.cashback = value;
			}
		}else if(type === "CASHBACKPLUS"){
			if(utils.isNullAndEmpty(value)){
				value = $scope.userWallet.cashbackPlus;
				$("#cashbackPlus").val(value);
				$scope.cashbackPlus = value;
			}
		}
		
		ngCart.setCashbackAvail(type,value);
	}
	
	function viewAllPromoCode(ev){
		$mdDialog.show({
	    	scope: $scope.$new(),
	    	templateUrl: 'callcenter/booking/viewcoupons.html',
	    	targetEvent: ev,
	    	clickOutsideToClose:true,
	    	fullscreen :true
	    });
	}
	
	function resetAppliedCouponCode(id,bookingType){
		commonBookingFactory.removeCashbackDetail(id,bookingType);
	}
	
	function getCouponsFromPromise(id , bookingType){
		getCoupons(id , bookingType).then(function(resp){
			return resp;
		});
	}
	
	function getCoupons(id , bookingType){
		
		var defer = $q.defer();
		var diningDate = new Date(ngCart.getDate());
		if(ngCart.getCartFor() === 'restaurant'){
			diningDate.setHours(($dateParser(ngCart.getTime(),'HH:mm:ss')).getHours());
			diningDate.setMinutes(($dateParser(ngCart.getTime(),'HH:mm:ss')).getMinutes());
		}
		
		var user = Account.getUser('user');
		var userEmailId = user.email;
		var userContactNo = parseInt(user.mobile);
		var userLoginId = parseInt(user.id);
		
		campaignService.getCoupons(id ,diningDate, restaurantDetailFactory.getRestaurantCity(),restaurantDetailFactory.getRestaurantArea(),
									bookingType,userContactNo,userEmailId ,userLoginId).then(
				function(resp){
					defer.resolve(resp.data.responseBody.data.coupon);
				},function(error){
					
				});
		return defer.promise;
	}
	
	function validateCoupon(couponcode,quantity,amount,id ,bookingType){
		var diningDate = new Date(ngCart.getDate());
		if(ngCart.getCartFor() === 'restaurant'){
			diningDate.setHours(($dateParser(ngCart.getTime(),'HH:mm:ss')).getHours());
			diningDate.setMinutes(($dateParser(ngCart.getTime(),'HH:mm:ss')).getMinutes());
		}
		
		var couponForRestaurant = commonBookingFactory.getAppliedCouponDetails(restaurantDetailFactory.getRestaurantId(),'restaurant');
		
		var user = Account.getUser('user');
		var userEmailId = user.email;
		var userContactNo =parseInt(user.mobile);
		var userLoginId = parseInt(user.id);
		
		if(utils.isNotNullAndEmpty(couponcode) && couponcode.toLowerCase() === 'select'){
			$scope.resetAppliedCouponCode(id,bookingType);
			if(bookingType !== 'restaurant'){
				if(couponForRestaurant !== false){
					campaignService.validateCoupon(restaurantDetailFactory.getRestaurantId(),diningDate,restaurantDetailFactory.getRestaurantCity(),
							restaurantDetailFactory.getRestaurantArea(),'restaurant',userContactNo,userEmailId,couponForRestaurant.couponcode
							,ngCart.getTotalItems(),ngCart.getSubTotalAfterVoucherDiscount(),userLoginId).then(
									function(resp){
										var couponData = resp.data.responseBody.data.coupon[0];
										if(couponData.flag){
											commonBookingFactory.addCashback(couponData.cashbackGiven);
											$scope.invalidCoupon = false;
										}else{
											$scope.invalidCoupon = true;
										}
									})
				}
			}
		}else{
			campaignService.validateCoupon(id,diningDate,
										restaurantDetailFactory.getRestaurantCity(),restaurantDetailFactory.getRestaurantArea(),
										bookingType,userContactNo,userEmailId,couponcode,quantity,amount ,userLoginId).then(
						function(resp){
							var couponData = resp.data.responseBody.data.coupon[0];
							if(couponData.flag){
								commonBookingFactory.addCashback(couponData.cashbackGiven);
								$scope.invalidCoupon = false;
							}else{
								$scope.invalidCoupon = true;
							}
							
							if(couponForRestaurant !== false && bookingType !=='restaurant'){
								campaignService.validateCoupon(restaurantDetailFactory.getRestaurantId(),diningDate,restaurantDetailFactory.getRestaurantCity(),
										restaurantDetailFactory.getRestaurantArea(),'restaurant',userContactNo,userEmailId,couponForRestaurant.couponcode
										,ngCart.getTotalItems(),ngCart.getSubTotalAfterVoucherDiscount(),userLoginId).then(
												function(resp){
													var couponData = resp.data.responseBody.data.coupon[0];
													if(couponData.flag){
														commonBookingFactory.addCashback(couponData.cashbackGiven);
														$scope.invalidCoupon = false;
													}else{
														$scope.invalidCoupon = true;
													}
												})
							}
							
						},function(error){
						});
		}
		
	}
	
	function saveBookingDetails(){
		
		if(this.someForm.$invalid ){
			
			$scope.edit = false;
			$scope.errorOfInputs = 'Please Fill Proper Details.';
			
		}else{
			$scope.showloading=true;
			if($scope.loginId == undefined ||$scope.loginId == null ||$scope.loginId == '' || angular.isNumber($scope.loginId)){
				$scope.loginId = 1;
			}
			if(ngCart.getType() === 'simpleTable'){
				saveSimpleTableBooking();
			}else{
				if(ngCart.getCartFor() === 'restaurant'){
					saveRestaurantBookingDetails();
				}else if(ngCart.getCartFor() === 'resort'){
					saveResortBookingDetails();
				}
			}
		}
	}
	
	function saveSimpleTableBooking(){
		var diningDate = new Date(ngCart.getDate());
		diningDate.setHours(($dateParser(ngCart.getTime(),'HH:mm:ss')).getHours());
		diningDate.setMinutes(($dateParser(ngCart.getTime(),'HH:mm:ss')).getMinutes());
		if ($scope.emailId!=undefined) {
			if( $scope.emailId.match('test'))
			{$scope.loginId = 1;}
		}
		else if($scope.emailId===undefined ||$scope.emailId==='')
		{$scope.emailId='test@eveningflavors.com';$scope.loginId = 1;}
		
		tableBookingFactory.init();
		tableBookingFactory.setUserDetails(this.someForm,$scope.lastName,$scope.emailId,$scope.contactNo,$scope.loginId);
		if($scope.enquiryNormalBooking!='Enquiry')
		tableBookingFactory.setBookingDetails(diningDate, ngCart.getNoOfPeople(), 'New', ngCart.totalCost(), ngCart.getTableStatus(),$scope.userSpecialRequest);
		else
			tableBookingFactory.setBookingDetails(diningDate, ngCart.getNoOfPeople(), 'Enquiry', ngCart.totalCost(), ngCart.getTableStatus(),$scope.userSpecialRequest);	
		tableBookingFactory.setRestaurantDetails(ngCart.getRestaurantId(),ngCart.getRestaurantCity());
		tableBookingFactory.setPaymentDetails(ngCart.totalCost(),'no');
		
		bookingService.saveBooking(tableBookingFactory.getBookingInfo()).then(function(response){
			var bookinginfo = response.data.responseBody.data.booking[0];
			$scope.bookingRefNo = response.data.responseBody.data.booking[0].bookingRefNo;
			sessionStore.set('bookingRefNo',bookinginfo);
			$state.go('bookingsummary');
		});
		
	}
	
	function saveResortBookingDetails(){
		if ($scope.emailId!=undefined) {
			if( $scope.emailId.match('test'))
			{$scope.loginId = 1;}
		}
		else if($scope.emailId===undefined ||$scope.emailId==='')
		{$scope.emailId='test@eveningflavors.com';$scope.loginId = 1;}
		if(ngCart.getTotalItems() === 0){
			customToast.showToast("Booking Cannot be done with Zero Peoples.");
		}else{
			var diningDate = new Date(ngCart.getDate());
			
			resortBookingFactory.init();
			resortBookingFactory.setUserDetails($scope.firstName,$scope.lastName,$scope.emailId,$scope.contactNo,$scope.loginId);
			
			if(ngCart.getType() === 'roomvoucher'){
				resortBookingFactory.setRoomBookingDetails(diningDate, ngCart.getType(), ngCart.getNoOfDays());
			}else{
				resortBookingFactory.setBookingDetails(diningDate, ngCart.getType());
			}
			
			var agent = $scope.agent.userName;
			
			resortBookingFactory.setAgentDetails(agent);
			
			resortBookingFactory.setResortDetails(ngCart.getRestaurantId(), ngCart.getRestaurantName(), ngCart.getRestaurantCity());
			resortBookingFactory.setPaymentDetails(ngCart.finalTotalCost(),ngCart.actualTotalCost(),commonBookingFactory.getTotalDiscount());
			
			var packageBooking = getSelectedPackageBooking();
			resortBookingFactory.setPackageBooking(packageBooking);
			
			resortBookingFactory.setCashbackGivens(commonBookingFactory.getCashbackDetails());
			

			if(ngCart.getTotalCashbackAvailed() > 0 )
				resortBookingFactory.setCashbackAvails(ngCart.getCashbackAvail());
			
			
			bookingService.checkDuplicateBooking(resortBookingFactory.getResortBookingInfo().userContactNo,
					resortBookingFactory.getResortBookingInfo().resortCheckInDate).then(function(response){
				if(response.data.result === true){
					$scope.showloading = false;
					$mdDialog.show(
				   		      $mdDialog.alert()
				   		        .parent(angular.element(document.body))
				   		        .clickOutsideToClose(true)
				   		        .title('Duplicate Booking!!!')
				   		        .textContent(response.data.message)
				   		        .ariaLabel('Duplicate Booking')
				   		        .ok('OK')
				   		        .targetEvent(null)
				   		 );
					
				}else{
					bookingService.saveResortBooking(resortBookingFactory.getResortBookingInfo()).then(function(response){
						$scope.bookingRefNo = response.data.responseBody.data.booking[0].bookingRefNo;
						console.log($scope.enquiryNormalBooking);
						if($scope.enquiryNormalBooking!='Enquiry'){
						showConfirm();}
						else{ alert("enquiry submitted sucessfully");$state.go('enquiry');}
						console.log(response);
					});
				}
			});
		}
	}
	
	function getSelectedPackageBooking(){
		var packageBooking = [];
		var items = ngCart.getItems();
		angular.forEach(items,function(item){
			var voucher = item.getVoucher();
			if(ngCart.getParticularItemQuantity(item) > 0){
				angular.forEach(voucher.ticket,function(ticket){
					if(ticket.quantity>0){
						var bookingTicket = resortBookingFactory.setPackageBookingTickets(ticket.name, ticket.evfPrice, ticket.quantity, ticket.id, item.getVoucherType(), item.getId(), item.getName() );
						packageBooking.push(bookingTicket);
					}
				});
			}
		});
		return packageBooking;
	}
	
	function saveRestaurantBookingDetails(){
		if ($scope.emailId!=undefined) {
			if( $scope.emailId.match('test'))
			{$scope.loginId = 1;}
		}
		else if($scope.emailId===undefined ||$scope.emailId==='')
		{$scope.emailId='test@eveningflavors.com';$scope.loginId = 1;}
		var goToPayment = true;
		if(ngCart.getTotalItems() === 0){
			customToast.showToast("Booking Cannot be done with Zero Peoples.");
		}else{
			var diningDate = new Date(ngCart.getDate());
			diningDate.setHours(($dateParser(ngCart.getTime(),'HH:mm:ss')).getHours());
			diningDate.setMinutes(($dateParser(ngCart.getTime(),'HH:mm:ss')).getMinutes());
			
			tableBookingFactory.init();
			tableBookingFactory.setUserDetails($scope.firstName,$scope.lastName,$scope.emailId,$scope.contactNo,$scope.loginId);
			if($scope.enquiryNormalBooking!='Enquiry')
			tableBookingFactory.setBookingDetails(diningDate, ngCart.getTotalItems(), 'New', ngCart.finalTotalCost(), ngCart.getTableStatus(),$scope.userSpecialRequest);
			else
				tableBookingFactory.setBookingDetails(diningDate, ngCart.getTotalItems(), 'Enquiry', ngCart.finalTotalCost(), ngCart.getTableStatus(),$scope.userSpecialRequest);	
			tableBookingFactory.setRestaurantDetails(ngCart.getRestaurantId(),ngCart.getRestaurantCity());
			tableBookingFactory.setPaymentDetails(ngCart.finalTotalCost(),'yes',ngCart.actualTotalCost(),commonBookingFactory.getTotalDiscount());
			/*if($scope.userWantToPay === 'yes'){
				goToPayment = true;
				tableBookingFactory.setPaymentDetails(ngCart.finalTotalCost(),'yes',ngCart.actualTotalCost(),commonBookingFactory.getTotalDiscount());
			}else{
				goToPayment = false;
				tableBookingFactory.setPaymentDetails(ngCart.getSubTotalAfterVoucherDiscount(),'no');
			}*/

			if(ngCart.getType() === 'event'){
				tableBookingFactory.setEventDetails(ngCart.getEventIdFromCart(), ngCart.getEventNameFromCart());
			}
			
			var bookingTickets = getSelectedBookingTickets();
			tableBookingFactory.setBookingTickets(bookingTickets);
			
			tableBookingFactory.setCashbackGivens(commonBookingFactory.getCashbackDetails());
			
			tableBookingFactory.setAgentDetails($scope.calldetails.callSid, $scope.agent.userName);
			
			bookingService.checkDuplicateBooking(tableBookingFactory.getBookingInfo().userContactNo,
					tableBookingFactory.getBookingInfo().timeOfBooking).then(function(response){
				if(response.data.result === true){
					$scope.showloading=false;
					 $mdDialog.show(
				   		      $mdDialog.alert()
				   		        .parent(angular.element(document.body))
				   		        .clickOutsideToClose(true)
				   		        .title('Duplicate Booking!!!')
				   		        .textContent(response.data.message)
				   		        .ariaLabel('Duplicate Booking')
				   		        .ok('OK')
				   		        .targetEvent(null)
				   		 );
				}else{
					bookingService.saveRestaurantBooking(tableBookingFactory.getBookingInfo()).then(function(response){
						$scope.bookingRefNo = response.data.responseBody.data.booking[0].bookingRefNo;
						console.log($scope.enquiryNormalBooking);
						if($scope.enquiryNormalBooking!='Enquiry'){
							showConfirm();
						}
						else {
							alert("enquiry submitted sucessfully");
							$state.go('enquiry');
						}
					});
				}
			});
			
		}	
	}
	$scope.sendEmail=function(bookingRefNo){
		
		bookingService.sendEmail(bookingRefNo)
		.then(function(response){
			customToast.showToast('Email Sent');
			$state.go('enquiry');
		});
	}
$scope.showPaymentLink=function(bookingRefNo){
		if(!bookingRefNo){
			return false;
		}
		else{
			return true;
		}
		
	}
	function getSelectedBookingTickets(){
		var bookingTickets = [];
		var items = ngCart.getItems();
		angular.forEach(items,function(item){
			var voucher = item.getVoucher();
			if(ngCart.getParticularItemQuantity(item) > 0){
				angular.forEach(voucher.ticket,function(ticket){
					if(ticket.quantity>0){
						var bookingTicket = commonBookingFactory.setBookingTicket(item.getId(), ticket.id, ticket.quantity, item.getVoucherType(), ticket.name, ticket.evfPrice, voucher.punchLine );
						bookingTickets.push(bookingTicket);
					}
				});
			}
		});
		return bookingTickets;
	}
	
	function updateCartToStore(){
		ngCart.$save();
	}
	
	function setQuantityInCart(ticket,quantity){
		ticket.quantity = ticket.quantity + quantity;
		ngCart.$save();
	}
	
	function getUserWallet(userid){
		campaignService.getUserWallet(parseInt(userid) ,restaurantDetailFactory.getRestaurantId() ).then(
				function(resp){
					$scope.userWallet = resp.data.responseBody.data.coupon[0];
					var restCashback = 0;
					if(utils.isNotNullAndEmpty($scope.userWallet.restWallet) && $scope.userWallet.restWallet.length > 0){
						angular.forEach($scope.userWallet.restWallet,function(restaurantCashback){
							restCashback += restaurantCashback.amount;
						});
					}
					$scope.changeCashbackUseValue('RESTCASHBACK',restCashback);
					$scope.userWallet.restCashback = restCashback;
				},function(error){
					
				});
	}
	
	
	
	function init(){
		$scope.agent = agentFactory.$get();
		
		$scope.showloading=false;
		
		$mdDialog.hide();
		restaurantDetailService
			.getRestaurantDetail(ngCart.getRestaurantId())
			.then(
				function(resp) {
					$scope.restaurantDetail = resp.data.responseBody.data.restaurantDetails[0];
					restaurantDetailFactory.setRestaurantDetail($scope.restaurantDetail);
					if(ngCart.getTotalUniqueItems() === 0 && ngCart.getType() !== 'simpleTable'){
						bookingService.resetLocalStorage();
					}
				},
				function(error){
			});
		
		$scope.paymentStatus = ngCart.getStatusOfPaying();
		$scope.userWantToPay = $scope.paymentStatus === 'optional' ? 'yes' : $scope.paymentStatus;
		
		var user = Account.getUser('user');
		$scope.ngCart = ngCart;
		$scope.commonBookingFactory = commonBookingFactory;
		$scope.restaurantFactory = restaurantDetailFactory;
		$scope.restaurantDetail = restaurantDetailFactory.getRestaurantDetail();
		$scope.couponcodes = {};
		getCoupons(restaurantDetailFactory.getRestaurantId(),ngCart.getCartFor()).then(function(resp){
			$scope.couponcodes['restaurant'] = resp;
		});
		
		angular.forEach(ngCart.getItems(),function(item){
			getCoupons(item.getId(),'voucher').then(function(resp){
				$scope.couponcodes[item.getId()] = resp;
			});
		});
		
		if(sessionStore.get('callerDetails'))
		{
			$scope.callerDetails = sessionStore.get('callerDetails');
			$scope.firstName = $scope.callerDetails.fname;
			$scope.lastName = $scope.callerDetails.lname;
			$scope.emailId ='';
			if($scope.emailId===undefined || $scope.emailId==='')
				$scope.emailId='test@eveningflavors.com';
			else
				$scope.emailId = $scope.callerDetails.emailId;
			$scope.contactNo = $scope.callerDetails.mbNumber;
		}
		if(sessionStore.get('calldetails'))
		{
			$scope.calldetails = sessionStore.get('calldetails');
			$scope.contactNo = angular.copy($scope.calldetails.callFrom.replace('+91','').trim());
		}
		if(sessionStore.get('callerDetails'))
			$scope.getUserDetails($scope.emailId, $scope.mobileNumber, $scope.firstName, $scope.lastName);
	}
	
	init();
	
}