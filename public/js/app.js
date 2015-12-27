$(document).ready(function () {
    $.validator.addMethod("regex", (value, element, regexpr) => regexpr.test(value), "Please enter a valid email.");

    $("#feedback-form").validate({
        rules: {
            name: "required",
            email: {
                required: true,
                regex: /^\w{2}.*@\w{3}.*\.\w{2}.*$/
            },
            favoriteFeature: "required"
        },
        errorPlacement: (error, element) => {
            let parentElement;
            if (element.attr("type") === "radio") {
                parentElement = $("#favorite-feature-title");
            } else {
                parentElement = element.parent();
            }
            parentElement.addClass("form-control-error");
        },
        success: (label, element) => {
            let parentElement;
            if ($(element).attr("type") === "radio") {
                parentElement = $("#favorite-feature-title");
            } else {
                parentElement = $(element).parent();
            }
            parentElement.removeClass("form-control-error");
        }
    });
});