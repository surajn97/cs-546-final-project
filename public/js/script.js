$.fn.stars = function() {
    // return this.each(function(i,e){$(e).html($('<span/>').width($(e).text()*16));});
    this.each(function (i, e) {
        var score = $(e).text();
        $(e).html("");
        $(e).raty({
          path: '/public/images',
          halfShow: true,
          readOnly: true,
          score: score
        });
      });
};
$('.ratings').stars();

// $('.raty').raty({ path: '/public/images', scoreName: 'rating' });
// $('input[name="rating"]').attr('required', true);
// $('input[name="rating"]').attr('value', 5);

(function ($) {
    
})(window.jQuery);

function favoriteRecipe(recipeId) {
    var checkbox = $("#favorite_" + recipeId);
    var isChecked = checkbox.is(':checked');
    $.ajax({
        type: "POST",
        url: "/recipes/favorite/" + recipeId,
        // data: frm.serialize(),
        beforeSend: function () {
            
        },
        success: function (response) {            
        },
        error: function (error) {
            if(error['responseJSON']['error'] == "Unauthorized") {
                // alert("Please login first to favorite the review");
                // alert("isChecked: " + isChecked);
                var myModal = new bootstrap.Modal(document.getElementById('loginAlertModal'));
                myModal.show();
            }
            document.getElementById("favorite_" + recipeId).checked = !isChecked;            
        }
      });
}