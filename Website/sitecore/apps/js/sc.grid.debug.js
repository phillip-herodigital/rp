/* 
* jqGrid  4.4.1 - jQuery Grid 
* Copyright (c) 2008, Tony Tomov, tony@trirand.com 
* Dual licensed under the MIT and GPL licenses 
* http://www.opensource.org/licenses/mit-license.php 
* http://www.gnu.org/licenses/gpl-2.0.html 
* Date:2012-08-28 
* Modules: grid.base.js; jquery.fmatter.js; grid.custom.js; grid.common.js; grid.formedit.js; grid.filter.js; grid.inlinedit.js; grid.celledit.js; jqModal.js; jqDnR.js; grid.subgrid.js; grid.grouping.js; grid.treegrid.js; grid.import.js; JsonXml.js; grid.tbltogrid.js; grid.jqueryui.js; 
*/
(function (b) {
    b.jgrid = b.jgrid || {}; b.extend(b.jgrid, { version: "4.4.1", htmlDecode: function (b) { return b && ("&nbsp;" == b || "&#160;" == b || 1 === b.length && 160 === b.charCodeAt(0)) ? "" : !b ? b : ("" + b).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&") }, htmlEncode: function (b) { return !b ? b : ("" + b).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") }, format: function (f) {
        var e = b.makeArray(arguments).slice(1); void 0 === f && (f = ""); return f.replace(/\{(\d+)\}/g,
function (b, d) { return e[d] })
    }, getCellIndex: function (f) { f = b(f); if (f.is("tr")) return -1; f = (!f.is("td") && !f.is("th") ? f.closest("td,th") : f)[0]; return b.browser.msie ? b.inArray(f, f.parentNode.cells) : f.cellIndex }, stripHtml: function (b) { var b = b + "", e = /<("[^"]*"|'[^']*'|[^'">])*>/gi; return b ? (b = b.replace(e, "")) && "&nbsp;" !== b && "&#160;" !== b ? b.replace(/\"/g, "&#34;") : "" : b }, stripPref: function (f, e) { var c = b.type(f); if ("string" == c || "number" == c) f = "" + f, e = "" !== f ? ("" + e).replace("" + f, "") : e; return e }, stringToDoc: function (b) {
        var e;
        if ("string" !== typeof b) return b; try { e = (new DOMParser).parseFromString(b, "text/xml") } catch (c) { e = new ActiveXObject("Microsoft.XMLDOM"), e.async = !1, e.loadXML(b) } return e && e.documentElement && "parsererror" != e.documentElement.tagName ? e : null
    }, parse: function (f) { "while(1);" == f.substr(0, 9) && (f = f.substr(9)); "/*" == f.substr(0, 2) && (f = f.substr(2, f.length - 4)); f || (f = "{}"); return !0 === b.jgrid.useJSON && "object" === typeof JSON && "function" === typeof JSON.parse ? JSON.parse(f) : eval("(" + f + ")") }, parseDate: function (f, e) {
        var c =
{ m: 1, d: 1, y: 1970, h: 0, i: 0, s: 0, u: 0 }, d, a, g; d = /[\\\/:_;.,\t\T\s-]/; if (e && null !== e && void 0 !== e) {
            e = b.trim(e); e = e.split(d); void 0 !== b.jgrid.formatter.date.masks[f] && (f = b.jgrid.formatter.date.masks[f]); var f = f.split(d), h = b.jgrid.formatter.date.monthNames, i = b.jgrid.formatter.date.AmPm, j = function (a, b) { 0 === a ? 12 === b && (b = 0) : 12 !== b && (b += 12); return b }; d = 0; for (a = f.length; d < a; d++) "M" == f[d] && (g = b.inArray(e[d], h), -1 !== g && 12 > g && (e[d] = g + 1, c.m = e[d])), "F" == f[d] && (g = b.inArray(e[d], h), -1 !== g && 11 < g && (e[d] = g + 1 - 12, c.m = e[d])),
"a" == f[d] && (g = b.inArray(e[d], i), -1 !== g && (2 > g && e[d] == i[g]) && (e[d] = g, c.h = j(e[d], c.h))), "A" == f[d] && (g = b.inArray(e[d], i), -1 !== g && (1 < g && e[d] == i[g]) && (e[d] = g - 2, c.h = j(e[d], c.h))), "g" === f[d] && (c.h = parseInt(e[d], 10)), void 0 !== e[d] && (c[f[d].toLowerCase()] = parseInt(e[d], 10)); c.m = parseInt(c.m, 10) - 1; d = c.y; 70 <= d && 99 >= d ? c.y = 1900 + c.y : 0 <= d && 69 >= d && (c.y = 2E3 + c.y); void 0 !== c.j && (c.d = c.j); void 0 !== c.n && (c.m = parseInt(c.n, 10) - 1)
        } return new Date(c.y, c.m, c.d, c.h, c.i, c.s, c.u)
    }, jqID: function (b) {
        return ("" + b).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g,
"\\$&")
    }, guid: 1, uidPref: "jqg", randId: function (f) { return (f ? f : b.jgrid.uidPref) + b.jgrid.guid++ }, getAccessor: function (b, e) { var c, d, a = [], g; if ("function" === typeof e) return e(b); c = b[e]; if (void 0 === c) try { if ("string" === typeof e && (a = e.split(".")), g = a.length) for (c = b; c && g--; ) d = a.shift(), c = c[d] } catch (h) { } return c }, getXmlData: function (f, e, c) {
        var d = "string" === typeof e ? e.match(/^(.*)\[(\w+)\]$/) : null; if ("function" === typeof e) return e(f); if (d && d[2]) return d[1] ? b(d[1], f).attr(d[2]) : b(f).attr(d[2]); f = b(e, f); return c ?
f : 0 < f.length ? b(f).text() : void 0
    }, cellWidth: function () { var f = b("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;'></td></tr></table></div>"), e = f.appendTo("body").find("td").width(); f.remove(); return 5 !== e }, ajaxOptions: {}, from: function (f) {
        return new function (e, c) {
            "string" == typeof e && (e = b.data(e)); var d = this, a = e, g = !0, f = !1, i = c, j = /[\$,%]/g, l = null, k = null, m = 0, o = !1, p = "", v = [], u = !0; if ("object" == typeof e && e.push) 0 < e.length &&
(u = "object" != typeof e[0] ? !1 : !0); else throw "data provides is not an array"; this._hasData = function () { return null === a ? !1 : 0 === a.length ? !1 : !0 }; this._getStr = function (a) { var b = []; f && b.push("jQuery.trim("); b.push("String(" + a + ")"); f && b.push(")"); g || b.push(".toLowerCase()"); return b.join("") }; this._strComp = function (a) { return "string" == typeof a ? ".toString()" : "" }; this._group = function (a, b) { return { field: a.toString(), unique: b, items: []} }; this._toStr = function (a) {
    f && (a = b.trim(a)); a = a.toString().replace(/\\/g, "\\\\").replace(/\"/g,
'\\"'); return g ? a : a.toLowerCase()
}; this._funcLoop = function (d) { var c = []; b.each(a, function (a, b) { c.push(d(b)) }); return c }; this._append = function (a) { var b; i = null === i ? "" : i + ("" === p ? " && " : p); for (b = 0; b < m; b++) i += "("; o && (i += "!"); i += "(" + a + ")"; o = !1; p = ""; m = 0 }; this._setCommand = function (a, b) { l = a; k = b }; this._resetNegate = function () { o = !1 }; this._repeatCommand = function (a, b) { return null === l ? d : null !== a && null !== b ? l(a, b) : null === k || !u ? l(a) : l(k, a) }; this._equals = function (a, b) { return 0 === d._compare(a, b, 1) }; this._compare = function (a,
b, d) { var c = Object.prototype.toString; void 0 === d && (d = 1); void 0 === a && (a = null); void 0 === b && (b = null); if (null === a && null === b) return 0; if (null === a && null !== b) return 1; if (null !== a && null === b) return -1; if ("[object Date]" === c.call(a) && "[object Date]" === c.call(b)) return a < b ? -d : a > b ? d : 0; !g && ("number" !== typeof a && "number" !== typeof b) && (a = ("" + a).toLowerCase(), b = ("" + b).toLowerCase()); return a < b ? -d : a > b ? d : 0 }; this._performSort = function () { 0 !== v.length && (a = d._doSort(a, 0)) }; this._doSort = function (a, b) {
    var c = v[b].by, f = v[b].dir,
g = v[b].type, e = v[b].datefmt; if (b == v.length - 1) return d._getOrder(a, c, f, g, e); b++; c = d._getGroup(a, c, f, g, e); f = []; for (g = 0; g < c.length; g++) for (var e = d._doSort(c[g].items, b), h = 0; h < e.length; h++) f.push(e[h]); return f
}; this._getOrder = function (a, c, f, g, e) {
    var h = [], i = [], l = "a" == f ? 1 : -1, k, m; void 0 === g && (g = "text"); m = "float" == g || "number" == g || "currency" == g || "numeric" == g ? function (a) { a = parseFloat(("" + a).replace(j, "")); return isNaN(a) ? 0 : a } : "int" == g || "integer" == g ? function (a) { return a ? parseFloat(("" + a).replace(j, "")) : 0 } : "date" ==
g || "datetime" == g ? function (a) { return b.jgrid.parseDate(e, a).getTime() } : b.isFunction(g) ? g : function (a) { a || (a = ""); return b.trim(("" + a).toUpperCase()) }; b.each(a, function (a, d) { k = "" !== c ? b.jgrid.getAccessor(d, c) : d; void 0 === k && (k = ""); k = m(k, d); i.push({ vSort: k, index: a }) }); i.sort(function (a, b) { a = a.vSort; b = b.vSort; return d._compare(a, b, l) }); for (var g = 0, o = a.length; g < o; ) f = i[g].index, h.push(a[f]), g++; return h
}; this._getGroup = function (a, c, g, f, e) {
    var h = [], i = null, j = null, k; b.each(d._getOrder(a, c, g, f, e), function (a, g) {
        k =
b.jgrid.getAccessor(g, c); void 0 === k && (k = ""); d._equals(j, k) || (j = k, null !== i && h.push(i), i = d._group(c, k)); i.items.push(g)
    }); null !== i && h.push(i); return h
}; this.ignoreCase = function () { g = !1; return d }; this.useCase = function () { g = !0; return d }; this.trim = function () { f = !0; return d }; this.noTrim = function () { f = !1; return d }; this.execute = function () { var c = i, g = []; if (null === c) return d; b.each(a, function () { eval(c) && g.push(this) }); a = g; return d }; this.data = function () { return a }; this.select = function (c) {
    d._performSort(); if (!d._hasData()) return [];
    d.execute(); if (b.isFunction(c)) { var g = []; b.each(a, function (a, b) { g.push(c(b)) }); return g } return a
}; this.hasMatch = function () { if (!d._hasData()) return !1; d.execute(); return 0 < a.length }; this.andNot = function (a, b, c) { o = !o; return d.and(a, b, c) }; this.orNot = function (a, b, c) { o = !o; return d.or(a, b, c) }; this.not = function (a, b, c) { return d.andNot(a, b, c) }; this.and = function (a, b, c) { p = " && "; return void 0 === a ? d : d._repeatCommand(a, b, c) }; this.or = function (a, b, c) { p = " || "; return void 0 === a ? d : d._repeatCommand(a, b, c) }; this.orBegin =
function () { m++; return d }; this.orEnd = function () { null !== i && (i += ")"); return d }; this.isNot = function (a) { o = !o; return d.is(a) }; this.is = function (a) { d._append("this." + a); d._resetNegate(); return d }; this._compareValues = function (a, c, g, f, e) {
    var h; h = u ? "jQuery.jgrid.getAccessor(this,'" + c + "')" : "this"; void 0 === g && (g = null); var i = g, k = void 0 === e.stype ? "text" : e.stype; if (null !== g) switch (k) {
        case "int": case "integer": i = isNaN(Number(i)) || "" === i ? "0" : i; h = "parseInt(" + h + ",10)"; i = "parseInt(" + i + ",10)"; break; case "float": case "number": case "numeric": i =
("" + i).replace(j, ""); i = isNaN(Number(i)) || "" === i ? "0" : i; h = "parseFloat(" + h + ")"; i = "parseFloat(" + i + ")"; break; case "date": case "datetime": i = "" + b.jgrid.parseDate(e.newfmt || "Y-m-d", i).getTime(); h = 'jQuery.jgrid.parseDate("' + e.srcfmt + '",' + h + ").getTime()"; break; default: h = d._getStr(h), i = d._getStr('"' + d._toStr(i) + '"')
    } d._append(h + " " + f + " " + i); d._setCommand(a, c); d._resetNegate(); return d
}; this.equals = function (a, b, c) { return d._compareValues(d.equals, a, b, "==", c) }; this.notEquals = function (a, b, c) {
    return d._compareValues(d.equals,
a, b, "!==", c)
}; this.isNull = function (a, b, c) { return d._compareValues(d.equals, a, null, "===", c) }; this.greater = function (a, b, c) { return d._compareValues(d.greater, a, b, ">", c) }; this.less = function (a, b, c) { return d._compareValues(d.less, a, b, "<", c) }; this.greaterOrEquals = function (a, b, c) { return d._compareValues(d.greaterOrEquals, a, b, ">=", c) }; this.lessOrEquals = function (a, b, c) { return d._compareValues(d.lessOrEquals, a, b, "<=", c) }; this.startsWith = function (a, c) {
    var g = void 0 === c || null === c ? a : c, g = f ? b.trim(g.toString()).length :
g.toString().length; u ? d._append(d._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".substr(0," + g + ") == " + d._getStr('"' + d._toStr(c) + '"')) : (g = f ? b.trim(c.toString()).length : c.toString().length, d._append(d._getStr("this") + ".substr(0," + g + ") == " + d._getStr('"' + d._toStr(a) + '"'))); d._setCommand(d.startsWith, a); d._resetNegate(); return d
}; this.endsWith = function (a, c) {
    var g = void 0 === c || null === c ? a : c, g = f ? b.trim(g.toString()).length : g.toString().length; u ? d._append(d._getStr("jQuery.jgrid.getAccessor(this,'" + a +
"')") + ".substr(" + d._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".length-" + g + "," + g + ') == "' + d._toStr(c) + '"') : d._append(d._getStr("this") + ".substr(" + d._getStr("this") + '.length-"' + d._toStr(a) + '".length,"' + d._toStr(a) + '".length) == "' + d._toStr(a) + '"'); d._setCommand(d.endsWith, a); d._resetNegate(); return d
}; this.contains = function (a, b) {
    u ? d._append(d._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + '.indexOf("' + d._toStr(b) + '",0) > -1') : d._append(d._getStr("this") + '.indexOf("' + d._toStr(a) + '",0) > -1');
    d._setCommand(d.contains, a); d._resetNegate(); return d
}; this.groupBy = function (b, c, g, f) { return !d._hasData() ? null : d._getGroup(a, b, c, g, f) }; this.orderBy = function (a, c, g, f) { c = void 0 === c || null === c ? "a" : b.trim(c.toString().toLowerCase()); if (null === g || void 0 === g) g = "text"; if (null === f || void 0 === f) f = "Y-m-d"; if ("desc" == c || "descending" == c) c = "d"; if ("asc" == c || "ascending" == c) c = "a"; v.push({ by: a, dir: c, type: g, datefmt: f }); return d }; return d
        } (f, null)
    }, extend: function (f) { b.extend(b.fn.jqGrid, f); this.no_legacy_api || b.fn.extend(f) } 
    });
    b.fn.jqGrid = function (f) {
        if ("string" == typeof f) { var e = b.jgrid.getAccessor(b.fn.jqGrid, f); if (!e) throw "jqGrid - No such method: " + f; var c = b.makeArray(arguments).slice(1); return e.apply(this, c) } return this.each(function () {
            if (!this.grid) {
                var d = b.extend(!0, { url: "", height: 150, page: 1, rowNum: 20, rowTotal: null, records: 0, pager: "", pgbuttons: !0, pginput: !0, colModel: [], rowList: [], colNames: [], sortorder: "asc", sortname: "", datatype: "xml", mtype: "GET", altRows: !1, selarrrow: [], savedRow: [], shrinkToFit: !0, xmlReader: {}, jsonReader: {},
                    subGrid: !1, subGridModel: [], reccount: 0, lastpage: 0, lastsort: 0, selrow: null, beforeSelectRow: null, onSelectRow: null, onSortCol: null, ondblClickRow: null, onRightClickRow: null, onPaging: null, onSelectAll: null, loadComplete: null, gridComplete: null, loadError: null, loadBeforeSend: null, afterInsertRow: null, beforeRequest: null, beforeProcessing: null, onHeaderClick: null, viewrecords: !1, loadonce: !1, multiselect: !1, multikey: !1, editurl: null, search: !1, caption: "", hidegrid: !0, hiddengrid: !1, postData: {}, userData: {}, treeGrid: !1, treeGridModel: "nested",
                    treeReader: {}, treeANode: -1, ExpandColumn: null, tree_root_level: 0, prmNames: { page: "page", rows: "rows", sort: "sidx", order: "sord", search: "_search", nd: "nd", id: "id", oper: "oper", editoper: "edit", addoper: "add", deloper: "del", subgridid: "id", npage: null, totalrows: "totalrows" }, forceFit: !1, gridstate: "visible", cellEdit: !1, cellsubmit: "remote", nv: 0, loadui: "enable", toolbar: [!1, ""], scroll: !1, multiboxonly: !1, deselectAfterSort: !0, scrollrows: !1, autowidth: !1, scrollOffset: 18, cellLayout: 5, subGridWidth: 20, multiselectWidth: 20, gridview: !1,
                    rownumWidth: 25, rownumbers: !1, pagerpos: "center", recordpos: "right", footerrow: !1, userDataOnFooter: !1, hoverrows: !0, altclass: "ui-priority-secondary", viewsortcols: [!1, "vertical", !0], resizeclass: "", autoencode: !1, remapColumns: [], ajaxGridOptions: {}, direction: "ltr", toppager: !1, headertitles: !1, scrollTimeout: 40, data: [], _index: {}, grouping: !1, groupingView: { groupField: [], groupOrder: [], groupText: [], groupColumnShow: [], groupSummary: [], showSummaryOnHide: !1, sortitems: [], sortnames: [], summary: [], summaryval: [], plusicon: "ui-icon-circlesmall-plus",
                        minusicon: "ui-icon-circlesmall-minus"
                    }, ignoreCase: !1, cmTemplate: {}, idPrefix: ""
                }, b.jgrid.defaults, f || {}), a = this, c = { headers: [], cols: [], footers: [], dragStart: function (c, e, f) {
                    this.resizing = { idx: c, startX: e.clientX, sOL: f[0] }; this.hDiv.style.cursor = "col-resize"; this.curGbox = b("#rs_m" + b.jgrid.jqID(d.id), "#gbox_" + b.jgrid.jqID(d.id)); this.curGbox.css({ display: "block", left: f[0], top: f[1], height: f[2] }); b(a).triggerHandler("jqGridResizeStart", [e, c]); b.isFunction(d.resizeStart) && d.resizeStart.call(this, e, c); document.onselectstart =
function () { return !1 } 
                }, dragMove: function (a) { if (this.resizing) { var b = a.clientX - this.resizing.startX, a = this.headers[this.resizing.idx], c = "ltr" === d.direction ? a.width + b : a.width - b, e; 33 < c && (this.curGbox.css({ left: this.resizing.sOL + b }), !0 === d.forceFit ? (e = this.headers[this.resizing.idx + d.nv], b = "ltr" === d.direction ? e.width - b : e.width + b, 33 < b && (a.newWidth = c, e.newWidth = b)) : (this.newWidth = "ltr" === d.direction ? d.tblwidth + b : d.tblwidth - b, a.newWidth = c)) } }, dragEnd: function () {
                    this.hDiv.style.cursor = "default"; if (this.resizing) {
                        var c =
this.resizing.idx, e = this.headers[c].newWidth || this.headers[c].width, e = parseInt(e, 10); this.resizing = !1; b("#rs_m" + b.jgrid.jqID(d.id)).css("display", "none"); d.colModel[c].width = e; this.headers[c].width = e; this.headers[c].el.style.width = e + "px"; this.cols[c].style.width = e + "px"; 0 < this.footers.length && (this.footers[c].style.width = e + "px"); !0 === d.forceFit ? (e = this.headers[c + d.nv].newWidth || this.headers[c + d.nv].width, this.headers[c + d.nv].width = e, this.headers[c + d.nv].el.style.width = e + "px", this.cols[c + d.nv].style.width =
e + "px", 0 < this.footers.length && (this.footers[c + d.nv].style.width = e + "px"), d.colModel[c + d.nv].width = e) : (d.tblwidth = this.newWidth || d.tblwidth, b("table:first", this.bDiv).css("width", d.tblwidth + "px"), b("table:first", this.hDiv).css("width", d.tblwidth + "px"), this.hDiv.scrollLeft = this.bDiv.scrollLeft, d.footerrow && (b("table:first", this.sDiv).css("width", d.tblwidth + "px"), this.sDiv.scrollLeft = this.bDiv.scrollLeft)); b(a).triggerHandler("jqGridResizeStop", [e, c]); b.isFunction(d.resizeStop) && d.resizeStop.call(this,
e, c)
                    } this.curGbox = null; document.onselectstart = function () { return !0 } 
                }, populateVisible: function () {
                    c.timer && clearTimeout(c.timer); c.timer = null; var a = b(c.bDiv).height(); if (a) {
                        var e = b("table:first", c.bDiv), f, I; if (e[0].rows.length) try { I = (f = e[0].rows[1]) ? b(f).outerHeight() || c.prevRowHeight : c.prevRowHeight } catch (h) { I = c.prevRowHeight } if (I) {
                            c.prevRowHeight = I; var i = d.rowNum; f = c.scrollTop = c.bDiv.scrollTop; var j = Math.round(e.position().top) - f, k = j + e.height(); I *= i; var y, z, B; if (k < a && 0 >= j && (void 0 === d.lastpage || parseInt((k +
f + I - 1) / I, 10) <= d.lastpage)) z = parseInt((a - k + I - 1) / I, 10), 0 <= k || 2 > z || !0 === d.scroll ? (y = Math.round((k + f) / I) + 1, j = -1) : j = 1; 0 < j && (y = parseInt(f / I, 10) + 1, z = parseInt((f + a) / I, 10) + 2 - y, B = !0); if (z && !(d.lastpage && y > d.lastpage || 1 == d.lastpage || y === d.page && y === d.lastpage)) c.hDiv.loading ? c.timer = setTimeout(c.populateVisible, d.scrollTimeout) : (d.page = y, B && (c.selectionPreserver(e[0]), c.emptyRows.call(e[0], !1, !1)), c.populate(z))
                        } 
                    } 
                }, scrollGrid: function (a) {
                    if (d.scroll) {
                        var b = c.bDiv.scrollTop; void 0 === c.scrollTop && (c.scrollTop =
0); b != c.scrollTop && (c.scrollTop = b, c.timer && clearTimeout(c.timer), c.timer = setTimeout(c.populateVisible, d.scrollTimeout))
                    } c.hDiv.scrollLeft = c.bDiv.scrollLeft; d.footerrow && (c.sDiv.scrollLeft = c.bDiv.scrollLeft); a && a.stopPropagation()
                }, selectionPreserver: function (a) {
                    var c = a.p, d = c.selrow, e = c.selarrrow ? b.makeArray(c.selarrrow) : null, f = a.grid.bDiv.scrollLeft, g = function () {
                        var h; c.selrow = null; c.selarrrow = []; if (c.multiselect && e && 0 < e.length) for (h = 0; h < e.length; h++) e[h] != d && b(a).jqGrid("setSelection", e[h], !1, null);
                        d && b(a).jqGrid("setSelection", d, !1, null); a.grid.bDiv.scrollLeft = f; b(a).unbind(".selectionPreserver", g)
                    }; b(a).bind("jqGridGridComplete.selectionPreserver", g)
                } 
                }; if ("TABLE" != this.tagName.toUpperCase()) alert("Element is not a table"); else if (void 0 !== document.documentMode && 5 >= document.documentMode) alert("Grid can not be used in this ('quirks') mode!"); else {
                    b(this).empty().attr("tabindex", "1"); this.p = d; this.p.useProp = !!b.fn.prop; var e, i; if (0 === this.p.colNames.length) for (e = 0; e < this.p.colModel.length; e++) this.p.colNames[e] =
this.p.colModel[e].label || this.p.colModel[e].name; if (this.p.colNames.length !== this.p.colModel.length) alert(b.jgrid.errors.model); else {
                        var j = b("<div class='ui-jqgrid-view'></div>"), l, k = b.browser.msie ? !0 : !1; a.p.direction = b.trim(a.p.direction.toLowerCase()); -1 == b.inArray(a.p.direction, ["ltr", "rtl"]) && (a.p.direction = "ltr"); i = a.p.direction; b(j).insertBefore(this); b(this).appendTo(j).removeClass("scroll"); var m = b("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>"); b(m).insertBefore(j).attr({ id: "gbox_" +
this.id, dir: i
                        }); b(j).appendTo(m).attr("id", "gview_" + this.id); l = k && 6 >= b.browser.version ? '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>' : ""; b("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" + this.id + "'></div>").append(l).insertBefore(j); b("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(j); b(this).attr({ cellspacing: "0", cellpadding: "0", border: "0", role: "grid",
                            "aria-multiselectable": !!this.p.multiselect, "aria-labelledby": "gbox_" + this.id
                        }); var o = function (a, b) { a = parseInt(a, 10); return isNaN(a) ? b ? b : 0 : a }, p = function (d, e, f, h, i, j) {
                            var k = a.p.colModel[d], l = k.align, y = 'style="', z = k.classes, B = k.name, r = []; l && (y = y + ("text-align:" + l + ";")); k.hidden === true && (y = y + "display:none;"); if (e === 0) y = y + ("width: " + c.headers[d].width + "px;"); else if (k.cellattr && b.isFunction(k.cellattr)) if ((d = k.cellattr.call(a, i, f, h, k, j)) && typeof d === "string") {
                                d = d.replace(/style/i, "style").replace(/title/i,
"title"); if (d.indexOf("title") > -1) k.title = false; d.indexOf("class") > -1 && (z = void 0); r = d.split("style"); if (r.length === 2) { r[1] = b.trim(r[1].replace("=", "")); if (r[1].indexOf("'") === 0 || r[1].indexOf('"') === 0) r[1] = r[1].substring(1); y = y + r[1].replace(/'/gi, '"') } else y = y + '"'
                            } if (!r.length) { r[0] = ""; y = y + '"' } y = y + ((z !== void 0 ? ' class="' + z + '"' : "") + (k.title && f ? ' title="' + b.jgrid.stripHtml(f) + '"' : "")); y = y + (' aria-describedby="' + a.p.id + "_" + B + '"'); return y + r[0]
                        }, v = function (c) {
                            return c === void 0 || c === null || c === "" ? "&#160;" :
a.p.autoencode ? b.jgrid.htmlEncode(c) : c + ""
                        }, u = function (c, d, e, f, g) { var h = a.p.colModel[e]; if (typeof h.formatter !== "undefined") { c = { rowId: c, colModel: h, gid: a.p.id, pos: e }; d = b.isFunction(h.formatter) ? h.formatter.call(a, d, c, f, g) : b.fmatter ? b.fn.fmatter.call(a, h.formatter, d, c, f, g) : v(d) } else d = v(d); return d }, L = function (a, b, c, d, e) { b = u(a, b, c, e, "add"); return '<td role="gridcell" ' + p(c, d, b, e, a, true) + ">" + b + "</td>" }, E = function (b, c, d, e) {
                            e = '<input role="checkbox" type="checkbox" id="jqg_' + a.p.id + "_" + b + '" class="cbox" name="jqg_' +
a.p.id + "_" + b + '"' + (e ? 'checked="checked"' : "") + "/>"; return '<td role="gridcell" ' + p(c, d, "", null, b, true) + ">" + e + "</td>"
                        }, Y = function (a, b, c, d) { c = (parseInt(c, 10) - 1) * parseInt(d, 10) + 1 + b; return '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + p(a, b, c, null, b, true) + ">" + c + "</td>" }, T = function (b) { var c, d = [], e = 0, f; for (f = 0; f < a.p.colModel.length; f++) { c = a.p.colModel[f]; if (c.name !== "cb" && c.name !== "subgrid" && c.name !== "rn") { d[e] = b == "local" ? c.name : b == "xml" || b === "xmlstring" ? c.xmlmap || c.name : c.jsonmap || c.name; e++ } } return d },
U = function (c) { var d = a.p.remapColumns; if (!d || !d.length) d = b.map(a.p.colModel, function (a, b) { return b }); c && (d = b.map(d, function (a) { return a < c ? null : a - c })); return d }, M = function (a, c) {
    var d; if (this.p.deepempty) b(this.rows).slice(1).remove(); else { d = this.rows.length > 0 ? this.rows[0] : null; b(this.firstChild).empty().append(d) } if (a && this.p.scroll) {
        b(this.grid.bDiv.firstChild).css({ height: "auto" }); b(this.grid.bDiv.firstChild.firstChild).css({ height: 0, display: "none" }); if (this.grid.bDiv.scrollTop !== 0) this.grid.bDiv.scrollTop =
0
    } if (c === true && this.p.treeGrid) { this.p.data = []; this.p._index = {} } 
}, Q = function () { var c = a.p.data.length, d, e, f; d = a.p.rownumbers === true ? 1 : 0; e = a.p.multiselect === true ? 1 : 0; f = a.p.subGrid === true ? 1 : 0; d = a.p.keyIndex === false || a.p.loadonce === true ? a.p.localReader.id : a.p.colModel[a.p.keyIndex + e + f + d].name; for (e = 0; e < c; e++) { f = b.jgrid.getAccessor(a.p.data[e], d); a.p._index[f] = e } }, N = function (c, d, e, f, g, h) {
    var i = "-1", j = "", k, d = d ? "display:none;" : "", e = "ui-widget-content jqgrow ui-row-" + a.p.direction + e + (h ? " ui-state-highlight" :
""), f = b.isFunction(a.p.rowattr) ? a.p.rowattr.call(a, f, g) : {}; if (!b.isEmptyObject(f)) { if (f.hasOwnProperty("id")) { c = f.id; delete f.id } if (f.hasOwnProperty("tabindex")) { i = f.tabindex; delete f.tabindex } if (f.hasOwnProperty("style")) { d = d + f.style; delete f.style } if (f.hasOwnProperty("class")) { e = e + (" " + f["class"]); delete f["class"] } try { delete f.role } catch (z) { } for (k in f) f.hasOwnProperty(k) && (j = j + (" " + k + "=" + f[k])) } return '<tr role="row" id="' + c + '" tabindex="' + i + '" class="' + e + '"' + (d === "" ? "" : ' style="' + d + '"') + j + ">"
},
Z = function (c, d, e, f, g) {
    var h = new Date, i = a.p.datatype != "local" && a.p.loadonce || a.p.datatype == "xmlstring", j = a.p.xmlReader, k = a.p.datatype == "local" ? "local" : "xml"; if (i) { a.p.data = []; a.p._index = {}; a.p.localReader.id = "_id_" } a.p.reccount = 0; if (b.isXMLDoc(c)) {
        if (a.p.treeANode === -1 && !a.p.scroll) { M.call(a, false, true); e = 1 } else e = e > 1 ? e : 1; var z, B, r = 0, l, s = a.p.multiselect === true ? 1 : 0, O = a.p.subGrid === true ? 1 : 0, m = a.p.rownumbers === true ? 1 : 0, o, p = [], u, n = {}, q, w, C = [], v = a.p.altRows === true ? " " + a.p.altclass : "", A; j.repeatitems || (p =
T(k)); o = a.p.keyIndex === false ? b.isFunction(j.id) ? j.id.call(a, c) : j.id : a.p.keyIndex; if (p.length > 0 && !isNaN(o)) { a.p.remapColumns && a.p.remapColumns.length && (o = b.inArray(o, a.p.remapColumns)); o = p[o] } k = (o + "").indexOf("[") === -1 ? p.length ? function (a, c) { return b(o, a).text() || c } : function (a, c) { return b(j.cell, a).eq(o).text() || c } : function (a, b) { return a.getAttribute(o.replace(/[\[\]]/g, "")) || b }; a.p.userData = {}; a.p.page = b.jgrid.getXmlData(c, j.page) || a.p.page || 0; a.p.lastpage = b.jgrid.getXmlData(c, j.total); if (a.p.lastpage ===
void 0) a.p.lastpage = 1; a.p.records = b.jgrid.getXmlData(c, j.records) || 0; b.isFunction(j.userdata) ? a.p.userData = j.userdata.call(a, c) || {} : b.jgrid.getXmlData(c, j.userdata, true).each(function () { a.p.userData[this.getAttribute("name")] = b(this).text() }); c = b.jgrid.getXmlData(c, j.root, true); (c = b.jgrid.getXmlData(c, j.row, true)) || (c = []); var t = c.length, F = 0, R = [], x = parseInt(a.p.rowNum, 10); if (t > 0 && a.p.page <= 0) a.p.page = 1; if (c && t) {
            var D = a.p.scroll ? b.jgrid.randId() : 1; g && (x = x * (g + 1)); for (var g = b.isFunction(a.p.afterInsertRow),
H = a.p.grouping && a.p.groupingView.groupCollapse === true; F < t; ) {
                q = c[F]; w = k(q, D + F); w = a.p.idPrefix + w; z = e === 0 ? 0 : e + 1; A = (z + F) % 2 == 1 ? v : ""; var G = C.length; C.push(""); m && C.push(Y(0, F, a.p.page, a.p.rowNum)); s && C.push(E(w, m, F, false)); O && C.push(b(a).jqGrid("addSubGridCell", s + m, F + e)); if (j.repeatitems) { u || (u = U(s + O + m)); var J = b.jgrid.getXmlData(q, j.cell, true); b.each(u, function (b) { var c = J[this]; if (!c) return false; l = c.textContent || c.text; n[a.p.colModel[b + s + O + m].name] = l; C.push(L(w, l, b + s + O + m, F + e, q)) }) } else for (z = 0; z < p.length; z++) {
                    l =
b.jgrid.getXmlData(q, p[z]); n[a.p.colModel[z + s + O + m].name] = l; C.push(L(w, l, z + s + O + m, F + e, q))
                } C[G] = N(w, H, A, n, q, false); C.push("</tr>"); if (a.p.grouping) { R = b(a).jqGrid("groupingPrepare", C, R, n, F); C = [] } if (i || a.p.treeGrid === true) { n._id_ = w; a.p.data.push(n); a.p._index[w] = a.p.data.length - 1 } if (a.p.gridview === false) { b("tbody:first", d).append(C.join("")); b(a).triggerHandler("jqGridAfterInsertRow", [w, n, q]); g && a.p.afterInsertRow.call(a, w, n, q); C = [] } n = {}; r++; F++; if (r == x) break
            } 
        } if (a.p.gridview === true) {
            B = a.p.treeANode > -1 ?
a.p.treeANode : 0; if (a.p.grouping) { b(a).jqGrid("groupingRender", R, a.p.colModel.length); R = null } else a.p.treeGrid === true && B > 0 ? b(a.rows[B]).after(C.join("")) : b("tbody:first", d).append(C.join(""))
        } if (a.p.subGrid === true) try { b(a).jqGrid("addSubGrid", s + m) } catch (P) { } a.p.totaltime = new Date - h; if (r > 0 && a.p.records === 0) a.p.records = t; C = null; if (a.p.treeGrid === true) try { b(a).jqGrid("setTreeNode", B + 1, r + B + 1) } catch (Q) { } if (!a.p.treeGrid && !a.p.scroll) a.grid.bDiv.scrollTop = 0; a.p.reccount = r; a.p.treeANode = -1; a.p.userDataOnFooter &&
b(a).jqGrid("footerData", "set", a.p.userData, true); if (i) { a.p.records = t; a.p.lastpage = Math.ceil(t / x) } f || a.updatepager(false, true); if (i) for (; r < t; ) {
            q = c[r]; w = k(q, r + D); w = a.p.idPrefix + w; if (j.repeatitems) { u || (u = U(s + O + m)); var K = b.jgrid.getXmlData(q, j.cell, true); b.each(u, function (b) { var c = K[this]; if (!c) return false; l = c.textContent || c.text; n[a.p.colModel[b + s + O + m].name] = l }) } else for (z = 0; z < p.length; z++) { l = b.jgrid.getXmlData(q, p[z]); n[a.p.colModel[z + s + O + m].name] = l } n._id_ = w; a.p.data.push(n); a.p._index[w] = a.p.data.length -
1; n = {}; r++
        } 
    } 
}, $ = function (c, d, e, f, g) {
    d = new Date; if (c) {
        if (a.p.treeANode === -1 && !a.p.scroll) { M.call(a, false, true); e = 1 } else e = e > 1 ? e : 1; var h, i, j = a.p.datatype != "local" && a.p.loadonce || a.p.datatype == "jsonstring"; if (j) { a.p.data = []; a.p._index = {}; a.p.localReader.id = "_id_" } a.p.reccount = 0; if (a.p.datatype == "local") { h = a.p.localReader; i = "local" } else { h = a.p.jsonReader; i = "json" } var k = 0, l, B, r = [], m, s = a.p.multiselect ? 1 : 0, o = a.p.subGrid ? 1 : 0, p = a.p.rownumbers === true ? 1 : 0, n, u, t = {}, v, q, w = [], C = a.p.altRows === true ? " " + a.p.altclass :
"", A; a.p.page = b.jgrid.getAccessor(c, h.page) || a.p.page || 0; n = b.jgrid.getAccessor(c, h.total); a.p.lastpage = n === void 0 ? 1 : n; a.p.records = b.jgrid.getAccessor(c, h.records) || 0; a.p.userData = b.jgrid.getAccessor(c, h.userdata) || {}; h.repeatitems || (m = r = T(i)); i = a.p.keyIndex === false ? b.isFunction(h.id) ? h.id.call(a, c) : h.id : a.p.keyIndex; if (r.length > 0 && !isNaN(i)) { a.p.remapColumns && a.p.remapColumns.length && (i = b.inArray(i, a.p.remapColumns)); i = r[i] } (u = b.jgrid.getAccessor(c, h.root)) || (u = []); n = u.length; c = 0; if (n > 0 && a.p.page <=
0) a.p.page = 1; var x = parseInt(a.p.rowNum, 10), D = a.p.scroll ? b.jgrid.randId() : 1, F = false, R; g && (x = x * (g + 1)); a.p.datatype === "local" && !a.p.deselectAfterSort && (F = true); for (var H = b.isFunction(a.p.afterInsertRow), G = [], J = a.p.grouping && a.p.groupingView.groupCollapse === true; c < n; ) {
            g = u[c]; q = b.jgrid.getAccessor(g, i); if (q === void 0) { q = D + c; if (r.length === 0 && h.cell) { l = b.jgrid.getAccessor(g, h.cell); q = l !== void 0 ? l[i] || q : q } } q = a.p.idPrefix + q; l = e === 1 ? 0 : e; A = (l + c) % 2 == 1 ? C : ""; F && (R = a.p.multiselect ? b.inArray(q, a.p.selarrrow) !== -1 :
q === a.p.selrow); var K = w.length; w.push(""); p && w.push(Y(0, c, a.p.page, a.p.rowNum)); s && w.push(E(q, p, c, R)); o && w.push(b(a).jqGrid("addSubGridCell", s + p, c + e)); if (h.repeatitems) { h.cell && (g = b.jgrid.getAccessor(g, h.cell)); m || (m = U(s + o + p)) } for (B = 0; B < m.length; B++) { l = b.jgrid.getAccessor(g, m[B]); w.push(L(q, l, B + s + o + p, c + e, g)); t[a.p.colModel[B + s + o + p].name] = l } w[K] = N(q, J, A, t, g, R); w.push("</tr>"); if (a.p.grouping) { G = b(a).jqGrid("groupingPrepare", w, G, t, c); w = [] } if (j || a.p.treeGrid === true) {
                t._id_ = q; a.p.data.push(t); a.p._index[q] =
a.p.data.length - 1
            } if (a.p.gridview === false) { b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(w.join("")); b(a).triggerHandler("jqGridAfterInsertRow", [q, t, g]); H && a.p.afterInsertRow.call(a, q, t, g); w = [] } t = {}; k++; c++; if (k == x) break
        } if (a.p.gridview === true) { v = a.p.treeANode > -1 ? a.p.treeANode : 0; a.p.grouping ? b(a).jqGrid("groupingRender", G, a.p.colModel.length) : a.p.treeGrid === true && v > 0 ? b(a.rows[v]).after(w.join("")) : b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(w.join("")) } if (a.p.subGrid === true) try {
            b(a).jqGrid("addSubGrid",
s + p)
        } catch (P) { } a.p.totaltime = new Date - d; if (k > 0 && a.p.records === 0) a.p.records = n; if (a.p.treeGrid === true) try { b(a).jqGrid("setTreeNode", v + 1, k + v + 1) } catch (Q) { } if (!a.p.treeGrid && !a.p.scroll) a.grid.bDiv.scrollTop = 0; a.p.reccount = k; a.p.treeANode = -1; a.p.userDataOnFooter && b(a).jqGrid("footerData", "set", a.p.userData, true); if (j) { a.p.records = n; a.p.lastpage = Math.ceil(n / x) } f || a.updatepager(false, true); if (j) for (; k < n && u[k]; ) {
            g = u[k]; q = b.jgrid.getAccessor(g, i); if (q === void 0) {
                q = D + k; r.length === 0 && h.cell && (q = b.jgrid.getAccessor(g,
h.cell)[i] || q)
            } if (g) { q = a.p.idPrefix + q; if (h.repeatitems) { h.cell && (g = b.jgrid.getAccessor(g, h.cell)); m || (m = U(s + o + p)) } for (B = 0; B < m.length; B++) { l = b.jgrid.getAccessor(g, m[B]); t[a.p.colModel[B + s + o + p].name] = l } t._id_ = q; a.p.data.push(t); a.p._index[q] = a.p.data.length - 1; t = {} } k++
        } 
    } 
}, la = function () {
    function c(d) {
        var e = 0, g, h, i, j, S; if (d.groups !== void 0) {
            (h = d.groups.length && d.groupOp.toString().toUpperCase() === "OR") && s.orBegin(); for (g = 0; g < d.groups.length; g++) { e > 0 && h && s.or(); try { c(d.groups[g]) } catch (k) { alert(k) } e++ } h &&
s.orEnd()
        } if (d.rules !== void 0) { if (e > 0) { h = s.select(); s = b.jgrid.from(h); a.p.ignoreCase && (s = s.ignoreCase()) } try { (i = d.rules.length && d.groupOp.toString().toUpperCase() === "OR") && s.orBegin(); for (g = 0; g < d.rules.length; g++) { S = d.rules[g]; j = d.groupOp.toString().toUpperCase(); if (o[S.op] && S.field) { e > 0 && (j && j === "OR") && (s = s.or()); s = o[S.op](s, j)(S.field, S.data, f[S.field]) } e++ } i && s.orEnd() } catch (ma) { alert(ma) } } 
    } var d, e = false, f = {}, g = [], h = [], i, j, k; if (b.isArray(a.p.data)) {
        var l = a.p.grouping ? a.p.groupingView : false, m, r;
        b.each(a.p.colModel, function () {
            j = this.sorttype || "text"; if (j == "date" || j == "datetime") { if (this.formatter && typeof this.formatter === "string" && this.formatter == "date") { i = this.formatoptions && this.formatoptions.srcformat ? this.formatoptions.srcformat : b.jgrid.formatter.date.srcformat; k = this.formatoptions && this.formatoptions.newformat ? this.formatoptions.newformat : b.jgrid.formatter.date.newformat } else i = k = this.datefmt || "Y-m-d"; f[this.name] = { stype: j, srcfmt: i, newfmt: k} } else f[this.name] = { stype: j, srcfmt: "", newfmt: "" };
            if (a.p.grouping) { r = 0; for (m = l.groupField.length; r < m; r++) if (this.name == l.groupField[r]) { var c = this.name; if (typeof this.index != "undefined") c = this.index; g[r] = f[c]; h[r] = c } } if (!e && (this.index == a.p.sortname || this.name == a.p.sortname)) { d = this.name; e = true } 
        }); if (a.p.treeGrid) b(a).jqGrid("SortTree", d, a.p.sortorder, f[d].stype, f[d].srcfmt); else {
            var o = { eq: function (a) { return a.equals }, ne: function (a) { return a.notEquals }, lt: function (a) { return a.less }, le: function (a) { return a.lessOrEquals }, gt: function (a) { return a.greater },
                ge: function (a) { return a.greaterOrEquals }, cn: function (a) { return a.contains }, nc: function (a, b) { return b === "OR" ? a.orNot().contains : a.andNot().contains }, bw: function (a) { return a.startsWith }, bn: function (a, b) { return b === "OR" ? a.orNot().startsWith : a.andNot().startsWith }, en: function (a, b) { return b === "OR" ? a.orNot().endsWith : a.andNot().endsWith }, ew: function (a) { return a.endsWith }, ni: function (a, b) { return b === "OR" ? a.orNot().equals : a.andNot().equals }, "in": function (a) { return a.equals }, nu: function (a) { return a.isNull },
                nn: function (a, b) { return b === "OR" ? a.orNot().isNull : a.andNot().isNull } 
            }, s = b.jgrid.from(a.p.data); a.p.ignoreCase && (s = s.ignoreCase()); if (a.p.search === true) { var n = a.p.postData.filters; if (n) { typeof n == "string" && (n = b.jgrid.parse(n)); c(n) } else try { s = o[a.p.postData.searchOper](s)(a.p.postData.searchField, a.p.postData.searchString, f[a.p.postData.searchField]) } catch (p) { } } if (a.p.grouping) for (r = 0; r < m; r++) s.orderBy(h[r], l.groupOrder[r], g[r].stype, g[r].srcfmt); d && (a.p.sortorder && e) && (a.p.sortorder.toUpperCase() ==
"DESC" ? s.orderBy(a.p.sortname, "d", f[d].stype, f[d].srcfmt) : s.orderBy(a.p.sortname, "a", f[d].stype, f[d].srcfmt)); var n = s.select(), u = parseInt(a.p.rowNum, 10), t = n.length, v = parseInt(a.p.page, 10), x = Math.ceil(t / u), q = {}, n = n.slice((v - 1) * u, v * u), f = s = null; q[a.p.localReader.total] = x; q[a.p.localReader.page] = v; q[a.p.localReader.records] = t; q[a.p.localReader.root] = n; q[a.p.localReader.userdata] = a.p.userData; n = null; return q
        } 
    } 
}, ba = function () {
    a.grid.hDiv.loading = true; if (!a.p.hiddengrid) switch (a.p.loadui) {
        case "enable": b("#load_" +
b.jgrid.jqID(a.p.id)).show(); break; case "block": b("#lui_" + b.jgrid.jqID(a.p.id)).show(); b("#load_" + b.jgrid.jqID(a.p.id)).show()
    } 
}, K = function () { a.grid.hDiv.loading = false; switch (a.p.loadui) { case "enable": b("#load_" + b.jgrid.jqID(a.p.id)).hide(); break; case "block": b("#lui_" + b.jgrid.jqID(a.p.id)).hide(); b("#load_" + b.jgrid.jqID(a.p.id)).hide() } }, G = function (c) {
    if (!a.grid.hDiv.loading) {
        var d = a.p.scroll && c === false, e = {}, f, g = a.p.prmNames; if (a.p.page <= 0) a.p.page = 1; if (g.search !== null) e[g.search] = a.p.search; g.nd !==
null && (e[g.nd] = (new Date).getTime()); if (g.rows !== null) e[g.rows] = a.p.rowNum; if (g.page !== null) e[g.page] = a.p.page; if (g.sort !== null) e[g.sort] = a.p.sortname; if (g.order !== null) e[g.order] = a.p.sortorder; if (a.p.rowTotal !== null && g.totalrows !== null) e[g.totalrows] = a.p.rowTotal; var h = b.isFunction(a.p.loadComplete), i = h ? a.p.loadComplete : null, j = 0, c = c || 1; if (c > 1) if (g.npage !== null) { e[g.npage] = c; j = c - 1; c = 1 } else i = function (b) { a.p.page++; a.grid.hDiv.loading = false; h && a.p.loadComplete.call(a, b); G(c - 1) }; else g.npage !== null &&
delete a.p.postData[g.npage]; if (a.p.grouping) { b(a).jqGrid("groupingSetup"); var k = a.p.groupingView, l, m = ""; for (l = 0; l < k.groupField.length; l++) { var r = k.groupField[l]; b.each(a.p.colModel, function (a, b) { if (b.name == r && b.index) r = b.index }); m = m + (r + " " + k.groupOrder[l] + ", ") } e[g.sort] = m + e[g.sort] } b.extend(a.p.postData, e); var n = !a.p.scroll ? 1 : a.rows.length - 1, e = b(a).triggerHandler("jqGridBeforeRequest"); if (!(e === false || e === "stop")) if (b.isFunction(a.p.datatype)) a.p.datatype.call(a, a.p.postData, "load_" + a.p.id); else {
            if (b.isFunction(a.p.beforeRequest)) {
                e =
a.p.beforeRequest.call(a); e === void 0 && (e = true); if (e === false) return
            } f = a.p.datatype.toLowerCase(); switch (f) {
                case "json": case "jsonp": case "xml": case "script": b.ajax(b.extend({ url: a.p.url, type: a.p.mtype, dataType: f, data: b.isFunction(a.p.serializeGridData) ? a.p.serializeGridData.call(a, a.p.postData) : a.p.postData, success: function (e, g, h) {
                    if (b.isFunction(a.p.beforeProcessing) && a.p.beforeProcessing.call(a, e, g, h) === false) K(); else {
                        f === "xml" ? Z(e, a.grid.bDiv, n, c > 1, j) : $(e, a.grid.bDiv, n, c > 1, j); b(a).triggerHandler("jqGridLoadComplete",
[e]); i && i.call(a, e); b(a).triggerHandler("jqGridAfterLoadComplete", [e]); d && a.grid.populateVisible(); if (a.p.loadonce || a.p.treeGrid) a.p.datatype = "local"; c === 1 && K()
                    } 
                }, error: function (d, e, f) { b.isFunction(a.p.loadError) && a.p.loadError.call(a, d, e, f); c === 1 && K() }, beforeSend: function (c, d) { var e = true; b.isFunction(a.p.loadBeforeSend) && (e = a.p.loadBeforeSend.call(a, c, d)); e === void 0 && (e = true); if (e === false) return false; ba() } 
                }, b.jgrid.ajaxOptions, a.p.ajaxGridOptions)); break; case "xmlstring": ba(); e = b.jgrid.stringToDoc(a.p.datastr);
                    Z(e, a.grid.bDiv); b(a).triggerHandler("jqGridLoadComplete", [e]); h && a.p.loadComplete.call(a, e); b(a).triggerHandler("jqGridAfterLoadComplete", [e]); a.p.datatype = "local"; a.p.datastr = null; K(); break; case "jsonstring": ba(); e = typeof a.p.datastr == "string" ? b.jgrid.parse(a.p.datastr) : a.p.datastr; $(e, a.grid.bDiv); b(a).triggerHandler("jqGridLoadComplete", [e]); h && a.p.loadComplete.call(a, e); b(a).triggerHandler("jqGridAfterLoadComplete", [e]); a.p.datatype = "local"; a.p.datastr = null; K(); break; case "local": case "clientside": ba();
                    a.p.datatype = "local"; e = la(); $(e, a.grid.bDiv, n, c > 1, j); b(a).triggerHandler("jqGridLoadComplete", [e]); i && i.call(a, e); b(a).triggerHandler("jqGridAfterLoadComplete", [e]); d && a.grid.populateVisible(); K()
            } 
        } 
    } 
}, ca = function (c) { b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv)[a.p.useProp ? "prop" : "attr"]("checked", c); if (a.p.frozenColumns && a.p.id + "_frozen") b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.fhDiv)[a.p.useProp ? "prop" : "attr"]("checked", c) }; l = function (c, e) {
    var d = "", f = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
g = "", h, j, k, l, m = function (c) { var e; b.isFunction(a.p.onPaging) && (e = a.p.onPaging.call(a, c)); a.p.selrow = null; if (a.p.multiselect) { a.p.selarrrow = []; ca(false) } a.p.savedRow = []; return e == "stop" ? false : true }, c = c.substr(1), e = e + ("_" + c); h = "pg_" + c; j = c + "_left"; k = c + "_center"; l = c + "_right"; b("#" + b.jgrid.jqID(c)).append("<div id='" + h + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" +
j + "' align='left'></td><td id='" + k + "' align='center' style='white-space:pre;'></td><td id='" + l + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr"); if (a.p.rowList.length > 0) { g = "<td dir='" + i + "'>"; g = g + "<select class='ui-pg-selbox' role='listbox'>"; for (j = 0; j < a.p.rowList.length; j++) g = g + ('<option role="option" value="' + a.p.rowList[j] + '"' + (a.p.rowNum == a.p.rowList[j] ? ' selected="selected"' : "") + ">" + a.p.rowList[j] + "</option>"); g = g + "</select></td>" } i == "rtl" && (f = f + g); a.p.pginput === true && (d = "<td dir='" +
i + "'>" + b.jgrid.format(a.p.pgtext || "", "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>", "<span id='sp_1_" + b.jgrid.jqID(c) + "'></span>") + "</td>"); if (a.p.pgbuttons === true) {
        j = ["first" + e, "prev" + e, "next" + e, "last" + e]; i == "rtl" && j.reverse(); f = f + ("<td id='" + j[0] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>"); f = f + ("<td id='" + j[1] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>");
        f = f + (d !== "" ? "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" + d + "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" : "") + ("<td id='" + j[2] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>"); f = f + ("<td id='" + j[3] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>")
    } else d !== "" && (f = f + d); i == "ltr" && (f = f + g); f = f + "</tr></tbody></table>";
    a.p.viewrecords === true && b("td#" + c + "_" + a.p.recordpos, "#" + h).append("<div dir='" + i + "' style='text-align:" + a.p.recordpos + "' class='ui-paging-info'></div>"); b("td#" + c + "_" + a.p.pagerpos, "#" + h).append(f); g = b(".ui-jqgrid").css("font-size") || "11px"; b(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + g + ";visibility:hidden;' ></div>"); f = b(f).clone().appendTo("#testpg").width(); b("#testpg").remove(); if (f > 0) {
        d !== "" && (f = f + 50); b("td#" + c + "_" + a.p.pagerpos, "#" +
h).width(f)
    } a.p._nvtd = []; a.p._nvtd[0] = f ? Math.floor((a.p.width - f) / 2) : Math.floor(a.p.width / 3); a.p._nvtd[1] = 0; f = null; b(".ui-pg-selbox", "#" + h).bind("change", function () { a.p.page = Math.round(a.p.rowNum * (a.p.page - 1) / this.value - 0.5) + 1; a.p.rowNum = this.value; a.p.pager && b(".ui-pg-selbox", a.p.pager).val(this.value); a.p.toppager && b(".ui-pg-selbox", a.p.toppager).val(this.value); if (!m("records")) return false; G(); return false }); if (a.p.pgbuttons === true) {
        b(".ui-pg-button", "#" + h).hover(function () {
            if (b(this).hasClass("ui-state-disabled")) this.style.cursor =
"default"; else { b(this).addClass("ui-state-hover"); this.style.cursor = "pointer" } 
        }, function () { if (!b(this).hasClass("ui-state-disabled")) { b(this).removeClass("ui-state-hover"); this.style.cursor = "default" } }); b("#first" + b.jgrid.jqID(e) + ", #prev" + b.jgrid.jqID(e) + ", #next" + b.jgrid.jqID(e) + ", #last" + b.jgrid.jqID(e)).click(function () {
            var b = o(a.p.page, 1), c = o(a.p.lastpage, 1), d = false, f = true, g = true, h = true, i = true; if (c === 0 || c === 1) i = h = g = f = false; else if (c > 1 && b >= 1) if (b === 1) g = f = false; else { if (b === c) i = h = false } else if (c >
1 && b === 0) { i = h = false; b = c - 1 } if (this.id === "first" + e && f) { a.p.page = 1; d = true } if (this.id === "prev" + e && g) { a.p.page = b - 1; d = true } if (this.id === "next" + e && h) { a.p.page = b + 1; d = true } if (this.id === "last" + e && i) { a.p.page = c; d = true } if (d) { if (!m(this.id)) return false; G() } return false
        })
    } a.p.pginput === true && b("input.ui-pg-input", "#" + h).keypress(function (c) { if ((c.charCode ? c.charCode : c.keyCode ? c.keyCode : 0) == 13) { a.p.page = b(this).val() > 0 ? b(this).val() : a.p.page; if (!m("user")) return false; G(); return false } return this })
}; var ia = function (c,
e, d, f) {
    if (a.p.colModel[e].sortable && !(a.p.savedRow.length > 0)) {
        if (!d) { if (a.p.lastsort == e) if (a.p.sortorder == "asc") a.p.sortorder = "desc"; else { if (a.p.sortorder == "desc") a.p.sortorder = "asc" } else a.p.sortorder = a.p.colModel[e].firstsortorder || "asc"; a.p.page = 1 } if (f) { if (a.p.lastsort == e && a.p.sortorder == f && !d) return; a.p.sortorder = f } d = a.grid.headers[a.p.lastsort].el; f = a.grid.headers[e].el; b("span.ui-grid-ico-sort", d).addClass("ui-state-disabled"); b(d).attr("aria-selected", "false"); b("span.ui-icon-" + a.p.sortorder,
f).removeClass("ui-state-disabled"); b(f).attr("aria-selected", "true"); if (!a.p.viewsortcols[0] && a.p.lastsort != e) { b("span.s-ico", d).hide(); b("span.s-ico", f).show() } c = c.substring(5 + a.p.id.length + 1); a.p.sortname = a.p.colModel[e].index || c; d = a.p.sortorder; if (b(a).triggerHandler("jqGridSortCol", [c, e, d]) === "stop") a.p.lastsort = e; else if (b.isFunction(a.p.onSortCol) && a.p.onSortCol.call(a, c, e, d) == "stop") a.p.lastsort = e; else {
            if (a.p.datatype == "local") a.p.deselectAfterSort && b(a).jqGrid("resetSelection"); else {
                a.p.selrow =
null; a.p.multiselect && ca(false); a.p.selarrrow = []; a.p.savedRow = []
            } if (a.p.scroll) { d = a.grid.bDiv.scrollLeft; M.call(a, true, false); a.grid.hDiv.scrollLeft = d } a.p.subGrid && a.p.datatype == "local" && b("td.sgexpanded", "#" + b.jgrid.jqID(a.p.id)).each(function () { b(this).trigger("click") }); G(); a.p.lastsort = e; if (a.p.sortname != c && e) a.p.lastsort = e
        } 
    } 
}, na = function (c) {
    var e, d = {}, f = b.jgrid.cellWidth() ? 0 : a.p.cellLayout; for (e = d[0] = d[1] = d[2] = 0; e <= c; e++) a.p.colModel[e].hidden === false && (d[0] = d[0] + (a.p.colModel[e].width + f)); a.p.direction ==
"rtl" && (d[0] = a.p.width - d[0]); d[0] = d[0] - a.grid.bDiv.scrollLeft; b(a.grid.cDiv).is(":visible") && (d[1] = d[1] + (b(a.grid.cDiv).height() + parseInt(b(a.grid.cDiv).css("padding-top"), 10) + parseInt(b(a.grid.cDiv).css("padding-bottom"), 10))); if (a.p.toolbar[0] === true && (a.p.toolbar[1] == "top" || a.p.toolbar[1] == "both")) d[1] = d[1] + (b(a.grid.uDiv).height() + parseInt(b(a.grid.uDiv).css("border-top-width"), 10) + parseInt(b(a.grid.uDiv).css("border-bottom-width"), 10)); a.p.toppager && (d[1] = d[1] + (b(a.grid.topDiv).height() + parseInt(b(a.grid.topDiv).css("border-bottom-width"),
10))); d[2] = d[2] + (b(a.grid.bDiv).height() + b(a.grid.hDiv).height()); return d
}, ja = function (c) { var d, e = a.grid.headers, f = b.jgrid.getCellIndex(c); for (d = 0; d < e.length; d++) if (c === e[d].el) { f = d; break } return f }; this.p.id = this.id; -1 == b.inArray(a.p.multikey, ["shiftKey", "altKey", "ctrlKey"]) && (a.p.multikey = !1); a.p.keyIndex = !1; for (e = 0; e < a.p.colModel.length; e++) a.p.colModel[e] = b.extend(!0, {}, a.p.cmTemplate, a.p.colModel[e].template || {}, a.p.colModel[e]), !1 === a.p.keyIndex && !0 === a.p.colModel[e].key && (a.p.keyIndex = e); a.p.sortorder =
a.p.sortorder.toLowerCase(); !0 === a.p.grouping && (a.p.scroll = !1, a.p.rownumbers = !1, a.p.treeGrid = !1, a.p.gridview = !0); if (!0 === this.p.treeGrid) { try { b(this).jqGrid("setTreeGrid") } catch (pa) { } "local" != a.p.datatype && (a.p.localReader = { id: "_id_" }) } if (this.p.subGrid) try { b(a).jqGrid("setSubGrid") } catch (qa) { } this.p.multiselect && (this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox'/>"), this.p.colModel.unshift({ name: "cb", width: b.jgrid.cellWidth() ? a.p.multiselectWidth +
a.p.cellLayout : a.p.multiselectWidth, sortable: !1, resizable: !1, hidedlg: !0, search: !1, align: "center", fixed: !0
})); this.p.rownumbers && (this.p.colNames.unshift(""), this.p.colModel.unshift({ name: "rn", width: a.p.rownumWidth, sortable: !1, resizable: !1, hidedlg: !0, search: !1, align: "center", fixed: !0 })); a.p.xmlReader = b.extend(!0, { root: "rows", row: "row", page: "rows>page", total: "rows>total", records: "rows>records", repeatitems: !0, cell: "cell", id: "[id]", userdata: "userdata", subgrid: { root: "rows", row: "row", repeatitems: !0, cell: "cell"} },
a.p.xmlReader); a.p.jsonReader = b.extend(!0, { root: "rows", page: "page", total: "total", records: "records", repeatitems: !0, cell: "cell", id: "id", userdata: "userdata", subgrid: { root: "rows", repeatitems: !0, cell: "cell"} }, a.p.jsonReader); a.p.localReader = b.extend(!0, { root: "rows", page: "page", total: "total", records: "records", repeatitems: !1, cell: "cell", id: "id", userdata: "userdata", subgrid: { root: "rows", repeatitems: !0, cell: "cell"} }, a.p.localReader); a.p.scroll && (a.p.pgbuttons = !1, a.p.pginput = !1, a.p.rowList = []); a.p.data.length &&
Q(); var x = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>", ka, J, da, aa, ea, A, n, V; J = V = ""; if (!0 === a.p.shrinkToFit && !0 === a.p.forceFit) for (e = a.p.colModel.length - 1; 0 <= e; e--) if (!a.p.colModel[e].hidden) { a.p.colModel[e].resizable = !1; break } "horizontal" == a.p.viewsortcols[1] && (V = " ui-i-asc", J = " ui-i-desc"); ka = k ? "class='ui-th-div-ie'" : ""; V = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" + V + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + i + "'></span>" +
("<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + J + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + i + "'></span></span>"); for (e = 0; e < this.p.colNames.length; e++) J = a.p.headertitles ? ' title="' + b.jgrid.stripHtml(a.p.colNames[e]) + '"' : "", x += "<th id='" + a.p.id + "_" + a.p.colModel[e].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + i + "'" + J + ">", J = a.p.colModel[e].index || a.p.colModel[e].name, x += "<div id='jqgh_" + a.p.id + "_" + a.p.colModel[e].name + "' " + ka + ">" + a.p.colNames[e],
a.p.colModel[e].width = a.p.colModel[e].width ? parseInt(a.p.colModel[e].width, 10) : 150, "boolean" !== typeof a.p.colModel[e].title && (a.p.colModel[e].title = !0), J == a.p.sortname && (a.p.lastsort = e), x += V + "</div></th>"; V = null; b(this).append(x + "</tr></thead>"); b("thead tr:first th", this).hover(function () { b(this).addClass("ui-state-hover") }, function () { b(this).removeClass("ui-state-hover") }); if (this.p.multiselect) {
                            var fa = [], W; b("#cb_" + b.jgrid.jqID(a.p.id), this).bind("click", function () {
                                a.p.selarrrow = []; var c = a.p.frozenColumns ===
true ? a.p.id + "_frozen" : ""; if (this.checked) {
                                    b(a.rows).each(function (d) {
                                        if (d > 0 && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("jqgroup") && !b(this).hasClass("ui-state-disabled")) {
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp ? "prop" : "attr"]("checked", true); b(this).addClass("ui-state-highlight").attr("aria-selected", "true"); a.p.selarrrow.push(this.id); a.p.selrow = this.id; if (c) {
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp ? "prop" : "attr"]("checked",
true); b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).addClass("ui-state-highlight")
                                            } 
                                        } 
                                    }); W = true; fa = []
                                } else {
                                    b(a.rows).each(function (d) {
                                        if (d > 0 && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("ui-state-disabled")) {
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp ? "prop" : "attr"]("checked", false); b(this).removeClass("ui-state-highlight").attr("aria-selected", "false"); fa.push(this.id); if (c) {
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp ? "prop" : "attr"]("checked",
false); b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).removeClass("ui-state-highlight")
                                            } 
                                        } 
                                    }); a.p.selrow = null; W = false
                                } b(a).triggerHandler("jqGridSelectAll", [W ? a.p.selarrrow : fa, W]); b.isFunction(a.p.onSelectAll) && a.p.onSelectAll.call(a, W ? a.p.selarrrow : fa, W)
                            })
                        } !0 === a.p.autowidth && (x = b(m).innerWidth(), a.p.width = 0 < x ? x : "nw"); (function () {
                            var d = 0, e = b.jgrid.cellWidth() ? 0 : o(a.p.cellLayout, 0), f = 0, h, i = o(a.p.scrollOffset, 0), j, k = false, l, m = 0, n = 0, p; b.each(a.p.colModel, function () {
                                if (typeof this.hidden === "undefined") this.hidden =
false; this.widthOrg = j = o(this.width, 0); if (this.hidden === false) { d = d + (j + e); this.fixed ? m = m + (j + e) : f++; n++ } 
                            }); if (isNaN(a.p.width)) a.p.width = d + (a.p.shrinkToFit === false && !isNaN(a.p.height) ? i : 0); c.width = a.p.width; a.p.tblwidth = d; if (a.p.shrinkToFit === false && a.p.forceFit === true) a.p.forceFit = false; if (a.p.shrinkToFit === true && f > 0) {
                                l = c.width - e * f - m; if (!isNaN(a.p.height)) { l = l - i; k = true } d = 0; b.each(a.p.colModel, function (b) {
                                    if (this.hidden === false && !this.fixed) {
                                        this.width = j = Math.round(l * this.width / (a.p.tblwidth - e * f - m));
                                        d = d + j; h = b
                                    } 
                                }); p = 0; k ? c.width - m - (d + e * f) !== i && (p = c.width - m - (d + e * f) - i) : !k && Math.abs(c.width - m - (d + e * f)) !== 1 && (p = c.width - m - (d + e * f)); a.p.colModel[h].width = a.p.colModel[h].width + p; a.p.tblwidth = d + p + e * f + m; if (a.p.tblwidth > a.p.width) { a.p.colModel[h].width = a.p.colModel[h].width - (a.p.tblwidth - parseInt(a.p.width, 10)); a.p.tblwidth = a.p.width } 
                            } 
                        })(); b(m).css("width", c.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" + a.p.id + "'>&#160;</div>"); b(j).css("width", c.width + "px"); var x = b("thead:first", a).get(0),
P = ""; a.p.footerrow && (P += "<table role='grid' style='width:" + a.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" + i + "'>"); var j = b("tr:first", x), X = "<tr class='jqgfirstrow' role='row' style='height:auto'>"; a.p.disableClick = !1; b("th", j).each(function (d) {
    da = a.p.colModel[d].width; if (typeof a.p.colModel[d].resizable === "undefined") a.p.colModel[d].resizable = true; if (a.p.colModel[d].resizable) {
        aa = document.createElement("span");
        b(aa).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-" + i); b.browser.opera || b(aa).css("cursor", "col-resize"); b(this).addClass(a.p.resizeclass)
    } else aa = ""; b(this).css("width", da + "px").prepend(aa); var e = ""; if (a.p.colModel[d].hidden) { b(this).css("display", "none"); e = "display:none;" } X = X + ("<td role='gridcell' style='height:0px;width:" + da + "px;" + e + "'></td>"); c.headers[d] = { width: da, el: this }; ea = a.p.colModel[d].sortable; if (typeof ea !== "boolean") ea = a.p.colModel[d].sortable = true; e = a.p.colModel[d].name;
    e == "cb" || (e == "subgrid" || e == "rn") || a.p.viewsortcols[2] && b(">div", this).addClass("ui-jqgrid-sortable"); if (ea) if (a.p.viewsortcols[0]) { b("div span.s-ico", this).show(); d == a.p.lastsort && b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled") } else if (d == a.p.lastsort) { b("div span.s-ico", this).show(); b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled") } a.p.footerrow && (P = P + ("<td role='gridcell' " + p(d, 0, "", null, "", false) + ">&#160;</td>"))
}).mousedown(function (d) {
    if (b(d.target).closest("th>span.ui-jqgrid-resize").length ==
1) { var e = ja(this); if (a.p.forceFit === true) { var f = a.p, h = e, i; for (i = e + 1; i < a.p.colModel.length; i++) if (a.p.colModel[i].hidden !== true) { h = i; break } f.nv = h - e } c.dragStart(e, d, na(e)); return false } 
}).click(function (c) { if (a.p.disableClick) return a.p.disableClick = false; var d = "th>div.ui-jqgrid-sortable", e, f; a.p.viewsortcols[2] || (d = "th>div>span>span.ui-grid-ico-sort"); c = b(c.target).closest(d); if (c.length == 1) { d = ja(this); if (!a.p.viewsortcols[2]) { e = true; f = c.attr("sort") } ia(b("div", this)[0].id, d, e, f); return false } }); if (a.p.sortable &&
b.fn.sortable) try { b(a).jqGrid("sortableColumns", j) } catch (ra) { } a.p.footerrow && (P += "</tr></tbody></table>"); X += "</tr>"; this.appendChild(document.createElement("tbody")); b(this).addClass("ui-jqgrid-btable").append(X); var X = null, j = b("<table class='ui-jqgrid-htable' style='width:" + a.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(x), D = a.p.caption && !0 === a.p.hiddengrid ? !0 : !1; e = b("<div class='ui-jqgrid-hbox" + ("rtl" == i ? "-rtl" : "") +
"'></div>"); x = null; c.hDiv = document.createElement("div"); b(c.hDiv).css({ width: c.width + "px" }).addClass("ui-state-default ui-jqgrid-hdiv").append(e); b(e).append(j); j = null; D && b(c.hDiv).hide(); a.p.pager && ("string" == typeof a.p.pager ? "#" != a.p.pager.substr(0, 1) && (a.p.pager = "#" + a.p.pager) : a.p.pager = "#" + b(a.p.pager).attr("id"), b(a.p.pager).css({ width: c.width + "px" }).appendTo(m).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom"), D && b(a.p.pager).hide(), l(a.p.pager, "")); !1 === a.p.cellEdit && !0 === a.p.hoverrows &&
b(a).bind("mouseover", function (a) { n = b(a.target).closest("tr.jqgrow"); b(n).attr("class") !== "ui-subgrid" && b(n).addClass("ui-state-hover") }).bind("mouseout", function (a) { n = b(a.target).closest("tr.jqgrow"); b(n).removeClass("ui-state-hover") }); var t, H, ga; b(a).before(c.hDiv).click(function (c) {
    A = c.target; n = b(A, a.rows).closest("tr.jqgrow"); if (b(n).length === 0 || n[0].className.indexOf("ui-state-disabled") > -1 || (b(A, a).closest("table.ui-jqgrid-btable").attr("id") || "").replace("_frozen", "") !== a.id) return this; var d =
b(A).hasClass("cbox"), e = b(a).triggerHandler("jqGridBeforeSelectRow", [n[0].id, c]); (e = e === false || e === "stop" ? false : true) && b.isFunction(a.p.beforeSelectRow) && (e = a.p.beforeSelectRow.call(a, n[0].id, c)); if (!(A.tagName == "A" || (A.tagName == "INPUT" || A.tagName == "TEXTAREA" || A.tagName == "OPTION" || A.tagName == "SELECT") && !d) && e === true) {
        t = n[0].id; H = b.jgrid.getCellIndex(A); ga = b(A).closest("td,th").html(); b(a).triggerHandler("jqGridCellSelect", [t, H, ga, c]); b.isFunction(a.p.onCellSelect) && a.p.onCellSelect.call(a, t, H, ga,
c); if (a.p.cellEdit === true) if (a.p.multiselect && d) b(a).jqGrid("setSelection", t, true, c); else { t = n[0].rowIndex; try { b(a).jqGrid("editCell", t, H, true) } catch (f) { } } else if (a.p.multikey) if (c[a.p.multikey]) b(a).jqGrid("setSelection", t, true, c); else { if (a.p.multiselect && d) { d = b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + t).is(":checked"); b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + t)[a.p.useProp ? "prop" : "attr"]("checked", d) } } else {
            if (a.p.multiselect && a.p.multiboxonly && !d) {
                var g = a.p.frozenColumns ? a.p.id + "_frozen" : ""; b(a.p.selarrrow).each(function (c,
d) { var e = a.rows.namedItem(d); b(e).removeClass("ui-state-highlight"); b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d))[a.p.useProp ? "prop" : "attr"]("checked", false); if (g) { b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(g)).removeClass("ui-state-highlight"); b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(g))[a.p.useProp ? "prop" : "attr"]("checked", false) } }); a.p.selarrrow = []
            } b(a).jqGrid("setSelection", t, true, c)
        } 
    } 
}).bind("reloadGrid", function (c, d) {
    if (a.p.treeGrid === true) a.p.datatype = a.p.treedatatype;
    d && d.current && a.grid.selectionPreserver(a); if (a.p.datatype == "local") { b(a).jqGrid("resetSelection"); a.p.data.length && Q() } else if (!a.p.treeGrid) { a.p.selrow = null; if (a.p.multiselect) { a.p.selarrrow = []; ca(false) } a.p.savedRow = [] } a.p.scroll && M.call(a, true, false); if (d && d.page) { var e = d.page; if (e > a.p.lastpage) e = a.p.lastpage; e < 1 && (e = 1); a.p.page = e; a.grid.bDiv.scrollTop = a.grid.prevRowHeight ? (e - 1) * a.grid.prevRowHeight * a.p.rowNum : 0 } if (a.grid.prevRowHeight && a.p.scroll) { delete a.p.lastpage; a.grid.populateVisible() } else a.grid.populate();
    a.p._inlinenav === true && b(a).jqGrid("showAddEditButtons"); return false
}).dblclick(function (c) { A = c.target; n = b(A, a.rows).closest("tr.jqgrow"); if (b(n).length !== 0) { t = n[0].rowIndex; H = b.jgrid.getCellIndex(A); b(a).triggerHandler("jqGridDblClickRow", [b(n).attr("id"), t, H, c]); b.isFunction(this.p.ondblClickRow) && a.p.ondblClickRow.call(a, b(n).attr("id"), t, H, c) } }).bind("contextmenu", function (c) {
    A = c.target; n = b(A, a.rows).closest("tr.jqgrow"); if (b(n).length !== 0) {
        a.p.multiselect || b(a).jqGrid("setSelection", n[0].id,
true, c); t = n[0].rowIndex; H = b.jgrid.getCellIndex(A); b(a).triggerHandler("jqGridRightClickRow", [b(n).attr("id"), t, H, c]); b.isFunction(this.p.onRightClickRow) && a.p.onRightClickRow.call(a, b(n).attr("id"), t, H, c)
    } 
}); c.bDiv = document.createElement("div"); k && "auto" === ("" + a.p.height).toLowerCase() && (a.p.height = "100%"); b(c.bDiv).append(b('<div style="position:relative;' + (k && 8 > b.browser.version ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({ height: a.p.height +
(isNaN(a.p.height) ? "" : "px"), width: c.width + "px"
}).scroll(c.scrollGrid); b("table:first", c.bDiv).css({ width: a.p.tblwidth + "px" }); k ? (2 == b("tbody", this).length && b("tbody:gt(0)", this).remove(), a.p.multikey && b(c.bDiv).bind("selectstart", function () { return false })) : a.p.multikey && b(c.bDiv).bind("mousedown", function () { return false }); D && b(c.bDiv).hide(); c.cDiv = document.createElement("div"); var ha = !0 === a.p.hidegrid ? b("<a role='link' href='javascript:void(0)'/>").addClass("ui-jqgrid-titlebar-close HeaderButton").hover(function () { ha.addClass("ui-state-hover") },
function () { ha.removeClass("ui-state-hover") }).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css("rtl" == i ? "left" : "right", "0px") : ""; b(c.cDiv).append(ha).append("<span class='ui-jqgrid-title" + ("rtl" == i ? "-rtl" : "") + "'>" + a.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix"); b(c.cDiv).insertBefore(c.hDiv); a.p.toolbar[0] && (c.uDiv = document.createElement("div"), "top" == a.p.toolbar[1] ? b(c.uDiv).insertBefore(c.hDiv) : "bottom" == a.p.toolbar[1] &&
b(c.uDiv).insertAfter(c.hDiv), "both" == a.p.toolbar[1] ? (c.ubDiv = document.createElement("div"), b(c.uDiv).insertBefore(c.hDiv).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id), b(c.ubDiv).insertAfter(c.hDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id), D && b(c.ubDiv).hide()) : b(c.uDiv).width(c.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id), D && b(c.uDiv).hide()); a.p.toppager && (a.p.toppager = b.jgrid.jqID(a.p.id) + "_toppager", c.topDiv = b("<div id='" +
a.p.toppager + "'></div>")[0], a.p.toppager = "#" + a.p.toppager, b(c.topDiv).insertBefore(c.hDiv).addClass("ui-state-default ui-jqgrid-toppager").width(c.width), l(a.p.toppager, "_t")); a.p.footerrow && (c.sDiv = b("<div class='ui-jqgrid-sdiv'></div>")[0], e = b("<div class='ui-jqgrid-hbox" + ("rtl" == i ? "-rtl" : "") + "'></div>"), b(c.sDiv).append(e).insertAfter(c.hDiv).width(c.width), b(e).append(P), c.footers = b(".ui-jqgrid-ftable", c.sDiv)[0].rows[0].cells, a.p.rownumbers && (c.footers[0].className = "ui-state-default jqgrid-rownum"),
D && b(c.sDiv).hide()); e = null; if (a.p.caption) {
                            var oa = a.p.datatype; !0 === a.p.hidegrid && (b(".ui-jqgrid-titlebar-close", c.cDiv).click(function (d) {
                                var e = b.isFunction(a.p.onHeaderClick), f = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv", h, i = this; if (a.p.toolbar[0] === true) { a.p.toolbar[1] == "both" && (f = f + (", #" + b(c.ubDiv).attr("id"))); f = f + (", #" + b(c.uDiv).attr("id")) } h = b(f, "#gview_" + b.jgrid.jqID(a.p.id)).length; a.p.gridstate == "visible" ? b(f, "#gbox_" + b.jgrid.jqID(a.p.id)).slideUp("fast", function () {
                                    h--;
                                    if (h === 0) { b("span", i).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"); a.p.gridstate = "hidden"; b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).hide(); b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, d]); e && (D || a.p.onHeaderClick.call(a, a.p.gridstate, d)) } 
                                }) : a.p.gridstate == "hidden" && b(f, "#gbox_" + b.jgrid.jqID(a.p.id)).slideDown("fast", function () {
                                    h--; if (h === 0) {
                                        b("span", i).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                                        if (D) { a.p.datatype = oa; G(); D = false } a.p.gridstate = "visible"; b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).show(); b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, d]); e && (D || a.p.onHeaderClick.call(a, a.p.gridstate, d))
                                    } 
                                }); return false
                            }), D && (a.p.datatype = "local", b(".ui-jqgrid-titlebar-close", c.cDiv).trigger("click")))
                        } else b(c.cDiv).hide(); b(c.hDiv).after(c.bDiv).mousemove(function (a) { if (c.resizing) { c.dragMove(a); return false } });
                        b(".ui-jqgrid-labels", c.hDiv).bind("selectstart", function () { return false }); b(document).mouseup(function () { if (c.resizing) { c.dragEnd(); return false } return true }); a.formatCol = p; a.sortData = ia; a.updatepager = function (c, d) {
                            var e, f, g, h, i, j, k, l = "", m = a.p.pager ? "_" + b.jgrid.jqID(a.p.pager.substr(1)) : "", n = a.p.toppager ? "_" + a.p.toppager.substr(1) : ""; g = parseInt(a.p.page, 10) - 1; g < 0 && (g = 0); g = g * parseInt(a.p.rowNum, 10); i = g + a.p.reccount; if (a.p.scroll) {
                                e = b("tbody:first > tr:gt(0)", a.grid.bDiv); g = i - e.length; a.p.reccount =
e.length; if (f = e.outerHeight() || a.grid.prevRowHeight) { e = g * f; f = parseInt(a.p.records, 10) * f; b(">div:first", a.grid.bDiv).css({ height: f }).children("div:first").css({ height: e, display: e ? "" : "none" }) } a.grid.bDiv.scrollLeft = a.grid.hDiv.scrollLeft
                            } l = a.p.pager ? a.p.pager : ""; if (l = l + (a.p.toppager ? l ? "," + a.p.toppager : a.p.toppager : "")) {
                                k = b.jgrid.formatter.integer || {}; e = o(a.p.page); f = o(a.p.lastpage); b(".selbox", l)[this.p.useProp ? "prop" : "attr"]("disabled", false); if (a.p.pginput === true) {
                                    b(".ui-pg-input", l).val(a.p.page);
                                    h = a.p.toppager ? "#sp_1" + m + ",#sp_1" + n : "#sp_1" + m; b(h).html(b.fmatter ? b.fmatter.util.NumberFormat(a.p.lastpage, k) : a.p.lastpage)
                                } if (a.p.viewrecords) if (a.p.reccount === 0) b(".ui-paging-info", l).html(a.p.emptyrecords); else { h = g + 1; j = a.p.records; if (b.fmatter) { h = b.fmatter.util.NumberFormat(h, k); i = b.fmatter.util.NumberFormat(i, k); j = b.fmatter.util.NumberFormat(j, k) } b(".ui-paging-info", l).html(b.jgrid.format(a.p.recordtext, h, i, j)) } if (a.p.pgbuttons === true) {
                                    e <= 0 && (e = f = 0); if (e == 1 || e === 0) {
                                        b("#first" + m + ", #prev" + m).addClass("ui-state-disabled").removeClass("ui-state-hover");
                                        a.p.toppager && b("#first_t" + n + ", #prev_t" + n).addClass("ui-state-disabled").removeClass("ui-state-hover")
                                    } else { b("#first" + m + ", #prev" + m).removeClass("ui-state-disabled"); a.p.toppager && b("#first_t" + n + ", #prev_t" + n).removeClass("ui-state-disabled") } if (e == f || e === 0) { b("#next" + m + ", #last" + m).addClass("ui-state-disabled").removeClass("ui-state-hover"); a.p.toppager && b("#next_t" + n + ", #last_t" + n).addClass("ui-state-disabled").removeClass("ui-state-hover") } else {
                                        b("#next" + m + ", #last" + m).removeClass("ui-state-disabled");
                                        a.p.toppager && b("#next_t" + n + ", #last_t" + n).removeClass("ui-state-disabled")
                                    } 
                                } 
                            } c === true && a.p.rownumbers === true && b("td.jqgrid-rownum", a.rows).each(function (a) { b(this).html(g + 1 + a) }); d && a.p.jqgdnd && b(a).jqGrid("gridDnD", "updateDnD"); b(a).triggerHandler("jqGridGridComplete"); b.isFunction(a.p.gridComplete) && a.p.gridComplete.call(a); b(a).triggerHandler("jqGridAfterGridComplete")
                        }; a.refreshIndex = Q; a.setHeadCheckBox = ca; a.constructTr = N; a.formatter = function (a, b, c, d, e) { return u(a, b, c, d, e) }; b.extend(c, { populate: G,
                            emptyRows: M
                        }); this.grid = c; a.addXmlData = function (b) { Z(b, a.grid.bDiv) }; a.addJSONData = function (b) { $(b, a.grid.bDiv) }; this.grid.cols = this.rows[0].cells; G(); a.p.hiddengrid = !1
                    } 
                } 
            } 
        })
    }; b.jgrid.extend({ getGridParam: function (b) { var e = this[0]; if (e && e.grid) return b ? "undefined" != typeof e.p[b] ? e.p[b] : null : e.p }, setGridParam: function (f) { return this.each(function () { this.grid && "object" === typeof f && b.extend(!0, this.p, f) }) }, getDataIDs: function () {
        var f = [], e = 0, c, d = 0; this.each(function () {
            if ((c = this.rows.length) && 0 < c) for (; e <
c; ) b(this.rows[e]).hasClass("jqgrow") && (f[d] = this.rows[e].id, d++), e++
        }); return f
    }, setSelection: function (f, e, c) {
        return this.each(function () {
            var d, a, g, h, i, j; if (void 0 !== f && (e = !1 === e ? !1 : !0, (a = this.rows.namedItem(f + "")) && a.className && !(-1 < a.className.indexOf("ui-state-disabled")))) (!0 === this.p.scrollrows && (g = this.rows.namedItem(f).rowIndex, 0 <= g && (d = b(this.grid.bDiv)[0].clientHeight, h = b(this.grid.bDiv)[0].scrollTop, i = b(this.rows[g]).position().top, g = this.rows[g].clientHeight, i + g >= d + h ? b(this.grid.bDiv)[0].scrollTop =
i - (d + h) + g + h : i < d + h && i < h && (b(this.grid.bDiv)[0].scrollTop = i))), !0 === this.p.frozenColumns && (j = this.p.id + "_frozen"), this.p.multiselect) ? (this.setHeadCheckBox(!1), this.p.selrow = a.id, h = b.inArray(this.p.selrow, this.p.selarrrow), -1 === h ? ("ui-subgrid" !== a.className && b(a).addClass("ui-state-highlight").attr("aria-selected", "true"), d = !0, this.p.selarrrow.push(this.p.selrow)) : ("ui-subgrid" !== a.className && b(a).removeClass("ui-state-highlight").attr("aria-selected", "false"), d = !1, this.p.selarrrow.splice(h, 1), i = this.p.selarrrow[0],
this.p.selrow = void 0 === i ? null : i), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(a.id))[this.p.useProp ? "prop" : "attr"]("checked", d), j && (-1 === h ? b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).addClass("ui-state-highlight") : b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j))[this.p.useProp ? "prop" : "attr"]("checked", d)), b(this).triggerHandler("jqGridSelectRow", [a.id, d, c]), this.p.onSelectRow && e && this.p.onSelectRow.call(this,
a.id, d, c)) : "ui-subgrid" !== a.className && (this.p.selrow != a.id ? (b(this.rows.namedItem(this.p.selrow)).removeClass("ui-state-highlight").attr({ "aria-selected": "false", tabindex: "-1" }), b(a).addClass("ui-state-highlight").attr({ "aria-selected": "true", tabindex: "0" }), j && (b("#" + b.jgrid.jqID(this.p.selrow), "#" + b.jgrid.jqID(j)).removeClass("ui-state-highlight"), b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).addClass("ui-state-highlight")), d = !0) : d = !1, this.p.selrow = a.id, b(this).triggerHandler("jqGridSelectRow", [a.id,
d, c]), this.p.onSelectRow && e && this.p.onSelectRow.call(this, a.id, d, c))
        })
    }, resetSelection: function (f) {
        return this.each(function () {
            var e = this, c, d, a; !0 === e.p.frozenColumns && (a = e.p.id + "_frozen"); if ("undefined" !== typeof f) {
                d = f === e.p.selrow ? e.p.selrow : f; b("#" + b.jgrid.jqID(e.p.id) + " tbody:first tr#" + b.jgrid.jqID(d)).removeClass("ui-state-highlight").attr("aria-selected", "false"); a && b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight"); if (e.p.multiselect) {
                    b("#jqg_" + b.jgrid.jqID(e.p.id) +
"_" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(e.p.id))[e.p.useProp ? "prop" : "attr"]("checked", !1); if (a) b("#jqg_" + b.jgrid.jqID(e.p.id) + "_" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(a))[e.p.useProp ? "prop" : "attr"]("checked", !1); e.setHeadCheckBox(!1)
                } d = null
            } else e.p.multiselect ? (b(e.p.selarrrow).each(function (d, f) {
                c = e.rows.namedItem(f); b(c).removeClass("ui-state-highlight").attr("aria-selected", "false"); b("#jqg_" + b.jgrid.jqID(e.p.id) + "_" + b.jgrid.jqID(f))[e.p.useProp ? "prop" : "attr"]("checked", !1); a && (b("#" + b.jgrid.jqID(f),
"#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(e.p.id) + "_" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(a))[e.p.useProp ? "prop" : "attr"]("checked", !1))
            }), e.setHeadCheckBox(!1), e.p.selarrrow = []) : e.p.selrow && (b("#" + b.jgrid.jqID(e.p.id) + " tbody:first tr#" + b.jgrid.jqID(e.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false"), a && b("#" + b.jgrid.jqID(e.p.selrow), "#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight"), e.p.selrow = null); !0 === e.p.cellEdit && (0 <= parseInt(e.p.iCol,
10) && 0 <= parseInt(e.p.iRow, 10)) && (b("td:eq(" + e.p.iCol + ")", e.rows[e.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(e.rows[e.p.iRow]).removeClass("selected-row ui-state-hover")); e.p.savedRow = []
        })
    }, getRowData: function (f) {
        var e = {}, c, d = !1, a, g = 0; this.each(function () {
            var h = this, i, j; if ("undefined" == typeof f) d = !0, c = [], a = h.rows.length; else { j = h.rows.namedItem(f); if (!j) return e; a = 2 } for (; g < a; ) d && (j = h.rows[g]), b(j).hasClass("jqgrow") && (b('td[role="gridcell"]', j).each(function (a) {
                i = h.p.colModel[a].name; if ("cb" !==
i && "subgrid" !== i && "rn" !== i) if (!0 === h.p.treeGrid && i == h.p.ExpandColumn) e[i] = b.jgrid.htmlDecode(b("span:first", this).html()); else try { e[i] = b.unformat.call(h, this, { rowId: j.id, colModel: h.p.colModel[a] }, a) } catch (c) { e[i] = b.jgrid.htmlDecode(b(this).html()) } 
            }), d && (c.push(e), e = {})), g++
        }); return c ? c : e
    }, delRowData: function (f) {
        var e = !1, c, d; this.each(function () {
            if (c = this.rows.namedItem(f)) {
                if (b(c).remove(), this.p.records--, this.p.reccount--, this.updatepager(!0, !1), e = !0, this.p.multiselect && (d = b.inArray(f, this.p.selarrrow),
-1 != d && this.p.selarrrow.splice(d, 1)), f == this.p.selrow) this.p.selrow = null
            } else return !1; if ("local" == this.p.datatype) { var a = this.p._index[b.jgrid.stripPref(this.p.idPrefix, f)]; "undefined" != typeof a && (this.p.data.splice(a, 1), this.refreshIndex()) } if (!0 === this.p.altRows && e) { var g = this.p.altclass; b(this.rows).each(function (a) { 1 == a % 2 ? b(this).addClass(g) : b(this).removeClass(g) }) } 
        }); return e
    }, setRowData: function (f, e, c) {
        var d, a = !0, g; this.each(function () {
            if (!this.grid) return !1; var h = this, i, j, l = typeof c, k = {};
            j = h.rows.namedItem(f); if (!j) return !1; if (e) try {
                if (b(this.p.colModel).each(function (a) { d = this.name; void 0 !== e[d] && (k[d] = this.formatter && "string" === typeof this.formatter && "date" == this.formatter ? b.unformat.date.call(h, e[d], this) : e[d], i = h.formatter(f, e[d], a, e, "edit"), g = this.title ? { title: b.jgrid.stripHtml(i)} : {}, !0 === h.p.treeGrid && d == h.p.ExpandColumn ? b("td:eq(" + a + ") > span:first", j).html(i).attr(g) : b("td:eq(" + a + ")", j).html(i).attr(g)) }), "local" == h.p.datatype) {
                    var m = b.jgrid.stripPref(h.p.idPrefix, f), o = h.p._index[m];
                    if (h.p.treeGrid) for (var p in h.p.treeReader) k.hasOwnProperty(h.p.treeReader[p]) && delete k[h.p.treeReader[p]]; "undefined" != typeof o && (h.p.data[o] = b.extend(!0, h.p.data[o], k)); k = null
                } 
            } catch (v) { a = !1 } a && ("string" === l ? b(j).addClass(c) : "object" === l && b(j).css(c), b(h).triggerHandler("jqGridAfterGridComplete"))
        }); return a
    }, addRowData: function (f, e, c, d) {
        c || (c = "last"); var a = !1, g, h, i, j, l, k, m, o, p = "", v, u, L, E, Y, T; e && (b.isArray(e) ? (v = !0, c = "last", u = f) : (e = [e], v = !1), this.each(function () {
            var U = e.length; l = this.p.rownumbers ===
true ? 1 : 0; i = this.p.multiselect === true ? 1 : 0; j = this.p.subGrid === true ? 1 : 0; if (!v) if (typeof f != "undefined") f = f + ""; else { f = b.jgrid.randId(); if (this.p.keyIndex !== false) { u = this.p.colModel[this.p.keyIndex + i + j + l].name; typeof e[0][u] != "undefined" && (f = e[0][u]) } } L = this.p.altclass; for (var M = 0, Q = "", N = {}, Z = b.isFunction(this.p.afterInsertRow) ? true : false; M < U; ) {
                E = e[M]; h = []; if (v) { try { f = E[u] } catch ($) { f = b.jgrid.randId() } Q = this.p.altRows === true ? (this.rows.length - 1) % 2 === 0 ? L : "" : "" } T = f; f = this.p.idPrefix + f; if (l) {
                    p = this.formatCol(0,
1, "", null, f, true); h[h.length] = '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + p + ">0</td>"
                } if (i) { o = '<input role="checkbox" type="checkbox" id="jqg_' + this.p.id + "_" + f + '" class="cbox"/>'; p = this.formatCol(l, 1, "", null, f, true); h[h.length] = '<td role="gridcell" ' + p + ">" + o + "</td>" } j && (h[h.length] = b(this).jqGrid("addSubGridCell", i + l, 1)); for (m = i + j + l; m < this.p.colModel.length; m++) {
                    Y = this.p.colModel[m]; g = Y.name; N[g] = E[g]; o = this.formatter(f, b.jgrid.getAccessor(E, g), m, E); p = this.formatCol(m, 1, o, E, f, true);
                    h[h.length] = '<td role="gridcell" ' + p + ">" + o + "</td>"
                } h.unshift(this.constructTr(f, false, Q, N, E, false)); h[h.length] = "</tr>"; if (this.rows.length === 0) b("table:first", this.grid.bDiv).append(h.join("")); else switch (c) {
                    case "last": b(this.rows[this.rows.length - 1]).after(h.join("")); k = this.rows.length - 1; break; case "first": b(this.rows[0]).after(h.join("")); k = 1; break; case "after": (k = this.rows.namedItem(d)) && (b(this.rows[k.rowIndex + 1]).hasClass("ui-subgrid") ? b(this.rows[k.rowIndex + 1]).after(h) : b(k).after(h.join("")));
                        k++; break; case "before": if (k = this.rows.namedItem(d)) { b(k).before(h.join("")); k = k.rowIndex } k--
                } this.p.subGrid === true && b(this).jqGrid("addSubGrid", i + l, k); this.p.records++; this.p.reccount++; b(this).triggerHandler("jqGridAfterInsertRow", [f, E, E]); Z && this.p.afterInsertRow.call(this, f, E, E); M++; if (this.p.datatype == "local") { N[this.p.localReader.id] = T; this.p._index[T] = this.p.data.length; this.p.data.push(N); N = {} } 
            } this.p.altRows === true && !v && (c == "last" ? (this.rows.length - 1) % 2 == 1 && b(this.rows[this.rows.length - 1]).addClass(L) :
b(this.rows).each(function (a) { a % 2 == 1 ? b(this).addClass(L) : b(this).removeClass(L) })); this.updatepager(true, true); a = true
        })); return a
    }, footerData: function (f, e, c) {
        function d(a) { for (var b in a) if (a.hasOwnProperty(b)) return !1; return !0 } var a, g = !1, h = {}, i; "undefined" == typeof f && (f = "get"); "boolean" != typeof c && (c = !0); f = f.toLowerCase(); this.each(function () {
            var j = this, l; if (!j.grid || !j.p.footerrow || "set" == f && d(e)) return !1; g = !0; b(this.p.colModel).each(function (d) {
                a = this.name; "set" == f ? void 0 !== e[a] && (l = c ? j.formatter("",
e[a], d, e, "edit") : e[a], i = this.title ? { title: b.jgrid.stripHtml(l)} : {}, b("tr.footrow td:eq(" + d + ")", j.grid.sDiv).html(l).attr(i), g = !0) : "get" == f && (h[a] = b("tr.footrow td:eq(" + d + ")", j.grid.sDiv).html())
            })
        }); return "get" == f ? h : g
    }, showHideCol: function (f, e) {
        return this.each(function () {
            var c = this, d = !1, a = b.jgrid.cellWidth() ? 0 : c.p.cellLayout, g; if (c.grid) {
                "string" === typeof f && (f = [f]); e = "none" != e ? "" : "none"; var h = "" === e ? !0 : !1, i = c.p.groupHeader && ("object" === typeof c.p.groupHeader || b.isFunction(c.p.groupHeader)); i && b(c).jqGrid("destroyGroupHeader",
!1); b(this.p.colModel).each(function (i) {
    if (-1 !== b.inArray(this.name, f) && this.hidden === h) {
        if (!0 === c.p.frozenColumns && !0 === this.frozen) return !0; b("tr", c.grid.hDiv).each(function () { b(this.cells[i]).css("display", e) }); b(c.rows).each(function () { b(this).hasClass("jqgroup") || b(this.cells[i]).css("display", e) }); c.p.footerrow && b("tr.footrow td:eq(" + i + ")", c.grid.sDiv).css("display", e); g = parseInt(this.width, 10); c.p.tblwidth = "none" === e ? c.p.tblwidth - (g + a) : c.p.tblwidth + (g + a); this.hidden = !h; d = !0; b(c).triggerHandler("jqGridShowHideCol",
[h, this.name, i])
    } 
}); !0 === d && (!0 === c.p.shrinkToFit && !isNaN(c.p.height) && (c.p.tblwidth += parseInt(c.p.scrollOffset, 10)), b(c).jqGrid("setGridWidth", !0 === c.p.shrinkToFit ? c.p.tblwidth : c.p.width)); i && b(c).jqGrid("setGroupHeaders", c.p.groupHeader)
            } 
        })
    }, hideCol: function (f) { return this.each(function () { b(this).jqGrid("showHideCol", f, "none") }) }, showCol: function (f) { return this.each(function () { b(this).jqGrid("showHideCol", f, "") }) }, remapColumns: function (f, e, c) {
        function d(a) {
            var c; c = a.length ? b.makeArray(a) : b.extend({},
a); b.each(f, function (b) { a[b] = c[this] })
        } function a(a, c) { b(">tr" + (c || ""), a).each(function () { var a = this, c = b.makeArray(a.cells); b.each(f, function () { var b = c[this]; b && a.appendChild(b) }) }) } var g = this.get(0); d(g.p.colModel); d(g.p.colNames); d(g.grid.headers); a(b("thead:first", g.grid.hDiv), c && ":not(.ui-jqgrid-labels)"); e && a(b("#" + b.jgrid.jqID(g.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot"); g.p.footerrow && a(b("tbody:first", g.grid.sDiv)); g.p.remapColumns && (g.p.remapColumns.length ? d(g.p.remapColumns) :
g.p.remapColumns = b.makeArray(f)); g.p.lastsort = b.inArray(g.p.lastsort, f); g.p.treeGrid && (g.p.expColInd = b.inArray(g.p.expColInd, f)); b(g).triggerHandler("jqGridRemapColumns", [f, e, c])
    }, setGridWidth: function (f, e) {
        return this.each(function () {
            if (this.grid) {
                var c = this, d, a = 0, g = b.jgrid.cellWidth() ? 0 : c.p.cellLayout, h, i = 0, j = !1, l = c.p.scrollOffset, k, m = 0, o = 0, p; "boolean" != typeof e && (e = c.p.shrinkToFit); if (!isNaN(f)) {
                    f = parseInt(f, 10); c.grid.width = c.p.width = f; b("#gbox_" + b.jgrid.jqID(c.p.id)).css("width", f + "px"); b("#gview_" +
b.jgrid.jqID(c.p.id)).css("width", f + "px"); b(c.grid.bDiv).css("width", f + "px"); b(c.grid.hDiv).css("width", f + "px"); c.p.pager && b(c.p.pager).css("width", f + "px"); c.p.toppager && b(c.p.toppager).css("width", f + "px"); !0 === c.p.toolbar[0] && (b(c.grid.uDiv).css("width", f + "px"), "both" == c.p.toolbar[1] && b(c.grid.ubDiv).css("width", f + "px")); c.p.footerrow && b(c.grid.sDiv).css("width", f + "px"); !1 === e && !0 === c.p.forceFit && (c.p.forceFit = !1); if (!0 === e) {
                        b.each(c.p.colModel, function () {
                            if (this.hidden === false) {
                                d = this.widthOrg;
                                a = a + (d + g); this.fixed ? m = m + (d + g) : i++; o++
                            } 
                        }); if (0 === i) return; c.p.tblwidth = a; k = f - g * i - m; if (!isNaN(c.p.height) && (b(c.grid.bDiv)[0].clientHeight < b(c.grid.bDiv)[0].scrollHeight || 1 === c.rows.length)) j = !0, k -= l; var a = 0, v = 0 < c.grid.cols.length; b.each(c.p.colModel, function (b) {
                            if (this.hidden === false && !this.fixed) {
                                d = this.widthOrg; d = Math.round(k * d / (c.p.tblwidth - g * i - m)); if (!(d < 0)) {
                                    this.width = d; a = a + d; c.grid.headers[b].width = d; c.grid.headers[b].el.style.width = d + "px"; if (c.p.footerrow) c.grid.footers[b].style.width = d + "px";
                                    if (v) c.grid.cols[b].style.width = d + "px"; h = b
                                } 
                            } 
                        }); if (!h) return; p = 0; j ? f - m - (a + g * i) !== l && (p = f - m - (a + g * i) - l) : 1 !== Math.abs(f - m - (a + g * i)) && (p = f - m - (a + g * i)); c.p.colModel[h].width += p; c.p.tblwidth = a + p + g * i + m; c.p.tblwidth > f ? (j = c.p.tblwidth - parseInt(f, 10), c.p.tblwidth = f, d = c.p.colModel[h].width -= j) : d = c.p.colModel[h].width; c.grid.headers[h].width = d; c.grid.headers[h].el.style.width = d + "px"; v && (c.grid.cols[h].style.width = d + "px"); c.p.footerrow && (c.grid.footers[h].style.width = d + "px")
                    } c.p.tblwidth && (b("table:first", c.grid.bDiv).css("width",
c.p.tblwidth + "px"), b("table:first", c.grid.hDiv).css("width", c.p.tblwidth + "px"), c.grid.hDiv.scrollLeft = c.grid.bDiv.scrollLeft, c.p.footerrow && b("table:first", c.grid.sDiv).css("width", c.p.tblwidth + "px"))
                } 
            } 
        })
    }, setGridHeight: function (f) { return this.each(function () { if (this.grid) { var e = b(this.grid.bDiv); e.css({ height: f + (isNaN(f) ? "" : "px") }); !0 === this.p.frozenColumns && b("#" + b.jgrid.jqID(this.p.id) + "_frozen").parent().height(e.height() - 16); this.p.height = f; this.p.scroll && this.grid.populateVisible() } }) }, setCaption: function (f) {
        return this.each(function () {
            this.p.caption =
f; b("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl", this.grid.cDiv).html(f); b(this.grid.cDiv).show()
        })
    }, setLabel: function (f, e, c, d) {
        return this.each(function () {
            var a = -1; if (this.grid && "undefined" != typeof f && (b(this.p.colModel).each(function (b) { if (this.name == f) return a = b, !1 }), 0 <= a)) {
                var g = b("tr.ui-jqgrid-labels th:eq(" + a + ")", this.grid.hDiv); if (e) { var h = b(".s-ico", g); b("[id^=jqgh_]", g).empty().html(e).append(h); this.p.colNames[a] = e } c && ("string" === typeof c ? b(g).addClass(c) : b(g).css(c)); "object" === typeof d &&
b(g).attr(d)
            } 
        })
    }, setCell: function (f, e, c, d, a, g) {
        return this.each(function () {
            var h = -1, i, j; if (this.grid && (isNaN(e) ? b(this.p.colModel).each(function (a) { if (this.name == e) return h = a, !1 }) : h = parseInt(e, 10), 0 <= h && (i = this.rows.namedItem(f)))) {
                var l = b("td:eq(" + h + ")", i); if ("" !== c || !0 === g) i = this.formatter(f, c, h, i, "edit"), j = this.p.colModel[h].title ? { title: b.jgrid.stripHtml(i)} : {}, this.p.treeGrid && 0 < b(".tree-wrap", b(l)).length ? b("span", b(l)).html(i).attr(j) : b(l).html(i).attr(j), "local" == this.p.datatype && (i = this.p.colModel[h],
c = i.formatter && "string" === typeof i.formatter && "date" == i.formatter ? b.unformat.date.call(this, c, i) : c, j = this.p._index[f], "undefined" != typeof j && (this.p.data[j][i.name] = c)); "string" === typeof d ? b(l).addClass(d) : d && b(l).css(d); "object" === typeof a && b(l).attr(a)
            } 
        })
    }, getCell: function (f, e) {
        var c = !1; this.each(function () {
            var d = -1; if (this.grid && (isNaN(e) ? b(this.p.colModel).each(function (a) { if (this.name === e) return d = a, !1 }) : d = parseInt(e, 10), 0 <= d)) {
                var a = this.rows.namedItem(f); if (a) try {
                    c = b.unformat.call(this, b("td:eq(" +
d + ")", a), { rowId: a.id, colModel: this.p.colModel[d] }, d)
                } catch (g) { c = b.jgrid.htmlDecode(b("td:eq(" + d + ")", a).html()) } 
            } 
        }); return c
    }, getCol: function (f, e, c) {
        var d = [], a, g = 0, h, i, j, e = "boolean" != typeof e ? !1 : e; "undefined" == typeof c && (c = !1); this.each(function () {
            var l = -1; if (this.grid && (isNaN(f) ? b(this.p.colModel).each(function (a) { if (this.name === f) return l = a, !1 }) : l = parseInt(f, 10), 0 <= l)) {
                var k = this.rows.length, m = 0; if (k && 0 < k) {
                    for (; m < k; ) {
                        if (b(this.rows[m]).hasClass("jqgrow")) {
                            try {
                                a = b.unformat.call(this, b(this.rows[m].cells[l]),
{ rowId: this.rows[m].id, colModel: this.p.colModel[l] }, l)
                            } catch (o) { a = b.jgrid.htmlDecode(this.rows[m].cells[l].innerHTML) } c ? (j = parseFloat(a), g += j, void 0 === i && (i = h = j), h = Math.min(h, j), i = Math.max(i, j)) : e ? d.push({ id: this.rows[m].id, value: a }) : d.push(a)
                        } m++
                    } if (c) switch (c.toLowerCase()) { case "sum": d = g; break; case "avg": d = g / k; break; case "count": d = k; break; case "min": d = h; break; case "max": d = i } 
                } 
            } 
        }); return d
    }, clearGridData: function (f) {
        return this.each(function () {
            if (this.grid) {
                "boolean" != typeof f && (f = !1); if (this.p.deepempty) b("#" +
b.jgrid.jqID(this.p.id) + " tbody:first tr:gt(0)").remove(); else { var e = b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:first")[0]; b("#" + b.jgrid.jqID(this.p.id) + " tbody:first").empty().append(e) } this.p.footerrow && f && b(".ui-jqgrid-ftable td", this.grid.sDiv).html("&#160;"); this.p.selrow = null; this.p.selarrrow = []; this.p.savedRow = []; this.p.records = 0; this.p.page = 1; this.p.lastpage = 0; this.p.reccount = 0; this.p.data = []; this.p._index = {}; this.updatepager(!0, !1)
            } 
        })
    }, getInd: function (b, e) {
        var c = !1, d; this.each(function () {
            (d =
this.rows.namedItem(b)) && (c = !0 === e ? d : d.rowIndex)
        }); return c
    }, bindKeys: function (f) {
        var e = b.extend({ onEnter: null, onSpace: null, onLeftKey: null, onRightKey: null, scrollingRows: !0 }, f || {}); return this.each(function () {
            var c = this; b("body").is("[role]") || b("body").attr("role", "application"); c.p.scrollrows = e.scrollingRows; b(c).keydown(function (d) {
                var a = b(c).find("tr[tabindex=0]")[0], f, h, i, j = c.p.treeReader.expanded_field; if (a) if (i = c.p._index[a.id], 37 === d.keyCode || 38 === d.keyCode || 39 === d.keyCode || 40 === d.keyCode) {
                    if (38 ===
d.keyCode) { h = a.previousSibling; f = ""; if (h) if (b(h).is(":hidden")) for (; h; ) { if (h = h.previousSibling, !b(h).is(":hidden") && b(h).hasClass("jqgrow")) { f = h.id; break } } else f = h.id; b(c).jqGrid("setSelection", f, !0, d); d.preventDefault() } if (40 === d.keyCode) { h = a.nextSibling; f = ""; if (h) if (b(h).is(":hidden")) for (; h; ) { if (h = h.nextSibling, !b(h).is(":hidden") && b(h).hasClass("jqgrow")) { f = h.id; break } } else f = h.id; b(c).jqGrid("setSelection", f, !0, d); d.preventDefault() } 37 === d.keyCode && (c.p.treeGrid && c.p.data[i][j] && b(a).find("div.treeclick").trigger("click"),
b(c).triggerHandler("jqGridKeyLeft", [c.p.selrow]), b.isFunction(e.onLeftKey) && e.onLeftKey.call(c, c.p.selrow)); 39 === d.keyCode && (c.p.treeGrid && !c.p.data[i][j] && b(a).find("div.treeclick").trigger("click"), b(c).triggerHandler("jqGridKeyRight", [c.p.selrow]), b.isFunction(e.onRightKey) && e.onRightKey.call(c, c.p.selrow))
                } else 13 === d.keyCode ? (b(c).triggerHandler("jqGridKeyEnter", [c.p.selrow]), b.isFunction(e.onEnter) && e.onEnter.call(c, c.p.selrow)) : 32 === d.keyCode && (b(c).triggerHandler("jqGridKeySpace", [c.p.selrow]),
b.isFunction(e.onSpace) && e.onSpace.call(c, c.p.selrow))
            })
        })
    }, unbindKeys: function () { return this.each(function () { b(this).unbind("keydown") }) }, getLocalRow: function (b) { var e = !1, c; this.each(function () { "undefined" !== typeof b && (c = this.p._index[b], 0 <= c && (e = this.p.data[c])) }); return e } 
    })
})(jQuery);
(function (c) {
    c.fmatter = {}; c.extend(c.fmatter, { isBoolean: function (a) { return "boolean" === typeof a }, isObject: function (a) { return a && ("object" === typeof a || c.isFunction(a)) || !1 }, isString: function (a) { return "string" === typeof a }, isNumber: function (a) { return "number" === typeof a && isFinite(a) }, isNull: function (a) { return null === a }, isUndefined: function (a) { return "undefined" === typeof a }, isValue: function (a) { return this.isObject(a) || this.isString(a) || this.isNumber(a) || this.isBoolean(a) }, isEmpty: function (a) {
        if (!this.isString(a) &&
this.isValue(a)) return !1; if (!this.isValue(a)) return !0; a = c.trim(a).replace(/\&nbsp\;/ig, "").replace(/\&#160\;/ig, ""); return "" === a
    } 
    }); c.fn.fmatter = function (a, b, f, d, e) { var g = b, f = c.extend({}, c.jgrid.formatter, f); try { g = c.fn.fmatter[a].call(this, b, f, d, e) } catch (h) { } return g }; c.fmatter.util = { NumberFormat: function (a, b) {
        c.fmatter.isNumber(a) || (a *= 1); if (c.fmatter.isNumber(a)) {
            var f = 0 > a, d = a + "", e = b.decimalSeparator ? b.decimalSeparator : ".", g; if (c.fmatter.isNumber(b.decimalPlaces)) {
                var h = b.decimalPlaces, d = Math.pow(10,
h), d = Math.round(a * d) / d + ""; g = d.lastIndexOf("."); if (0 < h) { 0 > g ? (d += e, g = d.length - 1) : "." !== e && (d = d.replace(".", e)); for (; d.length - 1 - g < h; ) d += "0" } 
            } if (b.thousandsSeparator) { h = b.thousandsSeparator; g = d.lastIndexOf(e); g = -1 < g ? g : d.length; for (var e = d.substring(g), i = -1, j = g; 0 < j; j--) { i++; if (0 === i % 3 && j !== g && (!f || 1 < j)) e = h + e; e = d.charAt(j - 1) + e } d = e } d = b.prefix ? b.prefix + d : d; return d = b.suffix ? d + b.suffix : d
        } return a
    }, DateFormat: function (a, b, f, d) {
        var e = /^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/, g = "string" ===
typeof b ? b.match(e) : null, e = function (a, b) { a = "" + a; for (b = parseInt(b, 10) || 2; a.length < b; ) a = "0" + a; return a }, h = { m: 1, d: 1, y: 1970, h: 0, i: 0, s: 0, u: 0 }, i = 0, j, k = ["i18n"]; k.i18n = { dayNames: d.dayNames, monthNames: d.monthNames }; a in d.masks && (a = d.masks[a]); if (!isNaN(b - 0) && "u" == ("" + a).toLowerCase()) i = new Date(1E3 * parseFloat(b)); else if (b.constructor === Date) i = b; else if (null !== g) i = new Date(parseInt(g[1], 10)), g[3] && (a = 60 * Number(g[5]) + Number(g[6]), a *= "-" == g[4] ? 1 : -1, a -= i.getTimezoneOffset(), i.setTime(Number(Number(i) + 6E4 * a)));
        else { b = ("" + b).split(/[\\\/:_;.,\t\T\s-]/); a = a.split(/[\\\/:_;.,\t\T\s-]/); g = 0; for (j = a.length; g < j; g++) "M" == a[g] && (i = c.inArray(b[g], k.i18n.monthNames), -1 !== i && 12 > i && (b[g] = i + 1)), "F" == a[g] && (i = c.inArray(b[g], k.i18n.monthNames), -1 !== i && 11 < i && (b[g] = i + 1 - 12)), b[g] && (h[a[g].toLowerCase()] = parseInt(b[g], 10)); h.f && (h.m = h.f); if (0 === h.m && 0 === h.y && 0 === h.d) return "&#160;"; h.m = parseInt(h.m, 10) - 1; i = h.y; 70 <= i && 99 >= i ? h.y = 1900 + h.y : 0 <= i && 69 >= i && (h.y = 2E3 + h.y); i = new Date(h.y, h.m, h.d, h.h, h.i, h.s, h.u) } f in d.masks ? f = d.masks[f] :
f || (f = "Y-m-d"); a = i.getHours(); b = i.getMinutes(); h = i.getDate(); g = i.getMonth() + 1; j = i.getTimezoneOffset(); var l = i.getSeconds(), r = i.getMilliseconds(), n = i.getDay(), m = i.getFullYear(), o = (n + 6) % 7 + 1, p = (new Date(m, g - 1, h) - new Date(m, 0, 1)) / 864E5, q = { d: e(h), D: k.i18n.dayNames[n], j: h, l: k.i18n.dayNames[n + 7], N: o, S: d.S(h), w: n, z: p, W: 5 > o ? Math.floor((p + o - 1) / 7) + 1 : Math.floor((p + o - 1) / 7) || (4 > ((new Date(m - 1, 0, 1)).getDay() + 6) % 7 ? 53 : 52), F: k.i18n.monthNames[g - 1 + 12], m: e(g), M: k.i18n.monthNames[g - 1], n: g, t: "?", L: "?", o: "?", Y: m, y: ("" +
m).substring(2), a: 12 > a ? d.AmPm[0] : d.AmPm[1], A: 12 > a ? d.AmPm[2] : d.AmPm[3], B: "?", g: a % 12 || 12, G: a, h: e(a % 12 || 12), H: e(a), i: e(b), s: e(l), u: r, e: "?", I: "?", O: (0 < j ? "-" : "+") + e(100 * Math.floor(Math.abs(j) / 60) + Math.abs(j) % 60, 4), P: "?", T: (("" + i).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g) || [""]).pop().replace(/[^-+\dA-Z]/g, ""), Z: "?", c: "?", r: "?", U: Math.floor(i / 1E3)
}; return f.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,
function (a) { return a in q ? q[a] : a.substring(1) })
    } 
    }; c.fn.fmatter.defaultFormat = function (a, b) { return c.fmatter.isValue(a) && "" !== a ? a : b.defaultValue ? b.defaultValue : "&#160;" }; c.fn.fmatter.email = function (a, b) { return c.fmatter.isEmpty(a) ? c.fn.fmatter.defaultFormat(a, b) : '<a href="mailto:' + a + '">' + a + "</a>" }; c.fn.fmatter.checkbox = function (a, b) {
        var f = c.extend({}, b.checkbox), d; void 0 !== b.colModel && !c.fmatter.isUndefined(b.colModel.formatoptions) && (f = c.extend({}, f, b.colModel.formatoptions)); d = !0 === f.disabled ? 'disabled="disabled"' :
""; if (c.fmatter.isEmpty(a) || c.fmatter.isUndefined(a)) a = c.fn.fmatter.defaultFormat(a, f); a = (a + "").toLowerCase(); return '<input type="checkbox" ' + (0 > a.search(/(false|0|no|off)/i) ? " checked='checked' " : "") + ' value="' + a + '" offval="no" ' + d + "/>"
    }; c.fn.fmatter.link = function (a, b) {
        var f = { target: b.target }, d = ""; void 0 !== b.colModel && !c.fmatter.isUndefined(b.colModel.formatoptions) && (f = c.extend({}, f, b.colModel.formatoptions)); f.target && (d = "target=" + f.target); return !c.fmatter.isEmpty(a) ? "<a " + d + ' href="' + a + '">' +
a + "</a>" : c.fn.fmatter.defaultFormat(a, b)
    }; c.fn.fmatter.showlink = function (a, b) {
        var f = { baseLinkUrl: b.baseLinkUrl, showAction: b.showAction, addParam: b.addParam || "", target: b.target, idName: b.idName }, d = ""; void 0 !== b.colModel && !c.fmatter.isUndefined(b.colModel.formatoptions) && (f = c.extend({}, f, b.colModel.formatoptions)); f.target && (d = "target=" + f.target); f = f.baseLinkUrl + f.showAction + "?" + f.idName + "=" + b.rowId + f.addParam; return c.fmatter.isString(a) || c.fmatter.isNumber(a) ? "<a " + d + ' href="' + f + '">' + a + "</a>" : c.fn.fmatter.defaultFormat(a,
b)
    }; c.fn.fmatter.integer = function (a, b) { var f = c.extend({}, b.integer); void 0 !== b.colModel && !c.fmatter.isUndefined(b.colModel.formatoptions) && (f = c.extend({}, f, b.colModel.formatoptions)); return c.fmatter.isEmpty(a) ? f.defaultValue : c.fmatter.util.NumberFormat(a, f) }; c.fn.fmatter.number = function (a, b) {
        var f = c.extend({}, b.number); void 0 !== b.colModel && !c.fmatter.isUndefined(b.colModel.formatoptions) && (f = c.extend({}, f, b.colModel.formatoptions)); return c.fmatter.isEmpty(a) ? f.defaultValue : c.fmatter.util.NumberFormat(a,
f)
    }; c.fn.fmatter.currency = function (a, b) { var f = c.extend({}, b.currency); void 0 !== b.colModel && !c.fmatter.isUndefined(b.colModel.formatoptions) && (f = c.extend({}, f, b.colModel.formatoptions)); return c.fmatter.isEmpty(a) ? f.defaultValue : c.fmatter.util.NumberFormat(a, f) }; c.fn.fmatter.date = function (a, b, f, d) {
        f = c.extend({}, b.date); void 0 !== b.colModel && !c.fmatter.isUndefined(b.colModel.formatoptions) && (f = c.extend({}, f, b.colModel.formatoptions)); return !f.reformatAfterEdit && "edit" == d || c.fmatter.isEmpty(a) ? c.fn.fmatter.defaultFormat(a,
b) : c.fmatter.util.DateFormat(f.srcformat, a, f.newformat, f)
    }; c.fn.fmatter.select = function (a, b) {
        var a = a + "", f = !1, d = [], e, g; c.fmatter.isUndefined(b.colModel.formatoptions) ? c.fmatter.isUndefined(b.colModel.editoptions) || (f = b.colModel.editoptions.value, e = void 0 === b.colModel.editoptions.separator ? ":" : b.colModel.editoptions.separator, g = void 0 === b.colModel.editoptions.delimiter ? ";" : b.colModel.editoptions.delimiter) : (f = b.colModel.formatoptions.value, e = void 0 === b.colModel.formatoptions.separator ? ":" : b.colModel.formatoptions.separator,
g = void 0 === b.colModel.formatoptions.delimiter ? ";" : b.colModel.formatoptions.delimiter); if (f) {
            var h = !0 === b.colModel.editoptions.multiple ? !0 : !1, i = []; h && (i = a.split(","), i = c.map(i, function (a) { return c.trim(a) })); if (c.fmatter.isString(f)) for (var j = f.split(g), k = 0, l = 0; l < j.length; l++) if (g = j[l].split(e), 2 < g.length && (g[1] = c.map(g, function (a, b) { if (b > 0) return a }).join(e)), h)-1 < c.inArray(g[0], i) && (d[k] = g[1], k++); else { if (c.trim(g[0]) == c.trim(a)) { d[0] = g[1]; break } } else c.fmatter.isObject(f) && (h ? d = c.map(i, function (a) { return f[a] }) :
d[0] = f[a] || "")
        } a = d.join(", "); return "" === a ? c.fn.fmatter.defaultFormat(a, b) : a
    }; c.fn.fmatter.rowactions = function (a, b, f, d) {
        var e = { keys: !1, onEdit: null, onSuccess: null, afterSave: null, onError: null, afterRestore: null, extraparam: {}, url: null, restoreAfterError: !0, mtype: "POST", delOptions: {}, editOptions: {} }, a = c.jgrid.jqID(a), b = c.jgrid.jqID(b), d = c("#" + b)[0].p.colModel[d]; c.fmatter.isUndefined(d.formatoptions) || (e = c.extend(e, d.formatoptions)); c.fmatter.isUndefined(c("#" + b)[0].p.editOptions) || (e.editOptions = c("#" +
b)[0].p.editOptions); c.fmatter.isUndefined(c("#" + b)[0].p.delOptions) || (e.delOptions = c("#" + b)[0].p.delOptions); var g = c("#" + b)[0], d = function (d) { c.isFunction(e.afterRestore) && e.afterRestore.call(g, d); c("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + b + ".ui-jqgrid-btable:first").show(); c("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + b + ".ui-jqgrid-btable:first").hide() }; if (c("#" + a, "#" + b).hasClass("jqgrid-new-row")) { var h = g.p.prmNames; e.extraparam[h.oper] = h.addoper } h = { keys: e.keys,
    oneditfunc: e.onEdit, successfunc: e.onSuccess, url: e.url, extraparam: e.extraparam, aftersavefunc: function (d, f) { c.isFunction(e.afterSave) && e.afterSave.call(g, d, f); c("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + b + ".ui-jqgrid-btable:first").show(); c("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + b + ".ui-jqgrid-btable:first").hide() }, errorfunc: e.onError, afterrestorefunc: d, restoreAfterError: e.restoreAfterError, mtype: e.mtype
}; switch (f) {
            case "edit": c("#" + b).jqGrid("editRow",
a, h); c("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + b + ".ui-jqgrid-btable:first").hide(); c("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + b + ".ui-jqgrid-btable:first").show(); c(g).triggerHandler("jqGridAfterGridComplete"); break; case "save": c("#" + b).jqGrid("saveRow", a, h) && (c("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + b + ".ui-jqgrid-btable:first").show(), c("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + b + ".ui-jqgrid-btable:first").hide(),
c(g).triggerHandler("jqGridAfterGridComplete")); break; case "cancel": c("#" + b).jqGrid("restoreRow", a, d); c("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + b + ".ui-jqgrid-btable:first").show(); c("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + b + ".ui-jqgrid-btable:first").hide(); c(g).triggerHandler("jqGridAfterGridComplete"); break; case "del": c("#" + b).jqGrid("delGridRow", a, e.delOptions); break; case "formedit": c("#" + b).jqGrid("setSelection", a), c("#" + b).jqGrid("editGridRow", a,
e.editOptions)
        } 
    }; c.fn.fmatter.actions = function (a, b) {
        var f = { keys: !1, editbutton: !0, delbutton: !0, editformbutton: !1 }; c.fmatter.isUndefined(b.colModel.formatoptions) || (f = c.extend(f, b.colModel.formatoptions)); var d = b.rowId, e = "", g; if ("undefined" == typeof d || c.fmatter.isEmpty(d)) return ""; f.editformbutton ? (g = "onclick=jQuery.fn.fmatter.rowactions('" + d + "','" + b.gid + "','formedit'," + b.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ", e = e + "<div title='" +
c.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + g + "><span class='ui-icon ui-icon-pencil'></span></div>") : f.editbutton && (g = "onclick=jQuery.fn.fmatter.rowactions('" + d + "','" + b.gid + "','edit'," + b.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ", e = e + "<div title='" + c.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + g + "><span class='ui-icon ui-icon-pencil'></span></div>");
        f.delbutton && (g = "onclick=jQuery.fn.fmatter.rowactions('" + d + "','" + b.gid + "','del'," + b.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ", e = e + "<div title='" + c.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " + g + "><span class='ui-icon ui-icon-trash'></span></div>"); g = "onclick=jQuery.fn.fmatter.rowactions('" + d + "','" + b.gid + "','save'," + b.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
        e = e + "<div title='" + c.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " + g + "><span class='ui-icon ui-icon-disk'></span></div>"; g = "onclick=jQuery.fn.fmatter.rowactions('" + d + "','" + b.gid + "','cancel'," + b.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); "; e = e + "<div title='" + c.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' " + g + "><span class='ui-icon ui-icon-cancel'></span></div>";
        return "<div style='margin-left:8px;'>" + e + "</div>"
    }; c.unformat = function (a, b, f, d) {
        var e, g = b.colModel.formatter, h = b.colModel.formatoptions || {}, i = /([\.\*\_\'\(\)\{\}\+\?\\])/g, j = b.colModel.unformat || c.fn.fmatter[g] && c.fn.fmatter[g].unformat; if ("undefined" !== typeof j && c.isFunction(j)) e = j.call(this, c(a).text(), b, a); else if (!c.fmatter.isUndefined(g) && c.fmatter.isString(g)) switch (e = c.jgrid.formatter || {}, g) {
            case "integer": h = c.extend({}, e.integer, h); b = h.thousandsSeparator.replace(i, "\\$1"); b = RegExp(b, "g");
                e = c(a).text().replace(b, ""); break; case "number": h = c.extend({}, e.number, h); b = h.thousandsSeparator.replace(i, "\\$1"); b = RegExp(b, "g"); e = c(a).text().replace(b, "").replace(h.decimalSeparator, "."); break; case "currency": h = c.extend({}, e.currency, h); b = h.thousandsSeparator.replace(i, "\\$1"); b = RegExp(b, "g"); e = c(a).text(); h.prefix && h.prefix.length && (e = e.substr(h.prefix.length)); h.suffix && h.suffix.length && (e = e.substr(0, e.length - h.suffix.length)); e = e.replace(b, "").replace(h.decimalSeparator, "."); break; case "checkbox": h =
b.colModel.editoptions ? b.colModel.editoptions.value.split(":") : ["Yes", "No"]; e = c("input", a).is(":checked") ? h[0] : h[1]; break; case "select": e = c.unformat.select(a, b, f, d); break; case "actions": return ""; default: e = c(a).text()
        } return void 0 !== e ? e : !0 === d ? c(a).text() : c.jgrid.htmlDecode(c(a).html())
    }; c.unformat.select = function (a, b, f, d) {
        f = []; a = c(a).text(); if (!0 === d) return a; var d = c.extend({}, !c.fmatter.isUndefined(b.colModel.formatoptions) ? b.colModel.formatoptions : b.colModel.editoptions), b = void 0 === d.separator ?
":" : d.separator, e = void 0 === d.delimiter ? ";" : d.delimiter; if (d.value) {
            var g = d.value, d = !0 === d.multiple ? !0 : !1, h = []; d && (h = a.split(","), h = c.map(h, function (a) { return c.trim(a) })); if (c.fmatter.isString(g)) for (var i = g.split(e), j = 0, k = 0; k < i.length; k++) if (e = i[k].split(b), 2 < e.length && (e[1] = c.map(e, function (a, b) { if (b > 0) return a }).join(b)), d)-1 < c.inArray(e[1], h) && (f[j] = e[0], j++); else { if (c.trim(e[1]) == c.trim(a)) { f[0] = e[0]; break } } else if (c.fmatter.isObject(g) || c.isArray(g)) d || (h[0] = a), f = c.map(h, function (a) {
                var b; c.each(g,
function (c, d) { if (d == a) { b = c; return false } }); if (typeof b != "undefined") return b
            }); return f.join(", ")
        } return a || ""
    }; c.unformat.date = function (a, b) { var f = c.jgrid.formatter.date || {}; c.fmatter.isUndefined(b.formatoptions) || (f = c.extend({}, f, b.formatoptions)); return !c.fmatter.isEmpty(a) ? c.fmatter.util.DateFormat(f.newformat, a, f.srcformat, f) : c.fn.fmatter.defaultFormat(a, b) } 
})(jQuery);
(function (a) {
    a.jgrid.extend({ getColProp: function (a) { var d = {}, c = this[0]; if (!c.grid) return !1; for (var c = c.p.colModel, e = 0; e < c.length; e++) if (c[e].name == a) { d = c[e]; break } return d }, setColProp: function (b, d) { return this.each(function () { if (this.grid && d) for (var c = this.p.colModel, e = 0; e < c.length; e++) if (c[e].name == b) { a.extend(this.p.colModel[e], d); break } }) }, sortGrid: function (a, d, c) {
        return this.each(function () {
            var e = -1; if (this.grid) {
                a || (a = this.p.sortname); for (var h = 0; h < this.p.colModel.length; h++) if (this.p.colModel[h].index ==
a || this.p.colModel[h].name == a) { e = h; break } -1 != e && (h = this.p.colModel[e].sortable, "boolean" !== typeof h && (h = !0), "boolean" !== typeof d && (d = !1), h && this.sortData("jqgh_" + this.p.id + "_" + a, e, d, c))
            } 
        })
    }, clearBeforeUnload: function () {
        return this.each(function () {
            var b = this.grid; b.emptyRows.call(this, !0, !0); a(b.hDiv).unbind("mousemove"); a(this).unbind(); b.dragEnd = null; b.dragMove = null; b.dragStart = null; b.emptyRows = null; b.populate = null; b.populateVisible = null; b.scrollGrid = null; b.selectionPreserver = null; b.bDiv = null; b.cDiv =
null; b.hDiv = null; b.cols = null; var d, c = b.headers.length; for (d = 0; d < c; d++) b.headers[d].el = null; this.addJSONData = this.addXmlData = this.formatter = this.constructTr = this.setHeadCheckBox = this.refreshIndex = this.updatepager = this.sortData = this.formatCol = null
        })
    }, GridDestroy: function () { return this.each(function () { if (this.grid) { this.p.pager && a(this.p.pager).remove(); try { a(this).jqGrid("clearBeforeUnload"), a("#gbox_" + a.jgrid.jqID(this.id)).remove() } catch (b) { } } }) }, GridUnload: function () {
        return this.each(function () {
            if (this.grid) {
                var b =
a(this).attr("id"), d = a(this).attr("class"); this.p.pager && a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager corner-bottom"); var c = document.createElement("table"); a(c).attr({ id: b }); c.className = d; b = a.jgrid.jqID(this.id); a(c).removeClass("ui-jqgrid-btable"); 1 === a(this.p.pager).parents("#gbox_" + b).length ? (a(c).insertBefore("#gbox_" + b).show(), a(this.p.pager).insertBefore("#gbox_" + b)) : a(c).insertBefore("#gbox_" + b).show(); a(this).jqGrid("clearBeforeUnload"); a("#gbox_" + b).remove()
            } 
        })
    },
        setGridState: function (b) {
            return this.each(function () {
                this.grid && ("hidden" == b ? (a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), this.p.pager && a(this.p.pager).slideUp("fast"), this.p.toppager && a(this.p.toppager).slideUp("fast"), !0 === this.p.toolbar[0] && ("both" == this.p.toolbar[1] && a(this.grid.ubDiv).slideUp("fast"), a(this.grid.uDiv).slideUp("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), a(".ui-jqgrid-titlebar-close span",
this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"), this.p.gridstate = "hidden") : "visible" == b && (a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideDown("fast"), this.p.pager && a(this.p.pager).slideDown("fast"), this.p.toppager && a(this.p.toppager).slideDown("fast"), !0 === this.p.toolbar[0] && ("both" == this.p.toolbar[1] && a(this.grid.ubDiv).slideDown("fast"), a(this.grid.uDiv).slideDown("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" +
a.jgrid.jqID(this.p.id)).slideDown("fast"), a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"), this.p.gridstate = "visible"))
            })
        }, filterToolbar: function (b) {
            b = a.extend({ autosearch: !0, searchOnEnter: !0, beforeSearch: null, afterSearch: null, beforeClear: null, afterClear: null, searchurl: "", stringResult: !1, groupOp: "AND", defaultSearch: "bw" }, b || {}); return this.each(function () {
                function d(b, c) {
                    var d = a(b); d[0] && jQuery.each(c, function () {
                        void 0 !==
this.data ? d.bind(this.type, this.data, this.fn) : d.bind(this.type, this.fn)
                    })
                } var c = this; if (!this.ftoolbar) {
                    var e = function () {
                        var d = {}, j = 0, g, f, h = {}, m; a.each(c.p.colModel, function () { f = this.index || this.name; m = this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : "select" == this.stype ? "eq" : b.defaultSearch; if (g = a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).val()) d[f] = g, h[f] = m, j++; else try { delete c.p.postData[f] } catch (e) { } }); var e = 0 < j ? !0 :
!1; if (!0 === b.stringResult || "local" == c.p.datatype) { var k = '{"groupOp":"' + b.groupOp + '","rules":[', l = 0; a.each(d, function (a, b) { 0 < l && (k += ","); k += '{"field":"' + a + '",'; k += '"op":"' + h[a] + '",'; k += '"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}'; l++ }); k += "]}"; a.extend(c.p.postData, { filters: k }); a.each(["searchField", "searchString", "searchOper"], function (a, b) { c.p.postData.hasOwnProperty(b) && delete c.p.postData[b] }) } else a.extend(c.p.postData, d); var p; c.p.searchurl && (p = c.p.url, a(c).jqGrid("setGridParam",
{ url: c.p.searchurl })); var r = "stop" === a(c).triggerHandler("jqGridToolbarBeforeSearch") ? !0 : !1; !r && a.isFunction(b.beforeSearch) && (r = b.beforeSearch.call(c)); r || a(c).jqGrid("setGridParam", { search: e }).trigger("reloadGrid", [{ page: 1}]); p && a(c).jqGrid("setGridParam", { url: p }); a(c).triggerHandler("jqGridToolbarAfterSearch"); a.isFunction(b.afterSearch) && b.afterSearch.call(c)
                    }, h = a("<tr class='ui-search-toolbar' role='rowheader'></tr>"), g; a.each(c.p.colModel, function () {
                        var i = this, j, q, f, n; q = a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" +
c.p.direction + "'></th>"); j = a("<div style='width:100%;position:relative;height:100%;padding-right:0.3em;'></div>"); !0 === this.hidden && a(q).css("display", "none"); this.search = !1 === this.search ? !1 : !0; "undefined" == typeof this.stype && (this.stype = "text"); f = a.extend({}, this.searchoptions || {}); if (this.search) switch (this.stype) {
                            case "select": if (n = this.surl || f.dataUrl) a.ajax(a.extend({ url: n, dataType: "html", success: function (c) {
                                if (f.buildSelect !== void 0) (c = f.buildSelect(c)) && a(j).append(c); else a(j).append(c); f.defaultValue !==
void 0 && a("select", j).val(f.defaultValue); a("select", j).attr({ name: i.index || i.name, id: "gs_" + i.name }); f.attr && a("select", j).attr(f.attr); a("select", j).css({ width: "100%" }); f.dataInit !== void 0 && f.dataInit(a("select", j)[0]); f.dataEvents !== void 0 && d(a("select", j)[0], f.dataEvents); b.autosearch === true && a("select", j).change(function () { e(); return false }); c = null
                            } 
                            }, a.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {})); else {
                                    var m, o, k; i.searchoptions ? (m = void 0 === i.searchoptions.value ? "" : i.searchoptions.value, o = void 0 ===
i.searchoptions.separator ? ":" : i.searchoptions.separator, k = void 0 === i.searchoptions.delimiter ? ";" : i.searchoptions.delimiter) : i.editoptions && (m = void 0 === i.editoptions.value ? "" : i.editoptions.value, o = void 0 === i.editoptions.separator ? ":" : i.editoptions.separator, k = void 0 === i.editoptions.delimiter ? ";" : i.editoptions.delimiter); if (m) {
                                        n = document.createElement("select"); n.style.width = "100%"; a(n).attr({ name: i.index || i.name, id: "gs_" + i.name }); var l; if ("string" === typeof m) {
                                            m = m.split(k); for (var p = 0; p < m.length; p++) l =
m[p].split(o), k = document.createElement("option"), k.value = l[0], k.innerHTML = l[1], n.appendChild(k)
                                        } else if ("object" === typeof m) for (l in m) m.hasOwnProperty(l) && (k = document.createElement("option"), k.value = l, k.innerHTML = m[l], n.appendChild(k)); void 0 !== f.defaultValue && a(n).val(f.defaultValue); f.attr && a(n).attr(f.attr); void 0 !== f.dataInit && f.dataInit(n); void 0 !== f.dataEvents && d(n, f.dataEvents); a(j).append(n); !0 === b.autosearch && a(n).change(function () { e(); return false })
                                    } 
                                } break; case "text": o = void 0 !== f.defaultValue ?
f.defaultValue : "", a(j).append("<input type='text' style='width:95%;padding:0px;' name='" + (i.index || i.name) + "' id='gs_" + i.name + "' value='" + o + "'/>"), f.attr && a("input", j).attr(f.attr), void 0 !== f.dataInit && f.dataInit(a("input", j)[0]), void 0 !== f.dataEvents && d(a("input", j)[0], f.dataEvents), !0 === b.autosearch && (b.searchOnEnter ? a("input", j).keypress(function (a) { if ((a.charCode ? a.charCode : a.keyCode ? a.keyCode : 0) == 13) { e(); return false } return this }) : a("input", j).keydown(function (a) {
    switch (a.which) {
        case 13: return false;
        case 9: case 16: case 37: case 38: case 39: case 40: case 27: break; default: g && clearTimeout(g); g = setTimeout(function () { e() }, 500)
    } 
}))
                        } a(q).append(j); a(h).append(q)
                    }); a("table thead", c.grid.hDiv).append(h); this.ftoolbar = !0; this.triggerToolbar = e; this.clearToolbar = function (d) {
                        var j = {}, g = 0, f, d = "boolean" != typeof d ? !0 : d; a.each(c.p.colModel, function () {
                            var b; this.searchoptions && void 0 !== this.searchoptions.defaultValue && (b = this.searchoptions.defaultValue); f = this.index || this.name; switch (this.stype) {
                                case "select": a("#gs_" +
a.jgrid.jqID(this.name) + " option", !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).each(function (c) { if (c === 0) this.selected = true; if (a(this).val() == b) { this.selected = true; return false } }); if (void 0 !== b) j[f] = b, g++; else try { delete c.p.postData[f] } catch (d) { } break; case "text": if (a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).val(b), void 0 !== b) j[f] = b, g++; else try { delete c.p.postData[f] } catch (e) { } 
                            } 
                        }); var h = 0 < g ? !0 : !1; if (!0 === b.stringResult ||
"local" == c.p.datatype) { var e = '{"groupOp":"' + b.groupOp + '","rules":[', o = 0; a.each(j, function (a, b) { 0 < o && (e += ","); e += '{"field":"' + a + '",'; e += '"op":"eq",'; e += '"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}'; o++ }); e += "]}"; a.extend(c.p.postData, { filters: e }); a.each(["searchField", "searchString", "searchOper"], function (a, b) { c.p.postData.hasOwnProperty(b) && delete c.p.postData[b] }) } else a.extend(c.p.postData, j); var k; c.p.searchurl && (k = c.p.url, a(c).jqGrid("setGridParam", { url: c.p.searchurl })); var l =
"stop" === a(c).triggerHandler("jqGridToolbarBeforeClear") ? !0 : !1; !l && a.isFunction(b.beforeClear) && (l = b.beforeClear.call(c)); l || d && a(c).jqGrid("setGridParam", { search: h }).trigger("reloadGrid", [{ page: 1}]); k && a(c).jqGrid("setGridParam", { url: k }); a(c).triggerHandler("jqGridToolbarAfterClear"); a.isFunction(b.afterClear) && b.afterClear()
                    }; this.toggleToolbar = function () {
                        var b = a("tr.ui-search-toolbar", c.grid.hDiv), d = !0 === c.p.frozenColumns ? a("tr.ui-search-toolbar", c.grid.fhDiv) : !1; "none" == b.css("display") ? (b.show(),
d && d.show()) : (b.hide(), d && d.hide())
                    } 
                } 
            })
        }, destroyGroupHeader: function (b) {
            "undefined" == typeof b && (b = !0); return this.each(function () {
                var d, c, e, h, g, i; c = this.grid; var j = a("table.ui-jqgrid-htable thead", c.hDiv), q = this.p.colModel; if (c) {
                    a(this).unbind(".setGroupHeaders"); d = a("<tr>", { role: "rowheader" }).addClass("ui-jqgrid-labels"); h = c.headers; c = 0; for (e = h.length; c < e; c++) {
                        g = q[c].hidden ? "none" : ""; g = a(h[c].el).width(h[c].width).css("display", g); try { g.removeAttr("rowSpan") } catch (f) { g.attr("rowSpan", 1) } d.append(g);
                        i = g.children("span.ui-jqgrid-resize"); 0 < i.length && (i[0].style.height = ""); g.children("div")[0].style.top = ""
                    } a(j).children("tr.ui-jqgrid-labels").remove(); a(j).prepend(d); !0 === b && a(this).jqGrid("setGridParam", { groupHeader: null })
                } 
            })
        }, setGroupHeaders: function (b) {
            b = a.extend({ useColSpanStyle: !1, groupHeaders: [] }, b || {}); return this.each(function () {
                this.p.groupHeader = b; var d, c, e = 0, h, g, i, j, q, f = this.p.colModel, n = f.length, m = this.grid.headers, o = a("table.ui-jqgrid-htable", this.grid.hDiv), k = o.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header");
                h = o.children("thead"); var l = o.find(".jqg-first-row-header"); void 0 === l[0] ? l = a("<tr>", { role: "row", "aria-hidden": "true" }).addClass("jqg-first-row-header").css("height", "auto") : l.empty(); var p, r = function (a, b) { for (var c = 0, d = b.length; c < d; c++) if (b[c].startColumnName === a) return c; return -1 }; a(this).prepend(h); h = a("<tr>", { role: "rowheader" }).addClass("ui-jqgrid-labels jqg-third-row-header"); for (d = 0; d < n; d++) if (i = m[d].el, j = a(i), c = f[d], g = { height: "0px", width: m[d].width + "px", display: c.hidden ? "none" : "" }, a("<th>",
{ role: "gridcell" }).css(g).addClass("ui-first-th-" + this.p.direction).appendTo(l), i.style.width = "", g = r(c.name, b.groupHeaders), 0 <= g) {
                    g = b.groupHeaders[g]; e = g.numberOfColumns; q = g.titleText; for (g = c = 0; g < e && d + g < n; g++) f[d + g].hidden || c++; g = a("<th>").attr({ role: "columnheader" }).addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction).css({ height: "22px", "border-top": "0px none" }).html(q); 0 < c && g.attr("colspan", "" + c); this.p.headertitles && g.attr("title", g.text()); 0 === c && g.hide(); j.before(g); h.append(i);
                    e -= 1
                } else 0 === e ? b.useColSpanStyle ? j.attr("rowspan", "2") : (a("<th>", { role: "columnheader" }).addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction).css({ display: c.hidden ? "none" : "", "border-top": "0px none" }).insertBefore(j), h.append(i)) : (h.append(i), e--); f = a(this).children("thead"); f.prepend(l); h.insertAfter(k); o.append(f); b.useColSpanStyle && (o.find("span.ui-jqgrid-resize").each(function () { var b = a(this).parent(); b.is(":visible") && (this.style.cssText = "height: " + b.height() + "px !important; cursor: col-resize;") }),
o.find("div.ui-jqgrid-sortable").each(function () { var b = a(this), c = b.parent(); c.is(":visible") && c.is(":has(span.ui-jqgrid-resize)") && b.css("top", (c.height() - b.outerHeight()) / 2 + "px") })); p = f.find("tr.jqg-first-row-header"); a(this).bind("jqGridResizeStop.setGroupHeaders", function (a, b, c) { p.find("th").eq(c).width(b) })
            })
        }, setFrozenColumns: function () {
            return this.each(function () {
                if (this.grid) {
                    var b = this, d = b.p.colModel, c = 0, e = d.length, h = -1, g = !1; if (!(!0 === b.p.subGrid || !0 === b.p.treeGrid || !0 === b.p.cellEdit || b.p.sortable ||
b.p.scroll || b.p.grouping)) {
                        b.p.rownumbers && c++; for (b.p.multiselect && c++; c < e; ) { if (!0 === d[c].frozen) g = !0, h = c; else break; c++ } if (0 <= h && g) {
                            d = b.p.caption ? a(b.grid.cDiv).outerHeight() : 0; c = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).height(); b.p.toppager && (d += a(b.grid.topDiv).outerHeight()); !0 === b.p.toolbar[0] && "bottom" != b.p.toolbar[1] && (d += a(b.grid.uDiv).outerHeight()); b.grid.fhDiv = a('<div style="position:absolute;left:0px;top:' + d + "px;height:" + c + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
                            b.grid.fbDiv = a('<div style="position:absolute;left:0px;top:' + (parseInt(d, 10) + parseInt(c, 10) + 1) + 'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>'); a("#gview_" + a.jgrid.jqID(b.p.id)).append(b.grid.fhDiv); d = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).clone(!0); if (b.p.groupHeader) {
                                a("tr.jqg-first-row-header, tr.jqg-third-row-header", d).each(function () { a("th:gt(" + h + ")", this).remove() }); var i = -1, j = -1; a("tr.jqg-second-row-header th", d).each(function () {
                                    var b = parseInt(a(this).attr("colspan"),
10); b && (i += b, j++); if (i === h) return !1
                                }); i !== h && (j = h); a("tr.jqg-second-row-header", d).each(function () { a("th:gt(" + j + ")", this).remove() })
                            } else a("tr", d).each(function () { a("th:gt(" + h + ")", this).remove() }); a(d).width(1); a(b.grid.fhDiv).append(d).mousemove(function (a) { if (b.grid.resizing) return b.grid.dragMove(a), !1 }); a(b).bind("jqGridResizeStop.setFrozenColumns", function (c, d, e) {
                                c = a(".ui-jqgrid-htable", b.grid.fhDiv); a("th:eq(" + e + ")", c).width(d); c = a(".ui-jqgrid-btable", b.grid.fbDiv); a("tr:first td:eq(" + e + ")",
c).width(d)
                            }); a(b).bind("jqGridOnSortCol.setFrozenColumns", function (c, d) { var e = a("tr.ui-jqgrid-labels:last th:eq(" + b.p.lastsort + ")", b.grid.fhDiv), g = a("tr.ui-jqgrid-labels:last th:eq(" + d + ")", b.grid.fhDiv); a("span.ui-grid-ico-sort", e).addClass("ui-state-disabled"); a(e).attr("aria-selected", "false"); a("span.ui-icon-" + b.p.sortorder, g).removeClass("ui-state-disabled"); a(g).attr("aria-selected", "true"); !b.p.viewsortcols[0] && b.p.lastsort != d && (a("span.s-ico", e).hide(), a("span.s-ico", g).show()) }); a("#gview_" +
a.jgrid.jqID(b.p.id)).append(b.grid.fbDiv); jQuery(b.grid.bDiv).scroll(function () { jQuery(b.grid.fbDiv).scrollTop(jQuery(this).scrollTop()) }); !0 === b.p.hoverrows && a("#" + a.jgrid.jqID(b.p.id)).unbind("mouseover").unbind("mouseout"); a(b).bind("jqGridAfterGridComplete.setFrozenColumns", function () {
    a("#" + a.jgrid.jqID(b.p.id) + "_frozen").remove(); jQuery(b.grid.fbDiv).height(jQuery(b.grid.bDiv).height() - 16); var c = a("#" + a.jgrid.jqID(b.p.id)).clone(!0); a("tr", c).each(function () { a("td:gt(" + h + ")", this).remove() });
    a(c).width(1).attr("id", b.p.id + "_frozen"); a(b.grid.fbDiv).append(c); !0 === b.p.hoverrows && (a("tr.jqgrow", c).hover(function () { a(this).addClass("ui-state-hover"); a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover"); a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).removeClass("ui-state-hover") }), a("tr.jqgrow", "#" + a.jgrid.jqID(b.p.id)).hover(function () {
        a(this).addClass("ui-state-hover"); a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) +
"_frozen").addClass("ui-state-hover")
    }, function () { a(this).removeClass("ui-state-hover"); a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) + "_frozen").removeClass("ui-state-hover") })); c = null
}); b.p.frozenColumns = !0
                        } 
                    } 
                } 
            })
        }, destroyFrozenColumns: function () {
            return this.each(function () {
                if (this.grid && !0 === this.p.frozenColumns) {
                    a(this.grid.fhDiv).remove(); a(this.grid.fbDiv).remove(); this.grid.fhDiv = null; this.grid.fbDiv = null; a(this).unbind(".setFrozenColumns"); if (!0 === this.p.hoverrows) {
                        var b; a("#" + a.jgrid.jqID(this.p.id)).bind("mouseover",
function (d) { b = a(d.target).closest("tr.jqgrow"); "ui-subgrid" !== a(b).attr("class") && a(b).addClass("ui-state-hover") }).bind("mouseout", function (d) { b = a(d.target).closest("tr.jqgrow"); a(b).removeClass("ui-state-hover") })
                    } this.p.frozenColumns = !1
                } 
            })
        } 
    })
})(jQuery);
(function (a) {
    a.extend(a.jgrid, { showModal: function (a) { a.w.show() }, closeModal: function (a) { a.w.hide().attr("aria-hidden", "true"); a.o && a.o.remove() }, hideModal: function (d, b) { b = a.extend({ jqm: !0, gb: "" }, b || {}); if (b.onClose) { var c = b.onClose(d); if ("boolean" == typeof c && !c) return } if (a.fn.jqm && !0 === b.jqm) a(d).attr("aria-hidden", "true").jqmHide(); else { if ("" !== b.gb) try { a(".jqgrid-overlay:first", b.gb).hide() } catch (f) { } a(d).hide().attr("aria-hidden", "true") } }, findPos: function (a) {
        var b = 0, c = 0; if (a.offsetParent) {
            do b +=
a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent)
        } return [b, c]
    }, createModal: function (d, b, c, f, g, h, i) {
        var c = a.extend(!0, a.jgrid.jqModal || {}, c), e = document.createElement("div"), l, j = this, i = a.extend({}, i || {}); l = "rtl" == a(c.gbox).attr("dir") ? !0 : !1; e.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog"; e.id = d.themodal; var k = document.createElement("div"); k.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"; k.id = d.modalhead; a(k).append("<span class='ui-jqdialog-title'>" +
c.caption + "</span>"); var n = a("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function () { n.addClass("ui-state-hover") }, function () { n.removeClass("ui-state-hover") }).append("<span class='ui-icon ui-icon-closethick'></span>"); a(k).append(n); l ? (e.dir = "rtl", a(".ui-jqdialog-title", k).css("float", "right"), a(".ui-jqdialog-titlebar-close", k).css("left", "0.3em")) : (e.dir = "ltr", a(".ui-jqdialog-title", k).css("float", "left"), a(".ui-jqdialog-titlebar-close", k).css("right",
"0.3em")); var m = document.createElement("div"); a(m).addClass("ui-jqdialog-content ui-widget-content").attr("id", d.modalcontent); a(m).append(b); e.appendChild(m); a(e).prepend(k); !0 === h ? a("body").append(e) : "string" == typeof h ? a(h).append(e) : a(e).insertBefore(f); a(e).css(i); "undefined" === typeof c.jqModal && (c.jqModal = !0); b = {}; if (a.fn.jqm && !0 === c.jqModal) 0 === c.left && (0 === c.top && c.overlay) && (i = [], i = a.jgrid.findPos(g), c.left = i[0] + 4, c.top = i[1] + 4), b.top = c.top + "px", b.left = c.left; else if (0 !== c.left || 0 !== c.top) b.left =
c.left, b.top = c.top + "px"; a("a.ui-jqdialog-titlebar-close", k).click(function () { var b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") || c.onClose, e = a("#" + a.jgrid.jqID(d.themodal)).data("gbox") || c.gbox; j.hideModal("#" + a.jgrid.jqID(d.themodal), { gb: e, jqm: c.jqModal, onClose: b }); return false }); if (0 === c.width || !c.width) c.width = 300; if (0 === c.height || !c.height) c.height = 200; c.zIndex || (f = a(f).parents("*[role=dialog]").filter(":first").css("z-index"), c.zIndex = f ? parseInt(f, 10) + 2 : 950); f = 0; l && (b.left && !h) && (f = a(c.gbox).width() -
(!isNaN(c.width) ? parseInt(c.width, 10) : 0) - 8, b.left = parseInt(b.left, 10) + parseInt(f, 10)); b.left && (b.left += "px"); a(e).css(a.extend({ width: isNaN(c.width) ? "auto" : c.width + "px", height: isNaN(c.height) ? "auto" : c.height + "px", zIndex: c.zIndex, overflow: "hidden" }, b)).attr({ tabIndex: "-1", role: "dialog", "aria-labelledby": d.modalhead, "aria-hidden": "true" }); "undefined" == typeof c.drag && (c.drag = !0); "undefined" == typeof c.resize && (c.resize = !0); if (c.drag) if (a(k).css("cursor", "move"), a.fn.jqDrag) a(e).jqDrag(k); else try {
            a(e).draggable({ handle: a("#" +
a.jgrid.jqID(k.id))
            })
        } catch (o) { } if (c.resize) if (a.fn.jqResize) a(e).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se ui-icon-grip-diagonal-se'></div>"), a("#" + a.jgrid.jqID(d.themodal)).jqResize(".jqResize", d.scrollelm ? "#" + a.jgrid.jqID(d.scrollelm) : !1); else try { a(e).resizable({ handles: "se, sw", alsoResize: d.scrollelm ? "#" + a.jgrid.jqID(d.scrollelm) : !1 }) } catch (p) { } !0 === c.closeOnEscape && a(e).keydown(function (b) {
            if (b.which == 27) {
                b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") ||
c.onClose; j.hideModal(this, { gb: c.gbox, jqm: c.jqModal, onClose: b })
            } 
        })
    }, viewModal: function (d, b) {
        b = a.extend({ toTop: !0, overlay: 10, modal: !1, overlayClass: "ui-widget-overlay", onShow: a.jgrid.showModal, onHide: a.jgrid.closeModal, gbox: "", jqm: !0, jqM: !0 }, b || {}); if (a.fn.jqm && !0 === b.jqm) b.jqM ? a(d).attr("aria-hidden", "false").jqm(b).jqmShow() : a(d).attr("aria-hidden", "false").jqmShow(); else {
            "" !== b.gbox && (a(".jqgrid-overlay:first", b.gbox).show(), a(d).data("gbox", b.gbox)); a(d).show().attr("aria-hidden", "false"); try {
                a(":input:visible",
d)[0].focus()
            } catch (c) { } 
        } 
    }, info_dialog: function (d, b, c, f) {
        var g = { width: 290, height: "auto", dataheight: "auto", drag: !0, resize: !1, caption: "<b>" + d + "</b>", left: 250, top: 170, zIndex: 1E3, jqModal: !0, modal: !1, closeOnEscape: !0, align: "center", buttonalign: "center", buttons: [] }; a.extend(g, f || {}); var h = g.jqModal, i = this; a.fn.jqm && !h && (h = !1); d = ""; if (0 < g.buttons.length) for (f = 0; f < g.buttons.length; f++) "undefined" == typeof g.buttons[f].id && (g.buttons[f].id = "info_button_" + f), d += "<a href='javascript:void(0)' id='" + g.buttons[f].id +
"' class='fm-button ui-state-default ui-corner-all'>" + g.buttons[f].text + "</a>"; f = isNaN(g.dataheight) ? g.dataheight : g.dataheight + "px"; b = "<div id='info_id'>" + ("<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" + f + ";" + ("text-align:" + g.align + ";") + "'>" + b + "</div>"); b += c ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state-default ui-corner-all'>" +
c + "</a>" + d + "</div>" : "" !== d ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" + d + "</div>" : ""; b += "</div>"; try { "false" == a("#info_dialog").attr("aria-hidden") && a.jgrid.hideModal("#info_dialog", { jqm: h }), a("#info_dialog").remove() } catch (e) { } a.jgrid.createModal({ themodal: "info_dialog", modalhead: "info_head", modalcontent: "info_content", scrollelm: "infocnt" }, b, g, "", "", !0); d && a.each(g.buttons,
function (b) { a("#" + a.jgrid.jqID(this.id), "#info_id").bind("click", function () { g.buttons[b].onClick.call(a("#info_dialog")); return !1 }) }); a("#closedialog", "#info_id").click(function () { i.hideModal("#info_dialog", { jqm: h }); return !1 }); a(".fm-button", "#info_dialog").hover(function () { a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") }); a.isFunction(g.beforeOpen) && g.beforeOpen(); a.jgrid.viewModal("#info_dialog", { onHide: function (a) { a.w.hide().remove(); a.o && a.o.remove() }, modal: g.modal,
    jqm: h
}); a.isFunction(g.afterOpen) && g.afterOpen(); try { a("#info_dialog").focus() } catch (l) { } 
    }, createEl: function (d, b, c, f, g) {
        function h(b, d) { a.isFunction(d.dataInit) && d.dataInit.call(l, b); d.dataEvents && a.each(d.dataEvents, function () { void 0 !== this.data ? a(b).bind(this.type, this.data, this.fn) : a(b).bind(this.type, this.fn) }); return d } function i(b, d, c) {
            var e = "dataInit dataEvents dataUrl buildSelect sopt searchhidden defaultValue attr".split(" "); "undefined" != typeof c && a.isArray(c) && a.merge(e, c); a.each(d, function (d,
c) { -1 === a.inArray(d, e) && a(b).attr(d, c) }); d.hasOwnProperty("id") || a(b).attr("id", a.jgrid.randId())
        } var e = "", l = this; switch (d) {
            case "textarea": e = document.createElement("textarea"); f ? b.cols || a(e).css({ width: "98%" }) : b.cols || (b.cols = 20); b.rows || (b.rows = 2); if ("&nbsp;" == c || "&#160;" == c || 1 == c.length && 160 == c.charCodeAt(0)) c = ""; e.value = c; i(e, b); b = h(e, b); a(e).attr({ role: "textbox", multiline: "true" }); break; case "checkbox": e = document.createElement("input"); e.type = "checkbox"; b.value ? (d = b.value.split(":"), c === d[0] &&
(e.checked = !0, e.defaultChecked = !0), e.value = d[0], a(e).attr("offval", d[1])) : (d = c.toLowerCase(), 0 > d.search(/(false|0|no|off|undefined)/i) && "" !== d ? (e.checked = !0, e.defaultChecked = !0, e.value = c) : e.value = "on", a(e).attr("offval", "off")); i(e, b, ["value"]); b = h(e, b); a(e).attr("role", "checkbox"); break; case "select": e = document.createElement("select"); e.setAttribute("role", "select"); f = []; !0 === b.multiple ? (d = !0, e.multiple = "multiple", a(e).attr("aria-multiselectable", "true")) : d = !1; if ("undefined" != typeof b.dataUrl) a.ajax(a.extend({ url: b.dataUrl,
    type: "GET", dataType: "html", context: { elem: e, options: b, vl: c }, success: function (d) {
        var b = [], c = this.elem, e = this.vl, f = a.extend({}, this.options), g = f.multiple === true; a.isFunction(f.buildSelect) && (d = f.buildSelect.call(l, d)); if (d = a(d).html()) {
            a(c).append(d); i(c, f); f = h(c, f); if (typeof f.size === "undefined") f.size = g ? 3 : 1; if (g) { b = e.split(","); b = a.map(b, function (b) { return a.trim(b) }) } else b[0] = a.trim(e); setTimeout(function () {
                a("option", c).each(function (d) {
                    if (d === 0 && c.multiple) this.selected = false; a(this).attr("role",
"option"); if (a.inArray(a.trim(a(this).text()), b) > -1 || a.inArray(a.trim(a(this).val()), b) > -1) this.selected = "selected"
                })
            }, 0)
        } 
    } 
}, g || {})); else if (b.value) {
                    var j; "undefined" === typeof b.size && (b.size = d ? 3 : 1); d && (f = c.split(","), f = a.map(f, function (b) { return a.trim(b) })); "function" === typeof b.value && (b.value = b.value()); var k, n, m = void 0 === b.separator ? ":" : b.separator, g = void 0 === b.delimiter ? ";" : b.delimiter; if ("string" === typeof b.value) {
                        k = b.value.split(g); for (j = 0; j < k.length; j++) {
                            n = k[j].split(m); 2 < n.length && (n[1] =
a.map(n, function (a, b) { if (b > 0) return a }).join(m)); g = document.createElement("option"); g.setAttribute("role", "option"); g.value = n[0]; g.innerHTML = n[1]; e.appendChild(g); if (!d && (a.trim(n[0]) == a.trim(c) || a.trim(n[1]) == a.trim(c))) g.selected = "selected"; if (d && (-1 < a.inArray(a.trim(n[1]), f) || -1 < a.inArray(a.trim(n[0]), f))) g.selected = "selected"
                        } 
                    } else if ("object" === typeof b.value) for (j in m = b.value, m) if (m.hasOwnProperty(j)) {
                        g = document.createElement("option"); g.setAttribute("role", "option"); g.value = j; g.innerHTML =
m[j]; e.appendChild(g); if (!d && (a.trim(j) == a.trim(c) || a.trim(m[j]) == a.trim(c))) g.selected = "selected"; if (d && (-1 < a.inArray(a.trim(m[j]), f) || -1 < a.inArray(a.trim(j), f))) g.selected = "selected"
                    } i(e, b, ["value"]); b = h(e, b)
                } break; case "text": case "password": case "button": j = "button" == d ? "button" : "textbox"; e = document.createElement("input"); e.type = d; e.value = c; i(e, b); b = h(e, b); "button" != d && (f ? b.size || a(e).css({ width: "98%" }) : b.size || (b.size = 20)); a(e).attr("role", j); break; case "image": case "file": e = document.createElement("input");
                e.type = d; i(e, b); b = h(e, b); break; case "custom": e = document.createElement("span"); try { if (a.isFunction(b.custom_element)) if (m = b.custom_element.call(l, c, b)) m = a(m).addClass("customelement").attr({ id: b.id, name: b.name }), a(e).empty().append(m); else throw "e2"; else throw "e1"; } catch (o) {
                    "e1" == o && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose), "e2" == o ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue,
a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, "string" === typeof o ? o : o.message, a.jgrid.edit.bClose)
                } 
        } return e
    }, checkDate: function (a, b) {
        var c = {}, f, a = a.toLowerCase(); f = -1 != a.indexOf("/") ? "/" : -1 != a.indexOf("-") ? "-" : -1 != a.indexOf(".") ? "." : "/"; a = a.split(f); b = b.split(f); if (3 != b.length) return !1; f = -1; for (var g, h = -1, i = -1, e = 0; e < a.length; e++) g = isNaN(b[e]) ? 0 : parseInt(b[e], 10), c[a[e]] = g, g = a[e], -1 != g.indexOf("y") && (f = e), -1 != g.indexOf("m") && (i = e), -1 != g.indexOf("d") && (h = e); g = "y" == a[f] || "yyyy" == a[f] ?
4 : "yy" == a[f] ? 2 : -1; var e = function (a) { for (var b = 1; b <= a; b++) { this[b] = 31; if (4 == b || 6 == b || 9 == b || 11 == b) this[b] = 30; 2 == b && (this[b] = 29) } return this } (12), l; if (-1 === f) return !1; l = c[a[f]].toString(); 2 == g && 1 == l.length && (g = 1); if (l.length != g || 0 === c[a[f]] && "00" != b[f] || -1 === i) return !1; l = c[a[i]].toString(); if (1 > l.length || (1 > c[a[i]] || 12 < c[a[i]]) || -1 === h) return !1; l = c[a[h]].toString(); return 1 > l.length || 1 > c[a[h]] || 31 < c[a[h]] || 2 == c[a[i]] && c[a[h]] > (0 === c[a[f]] % 4 && (0 !== c[a[f]] % 100 || 0 === c[a[f]] % 400) ? 29 : 28) || c[a[h]] > e[c[a[i]]] ?
!1 : !0
    }, isEmpty: function (a) { return a.match(/^\s+$/) || "" === a ? !0 : !1 }, checkTime: function (d) { var b = /^(\d{1,2}):(\d{2})([ap]m)?$/; if (!a.jgrid.isEmpty(d)) if (d = d.match(b)) { if (d[3]) { if (1 > d[1] || 12 < d[1]) return !1 } else if (23 < d[1]) return !1; if (59 < d[2]) return !1 } else return !1; return !0 }, checkValues: function (d, b, c, f, g) {
        var h, i; if ("undefined" === typeof f) if ("string" == typeof b) { f = 0; for (g = c.p.colModel.length; f < g; f++) if (c.p.colModel[f].name == b) { h = c.p.colModel[f].editrules; b = f; try { i = c.p.colModel[f].formoptions.label } catch (e) { } break } } else 0 <=
b && (h = c.p.colModel[b].editrules); else h = f, i = void 0 === g ? "_" : g; if (h) {
            i || (i = c.p.colNames[b]); if (!0 === h.required && a.jgrid.isEmpty(d)) return [!1, i + ": " + a.jgrid.edit.msg.required, ""]; f = !1 === h.required ? !1 : !0; if (!0 === h.number && !(!1 === f && a.jgrid.isEmpty(d)) && isNaN(d)) return [!1, i + ": " + a.jgrid.edit.msg.number, ""]; if ("undefined" != typeof h.minValue && !isNaN(h.minValue) && parseFloat(d) < parseFloat(h.minValue)) return [!1, i + ": " + a.jgrid.edit.msg.minValue + " " + h.minValue, ""]; if ("undefined" != typeof h.maxValue && !isNaN(h.maxValue) &&
parseFloat(d) > parseFloat(h.maxValue)) return [!1, i + ": " + a.jgrid.edit.msg.maxValue + " " + h.maxValue, ""]; if (!0 === h.email && !(!1 === f && a.jgrid.isEmpty(d)) && (g = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
!g.test(d))) return [!1, i + ": " + a.jgrid.edit.msg.email, ""]; if (!0 === h.integer && !(!1 === f && a.jgrid.isEmpty(d)) && (isNaN(d) || 0 !== d % 1 || -1 != d.indexOf("."))) return [!1, i + ": " + a.jgrid.edit.msg.integer, ""]; if (!0 === h.date && !(!1 === f && a.jgrid.isEmpty(d)) && (b = c.p.colModel[b].formatoptions && c.p.colModel[b].formatoptions.newformat ? c.p.colModel[b].formatoptions.newformat : c.p.colModel[b].datefmt || "Y-m-d", !a.jgrid.checkDate(b, d))) return [!1, i + ": " + a.jgrid.edit.msg.date + " - " + b, ""]; if (!0 === h.time && !(!1 === f && a.jgrid.isEmpty(d)) &&
!a.jgrid.checkTime(d)) return [!1, i + ": " + a.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""]; if (!0 === h.url && !(!1 === f && a.jgrid.isEmpty(d)) && (g = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i, !g.test(d))) return [!1, i + ": " + a.jgrid.edit.msg.url, ""]; if (!0 === h.custom && !(!1 === f && a.jgrid.isEmpty(d))) return a.isFunction(h.custom_func) ? (d = h.custom_func.call(c, d, i), a.isArray(d) ? d : [!1, a.jgrid.edit.msg.customarray, ""]) : [!1, a.jgrid.edit.msg.customfcheck,
""]
        } return [!0, "", ""]
    } 
    })
})(jQuery);
(function (a) {
    var c = {}; a.jgrid.extend({ searchGrid: function (c) {
        c = a.extend({ recreateFilter: !1, drag: !0, sField: "searchField", sValue: "searchString", sOper: "searchOper", sFilter: "filters", loadDefaults: !0, beforeShowSearch: null, afterShowSearch: null, onInitializeSearch: null, afterRedraw: null, afterChange: null, closeAfterSearch: !1, closeAfterReset: !1, closeOnEscape: !1, searchOnEnter: !1, multipleSearch: !1, multipleGroup: !1, top: 0, left: 0, jqModal: !0, modal: !1, resize: !0, width: 450, height: "auto", dataheight: "auto", showQuery: !1,
            errorcheck: !0, sopt: null, stringResult: void 0, onClose: null, onSearch: null, onReset: null, toTop: !0, overlay: 30, columns: [], tmplNames: null, tmplFilters: null, tmplLabel: " Template: ", showOnLoad: !1, layer: null
        }, a.jgrid.search, c || {}); return this.each(function () {
            function d(b) {
                r = a(e).triggerHandler("jqGridFilterBeforeShow", [b]); "undefined" === typeof r && (r = !0); r && a.isFunction(c.beforeShowSearch) && (r = c.beforeShowSearch.call(e, b)); r && (a.jgrid.viewModal("#" + a.jgrid.jqID(u.themodal), { gbox: "#gbox_" + a.jgrid.jqID(n), jqm: c.jqModal,
                    modal: c.modal, overlay: c.overlay, toTop: c.toTop
                }), a(e).triggerHandler("jqGridFilterAfterShow", [b]), a.isFunction(c.afterShowSearch) && c.afterShowSearch.call(e, b))
            } var e = this; if (e.grid) {
                var n = "fbox_" + e.p.id, r = !0, u = { themodal: "searchmod" + n, modalhead: "searchhd" + n, modalcontent: "searchcnt" + n, scrollelm: n }, t = e.p.postData[c.sFilter]; "string" === typeof t && (t = a.jgrid.parse(t)); !0 === c.recreateFilter && a("#" + a.jgrid.jqID(u.themodal)).remove(); if (void 0 !== a("#" + a.jgrid.jqID(u.themodal))[0]) d(a("#fbox_" + a.jgrid.jqID(+e.p.id)));
                else {
                    var l = a("<div><div id='" + n + "' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_" + a.jgrid.jqID(e.p.id)), g = "left", f = ""; "rtl" == e.p.direction && (g = "right", f = " style='text-align:left'", l.attr("dir", "rtl")); var p = a.extend([], e.p.colModel), w = "<a href='javascript:void(0)' id='" + n + "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>" + c.Find + "</a>", b = "<a href='javascript:void(0)' id='" + n + "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" +
c.Reset + "</a>", s = "", h = "", j, i = !1, q = -1; c.showQuery && (s = "<a href='javascript:void(0)' id='" + n + "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>"); c.columns.length ? p = c.columns : a.each(p, function (a, b) { if (!b.label) b.label = e.p.colNames[a]; if (!i) { var c = typeof b.search === "undefined" ? true : b.search, d = b.hidden === true; if (b.searchoptions && b.searchoptions.searchhidden === true && c || c && !d) { i = true; j = b.index || b.name; q = a } } }); if (!t && j || !1 ===
c.multipleSearch) { var y = "eq"; 0 <= q && p[q].searchoptions && p[q].searchoptions.sopt ? y = p[q].searchoptions.sopt[0] : c.sopt && c.sopt.length && (y = c.sopt[0]); t = { groupOp: "AND", rules: [{ field: j, op: y, data: ""}]} } i = !1; c.tmplNames && c.tmplNames.length && (i = !0, h = c.tmplLabel, h += "<select class='ui-template'>", h += "<option value='default'>Default</option>", a.each(c.tmplNames, function (a, b) { h = h + ("<option value='" + a + "'>" + b + "</option>") }), h += "</select>"); g = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" +
n + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:" + g + "'>" + b + h + "</td><td class='EditButton' " + f + ">" + s + w + "</td></tr></tbody></table>"; n = a.jgrid.jqID(n); a("#" + n).jqFilter({ columns: p, filter: c.loadDefaults ? t : null, showQuery: c.showQuery, errorcheck: c.errorcheck, sopt: c.sopt, groupButton: c.multipleGroup, ruleButtons: c.multipleSearch, afterRedraw: c.afterRedraw, _gridsopt: a.jgrid.search.odata, ajaxSelectOptions: e.p.ajaxSelectOptions,
    groupOps: c.groupOps, onChange: function () { this.p.showQuery && a(".query", this).html(this.toUserFriendlyString()); a.isFunction(c.afterChange) && c.afterChange.call(e, a("#" + n), c) }, direction: e.p.direction
}); l.append(g); i && (c.tmplFilters && c.tmplFilters.length) && a(".ui-template", l).bind("change", function () { var b = a(this).val(); b == "default" ? a("#" + n).jqFilter("addFilter", t) : a("#" + n).jqFilter("addFilter", c.tmplFilters[parseInt(b, 10)]); return false }); !0 === c.multipleGroup && (c.multipleSearch = !0); a(e).triggerHandler("jqGridFilterInitialize",
[a("#" + n)]); a.isFunction(c.onInitializeSearch) && c.onInitializeSearch.call(e, a("#" + n)); c.gbox = "#gbox_" + n; c.layer ? a.jgrid.createModal(u, l, c, "#gview_" + a.jgrid.jqID(e.p.id), a("#gbox_" + a.jgrid.jqID(e.p.id))[0], "#" + a.jgrid.jqID(c.layer), { position: "relative" }) : a.jgrid.createModal(u, l, c, "#gview_" + a.jgrid.jqID(e.p.id), a("#gbox_" + a.jgrid.jqID(e.p.id))[0]); (c.searchOnEnter || c.closeOnEscape) && a("#" + a.jgrid.jqID(u.themodal)).keydown(function (b) {
    var d = a(b.target); if (c.searchOnEnter && b.which === 13 && !d.hasClass("add-group") &&
!d.hasClass("add-rule") && !d.hasClass("delete-group") && !d.hasClass("delete-rule") && (!d.hasClass("fm-button") || !d.is("[id$=_query]"))) { a("#" + n + "_search").focus().click(); return false } if (c.closeOnEscape && b.which === 27) { a("#" + a.jgrid.jqID(u.modalhead)).find(".ui-jqdialog-titlebar-close").focus().click(); return false } 
}); s && a("#" + n + "_query").bind("click", function () { a(".queryresult", l).toggle(); return false }); void 0 === c.stringResult && (c.stringResult = c.multipleSearch); a("#" + n + "_search").bind("click", function () {
    var b =
a("#" + n), d = {}, h, f = b.jqFilter("filterData"); if (c.errorcheck) { b[0].hideError(); c.showQuery || b.jqFilter("toSQLString"); if (b[0].p.error) { b[0].showError(); return false } } if (c.stringResult) { try { h = xmlJsonClass.toJson(f, "", "", false) } catch (g) { try { h = JSON.stringify(f) } catch (j) { } } if (typeof h === "string") { d[c.sFilter] = h; a.each([c.sField, c.sValue, c.sOper], function () { d[this] = "" }) } } else if (c.multipleSearch) { d[c.sFilter] = f; a.each([c.sField, c.sValue, c.sOper], function () { d[this] = "" }) } else {
        d[c.sField] = f.rules[0].field;
        d[c.sValue] = f.rules[0].data; d[c.sOper] = f.rules[0].op; d[c.sFilter] = ""
    } e.p.search = true; a.extend(e.p.postData, d); a(e).triggerHandler("jqGridFilterSearch"); a.isFunction(c.onSearch) && c.onSearch.call(e); a(e).trigger("reloadGrid", [{ page: 1}]); c.closeAfterSearch && a.jgrid.hideModal("#" + a.jgrid.jqID(u.themodal), { gb: "#gbox_" + a.jgrid.jqID(e.p.id), jqm: c.jqModal, onClose: c.onClose }); return false
}); a("#" + n + "_reset").bind("click", function () {
    var b = {}, d = a("#" + n); e.p.search = false; c.multipleSearch === false ? b[c.sField] =
b[c.sValue] = b[c.sOper] = "" : b[c.sFilter] = ""; d[0].resetFilter(); i && a(".ui-template", l).val("default"); a.extend(e.p.postData, b); a(e).triggerHandler("jqGridFilterReset"); a.isFunction(c.onReset) && c.onReset.call(e); a(e).trigger("reloadGrid", [{ page: 1}]); return false
}); d(a("#" + n)); a(".fm-button:not(.ui-state-disabled)", l).hover(function () { a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") })
                } 
            } 
        })
    }, editGridRow: function (o, d) {
        d = a.extend({ top: 0, left: 0, width: 300, height: "auto", dataheight: "auto",
            modal: !1, overlay: 30, drag: !0, resize: !0, url: null, mtype: "POST", clearAfterAdd: !0, closeAfterEdit: !1, reloadAfterSubmit: !0, onInitializeForm: null, beforeInitData: null, beforeShowForm: null, afterShowForm: null, beforeSubmit: null, afterSubmit: null, onclickSubmit: null, afterComplete: null, onclickPgButtons: null, afterclickPgButtons: null, editData: {}, recreateForm: !1, jqModal: !0, closeOnEscape: !1, addedrow: "first", topinfo: "", bottominfo: "", saveicon: [], closeicon: [], savekey: [!1, 13], navkeys: [!1, 38, 40], checkOnSubmit: !1, checkOnUpdate: !1,
            _savedData: {}, processing: !1, onClose: null, ajaxEditOptions: {}, serializeEditData: null, viewPagerButtons: !0
        }, a.jgrid.edit, d || {}); c[a(this)[0].p.id] = d; return this.each(function () {
            function e() {
                a(i + " > tbody > tr > td > .FormElement").each(function () {
                    var c = a(".customelement", this); if (c.length) {
                        var d = a(c[0]).attr("name"); a.each(b.p.colModel, function () {
                            if (this.name === d && this.editoptions && a.isFunction(this.editoptions.custom_value)) {
                                try {
                                    if (k[d] = this.editoptions.custom_value.call(b, a("#" + a.jgrid.jqID(d), i), "get"),
void 0 === k[d]) throw "e1";
                                } catch (c) { "e1" === c ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, c.message, jQuery.jgrid.edit.bClose) } return !0
                            } 
                        })
                    } else {
                        switch (a(this).get(0).type) {
                            case "checkbox": a(this).is(":checked") ? k[this.name] = a(this).val() : (c = a(this).attr("offval"), k[this.name] = c); break; case "select-one": k[this.name] = a("option:selected", this).val(); B[this.name] = a("option:selected",
this).text(); break; case "select-multiple": k[this.name] = a(this).val(); k[this.name] = k[this.name] ? k[this.name].join(",") : ""; var e = []; a("option:selected", this).each(function (b, c) { e[b] = a(c).text() }); B[this.name] = e.join(","); break; case "password": case "text": case "textarea": case "button": k[this.name] = a(this).val()
                        } b.p.autoencode && (k[this.name] = a.jgrid.htmlEncode(k[this.name]))
                    } 
                }); return !0
            } function n(d, e, h, k) {
                var f, g, m, j = 0, i, q, l, n = [], v = !1, p = "", o; for (o = 1; o <= k; o++) p += "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
                "_empty" != d && (v = a(e).jqGrid("getInd", d)); a(e.p.colModel).each(function (o) {
                    f = this.name; q = (g = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) ? "style='display:none'" : ""; if ("cb" !== f && "subgrid" !== f && !0 === this.editable && "rn" !== f) {
                        if (!1 === v) i = ""; else if (f == e.p.ExpandColumn && !0 === e.p.treeGrid) i = a("td:eq(" + o + ")", e.rows[v]).text(); else {
                            try { i = a.unformat.call(e, a("td:eq(" + o + ")", e.rows[v]), { rowId: d, colModel: this }, o) } catch (s) {
                                i = this.edittype && "textarea" == this.edittype ? a("td:eq(" + o + ")",
e.rows[v]).text() : a("td:eq(" + o + ")", e.rows[v]).html()
                            } if (!i || "&nbsp;" == i || "&#160;" == i || 1 == i.length && 160 == i.charCodeAt(0)) i = ""
                        } var r = a.extend({}, this.editoptions || {}, { id: f, name: f }), t = a.extend({}, { elmprefix: "", elmsuffix: "", rowabove: !1, rowcontent: "" }, this.formoptions || {}), u = parseInt(t.rowpos, 10) || j + 1, y = parseInt(2 * (parseInt(t.colpos, 10) || 1), 10); "_empty" == d && r.defaultValue && (i = a.isFunction(r.defaultValue) ? r.defaultValue.call(b) : r.defaultValue); this.edittype || (this.edittype = "text"); b.p.autoencode && (i = a.jgrid.htmlDecode(i));
                        l = a.jgrid.createEl.call(b, this.edittype, r, i, !1, a.extend({}, a.jgrid.ajaxOptions, e.p.ajaxSelectOptions || {})); "" === i && "checkbox" == this.edittype && (i = a(l).attr("offval")); "" === i && "select" == this.edittype && (i = a("option:eq(0)", l).text()); if (c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) c[b.p.id]._savedData[f] = i; a(l).addClass("FormElement"); ("text" == this.edittype || "textarea" == this.edittype) && a(l).addClass("ui-widget-content ui-corner-all"); m = a(h).find("tr[rowpos=" + u + "]"); t.rowabove && (r = a("<tr><td class='contentinfo' colspan='" +
2 * k + "'>" + t.rowcontent + "</td></tr>"), a(h).append(r), r[0].rp = u); 0 === m.length && (m = a("<tr " + q + " rowpos='" + u + "'></tr>").addClass("FormData").attr("id", "tr_" + f), a(m).append(p), a(h).append(m), m[0].rp = u); a("td:eq(" + (y - 2) + ")", m[0]).html("undefined" === typeof t.label ? e.p.colNames[o] : t.label); a("td:eq(" + (y - 1) + ")", m[0]).append(t.elmprefix).append(l).append(t.elmsuffix); n[j] = o; j++
                    } 
                }); if (0 < j && (o = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (2 * k - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" +
e.p.id + "_id' value='" + d + "'/></td></tr>"), o[0].rp = j + 999, a(h).append(o), c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate)) c[b.p.id]._savedData[e.p.id + "_id"] = d; return n
            } function r(d, e, h) {
                var f, k = 0, g, m, j, q, l; if (c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) c[b.p.id]._savedData = {}, c[b.p.id]._savedData[e.p.id + "_id"] = d; var o = e.p.colModel; if ("_empty" == d) a(o).each(function () {
                    f = this.name; j = a.extend({}, this.editoptions || {}); if ((m = a("#" + a.jgrid.jqID(f), "#" + h)) && m.length && null !== m[0]) if (q = "", j.defaultValue ?
(q = a.isFunction(j.defaultValue) ? j.defaultValue.call(b) : j.defaultValue, "checkbox" == m[0].type ? (l = q.toLowerCase(), 0 > l.search(/(false|0|no|off|undefined)/i) && "" !== l ? (m[0].checked = !0, m[0].defaultChecked = !0, m[0].value = q) : (m[0].checked = !1, m[0].defaultChecked = !1)) : m.val(q)) : "checkbox" == m[0].type ? (m[0].checked = !1, m[0].defaultChecked = !1, q = a(m).attr("offval")) : m[0].type && "select" == m[0].type.substr(0, 6) ? m[0].selectedIndex = 0 : m.val(q), !0 === c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) c[b.p.id]._savedData[f] =
q
                }), a("#id_g", "#" + h).val(d); else {
                    var n = a(e).jqGrid("getInd", d, !0); n && (a('td[role="gridcell"]', n).each(function (m) {
                        f = o[m].name; if ("cb" !== f && "subgrid" !== f && "rn" !== f && !0 === o[m].editable) {
                            if (f == e.p.ExpandColumn && !0 === e.p.treeGrid) g = a(this).text(); else try { g = a.unformat.call(e, a(this), { rowId: d, colModel: o[m] }, m) } catch (i) { g = "textarea" == o[m].edittype ? a(this).text() : a(this).html() } b.p.autoencode && (g = a.jgrid.htmlDecode(g)); if (!0 === c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) c[b.p.id]._savedData[f] = g; f =
a.jgrid.jqID(f); switch (o[m].edittype) {
                                case "password": case "text": case "button": case "image": case "textarea": if ("&nbsp;" == g || "&#160;" == g || 1 == g.length && 160 == g.charCodeAt(0)) g = ""; a("#" + f, "#" + h).val(g); break; case "select": var j = g.split(","), j = a.map(j, function (b) { return a.trim(b) }); a("#" + f + " option", "#" + h).each(function () {
                                    this.selected = !o[m].editoptions.multiple && (a.trim(g) == a.trim(a(this).text()) || j[0] == a.trim(a(this).text()) || j[0] == a.trim(a(this).val())) ? !0 : o[m].editoptions.multiple ? -1 < a.inArray(a.trim(a(this).text()),
j) || -1 < a.inArray(a.trim(a(this).val()), j) ? !0 : !1 : !1
                                }); break; case "checkbox": g += ""; o[m].editoptions && o[m].editoptions.value ? o[m].editoptions.value.split(":")[0] == g ? (a("#" + f, "#" + h)[b.p.useProp ? "prop" : "attr"]("checked", !0), a("#" + f, "#" + h)[b.p.useProp ? "prop" : "attr"]("defaultChecked", !0)) : (a("#" + f, "#" + h)[b.p.useProp ? "prop" : "attr"]("checked", !1), a("#" + f, "#" + h)[b.p.useProp ? "prop" : "attr"]("defaultChecked", !1)) : (g = g.toLowerCase(), 0 > g.search(/(false|0|no|off|undefined)/i) && "" !== g ? (a("#" + f, "#" + h)[b.p.useProp ?
"prop" : "attr"]("checked", !0), a("#" + f, "#" + h)[b.p.useProp ? "prop" : "attr"]("defaultChecked", !0)) : (a("#" + f, "#" + h)[b.p.useProp ? "prop" : "attr"]("checked", !1), a("#" + f, "#" + h)[b.p.useProp ? "prop" : "attr"]("defaultChecked", !1))); break; case "custom": try { if (o[m].editoptions && a.isFunction(o[m].editoptions.custom_value)) o[m].editoptions.custom_value.call(b, a("#" + f, "#" + h), "set", g); else throw "e1"; } catch (q) {
                                        "e1" == q ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose) :
a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, q.message, jQuery.jgrid.edit.bClose)
                                    } 
                            } k++
                        } 
                    }), 0 < k && a("#id_g", i).val(d))
                } 
            } function u() { a.each(b.p.colModel, function (a, b) { b.editoptions && !0 === b.editoptions.NullIfEmpty && k.hasOwnProperty(b.name) && "" === k[b.name] && (k[b.name] = "null") }) } function t() {
                var e, f = [!0, "", ""], m = {}, g = b.p.prmNames, j, o, l, n, v, p = a(b).triggerHandler("jqGridAddEditBeforeCheckValues", [a("#" + h), z]); p && "object" === typeof p && (k = p); a.isFunction(c[b.p.id].beforeCheckValues) && (p = c[b.p.id].beforeCheckValues.call(b,
k, a("#" + h), "_empty" == k[b.p.id + "_id"] ? g.addoper : g.editoper)) && "object" === typeof p && (k = p); for (l in k) if (k.hasOwnProperty(l) && (f = a.jgrid.checkValues.call(b, k[l], l, b), !1 === f[0])) break; u(); f[0] && (m = a(b).triggerHandler("jqGridAddEditClickSubmit", [c[b.p.id], k, z]), void 0 === m && a.isFunction(c[b.p.id].onclickSubmit) && (m = c[b.p.id].onclickSubmit.call(b, c[b.p.id], k) || {}), f = a(b).triggerHandler("jqGridAddEditBeforeSubmit", [k, a("#" + h), z]), void 0 === f && (f = [!0, "", ""]), f[0] && a.isFunction(c[b.p.id].beforeSubmit) && (f = c[b.p.id].beforeSubmit.call(b,
k, a("#" + h)))); if (f[0] && !c[b.p.id].processing) {
                    c[b.p.id].processing = !0; a("#sData", i + "_2").addClass("ui-state-active"); o = g.oper; j = g.id; k[o] = "_empty" == a.trim(k[b.p.id + "_id"]) ? g.addoper : g.editoper; k[o] != g.addoper ? k[j] = k[b.p.id + "_id"] : void 0 === k[j] && (k[j] = k[b.p.id + "_id"]); delete k[b.p.id + "_id"]; k = a.extend(k, c[b.p.id].editData, m); if (!0 === b.p.treeGrid) for (v in k[o] == g.addoper && (n = a(b).jqGrid("getGridParam", "selrow"), k["adjacency" == b.p.treeGridModel ? b.p.treeReader.parent_id_field : "parent_id"] = n), b.p.treeReader) b.p.treeReader.hasOwnProperty(v) &&
(m = b.p.treeReader[v], k.hasOwnProperty(m) && !(k[o] == g.addoper && "parent_id_field" === v) && delete k[m]); k[j] = a.jgrid.stripPref(b.p.idPrefix, k[j]); v = a.extend({ url: c[b.p.id].url ? c[b.p.id].url : a(b).jqGrid("getGridParam", "editurl"), type: c[b.p.id].mtype, data: a.isFunction(c[b.p.id].serializeEditData) ? c[b.p.id].serializeEditData.call(b, k) : k, complete: function (m, l) {
    k[j] = b.p.idPrefix + k[j]; if (l != "success") {
        f[0] = false; f[1] = a(b).triggerHandler("jqGridAddEditErrorTextFormat", [m, z]); f[1] = a.isFunction(c[b.p.id].errorTextFormat) ?
c[b.p.id].errorTextFormat.call(b, m) : l + " Status: '" + m.statusText + "'. Error code: " + m.status
    } else { f = a(b).triggerHandler("jqGridAddEditAfterSubmit", [m, k, z]); f === void 0 && (f = [true, "", ""]); f[0] && a.isFunction(c[b.p.id].afterSubmit) && (f = c[b.p.id].afterSubmit.call(b, m, k)) } if (f[0] === false) { a("#FormError>td", i).html(f[1]); a("#FormError", i).show() } else {
        a.each(b.p.colModel, function () { if (B[this.name] && this.formatter && this.formatter == "select") try { delete B[this.name] } catch (a) { } }); k = a.extend(k, B); b.p.autoencode &&
a.each(k, function (b, d) { k[b] = a.jgrid.htmlDecode(d) }); if (k[o] == g.addoper) {
            f[2] || (f[2] = a.jgrid.randId()); k[j] = f[2]; if (c[b.p.id].closeAfterAdd) { if (c[b.p.id].reloadAfterSubmit) a(b).trigger("reloadGrid"); else if (b.p.treeGrid === true) a(b).jqGrid("addChildNode", f[2], n, k); else { a(b).jqGrid("addRowData", f[2], k, d.addedrow); a(b).jqGrid("setSelection", f[2]) } a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose }) } else if (c[b.p.id].clearAfterAdd) {
                c[b.p.id].reloadAfterSubmit ?
a(b).trigger("reloadGrid") : b.p.treeGrid === true ? a(b).jqGrid("addChildNode", f[2], n, k) : a(b).jqGrid("addRowData", f[2], k, d.addedrow); r("_empty", b, h)
            } else c[b.p.id].reloadAfterSubmit ? a(b).trigger("reloadGrid") : b.p.treeGrid === true ? a(b).jqGrid("addChildNode", f[2], n, k) : a(b).jqGrid("addRowData", f[2], k, d.addedrow)
        } else {
            if (c[b.p.id].reloadAfterSubmit) { a(b).trigger("reloadGrid"); c[b.p.id].closeAfterEdit || setTimeout(function () { a(b).jqGrid("setSelection", k[j]) }, 1E3) } else b.p.treeGrid === true ? a(b).jqGrid("setTreeRow",
k[j], k) : a(b).jqGrid("setRowData", k[j], k); c[b.p.id].closeAfterEdit && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose })
        } if (a.isFunction(c[b.p.id].afterComplete)) { e = m; setTimeout(function () { a(b).triggerHandler("jqGridAddEditAfterComplete", [e, k, a("#" + h), z]); c[b.p.id].afterComplete.call(b, e, k, a("#" + h)); e = null }, 500) } if (c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) {
            a("#" + h).data("disabled", false); if (c[b.p.id]._savedData[b.p.id + "_id"] !=
"_empty") for (var v in c[b.p.id]._savedData) k[v] && (c[b.p.id]._savedData[v] = k[v])
        } 
    } c[b.p.id].processing = false; a("#sData", i + "_2").removeClass("ui-state-active"); try { a(":input:visible", "#" + h)[0].focus() } catch (p) { } 
} 
}, a.jgrid.ajaxOptions, c[b.p.id].ajaxEditOptions); !v.url && !c[b.p.id].useDataProxy && (a.isFunction(b.p.dataProxy) ? c[b.p.id].useDataProxy = !0 : (f[0] = !1, f[1] += " " + a.jgrid.errors.nourl)); f[0] && (c[b.p.id].useDataProxy ? (m = b.p.dataProxy.call(b, v, "set_" + b.p.id), "undefined" == typeof m && (m = [!0, ""]), !1 === m[0] ?
(f[0] = !1, f[1] = m[1] || "Error deleting the selected row!") : (v.data.oper == g.addoper && c[b.p.id].closeAfterAdd && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose }), v.data.oper == g.editoper && c[b.p.id].closeAfterEdit && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose }))) : a.ajax(v))
                } !1 === f[0] && (a("#FormError>td", i).html(f[1]), a("#FormError", i).show())
            } function l(a, b) {
                var d = !1,
c; for (c in a) if (a[c] != b[c]) { d = !0; break } return d
            } function g() { var d = !0; a("#FormError", i).hide(); if (c[b.p.id].checkOnUpdate && (k = {}, B = {}, e(), F = a.extend({}, k, B), M = l(F, c[b.p.id]._savedData))) a("#" + h).data("disabled", !0), a(".confirm", "#" + q.themodal).show(), d = !1; return d } function f() { if ("_empty" !== o && "undefined" !== typeof b.p.savedRow && 0 < b.p.savedRow.length && a.isFunction(a.fn.jqGrid.restoreRow)) for (var d = 0; d < b.p.savedRow.length; d++) if (b.p.savedRow[d].id == o) { a(b).jqGrid("restoreRow", o); break } } function p(b,
d) { 0 === b ? a("#pData", i + "_2").addClass("ui-state-disabled") : a("#pData", i + "_2").removeClass("ui-state-disabled"); b == d ? a("#nData", i + "_2").addClass("ui-state-disabled") : a("#nData", i + "_2").removeClass("ui-state-disabled") } function w() { var d = a(b).jqGrid("getDataIDs"), c = a("#id_g", i).val(); return [a.inArray(c, d), d] } var b = this; if (b.grid && o) {
                var s = b.p.id, h = "FrmGrid_" + s, j = "TblGrid_" + s, i = "#" + a.jgrid.jqID(j), q = { themodal: "editmod" + s, modalhead: "edithd" + s, modalcontent: "editcnt" + s, scrollelm: h }, y = a.isFunction(c[b.p.id].beforeShowForm) ?
c[b.p.id].beforeShowForm : !1, A = a.isFunction(c[b.p.id].afterShowForm) ? c[b.p.id].afterShowForm : !1, x = a.isFunction(c[b.p.id].beforeInitData) ? c[b.p.id].beforeInitData : !1, m = a.isFunction(c[b.p.id].onInitializeForm) ? c[b.p.id].onInitializeForm : !1, v = !0, E = 1, H = 0, k, B, F, M, z, h = a.jgrid.jqID(h); "new" === o ? (o = "_empty", z = "add", d.caption = c[b.p.id].addCaption) : (d.caption = c[b.p.id].editCaption, z = "edit"); !0 === d.recreateForm && void 0 !== a("#" + a.jgrid.jqID(q.themodal))[0] && a("#" + a.jgrid.jqID(q.themodal)).remove(); var I = !0; d.checkOnUpdate &&
(d.jqModal && !d.modal) && (I = !1); if (void 0 !== a("#" + a.jgrid.jqID(q.themodal))[0]) {
                    v = a(b).triggerHandler("jqGridAddEditBeforeInitData", [a("#" + a.jgrid.jqID(h)), z]); "undefined" == typeof v && (v = !0); v && x && (v = x.call(b, a("#" + h))); if (!1 === v) return; f(); a(".ui-jqdialog-title", "#" + a.jgrid.jqID(q.modalhead)).html(d.caption); a("#FormError", i).hide(); c[b.p.id].topinfo ? (a(".topinfo", i).html(c[b.p.id].topinfo), a(".tinfo", i).show()) : a(".tinfo", i).hide(); c[b.p.id].bottominfo ? (a(".bottominfo", i + "_2").html(c[b.p.id].bottominfo),
a(".binfo", i + "_2").show()) : a(".binfo", i + "_2").hide(); r(o, b, h); "_empty" == o || !c[b.p.id].viewPagerButtons ? a("#pData, #nData", i + "_2").hide() : a("#pData, #nData", i + "_2").show(); !0 === c[b.p.id].processing && (c[b.p.id].processing = !1, a("#sData", i + "_2").removeClass("ui-state-active")); !0 === a("#" + h).data("disabled") && (a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide(), a("#" + h).data("disabled", !1)); a(b).triggerHandler("jqGridAddEditBeforeShowForm", [a("#" + h), z]); y && y.call(b, a("#" + h)); a("#" + a.jgrid.jqID(q.themodal)).data("onClose",
c[b.p.id].onClose); a.jgrid.viewModal("#" + a.jgrid.jqID(q.themodal), { gbox: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, jqM: !1, overlay: d.overlay, modal: d.modal }); I || a(".jqmOverlay").click(function () { if (!g()) return false; a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose }); return false }); a(b).triggerHandler("jqGridAddEditAfterShowForm", [a("#" + h), z]); A && A.call(b, a("#" + h))
                } else {
                    var G = isNaN(d.dataheight) ? d.dataheight : d.dataheight + "px", G = a("<form name='FormPost' id='" +
h + "' class='FormGrid' onSubmit='return false;' style='width:100%;overflow:auto;position:relative;height:" + G + ";'></form>").data("disabled", !1), C = a("<table id='" + j + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"), v = a(b).triggerHandler("jqGridAddEditBeforeInitData", [a("#" + h), z]); "undefined" == typeof v && (v = !0); v && x && (v = x.call(b, a("#" + h))); if (!1 === v) return; f(); a(b.p.colModel).each(function () {
    var a = this.formoptions; E = Math.max(E, a ? a.colpos || 0 : 0); H = Math.max(H, a ? a.rowpos ||
0 : 0)
}); a(G).append(C); x = a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" + 2 * E + "'></td></tr>"); x[0].rp = 0; a(C).append(x); x = a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" + 2 * E + "'>" + c[b.p.id].topinfo + "</td></tr>"); x[0].rp = 0; a(C).append(x); var v = (x = "rtl" == b.p.direction ? !0 : !1) ? "nData" : "pData", D = x ? "pData" : "nData"; n(o, b, C, E); var v = "<a href='javascript:void(0)' id='" + v + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
D = "<a href='javascript:void(0)' id='" + D + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>", J = "<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'>" + d.bSubmit + "</a>", K = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + d.bCancel + "</a>", j = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + j + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" +
(x ? D + v : v + D) + "</td><td class='EditButton'>" + J + K + "</td></tr>" + ("<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + c[b.p.id].bottominfo + "</td></tr>"), j = j + "</tbody></table>"; if (0 < H) { var L = []; a.each(a(C)[0].rows, function (a, b) { L[a] = b }); L.sort(function (a, b) { return a.rp > b.rp ? 1 : a.rp < b.rp ? -1 : 0 }); a.each(L, function (b, d) { a("tbody", C).append(d) }) } d.gbox = "#gbox_" + a.jgrid.jqID(s); var N = !1; !0 === d.closeOnEscape && (d.closeOnEscape = !1, N = !0); j = a("<span></span>").append(G).append(j); a.jgrid.createModal(q,
j, d, "#gview_" + a.jgrid.jqID(b.p.id), a("#gbox_" + a.jgrid.jqID(b.p.id))[0]); x && (a("#pData, #nData", i + "_2").css("float", "right"), a(".EditButton", i + "_2").css("text-align", "left")); c[b.p.id].topinfo && a(".tinfo", i).show(); c[b.p.id].bottominfo && a(".binfo", i + "_2").show(); j = j = null; a("#" + a.jgrid.jqID(q.themodal)).keydown(function (e) {
    var f = e.target; if (a("#" + h).data("disabled") === true) return false; if (c[b.p.id].savekey[0] === true && e.which == c[b.p.id].savekey[1] && f.tagName != "TEXTAREA") {
        a("#sData", i + "_2").trigger("click");
        return false
    } if (e.which === 27) { if (!g()) return false; N && a.jgrid.hideModal(this, { gb: d.gbox, jqm: d.jqModal, onClose: c[b.p.id].onClose }); return false } if (c[b.p.id].navkeys[0] === true) { if (a("#id_g", i).val() == "_empty") return true; if (e.which == c[b.p.id].navkeys[1]) { a("#pData", i + "_2").trigger("click"); return false } if (e.which == c[b.p.id].navkeys[2]) { a("#nData", i + "_2").trigger("click"); return false } } 
}); d.checkOnUpdate && (a("a.ui-jqdialog-titlebar-close span", "#" + a.jgrid.jqID(q.themodal)).removeClass("jqmClose"), a("a.ui-jqdialog-titlebar-close",
"#" + a.jgrid.jqID(q.themodal)).unbind("click").click(function () { if (!g()) return false; a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose }); return false })); d.saveicon = a.extend([!0, "left", "ui-icon-disk"], d.saveicon); d.closeicon = a.extend([!0, "left", "ui-icon-close"], d.closeicon); !0 === d.saveicon[0] && a("#sData", i + "_2").addClass("right" == d.saveicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + d.saveicon[2] +
"'></span>"); !0 === d.closeicon[0] && a("#cData", i + "_2").addClass("right" == d.closeicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + d.closeicon[2] + "'></span>"); if (c[b.p.id].checkOnSubmit || c[b.p.id].checkOnUpdate) J = "<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + d.bYes + "</a>", D = "<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + d.bNo + "</a>", K = "<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" +
d.bExit + "</a>", j = d.zIndex || 999, j++, a("<div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:" + j + ";display:none;'>&#160;" + (a.browser.msie && 6 == a.browser.version ? '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>' : "") + "</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:" + (j + 1) + "'>" + d.saveData + "<br/><br/>" + J + D + K + "</div>").insertAfter("#" + h), a("#sNew", "#" + a.jgrid.jqID(q.themodal)).click(function () {
    t();
    a("#" + h).data("disabled", false); a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide(); return false
}), a("#nNew", "#" + a.jgrid.jqID(q.themodal)).click(function () { a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide(); a("#" + h).data("disabled", false); setTimeout(function () { a(":input", "#" + h)[0].focus() }, 0); return false }), a("#cNew", "#" + a.jgrid.jqID(q.themodal)).click(function () {
    a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide(); a("#" + h).data("disabled", false); a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" +
a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose
    }); return false
}); a(b).triggerHandler("jqGridAddEditInitializeForm", [a("#" + h), z]); m && m.call(b, a("#" + h)); "_empty" == o || !c[b.p.id].viewPagerButtons ? a("#pData,#nData", i + "_2").hide() : a("#pData,#nData", i + "_2").show(); a(b).triggerHandler("jqGridAddEditBeforeShowForm", [a("#" + h), z]); y && y.call(b, a("#" + h)); a("#" + a.jgrid.jqID(q.themodal)).data("onClose", c[b.p.id].onClose); a.jgrid.viewModal("#" + a.jgrid.jqID(q.themodal), { gbox: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal,
    overlay: d.overlay, modal: d.modal
}); I || a(".jqmOverlay").click(function () { if (!g()) return false; a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose }); return false }); a(b).triggerHandler("jqGridAddEditAfterShowForm", [a("#" + h), z]); A && A.call(b, a("#" + h)); a(".fm-button", "#" + a.jgrid.jqID(q.themodal)).hover(function () { a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") }); a("#sData", i + "_2").click(function () {
    k = {}; B =
{}; a("#FormError", i).hide(); e(); if (k[b.p.id + "_id"] == "_empty") t(); else if (d.checkOnSubmit === true) { F = a.extend({}, k, B); if (M = l(F, c[b.p.id]._savedData)) { a("#" + h).data("disabled", true); a(".confirm", "#" + a.jgrid.jqID(q.themodal)).show() } else t() } else t(); return false
}); a("#cData", i + "_2").click(function () { if (!g()) return false; a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), { gb: "#gbox_" + a.jgrid.jqID(s), jqm: d.jqModal, onClose: c[b.p.id].onClose }); return false }); a("#nData", i + "_2").click(function () {
    if (!g()) return false;
    a("#FormError", i).hide(); var c = w(); c[0] = parseInt(c[0], 10); if (c[0] != -1 && c[1][c[0] + 1]) {
        a(b).triggerHandler("jqGridAddEditClickPgButtons", ["next", a("#" + h), c[1][c[0]]]); var e = true; if (a.isFunction(d.onclickPgButtons)) { e = d.onclickPgButtons.call(b, "next", a("#" + h), c[1][c[0]]); if (e !== void 0 && e === false) return false } if (a("#" + a.jgrid.jqID(c[1][c[0] + 1])).hasClass("ui-state-disabled")) return false; r(c[1][c[0] + 1], b, h); a(b).jqGrid("setSelection", c[1][c[0] + 1]); a(b).triggerHandler("jqGridAddEditAfterClickPgButtons",
["next", a("#" + h), c[1][c[0]]]); a.isFunction(d.afterclickPgButtons) && d.afterclickPgButtons.call(b, "next", a("#" + h), c[1][c[0] + 1]); p(c[0] + 1, c[1].length - 1)
    } return false
}); a("#pData", i + "_2").click(function () {
    if (!g()) return false; a("#FormError", i).hide(); var c = w(); if (c[0] != -1 && c[1][c[0] - 1]) {
        a(b).triggerHandler("jqGridAddEditClickPgButtons", ["prev", a("#" + h), c[1][c[0]]]); var e = true; if (a.isFunction(d.onclickPgButtons)) { e = d.onclickPgButtons.call(b, "prev", a("#" + h), c[1][c[0]]); if (e !== void 0 && e === false) return false } if (a("#" +
a.jgrid.jqID(c[1][c[0] - 1])).hasClass("ui-state-disabled")) return false; r(c[1][c[0] - 1], b, h); a(b).jqGrid("setSelection", c[1][c[0] - 1]); a(b).triggerHandler("jqGridAddEditAfterClickPgButtons", ["prev", a("#" + h), c[1][c[0]]]); a.isFunction(d.afterclickPgButtons) && d.afterclickPgButtons.call(b, "prev", a("#" + h), c[1][c[0] - 1]); p(c[0] - 1, c[1].length - 1)
    } return false
})
                } y = w(); p(y[0], y[1].length - 1)
            } 
        })
    }, viewGridRow: function (o, d) {
        d = a.extend({ top: 0, left: 0, width: 0, height: "auto", dataheight: "auto", modal: !1, overlay: 30, drag: !0,
            resize: !0, jqModal: !0, closeOnEscape: !1, labelswidth: "30%", closeicon: [], navkeys: [!1, 38, 40], onClose: null, beforeShowForm: null, beforeInitData: null, viewPagerButtons: !0
        }, a.jgrid.view, d || {}); c[a(this)[0].p.id] = d; return this.each(function () {
            function e() { (!0 === c[l.p.id].closeOnEscape || !0 === c[l.p.id].navkeys[0]) && setTimeout(function () { a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(s.modalhead)).focus() }, 0) } function n(b, c, e, f) {
                for (var g, h, j, i = 0, o, q, l = [], n = !1, p = "<td class='CaptionTD form-view-label ui-widget-content' width='" +
d.labelswidth + "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>", r = "", t = ["integer", "number", "currency"], s = 0, u = 0, y, x, w, A = 1; A <= f; A++) r += 1 == A ? p : "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>"; a(c.p.colModel).each(function () {
    h = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1; !h && "right" === this.align && (this.formatter && -1 !== a.inArray(this.formatter, t) ?
s = Math.max(s, parseInt(this.width, 10)) : u = Math.max(u, parseInt(this.width, 10)))
}); y = 0 !== s ? s : 0 !== u ? u : 0; n = a(c).jqGrid("getInd", b); a(c.p.colModel).each(function (b) {
    g = this.name; x = !1; q = (h = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) ? "style='display:none'" : ""; w = "boolean" != typeof this.viewable ? !0 : this.viewable; if ("cb" !== g && "subgrid" !== g && "rn" !== g && w) {
        o = !1 === n ? "" : g == c.p.ExpandColumn && !0 === c.p.treeGrid ? a("td:eq(" + b + ")", c.rows[n]).text() : a("td:eq(" + b + ")", c.rows[n]).html(); x = "right" ===
this.align && 0 !== y ? !0 : !1; var d = a.extend({}, { rowabove: !1, rowcontent: "" }, this.formoptions || {}), m = parseInt(d.rowpos, 10) || i + 1, p = parseInt(2 * (parseInt(d.colpos, 10) || 1), 10); if (d.rowabove) { var s = a("<tr><td class='contentinfo' colspan='" + 2 * f + "'>" + d.rowcontent + "</td></tr>"); a(e).append(s); s[0].rp = m } j = a(e).find("tr[rowpos=" + m + "]"); 0 === j.length && (j = a("<tr " + q + " rowpos='" + m + "'></tr>").addClass("FormData").attr("id", "trv_" + g), a(j).append(r), a(e).append(j), j[0].rp = m); a("td:eq(" + (p - 2) + ")", j[0]).html("<b>" + ("undefined" ===
typeof d.label ? c.p.colNames[b] : d.label) + "</b>"); a("td:eq(" + (p - 1) + ")", j[0]).append("<span>" + o + "</span>").attr("id", "v_" + g); x && a("td:eq(" + (p - 1) + ") span", j[0]).css({ "text-align": "right", width: y + "px" }); l[i] = b; i++
    } 
}); 0 < i && (b = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (2 * f - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" + b + "'/></td></tr>"), b[0].rp = i + 99, a(e).append(b)); return l
            } function r(b, c) {
                var d, e, f = 0, g, h; if (h = a(c).jqGrid("getInd",
b, !0)) a("td", h).each(function (b) { d = c.p.colModel[b].name; e = c.p.colModel[b].editrules && !0 === c.p.colModel[b].editrules.edithidden ? !1 : !0 === c.p.colModel[b].hidden ? !0 : !1; "cb" !== d && ("subgrid" !== d && "rn" !== d) && (g = d == c.p.ExpandColumn && !0 === c.p.treeGrid ? a(this).text() : a(this).html(), a.extend({}, c.p.colModel[b].editoptions || {}), d = a.jgrid.jqID("v_" + d), a("#" + d + " span", "#" + p).html(g), e && a("#" + d, "#" + p).parents("tr:first").hide(), f++) }), 0 < f && a("#id_g", "#" + p).val(b)
            } function u(b, c) {
                0 === b ? a("#pData", "#" + p + "_2").addClass("ui-state-disabled") :
a("#pData", "#" + p + "_2").removeClass("ui-state-disabled"); b == c ? a("#nData", "#" + p + "_2").addClass("ui-state-disabled") : a("#nData", "#" + p + "_2").removeClass("ui-state-disabled")
            } function t() { var b = a(l).jqGrid("getDataIDs"), c = a("#id_g", "#" + p).val(); return [a.inArray(c, b), b] } var l = this; if (l.grid && o) {
                var g = l.p.id, f = "ViewGrid_" + a.jgrid.jqID(g), p = "ViewTbl_" + a.jgrid.jqID(g), w = "ViewGrid_" + g, b = "ViewTbl_" + g, s = { themodal: "viewmod" + g, modalhead: "viewhd" + g, modalcontent: "viewcnt" + g, scrollelm: f }, h = a.isFunction(c[l.p.id].beforeInitData) ?
c[l.p.id].beforeInitData : !1, j = !0, i = 1, q = 0; if (void 0 !== a("#" + a.jgrid.jqID(s.themodal))[0]) { h && (j = h.call(l, a("#" + f)), "undefined" == typeof j && (j = !0)); if (!1 === j) return; a(".ui-jqdialog-title", "#" + a.jgrid.jqID(s.modalhead)).html(d.caption); a("#FormError", "#" + p).hide(); r(o, l); a.isFunction(c[l.p.id].beforeShowForm) && c[l.p.id].beforeShowForm.call(l, a("#" + f)); a.jgrid.viewModal("#" + a.jgrid.jqID(s.themodal), { gbox: "#gbox_" + a.jgrid.jqID(g), jqm: d.jqModal, jqM: !1, overlay: d.overlay, modal: d.modal }); e() } else {
                    var y = isNaN(d.dataheight) ?
d.dataheight : d.dataheight + "px", w = a("<form name='FormPost' id='" + w + "' class='FormGrid' style='width:100%;overflow:auto;position:relative;height:" + y + ";'></form>"), A = a("<table id='" + b + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>"); h && (j = h.call(l, a("#" + f)), "undefined" == typeof j && (j = !0)); if (!1 === j) return; a(l.p.colModel).each(function () { var a = this.formoptions; i = Math.max(i, a ? a.colpos || 0 : 0); q = Math.max(q, a ? a.rowpos || 0 : 0) }); a(w).append(A);
                    n(o, l, A, i); b = "rtl" == l.p.direction ? !0 : !1; h = "<a href='javascript:void(0)' id='" + (b ? "nData" : "pData") + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>"; j = "<a href='javascript:void(0)' id='" + (b ? "pData" : "nData") + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>"; y = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + d.bClose + "</a>"; if (0 < q) {
                        var x = [];
                        a.each(a(A)[0].rows, function (a, b) { x[a] = b }); x.sort(function (a, b) { return a.rp > b.rp ? 1 : a.rp < b.rp ? -1 : 0 }); a.each(x, function (b, c) { a("tbody", A).append(c) })
                    } d.gbox = "#gbox_" + a.jgrid.jqID(g); w = a("<span></span>").append(w).append("<table border='0' class='EditTable' id='" + p + "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" + d.labelswidth + "'>" + (b ? j + h : h + j) + "</td><td class='EditButton'>" + y + "</td></tr></tbody></table>"); a.jgrid.createModal(s, w, d, "#gview_" + a.jgrid.jqID(l.p.id), a("#gview_" + a.jgrid.jqID(l.p.id))[0]);
                    b && (a("#pData, #nData", "#" + p + "_2").css("float", "right"), a(".EditButton", "#" + p + "_2").css("text-align", "left")); d.viewPagerButtons || a("#pData, #nData", "#" + p + "_2").hide(); w = null; a("#" + s.themodal).keydown(function (b) {
                        if (b.which === 27) { c[l.p.id].closeOnEscape && a.jgrid.hideModal(this, { gb: d.gbox, jqm: d.jqModal, onClose: d.onClose }); return false } if (d.navkeys[0] === true) {
                            if (b.which === d.navkeys[1]) { a("#pData", "#" + p + "_2").trigger("click"); return false } if (b.which === d.navkeys[2]) {
                                a("#nData", "#" + p + "_2").trigger("click");
                                return false
                            } 
                        } 
                    }); d.closeicon = a.extend([!0, "left", "ui-icon-close"], d.closeicon); !0 === d.closeicon[0] && a("#cData", "#" + p + "_2").addClass("right" == d.closeicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + d.closeicon[2] + "'></span>"); a.isFunction(d.beforeShowForm) && d.beforeShowForm.call(l, a("#" + f)); a.jgrid.viewModal("#" + a.jgrid.jqID(s.themodal), { gbox: "#gbox_" + a.jgrid.jqID(g), jqm: d.jqModal, modal: d.modal }); a(".fm-button:not(.ui-state-disabled)", "#" + p + "_2").hover(function () { a(this).addClass("ui-state-hover") },
function () { a(this).removeClass("ui-state-hover") }); e(); a("#cData", "#" + p + "_2").click(function () { a.jgrid.hideModal("#" + a.jgrid.jqID(s.themodal), { gb: "#gbox_" + a.jgrid.jqID(g), jqm: d.jqModal, onClose: d.onClose }); return false }); a("#nData", "#" + p + "_2").click(function () {
    a("#FormError", "#" + p).hide(); var b = t(); b[0] = parseInt(b[0], 10); if (b[0] != -1 && b[1][b[0] + 1]) {
        a.isFunction(d.onclickPgButtons) && d.onclickPgButtons.call(l, "next", a("#" + f), b[1][b[0]]); r(b[1][b[0] + 1], l); a(l).jqGrid("setSelection", b[1][b[0] + 1]); a.isFunction(d.afterclickPgButtons) &&
d.afterclickPgButtons.call(l, "next", a("#" + f), b[1][b[0] + 1]); u(b[0] + 1, b[1].length - 1)
    } e(); return false
}); a("#pData", "#" + p + "_2").click(function () { a("#FormError", "#" + p).hide(); var b = t(); if (b[0] != -1 && b[1][b[0] - 1]) { a.isFunction(d.onclickPgButtons) && d.onclickPgButtons.call(l, "prev", a("#" + f), b[1][b[0]]); r(b[1][b[0] - 1], l); a(l).jqGrid("setSelection", b[1][b[0] - 1]); a.isFunction(d.afterclickPgButtons) && d.afterclickPgButtons.call(l, "prev", a("#" + f), b[1][b[0] - 1]); u(b[0] - 1, b[1].length - 1) } e(); return false })
                } w = t(); u(w[0],
w[1].length - 1)
            } 
        })
    }, delGridRow: function (o, d) {
        d = a.extend({ top: 0, left: 0, width: 240, height: "auto", dataheight: "auto", modal: !1, overlay: 30, drag: !0, resize: !0, url: "", mtype: "POST", reloadAfterSubmit: !0, beforeShowForm: null, beforeInitData: null, afterShowForm: null, beforeSubmit: null, onclickSubmit: null, afterSubmit: null, jqModal: !0, closeOnEscape: !1, delData: {}, delicon: [], cancelicon: [], onClose: null, ajaxDelOptions: {}, processing: !1, serializeDelData: null, useDataProxy: !1 }, a.jgrid.del, d || {}); c[a(this)[0].p.id] = d; return this.each(function () {
            var e =
this; if (e.grid && o) {
                var n = a.isFunction(c[e.p.id].beforeShowForm), r = a.isFunction(c[e.p.id].afterShowForm), u = a.isFunction(c[e.p.id].beforeInitData) ? c[e.p.id].beforeInitData : !1, t = e.p.id, l = {}, g = !0, f = "DelTbl_" + a.jgrid.jqID(t), p, w, b, s, h = "DelTbl_" + t, j = { themodal: "delmod" + t, modalhead: "delhd" + t, modalcontent: "delcnt" + t, scrollelm: f }; jQuery.isArray(o) && (o = o.join()); if (void 0 !== a("#" + a.jgrid.jqID(j.themodal))[0]) {
                    u && (g = u.call(e, a("#" + f)), "undefined" == typeof g && (g = !0)); if (!1 === g) return; a("#DelData>td", "#" + f).text(o);
                    a("#DelError", "#" + f).hide(); !0 === c[e.p.id].processing && (c[e.p.id].processing = !1, a("#dData", "#" + f).removeClass("ui-state-active")); n && c[e.p.id].beforeShowForm.call(e, a("#" + f)); a.jgrid.viewModal("#" + a.jgrid.jqID(j.themodal), { gbox: "#gbox_" + a.jgrid.jqID(t), jqm: c[e.p.id].jqModal, jqM: !1, overlay: c[e.p.id].overlay, modal: c[e.p.id].modal })
                } else {
                    var i = isNaN(c[e.p.id].dataheight) ? c[e.p.id].dataheight : c[e.p.id].dataheight + "px", h = "<div id='" + h + "' class='formdata' style='width:100%;overflow:auto;position:relative;height:" +
i + ";'><table class='DelTable'><tbody><tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>" + ("<tr id='DelData' style='display:none'><td >" + o + "</td></tr>"), h = h + ('<tr><td class="delmsg" style="white-space:pre;">' + c[e.p.id].msg + "</td></tr><tr><td >&#160;</td></tr>"), h = h + "</tbody></table></div>" + ("<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + f + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>" +
("<a href='javascript:void(0)' id='dData' class='fm-button ui-state-default ui-corner-all'>" + d.bSubmit + "</a>") + "&#160;" + ("<a href='javascript:void(0)' id='eData' class='fm-button ui-state-default ui-corner-all'>" + d.bCancel + "</a>") + "</td></tr></tbody></table>"); d.gbox = "#gbox_" + a.jgrid.jqID(t); a.jgrid.createModal(j, h, d, "#gview_" + a.jgrid.jqID(e.p.id), a("#gview_" + a.jgrid.jqID(e.p.id))[0]); u && (g = u.call(e, a("#" + f)), "undefined" == typeof g && (g = !0)); if (!1 === g) return; a(".fm-button", "#" + f + "_2").hover(function () { a(this).addClass("ui-state-hover") },
function () { a(this).removeClass("ui-state-hover") }); d.delicon = a.extend([!0, "left", "ui-icon-scissors"], c[e.p.id].delicon); d.cancelicon = a.extend([!0, "left", "ui-icon-cancel"], c[e.p.id].cancelicon); !0 === d.delicon[0] && a("#dData", "#" + f + "_2").addClass("right" == d.delicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + d.delicon[2] + "'></span>"); !0 === d.cancelicon[0] && a("#eData", "#" + f + "_2").addClass("right" == d.cancelicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " +
d.cancelicon[2] + "'></span>"); a("#dData", "#" + f + "_2").click(function () {
    var g = [true, ""]; l = {}; var h = a("#DelData>td", "#" + f).text(); a.isFunction(c[e.p.id].onclickSubmit) && (l = c[e.p.id].onclickSubmit.call(e, c[e.p.id], h) || {}); a.isFunction(c[e.p.id].beforeSubmit) && (g = c[e.p.id].beforeSubmit.call(e, h)); if (g[0] && !c[e.p.id].processing) {
        c[e.p.id].processing = true; b = e.p.prmNames; p = a.extend({}, c[e.p.id].delData, l); s = b.oper; p[s] = b.deloper; w = b.id; h = ("" + h).split(","); if (!h.length) return false; for (var i in h) h.hasOwnProperty(i) &&
(h[i] = a.jgrid.stripPref(e.p.idPrefix, h[i])); p[w] = h.join(); a(this).addClass("ui-state-active"); i = a.extend({ url: c[e.p.id].url ? c[e.p.id].url : a(e).jqGrid("getGridParam", "editurl"), type: c[e.p.id].mtype, data: a.isFunction(c[e.p.id].serializeDelData) ? c[e.p.id].serializeDelData.call(e, p) : p, complete: function (b, i) {
    if (i != "success") { g[0] = false; g[1] = a.isFunction(c[e.p.id].errorTextFormat) ? c[e.p.id].errorTextFormat.call(e, b) : i + " Status: '" + b.statusText + "'. Error code: " + b.status } else a.isFunction(c[e.p.id].afterSubmit) &&
(g = c[e.p.id].afterSubmit.call(e, b, p)); if (g[0] === false) { a("#DelError>td", "#" + f).html(g[1]); a("#DelError", "#" + f).show() } else { if (c[e.p.id].reloadAfterSubmit && e.p.datatype != "local") a(e).trigger("reloadGrid"); else { if (e.p.treeGrid === true) try { a(e).jqGrid("delTreeNode", e.p.idPrefix + h[0]) } catch (o) { } else for (var l = 0; l < h.length; l++) a(e).jqGrid("delRowData", e.p.idPrefix + h[l]); e.p.selrow = null; e.p.selarrrow = [] } a.isFunction(c[e.p.id].afterComplete) && setTimeout(function () { c[e.p.id].afterComplete.call(e, b, h) }, 500) } c[e.p.id].processing =
false; a("#dData", "#" + f + "_2").removeClass("ui-state-active"); g[0] && a.jgrid.hideModal("#" + a.jgrid.jqID(j.themodal), { gb: "#gbox_" + a.jgrid.jqID(t), jqm: d.jqModal, onClose: c[e.p.id].onClose })
} 
}, a.jgrid.ajaxOptions, c[e.p.id].ajaxDelOptions); if (!i.url && !c[e.p.id].useDataProxy) if (a.isFunction(e.p.dataProxy)) c[e.p.id].useDataProxy = true; else { g[0] = false; g[1] = g[1] + (" " + a.jgrid.errors.nourl) } if (g[0]) if (c[e.p.id].useDataProxy) {
            i = e.p.dataProxy.call(e, i, "del_" + e.p.id); typeof i == "undefined" && (i = [true, ""]); if (i[0] ===
false) { g[0] = false; g[1] = i[1] || "Error deleting the selected row!" } else a.jgrid.hideModal("#" + a.jgrid.jqID(j.themodal), { gb: "#gbox_" + a.jgrid.jqID(t), jqm: d.jqModal, onClose: c[e.p.id].onClose })
        } else a.ajax(i)
    } if (g[0] === false) { a("#DelError>td", "#" + f).html(g[1]); a("#DelError", "#" + f).show() } return false
}); a("#eData", "#" + f + "_2").click(function () { a.jgrid.hideModal("#" + a.jgrid.jqID(j.themodal), { gb: "#gbox_" + a.jgrid.jqID(t), jqm: c[e.p.id].jqModal, onClose: c[e.p.id].onClose }); return false }); n && c[e.p.id].beforeShowForm.call(e,
a("#" + f)); a.jgrid.viewModal("#" + a.jgrid.jqID(j.themodal), { gbox: "#gbox_" + a.jgrid.jqID(t), jqm: c[e.p.id].jqModal, overlay: c[e.p.id].overlay, modal: c[e.p.id].modal })
                } r && c[e.p.id].afterShowForm.call(e, a("#" + f)); !0 === c[e.p.id].closeOnEscape && setTimeout(function () { a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(j.modalhead)).focus() }, 0)
            } 
        })
    }, navGrid: function (c, d, e, n, r, u, t) {
        d = a.extend({ edit: !0, editicon: "ui-icon-pencil", add: !0, addicon: "ui-icon-plus", del: !0, delicon: "ui-icon-trash", search: !0, searchicon: "ui-icon-search",
            refresh: !0, refreshicon: "ui-icon-refresh", refreshstate: "firstpage", view: !1, viewicon: "ui-icon-document", position: "left", closeOnEscape: !0, beforeRefresh: null, afterRefresh: null, cloneToTop: !1, alertwidth: 200, alertheight: "auto", alerttop: null, alertleft: null, alertzIndex: null
        }, a.jgrid.nav, d || {}); return this.each(function () {
            if (!this.nav) {
                var l = { themodal: "alertmod", modalhead: "alerthd", modalcontent: "alertcnt" }, g = this, f; if (g.grid && "string" == typeof c) {
                    void 0 === a("#" + l.themodal)[0] && (!d.alerttop && !d.alertleft && ("undefined" !=
typeof window.innerWidth ? (d.alertleft = window.innerWidth, d.alerttop = window.innerHeight) : "undefined" != typeof document.documentElement && "undefined" != typeof document.documentElement.clientWidth && 0 !== document.documentElement.clientWidth ? (d.alertleft = document.documentElement.clientWidth, d.alerttop = document.documentElement.clientHeight) : (d.alertleft = 1024, d.alerttop = 768), d.alertleft = d.alertleft / 2 - parseInt(d.alertwidth, 10) / 2, d.alerttop = d.alerttop / 2 - 25), a.jgrid.createModal(l, "<div>" + d.alerttext + "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>",
{ gbox: "#gbox_" + a.jgrid.jqID(g.p.id), jqModal: !0, drag: !0, resize: !0, caption: d.alertcap, top: d.alerttop, left: d.alertleft, width: d.alertwidth, height: d.alertheight, closeOnEscape: d.closeOnEscape, zIndex: d.alertzIndex }, "", "", !0)); var p = 1; d.cloneToTop && g.p.toppager && (p = 2); for (var w = 0; w < p; w++) {
                        var b = a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"), s, h; 0 === w ? (s = c, h = g.p.id, s == g.p.toppager && (h += "_top", p = 1)) :
(s = g.p.toppager, h = g.p.id + "_top"); "rtl" == g.p.direction && a(b).attr("dir", "rtl").css("float", "right"); d.add && (n = n || {}, f = a("<td class='ui-pg-button ui-corner-all'></td>"), a(f).append("<div class='ui-pg-div'><span class='ui-icon " + d.addicon + "'></span>" + d.addtext + "</div>"), a("tr", b).append(f), a(f, b).attr({ title: d.addtitle || "", id: n.id || "add_" + h }).click(function () { a(this).hasClass("ui-state-disabled") || (a.isFunction(d.addfunc) ? d.addfunc.call(g) : a(g).jqGrid("editGridRow", "new", n)); return false }).hover(function () {
    a(this).hasClass("ui-state-disabled") ||
a(this).addClass("ui-state-hover")
}, function () { a(this).removeClass("ui-state-hover") }), f = null); d.edit && (f = a("<td class='ui-pg-button ui-corner-all'></td>"), e = e || {}, a(f).append("<div class='ui-pg-div'><span class='ui-icon " + d.editicon + "'></span>" + d.edittext + "</div>"), a("tr", b).append(f), a(f, b).attr({ title: d.edittitle || "", id: e.id || "edit_" + h }).click(function () {
    if (!a(this).hasClass("ui-state-disabled")) {
        var b = g.p.selrow; if (b) a.isFunction(d.editfunc) ? d.editfunc.call(g, b) : a(g).jqGrid("editGridRow", b, e);
        else { a.jgrid.viewModal("#" + l.themodal, { gbox: "#gbox_" + a.jgrid.jqID(g.p.id), jqm: true }); a("#jqg_alrt").focus() } 
    } return false
}).hover(function () { a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") }), f = null); d.view && (f = a("<td class='ui-pg-button ui-corner-all'></td>"), t = t || {}, a(f).append("<div class='ui-pg-div'><span class='ui-icon " + d.viewicon + "'></span>" + d.viewtext + "</div>"), a("tr", b).append(f), a(f, b).attr({ title: d.viewtitle || "",
    id: t.id || "view_" + h
}).click(function () { if (!a(this).hasClass("ui-state-disabled")) { var b = g.p.selrow; if (b) a.isFunction(d.viewfunc) ? d.viewfunc.call(g, b) : a(g).jqGrid("viewGridRow", b, t); else { a.jgrid.viewModal("#" + l.themodal, { gbox: "#gbox_" + a.jgrid.jqID(g.p.id), jqm: true }); a("#jqg_alrt").focus() } } return false }).hover(function () { a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") }), f = null); d.del && (f = a("<td class='ui-pg-button ui-corner-all'></td>"),
r = r || {}, a(f).append("<div class='ui-pg-div'><span class='ui-icon " + d.delicon + "'></span>" + d.deltext + "</div>"), a("tr", b).append(f), a(f, b).attr({ title: d.deltitle || "", id: r.id || "del_" + h }).click(function () { if (!a(this).hasClass("ui-state-disabled")) { var b; if (g.p.multiselect) { b = g.p.selarrrow; b.length === 0 && (b = null) } else b = g.p.selrow; if (b) a.isFunction(d.delfunc) ? d.delfunc.call(g, b) : a(g).jqGrid("delGridRow", b, r); else { a.jgrid.viewModal("#" + l.themodal, { gbox: "#gbox_" + a.jgrid.jqID(g.p.id), jqm: true }); a("#jqg_alrt").focus() } } return false }).hover(function () {
    a(this).hasClass("ui-state-disabled") ||
a(this).addClass("ui-state-hover")
}, function () { a(this).removeClass("ui-state-hover") }), f = null); (d.add || d.edit || d.del || d.view) && a("tr", b).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>"); d.search && (f = a("<td class='ui-pg-button ui-corner-all'></td>"), u = u || {}, a(f).append("<div class='ui-pg-div'><span class='ui-icon " + d.searchicon + "'></span>" + d.searchtext + "</div>"), a("tr", b).append(f), a(f, b).attr({ title: d.searchtitle || "", id: u.id || "search_" +
h
}).click(function () { a(this).hasClass("ui-state-disabled") || (a.isFunction(d.searchfunc) ? d.searchfunc.call(g, u) : a(g).jqGrid("searchGrid", u)); return false }).hover(function () { a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") }), u.showOnLoad && !0 === u.showOnLoad && a(f, b).click(), f = null); d.refresh && (f = a("<td class='ui-pg-button ui-corner-all'></td>"), a(f).append("<div class='ui-pg-div'><span class='ui-icon " + d.refreshicon + "'></span>" +
d.refreshtext + "</div>"), a("tr", b).append(f), a(f, b).attr({ title: d.refreshtitle || "", id: "refresh_" + h }).click(function () {
    if (!a(this).hasClass("ui-state-disabled")) {
        a.isFunction(d.beforeRefresh) && d.beforeRefresh.call(g); g.p.search = false; try { var b = g.p.id; g.p.postData.filters = ""; a("#fbox_" + a.jgrid.jqID(b)).jqFilter("resetFilter"); a.isFunction(g.clearToolbar) && g.clearToolbar.call(g, false) } catch (c) { } switch (d.refreshstate) {
            case "firstpage": a(g).trigger("reloadGrid", [{ page: 1}]); break; case "current": a(g).trigger("reloadGrid",
[{ current: true}])
        } a.isFunction(d.afterRefresh) && d.afterRefresh.call(g)
    } return false
}).hover(function () { a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") }), f = null); f = a(".ui-jqgrid").css("font-size") || "11px"; a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + f + ";visibility:hidden;' ></div>"); f = a(b).clone().appendTo("#testpg2").width(); a("#testpg2").remove(); a(s + "_" + d.position,
s).append(b); g.p._nvtd && (f > g.p._nvtd[0] && (a(s + "_" + d.position, s).width(f), g.p._nvtd[0] = f), g.p._nvtd[1] = f); b = f = f = null; this.nav = !0
                    } 
                } 
            } 
        })
    }, navButtonAdd: function (c, d) {
        d = a.extend({ caption: "newButton", title: "", buttonicon: "ui-icon-newwin", onClickButton: null, position: "last", cursor: "pointer" }, d || {}); return this.each(function () {
            if (this.grid) {
                "string" === typeof c && 0 !== c.indexOf("#") && (c = "#" + a.jgrid.jqID(c)); var e = a(".navtable", c)[0], n = this; if (e && !(d.id && void 0 !== a("#" + a.jgrid.jqID(d.id), e)[0])) {
                    var r = a("<td></td>");
                    "NONE" == d.buttonicon.toString().toUpperCase() ? a(r).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>" + d.caption + "</div>") : a(r).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon " + d.buttonicon + "'></span>" + d.caption + "</div>"); d.id && a(r).attr("id", d.id); "first" == d.position ? 0 === e.rows[0].cells.length ? a("tr", e).append(r) : a("tr td:eq(0)", e).before(r) : a("tr", e).append(r); a(r, e).attr("title", d.title || "").click(function (c) {
                        a(this).hasClass("ui-state-disabled") ||
a.isFunction(d.onClickButton) && d.onClickButton.call(n, c); return !1
                    }).hover(function () { a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") })
                } 
            } 
        })
    }, navSeparatorAdd: function (c, d) {
        d = a.extend({ sepclass: "ui-separator", sepcontent: "" }, d || {}); return this.each(function () {
            if (this.grid) {
                "string" === typeof c && 0 !== c.indexOf("#") && (c = "#" + a.jgrid.jqID(c)); var e = a(".navtable", c)[0]; if (e) {
                    var n = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" +
d.sepclass + "'></span>" + d.sepcontent + "</td>"; a("tr", e).append(n)
                } 
            } 
        })
    }, GridToForm: function (c, d) {
        return this.each(function () {
            var e = this; if (e.grid) {
                var n = a(e).jqGrid("getRowData", c); if (n) for (var r in n) a("[name=" + a.jgrid.jqID(r) + "]", d).is("input:radio") || a("[name=" + a.jgrid.jqID(r) + "]", d).is("input:checkbox") ? a("[name=" + a.jgrid.jqID(r) + "]", d).each(function () { if (a(this).val() == n[r]) a(this)[e.p.useProp ? "prop" : "attr"]("checked", !0); else a(this)[e.p.useProp ? "prop" : "attr"]("checked", !1) }) : a("[name=" + a.jgrid.jqID(r) +
"]", d).val(n[r])
            } 
        })
    }, FormToGrid: function (c, d, e, n) { return this.each(function () { if (this.grid) { e || (e = "set"); n || (n = "first"); var r = a(d).serializeArray(), u = {}; a.each(r, function (a, c) { u[c.name] = c.value }); "add" == e ? a(this).jqGrid("addRowData", c, u, n) : "set" == e && a(this).jqGrid("setRowData", c, u) } }) } 
    })
})(jQuery);
(function (a) {
    a.fn.jqFilter = function (d) {
        if ("string" === typeof d) { var n = a.fn.jqFilter[d]; if (!n) throw "jqFilter - No such method: " + d; var u = a.makeArray(arguments).slice(1); return n.apply(this, u) } var o = a.extend(!0, { filter: null, columns: [], onChange: null, afterRedraw: null, checkValues: null, error: !1, errmsg: "", errorcheck: !0, showQuery: !0, sopt: null, ops: [{ name: "eq", description: "equal", operator: "=" }, { name: "ne", description: "not equal", operator: "<>" }, { name: "lt", description: "less", operator: "<" }, { name: "le", description: "less or equal",
            operator: "<="
        }, { name: "gt", description: "greater", operator: ">" }, { name: "ge", description: "greater or equal", operator: ">=" }, { name: "bw", description: "begins with", operator: "LIKE" }, { name: "bn", description: "does not begin with", operator: "NOT LIKE" }, { name: "in", description: "in", operator: "IN" }, { name: "ni", description: "not in", operator: "NOT IN" }, { name: "ew", description: "ends with", operator: "LIKE" }, { name: "en", description: "does not end with", operator: "NOT LIKE" }, { name: "cn", description: "contains", operator: "LIKE" }, { name: "nc",
            description: "does not contain", operator: "NOT LIKE"
        }, { name: "nu", description: "is null", operator: "IS NULL" }, { name: "nn", description: "is not null", operator: "IS NOT NULL"}], numopts: "eq ne lt le gt ge nu nn in ni".split(" "), stropts: "eq ne bw bn ew en cn nc nu nn in ni".split(" "), _gridsopt: [], groupOps: [{ op: "AND", text: "AND" }, { op: "OR", text: "OR"}], groupButton: !0, ruleButtons: !0, direction: "ltr"
        }, a.jgrid.filter, d || {}); return this.each(function () {
            if (!this.filter) {
                this.p = o; if (null === this.p.filter || void 0 === this.p.filter) this.p.filter =
{ groupOp: this.p.groupOps[0].op, rules: [], groups: [] }; var d, n = this.p.columns.length, f, t = /msie/i.test(navigator.userAgent) && !window.opera; if (this.p._gridsopt.length) for (d = 0; d < this.p._gridsopt.length; d++) this.p.ops[d].description = this.p._gridsopt[d]; this.p.initFilter = a.extend(!0, {}, this.p.filter); if (n) {
                    for (d = 0; d < n; d++) if (f = this.p.columns[d], f.stype ? f.inputtype = f.stype : f.inputtype || (f.inputtype = "text"), f.sorttype ? f.searchtype = f.sorttype : f.searchtype || (f.searchtype = "string"), void 0 === f.hidden && (f.hidden =
!1), f.label || (f.label = f.name), f.index && (f.name = f.index), f.hasOwnProperty("searchoptions") || (f.searchoptions = {}), !f.hasOwnProperty("searchrules")) f.searchrules = {}; this.p.showQuery && a(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='" + this.p.direction + "'><tbody><tr><td class='query'></td></tr></tbody></table>"); var r = function (g, k) {
    var b = [!0, ""]; if (a.isFunction(k.searchrules)) b = k.searchrules(g, k); else if (a.jgrid && a.jgrid.checkValues) try {
        b =
a.jgrid.checkValues(g, -1, null, k.searchrules, k.label)
    } catch (c) { } b && (b.length && !1 === b[0]) && (o.error = !b[0], o.errmsg = b[1])
}; this.onchange = function () { this.p.error = !1; this.p.errmsg = ""; return a.isFunction(this.p.onChange) ? this.p.onChange.call(this, this.p) : !1 }; this.reDraw = function () { a("table.group:first", this).remove(); var g = this.createTableForGroup(o.filter, null); a(this).append(g); a.isFunction(this.p.afterRedraw) && this.p.afterRedraw.call(this, this.p) }; this.createTableForGroup = function (g, k) {
    var b = this, c,
e = a("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>"), d = "left"; "rtl" == this.p.direction && (d = "right", e.attr("dir", "rtl")); null === k && e.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='" + d + "'></th></tr>"); var h = a("<tr></tr>"); e.append(h); d = a("<th colspan='5' align='" + d + "'></th>"); h.append(d); if (!0 === this.p.ruleButtons) {
        var i = a("<select class='opsel'></select>"); d.append(i); var h = "", f; for (c = 0; c < o.groupOps.length; c++) f =
g.groupOp === b.p.groupOps[c].op ? " selected='selected'" : "", h += "<option value='" + b.p.groupOps[c].op + "'" + f + ">" + b.p.groupOps[c].text + "</option>"; i.append(h).bind("change", function () { g.groupOp = a(i).val(); b.onchange() })
    } h = "<span></span>"; this.p.groupButton && (h = a("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>"), h.bind("click", function () { if (g.groups === void 0) g.groups = []; g.groups.push({ groupOp: o.groupOps[0].op, rules: [], groups: [] }); b.reDraw(); b.onchange(); return false })); d.append(h);
    if (!0 === this.p.ruleButtons) {
        var h = a("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>"), l; h.bind("click", function () {
            if (g.rules === void 0) g.rules = []; for (c = 0; c < b.p.columns.length; c++) { var a = typeof b.p.columns[c].search === "undefined" ? true : b.p.columns[c].search, e = b.p.columns[c].hidden === true; if (b.p.columns[c].searchoptions.searchhidden === true && a || a && !e) { l = b.p.columns[c]; break } } g.rules.push({ field: l.name, op: (l.searchoptions.sopt ? l.searchoptions.sopt : b.p.sopt ? b.p.sopt : l.searchtype ===
"string" ? b.p.stropts : b.p.numopts)[0], data: ""
            }); b.reDraw(); return false
        }); d.append(h)
    } null !== k && (h = a("<input type='button' value='-' title='Delete group' class='delete-group'/>"), d.append(h), h.bind("click", function () { for (c = 0; c < k.groups.length; c++) if (k.groups[c] === g) { k.groups.splice(c, 1); break } b.reDraw(); b.onchange(); return false })); if (void 0 !== g.groups) for (c = 0; c < g.groups.length; c++) d = a("<tr></tr>"), e.append(d), h = a("<td class='first'></td>"), d.append(h), h = a("<td colspan='4'></td>"), h.append(this.createTableForGroup(g.groups[c],
g)), d.append(h); void 0 === g.groupOp && (g.groupOp = b.p.groupOps[0].op); if (void 0 !== g.rules) for (c = 0; c < g.rules.length; c++) e.append(this.createTableRowForRule(g.rules[c], g)); return e
}; this.createTableRowForRule = function (g, d) {
    var b = this, c = a("<tr></tr>"), e, f, h, i, j = "", l; c.append("<td class='first'></td>"); var m = a("<td class='columns'></td>"); c.append(m); var n = a("<select></select>"), p, q = []; m.append(n); n.bind("change", function () {
        g.field = a(n).val(); h = a(this).parents("tr:first"); for (e = 0; e < b.p.columns.length; e++) if (b.p.columns[e].name ===
g.field) { i = b.p.columns[e]; break } if (i) {
            i.searchoptions.id = a.jgrid.randId(); t && "text" === i.inputtype && !i.searchoptions.size && (i.searchoptions.size = 10); var c = a.jgrid.createEl(i.inputtype, i.searchoptions, "", !0, b.p.ajaxSelectOptions, !0); a(c).addClass("input-elm"); f = i.searchoptions.sopt ? i.searchoptions.sopt : b.p.sopt ? b.p.sopt : "string" === i.searchtype ? b.p.stropts : b.p.numopts; var d = "", k = 0; q = []; a.each(b.p.ops, function () { q.push(this.name) }); for (e = 0; e < f.length; e++) p = a.inArray(f[e], q), -1 !== p && (0 === k && (g.op = b.p.ops[p].name),
d += "<option value='" + b.p.ops[p].name + "'>" + b.p.ops[p].description + "</option>", k++); a(".selectopts", h).empty().append(d); a(".selectopts", h)[0].selectedIndex = 0; a.browser.msie && 9 > a.browser.version && (d = parseInt(a("select.selectopts", h)[0].offsetWidth) + 1, a(".selectopts", h).width(d), a(".selectopts", h).css("width", "auto")); a(".data", h).empty().append(c); a(".input-elm", h).bind("change", function (c) {
    var d = a(this).hasClass("ui-autocomplete-input") ? 200 : 0; setTimeout(function () {
        var d = c.target; g.data = d.nodeName.toUpperCase() ===
"SPAN" && i.searchoptions && a.isFunction(i.searchoptions.custom_value) ? i.searchoptions.custom_value(a(d).children(".customelement:first"), "get") : d.value; b.onchange()
    }, d)
}); setTimeout(function () { g.data = a(c).val(); b.onchange() }, 0)
        } 
    }); for (e = m = 0; e < b.p.columns.length; e++) {
        l = "undefined" === typeof b.p.columns[e].search ? !0 : b.p.columns[e].search; var r = !0 === b.p.columns[e].hidden; if (!0 === b.p.columns[e].searchoptions.searchhidden && l || l && !r) l = "", g.field === b.p.columns[e].name && (l = " selected='selected'", m = e), j += "<option value='" +
b.p.columns[e].name + "'" + l + ">" + b.p.columns[e].label + "</option>"
    } n.append(j); j = a("<td class='operators'></td>"); c.append(j); i = o.columns[m]; i.searchoptions.id = a.jgrid.randId(); t && "text" === i.inputtype && !i.searchoptions.size && (i.searchoptions.size = 10); var m = a.jgrid.createEl(i.inputtype, i.searchoptions, g.data, !0, b.p.ajaxSelectOptions, !0), s = a("<select class='selectopts'></select>"); j.append(s); s.bind("change", function () {
        g.op = a(s).val(); h = a(this).parents("tr:first"); var c = a(".input-elm", h)[0]; if (g.op === "nu" ||
g.op === "nn") { g.data = ""; c.value = ""; c.setAttribute("readonly", "true"); c.setAttribute("disabled", "true") } else { c.removeAttribute("readonly"); c.removeAttribute("disabled") } b.onchange()
    }); f = i.searchoptions.sopt ? i.searchoptions.sopt : b.p.sopt ? b.p.sopt : "string" === i.searchtype ? o.stropts : b.p.numopts; j = ""; a.each(b.p.ops, function () { q.push(this.name) }); for (e = 0; e < f.length; e++) p = a.inArray(f[e], q), -1 !== p && (l = g.op === b.p.ops[p].name ? " selected='selected'" : "", j += "<option value='" + b.p.ops[p].name + "'" + l + ">" + b.p.ops[p].description +
"</option>"); s.append(j); j = a("<td class='data'></td>"); c.append(j); j.append(m); a(m).addClass("input-elm").bind("change", function () { g.data = i.inputtype === "custom" ? i.searchoptions.custom_value(a(this).children(".customelement:first"), "get") : a(this).val(); b.onchange() }); j = a("<td></td>"); c.append(j); !0 === this.p.ruleButtons && (m = a("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>"), j.append(m), m.bind("click", function () {
    for (e = 0; e < d.rules.length; e++) if (d.rules[e] === g) {
        d.rules.splice(e,
1); break
    } b.reDraw(); b.onchange(); return false
})); return c
}; this.getStringForGroup = function (a) { var d = "(", b; if (void 0 !== a.groups) for (b = 0; b < a.groups.length; b++) { 1 < d.length && (d += " " + a.groupOp + " "); try { d += this.getStringForGroup(a.groups[b]) } catch (c) { alert(c) } } if (void 0 !== a.rules) try { for (b = 0; b < a.rules.length; b++) 1 < d.length && (d += " " + a.groupOp + " "), d += this.getStringForRule(a.rules[b]) } catch (e) { alert(e) } d += ")"; return "()" === d ? "" : d }; this.getStringForRule = function (d) {
    var f = "", b = "", c, e; for (c = 0; c < this.p.ops.length; c++) if (this.p.ops[c].name ===
d.op) { f = this.p.ops[c].operator; b = this.p.ops[c].name; break } for (c = 0; c < this.p.columns.length; c++) if (this.p.columns[c].name === d.field) { e = this.p.columns[c]; break } c = d.data; if ("bw" === b || "bn" === b) c += "%"; if ("ew" === b || "en" === b) c = "%" + c; if ("cn" === b || "nc" === b) c = "%" + c + "%"; if ("in" === b || "ni" === b) c = " (" + c + ")"; o.errorcheck && r(d.data, e); return -1 !== a.inArray(e.searchtype, ["int", "integer", "float", "number", "currency"]) || "nn" === b || "nu" === b ? d.field + " " + f + " " + c : d.field + " " + f + ' "' + c + '"'
}; this.resetFilter = function () {
    this.p.filter =
a.extend(!0, {}, this.p.initFilter); this.reDraw(); this.onchange()
}; this.hideError = function () { a("th.ui-state-error", this).html(""); a("tr.error", this).hide() }; this.showError = function () { a("th.ui-state-error", this).html(this.p.errmsg); a("tr.error", this).show() }; this.toUserFriendlyString = function () { return this.getStringForGroup(o.filter) }; this.toString = function () {
    function a(b) {
        var c = "(", e; if (void 0 !== b.groups) for (e = 0; e < b.groups.length; e++) 1 < c.length && (c = "OR" === b.groupOp ? c + " || " : c + " && "), c += a(b.groups[e]);
        if (void 0 !== b.rules) for (e = 0; e < b.rules.length; e++) { 1 < c.length && (c = "OR" === b.groupOp ? c + " || " : c + " && "); var f = b.rules[e]; if (d.p.errorcheck) { for (var h = void 0, i = void 0, h = 0; h < d.p.columns.length; h++) if (d.p.columns[h].name === f.field) { i = d.p.columns[h]; break } i && r(f.data, i) } c += f.op + "(item." + f.field + ",'" + f.data + "')" } c += ")"; return "()" === c ? "" : c
    } var d = this; return a(this.p.filter)
}; this.reDraw(); if (this.p.showQuery) this.onchange(); this.filter = !0
                } 
            } 
        })
    }; a.extend(a.fn.jqFilter, { toSQLString: function () {
        var a = ""; this.each(function () {
            a =
this.toUserFriendlyString()
        }); return a
    }, filterData: function () { var a; this.each(function () { a = this.p.filter }); return a }, getParameter: function (a) { return void 0 !== a && this.p.hasOwnProperty(a) ? this.p[a] : this.p }, resetFilter: function () { return this.each(function () { this.resetFilter() }) }, addFilter: function (a) { "string" === typeof a && (a = jQuery.jgrid.parse(a)); this.each(function () { this.p.filter = a; this.reDraw(); this.onchange() }) } 
    })
})(jQuery);
(function (a) {
    a.jgrid.inlineEdit = a.jgrid.inlineEdit || {}; a.jgrid.extend({ editRow: function (c, d, b, k, g, l, p, h, e) {
        var j = {}, f = a.makeArray(arguments).slice(1); if ("object" === a.type(f[0])) j = f[0]; else if ("undefined" !== typeof d && (j.keys = d), a.isFunction(b) && (j.oneditfunc = b), a.isFunction(k) && (j.successfunc = k), "undefined" !== typeof g && (j.url = g), "undefined" !== typeof l && (j.extraparam = l), a.isFunction(p) && (j.aftersavefunc = p), a.isFunction(h) && (j.errorfunc = h), a.isFunction(e)) j.afterrestorefunc = e; j = a.extend(!0, { keys: !1,
            oneditfunc: null, successfunc: null, url: null, extraparam: {}, aftersavefunc: null, errorfunc: null, afterrestorefunc: null, restoreAfterError: !0, mtype: "POST"
        }, a.jgrid.inlineEdit, j); return this.each(function () {
            var e = this, d, b, f, g = 0, h = null, l = {}, m, n; e.grid && (m = a(e).jqGrid("getInd", c, !0), !1 !== m && (f = a(m).attr("editable") || "0", "0" == f && !a(m).hasClass("not-editable-row") && (n = e.p.colModel, a('td[role="gridcell"]', m).each(function (f) {
                d = n[f].name; var j = !0 === e.p.treeGrid && d == e.p.ExpandColumn; if (j) b = a("span:first", this).html();
                else try { b = a.unformat.call(e, this, { rowId: c, colModel: n[f] }, f) } catch (m) { b = n[f].edittype && "textarea" == n[f].edittype ? a(this).text() : a(this).html() } if ("cb" != d && ("subgrid" != d && "rn" != d) && (e.p.autoencode && (b = a.jgrid.htmlDecode(b)), l[d] = b, !0 === n[f].editable)) {
                    null === h && (h = f); j ? a("span:first", this).html("") : a(this).html(""); var k = a.extend({}, n[f].editoptions || {}, { id: c + "_" + d, name: d }); n[f].edittype || (n[f].edittype = "text"); if ("&nbsp;" == b || "&#160;" == b || 1 == b.length && 160 == b.charCodeAt(0)) b = ""; k = a.jgrid.createEl.call(e,
n[f].edittype, k, b, !0, a.extend({}, a.jgrid.ajaxOptions, e.p.ajaxSelectOptions || {})); a(k).addClass("editable"); j ? a("span:first", this).append(k) : a(this).append(k); "select" == n[f].edittype && ("undefined" !== typeof n[f].editoptions && !0 === n[f].editoptions.multiple && "undefined" === typeof n[f].editoptions.dataUrl && a.browser.msie) && a(k).width(a(k).width()); g++
                } 
            }), 0 < g && (l.id = c, e.p.savedRow.push(l), a(m).attr("editable", "1"), a("td:eq(" + h + ") input", m).focus(), !0 === j.keys && a(m).bind("keydown", function (f) {
                if (27 === f.keyCode) {
                    a(e).jqGrid("restoreRow",
c, j.afterrestorefunc); if (e.p._inlinenav) try { a(e).jqGrid("showAddEditButtons") } catch (b) { } return !1
                } if (13 === f.keyCode) { if ("TEXTAREA" == f.target.tagName) return !0; if (a(e).jqGrid("saveRow", c, j) && e.p._inlinenav) try { a(e).jqGrid("showAddEditButtons") } catch (d) { } return !1 } 
            }), a(e).triggerHandler("jqGridInlineEditRow", [c, j]), a.isFunction(j.oneditfunc) && j.oneditfunc.call(e, c)))))
        })
    }, saveRow: function (c, d, b, k, g, l, p) {
        var h = a.makeArray(arguments).slice(1), e = {}; if ("object" === a.type(h[0])) e = h[0]; else if (a.isFunction(d) &&
(e.successfunc = d), "undefined" !== typeof b && (e.url = b), "undefined" !== typeof k && (e.extraparam = k), a.isFunction(g) && (e.aftersavefunc = g), a.isFunction(l) && (e.errorfunc = l), a.isFunction(p)) e.afterrestorefunc = p; var e = a.extend(!0, { successfunc: null, url: null, extraparam: {}, aftersavefunc: null, errorfunc: null, afterrestorefunc: null, restoreAfterError: !0, mtype: "POST" }, a.jgrid.inlineEdit, e), j = !1, f = this[0], o, i = {}, u = {}, r = {}, t, s, q; if (!f.grid) return j; q = a(f).jqGrid("getInd", c, !0); if (!1 === q) return j; h = a(q).attr("editable");
        e.url = e.url ? e.url : f.p.editurl; if ("1" === h) {
            var m; a('td[role="gridcell"]', q).each(function (c) {
                m = f.p.colModel[c]; o = m.name; if ("cb" != o && "subgrid" != o && !0 === m.editable && "rn" != o && !a(this).hasClass("not-editable-cell")) {
                    switch (m.edittype) {
                        case "checkbox": var b = ["Yes", "No"]; m.editoptions && (b = m.editoptions.value.split(":")); i[o] = a("input", this).is(":checked") ? b[0] : b[1]; break; case "text": case "password": case "textarea": case "button": i[o] = a("input, textarea", this).val(); break; case "select": if (m.editoptions.multiple) {
                                var b =
a("select", this), d = []; i[o] = a(b).val(); i[o] = i[o] ? i[o].join(",") : ""; a("select option:selected", this).each(function (e, f) { d[e] = a(f).text() }); u[o] = d.join(",")
                            } else i[o] = a("select option:selected", this).val(), u[o] = a("select option:selected", this).text(); m.formatter && "select" == m.formatter && (u = {}); break; case "custom": try { if (m.editoptions && a.isFunction(m.editoptions.custom_value)) { if (i[o] = m.editoptions.custom_value.call(f, a(".customelement", this), "get"), void 0 === i[o]) throw "e2"; } else throw "e1"; } catch (g) {
                                "e1" ==
g && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose), "e2" == g ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, g.message, a.jgrid.edit.bClose)
                            } 
                    } s = a.jgrid.checkValues(i[o], c, f); if (!1 === s[0]) return s[1] = i[o] + " " + s[1], !1; f.p.autoencode && (i[o] = a.jgrid.htmlEncode(i[o])); "clientArray" !== e.url && m.editoptions && !0 === m.editoptions.NullIfEmpty &&
"" === i[o] && (r[o] = "null")
                } 
            }); if (!1 === s[0]) { try { var n = a.jgrid.findPos(a("#" + a.jgrid.jqID(c), f.grid.bDiv)[0]); a.jgrid.info_dialog(a.jgrid.errors.errcap, s[1], a.jgrid.edit.bClose, { left: n[0], top: n[1] }) } catch (w) { alert(s[1]) } return j } var v, h = f.p.prmNames; v = h.oper; n = h.id; i && (i[v] = h.editoper, i[n] = c, "undefined" == typeof f.p.inlineData && (f.p.inlineData = {}), i = a.extend({}, i, f.p.inlineData, e.extraparam)); if ("clientArray" == e.url) {
                i = a.extend({}, i, u); f.p.autoencode && a.each(i, function (e, f) { i[e] = a.jgrid.htmlDecode(f) });
                n = a(f).jqGrid("setRowData", c, i); a(q).attr("editable", "0"); for (h = 0; h < f.p.savedRow.length; h++) if (f.p.savedRow[h].id == c) { t = h; break } 0 <= t && f.p.savedRow.splice(t, 1); a(f).triggerHandler("jqGridInlineAfterSaveRow", [c, n, i, e]); a.isFunction(e.aftersavefunc) && e.aftersavefunc.call(f, c, n, e); j = !0; a(q).unbind("keydown")
            } else a("#lui_" + a.jgrid.jqID(f.p.id)).show(), r = a.extend({}, i, r), r[n] = a.jgrid.stripPref(f.p.idPrefix, r[n]), a.ajax(a.extend({ url: e.url, data: a.isFunction(f.p.serializeRowData) ? f.p.serializeRowData.call(f,
r) : r, type: e.mtype, async: !1, complete: function (b, d) {
    a("#lui_" + a.jgrid.jqID(f.p.id)).hide(); if (d === "success") {
        var g = true, h; h = a(f).triggerHandler("jqGridInlineSuccessSaveRow", [b, c, e]); a.isArray(h) || (h = [true, i]); h[0] && a.isFunction(e.successfunc) && (h = e.successfunc.call(f, b)); if (a.isArray(h)) { g = h[0]; i = h[1] ? h[1] : i } else g = h; if (g === true) {
            f.p.autoencode && a.each(i, function (b, e) { i[b] = a.jgrid.htmlDecode(e) }); i = a.extend({}, i, u); a(f).jqGrid("setRowData", c, i); a(q).attr("editable", "0"); for (g = 0; g < f.p.savedRow.length; g++) if (f.p.savedRow[g].id ==
c) { t = g; break } t >= 0 && f.p.savedRow.splice(t, 1); a(f).triggerHandler("jqGridInlineAfterSaveRow", [c, b, i, e]); a.isFunction(e.aftersavefunc) && e.aftersavefunc.call(f, c, b); j = true; a(q).unbind("keydown")
        } else { a(f).triggerHandler("jqGridInlineErrorSaveRow", [c, b, d, null, e]); a.isFunction(e.errorfunc) && e.errorfunc.call(f, c, b, d, null); e.restoreAfterError === true && a(f).jqGrid("restoreRow", c, e.afterrestorefunc) } 
    } 
}, error: function (b, d, g) {
    a("#lui_" + a.jgrid.jqID(f.p.id)).hide(); a(f).triggerHandler("jqGridInlineErrorSaveRow",
[c, b, d, g, e]); if (a.isFunction(e.errorfunc)) e.errorfunc.call(f, c, b, d, g); else { b = b.responseText || b.statusText; try { a.jgrid.info_dialog(a.jgrid.errors.errcap, '<div class="ui-state-error">' + b + "</div>", a.jgrid.edit.bClose, { buttonalign: "right" }) } catch (h) { alert(b) } } e.restoreAfterError === true && a(f).jqGrid("restoreRow", c, e.afterrestorefunc)
} 
            }, a.jgrid.ajaxOptions, f.p.ajaxRowOptions || {}))
        } return j
    }, restoreRow: function (c, d) {
        var b = a.makeArray(arguments).slice(1), k = {}; "object" === a.type(b[0]) ? k = b[0] : a.isFunction(d) &&
(k.afterrestorefunc = d); k = a.extend(!0, a.jgrid.inlineEdit, k); return this.each(function () {
    var b = this, d, p, h = {}; if (b.grid) {
        p = a(b).jqGrid("getInd", c, true); if (p !== false) {
            for (var e = 0; e < b.p.savedRow.length; e++) if (b.p.savedRow[e].id == c) { d = e; break } if (d >= 0) {
                if (a.isFunction(a.fn.datepicker)) try { a("input.hasDatepicker", "#" + a.jgrid.jqID(p.id)).datepicker("hide") } catch (j) { } a.each(b.p.colModel, function () { this.editable === true && this.name in b.p.savedRow[d] && (h[this.name] = b.p.savedRow[d][this.name]) }); a(b).jqGrid("setRowData",
c, h); a(p).attr("editable", "0").unbind("keydown"); b.p.savedRow.splice(d, 1); a("#" + a.jgrid.jqID(c), "#" + a.jgrid.jqID(b.p.id)).hasClass("jqgrid-new-row") && setTimeout(function () { a(b).jqGrid("delRowData", c) }, 0)
            } a(b).triggerHandler("jqGridInlineAfterRestoreRow", [c]); a.isFunction(k.afterrestorefunc) && k.afterrestorefunc.call(b, c)
        } 
    } 
})
    }, addRow: function (c) {
        c = a.extend(!0, { rowID: "new_row", initdata: {}, position: "first", useDefValues: !0, useFormatter: !1, addRowParams: { extraparam: {}} }, c || {}); return this.each(function () {
            if (this.grid) {
                var d =
this; !0 === c.useDefValues && a(d.p.colModel).each(function () { if (this.editoptions && this.editoptions.defaultValue) { var b = this.editoptions.defaultValue, b = a.isFunction(b) ? b.call(d) : b; c.initdata[this.name] = b } }); a(d).jqGrid("addRowData", c.rowID, c.initdata, c.position); c.rowID = d.p.idPrefix + c.rowID; a("#" + a.jgrid.jqID(c.rowID), "#" + a.jgrid.jqID(d.p.id)).addClass("jqgrid-new-row"); if (c.useFormatter) a("#" + a.jgrid.jqID(c.rowID) + " .ui-inline-edit", "#" + a.jgrid.jqID(d.p.id)).click(); else {
                    var b = d.p.prmNames; c.addRowParams.extraparam[b.oper] =
b.addoper; a(d).jqGrid("editRow", c.rowID, c.addRowParams); a(d).jqGrid("setSelection", c.rowID)
                } 
            } 
        })
    }, inlineNav: function (c, d) {
        d = a.extend({ edit: !0, editicon: "ui-icon-pencil", add: !0, addicon: "ui-icon-plus", save: !0, saveicon: "ui-icon-disk", cancel: !0, cancelicon: "ui-icon-cancel", addParams: { useFormatter: !1, rowID: "new_row" }, editParams: {}, restoreAfterSelect: !0 }, a.jgrid.nav, d || {}); return this.each(function () {
            if (this.grid) {
                var b = this, k, g = a.jgrid.jqID(b.p.id); b.p._inlinenav = !0; if (!0 === d.addParams.useFormatter) {
                    var l =
b.p.colModel, p; for (p = 0; p < l.length; p++) if (l[p].formatter && "actions" === l[p].formatter) { l[p].formatoptions && (l = a.extend({ keys: !1, onEdit: null, onSuccess: null, afterSave: null, onError: null, afterRestore: null, extraparam: {}, url: null }, l[p].formatoptions), d.addParams.addRowParams = { keys: l.keys, oneditfunc: l.onEdit, successfunc: l.onSuccess, url: l.url, extraparam: l.extraparam, aftersavefunc: l.afterSavef, errorfunc: l.onError, afterrestorefunc: l.afterRestore }); break } 
                } d.add && a(b).jqGrid("navButtonAdd", c, { caption: d.addtext,
                    title: d.addtitle, buttonicon: d.addicon, id: b.p.id + "_iladd", onClickButton: function () { a(b).jqGrid("addRow", d.addParams); d.addParams.useFormatter || (a("#" + g + "_ilsave").removeClass("ui-state-disabled"), a("#" + g + "_ilcancel").removeClass("ui-state-disabled"), a("#" + g + "_iladd").addClass("ui-state-disabled"), a("#" + g + "_iledit").addClass("ui-state-disabled")) } 
                }); d.edit && a(b).jqGrid("navButtonAdd", c, { caption: d.edittext, title: d.edittitle, buttonicon: d.editicon, id: b.p.id + "_iledit", onClickButton: function () {
                    var c = a(b).jqGrid("getGridParam",
"selrow"); c ? (a(b).jqGrid("editRow", c, d.editParams), a("#" + g + "_ilsave").removeClass("ui-state-disabled"), a("#" + g + "_ilcancel").removeClass("ui-state-disabled"), a("#" + g + "_iladd").addClass("ui-state-disabled"), a("#" + g + "_iledit").addClass("ui-state-disabled")) : (a.jgrid.viewModal("#alertmod", { gbox: "#gbox_" + g, jqm: !0 }), a("#jqg_alrt").focus())
                } 
                }); d.save && (a(b).jqGrid("navButtonAdd", c, { caption: d.savetext || "", title: d.savetitle || "Save row", buttonicon: d.saveicon, id: b.p.id + "_ilsave", onClickButton: function () {
                    var c =
b.p.savedRow[0].id; if (c) { var e = b.p.prmNames, j = e.oper; d.editParams.extraparam || (d.editParams.extraparam = {}); d.editParams.extraparam[j] = a("#" + a.jgrid.jqID(c), "#" + g).hasClass("jqgrid-new-row") ? e.addoper : e.editoper; a(b).jqGrid("saveRow", c, d.editParams) && a(b).jqGrid("showAddEditButtons") } else a.jgrid.viewModal("#alertmod", { gbox: "#gbox_" + g, jqm: !0 }), a("#jqg_alrt").focus()
                } 
                }), a("#" + g + "_ilsave").addClass("ui-state-disabled")); d.cancel && (a(b).jqGrid("navButtonAdd", c, { caption: d.canceltext || "", title: d.canceltitle ||
"Cancel row editing", buttonicon: d.cancelicon, id: b.p.id + "_ilcancel", onClickButton: function () { var c = b.p.savedRow[0].id; if (c) { a(b).jqGrid("restoreRow", c, d.editParams); a(b).jqGrid("showAddEditButtons") } else { a.jgrid.viewModal("#alertmod", { gbox: "#gbox_" + g, jqm: true }); a("#jqg_alrt").focus() } } 
                }), a("#" + g + "_ilcancel").addClass("ui-state-disabled")); !0 === d.restoreAfterSelect && (k = a.isFunction(b.p.beforeSelectRow) ? b.p.beforeSelectRow : !1, b.p.beforeSelectRow = function (c, e) {
                    var g = true; if (b.p.savedRow.length > 0 && b.p._inlinenav ===
true && c !== b.p.selrow && b.p.selrow !== null) { b.p.selrow == d.addParams.rowID ? a(b).jqGrid("delRowData", b.p.selrow) : a(b).jqGrid("restoreRow", b.p.selrow, d.editParams); a(b).jqGrid("showAddEditButtons") } k && (g = k.call(b, c, e)); return g
                })
            } 
        })
    }, showAddEditButtons: function () { return this.each(function () { if (this.grid) { var c = a.jgrid.jqID(this.p.id); a("#" + c + "_ilsave").addClass("ui-state-disabled"); a("#" + c + "_ilcancel").addClass("ui-state-disabled"); a("#" + c + "_iladd").removeClass("ui-state-disabled"); a("#" + c + "_iledit").removeClass("ui-state-disabled") } }) } 
    })
})(jQuery);
(function (b) {
    b.jgrid.extend({ editCell: function (d, f, a) {
        return this.each(function () {
            var c = this, g, e, h, i; if (c.grid && !0 === c.p.cellEdit) {
                f = parseInt(f, 10); c.p.selrow = c.rows[d].id; c.p.knv || b(c).jqGrid("GridNav"); if (0 < c.p.savedRow.length) { if (!0 === a && d == c.p.iRow && f == c.p.iCol) return; b(c).jqGrid("saveCell", c.p.savedRow[0].id, c.p.savedRow[0].ic) } else window.setTimeout(function () { b("#" + b.jgrid.jqID(c.p.knv)).attr("tabindex", "-1").focus() }, 0); i = c.p.colModel[f]; g = i.name; if (!("subgrid" == g || "cb" == g || "rn" == g)) {
                    h = b("td:eq(" +
f + ")", c.rows[d]); if (!0 === i.editable && !0 === a && !h.hasClass("not-editable-cell")) {
                        0 <= parseInt(c.p.iCol, 10) && 0 <= parseInt(c.p.iRow, 10) && (b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")); b(h).addClass("edit-cell ui-state-highlight"); b(c.rows[d]).addClass("selected-row ui-state-hover"); try { e = b.unformat.call(c, h, { rowId: c.rows[d].id, colModel: i }, f) } catch (k) { e = i.edittype && "textarea" == i.edittype ? b(h).text() : b(h).html() } c.p.autoencode &&
(e = b.jgrid.htmlDecode(e)); i.edittype || (i.edittype = "text"); c.p.savedRow.push({ id: d, ic: f, name: g, v: e }); if ("&nbsp;" === e || "&#160;" === e || 1 === e.length && 160 === e.charCodeAt(0)) e = ""; if (b.isFunction(c.p.formatCell)) { var j = c.p.formatCell.call(c, c.rows[d].id, g, e, d, f); void 0 !== j && (e = j) } var j = b.extend({}, i.editoptions || {}, { id: d + "_" + g, name: g }), n = b.jgrid.createEl.call(c, i.edittype, j, e, !0, b.extend({}, b.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {})); b(c).triggerHandler("jqGridBeforeEditCell", [c.rows[d].id, g, e, d, f]);
                        b.isFunction(c.p.beforeEditCell) && c.p.beforeEditCell.call(c, c.rows[d].id, g, e, d, f); b(h).html("").append(n).attr("tabindex", "0"); window.setTimeout(function () { b(n).focus() }, 0); b("input, select, textarea", h).bind("keydown", function (a) {
                            a.keyCode === 27 && (b("input.hasDatepicker", h).length > 0 ? b(".ui-datepicker").is(":hidden") ? b(c).jqGrid("restoreCell", d, f) : b("input.hasDatepicker", h).datepicker("hide") : b(c).jqGrid("restoreCell", d, f)); if (a.keyCode === 13) { b(c).jqGrid("saveCell", d, f); return false } if (a.keyCode ===
9) { if (c.grid.hDiv.loading) return false; a.shiftKey ? b(c).jqGrid("prevCell", d, f) : b(c).jqGrid("nextCell", d, f) } a.stopPropagation()
                        }); b(c).triggerHandler("jqGridAfterEditCell", [c.rows[d].id, g, e, d, f]); b.isFunction(c.p.afterEditCell) && c.p.afterEditCell.call(c, c.rows[d].id, g, e, d, f)
                    } else 0 <= parseInt(c.p.iCol, 10) && 0 <= parseInt(c.p.iRow, 10) && (b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")), h.addClass("edit-cell ui-state-highlight"),
b(c.rows[d]).addClass("selected-row ui-state-hover"), e = h.html().replace(/\&#160\;/ig, ""), b(c).triggerHandler("jqGridSelectCell", [c.rows[d].id, g, e, d, f]), b.isFunction(c.p.onSelectCell) && c.p.onSelectCell.call(c, c.rows[d].id, g, e, d, f); c.p.iCol = f; c.p.iRow = d
                } 
            } 
        })
    }, saveCell: function (d, f) {
        return this.each(function () {
            var a = this, c; if (a.grid && !0 === a.p.cellEdit) {
                c = 1 <= a.p.savedRow.length ? 0 : null; if (null !== c) {
                    var g = b("td:eq(" + f + ")", a.rows[d]), e, h, i = a.p.colModel[f], k = i.name, j = b.jgrid.jqID(k); switch (i.edittype) {
                        case "select": if (i.editoptions.multiple) {
                                var j =
b("#" + d + "_" + j, a.rows[d]), n = []; (e = b(j).val()) ? e.join(",") : e = ""; b("option:selected", j).each(function (a, c) { n[a] = b(c).text() }); h = n.join(",")
                            } else e = b("#" + d + "_" + j + " option:selected", a.rows[d]).val(), h = b("#" + d + "_" + j + " option:selected", a.rows[d]).text(); i.formatter && (h = e); break; case "checkbox": var l = ["Yes", "No"]; i.editoptions && (l = i.editoptions.value.split(":")); h = e = b("#" + d + "_" + j, a.rows[d]).is(":checked") ? l[0] : l[1]; break; case "password": case "text": case "textarea": case "button": h = e = b("#" + d + "_" + j, a.rows[d]).val();
                            break; case "custom": try { if (i.editoptions && b.isFunction(i.editoptions.custom_value)) { e = i.editoptions.custom_value.call(a, b(".customelement", g), "get"); if (void 0 === e) throw "e2"; h = e } else throw "e1"; } catch (o) {
                                "e1" == o && b.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose), "e2" == o ? b.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : b.jgrid.info_dialog(jQuery.jgrid.errors.errcap,
o.message, jQuery.jgrid.edit.bClose)
                            } 
                    } if (h !== a.p.savedRow[c].v) {
                        if (c = b(a).triggerHandler("jqGridBeforeSaveCell", [a.rows[d].id, k, e, d, f])) h = e = c; if (b.isFunction(a.p.beforeSaveCell) && (c = a.p.beforeSaveCell.call(a, a.rows[d].id, k, e, d, f))) h = e = c; var p = b.jgrid.checkValues(e, f, a); if (!0 === p[0]) {
                            c = b(a).triggerHandler("jqGridBeforeSubmitCell", [a.rows[d].id, k, e, d, f]) || {}; b.isFunction(a.p.beforeSubmitCell) && ((c = a.p.beforeSubmitCell.call(a, a.rows[d].id, k, e, d, f)) || (c = {})); 0 < b("input.hasDatepicker", g).length && b("input.hasDatepicker",
g).datepicker("hide"); if ("remote" == a.p.cellsubmit) if (a.p.cellurl) {
                                var m = {}; a.p.autoencode && (e = b.jgrid.htmlEncode(e)); m[k] = e; l = a.p.prmNames; i = l.id; j = l.oper; m[i] = b.jgrid.stripPref(a.p.idPrefix, a.rows[d].id); m[j] = l.editoper; m = b.extend(c, m); b("#lui_" + b.jgrid.jqID(a.p.id)).show(); a.grid.hDiv.loading = !0; b.ajax(b.extend({ url: a.p.cellurl, data: b.isFunction(a.p.serializeCellData) ? a.p.serializeCellData.call(a, m) : m, type: "POST", complete: function (c, i) {
                                    b("#lui_" + a.p.id).hide(); a.grid.hDiv.loading = false; if (i == "success") {
                                        var j =
b(a).triggerHandler("jqGridAfterSubmitCell", [a, c, m.id, k, e, d, f]) || [true, ""]; j[0] === true && b.isFunction(a.p.afterSubmitCell) && (j = a.p.afterSubmitCell.call(a, c, m.id, k, e, d, f)); if (j[0] === true) { b(g).empty(); b(a).jqGrid("setCell", a.rows[d].id, f, h, false, false, true); b(g).addClass("dirty-cell"); b(a.rows[d]).addClass("edited"); b(a).triggerHandler("jqGridAfterSaveCell", [a.rows[d].id, k, e, d, f]); b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, k, e, d, f); a.p.savedRow.splice(0, 1) } else {
                                            b.jgrid.info_dialog(b.jgrid.errors.errcap,
j[1], b.jgrid.edit.bClose); b(a).jqGrid("restoreCell", d, f)
                                        } 
                                    } 
                                }, error: function (c, e, h) { b("#lui_" + b.jgrid.jqID(a.p.id)).hide(); a.grid.hDiv.loading = false; b(a).triggerHandler("jqGridErrorCell", [c, e, h]); b.isFunction(a.p.errorCell) ? a.p.errorCell.call(a, c, e, h) : b.jgrid.info_dialog(b.jgrid.errors.errcap, c.status + " : " + c.statusText + "<br/>" + e, b.jgrid.edit.bClose); b(a).jqGrid("restoreCell", d, f) } 
                                }, b.jgrid.ajaxOptions, a.p.ajaxCellOptions || {}))
                            } else try {
                                b.jgrid.info_dialog(b.jgrid.errors.errcap, b.jgrid.errors.nourl,
b.jgrid.edit.bClose), b(a).jqGrid("restoreCell", d, f)
                            } catch (q) { } "clientArray" == a.p.cellsubmit && (b(g).empty(), b(a).jqGrid("setCell", a.rows[d].id, f, h, !1, !1, !0), b(g).addClass("dirty-cell"), b(a.rows[d]).addClass("edited"), b(a).triggerHandler("jqGridAfterSaveCell", [a.rows[d].id, k, e, d, f]), b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, k, e, d, f), a.p.savedRow.splice(0, 1))
                        } else try {
                            window.setTimeout(function () { b.jgrid.info_dialog(b.jgrid.errors.errcap, e + " " + p[1], b.jgrid.edit.bClose) },
100), b(a).jqGrid("restoreCell", d, f)
                        } catch (r) { } 
                    } else b(a).jqGrid("restoreCell", d, f)
                } b.browser.opera ? b("#" + b.jgrid.jqID(a.p.knv)).attr("tabindex", "-1").focus() : window.setTimeout(function () { b("#" + b.jgrid.jqID(a.p.knv)).attr("tabindex", "-1").focus() }, 0)
            } 
        })
    }, restoreCell: function (d, f) {
        return this.each(function () {
            var a = this, c; if (a.grid && !0 === a.p.cellEdit) {
                c = 1 <= a.p.savedRow.length ? 0 : null; if (null !== c) {
                    var g = b("td:eq(" + f + ")", a.rows[d]); if (b.isFunction(b.fn.datepicker)) try { b("input.hasDatepicker", g).datepicker("hide") } catch (e) { } b(g).empty().attr("tabindex",
"-1"); b(a).jqGrid("setCell", a.rows[d].id, f, a.p.savedRow[c].v, !1, !1, !0); b(a).triggerHandler("jqGridAfterRestoreCell", [a.rows[d].id, a.p.savedRow[c].v, d, f]); b.isFunction(a.p.afterRestoreCell) && a.p.afterRestoreCell.call(a, a.rows[d].id, a.p.savedRow[c].v, d, f); a.p.savedRow.splice(0, 1)
                } window.setTimeout(function () { b("#" + a.p.knv).attr("tabindex", "-1").focus() }, 0)
            } 
        })
    }, nextCell: function (d, f) {
        return this.each(function () {
            var a = !1; if (this.grid && !0 === this.p.cellEdit) {
                for (var c = f + 1; c < this.p.colModel.length; c++) if (!0 ===
this.p.colModel[c].editable) { a = c; break } !1 !== a ? b(this).jqGrid("editCell", d, a, !0) : 0 < this.p.savedRow.length && b(this).jqGrid("saveCell", d, f)
            } 
        })
    }, prevCell: function (d, f) { return this.each(function () { var a = !1; if (this.grid && !0 === this.p.cellEdit) { for (var c = f - 1; 0 <= c; c--) if (!0 === this.p.colModel[c].editable) { a = c; break } !1 !== a ? b(this).jqGrid("editCell", d, a, !0) : 0 < this.p.savedRow.length && b(this).jqGrid("saveCell", d, f) } }) }, GridNav: function () {
        return this.each(function () {
            function d(c, d, e) {
                if ("v" == e.substr(0, 1)) {
                    var f =
b(a.grid.bDiv)[0].clientHeight, g = b(a.grid.bDiv)[0].scrollTop, l = a.rows[c].offsetTop + a.rows[c].clientHeight, o = a.rows[c].offsetTop; "vd" == e && l >= f && (b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop + a.rows[c].clientHeight); "vu" == e && o < g && (b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop - a.rows[c].clientHeight)
                } "h" == e && (e = b(a.grid.bDiv)[0].clientWidth, f = b(a.grid.bDiv)[0].scrollLeft, g = a.rows[c].cells[d].offsetLeft, a.rows[c].cells[d].offsetLeft + a.rows[c].cells[d].clientWidth >= e + parseInt(f, 10) ?
b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft + a.rows[c].cells[d].clientWidth : g < f && (b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft - a.rows[c].cells[d].clientWidth))
            } function f(b, c) { var d, e; if ("lft" == c) { d = b + 1; for (e = b; 0 <= e; e--) if (!0 !== a.p.colModel[e].hidden) { d = e; break } } if ("rgt" == c) { d = b - 1; for (e = b; e < a.p.colModel.length; e++) if (!0 !== a.p.colModel[e].hidden) { d = e; break } } return d } var a = this; if (a.grid && !0 === a.p.cellEdit) {
                a.p.knv = a.p.id + "_kn"; var c = b("<div style='position:absolute;top:-1000000px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='" +
a.p.knv + "'></div></div>"), g, e; b(c).insertBefore(a.grid.cDiv); b("#" + a.p.knv).focus().keydown(function (c) {
    e = c.keyCode; "rtl" == a.p.direction && (37 === e ? e = 39 : 39 === e && (e = 37)); switch (e) {
        case 38: 0 < a.p.iRow - 1 && (d(a.p.iRow - 1, a.p.iCol, "vu"), b(a).jqGrid("editCell", a.p.iRow - 1, a.p.iCol, !1)); break; case 40: a.p.iRow + 1 <= a.rows.length - 1 && (d(a.p.iRow + 1, a.p.iCol, "vd"), b(a).jqGrid("editCell", a.p.iRow + 1, a.p.iCol, !1)); break; case 37: 0 <= a.p.iCol - 1 && (g = f(a.p.iCol - 1, "lft"), d(a.p.iRow, g, "h"), b(a).jqGrid("editCell", a.p.iRow, g, !1));
            break; case 39: a.p.iCol + 1 <= a.p.colModel.length - 1 && (g = f(a.p.iCol + 1, "rgt"), d(a.p.iRow, g, "h"), b(a).jqGrid("editCell", a.p.iRow, g, !1)); break; case 13: 0 <= parseInt(a.p.iCol, 10) && 0 <= parseInt(a.p.iRow, 10) && b(a).jqGrid("editCell", a.p.iRow, a.p.iCol, !0); break; default: return !0
    } return !1
})
            } 
        })
    }, getChangedCells: function (d) {
        var f = []; d || (d = "all"); this.each(function () {
            var a = this, c; a.grid && !0 === a.p.cellEdit && b(a.rows).each(function (g) {
                var e = {}; b(this).hasClass("edited") && (b("td", this).each(function (f) {
                    c = a.p.colModel[f].name;
                    if ("cb" !== c && "subgrid" !== c) if ("dirty" == d) { if (b(this).hasClass("dirty-cell")) try { e[c] = b.unformat.call(a, this, { rowId: a.rows[g].id, colModel: a.p.colModel[f] }, f) } catch (i) { e[c] = b.jgrid.htmlDecode(b(this).html()) } } else try { e[c] = b.unformat.call(a, this, { rowId: a.rows[g].id, colModel: a.p.colModel[f] }, f) } catch (k) { e[c] = b.jgrid.htmlDecode(b(this).html()) } 
                }), e.id = this.id, f.push(e))
            })
        }); return f
    } 
    })
})(jQuery);
(function (b) {
    b.fn.jqm = function (a) { var k = { overlay: 50, closeoverlay: !0, overlayClass: "jqmOverlay", closeClass: "jqmClose", trigger: ".jqModal", ajax: d, ajaxText: "", target: d, modal: d, toTop: d, onShow: d, onHide: d, onLoad: d }; return this.each(function () { if (this._jqm) return i[this._jqm].c = b.extend({}, i[this._jqm].c, a); g++; this._jqm = g; i[g] = { c: b.extend(k, b.jqm.params, a), a: d, w: b(this).addClass("jqmID" + g), s: g }; k.trigger && b(this).jqmAddTrigger(k.trigger) }) }; b.fn.jqmAddClose = function (a) { return n(this, a, "jqmHide") }; b.fn.jqmAddTrigger =
function (a) { return n(this, a, "jqmShow") }; b.fn.jqmShow = function (a) { return this.each(function () { b.jqm.open(this._jqm, a) }) }; b.fn.jqmHide = function (a) { return this.each(function () { b.jqm.close(this._jqm, a) }) }; b.jqm = { hash: {}, open: function (a, k) {
    var c = i[a], e = c.c, l = "." + e.closeClass, h = parseInt(c.w.css("z-index")), h = 0 < h ? h : 3E3, f = b("<div></div>").css({ height: "100%", width: "100%", position: "fixed", left: 0, top: 0, "z-index": h - 1, opacity: e.overlay / 100 }); if (c.a) return d; c.t = k; c.a = !0; c.w.css("z-index", h); e.modal ? (j[0] || setTimeout(function () { o("bind") },
1), j.push(a)) : 0 < e.overlay ? e.closeoverlay && c.w.jqmAddClose(f) : f = d; c.o = f ? f.addClass(e.overlayClass).prependTo("body") : d; if (p && (b("html,body").css({ height: "100%", width: "100%" }), f)) { var f = f.css({ position: "absolute" })[0], g; for (g in { Top: 1, Left: 1 }) f.style.setExpression(g.toLowerCase(), "(_=(document.documentElement.scroll" + g + " || document.body.scroll" + g + "))+'px'") } e.ajax ? (h = e.target || c.w, f = e.ajax, h = "string" == typeof h ? b(h, c.w) : b(h), f = "@" == f.substr(0, 1) ? b(k).attr(f.substring(1)) : f, h.html(e.ajaxText).load(f,
function () { e.onLoad && e.onLoad.call(this, c); l && c.w.jqmAddClose(b(l, c.w)); q(c) })) : l && c.w.jqmAddClose(b(l, c.w)); e.toTop && c.o && c.w.before('<span id="jqmP' + c.w[0]._jqm + '"></span>').insertAfter(c.o); e.onShow ? e.onShow(c) : c.w.show(); q(c); return d
}, close: function (a) { a = i[a]; if (!a.a) return d; a.a = d; j[0] && (j.pop(), j[0] || o("unbind")); a.c.toTop && a.o && b("#jqmP" + a.w[0]._jqm).after(a.w).remove(); if (a.c.onHide) a.c.onHide(a); else a.w.hide(), a.o && a.o.remove(); return d }, params: {}
}; var g = 0, i = b.jqm.hash, j = [], p = b.browser.msie &&
"6.0" == b.browser.version, d = !1, q = function (a) { var d = b('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({ opacity: 0 }); p && (a.o ? a.o.html('<p style="width:100%;height:100%"/>').prepend(d) : b("iframe.jqm", a.w)[0] || a.w.prepend(d)); r(a) }, r = function (a) { try { b(":input:visible", a.w)[0].focus() } catch (d) { } }, o = function (a) { b(document)[a]("keypress", m)[a]("keydown", m)[a]("mousedown", m) }, m = function (a) { var d = i[j[j.length - 1]]; (a = !b(a.target).parents(".jqmID" + d.s)[0]) && r(d); return !a }, n = function (a,
g, c) { return a.each(function () { var a = this._jqm; b(g).each(function () { this[c] || (this[c] = [], b(this).click(function () { for (var a in { jqmShow: 1, jqmHide: 1 }) for (var b in this[a]) if (i[this[a][b]]) i[this[a][b]].w[a](this); return d })); this[c].push(a) }) }) } 
})(jQuery);
(function (b) {
    b.fn.jqDrag = function (a) { return h(this, a, "d") }; b.fn.jqResize = function (a, b) { return h(this, a, "r", b) }; b.jqDnR = { dnr: {}, e: 0, drag: function (a) { "d" == d.k ? e.css({ left: d.X + a.pageX - d.pX, top: d.Y + a.pageY - d.pY }) : (e.css({ width: Math.max(a.pageX - d.pX + d.W, 0), height: Math.max(a.pageY - d.pY + d.H, 0) }), f && g.css({ width: Math.max(a.pageX - f.pX + f.W, 0), height: Math.max(a.pageY - f.pY + f.H, 0) })); return !1 }, stop: function () { b(document).unbind("mousemove", c.drag).unbind("mouseup", c.stop) } }; var c = b.jqDnR, d = c.dnr, e = c.e, g, f, h = function (a,
c, h, l) {
        return a.each(function () {
            c = c ? b(c, a) : a; c.bind("mousedown", { e: a, k: h }, function (a) {
                var c = a.data, i = {}; e = c.e; g = l ? b(l) : !1; if ("relative" != e.css("position")) try { e.position(i) } catch (h) { } d = { X: i.left || j("left") || 0, Y: i.top || j("top") || 0, W: j("width") || e[0].scrollWidth || 0, H: j("height") || e[0].scrollHeight || 0, pX: a.pageX, pY: a.pageY, k: c.k }; f = g && "d" != c.k ? { X: i.left || k("left") || 0, Y: i.top || k("top") || 0, W: g[0].offsetWidth || k("width") || 0, H: g[0].offsetHeight || k("height") || 0, pX: a.pageX, pY: a.pageY, k: c.k} : !1; if (b("input.hasDatepicker",
e[0])[0]) try { b("input.hasDatepicker", e[0]).datepicker("hide") } catch (m) { } b(document).mousemove(b.jqDnR.drag).mouseup(b.jqDnR.stop); return !1
            })
        })
    }, j = function (a) { return parseInt(e.css(a), 10) || !1 }, k = function (a) { return parseInt(g.css(a), 10) || !1 } 
})(jQuery);
(function (b) {
    b.jgrid.extend({ setSubGrid: function () {
        return this.each(function () {
            var e; this.p.subGridOptions = b.extend({ plusicon: "ui-icon-plus", minusicon: "ui-icon-minus", openicon: "ui-icon-carat-1-sw", expandOnLoad: !1, delayOnLoad: 50, selectOnExpand: !1, reloadOnExpand: !0 }, this.p.subGridOptions || {}); this.p.colNames.unshift(""); this.p.colModel.unshift({ name: "subgrid", width: b.browser.safari ? this.p.subGridWidth + this.p.cellLayout : this.p.subGridWidth, sortable: !1, resizable: !1, hidedlg: !0, search: !1, fixed: !0 }); e = this.p.subGridModel;
            if (e[0]) { e[0].align = b.extend([], e[0].align || []); for (var c = 0; c < e[0].name.length; c++) e[0].align[c] = e[0].align[c] || "left" } 
        })
    }, addSubGridCell: function (b, c) { var a = "", m, l; this.each(function () { a = this.formatCol(b, c); l = this.p.id; m = this.p.subGridOptions.plusicon }); return '<td role="gridcell" aria-describedby="' + l + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + a + "><a href='javascript:void(0);'><span class='ui-icon " + m + "'></span></a></td>" }, addSubGrid: function (e, c) {
        return this.each(function () {
            var a = this; if (a.grid) {
                var m =
function (c, e, h) { e = b("<td align='" + a.p.subGridModel[0].align[h] + "'></td>").html(e); b(c).append(e) }, l = function (c, e) {
    var h, f, n, d = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"), i = b("<tr></tr>"); for (f = 0; f < a.p.subGridModel[0].name.length; f++) h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"), b(h).html(a.p.subGridModel[0].name[f]), b(h).width(a.p.subGridModel[0].width[f]), b(i).append(h); b(d).append(i); c && (n = a.p.xmlReader.subgrid, b(n.root +
" " + n.row, c).each(function () { i = b("<tr class='ui-widget-content ui-subtblcell'></tr>"); if (!0 === n.repeatitems) b(n.cell, this).each(function (a) { m(i, b(this).text() || "&#160;", a) }); else { var c = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name; if (c) for (f = 0; f < c.length; f++) m(i, b(c[f], this).text() || "&#160;", f) } b(d).append(i) })); h = b("table:first", a.grid.bDiv).attr("id") + "_"; b("#" + b.jgrid.jqID(h + e)).append(d); a.grid.hDiv.loading = !1; b("#load_" + b.jgrid.jqID(a.p.id)).hide(); return !1
}, p = function (c, e) {
    var h, f, d,
g, i, k = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"), j = b("<tr></tr>"); for (f = 0; f < a.p.subGridModel[0].name.length; f++) h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"), b(h).html(a.p.subGridModel[0].name[f]), b(h).width(a.p.subGridModel[0].width[f]), b(j).append(h); b(k).append(j); if (c && (g = a.p.jsonReader.subgrid, h = b.jgrid.getAccessor(c, g.root), "undefined" !== typeof h)) for (f = 0; f < h.length; f++) {
        d = h[f]; j = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
        if (!0 === g.repeatitems) { g.cell && (d = d[g.cell]); for (i = 0; i < d.length; i++) m(j, d[i] || "&#160;", i) } else { var l = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name; if (l.length) for (i = 0; i < l.length; i++) m(j, d[l[i]] || "&#160;", i) } b(k).append(j)
    } f = b("table:first", a.grid.bDiv).attr("id") + "_"; b("#" + b.jgrid.jqID(f + e)).append(k); a.grid.hDiv.loading = !1; b("#load_" + b.jgrid.jqID(a.p.id)).hide(); return !1
}, t = function (c) {
    var e, d, f, g; e = b(c).attr("id"); d = { nd_: (new Date).getTime() }; d[a.p.prmNames.subgridid] = e; if (!a.p.subGridModel[0]) return !1;
    if (a.p.subGridModel[0].params) for (g = 0; g < a.p.subGridModel[0].params.length; g++) for (f = 0; f < a.p.colModel.length; f++) a.p.colModel[f].name === a.p.subGridModel[0].params[g] && (d[a.p.colModel[f].name] = b("td:eq(" + f + ")", c).text().replace(/\&#160\;/ig, "")); if (!a.grid.hDiv.loading) switch (a.grid.hDiv.loading = !0, b("#load_" + b.jgrid.jqID(a.p.id)).show(), a.p.subgridtype || (a.p.subgridtype = a.p.datatype), b.isFunction(a.p.subgridtype) ? a.p.subgridtype.call(a, d) : a.p.subgridtype = a.p.subgridtype.toLowerCase(), a.p.subgridtype) {
        case "xml": case "json": b.ajax(b.extend({ type: a.p.mtype,
            url: a.p.subGridUrl, dataType: a.p.subgridtype, data: b.isFunction(a.p.serializeSubGridData) ? a.p.serializeSubGridData.call(a, d) : d, complete: function (c) { a.p.subgridtype === "xml" ? l(c.responseXML, e) : p(b.jgrid.parse(c.responseText), e) } 
        }, b.jgrid.ajaxOptions, a.p.ajaxSubgridOptions || {}))
    } return !1
}, d, k, q, r = 0, g, j; b.each(a.p.colModel, function () { (!0 === this.hidden || "rn" === this.name || "cb" === this.name) && r++ }); var s = a.rows.length, o = 1; void 0 !== c && 0 < c && (o = c, s = c + 1); for (; o < s; ) b(a.rows[o]).hasClass("jqgrow") && b(a.rows[o].cells[e]).bind("click",
function () {
    var c = b(this).parent("tr")[0]; j = c.nextSibling; if (b(this).hasClass("sgcollapsed")) {
        k = a.p.id; d = c.id; if (a.p.subGridOptions.reloadOnExpand === true || a.p.subGridOptions.reloadOnExpand === false && !b(j).hasClass("ui-subgrid")) {
            q = e >= 1 ? "<td colspan='" + e + "'>&#160;</td>" : ""; g = b(a).triggerHandler("jqGridSubGridBeforeExpand", [k + "_" + d, d]); (g = g === false || g === "stop" ? false : true) && b.isFunction(a.p.subGridBeforeExpand) && (g = a.p.subGridBeforeExpand.call(a, k + "_" + d, d)); if (g === false) return false; b(c).after("<tr role='row' class='ui-subgrid'>" +
q + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + a.p.subGridOptions.openicon + "'></span></td><td colspan='" + parseInt(a.p.colNames.length - 1 - r, 10) + "' class='ui-widget-content subgrid-data'><div id=" + k + "_" + d + " class='tablediv'></div></td></tr>"); b(a).triggerHandler("jqGridSubGridRowExpanded", [k + "_" + d, d]); b.isFunction(a.p.subGridRowExpanded) ? a.p.subGridRowExpanded.call(a, k + "_" + d, d) : t(c)
        } else b(j).show(); b(this).html("<a href='javascript:void(0);'><span class='ui-icon " + a.p.subGridOptions.minusicon +
"'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded"); a.p.subGridOptions.selectOnExpand && b(a).jqGrid("setSelection", d)
    } else if (b(this).hasClass("sgexpanded")) {
        g = b(a).triggerHandler("jqGridSubGridRowColapsed", [k + "_" + d, d]); if ((g = g === false || g === "stop" ? false : true) && b.isFunction(a.p.subGridRowColapsed)) { d = c.id; g = a.p.subGridRowColapsed.call(a, k + "_" + d, d) } if (g === false) return false; a.p.subGridOptions.reloadOnExpand === true ? b(j).remove(".ui-subgrid") : b(j).hasClass("ui-subgrid") && b(j).hide(); b(this).html("<a href='javascript:void(0);'><span class='ui-icon " +
a.p.subGridOptions.plusicon + "'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed")
    } return false
}), o++; !0 === a.p.subGridOptions.expandOnLoad && b(a.rows).filter(".jqgrow").each(function (a, c) { b(c.cells[0]).click() }); a.subGridXml = function (a, b) { l(a, b) }; a.subGridJson = function (a, b) { p(a, b) } 
            } 
        })
    }, expandSubGridRow: function (e) { return this.each(function () { if ((this.grid || e) && !0 === this.p.subGrid) { var c = b(this).jqGrid("getInd", e, !0); c && (c = b("td.sgcollapsed", c)[0]) && b(c).trigger("click") } }) }, collapseSubGridRow: function (e) {
        return this.each(function () {
            if ((this.grid ||
e) && !0 === this.p.subGrid) { var c = b(this).jqGrid("getInd", e, !0); c && (c = b("td.sgexpanded", c)[0]) && b(c).trigger("click") } 
        })
    }, toggleSubGridRow: function (e) { return this.each(function () { if ((this.grid || e) && !0 === this.p.subGrid) { var c = b(this).jqGrid("getInd", e, !0); if (c) { var a = b("td.sgcollapsed", c)[0]; a ? b(a).trigger("click") : (a = b("td.sgexpanded", c)[0]) && b(a).trigger("click") } } }) } 
    })
})(jQuery);
(function (b) {
    b.extend(b.jgrid, { template: function (a) { var c = b.makeArray(arguments).slice(1), f = 1; void 0 === a && (a = ""); return a.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g, function (a, d) { if (isNaN(parseInt(d, 10))) { for (var b = c[f], g = b.length; g--; ) if (d === b[g].nm) return b[g].v; f++ } else return f++, c[parseInt(d, 10)] }) } }); b.jgrid.extend({ groupingSetup: function () {
        return this.each(function () {
            var a = this.p.groupingView; if (null !== a && ("object" === typeof a || b.isFunction(a))) if (a.groupField.length) {
                "undefined" ===
typeof a.visibiltyOnNextGrouping && (a.visibiltyOnNextGrouping = []); a.lastvalues = []; a.groups = []; a.counters = []; for (var c = 0; c < a.groupField.length; c++) a.groupOrder[c] || (a.groupOrder[c] = "asc"), a.groupText[c] || (a.groupText[c] = "{0}"), "boolean" !== typeof a.groupColumnShow[c] && (a.groupColumnShow[c] = !0), "boolean" !== typeof a.groupSummary[c] && (a.groupSummary[c] = !1), !0 === a.groupColumnShow[c] ? (a.visibiltyOnNextGrouping[c] = !0, b(this).jqGrid("showCol", a.groupField[c])) : (a.visibiltyOnNextGrouping[c] = b("#" + b.jgrid.jqID(this.p.id +
"_" + a.groupField[c])).is(":visible"), b(this).jqGrid("hideCol", a.groupField[c])); a.summary = []; for (var c = this.p.colModel, f = 0, e = c.length; f < e; f++) c[f].summaryType && a.summary.push({ nm: c[f].name, st: c[f].summaryType, v: "", sr: c[f].summaryRound, srt: c[f].summaryRoundType || "round" })
            } else this.p.grouping = !1; else this.p.grouping = !1
        })
    }, groupingPrepare: function (a, c, f, e) {
        this.each(function () {
            for (var d = this.p.groupingView, h = this, g = d.groupField.length, k, j, p = 0, i = 0; i < g; i++) k = d.groupField[i], j = f[k], void 0 !== j && (0 === e ?
(d.groups.push({ idx: i, dataIndex: k, value: j, startRow: e, cnt: 1, summary: [] }), d.lastvalues[i] = j, d.counters[i] = { cnt: 1, pos: d.groups.length - 1, summary: b.extend(!0, [], d.summary) }) : "object" !== typeof j && d.lastvalues[i] !== j ? (d.groups.push({ idx: i, dataIndex: k, value: j, startRow: e, cnt: 1, summary: [] }), d.lastvalues[i] = j, p = 1, d.counters[i] = { cnt: 1, pos: d.groups.length - 1, summary: b.extend(!0, [], d.summary) }) : 1 === p ? (d.groups.push({ idx: i, dataIndex: k, value: j, startRow: e, cnt: 1, summary: [] }), d.lastvalues[i] = j, d.counters[i] = { cnt: 1, pos: d.groups.length -
1, summary: b.extend(!0, [], d.summary)
}) : (d.counters[i].cnt += 1, d.groups[d.counters[i].pos].cnt = d.counters[i].cnt), b.each(d.counters[i].summary, function () { this.v = b.isFunction(this.st) ? this.st.call(h, this.v, this.nm, f) : b(h).jqGrid("groupingCalculations.handler", this.st, this.v, this.nm, this.sr, this.srt, f) }), d.groups[d.counters[i].pos].summary = d.counters[i].summary); c.push(a)
        }); return c
    }, groupingToggle: function (a) {
        this.each(function () {
            var c = this.p.groupingView, f = a.split("_"), e = parseInt(f[f.length - 2], 10); f.splice(f.length -
2, 2); var f = f.join("_"), d = c.minusicon, h = c.plusicon, g = b("#" + b.jgrid.jqID(a)), g = g.length ? g[0].nextSibling : null, k = b("#" + b.jgrid.jqID(a) + " span.tree-wrap-" + this.p.direction), j = !1; if (k.hasClass(d)) { if (c.showSummaryOnHide) { if (g) for (; g && !(b(g).hasClass("jqfoot") && parseInt(b(g).attr("jqfootlevel"), 10) <= e); ) b(g).hide(), g = g.nextSibling } else if (g) for (; g && !b(g).hasClass(f + "_" + ("" + e)) && !b(g).hasClass(f + "_" + ("" + (e - 1))); ) b(g).hide(), g = g.nextSibling; k.removeClass(d).addClass(h); j = !0 } else {
                if (g) for (; g && !b(g).hasClass(f +
"_" + ("" + e)) && !b(g).hasClass(f + "_" + ("" + (e - 1))); ) b(g).show(), (c = b(g).find("span.tree-wrap-" + this.p.direction)) && b(c).hasClass(h) && b(c).removeClass(h).addClass(d), g = g.nextSibling; k.removeClass(h).addClass(d)
            } b(this).triggerHandler("jqGridGroupingClickGroup", [a, j]); b.isFunction(this.p.onClickGroup) && this.p.onClickGroup.call(this, a, j)
        }); return !1
    }, groupingRender: function (a, c) {
        return this.each(function () {
            function f(a, b, c) {
                if (0 === b) return c[a]; var d = c[a].idx; if (0 === d) return c[a]; for (; 0 <= a; a--) if (c[a].idx ===
d - b) return c[a]
            } var e = this, d = e.p.groupingView, h = "", g = "", k, j, p = d.groupCollapse ? d.plusicon : d.minusicon, i, w = [], x = d.groupField.length, p = p + (" tree-wrap-" + e.p.direction); b.each(e.p.colModel, function (a, b) { for (var c = 0; c < x; c++) if (d.groupField[c] === b.name) { w[c] = a; break } }); var s = 0, y = b.makeArray(d.groupSummary); y.reverse(); b.each(d.groups, function (r, l) {
                s++; j = e.p.id + "ghead_" + l.idx; k = j + "_" + r; g = "<span style='cursor:pointer;' class='ui-icon " + p + "' onclick=\"jQuery('#" + b.jgrid.jqID(e.p.id) + "').jqGrid('groupingToggle','" +
k + "');return false;\"></span>"; try { i = e.formatter(k, l.value, w[l.idx], l.value) } catch (C) { i = l.value } h += '<tr id="' + k + '" role="row" class= "ui-widget-content jqgroup ui-row-' + e.p.direction + " " + j + '"><td style="padding-left:' + 12 * l.idx + 'px;" colspan="' + c + '">' + g + b.jgrid.template(d.groupText[l.idx], i, l.cnt, l.summary) + "</td></tr>"; if (x - 1 === l.idx) {
                    for (var m = d.groups[r + 1], o = void 0 !== m ? d.groups[r + 1].startRow : a.length, t = l.startRow; t < o; t++) h += a[t].join(""); var q; if (void 0 !== m) {
                        for (q = 0; q < d.groupField.length && m.dataIndex !==
d.groupField[q]; q++); s = d.groupField.length - q
                    } for (m = 0; m < s; m++) if (y[m]) {
                        o = ""; d.groupCollapse && !d.showSummaryOnHide && (o = ' style="display:none;"'); h += "<tr" + o + ' jqfootlevel="' + (l.idx - m) + '" role="row" class="ui-widget-content jqfoot ui-row-' + e.p.direction + '">'; for (var o = f(r, m, d.groups), u = e.p.colModel, v, z = o.cnt, n = 0; n < c; n++) {
                            var A = "<td " + e.formatCol(n, 1, "") + ">&#160;</td>", B = "{0}"; b.each(o.summary, function () {
                                if (this.nm === u[n].name) {
                                    u[n].summaryTpl && (B = u[n].summaryTpl); "string" === typeof this.st && "avg" === this.st.toLowerCase() &&
(this.v && 0 < z) && (this.v /= z); try { v = e.formatter("", this.v, n, this) } catch (a) { v = this.v } A = "<td " + e.formatCol(n, 1, "") + ">" + b.jgrid.format(B, v) + "</td>"; return !1
                                } 
                            }); h += A
                        } h += "</tr>"
                    } s = q
                } 
            }); b("#" + b.jgrid.jqID(e.p.id) + " tbody:first").append(h); h = null
        })
    }, groupingGroupBy: function (a, c) {
        return this.each(function () {
            "string" === typeof a && (a = [a]); var f = this.p.groupingView; this.p.grouping = !0; "undefined" === typeof f.visibiltyOnNextGrouping && (f.visibiltyOnNextGrouping = []); var e; for (e = 0; e < f.groupField.length; e++) !f.groupColumnShow[e] &&
f.visibiltyOnNextGrouping[e] && b(this).jqGrid("showCol", f.groupField[e]); for (e = 0; e < a.length; e++) f.visibiltyOnNextGrouping[e] = b("#" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(a[e])).is(":visible"); this.p.groupingView = b.extend(this.p.groupingView, c || {}); f.groupField = a; b(this).trigger("reloadGrid")
        })
    }, groupingRemove: function (a) {
        return this.each(function () {
            "undefined" === typeof a && (a = !0); this.p.grouping = !1; if (!0 === a) {
                for (var c = this.p.groupingView, f = 0; f < c.groupField.length; f++) !c.groupColumnShow[f] && c.visibiltyOnNextGrouping[f] &&
b(this).jqGrid("showCol", c.groupField); b("tr.jqgroup, tr.jqfoot", "#" + b.jgrid.jqID(this.p.id) + " tbody:first").remove(); b("tr.jqgrow:hidden", "#" + b.jgrid.jqID(this.p.id) + " tbody:first").show()
            } else b(this).trigger("reloadGrid")
        })
    }, groupingCalculations: { handler: function (a, c, b, e, d, h) {
        var g = { sum: function () { return parseFloat(c || 0) + parseFloat(h[b] || 0) }, min: function () { return "" === c ? parseFloat(h[b] || 0) : Math.min(parseFloat(c), parseFloat(h[b] || 0)) }, max: function () {
            return "" === c ? parseFloat(h[b] || 0) : Math.max(parseFloat(c),
parseFloat(h[b] || 0))
        }, count: function () { "" === c && (c = 0); return h.hasOwnProperty(b) ? c + 1 : 0 }, avg: function () { return g.sum() } 
        }; if (!g[a]) throw "jqGrid Grouping No such method: " + a; a = g[a](); null != e && ("fixed" == d ? a = a.toFixed(e) : (e = Math.pow(10, e), a = Math.round(a * e) / e)); return a
    } 
    }
    })
})(jQuery);
(function (d) {
    d.jgrid.extend({ setTreeNode: function (a, c) {
        return this.each(function () {
            var b = this; if (b.grid && b.p.treeGrid) for (var e = b.p.expColInd, g = b.p.treeReader.expanded_field, h = b.p.treeReader.leaf_field, f = b.p.treeReader.level_field, l = b.p.treeReader.icon_field, j = b.p.treeReader.loaded, i, p, m, k; a < c; ) k = b.p.data[b.p._index[b.rows[a].id]], "nested" == b.p.treeGridModel && !k[h] && (i = parseInt(k[b.p.treeReader.left_field], 10), p = parseInt(k[b.p.treeReader.right_field], 10), k[h] = p === i + 1 ? "true" : "false", b.rows[a].cells[b.p._treeleafpos].innerHTML =
k[h]), i = parseInt(k[f], 10), 0 === b.p.tree_root_level ? (m = i + 1, p = i) : (m = i, p = i - 1), m = "<div class='tree-wrap tree-wrap-" + b.p.direction + "' style='width:" + 18 * m + "px;'>", m += "<div style='" + ("rtl" == b.p.direction ? "right:" : "left:") + 18 * p + "px;' class='ui-icon ", void 0 !== k[j] && (k[j] = "true" == k[j] || !0 === k[j] ? !0 : !1), "true" == k[h] || !0 === k[h] ? (m += (void 0 !== k[l] && "" !== k[l] ? k[l] : b.p.treeIcons.leaf) + " tree-leaf treeclick", k[h] = !0, p = "leaf") : (k[h] = !1, p = ""), k[g] = ("true" == k[g] || !0 === k[g] ? !0 : !1) && k[j], m = !1 === k[g] ? m + (!0 === k[h] ? "'" :
b.p.treeIcons.plus + " tree-plus treeclick'") : m + (!0 === k[h] ? "'" : b.p.treeIcons.minus + " tree-minus treeclick'"), m += "></div></div>", d(b.rows[a].cells[e]).wrapInner("<span class='cell-wrapper" + p + "'></span>").prepend(m), i !== parseInt(b.p.tree_root_level, 10) && ((k = (k = d(b).jqGrid("getNodeParent", k)) && k.hasOwnProperty(g) ? k[g] : !0) || d(b.rows[a]).css("display", "none")), d(b.rows[a].cells[e]).find("div.treeclick").bind("click", function (a) {
    a = d(a.target || a.srcElement, b.rows).closest("tr.jqgrow")[0].id; a = b.p._index[a];
    if (!b.p.data[a][h]) if (b.p.data[a][g]) { d(b).jqGrid("collapseRow", b.p.data[a]); d(b).jqGrid("collapseNode", b.p.data[a]) } else { d(b).jqGrid("expandRow", b.p.data[a]); d(b).jqGrid("expandNode", b.p.data[a]) } return false
}), !0 === b.p.ExpandColClick && d(b.rows[a].cells[e]).find("span.cell-wrapper").css("cursor", "pointer").bind("click", function (a) {
    var a = d(a.target || a.srcElement, b.rows).closest("tr.jqgrow")[0].id, c = b.p._index[a]; if (!b.p.data[c][h]) if (b.p.data[c][g]) {
        d(b).jqGrid("collapseRow", b.p.data[c]); d(b).jqGrid("collapseNode",
b.p.data[c])
    } else { d(b).jqGrid("expandRow", b.p.data[c]); d(b).jqGrid("expandNode", b.p.data[c]) } d(b).jqGrid("setSelection", a); return false
}), a++
        })
    }, setTreeGrid: function () {
        return this.each(function () {
            var a = this, c = 0, b, e = !1, g, h = []; if (a.p.treeGrid) {
                a.p.treedatatype || d.extend(a.p, { treedatatype: a.p.datatype }); a.p.subGrid = !1; a.p.altRows = !1; a.p.pgbuttons = !1; a.p.pginput = !1; a.p.gridview = !0; null === a.p.rowTotal && (a.p.rowNum = 1E4); a.p.multiselect = !1; a.p.rowList = []; a.p.expColInd = 0; b = "ui-icon-triangle-1-" + ("rtl" == a.p.direction ?
"w" : "e"); a.p.treeIcons = d.extend({ plus: b, minus: "ui-icon-triangle-1-s", leaf: "ui-icon-radio-off" }, a.p.treeIcons || {}); "nested" == a.p.treeGridModel ? a.p.treeReader = d.extend({ level_field: "level", left_field: "lft", right_field: "rgt", leaf_field: "isLeaf", expanded_field: "expanded", loaded: "loaded", icon_field: "icon" }, a.p.treeReader) : "adjacency" == a.p.treeGridModel && (a.p.treeReader = d.extend({ level_field: "level", parent_id_field: "parent", leaf_field: "isLeaf", expanded_field: "expanded", loaded: "loaded", icon_field: "icon" },
a.p.treeReader)); for (g in a.p.colModel) if (a.p.colModel.hasOwnProperty(g)) { b = a.p.colModel[g].name; b == a.p.ExpandColumn && !e && (e = !0, a.p.expColInd = c); c++; for (var f in a.p.treeReader) a.p.treeReader[f] == b && h.push(b) } d.each(a.p.treeReader, function (b, e) { if (e && d.inArray(e, h) === -1) { if (b === "leaf_field") a.p._treeleafpos = c; c++; a.p.colNames.push(e); a.p.colModel.push({ name: e, width: 1, hidden: true, sortable: false, resizable: false, hidedlg: true, editable: true, search: false }) } })
            } 
        })
    }, expandRow: function (a) {
        this.each(function () {
            var c =
this; if (c.grid && c.p.treeGrid) { var b = d(c).jqGrid("getNodeChildren", a), e = c.p.treeReader.expanded_field, g = c.rows; d(b).each(function () { var a = d.jgrid.getAccessor(this, c.p.localReader.id); d(g.namedItem(a)).css("display", ""); this[e] && d(c).jqGrid("expandRow", this) }) } 
        })
    }, collapseRow: function (a) {
        this.each(function () {
            var c = this; if (c.grid && c.p.treeGrid) {
                var b = d(c).jqGrid("getNodeChildren", a), e = c.p.treeReader.expanded_field, g = c.rows; d(b).each(function () {
                    var a = d.jgrid.getAccessor(this, c.p.localReader.id); d(g.namedItem(a)).css("display",
"none"); this[e] && d(c).jqGrid("collapseRow", this)
                })
            } 
        })
    }, getRootNodes: function () { var a = []; this.each(function () { var c = this; if (c.grid && c.p.treeGrid) switch (c.p.treeGridModel) { case "nested": var b = c.p.treeReader.level_field; d(c.p.data).each(function () { parseInt(this[b], 10) === parseInt(c.p.tree_root_level, 10) && a.push(this) }); break; case "adjacency": var e = c.p.treeReader.parent_id_field; d(c.p.data).each(function () { (null === this[e] || "null" == ("" + this[e]).toLowerCase()) && a.push(this) }) } }); return a }, getNodeDepth: function (a) {
        var c =
null; this.each(function () { if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) { case "nested": c = parseInt(a[this.p.treeReader.level_field], 10) - parseInt(this.p.tree_root_level, 10); break; case "adjacency": c = d(this).jqGrid("getNodeAncestors", a).length } }); return c
    }, getNodeParent: function (a) {
        var c = null; this.each(function () {
            if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                case "nested": var b = this.p.treeReader.left_field, e = this.p.treeReader.right_field, g = this.p.treeReader.level_field, h = parseInt(a[b],
10), f = parseInt(a[e], 10), l = parseInt(a[g], 10); d(this.p.data).each(function () { if (parseInt(this[g], 10) === l - 1 && parseInt(this[b], 10) < h && parseInt(this[e], 10) > f) return c = this, !1 }); break; case "adjacency": var j = this.p.treeReader.parent_id_field, i = this.p.localReader.id; d(this.p.data).each(function () { if (this[i] == a[j]) return c = this, !1 })
            } 
        }); return c
    }, getNodeChildren: function (a) {
        var c = []; this.each(function () {
            if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                case "nested": var b = this.p.treeReader.left_field,
e = this.p.treeReader.right_field, g = this.p.treeReader.level_field, h = parseInt(a[b], 10), f = parseInt(a[e], 10), l = parseInt(a[g], 10); d(this.p.data).each(function () { parseInt(this[g], 10) === l + 1 && (parseInt(this[b], 10) > h && parseInt(this[e], 10) < f) && c.push(this) }); break; case "adjacency": var j = this.p.treeReader.parent_id_field, i = this.p.localReader.id; d(this.p.data).each(function () { this[j] == a[i] && c.push(this) })
            } 
        }); return c
    }, getFullTreeNode: function (a) {
        var c = []; this.each(function () {
            var b; if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                case "nested": var e =
this.p.treeReader.left_field, g = this.p.treeReader.right_field, h = this.p.treeReader.level_field, f = parseInt(a[e], 10), l = parseInt(a[g], 10), j = parseInt(a[h], 10); d(this.p.data).each(function () { parseInt(this[h], 10) >= j && (parseInt(this[e], 10) >= f && parseInt(this[e], 10) <= l) && c.push(this) }); break; case "adjacency": if (a) { c.push(a); var i = this.p.treeReader.parent_id_field, p = this.p.localReader.id; d(this.p.data).each(function (a) { b = c.length; for (a = 0; a < b; a++) if (c[a][p] == this[i]) { c.push(this); break } }) } 
            } 
        }); return c
    }, getNodeAncestors: function (a) {
        var c =
[]; this.each(function () { if (this.grid && this.p.treeGrid) for (var b = d(this).jqGrid("getNodeParent", a); b; ) c.push(b), b = d(this).jqGrid("getNodeParent", b) }); return c
    }, isVisibleNode: function (a) { var c = !0; this.each(function () { if (this.grid && this.p.treeGrid) { var b = d(this).jqGrid("getNodeAncestors", a), e = this.p.treeReader.expanded_field; d(b).each(function () { c = c && this[e]; if (!c) return !1 }) } }); return c }, isNodeLoaded: function (a) {
        var c; this.each(function () {
            if (this.grid && this.p.treeGrid) {
                var b = this.p.treeReader.leaf_field;
                c = void 0 !== a ? void 0 !== a.loaded ? a.loaded : a[b] || 0 < d(this).jqGrid("getNodeChildren", a).length ? !0 : !1 : !1
            } 
        }); return c
    }, expandNode: function (a) {
        return this.each(function () {
            if (this.grid && this.p.treeGrid) {
                var c = this.p.treeReader.expanded_field, b = this.p.treeReader.parent_id_field, e = this.p.treeReader.loaded, g = this.p.treeReader.level_field, h = this.p.treeReader.left_field, f = this.p.treeReader.right_field; if (!a[c]) {
                    var l = d.jgrid.getAccessor(a, this.p.localReader.id), j = d("#" + d.jgrid.jqID(l), this.grid.bDiv)[0], i = this.p._index[l];
                    d(this).jqGrid("isNodeLoaded", this.p.data[i]) ? (a[c] = !0, d("div.treeclick", j).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus")) : this.grid.hDiv.loading || (a[c] = !0, d("div.treeclick", j).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus"), this.p.treeANode = j.rowIndex, this.p.datatype = this.p.treedatatype, "nested" == this.p.treeGridModel ? d(this).jqGrid("setGridParam", { postData: { nodeid: l, n_left: a[h], n_right: a[f], n_level: a[g]} }) :
d(this).jqGrid("setGridParam", { postData: { nodeid: l, parentid: a[b], n_level: a[g]} }), d(this).trigger("reloadGrid"), a[e] = !0, "nested" == this.p.treeGridModel ? d(this).jqGrid("setGridParam", { postData: { nodeid: "", n_left: "", n_right: "", n_level: ""} }) : d(this).jqGrid("setGridParam", { postData: { nodeid: "", parentid: "", n_level: ""} }))
                } 
            } 
        })
    }, collapseNode: function (a) {
        return this.each(function () {
            if (this.grid && this.p.treeGrid) {
                var c = this.p.treeReader.expanded_field; a[c] && (a[c] = !1, c = d.jgrid.getAccessor(a, this.p.localReader.id),
c = d("#" + d.jgrid.jqID(c), this.grid.bDiv)[0], d("div.treeclick", c).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus"))
            } 
        })
    }, SortTree: function (a, c, b, e) {
        return this.each(function () {
            if (this.grid && this.p.treeGrid) {
                var g, h, f, l = [], j = this, i; g = d(this).jqGrid("getRootNodes"); g = d.jgrid.from(g); g.orderBy(a, c, b, e); i = g.select(); g = 0; for (h = i.length; g < h; g++) f = i[g], l.push(f), d(this).jqGrid("collectChildrenSortTree", l, f, a, c, b, e); d.each(l, function (a) {
                    var b = d.jgrid.getAccessor(this,
j.p.localReader.id); d("#" + d.jgrid.jqID(j.p.id) + " tbody tr:eq(" + a + ")").after(d("tr#" + d.jgrid.jqID(b), j.grid.bDiv))
                }); l = i = g = null
            } 
        })
    }, collectChildrenSortTree: function (a, c, b, e, g, h) { return this.each(function () { if (this.grid && this.p.treeGrid) { var f, l, j, i; f = d(this).jqGrid("getNodeChildren", c); f = d.jgrid.from(f); f.orderBy(b, e, g, h); i = f.select(); f = 0; for (l = i.length; f < l; f++) j = i[f], a.push(j), d(this).jqGrid("collectChildrenSortTree", a, j, b, e, g, h) } }) }, setTreeRow: function (a, c) {
        var b = !1; this.each(function () {
            this.grid &&
this.p.treeGrid && (b = d(this).jqGrid("setRowData", a, c))
        }); return b
    }, delTreeNode: function (a) {
        return this.each(function () {
            var c = this.p.localReader.id, b = this.p.treeReader.left_field, e = this.p.treeReader.right_field, g, h, f; if (this.grid && this.p.treeGrid) {
                var l = this.p._index[a]; if (void 0 !== l) {
                    g = parseInt(this.p.data[l][e], 10); h = g - parseInt(this.p.data[l][b], 10) + 1; l = d(this).jqGrid("getFullTreeNode", this.p.data[l]); if (0 < l.length) for (var j = 0; j < l.length; j++) d(this).jqGrid("delRowData", l[j][c]); if ("nested" === this.p.treeGridModel) {
                        c =
d.jgrid.from(this.p.data).greater(b, g, { stype: "integer" }).select(); if (c.length) for (f in c) c.hasOwnProperty(f) && (c[f][b] = parseInt(c[f][b], 10) - h); c = d.jgrid.from(this.p.data).greater(e, g, { stype: "integer" }).select(); if (c.length) for (f in c) c.hasOwnProperty(f) && (c[f][e] = parseInt(c[f][e], 10) - h)
                    } 
                } 
            } 
        })
    }, addChildNode: function (a, c, b) {
        var e = this[0]; if (b) {
            var g = e.p.treeReader.expanded_field, h = e.p.treeReader.leaf_field, f = e.p.treeReader.level_field, l = e.p.treeReader.parent_id_field, j = e.p.treeReader.left_field, i = e.p.treeReader.right_field,
p = e.p.treeReader.loaded, m, k, q, s, o; m = 0; var r = c, t; if ("undefined" === typeof a || null === a) { o = e.p.data.length - 1; if (0 <= o) for (; 0 <= o; ) m = Math.max(m, parseInt(e.p.data[o][e.p.localReader.id], 10)), o--; a = m + 1 } var u = d(e).jqGrid("getInd", c); t = !1; if (void 0 === c || null === c || "" === c) r = c = null, m = "last", s = e.p.tree_root_level, o = e.p.data.length + 1; else if (m = "after", k = e.p._index[c], q = e.p.data[k], c = q[e.p.localReader.id], s = parseInt(q[f], 10) + 1, o = d(e).jqGrid("getFullTreeNode", q), o.length ? (r = o = o[o.length - 1][e.p.localReader.id], o = d(e).jqGrid("getInd",
r) + 1) : o = d(e).jqGrid("getInd", c) + 1, q[h]) t = !0, q[g] = !0, d(e.rows[u]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(e.p.treeIcons.leaf + " tree-leaf").addClass(e.p.treeIcons.minus + " tree-minus"), e.p.data[k][h] = !1, q[p] = !0; k = o + 1; b[g] = !1; b[p] = !0; b[f] = s; b[h] = !0; "adjacency" === e.p.treeGridModel && (b[l] = c); if ("nested" === e.p.treeGridModel) {
                var n; if (null !== c) {
                    h = parseInt(q[i], 10); f = d.jgrid.from(e.p.data); f = f.greaterOrEquals(i, h, { stype: "integer" });
                    f = f.select(); if (f.length) for (n in f) f.hasOwnProperty(n) && (f[n][j] = f[n][j] > h ? parseInt(f[n][j], 10) + 2 : f[n][j], f[n][i] = f[n][i] >= h ? parseInt(f[n][i], 10) + 2 : f[n][i]); b[j] = h; b[i] = h + 1
                } else {
                    h = parseInt(d(e).jqGrid("getCol", i, !1, "max"), 10); f = d.jgrid.from(e.p.data).greater(j, h, { stype: "integer" }).select(); if (f.length) for (n in f) f.hasOwnProperty(n) && (f[n][j] = parseInt(f[n][j], 10) + 2); f = d.jgrid.from(e.p.data).greater(i, h, { stype: "integer" }).select(); if (f.length) for (n in f) f.hasOwnProperty(n) && (f[n][i] = parseInt(f[n][i],
10) + 2); b[j] = h + 1; b[i] = h + 2
                } 
            } if (null === c || d(e).jqGrid("isNodeLoaded", q) || t) d(e).jqGrid("addRowData", a, b, m, r), d(e).jqGrid("setTreeNode", o, k); q && !q[g] && d(e.rows[u]).find("div.treeclick").click()
        } 
    } 
    })
})(jQuery);
(function (c) {
    c.jgrid.extend({ jqGridImport: function (a) {
        a = c.extend({ imptype: "xml", impstring: "", impurl: "", mtype: "GET", impData: {}, xmlGrid: { config: "roots>grid", data: "roots>rows" }, jsonGrid: { config: "grid", data: "data" }, ajaxOptions: {} }, a || {}); return this.each(function () {
            var d = this, b = function (a, b) {
                var e = c(b.xmlGrid.config, a)[0], h = c(b.xmlGrid.data, a)[0], f; if (xmlJsonClass.xml2json && c.jgrid.parse) {
                    var e = xmlJsonClass.xml2json(e, " "), e = c.jgrid.parse(e), g; for (g in e) e.hasOwnProperty(g) && (f = e[g]); h ? (h = e.grid.datatype,
e.grid.datatype = "xmlstring", e.grid.datastr = a, c(d).jqGrid(f).jqGrid("setGridParam", { datatype: h })) : c(d).jqGrid(f)
                } else alert("xml2json or parse are not present")
            }, g = function (a, b) { if (a && "string" == typeof a) { var e = !1; c.jgrid.useJSON && (c.jgrid.useJSON = !1, e = !0); var f = c.jgrid.parse(a); e && (c.jgrid.useJSON = !0); e = f[b.jsonGrid.config]; if (f = f[b.jsonGrid.data]) { var g = e.datatype; e.datatype = "jsonstring"; e.datastr = f; c(d).jqGrid(e).jqGrid("setGridParam", { datatype: g }) } else c(d).jqGrid(e) } }; switch (a.imptype) {
                case "xml": c.ajax(c.extend({ url: a.impurl,
                    type: a.mtype, data: a.impData, dataType: "xml", complete: function (f, g) { "success" == g && (b(f.responseXML, a), c(d).triggerHandler("jqGridImportComplete", [f, a]), c.isFunction(a.importComplete) && a.importComplete(f)) } 
                }, a.ajaxOptions)); break; case "xmlstring": if (a.impstring && "string" == typeof a.impstring) { var f = c.jgrid.stringToDoc(a.impstring); f && (b(f, a), c(d).triggerHandler("jqGridImportComplete", [f, a]), c.isFunction(a.importComplete) && a.importComplete(f), a.impstring = null); f = null } break; case "json": c.ajax(c.extend({ url: a.impurl,
                    type: a.mtype, data: a.impData, dataType: "json", complete: function (b) { try { g(b.responseText, a), c(d).triggerHandler("jqGridImportComplete", [b, a]), c.isFunction(a.importComplete) && a.importComplete(b) } catch (f) { } } 
                }, a.ajaxOptions)); break; case "jsonstring": a.impstring && "string" == typeof a.impstring && (g(a.impstring, a), c(d).triggerHandler("jqGridImportComplete", [a.impstring, a]), c.isFunction(a.importComplete) && a.importComplete(a.impstring), a.impstring = null)
            } 
        })
    }, jqGridExport: function (a) {
        var a = c.extend({ exptype: "xmlstring",
            root: "grid", ident: "\t"
        }, a || {}), d = null; this.each(function () {
            if (this.grid) {
                var b = c.extend(!0, {}, c(this).jqGrid("getGridParam")); b.rownumbers && (b.colNames.splice(0, 1), b.colModel.splice(0, 1)); b.multiselect && (b.colNames.splice(0, 1), b.colModel.splice(0, 1)); b.subGrid && (b.colNames.splice(0, 1), b.colModel.splice(0, 1)); b.knv = null; if (b.treeGrid) for (var g in b.treeReader) b.treeReader.hasOwnProperty(g) && (b.colNames.splice(b.colNames.length - 1), b.colModel.splice(b.colModel.length - 1)); switch (a.exptype) {
                    case "xmlstring": d =
"<" + a.root + ">" + xmlJsonClass.json2xml(b, a.ident) + "</" + a.root + ">"; break; case "jsonstring": d = "{" + xmlJsonClass.toJson(b, a.root, a.ident, !1) + "}", void 0 !== b.postData.filters && (d = d.replace(/filters":"/, 'filters":'), d = d.replace(/}]}"/, "}]}"))
                } 
            } 
        }); return d
    }, excelExport: function (a) {
        a = c.extend({ exptype: "remote", url: null, oper: "oper", tag: "excel", exportOptions: {} }, a || {}); return this.each(function () {
            if (this.grid) {
                var d; "remote" == a.exptype && (d = c.extend({}, this.p.postData), d[a.oper] = a.tag, d = jQuery.param(d), d = -1 != a.url.indexOf("?") ?
a.url + "&" + d : a.url + "?" + d, window.location = d)
            } 
        })
    } 
    })
})(jQuery);
var xmlJsonClass = { xml2json: function (a, b) { 9 === a.nodeType && (a = a.documentElement); var g = this.toJson(this.toObj(this.removeWhite(a)), a.nodeName, "\t"); return "{\n" + b + (b ? g.replace(/\t/g, b) : g.replace(/\t|\n/g, "")) + "\n}" }, json2xml: function (a, b) {
    var g = function (a, b, e) {
        var d = "", f, i; if (a instanceof Array) if (0 === a.length) d += e + "<" + b + ">__EMPTY_ARRAY_</" + b + ">\n"; else { f = 0; for (i = a.length; f < i; f += 1) var l = e + g(a[f], b, e + "\t") + "\n", d = d + l } else if ("object" === typeof a) {
            f = !1; d += e + "<" + b; for (i in a) a.hasOwnProperty(i) && ("@" ===
i.charAt(0) ? d += " " + i.substr(1) + '="' + a[i].toString() + '"' : f = !0); d += f ? ">" : "/>"; if (f) { for (i in a) a.hasOwnProperty(i) && ("#text" === i ? d += a[i] : "#cdata" === i ? d += "<![CDATA[" + a[i] + "]]\>" : "@" !== i.charAt(0) && (d += g(a[i], i, e + "\t"))); d += ("\n" === d.charAt(d.length - 1) ? e : "") + "</" + b + ">" } 
        } else "function" === typeof a ? d += e + "<" + b + "><![CDATA[" + a + "]]\></" + b + ">" : (void 0 === a && (a = ""), d = '""' === a.toString() || 0 === a.toString().length ? d + (e + "<" + b + ">__EMPTY_STRING_</" + b + ">") : d + (e + "<" + b + ">" + a.toString() + "</" + b + ">")); return d
    }, f = "", e; for (e in a) a.hasOwnProperty(e) &&
(f += g(a[e], e, "")); return b ? f.replace(/\t/g, b) : f.replace(/\t|\n/g, "")
}, toObj: function (a) {
    var b = {}, g = /function/i; if (1 === a.nodeType) {
        if (a.attributes.length) { var f; for (f = 0; f < a.attributes.length; f += 1) b["@" + a.attributes[f].nodeName] = (a.attributes[f].nodeValue || "").toString() } if (a.firstChild) {
            var e = f = 0, h = !1, c; for (c = a.firstChild; c; c = c.nextSibling) 1 === c.nodeType ? h = !0 : 3 === c.nodeType && c.nodeValue.match(/[^ \f\n\r\t\v]/) ? f += 1 : 4 === c.nodeType && (e += 1); if (h) if (2 > f && 2 > e) {
                this.removeWhite(a); for (c = a.firstChild; c; c =
c.nextSibling) 3 === c.nodeType ? b["#text"] = this.escape(c.nodeValue) : 4 === c.nodeType ? g.test(c.nodeValue) ? b[c.nodeName] = [b[c.nodeName], c.nodeValue] : b["#cdata"] = this.escape(c.nodeValue) : b[c.nodeName] ? b[c.nodeName] instanceof Array ? b[c.nodeName][b[c.nodeName].length] = this.toObj(c) : b[c.nodeName] = [b[c.nodeName], this.toObj(c)] : b[c.nodeName] = this.toObj(c)
            } else a.attributes.length ? b["#text"] = this.escape(this.innerXml(a)) : b = this.escape(this.innerXml(a)); else if (f) a.attributes.length ? b["#text"] = this.escape(this.innerXml(a)) :
(b = this.escape(this.innerXml(a)), "__EMPTY_ARRAY_" === b ? b = "[]" : "__EMPTY_STRING_" === b && (b = "")); else if (e) if (1 < e) b = this.escape(this.innerXml(a)); else for (c = a.firstChild; c; c = c.nextSibling) if (g.test(a.firstChild.nodeValue)) { b = a.firstChild.nodeValue; break } else b["#cdata"] = this.escape(c.nodeValue)
        } !a.attributes.length && !a.firstChild && (b = null)
    } else 9 === a.nodeType ? b = this.toObj(a.documentElement) : alert("unhandled node type: " + a.nodeType); return b
}, toJson: function (a, b, g, f) {
    void 0 === f && (f = !0); var e = b ? '"' + b + '"' :
"", h = "\t", c = "\n"; f || (c = h = ""); if ("[]" === a) e += b ? ":[]" : "[]"; else if (a instanceof Array) { var j, d, k = []; d = 0; for (j = a.length; d < j; d += 1) k[d] = this.toJson(a[d], "", g + h, f); e += (b ? ":[" : "[") + (1 < k.length ? c + g + h + k.join("," + c + g + h) + c + g : k.join("")) + "]" } else if (null === a) e += (b && ":") + "null"; else if ("object" === typeof a) { j = []; for (d in a) a.hasOwnProperty(d) && (j[j.length] = this.toJson(a[d], d, g + h, f)); e += (b ? ":{" : "{") + (1 < j.length ? c + g + h + j.join("," + c + g + h) + c + g : j.join("")) + "}" } else e = "string" === typeof a ? e + ((b && ":") + '"' + a.replace(/\\/g,
"\\\\").replace(/\"/g, '\\"') + '"') : e + ((b && ":") + a.toString()); return e
}, innerXml: function (a) {
    var b = ""; if ("innerHTML" in a) b = a.innerHTML; else for (var g = function (a) {
        var b = "", h; if (1 === a.nodeType) { b += "<" + a.nodeName; for (h = 0; h < a.attributes.length; h += 1) b += " " + a.attributes[h].nodeName + '="' + (a.attributes[h].nodeValue || "").toString() + '"'; if (a.firstChild) { b += ">"; for (h = a.firstChild; h; h = h.nextSibling) b += g(h); b += "</" + a.nodeName + ">" } else b += "/>" } else 3 === a.nodeType ? b += a.nodeValue : 4 === a.nodeType && (b += "<![CDATA[" + a.nodeValue +
"]]\>"); return b
    }, a = a.firstChild; a; a = a.nextSibling) b += g(a); return b
}, escape: function (a) { return a.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r") }, removeWhite: function (a) { a.normalize(); var b; for (b = a.firstChild; b; ) if (3 === b.nodeType) if (b.nodeValue.match(/[^ \f\n\r\t\v]/)) b = b.nextSibling; else { var g = b.nextSibling; a.removeChild(b); b = g } else 1 === b.nodeType && this.removeWhite(b), b = b.nextSibling; return a } 
};
function tableToGrid(j, k) {
    jQuery(j).each(function () {
        if (!this.grid) {
            jQuery(this).width("99%"); var b = jQuery(this).width(), c = jQuery("tr td:first-child input[type=checkbox]:first", jQuery(this)), a = jQuery("tr td:first-child input[type=radio]:first", jQuery(this)), c = 0 < c.length, a = !c && 0 < a.length, i = c || a, d = [], e = []; jQuery("th", jQuery(this)).each(function () {
                0 === d.length && i ? (d.push({ name: "__selection__", index: "__selection__", width: 0, hidden: !0 }), e.push("__selection__")) : (d.push({ name: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                    index: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"), width: jQuery(this).width() || 150
                }), e.push(jQuery(this).html()))
            }); var f = [], g = [], h = []; jQuery("tbody > tr", jQuery(this)).each(function () { var b = {}, a = 0; jQuery("td", jQuery(this)).each(function () { if (0 === a && i) { var c = jQuery("input", jQuery(this)), e = c.attr("value"); g.push(e || f.length); c.is(":checked") && h.push(e); b[d[a].name] = c.attr("value") } else b[d[a].name] = jQuery(this).html(); a++ }); 0 < a && f.push(b) });
            jQuery(this).empty(); jQuery(this).addClass("scroll"); jQuery(this).jqGrid(jQuery.extend({ datatype: "local", width: b, colNames: e, colModel: d, multiselect: c }, k || {})); for (b = 0; b < f.length; b++) a = null, 0 < g.length && (a = g[b]) && a.replace && (a = encodeURIComponent(a).replace(/[.\-%]/g, "_")), null === a && (a = b + 1), jQuery(this).jqGrid("addRowData", a, f[b]); for (b = 0; b < h.length; b++) jQuery(this).jqGrid("setSelection", h[b])
        } 
    })
};
(function (b) {
    b.browser.msie && 8 == b.browser.version && (b.expr[":"].hidden = function (b) { return 0 === b.offsetWidth || 0 === b.offsetHeight || "none" == b.style.display }); b.jgrid._multiselect = !1; if (b.ui && b.ui.multiselect) {
        if (b.ui.multiselect.prototype._setSelected) { var m = b.ui.multiselect.prototype._setSelected; b.ui.multiselect.prototype._setSelected = function (a, e) { var c = m.call(this, a, e); if (e && this.selectedList) { var d = this.element; this.selectedList.find("li").each(function () { b(this).data("optionLink") && b(this).data("optionLink").remove().appendTo(d) }) } return c } } b.ui.multiselect.prototype.destroy &&
(b.ui.multiselect.prototype.destroy = function () { this.element.show(); this.container.remove(); b.Widget === void 0 ? b.widget.prototype.destroy.apply(this, arguments) : b.Widget.prototype.destroy.apply(this, arguments) }); b.jgrid._multiselect = !0
    } b.jgrid.extend({ sortableColumns: function (a) {
        return this.each(function () {
            function e() { c.p.disableClick = true } var c = this, d = b.jgrid.jqID(c.p.id), d = { tolerance: "pointer", axis: "x", scrollSensitivity: "1", items: ">th:not(:has(#jqgh_" + d + "_cb,#jqgh_" + d + "_rn,#jqgh_" + d + "_subgrid),:hidden)",
                placeholder: { element: function (a) { return b(document.createElement(a[0].nodeName)).addClass(a[0].className + " ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0] }, update: function (b, a) { a.height(b.currentItem.innerHeight() - parseInt(b.currentItem.css("paddingTop") || 0, 10) - parseInt(b.currentItem.css("paddingBottom") || 0, 10)); a.width(b.currentItem.innerWidth() - parseInt(b.currentItem.css("paddingLeft") || 0, 10) - parseInt(b.currentItem.css("paddingRight") || 0, 10)) } }, update: function (a,
g) { var d = b(g.item).parent(), d = b(">th", d), e = {}, i = c.p.id + "_"; b.each(c.p.colModel, function (b) { e[this.name] = b }); var h = []; d.each(function () { var a = b(">div", this).get(0).id.replace(/^jqgh_/, "").replace(i, ""); a in e && h.push(e[a]) }); b(c).jqGrid("remapColumns", h, true, true); b.isFunction(c.p.sortable.update) && c.p.sortable.update(h); setTimeout(function () { c.p.disableClick = false }, 50) } 
            }; if (c.p.sortable.options) b.extend(d, c.p.sortable.options); else if (b.isFunction(c.p.sortable)) c.p.sortable = { update: c.p.sortable };
            if (d.start) { var g = d.start; d.start = function (b, a) { e(); g.call(this, b, a) } } else d.start = e; if (c.p.sortable.exclude) d.items = d.items + (":not(" + c.p.sortable.exclude + ")"); a.sortable(d).data("sortable").floating = true
        })
    }, columnChooser: function (a) {
        function e(a, c) { a && (typeof a == "string" ? b.fn[a] && b.fn[a].apply(c, b.makeArray(arguments).slice(2)) : b.isFunction(a) && a.apply(c, b.makeArray(arguments).slice(2))) } var c = this; if (!b("#colchooser_" + b.jgrid.jqID(c[0].p.id)).length) {
            var d = b('<div id="colchooser_' + c[0].p.id + '" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'),
g = b("select", d), a = b.extend({ width: 420, height: 240, classname: null, done: function (b) { b && c.jqGrid("remapColumns", b, true) }, msel: "multiselect", dlog: "dialog", dialog_opts: { minWidth: 470 }, dlog_opts: function (a) { var c = {}; c[a.bSubmit] = function () { a.apply_perm(); a.cleanup(false) }; c[a.bCancel] = function () { a.cleanup(true) }; return b.extend(true, { buttons: c, close: function () { a.cleanup(true) }, modal: a.modal ? a.modal : false, resizable: a.resizable ? a.resizable : true, width: a.width + 20 }, a.dialog_opts || {}) }, apply_perm: function () {
    b("option",
g).each(function () { this.selected ? c.jqGrid("showCol", k[this.value].name) : c.jqGrid("hideCol", k[this.value].name) }); var d = []; b("option:selected", g).each(function () { d.push(parseInt(this.value, 10)) }); b.each(d, function () { delete f[k[parseInt(this, 10)].name] }); b.each(f, function () { var b = parseInt(this, 10); var a = d, c = b; if (c >= 0) { var g = a.slice(), e = g.splice(c, Math.max(a.length - c, c)); if (c > a.length) c = a.length; g[c] = b; d = g.concat(e) } else d = void 0 }); a.done && a.done.call(c, d)
}, cleanup: function (b) {
    e(a.dlog, d, "destroy");
    e(a.msel, g, "destroy"); d.remove(); b && a.done && a.done.call(c)
}, msel_opts: {}
}, b.jgrid.col, a || {}); if (b.ui && b.ui.multiselect && a.msel == "multiselect") { if (!b.jgrid._multiselect) { alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!"); return } a.msel_opts = b.extend(b.ui.multiselect.defaults, a.msel_opts) } a.caption && d.attr("title", a.caption); if (a.classname) { d.addClass(a.classname); g.addClass(a.classname) } if (a.width) {
                b(">div", d).css({ width: a.width, margin: "0 auto" }); g.css("width",
a.width)
            } if (a.height) { b(">div", d).css("height", a.height); g.css("height", a.height - 10) } var k = c.jqGrid("getGridParam", "colModel"), p = c.jqGrid("getGridParam", "colNames"), f = {}, j = []; g.empty(); b.each(k, function (b) { f[this.name] = b; this.hidedlg ? this.hidden || j.push(b) : g.append("<option value='" + b + "' " + (this.hidden ? "" : "selected='selected'") + ">" + jQuery.jgrid.stripHtml(p[b]) + "</option>") }); var i = b.isFunction(a.dlog_opts) ? a.dlog_opts.call(c, a) : a.dlog_opts; e(a.dlog, d, i); i = b.isFunction(a.msel_opts) ? a.msel_opts.call(c,
a) : a.msel_opts; e(a.msel, g, i)
        } 
    }, sortableRows: function (a) {
        return this.each(function () {
            var e = this; if (e.grid && !e.p.treeGrid && b.fn.sortable) {
                a = b.extend({ cursor: "move", axis: "y", items: ".jqgrow" }, a || {}); if (a.start && b.isFunction(a.start)) { a._start_ = a.start; delete a.start } else a._start_ = false; if (a.update && b.isFunction(a.update)) { a._update_ = a.update; delete a.update } else a._update_ = false; a.start = function (c, d) {
                    b(d.item).css("border-width", "0px"); b("td", d.item).each(function (b) { this.style.width = e.grid.cols[b].style.width });
                    if (e.p.subGrid) { var g = b(d.item).attr("id"); try { b(e).jqGrid("collapseSubGridRow", g) } catch (k) { } } a._start_ && a._start_.apply(this, [c, d])
                }; a.update = function (c, d) { b(d.item).css("border-width", ""); e.p.rownumbers === true && b("td.jqgrid-rownum", e.rows).each(function (a) { b(this).html(a + 1 + (parseInt(e.p.page, 10) - 1) * parseInt(e.p.rowNum, 10)) }); a._update_ && a._update_.apply(this, [c, d]) }; b("tbody:first", e).sortable(a); b("tbody:first", e).disableSelection()
            } 
        })
    }, gridDnD: function (a) {
        return this.each(function () {
            function e() {
                var a =
b.data(c, "dnd"); b("tr.jqgrow:not(.ui-draggable)", c).draggable(b.isFunction(a.drag) ? a.drag.call(b(c), a) : a.drag)
            } var c = this; if (c.grid && !c.p.treeGrid && b.fn.draggable && b.fn.droppable) {
                b("#jqgrid_dnd")[0] === void 0 && b("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>"); if (typeof a == "string" && a == "updateDnD" && c.p.jqgdnd === true) e(); else {
                    a = b.extend({ drag: function (a) {
                        return b.extend({ start: function (d, e) {
                            if (c.p.subGrid) { var f = b(e.helper).attr("id"); try { b(c).jqGrid("collapseSubGridRow", f) } catch (j) { } } for (f =
0; f < b.data(c, "dnd").connectWith.length; f++) b(b.data(c, "dnd").connectWith[f]).jqGrid("getGridParam", "reccount") == "0" && b(b.data(c, "dnd").connectWith[f]).jqGrid("addRowData", "jqg_empty_row", {}); e.helper.addClass("ui-state-highlight"); b("td", e.helper).each(function (b) { this.style.width = c.grid.headers[b].width + "px" }); a.onstart && b.isFunction(a.onstart) && a.onstart.call(b(c), d, e)
                        }, stop: function (d, e) {
                            if (e.helper.dropped && !a.dragcopy) {
                                var f = b(e.helper).attr("id"); f === void 0 && (f = b(this).attr("id")); b(c).jqGrid("delRowData",
f)
                            } for (f = 0; f < b.data(c, "dnd").connectWith.length; f++) b(b.data(c, "dnd").connectWith[f]).jqGrid("delRowData", "jqg_empty_row"); a.onstop && b.isFunction(a.onstop) && a.onstop.call(b(c), d, e)
                        } 
                        }, a.drag_opts || {})
                    }, drop: function (a) {
                        return b.extend({ accept: function (a) { if (!b(a).hasClass("jqgrow")) return a; a = b(a).closest("table.ui-jqgrid-btable"); if (a.length > 0 && b.data(a[0], "dnd") !== void 0) { a = b.data(a[0], "dnd").connectWith; return b.inArray("#" + b.jgrid.jqID(this.id), a) != -1 ? true : false } return false }, drop: function (d, e) {
                            if (b(e.draggable).hasClass("jqgrow")) {
                                var f =
b(e.draggable).attr("id"), f = e.draggable.parent().parent().jqGrid("getRowData", f); if (!a.dropbyname) { var j = 0, i = {}, h, n = b("#" + b.jgrid.jqID(this.id)).jqGrid("getGridParam", "colModel"); try { for (var o in f) { h = n[j].name; h == "cb" || (h == "rn" || h == "subgrid") || f.hasOwnProperty(o) && n[j] && (i[h] = f[o]); j++ } f = i } catch (m) { } } e.helper.dropped = true; if (a.beforedrop && b.isFunction(a.beforedrop)) { h = a.beforedrop.call(this, d, e, f, b("#" + b.jgrid.jqID(c.p.id)), b(this)); typeof h != "undefined" && (h !== null && typeof h == "object") && (f = h) } if (e.helper.dropped) {
                                    var l;
                                    if (a.autoid) if (b.isFunction(a.autoid)) l = a.autoid.call(this, f); else { l = Math.ceil(Math.random() * 1E3); l = a.autoidprefix + l } b("#" + b.jgrid.jqID(this.id)).jqGrid("addRowData", l, f, a.droppos)
                                } a.ondrop && b.isFunction(a.ondrop) && a.ondrop.call(this, d, e, f)
                            } 
                        } 
                        }, a.drop_opts || {})
                    }, onstart: null, onstop: null, beforedrop: null, ondrop: null, drop_opts: { activeClass: "ui-state-active", hoverClass: "ui-state-hover" }, drag_opts: { revert: "invalid", helper: "clone", cursor: "move", appendTo: "#jqgrid_dnd", zIndex: 5E3 }, dragcopy: false, dropbyname: false,
                        droppos: "first", autoid: true, autoidprefix: "dnd_"
                    }, a || {}); if (a.connectWith) { a.connectWith = a.connectWith.split(","); a.connectWith = b.map(a.connectWith, function (a) { return b.trim(a) }); b.data(c, "dnd", a); c.p.reccount != "0" && !c.p.jqgdnd && e(); c.p.jqgdnd = true; for (var d = 0; d < a.connectWith.length; d++) b(a.connectWith[d]).droppable(b.isFunction(a.drop) ? a.drop.call(b(c), a) : a.drop) } 
                } 
            } 
        })
    }, gridResize: function (a) {
        return this.each(function () {
            var e = this, c = b.jgrid.jqID(e.p.id); if (e.grid && b.fn.resizable) {
                a = b.extend({}, a ||
{}); if (a.alsoResize) { a._alsoResize_ = a.alsoResize; delete a.alsoResize } else a._alsoResize_ = false; if (a.stop && b.isFunction(a.stop)) { a._stop_ = a.stop; delete a.stop } else a._stop_ = false; a.stop = function (d, g) { b(e).jqGrid("setGridParam", { height: b("#gview_" + c + " .ui-jqgrid-bdiv").height() }); b(e).jqGrid("setGridWidth", g.size.width, a.shrinkToFit); a._stop_ && a._stop_.call(e, d, g) }; a.alsoResize = a._alsoResize_ ? eval("(" + ("{'#gview_" + c + " .ui-jqgrid-bdiv':true,'" + a._alsoResize_ + "':true}") + ")") : b(".ui-jqgrid-bdiv", "#gview_" +
c); delete a._alsoResize_; b("#gbox_" + c).resizable(a)
            } 
        })
    } 
    })
})(jQuery);
﻿(function ($) {
    $.widget("sc.grid", {
        options: {
            multiselect: false,
            scroll: 1,
            datatype: "json",
            rowNum: 6,
            mtype: "POST",
            rownumbers: false,
            sortable: true,
            rownumWidth: 40,
            rowheight: 40,
            height: 'auto',
            prmNames: { nd: null },
            repeatitems: false,
            page: "page",
            loadtext: "<img src='/sitecore/apps/img/sc-spinner16.gif' width='16' />", //"Loading...",
            emptyrecords: "No records to view",
            onSortCol: function (index, iCol, sortorder) { if (iCol == 0) { $(".s-ico:first").show(); } },
            minHeight: 100,
            altRows: true,
            multiselectWidth: 50,
            shrinkToFit: false,
            viewMode: 0
        },

        progress: function (cellvalue, options, rowObject) {
            return "<div class='grid-progressbar ui-progressbar'><div class='grid-progressbar-value ui-progressbar-value' style='width: " + cellvalue + "%;'></div><span class='grid-progressbar-label ui-progressbar-label'>" + cellvalue + "%</span>";
        },

        _create: function () {
            var self = this,
                options = this.options;
            this._initialize();
            this._bind();
            !this.options.multiselect ? (self.options.multiselect == true ? true : false) : $.noop();
            self.element.parents('.ui-accordion-content').size() ? self.element.parent('.ui-accordion-content').css({ 'background': '#fff' }) : self.element.css('border', '1px solid #E5E5E5');
            options.beforeProcessing = function (data, status, xhr) { self._beforeProcessing(data, status, xhr); };
            options.serializeGridData = function (postData) { return self.serializeGridData(postData); };
            options.afterInsertRow = function (rowid, rowdata, rowelem) {
                self.element.find('#' + rowid).attr('data-sc-key') != undefined ? self.element.find('#' + rowid + ':first').remove() : $.noop();
                self.afterInsertRow(rowid, rowdata, rowelem);
            };
            options.onSelectRow = function (rowid, status) { self.onSelectRow(rowid, status); };
            options.onSelectAll = function (aRowids, status) { self.onSelectAll(aRowids, status); };
            options.beforeSelectRow = function (rowid, e) {
                if (self.options.actionsid) {
                    self.element.trigger('mouseleave');
                    $('#' + self.options.actionsid).trigger('selectgridrow');
                }
                return self.beforeSelectRow(rowid, e);
            };
            options.loadComplete = function (data) { self.onLoadComplete(data); };
            options.onSortCol = function (index, iCol, sortorder) {
                self.grid.parent().find('.validation-icon').remove();
            };
            this.colDataKey = this._hasKey();
            self.grid.jqGrid(options);
            options.minHeight ? this.element.css({ 'min-height': options.minHeight + 'px' }) : $.noop();
            this.element.closest('.smart-panel').size() > 0 ?
                this.element.css({ 'overflow-x': 'scroll', 'position': 'relative', 'width': this.element.closest('.smart-panel').find('.popup-instance').width() - 35 + 'px' }) :
                $.noop();
            //options.bottomLink ? this._addBottomLink() : $.noop();
            self.holder = $("#gbox_" + self.id + "_content");
            var widthTd = $(self.element).find(" tbody > tr:first-child > td:last-child");
            widthTd.width(widthTd.width() - 1);
            $(".s-ico:first").hide();
            this.setSelection(this.options.selected, false);
            $('.loading > img', self.element).before("<div class='cover'></div>");
            options.viewMode == 2 ? this.element.find('.loading').css({'margin-top' : '25px'}) : $.noop();
        },
        _beforeProcessing: function (data, status, xhr) {
            var self = this;
            data.total = data.records;
        },
        _bind: function () {
            var self = this,
                options = this.options;
            if (options.width == null) {
                options.width = self.element.parent().parent().width() || self.element.parent().width() || self.element.parents('.ui-accordion-content').find('.ui-jqgrid-htable').width() || self.element.closest('.ui-combobox').width() || self.element.closest('.main-content').width() * 0.995;
                self.element.is(":hidden") ?
                self.element.parents().off('contentshow.grid show.grid show.combobox').on('contentshow.grid show.grid show.combobox', function (e) {
                    self.grid.jqGrid('setGridWidth', options.width);
                    self.bdivWidth = self.element.find('.ui-jqgrid-bdiv').width();
                    self.grid.trigger('reloadGrid');
                    $(this).off('contentshow.grid show.grid show.combobox');
                }).off('contenthide.grid hide.grid hide.combobox').on('contenthide.grid hide.grid hide.combobox', function () {
                    $(this).off('contentshow.grid show.grid show.combobox').off('contenthide.grid hide.grid hide.combobox');
                }) :
                $.noop();
            }
        },
        _initialize: function () {
            var self = this,
            options = this.options;
            this.storage = new $.Storage();
            self.options.emptyrecords = self.options.texts && self.options.texts.noRecordsToView ? self.options.texts.noRecordsToView : self.options.emptyrecords;
            self.id = self.element.attr('id');
            self.element.css('overflow', 'hidden');
            self.grid = $("<table id='" + self.id + "_content' class='grid'></table>").appendTo(this.element.removeClass('grid'));
            options.url = this.element.closest('form').attr('action');
            self.selected = this.element.find('input:first');
            self.name = options.name ? options.name : self.id.replace(/_/gi, '$');
            this.element.attr('data-name', this.name);
            //!this.options.multiselect? self.options.shrinkToFit = true : self.shrinkToFit = true;
            self.options.shrinkToFit = true;
            for (key in options.colModel) {
                var colWidth = self.storage.get(this.element.attr('id') + options.colModel[key].index + '_width');

                if (colWidth) {
                    options.colModel[key].width = parseInt(colWidth, 10);
                    self.options.shrinkToFit = false;
                }
                if (options.colModel[key].formatter) {
                    options.colModel[key].formatter = self[options.colModel[key].formatter];
                }
            }
            options.resizeStop = function (newwidth, index) {
                var colmodel = self.grid.jqGrid('getGridParam', 'colModel');
                for (key in colmodel) {
                    self.storage.set(self.element.attr('id') + colmodel[key].index + '_width', colmodel[key].width);
                }
            };
        },
        _gridCellWidth: function () {
            var self = this,
                colModel = this.grid.jqGrid('getGridParam', 'colModel');

            this.grid.find('tr').each(function () {
                $(this).find('td').each(function (i, v) {
                    $(this).width() != colModel[i].width ? $(this).width(colModel[i].width) : $.noop();
                });
            });

        },
        onLoadComplete: function (data) {
            var self = this,
                options = this.options;
            var grid = this.grid[0];
            var rows = data.rows;
            self._gridCellWidth();
            $('#' + self.options.actionsid).triggerHandler('allfavorites');
            self.grid.jqGrid('getGridParam', 'multiselect') ? self.grid.find('tr').each(function () { $(this).find('td:first').addClass('select'); }) : $.noop();
            self.options.height == 'auto' ? self.element.find('.ui-jqgrid-bdiv div:first').css('height', 'auto') : $.noop();
            self.element.find('.grid').parent().find('div:first').css({ height: '0px', display: 'none' });
            if (options.rowheight) {
                var ids = self.grid.getDataIDs();

                if (rows != null) {
                    for (var i = 0; i < rows.length; i++) {
                        var currentRowIndex = grid.rows.length - rows.length + i;
                        $(grid.rows[currentRowIndex]).css({ height: options.rowheight + 'px' });
                    }
                }
            }
            var count = data.rows.length - 1;
            $(this.grid.find('tr').get().reverse()).each(function () {
                if (count >= 0 && data.rows[count].states) {
                    $(this).attr('data-states', data.rows[count].states.toString());
                }
                count--;
            });

            self.grid.off('reloadGrid.sc').on('reloadGrid.sc', function () {
                self.element.find('.validation-icon').remove();
                self.element.find('.popup-selected-clone').remove();
            });
            try {
                var createValidationIcon = function (msg, row, vtype) {
                    var icon = document.createElement("a");
                    icon.href = "#";
                    icon.style.top = (row.offsetTop + 12) + "px";
                    icon.style.left = (row.offsetLeft + $(row).find('td:first').outerWidth() - 8) + "px";
                    grid.parentNode.appendChild(icon);

                    $(icon)
                        .off('mouseenter.grid').on('mouseenter.grid', function () { self.lastHovered ? self.lastHovered.trigger('mouseenter') : $.noop(); })
                        .off('mouseleave.grid').on('mouseleave.grid', function () { self.lastHovered ? self.lastHovered.trigger('mouseleave') : $.noop(); })
                        .tooltip({ 'trigger': $(icon), position: ['top', 'left'], 'text': msg, offset: [0, 0], delay: 0, 'className': vtype });

                    return icon;
                };
                for (var i = 0; i < rows.length; i++) {
                    var currentRowIndex = grid.rows.length - rows.length + i;
                    var validatorType = null;
                    var msg = null;

                    var errors = 0,
                        warnings = 0,
                        infos = 0;
                    if (rows[i].messages != null) {
                        for (var cellIndex = 0; cellIndex < rows[i].messages.length; cellIndex++) {
                            var message = rows[i].messages[cellIndex];

                            if (message != null) {
                                if (message.info && validatorType != "warning" && validatorType != "error") {
                                    infos++;

                                    validatorType = "info";
                                    msg = infos == 1 ? message.info : "There are infos errors";
                                }

                                if (message.warning && validatorType != "error") {
                                    warnings++;

                                    validatorType = "warning";
                                    msg = warnings == 1 ? message.warning : "There are warnings errors";
                                }

                                if (message.error) {
                                    errors++;

                                    validatorType = "error";
                                    msg = errors == 1 ? message.error : "There are validation errors";
                                }

                                validatorType ? $(grid.rows[currentRowIndex]).addClass(validatorType) : $.noop();

                            }
                        };
                    }

                    if (msg) {
                        createValidationIcon(msg, grid.rows[currentRowIndex], validatorType).className = "validation-icon " + validatorType;
                    }

                    $('td', grid.rows[currentRowIndex]).each(function (index) {
                        if (index) {
                            rows[i].classes ? $(this).addClass(rows[i].classes[index - 1]) : $.noop();
                        } else {
                            $(this).addClass(self._crossingClasses(rows[i]));
                        }
                    });


                }
            }
            catch (e) { }
        },
        _crossingClasses: function (row) {
            if (row.classes) {
                var rowClasses = row.classes[0] ? row.classes[0].split(' ') : false;
                while (rowClasses || rowClasses.length) {
                    var success = true;
                    $.each(row.classes, function (i, v) {
                        !v ? rowClasses = success = false : $.noop();
                        if (rowClasses.length > 1 ? rowClasses.slice(0, rowClasses.length).toString() != v.split(' ').slice(0, rowClasses.length).toString() : rowClasses[0] != v.split(' ')[0]) {
                            success = false;
                            rowClasses.pop();
                        }
                    });
                    if (success) {
                        return rowClasses.length > 1 ? rowClasses.slice(0, rowClasses.length).toString().replace(/,/g, ' ') : rowClasses[0];
                    }
                }
                return '';
            } else {
                return '';
            }
        },
        onSelectAll: function (aRowids, status) {
            this.updateSelected();
            this.element.trigger('onSelectAll', [aRowids, status]);
        },

        beforeSelectRow: function (rowid, e) {
            this.element.trigger('onBeforeSelectRow', rowid);
            return true;
        },

        onSelectRow: function (rowid, status) {
            var self = this,
                prevSelected = this.selected.val();

            this.element.closest('body').off('cancelopen.sc').on('cancelopen.sc', function () {
                self.grid.setSelection(rowid, false);
                self.selected.val(prevSelected);
            });

            this.updateSelected(rowid);
            this.element.trigger('onSelectRow', [rowid, status]);

        },

        _hasKey: function () {
            var key = false;
            $.each(this.options.colModel, function () { $.each(this, function (i, v) { i == "key" && v == true ? key = true : $.noop(); }); });
            return key;
        },
        updateSelected: function (rowid) {
            if (!this.insertRow) {

                var self = this;
                var selected = '';
                var lastRow = '';
                if (this.grid.jqGrid('getGridParam', 'multiselect')) {
                    $("#" + this.id + "_content input:checked").each(function () {
                        var value = $(this).attr('data-sc-key');
                        if (value) {
                            if (selected != '') {
                                selected += ",";
                            }
                            selected += value;
                            lastRow = value;
                        }
                    });
                } else {
                    selected = $('#' + rowid).attr('data-sc-key'); ///previous
                }

                self.lastSelected = { selected: selected, rowid: rowid };
                self._postBack(selected, rowid);
            }
        },

        _postBack: function (selected, rowid) {
            var self = this;
            var selectedSplit = self.selected.val().split(',');
            var fullValue = (selectedSplit[4] == selected && $('.smart-panel:visible').size() > 0 ? "0" : "1")
                + "," + (this.grid.getGridParam('sortname') || '') + "," + (this.grid.getGridParam('sortorder') || 'asc') + ",," + selected;
            var eventName = (this.selected.val() != fullValue && fullValue.split(',')[0] == 1 ? "change:" : "click:") + rowid;

            self.selected.val(fullValue);
            if ((eventName.indexOf('change') == 0 || (!this.grid.jqGrid('getGridParam', 'multiselect') && eventName.indexOf('click') == 0)) && this.options.autopostback) {
                __doPostBack(this.element.data('name'), eventName);
            }
        },

        setHoverRow: function (value) {
            var params = this.selected.val().split(',');
            params[3] = value;
            this.selected.val(params.join(','));
        },

        setSelection: function (rowIds, raiseOnSelectRow) {
            var rows = $((rowIds || '').split(',')).filter(function () { return this != ''; });

            for (var i in rows) {
                this.grid.setSelection(rows[i], raiseOnSelectRow);
            };
        },

        serializeGridData: function (postData) {
            var form = this.element.closest('form').serializeArray();
            postData["__EVENTTARGET"] = this.name;
            postData[this.name] = this.name;
            $.each(form, function (i) {
                postData[this.name] = postData[this.name] != null ? postData[this.name] : this.value;
            });

            return postData;
        },

        afterInsertRow: function (rowid, rowdata, rowelem) {
            var select = true;

            if (this.grid.jqGrid('getGridParam', 'multiselect')) {
                $("#cb_" + this.id + "_content:checked").each(function () { this.checked = false; });
                var checkbox = $("#" + this.id + "_content #jqg_" + this.id + "_content_" + rowid);
                checkbox.attr({ 'name': '', 'data-sc-key': this.colDataKey ? rowid : this.grid.getInd(rowid) });
                checkbox.after("<label for='" + this.id + "_content #jqg_" + this.id + "_content_" + rowid + "'></label>");
                $('#' + rowid).find('image').each(function () { $(this).height() > 32 ? $(this).height(32) : $.noop(); });
                select = !checkbox[0].checked;
            } else {
                $('#' + rowid).attr('data-sc-key', this.colDataKey ? rowid : this.grid.getInd(rowid));
            }

            this.insertRow = true;

            var values = $(this.selected.val().split(',')).filter(function (i) { return i > 2; });
            if ($.inArray(rowid.toString(), values) > -1 && select) {
                this.grid.jqGrid('setSelection', [rowid]);
            }

            this.insertRow = false;
            this.element.trigger('afterInsertRow', [rowid, rowdata, rowelem]);
        },

        destroy: function () {
            return $.Widget.prototype.destroy.call(this);
        }
    });

})(jQuery);
﻿(function ($) {
    var prototype = $.sc.grid.prototype;
    $.widget("sc.grid", $.extend({}, prototype, {
        _viewMode: function () {
            var self = this,
                options = this.options;

            if (options.viewMode === 0) {
                options.scroll = true;
                options.height = (options.rowheight * options.rowNum) - 5;
                options.maxHeight = (options.rowheight * options.rowNum) - 5;
            }
            if (options.viewMode == 1) {
                options.scroll = false;
                options.height = options.rowheight * 6;
                options.maxHeight = options.rowheight * 6;
            }
            if (options.viewMode == 2) {
                options.rowNum = 20;
                options.minHeight = 800;
                $(window).off('scroll').on('scroll', function (e) {
                    ($(this).scrollTop() + $(window).height()) > ($('.page-content').height() - 100) ?
                        self._loadMore()
                        : $.noop();
                });
            }

        },
        _initialize: function () {
            this._viewMode();
            prototype._initialize.apply(this, arguments);

        },
        _loadMore: function () {
            var self = this;
            self.bdivWidth = self.bdivWidth ? self.bdivWidth : self.element.find('.ui-jqgrid-bdiv').width();
            self.element.find('.ui-jqgrid-bdiv').parent().css({ 'overflow': 'hidden', height: self.element.find('.ui-jqgrid-bdiv').parent().height() + 'px' });
            self.element.find('.ui-jqgrid-bdiv').css({ 'height': (self.element.find('.grid').height()) + 'px', 'overflow': 'scroll' })
                .scrollTop(0).scroll()
                .scrollTop(($(window).scrollTop() ? $(window).scrollTop() : 0) + $(window).height()).scroll()
                .css({ width: (self.element.find('.ui-jqgrid-bdiv').width() + 40) + 'px', height: (self.element.find('.ui-jqgrid-bdiv').height() + 40) + 'px' });
        },

        onLoadComplete: function (data) {
            var self = this,
                options = this.options,
                rowsOverflow = false;

            prototype.onLoadComplete.apply(this, arguments);
            if (options.viewMode === 0) {
                options.scroll = true;
                options.rowNum = 6;
                options.height = (options.rowheight * 6) - 5;
                options.maxHeight = (options.rowheight * 6) - 5;
            }
            if (options.viewMode == 1) {
                self.element.find('.ui-jqgrid-bdiv').css({ 'overflow': 'hidden' });
            }
            if (options.viewMode == 2) {
                self.element.find('.ui-jqgrid-bdiv').css({ 'overflow': 'hidden', 'height': self.element.find('.grid').height(), width: self.bdivWidth + 'px' }).parent().css({ 'overflow': 'visible', height: 'auto' });
                self.element.find('.loading').addClass('bottom');
                if ($(document).height() <= $(window).height()) {
                    if (data.rows) {
                        data.rows.length == options.rowNum ? self._loadMore() : $.noop();
                    }
                }
            }

        }

    }));

})(jQuery);
﻿(function ($) {
    var prototype = $.sc.grid.prototype;
    $.widget("sc.grid", $.extend({}, prototype, {
        _create: function () {
            var self = this;
            if (this.options.actionsid) {
                this.actionsStates = new Array();
                $('#' + this.options.actionsid).css('display', 'none');
            }
            prototype._create.apply(this, arguments);
            if (this.options.actionsid) {
                self.element.find('.ui-jqgrid-htable')
                    .off('mouseover')
                    .on('mouseover',
                        function () {
                            $('#' + self.id + '_hovered').val('');
                            $('#' + self.options.actionsid).trigger('leave',
                                [function () {
                                    self.element.find('.jqgrow.ui-state-hover').removeClass('ui-state-hover');
                                    self.lastHovered = false;
                                }
                                ]);
                        });
            }
        },
        _bind: function () {
            prototype._bind.apply(this, arguments);

            var self = this;
            if (self.options.actionsid) {
                self.element
                    .off('mouseover')
                    .on('mouseover',
                        function () {
                            self.lastHovered = $(this).find('.jqgrow.ui-state-hover').size() ? $(this).find('.jqgrow.ui-state-hover') : false;
                            if (self.lastHovered) {
                                $('#' + self.id + '_hovered').val(self.lastHovered.find('*[sc-data-key]:first').attr('sc-data-key'));
                                $('#' + self.options.actionsid).trigger('over',
                                    [self.element.find('.ui-jqgrid-bdiv'),
                                        self.lastHovered ?
                                            !self.lastHovered.hasClass('ui-state-highlight') ?
                                                { 'display': 'block', 'position': 'absolute', 'top': (self.lastHovered.offset().top - self.lastHovered.closest('table').offset().top) + 1 + 'px', 'right': self.element.width() > self.element.find('.grid').width() ? (self.element.width() - self.element.find('.grid').width()) + 'px' : '0px'} :
                                                $(this).find('.jqgrow.ui-state-highlight').size() < 2 ?
                                                    { 'display': 'none'} :
                                                    { 'display': 'block', 'position': 'absolute', 'top': (self.lastHovered.offset().top - self.lastHovered.closest('table').offset().top) + 1 + 'px', 'right': self.element.width() > self.element.find('.grid').width() ? (self.element.width() - self.element.find('.grid').width()) + 'px' : '0px'} :
                                            {},
                                        function () { self.lastHovered ? self.lastHovered.trigger('mouseenter') : $.noop(); },
                                        self.lastHovered.attr('data-states') ? self.lastHovered.attr('data-states').split(',') : false
                                    ]);
                                $('body').find('.smart-panel:first').size() ?
                                    $('body').find('.smart-panel:first').find('.grid-pointer.hover-pointer').size() ?
                                        $('body').find('.smart-panel:first').find('.grid-pointer.hover-pointer').css({ top: self.lastHovered.offset().top + 'px' }) :
                                        $('body').find('.smart-panel:first').append($('<div class="grid-pointer hover-pointer"></div>').css({ top: self.lastHovered.offset().top + 'px', left: "-40px", position: 'absolute' }))
                                    : $.noop();
                            }
                        })
                    .off('mouseleave')
                    .on('mouseleave',
                        function () {
                            self.lastHovered = $(this).find('.jqgrow.ui-state-hover').size() ? $(this).find('.jqgrow.ui-state-hover') : false;
                            $('#' + self.id + '_hovered').val('');
                            $('#' + self.options.actionsid).trigger('leave',
                                [function () {
                                    self.lastHovered ? self.lastHovered.trigger('mouseleave') : $.noop();
                                    self.lastHovered = false;
                                }
                                ]);
                        }).off('onSelectRow.grid').on('onSelectRow.grid', function () {
                            self.grid.find('.ui-state-highlight').size() && self.grid.find('.ui-state-highlight').size() < 2 ?
                                $('#' + self.options.actionsid).triggerHandler('selectgridrow', [self.element.find('.ui-jqgrid-bdiv'), { 'position': 'absolute', 'top': (self.grid.find('.ui-state-highlight:first').offset().top - self.grid.find('.ui-state-highlight:first').closest('table').offset().top) + 1 + 'px', 'right': self.element.width() > self.element.find('.grid').width() ? (self.element.width() - self.element.find('.grid').width()) + 'px' : '0px' }, function () {
                                }, self.grid.find('.ui-state-highlight').attr('data-states') ? self.grid.find('.ui-state-highlight').attr('data-states').split(',') : false]) :
                                $('#' + self.options.actionsid).triggerHandler('selectgridrow');
                        });
                


                $('#' + self.options.actionsid).trigger('gridcomplete');
  

            }
        }
    }));

})(jQuery);﻿
if (typeof (Sys) !== 'undefined') {
    Sys.Browser.WebKit = {};
    if (navigator.userAgent.indexOf('WebKit/') > -1) {
        Sys.Browser.agent = Sys.Browser.WebKit;
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        Sys.Browser.name = 'WebKit';
    }
    Sys.Application.notifyScriptLoaded();
}