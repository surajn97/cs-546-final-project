let ingAddButton = $("#addIng");
let qMeasure = $("#qMeasure");
let recipeForm = $("#recipe-form");
let quantity = $("#quantity");
let ingreInput = $("#ingredients");
let ingName = $("#ingName");
const url = "http://localhost:3000/ingredients/name/";
let showdiv = $("#showDiv");
let mealType = $("#mealType");
let mealtypestore = $("#mealtypestore");

$(".raty").raty({
  path: "/public/images",
  scoreName: "rating",
});

$(document).ready(function () {
  let allDataStorev = mealtypestore.val();
  console.log(`mealType: ${allDataStorev}`);
  $("#mealType").val(allDataStorev);
  $("#name").value;

  let tablenbody = $(`<table class="table" id="table"><tbody id='tbody'>`);
  let tablenbodyend = $(`</tbody></table>`);
  let ingArray = JSON.parse(ingreInput.val());

  for (index in ingArray) {
    let element = ingArray[index];
    let tr = $(`<tr id="tr${index}">`);
    tr.append(
      `<td>${element.name}</td>
        <td> ${element.quantity} ${element.quantityMeasure}</td>
        <td>`
    );
    let removeicon = $(`<i class="fas fa-lg fa-trash" id="remove${index}">`);
    tr.append(removeicon);
    tr.append(
      `</i></td>
        </tr>`
    );
    tablenbody.append(tr);
    showdiv.append(tablenbody);
    showdiv.append(tablenbodyend);
    removeicon.on("click", function (event) {
      var id = $(this).attr("id");
      let arrid = id.split("remove")[1];
      let trid = "tr" + arrid;
      let trele = $(`#${trid}`);
      trele.remove();

      let ingArray = JSON.parse(ingreInput.val());
      ingArray.splice(id, 1);

      $("#ingredients").val(JSON.stringify(ingArray));
    });
  }

  ingAddButton.on("click", function (event) {
    ingArray = JSON.parse(ingreInput.val());
    let q = quantity.val().trim();
    let qm = qMeasure.val().trim();
    let iName = ingName.val().trim();

    ingObj = {};
    ingObj["name"] = iName;
    ingObj["quantity"] = q;
    ingObj["quantityMeasure"] = qm;

    tr = $(`<tr id="tr${ingArray.length}">`);
    tr.append(
      `<td>${iName}</td>
        <td> ${q} ${qm}</td>
        <td>`
    );

    removeicon = $(
      `<i class="fas fa-lg fa-trash" id="remove${ingArray.length}">`
    );
    tr.append(removeicon);
    tr.append(
      `</i></td>
        </tr>`
    );
    tablenbody.append(tr);
    showdiv.append(tablenbody);
    showdiv.append(tablenbodyend);

    ingArray.push(ingObj);
    let inputIngFInalValue = JSON.stringify(ingArray);
    $("#ingredients").val(inputIngFInalValue);
    removeicon.on("click", function (event) {
      var id = $(this).attr("id");
      let arrid = id.split("remove")[1];
      let trid = "tr" + arrid;
      let trele = $(`#${trid}`);
      trele.remove();

      let ingArray = JSON.parse(ingreInput.val());
      ingArray.splice(id, 1);

      $("#ingredients").val(JSON.stringify(ingArray));
    });
  });
});
