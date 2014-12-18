/*price range*/

 $('#sl2').slider();

	var RGBChange = function() {
	  $('#RGB').css('background', 'rgb('+r.getValue()+','+g.getValue()+','+b.getValue()+')')
	};	
		
/*scroll to top*/

$(document).ready(function(){
	$(function () {
		$.scrollUp({
	        scrollName: 'scrollUp', // Element ID
	        scrollDistance: 300, // Distance from top/bottom before showing element (px)
	        scrollFrom: 'top', // 'top' or 'bottom'
	        scrollSpeed: 300, // Speed back to top (ms)
	        easingType: 'linear', // Scroll to top easing (see http://easings.net/)
	        animation: 'fade', // Fade, slide, none
	        animationSpeed: 200, // Animation in speed (ms)
	        scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
					//scrollTarget: false, // Set a custom target element for scrolling to the top
	        scrollText: '<i class="fa fa-angle-up"></i>', // Text for element, can contain HTML
	        scrollTitle: false, // Set a custom <a> title if required.
	        scrollImg: false, // Set true to use image
	        activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
	        zIndex: 2147483647 // Z-Index for the overlay
		});
	});
});

$(document).on("click", ".add-to-cart-inline", function(event) 
{
    event.preventDefault();

    var add_button = $(this);
    
    var action = add_button.data('action');
    var product_id = add_button.data('id');
    var quantity = 1;
    
    // disable button as soon as we send a request
    add_button.removeClass("add-to-cart-inline");
    add_button.text('Added to cart!');
    
    $.ajax({
        type: 'POST',
        url: action,
        data: JSON.stringify({"product_id": product_id, "product_quantity": quantity}),
        contentType: "application/json",
        dataType: 'json',
        success: function(data) { 
            console.log(data);
            
            var cart_dropdown = $("#cart-dropdown");
            var product = "";
            
            product += "<li role='presentation'>";
            product += "<a style='color: #FE980F;'> Product added! </a>";
            product += "</li>";

            cart_dropdown.append(product);
        }
    });
});

function printArea(divName) {
     var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;
     window.print();
     document.body.innerHTML = originalContents;
}
