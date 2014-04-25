$(function(){
	var $document = $(document),
		$tabIndex = $("input[tabindex=1]"),
		$loginBox = $("#jsLoginBox"),
		$form = $loginBox.find("form"),
		$loading = $(".jsloading"),
		$defaultErrorMessage = $(".sc-notifications"),
		$mainAction = $("#jsMainAction");

    var login = function(e) {
		  e.preventDefault();
		  $.post($form.attr("action"), $form.serialize(), "json").always(cleanUpErrorMessages).error(errorLogin).done(doneLogin);
		},
		errorLogin = function(data) {
		  $defaultErrorMessage.removeClass("hidden");
		  $defaultErrorMessage.find(".default").removeClass("hidden");
		},
		doneLogin = function (d) {
		 var data = JSON.parse(d);
		  $defaultErrorMessage.addClass("hidden");
		  $defaultErrorMessage.find(".default").addClass("hidden");
		  if (data.Success) {
		      if (data.Message) {
		          $("#confirmationFieldset").show();
		          $("#mainFieldset").hide();
		          $("#confirmationMessage").text(data.Message);
		          $("#continueButton").click(function () {
		              window.location = data.Redirect;
		          });
		      } else {
		          window.location = data.Redirect;
		      }
			
		  } else {
		      if (data && data.Errors) {
		          renderError(data.Errors);
		      } else {
		          $defaultErrorMessage.removeClass("hidden").find(".default").removeClass("hidden");
		      }
		  }
		  hideLoading();
		},
		renderError = function(errors) {
			var globalErrors = [],
				errorsLength = errors.length || 0;

			for(var i=0; i < errorsLength; i++) {
				var error = errors[i];

				if (error["Parameter"]) {
				    var input = $("input[name='" + error["Parameter"] + "']");
					if(input) {
						if(!input.hasClass("error")) {
							input.addClass("error");
							input.parent().append("<p class='small error'><p>")
							input.parent().find("p.error").html(error["Message"]);
						} else {
							input.next().append("<br/>");
							input.next().append(error["Message"]);
						}
					} else {
					    globalErrors.push(error["Message"]);
					}
				} else {
				    globalErrors.push(error["Message"]);
				}
			}
			if(globalErrors.length > 0) {
				var globalErrorHtml = "<p class='error alert'>";
				for(var i=0; i < globalErrors.length; i++) {
					var globalMessage = globalErrors[i];
					globalErrorHtml += globalMessage;
					globalErrorHtml += "<br/>";
				}
				globalErrorHtml += "</p>";
				$defaultErrorMessage.append(globalErrorHtml);
				$defaultErrorMessage.removeClass("hidden");				
			}
		},
		cleanUpErrorMessages = function() {
			$defaultErrorMessage.addClass("hidden");
			$loginBox.find("p.error").not('.default').remove();
			$("input.error").removeClass("error");
		},
		showLoading = function(e) {
		  $loading.removeClass("hidden");
		},
		hideLoading = function(e) {
		  $loading.addClass("hidden");
		};

	$tabIndex && $tabIndex.focus();
	$document.ajaxStart(showLoading);
	$mainAction.on("click", login);
});