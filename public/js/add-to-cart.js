$(document).on("click", "#add-to-cart", function() 
{
    var add_button = $(this);
    
    var action = add_button.data('action');
    var product_id = add_button.data('id');
    var quantity = $("#add-quantity").val();
    
    $.ajax({
        type: 'POST',
        url: action,
        data: JSON.stringify({"product_id": product_id, "product_quantity": quantity}),
        contentType: "application/json",
        dataType: 'json',
        success: function(data) { 
            console.log("OK");
            add_button.attr("disabled", true);
            // console.log("Cart is: " + data[0].CodArtigo);
        }
    });
});