let ingAddButton = $("#addIng");
let qMeasure = $("#qMeasure");
let recipeForm = $("#recipe-form");
let quantity = $("#quantity");
let ingreInput = $("#ingredients");
let ingName = $("#ingName");
const url = "http://localhost:3000/ingredients/name/";
let showdiv = $("#showDiv");

$(document).ready(function () {
  ingAddButton.on("click", function (event) {
    let q = quantity.val().trim();
    let qm = qMeasure.val().trim();
    let iName = ingName.val().trim();
    let endpoint = url + iName;
    var configReq = {
      method: "GET",
      url: endpoint,
    };
    $.ajax(configReq).then(function (responseMessage) {
      r = responseMessage;

      ingObj = {};
      console.log(r);
      ingObj["id"] = r._id.toString();
      ingObj["quantity"] = q;
      ingObj["quantityMeasure"] = qm;
      showdiv.append(
        `<p>${ingObj.id} ${ingObj.quantity} ${ingObj.quantityMeasure}</p>`
      );
      $("#ingredients").val(ingObj);
      console.log(JSON.stringify(ingreInput.val()));
    });
  });
});
