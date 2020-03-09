/**
 * 
 */

var AppDirectives = angular.module('SwaahanApp');

//Shopping Cart Add to Cart Directive
AppDirectives.directive('addToCart',function() {
	return {
		restrict : 'E',
		controller : 'ShoppingCartController',
		transclude : true,
		 scope: {
			 pagetype : "=",
			 restaurantdetail : "=",
			 voucherparent: "=",
			 vouchertype: "=",
			 voucher : "="
	        },
		templateUrl : 'callcenter/shoppingcart/addtocart.html',
		 link: function (scope, element, attrs) {
			 var resortVoucherTypes = ['dayvoucher','roomvoucher','generalvoucher'];
			 scope.attrs = attrs;
			 scope.voucherDetails = {};
			 scope.voucherDetails.pagetype = scope.pagetype;
			 scope.voucherDetails.restaurantdetail = scope.restaurantdetail;
			 scope.voucherDetails.vouchertype = scope.vouchertype;
			 scope.voucherDetails.voucher = scope.voucher;
			 scope.voucherDetails.voucherparent = scope.voucherparent;
			 
			 if(resortVoucherTypes.indexOf(scope.vouchertype)>=0)
				 scope.voucherDetails.cartFor = 'resort';
			 else
				 scope.voucherDetails.cartFor = 'restaurant';
			 
			 if(scope.vouchertype === 'offer'){
				 if(scope.voucher.voucherType.indexOf("generalVoucher") > -1){
					 scope.voucherDetails.vouchertype = "generalvoucher";
				 }
			 }
		 }
	};
});

AppDirectives.directive('buffetsList',function(){
    return {
        restrict : 'E',
        controller : 'CustomDirectiveController',
        templateUrl: 'callcenter/customdirectives/buffets.html',
        scope: {
        	pagetype : "@",
        	restaurantdetail : "=",
        	buffets: "=",
        	vouchertype:"@",
        	voucherparent:"=",
        	showserving:"@",
        	showrestnameandarea: "@"
        },
        link:function(scope, element, attrs){
        	scope.attrs=attrs;
        }
    };
});

AppDirectives.directive('proceedToBook',function(){
    return {
        restrict : 'E',
        controller : 'ShoppingCartController',
        templateUrl: 'callcenter/shoppingcart/proceedtobook.html',
        link:function($scope, element, attrs){
        	$scope.attrs=attrs;
        }
    };
});

AppDirectives.directive('voucherAddPanel',function(){
    return {
        restrict : 'E',
        controller : 'ShoppingCartController',
        templateUrl: 'callcenter/shoppingcart/cartpanel.html',
        link:function($scope, element, attrs){
        	$scope.attrs = attrs;
        }
    };
});