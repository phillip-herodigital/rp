/*
===================================
Invoke Namespace
===================================
*/
var SC = SC || {};

/*
===================================
Initialize
===================================
*/
jQuery(document).ready(function () {
    SC.InitUtils.DomReady();
});

SC.InitUtils = {
    DomReady: function () {
        GetDefaultView(); //Set the default view of the search, retrieved off the item
        GetCurrentCulture(); //Get and Set the Current UI Browser Culture
        GetAllSearchFilters(); //Get all Search Types from the content tree e.g. author:
        RetrieveScalabilitySettings(); //This will check if you have designate a URL for all queries to be run from and switch to that. Default is empty. (Local)
        if (!$j.browser.msie) {
            jQuery(".addition").focus();
        }
    },

    Vars: {

    }

};

/*********** Global Variables ***********/

var CurrentFacetFilter;
var OnlyFacets;
var AllFilters;
var CurrentPage;
var CurrentView = "";
var Expanded = false;
var QueryServer = "";
var FacetOn = false;
var CurrentCulture = "en";
var pageNumber = 0;
var scPageAmount = 0;
var maxPageCount = 10;

/*****************************************/

//Detects what is the current search view
function detectViewMode() {
    if (CurrentView != "") {
        return CurrentView;
    }

    return $j("#views").find(".active").attr("id");
}

function launchMultipleTabs(ids) {
    var parsedIds = ids.split("|");
    $j.each(parsedIds, function () {
        window.scForm.getParentForm().postRequest('', '', '', 'contenteditor:launchtab(url=' + this + ')');
        return false;
    });
};

function pad(str, max) {
    return str.length < max ? pad("0" + str, max) : str;
}


function RemoveFacet(key) {

    var o = new Array();
    var d = $j("#ui_element");
    var searchFilters = new Array();
    $j.each(AllFilters, function () {
        if (this.ClientSideHook == "normal") { //TODO: Language Issue
            searchFilters.push(this.DisplayName);
        }
    });

    $j.each(searchFilters, function () {
        var tempFilterName = this;
        var searchToFetch = d.find(".boxme li ." + tempFilterName);
        $j.each(searchToFetch, function () {
            var value = $j(this).text();
            if (value.indexOf("|") > 0) {
                value = value.split("|")[1];
            }
            o.push({
                type: tempFilterName.toString(),
                value: value,
                operation: ($j(this).prev() && $j(this).prev().prev().attr('class')) ? $j(this).prev().prev().attr('class').replace('booleanOperation ', '') : 'must'
            });
        });
    });

    var dateFilters = new Array();
    $j.each(AllFilters, function () {
        if (this.ClientSideHook == "date") { //TODO: Language Issue
            dateFilters.push(this.DisplayName);
        }
    });

    $j.each(dateFilters, function () {
        var tempFilterName = this;
        var searchToFetch = d.find(".boxme li ." + tempFilterName + "hidden");
        $j.each(searchToFetch, function () {
            o.push({
                type: tempFilterName.toString(),
                value: $j(this).text(),
                operation: ($j(this).prev() && $j(this).prev().prev().attr('class')) ? $j(this).prev().prev().attr('class').replace('booleanOperation ', '') : 'must'
            });
        });
    });

    var tagSplit = new Array();
    $j.each(AllFilters, function () {
        if (this.ClientSideHook == "id") { //TODO: Language Issue
            tagSplit.push(this.DisplayName);
        }
    });

    $j.each(tagSplit, function () {
        var tempFilterName = this;
        var searchToFetch = d.find(".boxme li ." + tempFilterName);
        $j.each(searchToFetch, function () {
            o.push({
                type: tempFilterName,
                value: $j(this).parent().attr("title").split("|")[1],
                operation: ($j(this).prev() && $j(this).prev().prev().attr('class')) ? $j(this).prev().prev().attr('class').replace('booleanOperation ', '') : 'must'
            });
        });
    });

    var customSort = d.find(".boxme li .sort");
    $j.each(customSort,
        function () {
            o.push({
                type: "sort",
                value: $j(this).text(),
                operation: $j(this).prev().hasClass('desc') ? "desc" : "asc"
            });
        });

    var p = d.find(".addition").val();

    if (p != null && p != "" && p != TextBoxDefaultText) {
        o.push({
            type: "text",
            value: p,
            operation: "must"
        });
    }

    $j("#loadingSection").prepend('<div id="ajaxBusy"><p><img src="images/loading.gif"></p></div>');
    $j("#ajaxBusy").css({
        margin: "0px auto"
    });

    retrieveFilters();

    if (CurrentFacetFilter.length == 0) {
        CurrentFacetFilter = o;
        $j.each(CurrentFacetFilter, function (i) {
            if (CurrentFacetFilter[i] != null || CurrentFacetFilter[i] != undefined) {
                if (CurrentFacetFilter[i].value === key) CurrentFacetFilter.splice(i, 1);
            }
        });

    } else {
        o = o.concat(CurrentFacetFilter);
        CurrentFacetFilter = o;
        $j.each(CurrentFacetFilter, function (i) {
            if (CurrentFacetFilter[i] != null || CurrentFacetFilter[i] != undefined) {
                if (CurrentFacetFilter[i].value === key) CurrentFacetFilter.splice(i, 1);
            }
        });
    }

    OnlyFacets = $j.grep(CurrentFacetFilter, function (e) { return e.type == "custom"; });

    if (CurrentView != "list" && CurrentView != "grid" && CurrentView != "") {
        runQuery(o, 0, h, g);
        runFacet(o, 0, meme, g);
    } else if (CurrentView == "grid") {
        runQuery(o, 0, h, g);
        runFacet(o, 0, meme, g);

        $j(".navAlpha").html("");
        $j(".slide-out-div").html("").prepend(LoadGifText);
        $j("#ajaxBusyFacet").css({
            margin: "0px auto",
            width: "44px"
        });
    } else {
        runQuery(o, 0, OnComplete, OnFail);
        runFacet(o, 0, meme, g);
    }

    $j(".navAlpha").html("");
    $j(".slide-out-div").html("").prepend(LoadGifText);
    $j("#ajaxBusyFacet").css({
        margin: "0px auto",
        width: "44px"
    });

    if (window.currentBucketsViewType == window.dataSourceViewType) {
        BindItemResultDatasource();
    }
}

function meme(a) {
    $j(".navAlpha").html("");
    $j(".slide-out-div").show().html("").prepend(LoadGifText);

    $j("#ajaxBusyFacet").css({
        margin: "0px auto",
        width: "44px"
    });

    if (OnlyFacets != undefined) {
        if (OnlyFacets.length > 0) {
            var facetList = '<div class="side"><div class="sb_filter toggleon">' + currentFilters + '</div><div><ul>';
            $j.each(OnlyFacets,
                function () {
                    var displayValue = this.value.split('|');
                    if (displayValue.length > 1) {
                        displayValue = this.value.split('|')[1];
                    } else {
                        displayValue = this.value.split('|')[0];
                    }
                    facetList += '<li class="filter"><a href=\"#\" onclick="javascript:RemoveFacet(\'' + this.value + '\');" title="' + this.value + '" class="facetClick" style="color:red;">' + (displayValue.length > 16 ? (displayValue.substring(0, 16) + "...") : displayValue) + "</a><a href=\"javascript:void(0)\" onclick=\"javascript:RemoveFacet('" + this.value + "');\"> (x) </a></li>";
                });
            facetList += "</ul></div></div>";
            $j(".navAlpha").append(facetList);
        }
    }
    jQuery.each(a.facets,
         function (index) {
             if (typeof (this[0]) != 'undefined') {

                 var b = '<div class="side"><div class="sb_filter ' + (index > 4 ? "toggleoff" : "toggleon") + '">' + this[0].DisplayName + "</div><div " + (index > 4 ? "style=\"display:none\"" : "") + "><ul>";

                 $j.each(this,
                     function () {
                         var cleanString = this.Template;
                         cleanString = cleanString.replace("\\", "~");
                         b += '<li class="filter"><a href="javascript:void(0);" title="' + this.KeyName + '" class="facetClick" onclick="javascript:AppendFacet(\'' + this.ID + "','" + cleanString + "','" + this.Custom + "');\">" + (this.KeyName.length > 16 ? (this.KeyName.substring(0, 16) + "...") : this.KeyName) + " (" + this.Value + ")" + "</a></li>";
                     });

                 b += "</ul></div></div>";
                 $j(".navAlpha").append(b);
             }
         });

    $j("#ajaxBusyFacet").css({
        display: "none",
        margin: "0px auto",
        width: "24px"
    });

    $j(".side .sb_filter").bind('click',
          function () {
              if ($j(this).hasClass('toggleon')) {
                  $j(this).removeClass('toggleon').addClass('toggleoff');
              } else if ($j(this).hasClass('toggleoff')) {
                  $j(this).removeClass('toggleoff').addClass('toggleon');;
              }

              $j(this).next("div").slideToggle(100);
          });

    $j(this).removeClass("pageClickLoad");

    if ($j(".navAlpha .side").length == 0) {
        var b = '<div class="side"><div class="sb_filter">' + NoFacetsFound + "</div><div><ul></ul></div></div>";
        $j(".navAlpha").append(b);


    };
}

function AppendFacet(b, c, custom) {
    var facetFilters = b.split(',');
    var filterValues = c.split('/');
    var o = new Array();
    FacetOn = true;

    for (var i = 0; i < facetFilters.length; i++) {
        var tempValue = filterValues[i];
        if (custom != '') {
            tempValue = tempValue.replace(custom.split(",")[1], custom.split(",")[0]);
        }

        if (filterValues[i].indexOf("|") > 0) {
            tempValue = filterValues[i].split("|")[1];
        }

        o.push({
            type: "custom",
            value: facetFilters[i] + "|" + tempValue,
            operation: "must"
        });
    }

    var d = $j("#ui_element");

    var searchFilters = new Array();
    $j.each(AllFilters, function () {
        if (this.ClientSideHook == "normal") { //TODO: Language Issue
            searchFilters.push(this.DisplayName);
        }
    });


    $j.each(searchFilters, function () {
        var tempFilterName = this;
        var searchToFetch = d.find(".boxme li ." + tempFilterName);

        $j.each(searchToFetch, function () {
            var value = $j(this).text();
            if (value.indexOf("|") > 0) {
                value = value.split("|")[1];
            }
            o.push({
                type: tempFilterName.toString(),
                value: value,
                operation: ($j(this).prev() && $j(this).prev().prev().attr('class')) ? $j(this).prev().prev().attr('class').replace('booleanOperation ', '') : 'must'
            });
        });
    });

    var dateFilters = new Array();
    $j.each(AllFilters, function () {
        if (this.ClientSideHook == "date") { //TODO: Language Issue
            dateFilters.push(this.DisplayName);
        }
    });

    $j.each(dateFilters, function () {
        var tempFilterName = this;
        var searchToFetch = d.find(".boxme li ." + tempFilterName + "hidden");
        $j.each(searchToFetch, function () {
            o.push({
                type: tempFilterName.toString(),
                value: $j(this).text(),
                operation: ($j(this).prev() && $j(this).prev().prev().attr('class')) ? $j(this).prev().prev().attr('class').replace('booleanOperation ', '') : 'must'
            });
        });
    });

    var tagSplit = new Array();
    $j.each(AllFilters, function () {
        if (this.ClientSideHook == "id") { //TODO: Language Issue
            tagSplit.push(this.DisplayName);
        }
    });

    $j.each(tagSplit, function () {
        var tempFilterName = this;
        var searchToFetch = d.find(".boxme li ." + tempFilterName);
        $j.each(searchToFetch, function () {
            o.push({
                type: tempFilterName,
                value: $j(this).parent().attr("title").split("|")[1],
                operation: ($j(this).prev() && $j(this).prev().prev().attr('class')) ? $j(this).prev().prev().attr('class').replace('booleanOperation ', '') : 'must'
            });
        });
    });

    var customSort = d.find(".boxme li .sort");
    $j.each(customSort,
        function () {
            o.push({
                type: "sort",
                value: $j(this).text(),
                operation: $j(this).prev().hasClass('desc') ? "desc" : "asc"
            });
        });

    var p = d.find(".addition").val();

    if (p != null && p != "" && p != TextBoxDefaultText) {
        o.push({
            type: "text",
            value: p,
            operation: "must"
        });
    }

    $j("#loadingSection").prepend('<div id="ajaxBusy"><p><img src="images/loading.gif"></p></div>');
    $j("#ajaxBusy").css({
        margin: "0px auto"
    });

    retrieveFilters();

    if (CurrentFacetFilter.length == 0) {
        CurrentFacetFilter = o;
    } else {
        o = o.concat(CurrentFacetFilter);

        var newArray = new Array();
        for (var i = 0; i < o.length; i++) {
            var result = $j.grep(newArray, function (e) { return e.type == o[i].type && e.value == o[i].value && e.operation == o[i].operation; });

            if (result.length == 0) {
                newArray.push({
                    "type": o[i].type, "value": o[i].value, "operation": o[i].operation
                });
            }
        }

        CurrentFacetFilter = newArray;

        o = newArray;
    }

    OnlyFacets = $j.grep(CurrentFacetFilter, function (e) { return e.type == "custom"; });

    if (CurrentView != "list" && CurrentView != "grid" && CurrentView != "") {
        runQuery(o, 0, h, g);
        runFacet(o, 0, meme, g);
    } else if (CurrentView == "grid") {
        runQuery(o, 0, h, g);
        runFacet(o, 0, meme, g);

        $j(".navAlpha").html("");
        $j(".slide-out-div").html("").prepend(LoadGifText);
        $j("#ajaxBusyFacet").css({
            margin: "0px auto",
            width: "44px"
        });
    } else {
        runQuery(o, 0, OnComplete, OnFail);
        runFacet(o, 0, meme, g);
    }

    $j(".navAlpha").html("");
    $j(".slide-out-div").html("").prepend(LoadGifText);
    $j("#ajaxBusyFacet").css({
        margin: "0px auto",
        width: "44px"
    });

    if (window.currentBucketsViewType == window.dataSourceViewType) {
        BindItemResultDatasource();
    }
}

function OnFail(a) {
    $j("#results").html("").append('<div style="padding-bottom: 20px;text-align: center;padding-right: 85px;">' + ErrorMessage + '</div>');
    $j(".errortip").fadeIn().delay(4000).fadeOut();
}

function OnComplete(a) {
    $j("#ajaxBusy").css({
        display: "none",
        margin: "0px auto"
    });

    $j("#results").html("");
    $j("#resultInfoMessage").empty();
    $j("#resultInfoMessage").append(resultInfoMessage.scFormat(a.SearchCount, a.SearchTime, a.Location));
    if ($j("#grid-content").hasClass('mainmargin')) {
        var htmlGridView = renderGridView(a);
        $j("#results").append(htmlGridView);

        $j(".pagination").remove();
        window.scPageAmount = a.PageNumbers;
        var e = renderPagination(a.CurrentPage);
        $j(".selectable").append(e);
        $j("#results").fadeIn("slow");

        $j("#ajaxBusy").hide();
    } else {
        $j(".pagination").remove();
        $j("#results").append('<div id="resultAppendDiv" style="overflow: auto; height: auto;"><ul>');
        parseResults(a);

        $j("#results").append("</ul></div>");
        $j(".pagination").remove();
        window.scPageAmount = a.PageNumbers;
        e = renderPagination(a.CurrentPage);
        $j(".selectable").append(e);

    }

    $j("#ajaxBusyFacet").css({
        display: "none",
        margin: "0px auto",
        width: "24px"
    });
}

function renderGridView(data) {
    var htmlData = '<div class="mainmargin" id="grid-content" style="position: relative; width: 100%;overflow-x: hidden; overflow-y: hidden;">';
    $j.each(data.items,
        function () {
            var ifTemplateIcon = this.ImagePath.indexOf('~/icon/') == 0;
            var imageWidth = ifTemplateIcon ? "32" : "142";
            var imageHeight = ifTemplateIcon ? "32" : "100";
            var resizeTemplateIcon = ifTemplateIcon ? " style=\"padding: 37px 54px 37px 60px;\"" : "";
            var languageCount = this.Languages.length;

            if ($j.browser.msie) {
                this.Content = '';
            }

            var template = '<div onclick="{0}" class="post_float rounded" title="' + nameStub + this.Name + contentStub + (this.Content.length > 180 ? (this.Content.substring(0, 180) + "...") : this.Content) + '" style="' + Meta(this) + '"><a class="ceebox imgcontainer" title="' + this.Name + '" href="#" onclick="{0}"><img onerror="this.onerror=null;this.src=\'../Buckets/images/default.jpg\';" width="{1}" height="{2}" src="' + this.ImagePath + '?w={1}&h={2}&db=master" {3} class="attachment-post-thumbnail wp-post-image" alt="' + this.Name + '" title="' + this.Name + ' - ' + this.Path + '" /></a><h2><a class="ceebox" title="' + this.Name + '" href="" onclick="{0}">' + this.Name + '</a></h2><div class="post_tags"> <strong>' + templateStub + ': </strong>' + this.TemplateName + ' <strong>' + locationStub + ': </strong>' + this.Bucket + "<br/><p>" + (this.Content.length > 20 ? (this.Content.substring(0, 20) + "...") : this.Content) + "</p> " + (versionStub + ": ").bold() + this.Version + ("<br/> " + createdStub + ": ").bold() + this.CreatedDate.substring(0, 10) + " <strong><br/>" + byStub + ": </strong> " + this.CreatedBy + ' <strong> ' + languageStub + ': </strong> ' + this.Language + "<br/></div></div>";
            switch (window.currentBucketsViewType) {
                case window.rteViewType:
                    htmlData += template.scFormat(' toggleSelected(this); scClose(\'~/link.aspx?_id=' + this.ItemId.replace(/{/g, "").replace(/}/g, "").replace(/-/g, "") + '&amp;_z=z\', \'' + this.Name + '\'); return false;', imageWidth, imageHeight, resizeTemplateIcon);
                    break;
                case window.dialogViewType:
                case window.dataSourceViewType:
                    htmlData += template.scFormat('BindItemResult(\'' + this.ItemId + '\'); toggleSelected(this);return false;', imageWidth, imageHeight, resizeTemplateIcon);
                    break;
                case window.mediaViewType:
                    htmlData += template.scFormat('BindItemResult(\'' + this.Path + '\'); toggleSelected(this); return false;', imageWidth, imageHeight, resizeTemplateIcon);
                    break;
                case window.fieldViewType:
                    htmlData += template.scFormat('saveFieldValue(\'' + this.ItemId + '\'); toggleSelected(this);return false;', imageWidth, imageHeight, resizeTemplateIcon);
                    break;
                default:
                    var onClick = 'scForm.getParentForm().postRequest(\'\',\'\',\'\',\'' + data.launchType + '(url=' + this.ItemId + ', la=' + this.Language + ')\'); return false;';
                    htmlData += template.scFormat(onClick, imageWidth, imageHeight, resizeTemplateIcon, (languageCount > 1) ? ' (' + languageCount + ')' : '');
            }
        });

    return htmlData + '</div>';
}

function toggleSelected(element) {

    $j('.post_float, .BlogPostArea').removeClass("highlight");
    $j(element).addClass("highlight");
}

function showTip() {
    $j(".hastip").stop(true).hide().fadeIn(400, function () {
        $j(".hastip").fadeOut(4000);
    });
}

function ResolveSearches(query) {
    var searchArray = [];
    var searchList = query.split(';');

    for (var i = 0; i < searchList.length; i++) {
        var ss = searchList[i].split(':');
        if (ss != "") {
            searchArray.push(ss[0]);
            if (ss.length > 1) {
                searchArray.push(ss[1]);
            }
        }
    }
    return searchArray;
}

$j.fn.outerHTML = function (a) {
    return a ? this.before(a).remove() : $j("<p>").append(this.eq(0).clone()).html();
};

function InnerItem(a) {
    return a.IsClone ? "35px;opacity:0.4;" : "0px;";
}

$j.fn.outerHTML = function (a) {
    return a ? this.before(a).remove() : $j("<p>").append(this.eq(0).clone()).html();
};

function h(a) {
    var mode = detectViewMode();
    $j("#results").html("");
    //.append(resultInfoMessage.scFormat(a.SearchCount, a.SearchTime, a.Location))

    var modeObject;
    jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetView",
        data: "{'viewName' : '" + mode + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (serverResponse) {
            modeObject = serverResponse.d;
            var b = "";
            if (modeObject != undefined && modeObject.HeaderTemplate != "") {

                b = b + modeObject.HeaderTemplate;
                $j.each(a.items,
                    function (serverItem) {
                        if (a.items != 0) {
                            var templateFiller = this.TemplateName;
                            var metaFiller = Meta(this);
                            var launchTypeFiller = a.launchType;
                            var itemIdFiller = this.ItemId;
                            var imagePathFiller = this.ImagePath;
                            var languagesFiller = this.Languages;
                            var dynamicFields = this.DynamicFields;
                            var nameFiller = this.Name;
                            var bucketFiller = this.Bucket;
                            var contentFiller = (this.Content.length > 140 ? (this.Content.substring(0, 140) + "...") : this.Content);
                            var versionFiller = this.Version;
                            var createdFiller = this.CreatedDate.substring(0, 10);
                            var createdbyFiller = this.CreatedBy;
                            var languageList = '';
                            var pathFiller = this.Path;
                            var updatedFiller = this.Updated;

                            $j.each(this.Languages, function () {
                                languageList = languageList + this + "~";
                            });

                            var templateText = modeObject.ItemTemplate;
                            b = b + templateText.replace(/TemplatePlaceholder/g, templateFiller)
                                .replace(/LanguageCount/g, languagesFiller.length)
                                .replace(/LanguageList/g, languageList)
                                .replace(/NamePlaceholder/g, nameFiller)
                                .replace(/MetaPlaceholder/g, metaFiller)
                                .replace(/LaunchTypePlaceholder/g, launchTypeFiller)
                                .replace(/ItemIdPlaceholder/g, itemIdFiller)
                                .replace(/ImagePathPlaceholder/g, imagePathFiller)
                                .replace(/NamePlaceholder/g, nameFiller)
                                .replace(/BucketPlaceholder/g, bucketFiller)
                                .replace(/PathPlaceholder/g, pathFiller)
                                .replace(/ContentPlaceholder/g, contentFiller)
                                .replace(/VersionPlaceholder/g, versionFiller)
                                .replace(/CreatedPlaceholder/g, createdFiller)
                                .replace(/UpdatedPlaceholder/g, updatedFiller)
                                .replace(/CreatedByPlaceholder/g, createdbyFiller);

                            $j.each(dynamicFields, function (key, value) {
                                var dynamicText = value.Key + 'DynamicPlaceholder'; //TODO: Language Issue
                                var re = new RegExp(dynamicText, "gi");
                                b = b.replace(re, value.Value);
                            });
                        }
                    });

                b = b + modeObject.FooterTemplate;
            } else {
                b += renderGridView(a);
            }

            $j("#results").append(b);
            $j(".pagination").remove();

            window.scPageAmount = a.PageNumbers;

            var e = renderPagination(a.CurrentPage);

            $j(".selectable").append(e);
            $j("#results").fadeIn("slow");
            $j("#ajaxBusy").hide();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            OnFail(xhr);
        }
    });
}

//Error Handler
function g() {
    $j("#ajaxBusy").hide();
}

function renderPagination(currentPage) { //TODO: Language Issue
    if (window.scPageAmount < 2) {
        return '<div class="pagination empty"><div>';
    }

    var c = '<div class="pagination"><ul>';
    var d = Math.floor((currentPage - 1) / maxPageCount) * maxPageCount + 1;
    var e = Math.min(d + maxPageCount - 1, window.scPageAmount);
    if (d > 1) {
        c += '<li class="previous-pages"><a class="pageLink" href="#" onclick="scrollToTop()" data-page="' + (d - 1) + '" ><</a></li>';
    }

    for (var i = d; i <= e; i++) {
        c += "<li " + (i == currentPage ? 'class="active"' : "") + '><a class="pageLink" onclick="scrollToTop()" data-page="' + i + '" href="javascript:void(0)">' + i + "</a></li>";
    }

    if (e < window.scPageAmount) {
        c += '<li class="next-pages"><a class="pageLink" onclick="scrollToTop()" href="#" data-page="' + (e + 1) + '">></a></li>';
    }

    c += "</ul></div>";
    return c;
}

function scrollToTop() {

    $j('html, body').animate({
        scrollTop: $j("#MainPanel").offset().top
    }, 2000);

    return false;

}

function parseResults(resultCallBack) {
    $j.each(resultCallBack.items,
        function () {
            if (this.Name != null) {
                var mediaCommand = "";
                var languageList = "";
                var actionList = "";
                var version = this.Version;
                var itemId = this.ItemId;
                var language = this.Language;

                if (this.Languages != null || this.Languages != undefined) {
                    if (this.Languages.length > 0) {
                        $j.each(this.Languages, function () {
                            languageList += "<span style=\"font-weight:bold;background: url(\'" + this.split('|')[1] + "\') no-repeat left center;padding-left:25px;background-size:16px 16px;background-position-x: 6px;background-position-y: 5px;\"><a href=\"\" onclick=\"scForm.browser.clearEvent(event || window.event, true);scForm.getParentForm().postRequest('','','','" + resultCallBack.launchType + "(url=" + itemId + ", la=" + this.split('|')[0] + ", version=" + version + ")'); return false;\">" + this.split('|')[0] + "</a></span>";
                        });
                    }
                }
                $j.each(this.QuickActions, function () {
                    var clickHandler = "scForm.getParentForm().postRequest('', '', '', '" + this.split('|')[0] + "(id=" + itemId + ", language=" + language + ", version=" + version + ")');return false;";
                    actionList += "<span style=\"font-weight:bold;background: url(\'~/icon/Software/16x16/breakpoint.png\') no-repeat left center;padding-left:25px;background-size:16px 16px;background-position-x: 6px;background-position-y: 5px;\"><a href=\"\" onclick=\"scForm.browser.clearEvent(event || window.event, true);" + clickHandler + "\">" + this.split('|')[1] + "</a></span>";
                });

                $j.each(this.DynamicQuickActions, function () {
                    var clickHandler = "scForm.getParentForm().postRequest('', '', '', '" + this.split('|')[0] + "'); return false;";
                    actionList += "<span style=\"font-weight:bold;background: url(\'~/icon/Software/16x16/breakpoint.png\') no-repeat left center;padding-left:25px;background-size:16px 16px;background-position-x: 6px;background-position-y: 5px;\"><a href=\"\" onclick=\"scForm.browser.clearEvent(event || window.event, true);" + clickHandler + "\">" + this.split('|')[1] + "</a></span>";
                });

                var ifTemplateIcon = this.ImagePath.indexOf('~/icon/') == 0;
                var imageWidth = ifTemplateIcon ? "32" : "80";
                var imageHeight = ifTemplateIcon ? "32" : "60";

                if ($j.browser.msie) {
                    imageWidth = "40";
                    imageHeight = "40";
                }
                var resizeTemplateIcon = ifTemplateIcon ? ' style="padding: 15px 21px 11px 16px;margin-left: 10px;"' : "";

                var template = '<li id="' + this.ItemId + '" class="BlogPostArea" onclick="{0}" style="margin-left:' + InnerItem(this) + '"><div class="BlogPostViews">' + '<a class="ceebox imgcontainer"  title="" href="#"  onclick="{0}"><img width="' + imageWidth + '" onerror="this.onerror=null;this.src=\'../Buckets/images/default.jpg\';" height="' + imageHeight + '" src="' + this.ImagePath + '?w=' + imageWidth + '&h=' + imageHeight + '&db=master" ' + resizeTemplateIcon + '  class="attachment-post-thumbnail wp-post-image" alt="' + this.Name + '" title="' + this.Name + ' - ' + this.Path + '" /></a></div><h5 class="BlogPostHeader"><a href="javascript:void(0);" onclick="{0}">' + this.Name + '</a><span title="This item has ' + (this.Languages.length > 1 ? "" + this.Languages.length + " languages" : " 1 language") + '">' + (this.Languages.length > 1 ? "(" + this.Languages.length + ")" : "") + '</span></h5><div class="BlogPostContent"><strong>' + templateStub + ': </strong>' + this.TemplateName + ' <strong>' + locationStub + ': </strong>' + this.Bucket + '</div><div class="BlogPostFooter">' + (this.Content.length > 250 ? (this.Content.substring(0, 250) + "...") : this.Content) + ' <div><strong>' + versionStub + ': </strong>' + this.Version + ' <strong>' + createdStub + ': </strong>' + this.CreatedDate.substring(0, 10) + ' <strong> ' + byStub + ': </strong> ' + this.CreatedBy + ' <strong> ' + languageStub + ': </strong> ' + this.Language + ' </div><div></div><div class="quickactions" onclick="scForm.browser.clearEvent(event || window.event, true);">' + actionList + mediaCommand + languageList + '</div></li>';

                switch (window.currentBucketsViewType) {
                    case window.rteViewType:
                        var resultStr = template.scFormat('toggleSelected(this); scClose(\'~/link.aspx?_id=' + this.ItemId.replace(/{/g, "").replace(/}/g, "").replace(/-/g, "") + '&amp;_z=z\', \'' + this.Name + '\'); return false;');
                        break;
                    case window.dialogViewType:
                    case window.dataSourceViewType:
                        resultStr = template.scFormat('BindItemResult(\'' + this.ItemId + '\');toggleSelected(this);');
                        break;
                    case window.mediaViewType:
                        resultStr = template.scFormat('BindItemResult(\'' + this.Path + '\');toggleSelected(this);');
                        break;
                    case window.fieldViewType:
                        resultStr = template.scFormat('saveFieldValue(\'' + this.ItemId + '\'); toggleSelected(this);return false;');
                        break;
                    default:
                        resultStr = template.scFormat('scForm.getParentForm().postRequest(\'\',\'\',\'\',\'' + resultCallBack.launchType + '(url=' + this.ItemId + ', la=' + this.Language + ')\'); return false;');
                }

                $j("#results").append(resultStr);
            }
            else {
                var blur = this.Path == null ? true : false;
                if (blur) {
                    var template = '<li id="' + noValue + '" class="BlogPostArea" onclick="{0}" style="-webkit-filter: grayscale(0.5) blur(10px);margin-left:' + "" + '"><div class="BlogPostViews">' + '<a class="ceebox imgcontainer"  title="" href="#"  onclick="{0}"><img width="' + "32" + '" onerror="this.onerror=null;this.src=\'../Buckets/images/default.jpg\';" height="' + "32" + '" src="' + "" + '?w=' + "32" + '&h=' + "32" + '&db=master" ' + "" + '  class="attachment-post-thumbnail wp-post-image" alt="' + "" + '" title="' + "" + '" /></a></div><h5 class="BlogPostHeader"><a href="javascript:void(0);" onclick="{0}">' + noValue + '</a><span title="">' + noValue + '</span></h5><div class="BlogPostContent"><strong>' + noValue + ': </strong>' + noValue + ' <strong>' + noValue + ': </strong>' + noValue + '</div><div class="BlogPostFooter">' + noValue + ' <div><strong>' + noValue + ': </strong>' + noValue + ' <strong>' + noValue + ': </strong>' + noValue + ' <strong> ' + noValue + ': </strong> ' + noValue + ' </div><div></div><div class="quickactions" onclick="scForm.browser.clearEvent(event || window.event, true);">' + noValue + '</div></li>';
                }

                $j("#results").append(template);


            }

        });
}


function c(resultCallBack) {
    $j("#results").html("");
    $j(".pagination").remove();
    $j("#results").append('<div id="resultAppendDiv" style="overflow: auto; height: auto;"><ul>');
    $j("#resultInfoMessage").empty();
    $j("#resultInfoMessage").append(resultInfoMessage.scFormat(resultCallBack.SearchCount, resultCallBack.SearchTime, resultCallBack.Location));

    parseResults(resultCallBack);

    $j("#results").append("</ul></div>");

    $j('.selectable')[0].style.zoom = 1.02;
    setTimeout(function () { $j('.selectable')[0].style.zoom = 1; }, 0);

    $j(".pagination").remove();
    window.scPageAmount = resultCallBack.PageNumbers;
    var currentPage = resultCallBack.CurrentPage;
    var e = renderPagination(currentPage);
    $j(".selectable").append(e);

    if (!$j.browser.msie) {
        $j(".handle").css("right", "-52px");
    }

    $j("#ajaxBusy").hide();
}

$j(function () {

    var a = $j("#ui_element");
    if (a.find(".addition").val().length <= 0 && $j('.boxme').children('li').length <= 1) {
    } else {
        if (!$j.browser.msie) {

            $j(".addition").css("font-style", "normal").css("opacity", "1.0");
        }
    }
    if (!$j.browser.msie) {

        a.find(".addition").bind("focus",
            function () {
                if ((a.find(".addition").val().length > 0) || ($j('.boxme').children('li').length > 1) || (a.find(".addition").text().length > 0)) {
                    if ($j(".addition").val().indexOf(TextBoxDefaultText) > -1) {
                        var tempAddition = $j(".addition").val().replace(TextBoxDefaultText, "");
                        $j(".addition").val(tempAddition).css("font-style", "italic").css("opacity", "0.3");


                    }
                } else {
                    $j(".addition").css("font-style", "normal").css("opacity", "1.0");
                }

                a.find(".boxme").addClass("myInputbox");
                $j('.content').css({ 'opacity': 1.0 });

            });

        a.find(".addition").bind("blur",
            function () {
                if ((a.find(".addition").val().length <= 0) && $j('.boxme').children('li').length <= 1 && (a.find(".addition").text().length <= 0)) {
                } else {
                    $j(".addition").css("font-style", "normal").css("opacity", "1.0");
                }

                a.find(".boxme").removeClass("myInputbox");
            });
    }

    function convertSearchQuery() {

        retrieveFilters();

    }

    function parseSearchForQuery() {
        var u = buildQuery();
        u = u.concat(OnlyFacets);
        var returnString = "";

        $j.each(u, function () {
            var boolOperation;
            if (this.operation == 'must') {
                boolOperation = "(must)";
            } else if (this.operation == 'not') {
                boolOperation = "(not)";
            } else {
                boolOperation = "";
            }
            returnString = returnString + boolOperation + this.type + ":" + this.value + ";";
        });

        return returnString;
    }

    $j(".SearchOperation").live("click", function () {
        if ((!$j('.addition').val().replace(/\s/g, '').length && $j('.boxme').children('li').length <= 1) || $j('.addition').val() == TextBoxDefaultText) {
            alert(searchOperationMessage);
            return false;
        }
        else {
            window.scForm.getParentForm().postRequest('', '', '', this.id + '(url="' + parseSearchForQuery() + '")');
            return false;
        }
    });

    a.find(".addition").live("keydown", function (b) {
        var d = b.keyCode || b.which;
        if (d == 13) {
            FacetOn = false;
            CurrentFacetFilter = [];
            OnlyFacets = [];
            if (CurrentView != "") {
                retrieveFilters();
                $j("." + CurrentView).click();
            } else {
                b.preventDefault();
                $j(".sb_dropdown").hide();
                pageNumber = 0;
                $j("#ajaxBusy").css({ display: "block" });

                retrieveFilters();
                var u = buildQuery();
                runQuery(u, pageNumber, c, g);
                runFacet(u, pageNumber, meme, g);
                $j(".navAlpha").html("");
                $j(".slide-out-div").html("").prepend(LoadGifText);
                $j("#ajaxBusyFacet").css({
                    margin: "0px auto",
                    width: "44px"
                });
            }
        }

    });

    $j(".sb_search_container").click(function () {
        if (!$j.browser.msie) {

            a.find(".addition").focus();
        }
    });

    function toggleDropDown() {
        a.find(".sb_down").addClass("sb_up").removeClass("sb_down");
        jQuery.ajax({
            type: "POST",
            url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/RunLookup",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: runLookupSuccessHandler
        });
    }

    function runLookupSuccessHandler(responseData) {
        $j(".command, .topsearch").die("click");
        var c = responseData.d;
        var e = "";
        $j.each(c, function () {
            var showMe = this.Name.replace(" ", "");
            showMe = showMe.replace(" ", "");
            var imgTemplate = '<img src="{0}" class="searchFilterIcon">';
            var img = imgTemplate.scFormat(this.Icon);

            var commandType = this.Command;

            e += '<div title="' + clickToLoad + '" class="sb_filter recent ' + showMe + '" style="font-weight:bold;">' + img + this.Name + ' - <span style="font-size:12px;">' + this.DisplayText + '</span></div><div class="' + showMe + 'body" style="display:none"></div>';
            $j("." + showMe).die("click");
            $j("." + showMe).live('click',
                function () {
                    var toggled = $j("." + showMe).next("." + showMe + "body").is(":visible");
                    if (!toggled) {
                        jQuery.ajax({
                            type: "POST",
                            url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GenericCall",
                            data: "{'ServiceName' : '" + showMe + "'}",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (b) {
                                var c = b.d;
                                c = c.toString().split(",");
                                var e = "";
                                var scope = this;
                                $j.each(c, function () {
                                    if (this != "") {



                                        var template = '<li><a href="javascript:void(0);" onclick="{0}" id="{1}" title="{3}" class="{4}">{2}</a></li>',
                                            classValue = 'command ' + commandType,
                                            id = '',
                                            click = '';
                                        if (commandType == "id") {
                                            var title = clickToLaunchItem;
                                            var imgTemp = 'images/pin.png';
                                            if (this.split('|').length == 3) {
                                                if (this.split('|')[2].indexOf('/') == 0) {
                                                    imgTemp = this.split('|')[2];
                                                } else {
                                                    imgTemp = this.split('|')[2];
                                                }
                                            }
                                            img = imgTemplate.scFormat(imgTemp);
                                            template = template.scFormat('{0}', '{1}', '{2}', '{3}', classValue);


                                            if (this.indexOf('sed Tab') > 0) { //TODO: Language Issue
                                                var splitMe = this.replace("Closed Tabs (", "").replace(")").split("|");
                                                var textValue = splitMe[0].length > 40 ? (splitMe[0].substring(0, 40) + '...') : splitMe[0];
                                                id = splitMe[1];
                                                click = 'javascript:launchMultipleTabs("' + splitMe + '")';
                                                title = clickToLaunchItem + ' ' + this;
                                                e += template.scFormat(click, id, img + textValue, title);
                                            } else {
                                                splitMe = this.split("|");
                                                if (splitMe == undefined) {
                                                    e += template.scFormat();
                                                } else {
                                                    id = splitMe[1];
                                                    textValue = splitMe[0].length > 40 ? (splitMe[0].substring(0, 40) + '...') : splitMe[0];
                                                    var innerHTML = img + textValue;
                                                    switch (window.currentBucketsViewType) {
                                                        case window.rteViewType:
                                                            click = 'scClose(\'~/link.aspx?_id=' + splitMe[1].replace(/{/g, "").replace(/}/g, "").replace(/-/g, "") + '&amp;_z=z\', \'' + this.Name + '\'); return false;';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                            break;
                                                        case window.dialogViewType:
                                                            click = 'BindItemResult(\'' + splitMe[1] + '\'); $j(\'.BlogPostViews\').removeClass(\'BlogPostViewsSelected\'); $j(this).parent().toggleClass(\'BlogPostViewsSelected\'); return false;';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                            break;
                                                        case window.mediaViewType:
                                                            click = 'BindItemResult(\'' + GetItemPathFromMediaLibrary(splitMe[1]) + '\');';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                            break;
                                                        case window.fieldViewType:
                                                            click = 'saveFieldValue(\'' + splitMe[1] + '\'); return false;';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                            break;
                                                        default:
                                                            click = 'scForm.getParentForm().postRequest(\'\',\'\',\'\',\'contenteditor:launchtab(url=' + splitMe[1] + ')\'); return false;';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                    }
                                                }
                                            }
                                        } else if (commandType == "operations") {
                                            id = this.split("|")[0].toString().replace(/\s/g, '');
                                            classValue = 'SearchOperation ' + this.split('|')[0].toString().replace(/\s/g, '');
                                            img = imgTemplate.scFormat(this.split("|")[1]);
                                            textValue = this.split("|")[2].length > 40 ? (this.split('|')[2].substring(0, 40) + '...') : this.split('|')[2];
                                            title = clickToRunOperation;

                                            e += template.scFormat(click, id, img + textValue, title, classValue);
                                        } else if (commandType == "text") {
                                            textValue = this;
                                            title = clickToSearch;

                                            e += template.scFormat(click, id, img + textValue, title, classValue);
                                        } else {
                                            img = imgTemplate.scFormat(this.split("|")[2]);
                                            textValue = this.split("|")[1].length > 40 ? (this.split("|")[1].substring(0, 40) + '...') : this.split('|')[1];
                                            title = clickToLaunch + '' + this.split("|")[0];

                                            e += template.scFormat(click, id, img + textValue, title, classValue);
                                        }
                                    }
                                });

                                $j("." + showMe + "body").html("").append(e).show();
                                $j(".command").first().attr("id", "keySelect");
                            }
                        });
                    } else {
                        $j("." + showMe).next("." + showMe + "body").toggle('slow');
                    }
                });
        });
        $j(".command, .topsearch").live("click",
                        function () {
                            if (this.className.indexOf("id") > -1) {
                            } else {
                                var listOfSearches;
                                if (this.className.indexOf("text") > -1) {
                                    if ($j.browser.mozilla) {
                                        listOfSearches = ResolveSearches(this.text);
                                    }
                                    else {
                                        listOfSearches = ResolveSearches(this.outerText);
                                    }
                                }
                                else {
                                    listOfSearches = ResolveSearches(this.title.replace(clickToLaunch, "").replace(new RegExp(",", 'g'), ""));
                                }
                                $j(".addition").val("");
                                if (listOfSearches.length == 1) {
                                    $j(".addition").val(listOfSearches[0]).focus().val($j(".addition").val() + ":");
                                    var press = jQuery.Event("keyup");
                                    press.shiftKey = true;
                                    press.which = 58;
                                    $j(".addition").trigger(press);
                                } else {
                                    for (var i = 0; i < listOfSearches.length; i = i + 2) {
                                        if (listOfSearches[i + 1] != "") {
                                            var split;
                                            if ($j.browser.msie) {
                                                split = this.innerText.split(':');
                                            }
                                            else {
                                                split = this.text.split(':');
                                            }
                                            var childCheck = $j(".boxme").children(".token-input-token-facebook").children('.' + split[0]);
                                            if (childCheck.text().indexOf(split[1].replace(';', '')) < 0) {
                                                $j(".boxme").prepend('<li class="token-input-token-facebook" title="' + listOfSearches[i + 1] + '"><span title="' + changeSearchLogic + '" style="background: url(\'images/' + listOfSearches[i] + '.gif\') no-repeat center center;padding: 0px 11px;"></span><span style="text-overflow: ellipsis;color:black;max-width: 411px;overflow: hidden;vertical-align:top;" class="' + listOfSearches[i] + '">' + listOfSearches[i + 1] + '</span><span class="token-input-delete-token-facebook remove" title="' + removeSearchTerm + '">×</span></li>');
                                                $j(".remove").live("click",
                                                    function () {
                                                        $j(this).parents("li:first").remove();
                                                        $j(".addition").focus();
                                                    });
                                            }
                                        }
                                    }
                                }
                            }
                        });
        $j(".sb_dropdown").html("").append(e).show();
        $j(".sb_dropdown").children().first(".sb_filter.recent").attr("id", "keySelect");
    }

    function toggleDropDownUp() {
        if ($j(".sb_dropdown").is(":hidden")) {
            a.find(".sb_down").click();
        } else {
            $j(".sb_dropdown").stop(true, true);
            $j(".sb_dropdown").hide();
            a.find(".sb_up").addClass("sb_down").removeClass("sb_up");
        }
    };

    $j(".sb_down, .sb_up").toggle(toggleDropDown, toggleDropDownUp);

    $j(".sb_search").click(function () {
        FacetOn = false;
        CurrentFacetFilter = [];
        OnlyFacets = [];
        if (CurrentView != "") {
            $j("." + CurrentView).click();
        } else {
            runClick();
        }
    });

    function runClick() {
        if ((a.find(".addition").val().length > 0) || $j('.boxme').children('li').length > 1) {
            $j('.sb_clear').css({ display: 'inline' });
            $j(".boxme").css({ width: "91%" });
        }

        pageNumber = 0;
        $j('.content').css({ 'opacity': 1.0 });

        $j(".grid").removeClass("active");
        $j(".list").addClass("active");
        $j("#ajaxBusy").css({ display: "block" });

        var n = buildQuery();
        retrieveFilters();
        runQuery(n, pageNumber, c, g);
        runFacet(n, pageNumber, meme, g);

        a.find(".sb_up").click();
        $j(".navAlpha").html("");
        $j(".slide-out-div").html("").prepend(LoadGifText);
        $j("#ajaxBusyFacet").css({
            margin: "0px auto",
            width: "44px"
        });
    }

    $j(".list").click(function () {
        FacetOn = false;
        CurrentView = "list";
        CurrentFacetFilter = [];
        OnlyFacets = [];
        $j("#views a").removeClass('active');
        runClick();

    });


    $j(".pageLink").live("click", function () {
        $j(this).addClass("pageClickLoad");
        a.find(".sb_up").click();
        $j('.content').css({ 'opacity': 1.0 });
        $j("#ajaxBusy").css({ display: "block" });

        var p = buildQuery();
        retrieveFilters();
        if (FacetOn) {
            p = CurrentFacetFilter;
        }

        if (CurrentView != "list" && CurrentView != "grid" && CurrentView != "") {
            pageNumber = $j(this).attr("data-page");
            runQuery(p, pageNumber, h, g);
        } else if (CurrentView == "grid") {
            pageNumber = $j(this).attr("data-page");
            runQuery(p, pageNumber, h, g);
            runFacet(p, pageNumber, meme, g);

            $j(".navAlpha").html("");
            $j(".slide-out-div").html("").prepend(LoadGifText);
            $j("#ajaxBusyFacet").css({
                margin: "0px auto",
                width: "44px"
            });

        } else {
            pageNumber = $j(this).attr("data-page");
            runQuery(p, pageNumber, c, g);
        }

        $j('html,body').animate({ scrollTop: 0 }, 'slow');

    });

    $j(".grid").click(function () {
        FacetOn = false;
        $j("#views a").removeClass('active');
        CurrentView = "grid";
        CurrentFacetFilter = [];
        OnlyFacets = [];

        a.find(".sb_up").click();
        pageNumber = 0;
        $j(".list").removeClass("active");
        $j(".grid").addClass("active");
        $j('.content').css({ 'opacity': 1.0 });

        $j("#ajaxBusy").css({ display: "block" });

        var n = buildQuery();
        retrieveFilters();
        runQuery(n, pageNumber, h, g);
        runFacet(n, pageNumber, meme, g);

        $j(".navAlpha").html("");
        $j(".slide-out-div").html("").prepend(LoadGifText);
        $j("#ajaxBusyFacet").css({
            display: "none",
            margin: "0px auto",
            width: "44px"
        });
    });

    establishViews();

    //Event Bindings

    a.find(".addition")
        .bind("focus", function () {
            if ((a.find(".addition").val().length > 0) || $j('.boxme').children('li').length > 1) {
                $j('.sb_clear').css({ display: 'inline' });
                $j(".boxme").css({ width: "91%" });
            }

            a.find(".sb_up").click();
        });

    a.find(".addition").live("keydown", function (b) {
        var c = b.keyCode || b.which;
        if (a.find(".addition").val().toLowerCase().indexOf("tag:") > -1) {
            if (this.value.replace(new RegExp('(' + "tag:" + ')', 'gi'), "").length >= 0) {
                jQuery.ajax({
                    type: "POST",
                    url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetTag",
                    data: "{'tagChars' : '" + this.value.replace(new RegExp('(' + "tag:" + ')', 'gi'), "")
                    .substring(0, this.value.replace(new RegExp('(' + "tag:" + ')', 'gi'), "")
                    .length) + "'}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (a) {
                        var b = a.d;
                        var c = new Array;
                        $j.each(b, function () { c.push("tag:" + this.DisplayText + "|" + this.DisplayValue); });

                        $j(".ui-corner-all").live("click", function () { convertSearchQuery(); });

                        $j(".addition").autocomplete({
                            open: function (event, ui) {
                                $j(".ui-autocomplete").css("margin-top", "8px").css("left", $j(".addition").offset().left).css("width", "100%").css('margin-left', '-34px');
                                $j(".ui-menu-item").css("height", "28px");
                                $j(".ui-corner-all").css("text-indent", "20px").css("font-size", "15px");
                            },
                            source: c,
                            autoFocus: true
                        });
                    }
                });
            }
        }

        var controlObject = this;
        $j.each(AllFilters, function () {
            if (this.ControlType == "Auto Suggest List") {
                autoSuggestWithWait(controlObject, this.DisplayName, this.WebMethod, "{'tagChars' : '" + controlObject.value.replace(new RegExp(this.DisplayName + ":", 'gi'), "").substring(0, controlObject.value.replace(new RegExp(this.DisplayName + ":", 'gi'), "").length) + "'}", 0);
            }
        });

        if ((a.find(".addition").val().length > 0) || $j('.boxme').children('li').length > 1) {
            $j('.sb_clear').css({ display: 'inline' });
            $j(".boxme").css({ width: "91%" });
        }
        if (c == 88 && b.ctrlKey) {
            $j('.sb_clear').css({ display: 'none' });
            if ($j.browser.msie) {
                $j(".boxme").css({ width: "100%" });
            }
            $j(".addition").val("").text("");
            $j(".boxme").children(".token-input-token-facebook").remove();
        }

        if (c == 9) {
            retrieveFilters();
            b.preventDefault();
        }

        clearTimeout(typingTimer);

    });

    var typingTimer; //timer identifier
    var doneTypingInterval = 3000; //time in ms, 3 second for example
    function doneTyping() {
        //autoSuggestText($j(".addition"), "", "{'tagChars' : '" + $j(".addition")
        //    .val() + "'}", 3);
    }

    $j("body").live("keyup", function (b) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);

        //Spacebar and Ctrl pressed.
        if (b.which == 32 && b.ctrlKey) {
            event.preventDefault();
            toggleDropDown();
        }

        //"b" and Ctrl pressed.
        if (b.which == 66 && b.ctrlKey) {
            $j(".addition").focus();
        }

        if (document.activeElement.id != 'token-input-demo-input-local') {
            if (b.which >= 49 && b.which <= 57) {
                if (b.shiftKey) {
                    CurrentView = $j('#views :nth-child(' + (b.which - 48) + ')')[0].id;
                    $j("." + CurrentView).click();
                } else {
                    var pageToMove = b.which - 48;
                    if (pageToMove <= window.scPageAmount) {
                        moveToPage(pageToMove);
                    }
                }
            }
        }
    });

    a.find(".addition").live("keyup", function (b) {
        if ((a.find(".addition").val().length > 0) || $j('.boxme').children('li').length > 1) {
            $j('.sb_clear').css({ display: 'inline' });
            $j(".boxme").css({ width: "91%" });
        } else {
            $j('.sb_clear').css({ display: 'none' });
            if ($j.browser.msie) {
                $j(".boxme").css({ width: "100%" });
            }
        }

        if (b.which == 88 && b.ctrlKey) {
            $j('.sb_clear').css({ display: 'none' });
            if ($j.browser.msie) {
                $j(".boxme").css({ width: "100%" });
            }
            $j(".addition").val("");
            $j(".addition").text("");
            $j(".boxme").children(".token-input-token-facebook").remove();
        }

        //Spacebar and Ctrl pressed.
        if (b.which == 32 && b.ctrlKey) {
            if ($j(".addition").val() == " ") {
                $j(".addition").val("");
            }

            Expanded = false;
            toggleDropDown();
        }

        //Escape pressed.
        if (b.which == 27) {
            toggleDropDownUp();
        }

        //"b" and Ctrl pressed.
        if (b.which == 66 && b.ctrlKey) {
            $j(".addition").focus();
        }

        var $old = $j('#keySelect');
        var $new;

        //"left" and Ctrl pressed.
        if (b.which == 37 && b.ctrlKey) {
            Expanded = false;
            $old.click();
            $new = $old.next("a");
            $old.removeAttr("id", 'keySelect');
            $new.attr("id", 'keySelect');
        }

        //"up" and Ctrl pressed.
        if (b.which == 38 && b.ctrlKey) {
            if (Expanded) {
                $new = $old.parent().prev("li").children("a");
            } else {
                $new = $old.prev().prev();
            }

            $j(".sb_filter.recent").prev().focus();
            $old.removeAttr("id", 'keySelect');
            $new.attr("id", 'keySelect');
        }

        //"right" and Ctrl pressed.
        if (b.which == 39 && b.ctrlKey) {
            Expanded = true;
            $old.click();
            $new = $old.next("a");
            $old.removeAttr("id", 'keySelect');
            $new.attr("id", 'keySelect');
        }

        //"down" and Ctrl pressed.
        if (b.which == 40 && b.ctrlKey) {
            if (Expanded) {
                $new = $old.parent().next("li").children("a");
            } else {
                $new = $old.next().next();
            }

            $old.removeAttr("id", 'keySelect');
            $new.attr("id", 'keySelect');

        }

        //"down" and Ctrl pressed.
        if (b.which == 13 && b.ctrlKey) {
            $old.click();
        }

        if (b.which == 59 || b.which == 186 || b.keyCode == 186 || b.which == 58 || b.keyCode == 190) { //190 is for Danish Keyboard which treats ":" as 190 instead of 186
            $j.each(AllFilters, function () {
                if (this.ControlType == "Auto Suggest List") {
                    autoSuggest(this.DisplayName, this.WebMethod, "");
                }

                if (this.ControlType == "Calendar") {
                    autoSuggestDate(this.DisplayName, this.ControlTypeParameters);
                }

                if (this.ControlType == "Slider") {
                    autoSuggestSlider(this.DisplayName, this.ControlTypeParameters);
                }
            });
        }
    });

    function moveToPage(a) {
        $j(this).addClass("pageClickLoad");
        $j(".sb_up").click();
        $j('.content').css({ 'opacity': 1.0 });
        $j("#ajaxBusy").css({ display: "block" });

        var p = buildQuery();
        retrieveFilters();

        if (FacetOn) {
            p = CurrentFacetFilter;
        }

        if (CurrentView != "list" && CurrentView != "grid" && CurrentView != "") {
            pageNumber = a;
            runQuery(p, pageNumber, h, g);
        } else if (CurrentView == "grid") {
            pageNumber = a;
            runQuery(p, pageNumber, h, g);
            runFacet(p, pageNumber, meme, g);

            $j(".navAlpha").html("");
            $j(".slide-out-div").html("").prepend(LoadGifText);
            $j("#ajaxBusyFacet").css({
                margin: "0px auto",
                width: "44px"
            });

        } else {
            pageNumber = a;
            runQuery(p, pageNumber, c, g);
        }
        $j("html, body").animate({ scrollTop: 0 }, "slow");

    }

    /* This will fade the dropdown menu away once you lose focus on it (blur) */
    $j(".sb_dropdown").bind("mouseleave",
      function () {
          $j(".sb_dropdown").fadeOut(2500, function () {
              a.find(".sb_up").addClass("sb_down").removeClass("sb_up");
              // Fix for issue #384670
              if ($j.browser.msie && $j(frameElement).is(":hidden")) {
                  $j(frameElement).closest('table')
                    .find('#B' + frameElement.id.substring(1, frameElement.id.length))
                    .click(function (eventObject) {
                        $j(this).unbind(eventObject);
                        $j(".sb_dropdown").show();
                        $j(".sb_dropdown").hide();
                    });
              }
          });
      });

    /* This will stop the fading away of the drop down menu once you have lost focus on it */
    $j(".sb_dropdown").live("mouseenter",
      function () {
          if ($j(".sb_dropdown").is(':animated')) {
              $j(".sb_dropdown").stop(true, true);
          }

          $j(".sb_dropdown").show();
          a.find(".sb_down").addClass("sb_up").removeClass("sb_down");

      });

    a.find(".sb_dropdown").find('label[for="all"]').prev().bind("click",
        function () {
            $j(this).parent().siblings().find(":checkbox").attr("checked", this.checked).attr("disabled", this.checked);
        });

    /* This will hide the loading bar once an item has been loaded */
    $j("#loadingSection").prepend('<div id="ajaxBusy"><p><img src="images/loading.gif"></p></div>');
    $j("#ajaxBusy").css({
        display: "none",
        margin: "0px auto"
    });


    /* This will change the image and the sort direction of the sort filter */
    $j('.sortDirection').live("click", function () {
        $j(this).toggle(
            function () { $j(this).css("background-image", "url(../Buckets/images/sortdesc.gif)").addClass("desc").removeClass("asc"); },
            function () { $j(this).css("background-image", "url(../Buckets/images/sort.gif)").addClass("asc").removeClass("desc"); });
    });

    if ($j.browser.msie) {
        setInterval(function () {
            $j(".facets").css('zoom', '');
            $j(".facets").css('zoom', '1');
        }, 200);
    }

    if (!($j.browser.mozilla)) {
        $j(".boxme").watch('width,height', function () {
            if ($j.browser.msie) {
                setTimeout(fixIeLayout, 100);
            }
            else {
                if (parseFloat($j(this).height()) >= 150) {
                    $j(".token-input-token-facebook").each(function () {
                        var $this = $j(this);
                        $j.data(this, 'css', { width: $this.css('width') });
                    });

                    $j(".token-input-token-facebook").animate({ width: "28px" });
                    $j(".token-input-token-facebook").live("mouseenter", function () {
                        var orig = $j.data(this, 'css');
                        $j(this).animate({ width: orig.width });
                    });

                    $j(".token-input-token-facebook").live("mouseleave", function () {
                        $j(this).animate({ width: "28px" });
                    });
                }
            }

        });
    }

    /* This will change the image and the Boolean Operation of the text filter from SHOULD to NOT */
    $j(".booleanOperation").live("click", function () {
        var booleanOperationClass = $j(this).attr('class').replace('booleanOperation ', '');

        switch (booleanOperationClass) {
            case 'should':
                $j(this).removeClass("must should").addClass("not");
                var b = $j(this).attr('class').split(" ")[1];
                var type = $j(this).next().attr('class');

                if (type == undefined) {
                    type = $j(this).next().next().attr('class').split(" ")[0];
                }
                $j(this).css('background-image', 'url(images/' + type + b + '.png' + ')');
                break;
            case 'not':
                $j(this).removeClass("should not").addClass("must");
                var b = $j(this).attr('class').split(" ")[1];
                var type = $j(this).next().attr('class');

                if (type == undefined) {
                    type = $j(this).next().next().attr('class').split(" ")[0];
                }
                $j(this).css('background-image', 'url(images/' + type + b + '.png' + ')');
                break;
            case 'must':
                $j(this).removeClass("must not").addClass("should");
                var b = $j(this).attr('class').split(" ")[1];
                var type = $j(this).next().attr('class');

                if (type == undefined) {
                    type = $j(this).next().next().attr('class').split(" ")[0];
                }
                $j(this).css('background-image', 'url(images/' + type + b + '.png' + ')');
                break;
            case 'booleanOperation':
                $j(this).removeClass("should not must").addClass("must");
                $j(this).css('background-image', 'url(images/' + $j(this).next().next().attr('class').split(" ")[0] + "must" + '.png' + ')');
                break;
        }

    });

    addFilter();
    addFilterGlobal();

    if ($j(frameElement).is(":hidden")) {
        var intervalVariable = setInterval(function () {
            if ($j(frameElement).is(":visible")) {
                fixIeLayout();
                clearInterval(intervalVariable);
            }
        }, 200);
    } else {
        fixIeLayout();
    }

    function fixIeLayout() {
        if (!$j.browser.msie) return;
        var boxme = $j(".boxme");
        if (boxme.length == 0) return;
        $j(".sb_clear").css("padding-bottom", boxme.height() - 10);
        $j(".sb_down").css("padding-bottom", boxme.height() - 8);
        $j(".sb_up").css("padding-bottom", boxme.height() - 8);
        $j(".sb_search").css("padding-bottom", boxme.height() - 10);
    }

    function addFilter() {
        var searchQuery = new Array;
        var searchFilters = new Array();
        $j.each(AllFilters, function () {
            if (this.ClientSideHook == "normal") {
                searchFilters.push(this.DisplayName);
            }
        });

        //Look for regular filters
        $j.each(searchFilters, function () {
            var innerFilter = getGloablQueryVariableArray(this, window.filterForSearch);
            $j.each(innerFilter, function () {
                searchQuery.push(this);
            });
        });


        var datebasedSearchFilters = new Array();
        $j.each(AllFilters, function () {
            if (this.ClientSideHook == "date") {
                datebasedSearchFilters.push(this.DisplayName);
            }
        });

        //Look for date based filters
        $j.each(datebasedSearchFilters, function () {
            var innerFilter = getGloablQueryVariable(this, window.filterForSearch);
            if (innerFilter != undefined) {
                if (innerFilter.length > 0) {
                    searchQuery.push({
                        type: this.toString(),
                        value: resolveKnownDates(innerFilter),
                        operation: getGloablQueryVariableBooleanOperation(this, window.filterForSearch),
                        friendlyName: resolveKnownDates(innerFilter)
                    });
                }
            }
        });

        var idBasedSearches = new Array();
        $j.each(AllFilters, function () {
            if (this.ClientSideHook == "id") {
                idBasedSearches.push(this.DisplayName);
            }
        });
        //Look for date based filters
        $j.each(idBasedSearches, function () {
            var innerFilter = getGloablQueryVariable(this, window.filterForSearch);
            if (innerFilter != undefined) {
                if (innerFilter.length > 0) {
                    searchQuery.push({
                        type: this.toString(),
                        value: innerFilter.split("|").length > 1 ? innerFilter.split("|")[1] : innerFilter,
                        operation: getGloablQueryVariableBooleanOperation(this, window.filterForSearch),
                        friendlyName: innerFilter
                    });
                }
            }
        });

        var parsedSearchFilters = new Array();
        $j.each(AllFilters, function () {
            if (this.ClientSideHook == "sort") {
                parsedSearchFilters.push(this.DisplayName);
            }
        });

        //Look for parsed filters
        $j.each(parsedSearchFilters, function () {
            var innerFilter = getGloablQueryVariable(this, window.filterForSearch);
            if (innerFilter != undefined) {
                if (innerFilter.length > 0) {
                    searchQuery.push({
                        type: this,
                        value: innerFilter,
                        operation: innerFilter.indexOf("desc") > -1 ? "desc" : "asc",
                        friendlyName: innerFilter
                    });
                }
            }
        });


        var customSearchFilters = new Array();
        $j.each(AllFilters, function () {
            if (this.ClientSideHook == "custom") {
                customSearchFilters.push(this.DisplayName);
            }
        });

        //Look for parsed filters
        $j.each(customSearchFilters, function () {
            var innerFilter = getGloablQueryVariable(this, window.filterForSearch);
            if (innerFilter != undefined) {
                if (innerFilter.length > 0) {
                    searchQuery.push({
                        type: this,
                        value: innerFilter,
                        operation: getGloablQueryVariableBooleanOperation(this, window.filterForSearch),
                        friendlyName: innerFilter
                    });
                }
            }
        });

        if (searchQuery.length > 0) {

            var cleanQuery = new Array();
            $j.each(searchQuery, function () {
                cleanQuery.push({
                    type: this.type,
                    value: this.value,
                    operation: this.operation
                });
            });

            if (CurrentView != "list" && CurrentView != "grid" && CurrentView != "") {
                runQuery(cleanQuery, 1, h, g);
                runFacet(cleanQuery, 1, meme, g);
            } else if (CurrentView == "grid") {
                runQuery(cleanQuery, 1, h, g);
                runFacet(cleanQuery, 1, meme, g);

                $j(".navAlpha").html("");
                $j(".slide-out-div").prepend(LoadGifText);
                $j("#ajaxBusyFacet").css({
                    margin: "0px auto",
                    width: "44px"
                });
            } else {
                runQuery(cleanQuery, 1, c, g);
                runFacet(cleanQuery, 1, meme, g);
            }

            $j.each(searchQuery, function () {
                var d = this.value;
                var friendlyName = this.friendlyName;
                var ieMaxWidth = $j.browser.msie && this.type.length + friendlyName.length > 48 ? " tokenMaxWidth" : "";
                if (this.type == "sort") {
                    a.find(".boxme").prepend('<li class="token-input-token-facebook" style="opacity:0.3;" title="' + d + '"><span  title="' + '' + '" style="background: url(\'images/' + this.type + this.operation + '.png\') no-repeat center center;padding: 0px 11px;" class="sortDirection should desc"></span><span>sort:</span><span class="' + this.type + ieMaxWidth + '" style="text-overflow: ellipsis;color:black;max-width: 411px;overflow: hidden;vertical-align:top;">' + friendlyName + '</span><span class="token-input-delete-token-facebook remove" title="' + '' + '">×</span></li>');
                }
                else {
                    a.find(".boxme").prepend('<li class="token-input-token-facebook" style="opacity:0.3;" title="' + d + '"><span  title="' + '' + '" style="background: url(\'images/' + this.type + this.operation + '.png\') no-repeat center center;padding: 0px 11px;" class="booleanOperation ' + this.operation + '"></span><span class="' + this.type + ieMaxWidth + '" style="text-overflow: ellipsis;color:black;max-width: 411px;overflow: hidden;vertical-align:top;">' + friendlyName + '</span><span class="token-input-delete-token-facebook remove" title="' + '' + '">×</span></li>');
                }
                $j(".remove").live("click", function () {
                    $j(this).parents("li:first").remove();
                    a.find(".addition").focus();
                });
            });

            CurrentFacetFilter = [];
            OnlyFacets = [];
            window.filterForSearch = '';
        }
    }
});