(function ($) {
  const ingredientSearch = $("#ingredient-search-input");
  const ingredientCheckBox = $(".ingredient-check");
  const ingredientSuggestionCheckBox = $(".ingredient-check-suggestion");
  const allIngredientsDiv = $("#all-ingredients-div");
  const selectedIngredientsDiv = $("#selected-ingredients-div");
  const selectedIngredientsModal = $("#selectedIngredientsModal");
  const ingredientToggleButtons = $("#ingredients-toggle-button");
  const url = "http://localhost:3000/";
  const toastDiv = $("#toast-div");
  const toastDivText = $("#toast-div-text");

  /* #region  Helper Functions */
  const checkProperString = (string, parameter) => {
    if (string == null || typeof string == undefined)
      throw `Error: Please pass a ${parameter}`;
    if (typeof string != "string") {
      throw `Error: ${parameter} Not a string`;
    }
    string = string.trim();
    if (string.length == 0) {
      throw `Error: ${parameter} Empty string`;
    }
  };
  /* #endregion */

  function getAllSelectedIngredients() {
    let currentIngredients = [];
    selectedIngredientsDiv.empty();
    atleastOne = true;
    $("input.ingredient-check:checkbox:checked").each(function () {
      atleastOne = true;
      const id = $(this).attr("name");
      const ingredientText = $(this).val();
      addToSelectedIngredientsList(id, ingredientText);
      currentIngredients.push(id);
    });
    if (!atleastOne) {
      selectedIngredientsDiv.append(
        $('<p class="text-center m-4">No ingredients selected</p>')
      );
    }
    return { ingredients: currentIngredients };
  }

  const showToast = (isError, text) => {
    toastDiv.removeClass("bg-danger");
    toastDiv.removeClass("bg-success");

    if (isError) toastDiv.addClass("bg-danger");
    else toastDiv.addClass("bg-danger");
    toastDivText.text(text);
    toastDiv.attr("hidden", false);
    setTimeout(function () {
      toastDiv.attr("hidden", true);
    }, 2000);
  };

  function addToSelectedIngredientsList(id, ingredientText) {
    try {
      checkProperString(id);
      checkProperString(ingredientText);
      selectedIngredientsDiv.append(
        $(
          `<div class="container p-3 selected-ingredient-delete border-bottom" name="${id}">
              <div class="row">
                  <div class="col-10">
                      <label>${ingredientText}</label>
                  </div>
                  <div class="col">
                      <i class="fas fa-trash fa-lg"></i>
                  </div>
              </div>
          </div>`
        )
      );
    } catch (e) {
      console.log(e);
    }
  }

  $(document).ready(function () {
    getAllSelectedIngredients();

    // Triggered when ingredients are clicked
    ingredientCheckBox.on("click", function (e) {
      const id = $(this).attr("name");
      const isChecked = $(this).prop("checked");
      $(`#check-suggestion-${id}`).prop("checked", isChecked);
      getAllSelectedIngredients();
    });

    // Triggered when Suggested ingredients are clicked
    ingredientSuggestionCheckBox.on("click", function (e) {
      const id = $(this).attr("name");
      const isChecked = $(this).prop("checked");
      $(`#check-${id}`).prop("checked", isChecked);
      getAllSelectedIngredients();
    });

    //Ingredient Toggle
    ingredientToggleButtons.on("click", function (e) {
      ingredientToggleButtons.empty();
      if (allIngredientsDiv.is(":visible")) {
        allIngredientsDiv.attr("hidden", true);
        selectedIngredientsDiv.attr("hidden", false);
        ingredientToggleButtons.append(
          '<i class="fas fa-th-large me-2"></i>All'
        );
      } else {
        selectedIngredientsDiv.attr("hidden", true);
        allIngredientsDiv.attr("hidden", false);
        ingredientToggleButtons.append(
          '<i class="far fa-list-alt me-2"></i>Added'
        );
      }
    });

    //Selected Ingredient delete
    $(document).on("click", ".selected-ingredient-delete", function () {
      const id = $(this).attr("name");
      $(`#check-${id}`).prop("checked", false);
      $(`#check-suggestion-${id}`).prop("checked", false);
      getAllSelectedIngredients();
    });

    //Search Ingredient Modal delete
    $(document).on("click", ".search-ingredient-div-delete", function () {
      const id = $(this).attr("name");
      $(`#check-${id}`).prop("checked", false);
      $(`#check-suggestion-${id}`).prop("checked", false);
      $(this).removeClass("search-ingredient-div-delete");
      $(this).addClass("search-ingredient-div-add");
      $(this).find("i").removeClass("fa-trash");
      $(this).find("i").addClass("fa-plus-circle");
      getAllSelectedIngredients();
    });

    //Search Ingredient Modal add
    $(document).on("click", ".search-ingredient-div-add", function () {
      const id = $(this).attr("name");
      $(`#check-${id}`).prop("checked", true);
      $(`#check-suggestion-${id}`).prop("checked", true);
      $(this).removeClass("search-ingredient-div-add");
      $(this).addClass("search-ingredient-div-delete");
      $(this).find("i").removeClass("fa-plus-circle");
      $(this).find("i").addClass("fa-trash");
      getAllSelectedIngredients();
    });

    //Search
    ingredientSearch.on("keyup", function (e) {
      $("#ingredient-search-results").empty();
      const serchText = $(this).val().toLowerCase();
      const deleteIcon = '<i class="fas fa-trash fa-lg"></i>';
      const addIcon = '<i class="fas fa-plus-circle fa-lg"></i>';
      ingredientCheckBox.each(function () {
        const id = $(this).attr("name");
        const name = $(this).val();
        const selected = $(this).is(":checked");
        if (name.toLowerCase().includes(serchText)) {
          const icon = selected ? deleteIcon : addIcon;
          const divClass = selected
            ? "search-ingredient-div-delete"
            : "search-ingredient-div-add";
          $("#ingredient-search-results").append(
            $(
              `<div class="container m-2 p-3 ${divClass}" name="${id}">
                <div class="row">
                    <div class="col-10">
                        <label>${name}</label>
                    </div>
                    <div class="col">
                    ${icon}
                    </div>
                </div>
            </div>`
            )
          );
        }
      });
    });

    $("#all-recipe").on("click", function (e) {
      let data = getAllSelectedIngredients();
      if (data.ingredients.length == 0) {
        showToast(true, "Please select atleast One ingredient");
        return;
      }
      data.random = false;
      $(document).ready(function () {
        $(`<form method="POST" action="${url}"></form>`)
          .append(
            $("<input>", {
              name: "ingredientsList",
              value: JSON.stringify(data),
              type: "hidden",
            })
          )
          .appendTo("body")
          .submit();
      });
    });

    $("#suggested-ingredients").on("click", function (e) {
      let data = getAllSelectedIngredients();
      if (data.ingredients.length == 0) {
        showToast(true, "Please select atleast One ingredient");
        return;
      }
      data.random = false;
      $(document).ready(function () {
        $(`<form method="POST" action="${url}"></form>`)
          .append(
            $("<input>", {
              name: "ingredientsList",
              value: JSON.stringify(data),
              type: "hidden",
            })
          )
          .appendTo("body")
          .submit();
      });
    });

    $("#random-recipe").on("click", function (e) {
      let data = getAllSelectedIngredients();
      if (data.ingredients.length == 0) {
        showToast(true, "Please select atleast One ingredient");
        return;
      }
      data.random = true;
      $(document).ready(function () {
        $(`<form method="POST" action="${url}"></form>`)
          .append(
            $("<input>", {
              name: "ingredientsList",
              value: JSON.stringify(data),
              type: "hidden",
            })
          )
          .appendTo("body")
          .submit();
      });
    });

    //search modal on open
    $("#searchIngredientsModal").on("shown.bs.modal", function () {
      ingredientSearch.focus();
    });

    //search modal on close
    $("#searchIngredientsModal").on("hidden.bs.modal", function () {
      ingredientSearch.val("");
      $("#ingredient-search-results").empty();
    });
  });
})(window.jQuery);
