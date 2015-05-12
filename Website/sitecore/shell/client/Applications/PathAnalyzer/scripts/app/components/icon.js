/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
"use strict";
define(["require", "exports"], function(require, exports) {
    var Icon = (function () {
        function Icon(el, w, h, iconWidth, iconHeight) {
            this.el = el;
            this.w = w;
            this.h = h;
            this.iconWidth = iconWidth;
            this.iconHeight = iconHeight;
            this.barCount = 5;
            this.thickness = this.iconWidth / 10;
            // size of the envelope effect (top right corner)
            this.topRightCornerSize = this.iconWidth / 4;
            this.topPixelAdjustment = this.thickness / 2;
            this.bottomPixAdjustment = this.thickness / 10;
            // inner bars
            this.innerBarPadding = this.thickness / 2;
            this.innerBarX = this.w / 2 - this.iconWidth / 2 + this.thickness + this.innerBarPadding * 2;
            this.innerBarY = this.h - this.thickness * 2 - this.innerBarPadding * 2;
            this.innerBarWidth = this.iconWidth / 2 + this.thickness;
            this.topInnerBarWidth = this.innerBarWidth - this.topRightCornerSize + this.innerBarPadding;
            this.spacing = this.thickness * (1.7 + (this.iconHeight - this.iconWidth) * 0.02);
            this.pathinfo = [
                { x: this.w / 2 + this.iconWidth / 2 - this.topRightCornerSize + this.topPixelAdjustment, y: this.h / 2 - this.iconHeight / 2 },
                { x: this.w / 2 - this.iconWidth / 2, y: this.h / 2 - this.iconHeight / 2 },
                { x: this.w / 2 - this.iconWidth / 2, y: this.h / 2 + this.iconHeight / 2 },
                { x: this.w / 2 + this.iconWidth / 2, y: this.h / 2 + this.iconHeight / 2 },
                { x: this.w / 2 + this.iconWidth / 2, y: this.h / 2 - this.iconHeight / 2 + this.topRightCornerSize },
                { x: this.w / 2 + this.iconWidth / 2 - this.topRightCornerSize + this.bottomPixAdjustment, y: this.h / 2 - this.iconHeight / 2 }];
        }
        Icon.prototype.render = function () {
            this.drawFrame();
            this.drawInnerBars();
        };

        Icon.prototype.drawFrame = function () {
            var lineMaker = d3.svg.line().x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            }).interpolate("linear");

            this.el.append("svg:path").attr('d', lineMaker(this.pathinfo)).attr('class', 'frame');
        };

        Icon.prototype.drawInnerBars = function () {
            var _this = this;
            var yScale = d3.scale.linear().domain([0, this.barCount]).range([this.innerBarY / 2 - this.spacing, this.innerBarY / 2 + this.iconHeight - this.spacing * 3]);
            for (var index = 0; index < this.barCount; index++) {
                this.el.append("rect").attr("x", this.innerBarX).attr("y", function (d, i) {
                    return yScale(index);
                }).attr("width", function () {
                    if (index === 0)
                        return _this.topInnerBarWidth;
                    return _this.innerBarWidth;
                }).attr("height", this.thickness).attr("class", "innerBar");
            }
            ;
        };
        return Icon;
    })();
    exports.Icon = Icon;
});
