define([], function () {
    var MathHelper = {
        divide: function (numerator, denominator, decimals) {
            var result;

            if (MathHelper.isZero(denominator)) {
                return null;
            } else {
                result = (numerator / denominator);
                if (decimals) {
                    result = parseFloat(result.toFixed(decimals));
                }
                return result;
            }
        },

        percentage: function (num1, num2) {
            return parseFloat((new Number(MathHelper.divide(num1, num2)) * 100).toFixed(2));
        },

        isZero: function (n) {
            n = +n;
            if (!n) {
                return true;
            }
            return false;
        }
    };

    return MathHelper;
});