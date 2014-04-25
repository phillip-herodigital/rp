/******************************************************
* Validator
******************************************************/

if (typeof Sitecore === 'undefined') {
    var Sitecore = new Object();
}

if (typeof Sitecore.Wfm === 'undefined') {
    Sitecore.Wfm = new Object();
}


Sitecore.Wfm.Validator = function() {
}

Sitecore.Wfm.Validator._instance = null;

Sitecore.Wfm.Validator.getInstance = function() {

    if (Sitecore.Wfm.Validator._instance == null) {
        Sitecore.Wfm.Validator._instance = new Sitecore.Wfm.Validator();
    }

    return Sitecore.Wfm.Validator._instance;
}

Sitecore.Wfm.Validator.ValidateCardType = function(obj, args, cardType) {
    var cardType = Sitecore.Wfm.getCssValue(obj, "cardTypeValue");
    var validationExpression = Sitecore.Wfm.getCssValue(obj, "validationExpression");

    var fieldItem = Sitecore.Wfm.getAttributeAncestor(obj, "fieldid", true);
    if (fieldItem != null) {
        var id = fieldItem.id;

        var CardType = Sitecore.Wfm.getAttributeDescendant(fieldItem, "cardType.");

        if (CardType != null && CardType.getValue() == cardType) {
            var regex = new RegExp(unescape(validationExpression), "g")
            var regex2 = new RegExp(unescape(unescape(validationExpression)), "g")
            args.IsValid = regex.test(args.Value) || regex2.test(args.Value);
            return;
        }
    }
    args.IsValid = true;
}


Sitecore.Wfm.Validator.ValidatePasswordConfirmation = function(obj, args) {
}

Sitecore.Wfm.Validator.NumberRange = function(obj, args) {

    var ctrl = $(obj);
    var min = Sitecore.Wfm.getCssValue(ctrl, 'minimum');
    var max = Sitecore.Wfm.getCssValue(ctrl, "maximum");

    if (min.toString() != 'NaN' && max.toString() != 'NaN') {
        if (args != null && args.Value != null && args.Value != "") {
            if (max != null && max != "" && min != null && min != "") {
                max = parseFloat(max);
                min = parseFloat(min);

                var value = parseFloat(args.Value);
                if (value.toString() != 'NaN' && !(max >= value && value >= min)) {
                    args.IsValid = false;
                    return;
                }
            }
        }
    }

    args.IsValid = true;
}

Sitecore.Wfm.Validator.DateRange = function(obj, args) {

    var ctrl = $(obj);

    var min = Sitecore.Wfm.getCssValue(ctrl, 'startdate');
    var max = Sitecore.Wfm.getCssValue(ctrl, "enddate");

    var year = $(ctrl.controltovalidate + "_year").getValue();
    var month = $(ctrl.controltovalidate + "_month").getValue();
    var day = $(ctrl.controltovalidate + "_day").getValue();

    var value = '';

    if (year.length == 2) {
        value += "20" + year;
    } else {
        value += year;
    }

    if (month.length == 1) {
        value += "0" + month;
    } else {
        value += month;
    }

    if (day.length == 1) {
        value += "0" + day;
    } else {
        value += day;
    }

    value += "T120000";

    if (args != null && args.Value != null && args.Value != "") {
        if (max != null && max != "" && min != null && min != "") {

            if (!(max >= value && value >= min)) {
                args.IsValid = false;
                return;
            }
        }
    }

    args.IsValid = true;
}

Sitecore.Wfm.Validator.SetFocusToFirstNotValid = function(validationGroup)
{
    if (typeof (Page_ClientValidate) == 'function' && !(typeof Page_Validators === 'undefined')) {   
        var i;
        Page_InvalidControlToBeFocused = null;
        for (i = 0; i < Page_Validators.length; i++) { 
          var val = Page_Validators[i];
          ValidatorValidate(val, validationGroup, null);
          if (!val.isvalid){
              ValidatorSetFocus(val, null);
              $scw(window).scrollTop($scw("#" + val.controltovalidate).position().top);
            return false;
          }
        } 
   }
   
   return true;
}