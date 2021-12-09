(function ($) {
  //Sort By Name
  $("#sortByNameDiv").on("click", function (e) {
    let isUp = $(this).attr("name") == "up";
    const data = {
      name: {
        current: true,
        up: isUp,
      },
      rating: {
        current: false,
        up: true,
      },
      time: {
        current: false,
        up: true,
      },
      ingredient: {
        current: false,
        up: true,
      },
    };
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(data),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Sort By Rating
  $("#sortByRatingDiv").on("click", function (e) {
    const isUp = $(this).attr("name") == "up";
    const data = {
      name: {
        current: false,
        up: true,
      },
      rating: {
        current: true,
        up: isUp,
      },
      time: {
        current: false,
        up: true,
      },
      ingredient: {
        current: false,
        up: true,
      },
    };
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(data),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Sort By Time
  $("#sortByTimeDiv").on("click", function (e) {
    const isUp = $(this).attr("name") == "up";
    const data = {
      name: {
        current: false,
        up: true,
      },
      rating: {
        current: false,
        up: true,
      },
      time: {
        current: true,
        up: isUp,
      },
      ingredient: {
        current: false,
        up: true,
      },
    };
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(data),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Sort By Ingredients
  $("#sortByIngredientDiv").on("click", function (e) {
    const isUp = $(this).attr("name") == "up";
    const data = {
      name: {
        current: false,
        up: true,
      },
      rating: {
        current: false,
        up: true,
      },
      time: {
        current: false,
        up: true,
      },
      ingredient: {
        current: true,
        up: isUp,
      },
    };
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(data),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });
})(window.jQuery);

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
$('.star-ratings').stars();