(function ($) {
  const ingredientSearch = $("#ingredient-search-input");
  const ingredientCheckBox = $(".ingredient-check");
  const allIngredientsDiv = $("#all-ingredients-div");
  const selectedIngredientsDiv = $("#selected-ingredients-div");
  const clearIngredientsButton = $("#clear-ingredients");
  const selectedIngredientsModal = $("#selectedIngredientsModal");
  const ingredientToggleButtons = $("#ingredients-toggle-button");

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

  function getAllSelectedIngredientsAndSend() {
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
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/ingredients/selected",
      data: { ingredients: currentIngredients },
    });
  }

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
    //Clear all selected ingredients
    clearIngredientsButton.on("click", function () {
      $("input.ingredient-check:checkbox:checked").each(function () {
        $(this).prop("checked", false);
      });
      selectedIngredientsDiv.empty();
      selectedIngredientsDiv.append(
        $('<p class="text-center m-4">No ingredients selected</p>')
      );
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/ingredients/selected",
        data: { ingredients: [] },
      });
      // Snackbar.show({
      //   text: "Example notification text.",
      //   pos: "bottom-center",
      // });
    });

    // Triggered when ingredients are clicked
    ingredientCheckBox.on("click", getAllSelectedIngredientsAndSend);

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
      getAllSelectedIngredientsAndSend();
      // $(this).remove();
      // if (selectedIngredientsModalBody.children().length == 0)
      //   selectedIngredientsModalBody.append(
      //     $('<p class="text-center m-3">No ingredients selected</p>')
      //   );
    });

    //Search Ingredient Modal delete
    $(document).on("click", ".search-ingredient-div-delete", function () {
      const id = $(this).attr("name");
      $(`#check-${id}`).prop("checked", false);
      $(this).removeClass("search-ingredient-div-delete");
      $(this).addClass("search-ingredient-div-add");
      $(this).find("i").removeClass("fa-trash");
      $(this).find("i").addClass("fa-plus-circle");
      getAllSelectedIngredientsAndSend();
    });

    //Search Ingredient Modal add
    $(document).on("click", ".search-ingredient-div-add", function () {
      const id = $(this).attr("name");
      $(`#check-${id}`).prop("checked", true);
      $(this).removeClass("search-ingredient-div-add");
      $(this).addClass("search-ingredient-div-delete");
      $(this).find("i").removeClass("fa-plus-circle");
      $(this).find("i").addClass("fa-trash");
      getAllSelectedIngredientsAndSend();
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

    //search modal on close
    $("#searchIngredientsModal").on("hidden.bs.modal", function () {
      ingredientSearch.val("");
      $("#ingredient-search-results").empty();
    });
  });
})(window.jQuery);
