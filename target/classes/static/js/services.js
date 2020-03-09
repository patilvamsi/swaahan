/**
 * 
 */
'use strict';

var AppService = angular.module('SwaahanApp');

AppService.service('processRequestService', ['$http', processRequestService]);
AppService.service('searchService',['processRequestService', 'requestFactory', searchService]);
AppService.service('restaurantDetailService',['processRequestService', 'requestFactory', restaurantDetailService] );
AppService.service('bookingService', ['processRequestService', 'requestFactory', 'utils', 'resortBookingFactory', 'tableBookingFactory', 'commonBookingFactory',bookingService]);
AppService.service('ngCart', ['$rootScope', 'ngCartItem', 'store', 'commonBookingFactory', 'utils', ngCart]);
AppService.service('campaignService', ['processRequestService', 'requestFactory', campaignService]);
AppService.service('callCenterService', ['processRequestService', 'requestFactory','agentFactory', callCenterService]);
AppService.service('resortDetailService', ['processRequestService', 'requestFactory', resortDetailService]);
AppService.service('banquetService', ['processRequestService', 'requestFactory', banquetService]);

// All Context of All Projects
function apiContexts(){
	this.evfApi = "/evf-api"; // Project : evf-api
}

// All End Points Of All Contexts
function endPoints(){
	this.restaurntDetail = "/search/details.json";
	this.suggestRestaurants = "/search/suggestRestaurants.json";
	this.aggregations = "/search/aggs.json?limit=0";
	this.bookingTimeSlots = "/booking/timeslot.json";
	this.bookingDetail = "/booking/getbookingdetails.json";
	this.saveRestaurantBooking = "/callcenter/saverestaurantbooking.json";
	this.saveResortBooking = "/callcenter/saveresortbooking.json";
	this.getCoupons = "/campaign/newcoupons.json";
	this.validateCoupon = "/campaign/validatenewcoupon.json";
	this.userWallet = "/campaign/userwallet.json";
	this.userDetails = "/callcenter/getuserdetails.json";
	this.resortDetails = "/search/resorts.json?offset=0&limit=30";
	this.getAllAgentNames = "/callcenter/agentnames.json";
	this.getMobileNumbersOfAgent = "/callcenter/mobilenumbersofagent.json";
	this.paymentLink="/callcenter/sendpaymentlink.json";
	this.restaurantcontactdetails = "/callcenter/restaurantcontactdetails.json";
	this.saveEnquiry = "/callcenter/saveEnquiry.json";
	this.getLatestCallLog = "/callcenter/getLatestCallLog.json";
	this.getCallHistoryByAgentNumber = "/callcenter/getCallHistoryByAgentNumber.json";
	this.getEventTimeSlots = "/booking/eventtimeslot.json";
	this.savePartyDetail = '/evf-api/planaparty/saveParty.json';
	this.checkDuplicateBooking = '/callcenter/checkDuplicateBooking.json';
}

function removeAlacarteVoucherFromCart(){
	var cart = this.getCart();
    angular.forEach(cart.items, function (item, index) {
        if  ( item.getVoucherType() === "alacarte") {
            cart.items.splice(index, 1);
        }
    });
    var offLineVoucherCount = 0;
    var normalVoucherCount = 0;
    angular.forEach(cart.items, function (item, index) {
        if  (item._voucher.offlineVoucher === 1+"") {
        	offLineVoucherCount = offLineVoucherCount + 1;
        }else{
        	normalVoucherCount = normalVoucherCount + 1;
        }
    });
    
    if(normalVoucherCount === 0){
    	this.empty();
    }
    
}

// For getting the url to hit with scheme , domain , context , endpoint
function getApiUrl(contextInput, apiNameInput){
	
	var scheme = window.location.protocol + "//";
	
	var domain = window.location.hostname;
	if(domain === 'localhost' || domain === '106.51.67.211'){
		domain = window.location.hostname + ":" +window.location.port;
	}else if(domain === 'admin.eveningflavors.com'){
		scheme = 'https://';
		domain = 'www.eveningflavors.com';
	}else{
		scheme = 'https://';
		domain = 'dev.eveningflavors.com';
	}
	
	return scheme + domain + contextInput + apiNameInput;
}

// Objects Of Endpoints, Contexts
var endPoint = new endPoints();
var apiContext = new apiContexts();

function searchService(processRequestService, requestFactory) {

	this.getCities = function(){
		var request = undefined;
		request = requestFactory.addFilterRequest(request, 'type', 'restaurant', ['restaurant']);
		request = requestFactory.addAggregationRequest(request, 'city.raw', 'city.raw', 1000);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.aggregations, request);
	}
	
	this.getRestaurantsSuggester = function(request) {
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.suggestRestaurants, request);
	}

	this.getAreas = function (city){
		var request = undefined;
		request = requestFactory.addFilterRequest(request, 'type', 'restaurant', ['restaurant']);
		request = requestFactory.addAggregationRequest(request, 'area.raw', 'area.raw', 1000);
		request = requestFactory.addFilterRequest(request, 'city', city, [ city ]);
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.aggregations, request);
	}
	return this;

}

function restaurantDetailService(processRequestService, requestFactory){
	
	this.getRestaurantDetail = function(id){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'id',id,[id]);
		request = requestFactory.addChildFilterRequest(request,'voucher','Yes',['Yes']);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.restaurntDetail, request);
	}
	
	this.getRestaurantContactNumbers = function(id){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'restaurantId',id,[id]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.restaurantcontactdetails, request);
	}
	
	return this;
}

function resortDetailService(processRequestService, requestFactory){
	
	this.getResortDetail = function(id){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'resortId',id,[id]);
		request = requestFactory.addAggregationRequest(request, 'resortArea.raw', 'resortArea.raw', 1000);
        
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.resortDetails, request);
	}
	 
	return this;
}

function bookingService(processRequestService, requestFactory, utils, resortBookingFactory, tableBookingFactory, commonBookingFactory){
	
	this.resetLocalStorage = function(){
		ngCart.empty();
		resortBookingFactory.empty();
		tableBookingFactory.empty();
		commonBookingFactory.empty();
	}
	this.sendEmail=function(bookingRefNo){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'bookingRefNo',bookingRefNo,[]);
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.paymentLink, request);
	}
	this.getUserDetails = function(emailId, mobileNumber, firstName, lastName){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'emailId',emailId,[]);
		request = requestFactory.addFilterRequest(request,'mobileNumber',mobileNumber,[]);
		request = requestFactory.addFilterRequest(request,'firstName',firstName,[]);
		request = requestFactory.addFilterRequest(request,'lastName',lastName,[]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.userDetails, request);
	}
	
	this.getTimeSlots = function(restaurantId , datetime){
		datetime = utils.convertTimeForJSONStringify(datetime);
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'restaurantId',restaurantId,[restaurantId]);
		request = requestFactory.addFilterRequest(request,'datetime',datetime,[datetime]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.bookingTimeSlots, request);
	}
	this.getEventTimeSlots=function(eventId , datetime){
     	var	request = undefined;
		var dateString = getDateString(datetime);
		request = requestFactory.addFilterRequest(request,'eventId',eventId,[eventId]);
		request = requestFactory.addFilterRequest(request,'datetime',dateString.toString(),[dateString.toString()]);
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.getEventTimeSlots, request);
		
	}
	function getDateString(gmtDateString){
		return (gmtDateString.getFullYear()+"-"+(gmtDateString.getMonth()+1)+"-"+gmtDateString.getDate()
		+" "+gmtDateString.getHours()+":"+gmtDateString.getMinutes()+":"+gmtDateString.getSeconds());
	}
	this.getBookingDetails = function(bookingReferenceNo){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'bookingReferenceNo',bookingReferenceNo,[bookingReferenceNo]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.bookingDetail, request);
	}
	
	this.getbookingdetailByBookingId = function(bookingId){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'bookingId',bookingId,[bookingId]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.bookingDetail, request);
	}
	
	this.checkDuplicateBooking = function(userContactNo,diningTime) {
		var request = {}
		request.userContactNo = userContactNo;
		request.diningTime = diningTime;
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.checkDuplicateBooking, request);
	}
	
	this.saveRestaurantBooking = function(bookinginfo) {
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.saveRestaurantBooking, bookinginfo);
	}
	
	this.saveResortBooking = function(resortbooking) {
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.saveResortBooking, resortbooking);
	}
	
	return this;
}

function ngCart($rootScope, ngCartItem, store, commonBookingFactory, utils) {

    this.init = function(){
        this.$cart = {
        	type : undefined,
        	cartFor : undefined,
        	restaurantDetails : undefined,
        	date : undefined,
        	section : undefined,
        	time : undefined,
        	noOfPeople : 0,
        	isCartSpecial : undefined,
        	tableStatus : undefined,
        	noOfDays : undefined,
            items : [],
            cashbackAvail : {
            	'CASHBACK' : 0,
            	'CASHBACKPLUS' : 0,
            	'RESTCASHBACK' : 0
            }
        };
    };
    
    this.getStatusOfPaying = function(){
    	// TODO Have To Work
    	var result = "No";
    	
    	var array = {
    			"yes" : [],
    			"no" : [],
    			"optional" : []
    	}
    	
    	angular.forEach(this.getItems(), function (item) {
    		if(item.getVoucherType().toLowerCase() === 'alacarte'){
    			array['no'].push('no');
    		}else{
    			var voucher = item.getVoucher();
    			if(utils.isNotNullAndEmpty(voucher.collectBuffetAmount)){
    				array[voucher.collectBuffetAmount.toLowerCase()].push(voucher.collectBuffetAmount.toLowerCase());
    			}else{
    				array['no'].push('no');
    			}
    		}
    	});
    	
    	if(array.yes.length > 0 && array.no.length > 0){
    		result = 'error';
    	}else if(array.no.length > 0){
    		result = 'no';
    	}else if(array.yes.length > 0){
    		result = 'yes';
    	}else{
    		result = 'optional';
    	}
    	
    	return result;
    }
    
    this.isOnlyGeneralVoucherPresent = function(){
    	var isOnlyGeneralVoucherPresent = true;
    	angular.forEach(this.getCart().items,function(item){
    	
    		if(item.getVoucherType() !== 'generalvoucher'){
    			isOnlyGeneralVoucherPresent = false;
    		}
    	});
    	
    	return isOnlyGeneralVoucherPresent;
    }
    
    this.checkQuantity =function(){ 
    	var value=true;
    	angular.forEach(this.getCart().items,function(item){
    		for(var i = 0 ; i< item.getTickets().length; i++) {
    			if(item._voucher.ticket[i].quantity>0){
    				value=false;
    				break;
    			}
            }
    		
    	});
    	return value;
	}
    
    this.getTotalCashbackAvailed = function(){
    	var amount = 0;
    	angular.forEach(this.getCashbackAvail(),function(value,key){
    		amount += value;
    	});
    	return amount;
    }
    
    this.getCashbackAvail = function(type){
    	if(utils.isNullAndEmpty(type))
    		return this.getCart().cashbackAvail;
    	else
    		return utils.isNullAndEmpty(this.getCart().cashbackAvail[type]) ? 0 : this.getCart().cashbackAvail[type];
    }
    
    this.setCashbackAvail = function(type,value){
    	this.getCart().cashbackAvail[type] = value;
    }
    
    this.getRestaurantCity = function(){
    	try{
    		return this.getRestaurantDetails().restaurantCity;
    	}catch(e){
    		return undefined;
    	}
    }
    
    this.getRestaurantId = function(){
    	try{
    		return this.getRestaurantDetails().restaurantId;
    	}catch(e){
    		return undefined;
    	}
    }
    
    this.getRestaurantName = function(){
    	try{
    		return this.getRestaurantDetails().restaurantName;
    	}catch(e){
    		return undefined;
    	}
    }

    this.getEventIdFromCart = function(){
    	var items = this.getItems();
    	var returnValue = false;
    	var eventId = undefined;
    	var doubleEvents = false;
    	angular.forEach(items, function (item) {
    		if(item.getVoucherType() === 'event' || item.getVoucherType() === 'freeevent'){
    			if(eventId === undefined){
    				eventId = item.getVoucherParent().id;
    			}else{
    				if(eventId !== item.getVoucherParent().id)
    					doubleEvents = true;
    			}
    		}
    	});
    	
    	if(doubleEvents)
    		return false;
    	else
    		return eventId;
    }
    
    this.getEventNameFromCart = function(){
    	var eventId = undefined;
    	var eventName = undefined;
    	angular.forEach(this.getItems(), function (item) {
    		if(item.getVoucherType() === 'event'  || item.getVoucherType() === 'freeevent'){
    			if(eventId === undefined){
    				eventName = item.getVoucherParent().name;
    			}
    		}
    	});
    	return eventName;
    }
    
    this.addItem = function (id, name, voucher, voucherType, voucherParent) {
        var inCart = this.getItemById(id,voucherType);
        if (typeof inCart === 'object'){
            //Update tickets of an item if it's already in the cart
        	inCart.setVoucher(voucher);
        } else {
            var newItem = new ngCartItem(id, name, voucher, voucherType, voucherParent);
            this.$cart.items.push(newItem);
        }
        $rootScope.$broadcast('ngCart:change', {});
    };
    
    this.getIsCartSpecial = function(){
    	return this.$cart.isCartSpecial;
    }
    
    this.setIsCartSpecial = function(isCartSpecial){
    	this.$cart.isCartSpecial = isCartSpecial;
    	$rootScope.$broadcast('ngCart:change', {});
    	return this.getIsCartSpecial();
    }
    
    this.getNoOfDays = function(){
    	return this.$cart.noOfDays;
    }
    
    this.setNoOfDays = function(noOfDays){
    	this.$cart.noOfDays = noOfDays;
    	$rootScope.$broadcast('ngCart:change', {});
    	return this.getNoOfDays();
    }
    
    this.getSection = function(){
    	return this.$cart.section;
    }
    
    this.setSection = function(section){
    	this.$cart.section = section;
    	$rootScope.$broadcast('ngCart:change', {});
    	return this.getSection();
    }
    
    this.getCartFor = function(){
    	return this.$cart.cartFor;
    }
    
    this.setCartFor = function(cartFor){
    	this.$cart.cartFor = cartFor;
    	$rootScope.$broadcast('ngCart:change', {});
    	return this.getCartFor();
    }

    this.getItemById = function (itemId,voucherType) {
        var items = this.getCart().items;
        var build = false;
        angular.forEach(items, function (item) {
            if  (item.getId() === itemId && item.getVoucherType() === voucherType) {
                build = item;
            }
        });
        return build;
    };

    this.setCart = function (cart) {
        this.$cart = cart;
        $rootScope.$broadcast('ngCart:change', {});
        return this.getCart();
    };

    this.getCart = function(){
        return this.$cart;
    };
    
    this.setNoOfPeople = function (noOfPeople) {
        this.$cart.noOfPeople = noOfPeople;
        $rootScope.$broadcast('ngCart:change', {});
        return this.getNoOfPeople();
    };

    this.getNoOfPeople = function(){
        return this.$cart.noOfPeople;
    };
    
    this.setRestaurantDetails = function (restaurantDetails) {
        this.$cart.restaurantDetails = restaurantDetails;
        $rootScope.$broadcast('ngCart:change', {});
        return this.getRestaurantDetails();
    };

    this.getRestaurantDetails = function(){
        return this.$cart.restaurantDetails;
    };
    
    this.setTableStatus = function (tableStatus) {
        this.$cart.tableStatus = tableStatus;
        $rootScope.$broadcast('ngCart:change', {});
        return this.getTableStatus();
    };

    this.getTableStatus = function(){
        return this.$cart.tableStatus;
    };

    this.getItems = function(){
        return this.getCart().items;
    };

    this.getTotalItems = function () {
        var count = 0;
        var items = this.getItems();
        angular.forEach(items, function (item) {
        	angular.forEach(item.getTickets(), function (ticket) {
                count += ticket.quantity ? ticket.quantity : 0;
            });
        });
        return count;
    };

    this.getTotalUniqueItems = function () {
        return this.getCart().items.length;
    };
    
    this.getParticularItemQuantity = function(item) {
    	 var count = 0;
    	 angular.forEach(item.getTickets(), function (ticket) {
             count += ticket.quantity;
         });
    	 return count;
    }
    
    this.getSubTotalAfterVoucherDiscount = function(){
    	var totalWithDiscount = 0;
    	angular.forEach(this.getItems(), function (voucher) {
    		totalWithDiscount += voucher.getVoucherTotalAfterDiscount();
        });
    	if(this.getNoOfDays() === undefined || this.getNoOfDays() === '' || this.getNoOfDays() === 0 || this.getNoOfDays() === 1){
        	return +parseFloat(totalWithDiscount).toFixed(2);
        }else{
        	return +parseFloat(totalWithDiscount*this.getNoOfDays()).toFixed(2);
        }
    }
    
    this.getSubTotal = function(){
        var total = 0;
        angular.forEach(this.getItems(), function (voucher) {
            total += voucher.getVoucherTotal();
        });
        if(this.getNoOfDays() === undefined || this.getNoOfDays() === '' || this.getNoOfDays() === 0 || this.getNoOfDays() === 1){
        	return +parseFloat(total).toFixed(2);
        }else{
        	return +parseFloat(total*this.getNoOfDays()).toFixed(2);
        }
    };
    
    this.discountOnRestaurantCoupon = function(){
    	return commonBookingFactory.getDiscountAmount(this.getRestaurantId(),'restaurant');
    };
    
    this.finalTotalCost = function () {
    	var amount = this.getSubTotalAfterVoucherDiscount() - this.discountOnRestaurantCoupon() - this.getTotalCashbackAvailed();
        return +parseFloat(amount).toFixed(2);
    };

    this.actualTotalCost = function () {
        return +parseFloat(this.getSubTotal()).toFixed(2);
    };

    this.removeItem = function (index) {
        this.$cart.items.splice(index, 1);
        $rootScope.$broadcast('ngCart:itemRemoved', {});
        $rootScope.$broadcast('ngCart:change', {});
    };
    
    this.setType = function(type){
        this.$cart.type = type;
        $rootScope.$broadcast('ngCart:change', {});
        return this.getType();
    };

    this.getType = function(){
        return  this.getCart().type;
    };
    
    this.setDate = function(date){
        this.$cart.date = date;
        $rootScope.$broadcast('ngCart:change', {});
        return this.getDate();
    };

    this.getDate = function(){
        return  this.getCart().date;
    };
    
    this.setTime = function(time){
        this.$cart.time = time;
        $rootScope.$broadcast('ngCart:change', {});
        return this.getTime();
    };

    this.getTime = function(){
        return  this.getCart().time;
    };

    this.removeItemById = function (id,voucherType) {
        var cart = this.getCart();
        angular.forEach(cart.items, function (item, index) {
            if  (item.getId() === id && item.getVoucherType() === voucherType) {
                cart.items.splice(index, 1);
            }
        });
        
        var offLineVoucherCount = 0;
        var normalVoucherCount = 0;
        angular.forEach(cart.items, function (item, index) {
            if  (item._voucher.offlineVoucher === 1+"") {
            	offLineVoucherCount = offLineVoucherCount + 1;
            }else{
            	normalVoucherCount = normalVoucherCount + 1;
            }
        });
        if(normalVoucherCount === 0){
        	this.empty();
        }
        
        this.setCart(cart);
        if(this.getTotalUniqueItems() === 0){
        	this.empty();
        }
        $rootScope.$broadcast('ngCart:itemRemoved', {});
        $rootScope.$broadcast('ngCart:change', {});
    };
    
    this.removeAlacarteVoucherFromCart = function(){
    	var cart = this.getCart();
        angular.forEach(cart.items, function (item, index) {
            if  ( item.getVoucherType() === "alacarte") 
                cart.items.splice(index, 1);
        });
        var offLineVoucherCount = 0;
        var normalVoucherCount = 0;
        angular.forEach(cart.items, function (item, index) {
            if  (item._voucher.offlineVoucher === 1+"") 
            	offLineVoucherCount = offLineVoucherCount + 1;
            else
            	normalVoucherCount = normalVoucherCount + 1;
        });
        if(normalVoucherCount === 0)
        	this.empty();
    }

    
    this.empty = function () {
        this.$cart.type = undefined;
        this.$cart.cartFor = undefined;
        this.$cart.restaurantDetails = undefined;
        this.$cart.date = undefined;
        this.$cart.time = undefined;
        this.$cart.noOfPeople = 0;
        this.$cart.isCartSpecial = undefined,
        this.$cart.noOfDays = undefined,
        this.$cart.items = [];
        store.set('cart',undefined);
        $rootScope.$broadcast('ngCart:change', {});
    };

    this.toObject = function() {
        if (this.getItems().length === 0) return false;
        var items = [];
        angular.forEach(this.getItems(), function(item){
            items.push (item.toObject());
        });
        return {
        	type: this.getType(),
            totalCost: this.totalCost(),
            items:items
        }
    };
    
    this.$restore = function(storedCart){
        var _self = this;
        _self.init();
        _self.$cart.type = storedCart.type;
        _self.$cart.cartFor = storedCart.cartFor;
        _self.$cart.restaurantDetails = storedCart.restaurantDetails;
        _self.$cart.date = storedCart.date;
        _self.$cart.time = storedCart.time;
        _self.$cart.noOfDays = storedCart.noOfDays;
        _self.$cart.noOfPeople = storedCart.noOfPeople;
        _self.$cart.tableStatus = storedCart.tableStatus;
        _self.$cart.isCartSpecial = undefined;
        angular.forEach(storedCart.items, function (item) {
            _self.$cart.items.push(new ngCartItem(item._id, item._name, item._voucher, item._voucherType, item._voucherParent));
        });
        this.$save();
    };

    this.$save = function () {
        return store.set('cartForCallCenter', this.getCart());
    }

    return this;
}

function callCenterService(processRequestService, requestFactory,agentFactory){
	
	this.getAllAgentNames = function(){
		var request = requestFactory.generateBasicRequest();
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.getAllAgentNames, request);
	}
	
	this.getMobileNumbersOfAgent = function(agentName){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'agentName',agentName,[]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.getMobileNumbersOfAgent, request);
	}
	
	this.saveEnquiry = function(enquiryDetails){
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.saveEnquiry, enquiryDetails);
	}
	
	this.letsPerformGotACall = function(){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'agentNumber',agentFactory.getAgentDetails().mobileNumber,[agentFactory.getAgentDetails().mobileNumber]);
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.getLatestCallLog, request);
	}
	
	this.getCallHistoryByAgentNumber = function(agentNumber){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'agentNumber',agentNumber,[]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.getCallHistoryByAgentNumber, request);
	}
	return this;
}

function campaignService(processRequestService, requestFactory){

	this.getCoupons = function(id,date,restaurantCity,restaurantArea,bookingType,userPhone,userMail,loginid) {
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'id',id,[]);
		request = requestFactory.addFilterRequest(request,'date',date,[]);
		request = requestFactory.addFilterRequest(request,'restaurantCity',restaurantCity,[]);
		request = requestFactory.addFilterRequest(request,'restaurantArea',restaurantArea,[]);
		request = requestFactory.addFilterRequest(request,'bookingMedium','WEBSITE',[]);
		request = requestFactory.addFilterRequest(request,'bookingType',String(bookingType).toUpperCase(),[]);
		request = requestFactory.addFilterRequest(request,'userPhone',userPhone,[]);
		request = requestFactory.addFilterRequest(request,'userMail',userMail,[]);
		request = requestFactory.addFilterRequest(request,'companyId',"",[]);
		request = requestFactory.addFilterRequest(request,'loginid',loginid,[]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.getCoupons, request);
	}
	
	this.validateCoupon = function(id,date,restaurantCity,restaurantArea,bookingType,userPhone,userMail,couponcode,quantity,amount,loginid) {
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'id',id,[]);
		request = requestFactory.addFilterRequest(request,'date',date,[]);
		request = requestFactory.addFilterRequest(request,'restaurantCity',restaurantCity,[]);
		request = requestFactory.addFilterRequest(request,'restaurantArea',restaurantArea,[]);
		request = requestFactory.addFilterRequest(request,'bookingMedium','WEBSITE',[]);
		request = requestFactory.addFilterRequest(request,'bookingType',String(bookingType).toUpperCase(),[]);
		request = requestFactory.addFilterRequest(request,'userPhone',userPhone,[]);
		request = requestFactory.addFilterRequest(request,'userMail',userMail,[]);
		request = requestFactory.addFilterRequest(request,'couponcode',couponcode,[]);
		request = requestFactory.addFilterRequest(request,'quantity',parseInt(quantity),[]);
		request = requestFactory.addFilterRequest(request,'amount',parseInt(amount),[]);
		request = requestFactory.addFilterRequest(request,'loginid',loginid,[]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.validateCoupon, request);
	}
	
	this.getUserWallet = function(loginid , restaurantId){
		var request = undefined;
		request = requestFactory.addFilterRequest(request,'loginId',loginid,[]);
		request = requestFactory.addFilterRequest(request,'restaurantId',restaurantId,[]);
		
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.userWallet, request);
	}
	
	return this;

}

function banquetService(processRequestService, requestFactory){
	this.submitPartyDetail = function(request){
		return processRequestService.processSimplePostRequest(apiContext.evfApi, endPoint.savePartyDetail, request);
	}
	return this;
}

function processRequestService($http){

	this.processAsyncRequest = function(apiContextName, endPointName, request ){
		
	}
	
	this.processSyncRequest = function(apiContextName, endPointName, request ){
			
	}

	this.processSimpleGetRequest = function(apiContextName, endPointName, request ){
		return $http.get( getApiUrl( apiContextName, endPointName ) , JSON.stringify(request));
	}
	
	this.processSimplePostRequest = function(apiContextName, endPointName, request ){
		return $http.post( getApiUrl( apiContextName, endPointName ) , JSON.stringify(request));
	}
	
	return this;
	
}

