'use strict'

/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.ShoppingCartController', []);

AppContoller.controller('ShoppingCartController', ShoppingCartController);

function ShoppingCartController($scope, $rootScope, $state, $stateParams, $filter, $mdDialog, $dateParser, utils, ngCart, commonBookingFactory) {

	$scope.reset = function(){
		$scope.selectedDate = undefined;
	  };
	
	// To be deleted later
	$scope.showCartInConsole = showCartInConsole;
	$scope.makeCartEmpty = makeCartEmpty;
	/******************/
	
	$scope.getTimeSlotAccordingToVoucher = getTimeSlotAccordingToVoucher;
	$scope.checkToShowNumberForFreeEvent = checkToShowNumberForFreeEvent;
	
	$scope.toggleCommonPanel = toggleCommonPanel;
	$scope.toggleRoomVoucherPanel = toggleRoomVoucherPanel;
	$scope.toggleFreeEventPanel = toggleFreeEventPanel;
	$scope.toggleSimpleTablePanel = toggleSimpleTablePanel;
	
	$scope.closeCartModal = closeCartModal;
	$scope.closeSideNav = closeSideNav;
	
	$scope.getRestaurantIdInCart = getRestaurantIdInCart;
	$scope.getRestaurantDetails = getRestaurantDetails;
	
	$scope.addVoucherInCart = addVoucherInCart;
	$scope.removeVoucherById = removeVoucherById;
	$scope.itemIsInCart = itemIsInCart;
	$scope.setQuantity = setQuantity;
	$scope.showCart = showCart;
	$scope.setQuantityInCart = setQuantityInCart;
	
	$scope.selectSectionForBooking = selectSectionForBooking;
	$scope.getTimeSlot = getTimeSlot;
	$scope.setTimeSlot = setTimeSlot;
	$scope.getMinimumDate = getMinimumDate;
	
	$scope.proceedForSimpleBooking = proceedForSimpleBooking;
	$scope.processLoginForBooking = processLoginForBooking;
	
	$scope.quickBook = quickBook;
	
	$scope.noOfDays = 1;
	
	/*******************/
	function showCartInConsole(){
		console.log(JSON.stringify(ngCart.getCart()));
	}
	
	function makeCartEmpty(){
		ngCart.empty();
	}
	/*******************/
	/*function toggleSimpleTablePanel(voucherDetails){
		$(".errorDivForNotAddingInCart").html('');
		
		var voucherInCart = itemIsInCart(voucherDetails.voucher.id,voucherDetails.vouchertype)
		if(voucherInCart){
			voucherDetails.voucher = voucherInCart.getVoucher();
		}else{
			angular.forEach(voucherDetails.voucher.ticket, function (ticket) {
	        	ticket.quantity = 0;
	        	ticket.evfPrice = 0;
	        });
		}
		$rootScope.voucherDetailsForPanel = voucherDetails;
		$rootScope.openSideNav('simpleTablePanel');
	}*/
function toggleSimpleTablePanel(voucherDetails){	
		
		
		$(".errorDivTime").html("");
		$(".errorDivDate").html("");
		$(".errorDivForNotAddingInCart").html("");
		
		if(utils.isNullAndEmpty(commonBookingFactory.getDate())){
			$mdDialog.show(
		   		      $mdDialog.alert()
		   		        .parent(angular.element(document.body))
		   		        .clickOutsideToClose(true)
		   		        .title('Date Selection Error')
		   		        .textContent('Please Select Date.')
		   		        .ok('OK')
		   		        .targetEvent(null)
		   		 );
			$('html, body').animate({
			     scrollTop: $(".gotToDatePicker").offset().top-100
			       }, 800);
			$('.errorDivDate').html($rootScope.errors.SELECT_DATE);
			$(".errorDivTime").html("");
			
			return false;
		}else if(utils.isNullAndEmpty(commonBookingFactory.getTime())){
			$mdDialog.show(
		   		      $mdDialog.alert()
		   		        .parent(angular.element(document.body))
		   		        .clickOutsideToClose(true)
		   		        .title('Time Selection Error')
		   		        .textContent('Please Select Time.')
		   		        .ariaLabel('Please Select Time.')
		   		        .ok('OK')
		   		        .targetEvent(null)
		   		 );
			$('html, body').animate({
			     scrollTop: $(".gotToDatePicker").offset().top-100
			       }, 800);
			$('.errorDivTime').html($rootScope.errors.SELECT_TIME);
			$(".errorDivDate").html("");
			return false;
		}else{
			if(commonBookingFactory.getGroupVoucherBtnSelected())
				commonBookingFactory.setGroupVoucherBtnSelected(false);
			if(commonBookingFactory.getBuffetBtnSelected())
				commonBookingFactory.setBuffetBtnSelected(false);
			commonBookingFactory.setAlaCarteBtnSelected(!commonBookingFactory.getAlaCarteBtnSelected());
		
			var voucherInCart = itemIsInCart(voucherDetails.voucher.id,voucherDetails.vouchertype)
			if(voucherInCart){
				voucherDetails.voucher = voucherInCart.getVoucher();
			}else{
				angular.forEach(voucherDetails.voucher.ticket, function (ticket) {
		        	ticket.quantity = 0;
		        	ticket.evfPrice = 0;
		        });
			}
			$rootScope.voucherDetailsForPanel = voucherDetails;
			$rootScope.openSideNav('simpleTablePanel');
		
		}
		}
	
	$scope.addedValue = true;
	$scope.changeTheValue = function(){
		if($scope.addedValue)
			$scope.addedValue = false;
		else
			$scope.addedValue = true;
	}
	
	function quickBook(voucherDetailsForPanel){
		ngCart.init();
		var allowToProceed = addVoucherInCart(voucherDetailsForPanel);
		if(allowToProceed)
			processLoginForBooking();
		else
			return false;
	}
	
	function selectSectionForBooking(section){
		$scope.sectionForBooking = section;
		commonBookingFactory.setSectionForBooking(section);
	}
	
	// Validating Each Time Slot According To Availability of Voucher
	function getTimeSlotAccordingToVoucher(slot, availibility){
		var returnValue = false;
		if(!utils.isNullAndEmpty(availibility)){
			for(var i=0;i<availibility.length;i++){
				var startTime = $dateParser(availibility[i].startTime,'HH:mm:ss');
				var endTime = $dateParser(availibility[i].endTime,'HH:mm:ss');
				var selectTime = $dateParser(slot.timeSlotValue,'HH:mm:ss');
				
				if(startTime>endTime){
					if(selectTime>=startTime)
						return true;
					else
						returnValue = false;
					
				}else{
					if(selectTime>=startTime && selectTime<=endTime)
						return true;
					else
						returnValue = false;
				}
			}
		}
		return returnValue;
	}
function toggleSimpleTablePanel(voucherDetails){	
		
		
		$(".errorDivTime").html("");
		$(".errorDivDate").html("");
		$(".errorDivForNotAddingInCart").html("");
		
		if(utils.isNullAndEmpty(commonBookingFactory.getDate())){
			$mdDialog.show(
		   		      $mdDialog.alert()
		   		        .parent(angular.element(document.body))
		   		        .clickOutsideToClose(true)
		   		        .title('Date Selection Error')
		   		        .textContent('Please Select Date.')
		   		        .ok('OK')
		   		        .targetEvent(null)
		   		 );
			$('html, body').animate({
			     scrollTop: $(".gotToDatePicker").offset().top-100
			       }, 800);
			$('.errorDivDate').html($rootScope.errors.SELECT_DATE);
			$(".errorDivTime").html("");
			
			return false;
		}else if(utils.isNullAndEmpty(commonBookingFactory.getTime())){
			$mdDialog.show(
		   		      $mdDialog.alert()
		   		        .parent(angular.element(document.body))
		   		        .clickOutsideToClose(true)
		   		        .title('Time Selection Error')
		   		        .textContent('Please Select Time.')
		   		        .ariaLabel('Please Select Time.')
		   		        .ok('OK')
		   		        .targetEvent(null)
		   		 );
			$('html, body').animate({
			     scrollTop: $(".gotToDatePicker").offset().top-100
			       }, 800);
			$('.errorDivTime').html($rootScope.errors.SELECT_TIME);
			$(".errorDivDate").html("");
			return false;
		}else{
			if(commonBookingFactory.getGroupVoucherBtnSelected())
				commonBookingFactory.setGroupVoucherBtnSelected(false);
			if(commonBookingFactory.getBuffetBtnSelected())
				commonBookingFactory.setBuffetBtnSelected(false);
			commonBookingFactory.setAlaCarteBtnSelected(!commonBookingFactory.getAlaCarteBtnSelected());
		
			var voucherInCart = itemIsInCart(voucherDetails.voucher.id,voucherDetails.vouchertype)
			if(voucherInCart){
				voucherDetails.voucher = voucherInCart.getVoucher();
			}else{
				angular.forEach(voucherDetails.voucher.ticket, function (ticket) {
		        	ticket.quantity = 0;
		        	ticket.evfPrice = 0;
		        });
			}
			$rootScope.voucherDetailsForPanel = voucherDetails;
			$rootScope.openSideNav('simpleTablePanel');
		
		}
		}
	
	// Cart Dialog
	function showCart(ev) {
		$mdDialog.show({
			controller: 'ShoppingCartController',
			templateUrl: 'callcenter/shoppingcart/cart.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
		});
	}
	
	$scope.dateForMinDate = new Date();
	$scope.minDateForMinDate = new Date(
			$scope.dateForMinDate.getFullYear(),
			$scope.dateForMinDate.getMonth(),
			$scope.dateForMinDate.getDate()
		);
	
	function getMinimumDate(){
		var dateForMinDate = new Date();
		var minDate = new Date(
				dateForMinDate.getFullYear(),
				dateForMinDate.getMonth(),
				dateForMinDate.getDate()
			);
		return minDate;
	}
	
	// Getting The Time slots for particular date and restaurant
	function getTimeSlot(timeOfBooking, restaurantId, voucherType){
		
		var voucherTypeArrayToNotToSelectTime = ['event','dayvoucher','roomvoucher','generalvoucher'];

		$scope.selectedDate = timeOfBooking;
		$scope.$parent.selectedDate = timeOfBooking;
		
		$scope.selectedDate = new Date();
		
		if(voucherTypeArrayToNotToSelectTime.indexOf(voucherType)<0){
			 bookingFactory.getTimeSlots(restaurantId,timeOfBooking).then(
				function(resp) {
					$scope.timedetails = resp.data.responseBody.data.timeSlotList;
				},
				function(error){
				}
			);
		}
		
		$scope.selectedTime = undefined;
		$scope.timeSlotSelected = false;
		commonBookingFactory.setTime($scope.selectedTime);
		
		commonBookingFactory.setDate(timeOfBooking);
	}
	
	// Set Time Slot and Table Status
	function setTimeSlot(slot,tableStatus){
		$scope.selectedTime = slot;
		commonBookingFactory.setTime(slot);
		commonBookingFactory.setTableStatus(tableStatus);
	}
	
    $rootScope.$on('makeDateAndTimeEmpty:change', function(){
    	$scope.selectedDate = null;
    	$scope.timedetails = [];
    });
	
	// Toggle Voucher Panel
	function toggleCommonPanel(voucherDetails) {
		
		if(ngCart.getTotalUniqueItems() > 0 
				&& voucherDetails.pagetype === 'profile' && ngCart.getCartFor() === 'restaurant'
				&& ngCart.getItems()[0]._voucherType === 'alacarte' 
				&& ngCart.getItems()[0]._voucher.restaurantId===voucherDetails.voucher.restaurantId
				&& voucherDetails.voucher.offlineVoucher === '1'){
				commonBookingFactory.setDate(ngCart.getDate());
				commonBookingFactory.setTime(ngCart.getTime());
				voucherDetails.voucher.ticket[0].quantity = 1;
				if(addVoucherInCart(voucherDetails)){
					//TODO offline voucher added to cart with quantity 1
				}
		}else{
		$scope.selectedDate = new Date();
		$rootScope.voucherDetails1 = undefined;
		$scope.selectquantityError = "";
		$('#selectedDate').val(null);
		$(".errorDivTime").html("");
		$(".errorDivDate").html("");		
		$(".errorDivForNotAddingInCart").html('');
		if(voucherDetails.pagetype === 'profile' && voucherDetails.cartFor !== 'resort'){
			if(utils.isNullAndEmpty(commonBookingFactory.getDate())){
				$('#dateselection').focus();
				$('html, body').animate({
				     scrollTop: $(".gotToDatePicker").offset().top-100
				       }, 800);
				$('.errorDivDate').html($rootScope.errors.SELECT_DATE);
				$(".errorDivTime").html("");
				$(".errorDivForNotAddingInCart").html("");
				/*$('.errorDivDate').html('Please Select Date');*/
				return false;
			}else if(utils.isNullAndEmpty(commonBookingFactory.getTime())){
				$('#dateselection').focus();
				$('html, body').animate({
				     scrollTop: $(".gotToDatePicker").offset().top-100
				       }, 800);
				$('.errorDivTime').html($rootScope.errors.SELECT_TIME);
				$(".errorDivDate").html("");
				$(".errorDivForNotAddingInCart").html("");
				/*$('.errorDivTime').html('Please Select Time');*/
				return false;
			}else{
				/*$('.errorDiv').html('');*/
			}
		}
		
		if(voucherDetails.pagetype === 'list'){
			$('.errorDiv').html('');
			$scope.selectedDate = undefined;
			$scope.$parent.selectedDate = undefined;
			$scope.selectedTime = undefined;
			commonBookingFactory.empty();
			$rootScope.$broadcast('makeDateAndTimeEmpty:change', {});
		}
		
		var voucherInCart = itemIsInCart(voucherDetails.voucher.id,voucherDetails.vouchertype)
		if(voucherInCart){
			voucherDetails.voucher = voucherInCart.getVoucher();
		}else{
			angular.forEach(voucherDetails.voucher.ticket, function (ticket) {
	        	ticket.quantity = 0;
	        });
		}
		
		$rootScope.voucherDetailsForPanel = voucherDetails;
		$rootScope.openSideNav('commonPanel');
	}
	}
	// Toggle Room Voucher Panel
	function toggleRoomVoucherPanel(voucherDetails) {
		if(voucherDetails.pagetype === 'list'){
			$scope.selectedDate = undefined;
			$scope.$parent.selectedDate = undefined;
			$scope.selectedTime = undefined;
			commonBookingFactory.empty();
		}
		
		var voucherInCart = itemIsInCart(voucherDetails.voucher.id,voucherDetails.vouchertype)
		if(voucherInCart){
			voucherDetails.voucher = voucherInCart.getVoucher();
		}else{
			angular.forEach(voucherDetails.voucher.ticket, function (ticket) {
	        	ticket.quantity = 0;
	        });
		}
		$rootScope.voucherDetailsForPanel = voucherDetails;
		$rootScope.openSideNav('roomVoucherPanel');
	}
	
	// Toggle Event Voucher Panel
	// Need To Be Deleted
	function toggleFreeEventPanel(voucherDetails) {
		console.log(JSON.stringify(voucherDetails.voucher));
		$rootScope.voucherDetailsForPanel = voucherDetails;
		alert("Have To Go To Booking Page For Free Events");
//		$rootScope.openSideNav('freeEventPanel');
	}
	
	function closeSideNav(){
		$rootScope.$broadcast('makeDateEmpty:change', {});
		$rootScope.$broadcast('makeDateAndTimeEmpty:change', {});
		$rootScope.closeSidenav();
	}
	
	//	For Validating The Availibilty Of Buffet At The Time Adding In Cart 
	function validateBuffetTime(availibility){
		
		var selectedDate = new Date(ngCart.getDate());
		var selectedTime = ngCart.getTime();
		
		var dayFromDate = selectedDate.getDay();
		if(dayFromDate === 0){
			dayFromDate = 7;
		}
		
		var daysFromBuffet = utils.getAvailableDays(availibility);
		if(utils.checkValueInArray(daysFromBuffet,dayFromDate) || utils.checkValueInArray(daysFromBuffet,8)){
			var indexDays = [];
			var loopForGettingIndex = true;
			var index = -1;
			
			while (loopForGettingIndex) {
				index = daysFromBuffet.indexOf(8,index+1);
				if(index === -1)
					loopForGettingIndex = false;
				else
					indexDays.push(index);
			}
			
			loopForGettingIndex = true;
			while (loopForGettingIndex) {
				index = daysFromBuffet.indexOf(dayFromDate,index+1);
				if(index === -1)
					loopForGettingIndex = false;
				else
					indexDays.push(index);
			}
			
			var isPresent = false;
			var i=0;
			while(i<indexDays.length && !isPresent){
				var indexToCheck = indexDays[i];
				var startTime = $dateParser(availibility[indexToCheck].startTime,'HH:mm:ss');
				var endTime = $dateParser(availibility[indexToCheck].endTime,'HH:mm:ss');
				var selectTime = $dateParser(selectedTime,'HH:mm:ss');
				
				if(startTime>endTime){
					if(selectTime>=startTime)
						return true;
				}else{
					if(selectTime>=startTime && selectTime<=endTime)
						return true;
				}
				i++;
			}
			
			if(!isPresent){
				$(".errorDivForNotAddingInCart").html("Buffet Not Present At Selected Time.");
				return false;
			}
		}else{
			$(".errorDivForNotAddingInCart").html("Buffet Not Present At Selected Day.");
		}
	}
	
	// Adding A Voucher In Cart
	function addVoucherInCart(voucherDetails){
		if(ngCart.getTotalUniqueItems() === 0) {
			ngCart.empty();
			ngCart.setRestaurantDetails(voucherDetails.restaurantdetail);
			ngCart.setCartFor(voucherDetails.cartFor);
			ngCart.setDate(new Date(commonBookingFactory.getDate()));
			ngCart.setTableStatus(commonBookingFactory.getTableStatus());
			ngCart.setType(voucherDetails.vouchertype);
			
			if(voucherDetails.vouchertype === 'event' ){
				ngCart.setTime(voucherDetails.voucherparent.eventStartTime);
				commonBookingFactory.setTime(voucherDetails.voucherparent.eventStartTime);
			}else
				ngCart.setTime(commonBookingFactory.getTime());
			
			if(voucherDetails.vouchertype === 'alacarte')
				ngCart.setSection(commonBookingFactory.getSectionForBooking());
		}else{
			if(voucherDetails.vouchertype === 'event' ){
				commonBookingFactory.setTime(voucherDetails.voucherparent.eventStartTime);
				ngCart.setType(voucherDetails.vouchertype);
			}
		}
		
		var validNumberOfPax = false;
		var errorToShow = "";
		angular.forEach(voucherDetails.voucher.ticket,function(ticket){
			if(ticket.quantity >= 0){
				if(parseInt(ticket.minPax) <= ticket.quantity || utils.isNullAndEmpty(ticket.minPax)){
					validNumberOfPax = true;
				}else{
					validNumberOfPax = true;
					errorToShow = "Minimum No Of Person Required For Ticket " + ticket.name + " is " + ticket.minPax;
				}
			}
		});
		
		if(validNumberOfPax){
			if(ngCart.getCartFor() === 'restaurant' && voucherDetails.cartFor === 'restaurant')
				return addVoucherOfRestaurant(voucherDetails);
			else if(ngCart.getCartFor() === 'resort' && voucherDetails.cartFor === 'resort')
				return addVoucherOfResort(voucherDetails);
			else
				$(".errorDivForNotAddingInCart").html("You Can Book For Either Restaurant Or Resort At A Time.");
		}else{
			$(".errorDivForNotAddingInCart").html(errorToShow);
		}

	}
	
	//	Check date Validation At The Time Of Adding Voucher To Cart
	function checkDateForCart(){
		var cartDate = new Date(ngCart.getDate());
		var userSelectedDate = new Date(commonBookingFactory.getDate());
		var cartConvertedDate = new Date(cartDate.getFullYear(),cartDate.getMonth(),cartDate.getDate(),0,0,0,0);
		var userSelectedConvertedDate = new Date(userSelectedDate.getFullYear(),userSelectedDate.getMonth(),userSelectedDate.getDate(),0,0,0,0);
		
		if(!utils.isNullAndEmpty(ngCart.getDate()) && cartConvertedDate.getTime() === userSelectedConvertedDate.getTime()){
			return true;
		}else{
			return false;
		}
	}
	
//	Check time Validation At The Time Of Adding Voucher To Cart
	function checkTimeForCart(){
		if((!utils.isNullAndEmpty(ngCart.getTime()) && ngCart.getTime() === commonBookingFactory.getTime())){
			return true;
		}else{
			return false;
		}
	}
	
	function checkVoucherWithCart(voucherType){
		if(ngCart.getType() === voucherType)
			return true;
		else{
			customToast.showToast("Cart Contain Different Type Of Item.");
			return false;
		}
	}
	
	function validateVoucherDay(availibility){
		var selectedDate = new Date(ngCart.getDate());
		
		var dayFromDate = selectedDate.getDay();
		if(dayFromDate === 0){
			dayFromDate = 7;
		}
		
		var daysFromVoucher = utils.getAvailableDays(availibility);
		if(utils.checkValueInArray(daysFromVoucher,dayFromDate) || utils.checkValueInArray(daysFromVoucher,8))
			return true;
		else{
			$(".errorDivForNotAddingInCart").html("Voucher Is Not present on this day.");
			return false;
		}
	}
	
	function checkNoOfDayForRoomVoucher(voucherDetails){
		if(voucherDetails.vouchertype === 'roomvoucher'){
			if(utils.isNullAndEmpty($scope.noOfDays) || $scope.noOfDays < 1){
				$(".errorDivForNotAddingInCart").html("Please Give the No of Days to Stay.");
				return false;
			}else{
				ngCart.setNoOfDays($scope.noOfDays);
				return true;
			}
		}else{
			return true;
		}
	}
	
	function closeCartModal(){
		$mdDialog.hide();
	}
	
	// Add Voucher For Resort
	function addVoucherOfResort(voucherDetails){
		if(ngCart.getRestaurantId() === voucherDetails.restaurantdetail.restaurantId){
			if(checkDateForCart()){
				if(checkNoOfDayForRoomVoucher(voucherDetails)){
					if(checkVoucherWithCart(voucherDetails.vouchertype)){
						var acceptToAdd = false;
						if(validateVoucherDate(voucherDetails.voucher)){
							if(validateVoucherDay(voucherDetails.voucher.availability))
								acceptToAdd = true;
						}
						if(acceptToAdd){
							ngCart.addItem(voucherDetails.voucher.id, voucherDetails.voucher.punchLine, voucherDetails.voucher, voucherDetails.vouchertype, voucherDetails.voucherparent);
							if(ngCart.getTotalItems() > 0){
								$rootScope.closeSidenav();
								return true;
							}else{
								$(".errorDivForNotAddingInCart").html("Please select some Quantity.");
								return false;
							}
							
						}
					}
				}
			}else{
				if(utils.isNullAndEmpty(ngCart.getDate()) || isNaN((new Date(ngCart.getDate())).getTime()))
					$(".errorDiv").html("Please Select Date.");
				else
					$(".errorDivForNotAddingInCart").html("Cart Contain Item With Different Date.");
				
				return false;
			}
		}else{
			$(".errorDivForNotAddingInCart").html("Items of Different Restaurant In Cart.");
			return false;
		}
	}
	//To validate Date & Time on clicking on buffet or group voucher	
	function validateDateAndTime(clickedButton) {
		
		
			$(".errorDivTime").html("");
			$(".errorDivDate").html("");
			
				if(utils.isNullAndEmpty(commonBookingFactory.getDate())){
					$mdDialog.show(
				   		      $mdDialog.alert()
				   		        .parent(angular.element(document.body))
				   		        .clickOutsideToClose(true)
				   		        .title('Date Selection Error')
				   		        .textContent('Please Select Date.')
				   		        .ariaLabel('Please Select Date.')
				   		        .ok('OK')
				   		        .targetEvent(null)
				   		 );
					$('html, body').animate({
					     scrollTop: $(".gotToDatePicker").offset().top-50
					       }, 800);
					$('.errorDivDate').html($rootScope.errors.SELECT_DATE);
					$(".errorDivTime").html("");
					return false;
				}else if(utils.isNullAndEmpty(commonBookingFactory.getTime())){
					$mdDialog.show(
			   		      $mdDialog.alert()
			   		        .parent(angular.element(document.body))
			   		        .clickOutsideToClose(true)
			   		        .title('Time Selection Error')
			   		        .textContent('Please Select Time.')
			   		        .ariaLabel('Please Select Time.')
			   		        .ok('OK')
			   		        .targetEvent(null)
			   		 );
					$('html, body').animate({
					     scrollTop: $(".gotToDatePicker").offset().top-100
					       }, 800);
					
					
					$('.errorDivTime').html($rootScope.errors.SELECT_TIME);
					$(".errorDivDate").html("");
					return false;
				}else{
					if(clickedButton==='Buffet'){
						if(commonBookingFactory.getGroupVoucherBtnSelected())
							commonBookingFactory.setGroupVoucherBtnSelected(false);
						if(commonBookingFactory.getAlaCarteBtnSelected())
							commonBookingFactory.setAlaCarteBtnSelected(false);
						commonBookingFactory.setBuffetBtnSelected(!commonBookingFactory.getBuffetBtnSelected());
						
						$('html, body').animate({
						     scrollTop: $("#chooseOffer").offset().top-100
						       }, 800);
					}
					else if(clickedButton==='GroupVoucher'){
						if(commonBookingFactory.getBuffetBtnSelected())
							commonBookingFactory.setBuffetBtnSelected(false);
						if(commonBookingFactory.getAlaCarteBtnSelected())
							commonBookingFactory.setAlaCarteBtnSelected(false);
						commonBookingFactory.setGroupVoucherBtnSelected(!commonBookingFactory.getGroupVoucherBtnSelected());
						
						$('html, body').animate({
						     scrollTop: $(".offers-heading").offset().top-100
						       }, 800);
					}	
					
					return false;
				}
			}
	
	// Valdiate One Event At A Time In Cart
	function validateOneEventAtATime(voucherDetails){
		if(ngCart.getTotalUniqueItems() == 0) {
			return true;
		}else{
			var eventIdFromCart = ngCart.getEventIdFromCart(); 
			if(utils.isNullAndEmpty(eventIdFromCart)){
				return true;
			}else{
				if(eventIdFromCart === voucherDetails.voucherparent.id)
					return true;
				else{
					$(".errorDivForNotAddingInCart").html("You can book for one event at a time.");
					return false;
				}
			}
		}
	}
	
	// Validate Date For Voucher Date For Adding Voucher In cart
	function validateVoucherDate(voucher){
		var result = utils.checkDateInBetween(voucher.startDate, voucher.endDate , new Date(ngCart.getDate()));
		if(result)
			return true;
		else{
			$(".errorDivForNotAddingInCart").html("Voucher Not Present On Selected Date.");
			return false;
		}
	}
	
	//	Validate Event Date For Adding In Cart
	function validateEventDate(voucherDetails){
		var selectedDate = new Date(ngCart.getDate().getFullYear(),ngCart.getDate().getMonth(),ngCart.getDate().getDate(),5,30,0);
		var result = utils.checkDateInBetween(voucherDetails.voucherparent.startEventDate, voucherDetails.voucherparent.endEventDate , selectedDate);
		if(result){
			return validateVoucherDate(voucherDetails.voucher);
		}else{
			$(".errorDivForNotAddingInCart").html("Event Not Present On Selected Date.");
			return false;
		}
	}
	
	// Add Voucher For Restaurant
	function addVoucherOfRestaurant(voucherDetails){
		if(ngCart.getRestaurantId() === voucherDetails.restaurantdetail.restaurantId){
			if(checkDateForCart()){
				if(checkTimeForCart()){
					var acceptToAdd = false;
					if(voucherDetails.vouchertype === 'buffet' || voucherDetails.vouchertype === 'offer' || voucherDetails.vouchertype === 'generalvoucher'){
						// Validate Buffet Dates
						if(validateVoucherDate(voucherDetails.voucher)){
							// Validate buffet timings
							if(validateBuffetTime(voucherDetails.voucher.availability))
								acceptToAdd = true;
						}
					}else if(voucherDetails.vouchertype === 'event' || voucherDetails.vouchertype === 'freeevent'){
						// For Checking One Event At A Time
						if(validateOneEventAtATime(voucherDetails)){
							// For Checking the Event Dates
							if(validateEventDate(voucherDetails))
								acceptToAdd = true;
						}
					}else if(voucherDetails.vouchertype === 'alacarte'){
						voucherDetails.voucher.punchLine = "A La Carte";
						acceptToAdd = true;
					}
					
					// Adding In Cart
					if(acceptToAdd){
						ngCart.addItem(voucherDetails.voucher.id, voucherDetails.voucher.punchLine, voucherDetails.voucher, voucherDetails.vouchertype, voucherDetails.voucherparent);
						if(ngCart.getTotalItems() > 0){
							$rootScope.closeSidenav();
							return true;
						}else{
							ngCart.removeItemById(voucher.id,voucherDetails.vouchertype );
							$(".errorDivForNotAddingInCart").html("Please select some Quantity.");
							return false;
						}
					}
					
					return acceptToAdd;
				}else{
					if(utils.isNullAndEmpty(ngCart.getTime()))
						$(".errorDiv").html("Please Select Time.");
					else
						$(".errorDivForNotAddingInCart").html("Cart Contain Item With Different Time.");
					
					return false;
				}
			}else{
				if(utils.isNullAndEmpty(ngCart.getDate()) || isNaN((new Date(ngCart.getDate())).getTime()))
					$(".errorDiv").html("Please Select Date.");
				else
					$(".errorDivForNotAddingInCart").html("Cart Contain Item With Different Date.");
				
				return false;
			}
		}else{
			$(".errorDivForNotAddingInCart").html("Items of Different Restaurant In Cart.");
			return false;
		}
	}
	
	// Increase or decrease the quantity
	function setQuantity(ticket,quantity){
		ticket.quantity = ticket.quantity + quantity;
	}
	
	// Increase or decrease the quantity directly in cart
	function setQuantityInCart(ticket,quantity){
		ticket.quantity = ticket.quantity + quantity;
		ngCart.$save();
	}
	
	//	check if item is in cart
	function itemIsInCart(voucherId,voucherType){
		var voucherInCart = ngCart.getItemById(voucherId,voucherType);
		if (typeof voucherInCart === 'object') {
			return voucherInCart;
		}else{
			return false;
		}
	}
	
	// remove voucher from cart
	function removeVoucherById(id,voucherType){
		ngCart.removeItemById(id,voucherType);
	}
	
	function getRestaurantIdInCart(){
		return ngCart.getRestaurantId();
	}
	
	function getRestaurantDetails(){
		return ngCart.getRestaurantDetails();
	}
	
	// Function For Simple Table Booking
	function proceedForSimpleBooking(noOfPeoples, restaurantdetail){
		ngCart.setDate(new Date(commonBookingFactory.getDate()));
		ngCart.setTime(commonBookingFactory.getTime());
		if(checkDateForCart()){
			if(checkTimeForCart()){
				if(noOfPeoples === 0 || utils.isNullAndEmpty(noOfPeoples)){
					customToast.showToast("Please Put the no of persons.");
				}else{
					ngCart.empty();
					ngCart.setDate(new Date(commonBookingFactory.getDate()));
					ngCart.setTime(commonBookingFactory.getTime());
					ngCart.setRestaurantDetails(restaurantdetail);
					ngCart.setCartFor('restaurant');
					ngCart.setTableStatus(commonBookingFactory.getTableStatus());
					ngCart.setNoOfPeople(noOfPeoples);
					ngCart.setType('simpleTable');
					$state.go('summary', {city: $rootScope.selectedCity});
				}
			}else{
				customToast.showToast("Please Select Time.");
			}
		}else{
			customToast.showToast("Please Select Date.");
		}
			
	}
	
	//	Functions On Proceed To Book
	function processLoginForBooking(){
		if(ngCart.getCartFor() === 'restaurant'){
			if(ngCart.isOnlyGeneralVoucherPresent()){
				$mdDialog.show(
			      $mdDialog.alert()
			        .clickOutsideToClose(true)
			        .title('Alert')
			        .textContent('Please Add Something with General Voucher.')
			        .ok('Got it!')
			    );
				
			}
			if(ngCart.checkQuantity()){
				
				alert("Please Select Quantity")
			}
			else{
				$state.go('summary', {city: $rootScope.selectedCity,cache:true});
			}
		}else{
			$state.go('summary', {city: $rootScope.selectedCity,cache:true});
		}
			
	}
	
	function init(){
		$scope.commonBookingFactory = commonBookingFactory;
		$scope.ngCart = ngCart;
	}
	
	function checkToShowNumberForFreeEvent(){
		if(ngCart.getTotalUniqueItems() === 0) {
			return true;
		}else{
			return false;
		}
	}
	
	init();
}