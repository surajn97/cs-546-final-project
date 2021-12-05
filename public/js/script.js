$.fn.stars = function() {
    return this.each(function(i,e){$(e).html($('<span/>').width($(e).text()*16));});
};
$('.stars').stars();