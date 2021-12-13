(function ($) {
  let sortData = {
      name: {
        current: true,
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
        current: false,
        up: true,
      },
    },
    filterData = {
      mealType: {
        current: false,
        name: "",
      },
      cuisine: {
        current: false,
        name: "",
      },
    };

  //Sort By Name
  $("#sortByNameDiv").on("click", function (e) {
    let isUp = $(this).attr("data-name") == "up";
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
    sortData = data;
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(data),
          type: "hidden",
        })
      )
      .append(
        $("<input>", {
          name: "filter",
          value: JSON.stringify(filterData),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Sort By Rating
  $("#sortByRatingDiv").on("click", function (e) {
    const isUp = $(this).attr("data-name") == "up";
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
    sortData = data;
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(data),
          type: "hidden",
        })
      )
      .append(
        $("<input>", {
          name: "filter",
          value: JSON.stringify(filterData),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Sort By Time
  $("#sortByTimeDiv").on("click", function (e) {
    const isUp = $(this).attr("data-name") == "up";
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
    sortData = data;
    $(`<form method="POST" action="//recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(data),
          type: "hidden",
        })
      )
      .append(
        $("<input>", {
          name: "filter",
          value: JSON.stringify(filterData),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Sort By Ingredients
  $("#sortByIngredientDiv").on("click", function (e) {
    const isUp = $(this).attr("data-name") == "up";
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
    sortData = data;
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(data),
          type: "hidden",
        })
      )
      .append(
        $("<input>", {
          name: "filter",
          value: JSON.stringify(filterData),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Filter By MealType
  $(".filter-mealType").on("click", function (e) {
    filterData.mealType.current = !filterData.mealType.current;
    filterData.mealType.name = $(this).attr("data-name");
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "filter",
          value: JSON.stringify(filterData),
          type: "hidden",
        })
      )
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(sortData),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Filter By Cuisine
  $(".filter-cuisine").on("click", function (e) {
    filterData.cuisine.current = !filterData.cuisine.current;
    filterData.cuisine.name = $(this).attr("data-name");
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "filter",
          value: JSON.stringify(filterData),
          type: "hidden",
        })
      )
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(sortData),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  //Clear Filter
  $("#clear-filter").on("click", function (e) {
    filterData.cuisine.current = false;
    filterData.cuisine.name = "";
    filterData.mealType.current = false;
    filterData.mealType.name = "";
    (sortData = {
      name: {
        current: true,
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
        current: false,
        up: true,
      },
    }),
      (filterData = {
        mealType: {
          current: false,
          name: "",
        },
        cuisine: {
          current: false,
          name: "",
        },
      });
    $(`<form method="POST" action="/recipes/all/filter"></form>`)
      .append(
        $("<input>", {
          name: "filter",
          value: JSON.stringify(filterData),
          type: "hidden",
        })
      )
      .append(
        $("<input>", {
          name: "sort",
          value: JSON.stringify(sortData),
          type: "hidden",
        })
      )
      .appendTo("body")
      .submit();
  });

  $(".recipe-card-img").on("error", function (e) {
    $(this).attr("src", "/public/images/default-recipe.png");
  });
})(window.jQuery);

$.fn.stars = function () {
  // return this.each(function(i,e){$(e).html($('<span/>').width($(e).text()*16));});
  this.each(function (i, e) {
    var score = $(e).text();
    $(e).html("");
    $(e).raty({
      path: "/public/images",
      halfShow: true,
      readOnly: true,
      score: score,
    });
  });
};
$(".star-ratings").stars();
