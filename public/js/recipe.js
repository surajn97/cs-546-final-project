let ingAddButton = $("#addIng");
let qMeasure = $("#qMeasure");
let recipeForm = $("#recipe-form");
let quantity = $("#quantity");
let ingreInput = $("#ingredients");
let ingName = $("#ingName");
const url = "http://localhost:3000/ingredients/name/";
let showdiv = $("#showDiv");
let errorP = $("#error");

let rname = $("#name");
let cuisine = $("#cuisine");
let instruction = $("#instructions");

$(".raty").raty({
  path: "/public/images",
  scoreName: "rating",
});

$.fn.ratings = function () {
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
$(".rating").ratings();

const toastDiv = $("#toast-div");
const toastDivText = $("#toast-div-text");

$(document).ready(function () {
  let ingCount = 0;
  let tablenbody = $(`<table class="table" id="table"><tbody id='tbody'>`);
  let tablenbodyend = $(`</tbody></table>`);

  ingAddButton.on("click", function (event) {
    ingCount = ingCount + 1;
    let q = quantity.val().trim();
    let qm = qMeasure.val().trim();
    let iName = ingName.val().trim();
    let ingArray = JSON.parse(ingreInput.val());
    if (!q || !iName || qm == "") {
      alert(" Please enter proper values for the ingredient to add");
      return;
    }

    ingObj = {};
    ingObj["name"] = iName;
    ingObj["quantity"] = q;
    ingObj["quantityMeasure"] = qm;

    let tr = $(`<tr id="tr${ingCount}">`);
    tr.append(
      `<td id="idname${ingCount}">${iName}</td>
        <td> ${q} ${qm}</td>
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

    // let endpoint = url + iName;
    // var configReq = {
    //   method: "GET",
    //   url: endpoint,
    // };
    // $.ajax(configReq)
    //   .done(function (responseMessage) {
    //     callings(responseMessage);
    //   })
    //   .fail(function () {
    //     let data = {};
    //     data.name = iName;
    //     data.category = "UserGenerated";
    //     $.ajax({
    //       method: "POST",
    //       url: "http://localhost:3000/ingredients/",
    //       data: data,
    //     })
    //       .done(function (responseMessage) {
    //         alert(responseMessage);
    //         let b = responseMessage;
    //         callings(b);
    //       })
    //       .fail(function (responseMessage) {
    //         alert(`responseMessage: ${responseMessage}`);
    //       });
    //   });

    // function callings(r) {

    //   console.log(ingreInput);
    // }
  });

  const showToast = (isError, text) => {
    toastDiv.removeClass("bg-danger");
    toastDiv.removeClass("bg-success");

    if (isError) toastDiv.addClass("bg-danger");
    else toastDiv.addClass("bg-danger");
    toastDivText.text(text);
    toastDiv.attr("hidden", false);
    setTimeout(function () {
      toastDiv.attr("hidden", true);
    }, 5000);
  };

  $("#review-form").on("submit", function (e) {
    if ($("#userId").length > 0 && $("#userId").val().length > 0) {
    } else {
      e.preventDefault();
      showToast(true, "Please login first before submitting the review");
      return false;
    }
    if (!$("#reviewText").val().replace(/\s/g, "").length) {
      e.preventDefault();
      showToast(true, "Review contains only white spaces!");
      return false;
    }
    if (
      $('input[name="rating"]').length > 0 &&
      $('input[name="rating"]').val().length > 0
    ) {
    } else {
      e.preventDefault();
      showToast(true, "Please rate the recipe");
      return false;
    }
    return;
  });

  const showCommentToast = (reviewId, text) => {
    const toastDivComment = $("#toast-div-" + reviewId);
    toastDivComment.removeClass("bg-success");
    toastDivComment.addClass("bg-danger");
    toastDivText.text(text);
    toastDivComment.attr("hidden", false);
    setTimeout(function () {
      toastDivComment.attr("hidden", true);
    }, 5000);
  };

  const showCommentForm = reviewId => {
    if (
      $("#userId-" + reviewId).length > 0 &&
      $("#userId-" + reviewId).val().length > 0
    ) {
      $("#comment-form-" + reviewId).attr("hidden", false);
    } else {
      // e.preventDefault();
      showCommentToast(
        reviewId,
        "Please login first before submitting the comment"
      );
      // return false;
    }
    // return;
  };
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

function showCommentToast(reviewId, text) {
  // alert("text:" + text);
  const toastDivComment = $("#toast-div-" + reviewId);
  const toastDivText = $("#toast-div-text-" + reviewId);
  toastDivComment.removeClass("bg-success");
  toastDivComment.addClass("bg-danger");
  toastDivText.text(text);
  toastDivComment.attr("hidden", false);
  setTimeout(function () {
    toastDivComment.attr("hidden", true);
  }, 5000);
}

function showCommentForm(reviewId) {
  if (
    $("#userId-" + reviewId).length > 0 &&
    $("#userId-" + reviewId).val().length > 0
  ) {
    $("#comment-form-" + reviewId).attr("hidden", false);
  } else {
    // e.preventDefault();
    showCommentToast(
      reviewId,
      "Please login first before submitting the reply"
    );
    // return false;
  }
}

function hideCommentForm(reviewId) {
  $("#comment-form-" + reviewId).attr("hidden", true);
  return false;
}

function checkCommentInput(reviewId) {
  if (
    !$("#comment-" + reviewId)
      .val()
      .replace(/\s/g, "").length
  ) {
    showCommentToast(reviewId, "Comment contains only white spaces!");
    return false;
  }
}

function likeReview(reviewId) {
  $.ajax({
    type: "POST",
    url: "/reviews/like/" + reviewId,
    // data: frm.serialize(),
    beforeSend: function () {},
    success: function (response) {
      var resp = "";
      // alert(JSON.stringify(response));
      var total_likes = parseInt(response["likes"]);
      if (total_likes >= 0)
        $("#likes-" + reviewId).html(
          '<span class="badge bg-success">' + total_likes + "</span>"
        );
      else
        $("#likes-" + reviewId).html(
          '<span class="badge bg-danger">' + total_likes + "</span>"
        );
    },
    error: function (error) {
      showCommentToast(reviewId, error["responseJSON"]["error"]);
      // alert("Error:" + JSON.stringify(error));
    },
  });
}

function dislikeReview(reviewId) {
  $.ajax({
    type: "POST",
    url: "/reviews/dislike/" + reviewId,
    // data: frm.serialize(),
    beforeSend: function () {},
    success: function (response) {
      var resp = "";
      // $('likes-' + reviewId).html(response.likes);
      // alert(JSON.stringify(response));
      var total_likes = parseInt(response["likes"]);
      if (total_likes >= 0)
        $("#likes-" + reviewId).html(
          '<span class="badge bg-success">' + total_likes + "</span>"
        );
      else
        $("#likes-" + reviewId).html(
          '<span class="badge bg-danger">' + total_likes + "</span>"
        );
      // alert(response);
    },
    error: function (error) {
      showCommentToast(reviewId, error["responseJSON"]["error"]);
      // alert("Error:" + JSON.stringify(error));
    },
  });
}
