// Note: Disabling and enabling to make bootstrap field validation work
jQuery(document).ready(function ($) {
  $(".show-recovery").click(function () {
    $("#login").hide();
    $("#passwordRecovery").show();
    $("#UserNameForgot").removeAttr("disabled");
    $("#UserName").attr({ "disabled": "disabled" });
    $("#Password").attr({ "disabled": "disabled" });
    $("#UserNameForgot").focus();
  });

  $(".hide-recovery").click(function () {
    $("#passwordRecovery").hide();
    $("#login").show();
    $("#UserNameForgot").attr({ "disabled": "disabled" });
    $("#UserName").removeAttr("disabled");
    $("#Password").removeAttr("disabled");
    $("#UserName").focus();
  });

  $("#login input[type='submit']").click(function () {
    if ($("#UserName").val() === "" || $("#Password").val() === "") {
      $("#credentialsError").show();
      return false;
    } else {
      $("#credentialsError").hide();
    }
  });
  
  $("#licenseOptionsLink").click(function () {
    $("#login").hide();
    $("#licenseOptions").show();
  });

  $("#licenseOptionsBack").click(function () {
    $("#licenseOptions").hide();
    $("#login").show();
  });

});