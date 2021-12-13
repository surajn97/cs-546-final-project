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

let rname = $("#name");
let cuisine = $("#cuisine");
let instruction = $("#instructions");

$(".raty").raty({
  path: "/public/images",
  scoreName: "rating",
});

$(document).ready(function () {
  let ingCount = 0;
  let allDataStorev = mealtypestore.val();
  console.log(`mealType: ${allDataStorev}`);
  $("#mealType").val(allDataStorev);
  $("#name").value;

  let tablenbody = $(`<table class="table" id="table"><tbody id='tbody'>`);
  let tablenbodyend = $(`</tbody></table>`);
  let ingArray = JSON.parse(ingreInput.val());

  for (index in ingArray) {
    let element = ingArray[index];
    let tr = $(`<tr id="tr${ingCount}">`);
    tr.append(
      `<td id="idname${ingCount}">${element.name}</td>
        <td> ${element.quantity} ${element.quantityMeasure}</td>
        <td>`
    );
    let removeicon = $(`<i class="fas fa-lg fa-trash" id="remove${ingCount}">`);
    tr.append(removeicon);
    tr.append(
      `</i></td>
        </tr>`
    );
    tablenbody.append(tr);
    showdiv.append(tablenbody);
    showdiv.append(tablenbodyend);
    ingCount = ingCount + 1;
    removeicon.on("click", function (event) {
      let id = $(this).attr("id");
      let arrid = id.split("remove")[1];
      let rIngNametd = "idname" + arrid;
      let rIngName = $(`#${rIngNametd}`);
      let ingName = rIngName.html();

      let trid = "tr" + arrid;
      let trele = $(`#${trid}`);
      trele.remove();

      let ingArray = JSON.parse(ingreInput.val());
      index = ingArray.findIndex(x => x.name === ingName);
      ingArray.splice(index, 1);

      $("#ingredients").val(JSON.stringify(ingArray));
    });
  }

  ingAddButton.on("click", function (event) {
    ingCount = ingCount + 1;
    ingArray = JSON.parse(ingreInput.val());
    let q = quantity.val().trim();
    let qm = qMeasure.val().trim();
    let iName = ingName.val().trim();
    if (!q || !iName || qm == "") {
      alert(" Please enter proper values for the ingredient to add");
      return;
    }

    ingObj = {};
    ingObj["name"] = iName;
    ingObj["quantity"] = q;
    ingObj["quantityMeasure"] = qm;

    tr = $(`<tr id="tr${ingCount}">`);
    tr.append(
      `<td id="idname${ingCount}">${iName}</td>
        <td> ${q} ${qm}</td>
        <td>`
    );

    removeicon = $(`<i class="fas fa-lg fa-trash" id="remove${ingCount}">`);
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
      let id = $(this).attr("id");
      let arrid = id.split("remove")[1];
      let rIngNametd = "idname" + arrid;
      let rIngName = $(`#${rIngNametd}`);
      let ingName = rIngName.html();

      let trid = "tr" + arrid;
      let trele = $(`#${trid}`);
      trele.remove();

      let ingArray = JSON.parse(ingreInput.val());
      index = ingArray.findIndex(x => x.name === ingName);
      ingArray.splice(index, 1);

      $("#ingredients").val(JSON.stringify(ingArray));
    });
  });
});

$("#recipe-form").submit(function (event) {
  let finIngValue = ingreInput.val();
  let name = rname.val().trim();
  let rcuisine = cuisine.val().trim();
  let rinstruction = instruction.val().trim();
  if (finIngValue == "[]") {
    alert("Add Ingredients to the recipe");
    return false;
  }
  if (!name || !rcuisine || !rinstruction) {
    alert("Please pass all the inputs");
    return false;
  }
});
