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
