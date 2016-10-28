'use strict';

angular.module('ds.checkout')

.service(
            'klarnaService',
            function( $http, $q ) {


                function parseCart(cartObject){
                	var cart = {
				    merchant_reference: {
				        orderid1: '',
				        orderid2: ''
				    },
				    purchase_country: 'se',
				    purchase_currency: 'sek',
				    locale: 'sv-se',
				    cart: {
				        items: []
				    }
				};

				cart.merchant_reference.orderid1 = cart.merchant_reference.orderid2 = cartObject.id;

                	for (var i = 0; i < cartObject.items.length; i ++) {
                		cart.cart.items.push(
                			{
					            reference: cartObject.id,
					            name: cartObject.items[i].product.id,
					            quantity: cartObject.items[i].quantity,
					            ean: cartObject.items[i].product.id,
					            uri: 'http://weizhen.me:9000/#!/products/' + cartObject.items[i].product.id,
					            image_uri: cartObject.items[i].product.images[0].url,
					            unit_price: cartObject.items[i].price.effectiveAmount,
					            discount_rate: 0,
					            tax_rate: parseInt(cartObject.items[i].price.effectiveAmount * 0.25, 10)
					        }
                		);
                	}
                	return cart;
                }

                
                function submitKlarnaCart(cartObject) {
                	var body = parseCart(cartObject);
                	var request = $http({
                        method: 'post',
                        url: 'api/klarnacall',
                        params: {
                        },
                        data: body
                    });
                    return( request.then( klarnarRender, handleError ) );
                }

                function handleError( response ) {
 
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( 'An unknown error occurred.' ) );
                    }
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
                }

                function klarnarRender( response ) {
                    return( response.data );
                }

                return({submitKlarnaCart: submitKlarnaCart});
            }
        );