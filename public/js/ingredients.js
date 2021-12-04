function getAllSelectedIngredientsAndSend() {
  let currentIngredients = [];
  $("input.ingredient-check:checkbox:checked").each(function () {
    currentIngredients.push($(this).attr("name"));
  });
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/ingredients/selected",
    data: { ingredients: currentIngredients },
  });
}

$(document).ready(function () {
  const ingredientSearch = $("#ingredient-search-input");
  const ingredientCheckBox = $(".ingredient-check");
  const ingredientSelectionForm = $("#ingredientSelectionForm");
  const searchDropDownDiv = $("#myDropdown");
  const clearIngredientsButton = $("#clear-ingredients");
  const selectedIngredientsModal = $("#selectedIngredientsModal");
  const selectedIngredientsModalBody = $(
    "#selectedIngredientsModal .modal-body"
  );

  //Clear all selected ingredients
  clearIngredientsButton.on("click", function () {
    $("input.ingredient-check:checkbox:checked").each(function () {
      $(this).prop("checked", false);
    });
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/ingredients/selected",
      data: { ingredients: [] },
    });
  });

  // Triggered when ingredients are selected
  ingredientCheckBox.on("click", getAllSelectedIngredientsAndSend);

  selectedIngredientsModal.on("show.bs.modal", function (e) {
    selectedIngredientsModalBody.empty();
    let atleastOne = false;
    $("input.ingredient-check:checkbox:checked").each(function () {
      atleastOne = true;
      const id = $(this).attr("name");
      const ingredientText = $(this).val();
      selectedIngredientsModalBody.append(
        $(
          `<div class="container m-2 p-3 selected-ingredient-delete" name="${id}">
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
    });
    if (!atleastOne) {
      selectedIngredientsModalBody.append(
        $('<p class="text-center m-3">No ingredients selected</p>')
      );
    }
  });

  //Selected Ingredient Modal delete
  $(document).on("click", ".selected-ingredient-delete", function () {
    const id = $(this).attr("name");
    $(`#check-${id}`).prop("checked", false);
    getAllSelectedIngredientsAndSend();
    $(this).remove();
    if (selectedIngredientsModalBody.children().length == 0)
      selectedIngredientsModalBody.append(
        $('<p class="text-center m-3">No ingredients selected</p>')
      );
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

  function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
});
