let ingAddButton = $("#addIng");
let qMeasure = $("#qMeasure");
let recipeForm = $("#recipe-form");
let quantity = $("#quantity");
let ingreInput = $("#ingredients");
let ingName = $("#ingName");
const url = "http://localhost:3000/ingredients/name/";
let showdiv = $("#showDiv");

$('.raty').raty({
  path: '/public/images',
  scoreName: 'rating'
});
// $('input[name="rating"]').attr('required', true);
// $('input[name="rating"]').attr('value', 5);

// $('.rating').raty({ readOnly: true, score: 3 });
$.fn.ratings = function () {
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
$('.rating').ratings();

const toastDiv = $("#toast-div");
const toastDivText = $("#toast-div-text");

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
    if ($('#userId').length > 0 && $('#userId').val().length > 0) {
    } else {
      e.preventDefault();
      showToast(true, "Please login first before submitting the review");
      return false;
    }
    if ($('input[name="rating"]').length > 0 && $('input[name="rating"]').val().length > 0) {      
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

  const showCommentForm = (reviewId) => {
    if ($('#userId-' + reviewId).length > 0 && $('#userId-' + reviewId).val().length > 0) {
      $('#comment-form-' + reviewId).attr("hidden", false);
    } else {
      // e.preventDefault();
      showCommentToast(reviewId, "Please login first before submitting the comment");
      // return false;
    }
    // return;
  };

});

function showCommentToast(reviewId, text) {
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
  if ($('#userId-' + reviewId).length > 0 && $('#userId-' + reviewId).val().length > 0) {
    $('#comment-form-' + reviewId).attr("hidden", false);
  } else {
    // e.preventDefault();
    showCommentToast(reviewId, "Please login first before submitting the reply");
    // return false;
  }
}

function hideCommentForm(reviewId) {
  $('#comment-form-' + reviewId).attr("hidden", true);
  return false;
}