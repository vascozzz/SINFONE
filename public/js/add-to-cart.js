$(document).on("click", "#add-to-cart", function() 
{
    var add_button = $(this);
    
    var action = add_button.data('action');
    var product_id = add_button.data('id');
    var quantity = $("#add-quantity").val();
    
    // disable button as soon as we send a request
    add_button.attr("disabled", true);
    
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
            
            var alerts = $(".alerts");
            var alert = "";
            
            alert += '<div class="alert alert-info alert-dismissable" role="alert">';
            alert += '<strong>Product added to cart.</strong>';
            alert += '<button type="button" class="close" data-dismiss="alert">';
            alert += '<span aria-hidden="true">&times;</span>';
            alert += '<span class="sr-only">Close</span>';
            alert += '</button>';
            alert += '</div>';
            
            alerts.append(alert);
            
            window.setTimeout(function() {
                alerts.fadeTo(500, 0).slideUp(500, function(){
                  // $(this).remove();
                });
            }, 1500);
        }
    });
});