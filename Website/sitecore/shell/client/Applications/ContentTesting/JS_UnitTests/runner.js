require.config({
  paths: {
    jquery: "/sitecore/shell/client/Speak/Assets/lib/core/1.1/deps/jQuery/jquery-2.1.1",
    underscore: "/sitecore/shell/client/Speak/Assets/lib/core/1.1/deps/underscore/underscore.1.4.4",
    knockout: "/sitecore/shell/client/Speak/Assets/lib/core/1.1/deps/ko/knockout-2.2.1",
    backbone: "/sitecore/shell/client/Speak/Assets/lib/core/1.1/deps/backbone/backbone.1.0.0",
    sitecore: "/sitecore/shell/client/Speak/Assets/lib/core/1.1/sitecore-1.0.2",
    bootstrap: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/bootstrap",
    jqueryui: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/jQueryUI/jquery-ui-1.10.1.custom",

    jasmine: "lib/jasmine-2.0.3/jasmine",
    jasmineHtml: "lib/jasmine-2.0.3/jasmine-html",
    jasmineEnvBoot: "lib/jasmine-2.0.3/boot",

    FilteredComboBox: "/sitecore/shell/client/Applications/ContentTesting/Components/FilteredComboBox/FilteredComboBox",
    FilteredComboBoxTest: "/sitecore/shell/client/Applications/ContentTesting/Components/FilteredComboBox/test/FilteredComboBox.test",

    SliderAdvanced: "/sitecore/shell/client/Applications/ContentTesting/Components/SliderAdvanced/SliderAdvanced",
    SliderAdvancedTest: "/sitecore/shell/client/Applications/ContentTesting/Components/SliderAdvanced/test/SliderAdvanced.test",

    ImageThumbs: "/sitecore/shell/client/Applications/ContentTesting/Common/lib/ImageThumbs",

    CarouselImage: "/sitecore/shell/client/Applications/ContentTesting/Components/CarouselImage/CarouselImage",
    CarouselImageTest: "/sitecore/shell/client/Applications/ContentTesting/Components/CarouselImage/test/CarouselImage.test",

    CompareImage: "/sitecore/shell/client/Applications/ContentTesting/Components/CompareImage/CompareImage",
    CompareImageTest: "/sitecore/shell/client/Applications/ContentTesting/Components/CompareImage/test/CompareImage.test",

    TooltipCustom: "/sitecore/shell/client/Applications/ContentTesting/Components/TooltipCustom/TooltipCustom",
    TooltipCustomTest: "/sitecore/shell/client/Applications/ContentTesting/Components/TooltipCustom/test/TooltipCustom.test",    

    KPISpot: "/sitecore/shell/client/Applications/ContentTesting/Components/KPISpot/KPISpot",
    KPISpotTest: "/sitecore/shell/client/Applications/ContentTesting/Components/KPISpot/test/KPISpot.test",
    
    ValueBar: "/sitecore/shell/client/Applications/ContentTesting/Components/ValueBar/ValueBar",
    ValueBarTest: "/sitecore/shell/client/Applications/ContentTesting/Components/ValueBar/test/ValueBar.test",

    ExperienceIndicator: "/sitecore/shell/client/Applications/ContentTesting/Components/ExperienceIndicator/ExperienceIndicator",
    ExperienceIndicatorTest: "/sitecore/shell/client/Applications/ContentTesting/Components/ExperienceIndicator/test/ExperienceIndicator.test",

    ProgressBarCustom: "/sitecore/shell/client/Applications/ContentTesting/Components/ProgressBarCustom/ProgressBarCustom",
    ProgressBarCustomTest: "/sitecore/shell/client/Applications/ContentTesting/Components/ProgressBarCustom/test/ProgressBarCustom.test",

    GroupedCheckboxList: "/sitecore/shell/client/Applications/ContentTesting/Components/GroupedCheckboxList/GroupedCheckboxList",
    GroupedCheckboxListTest: "/sitecore/shell/client/Applications/ContentTesting/Components/GroupedCheckboxList/test/GroupedCheckboxList.test",

    QueryStringParameterResolver: "/sitecore/shell/client/Applications/ContentTesting/Components/QueryStringParameterResolver/QueryStringParameterResolver",
    QueryStringParameterResolverTest: "/sitecore/shell/client/Applications/ContentTesting/Components/QueryStringParameterResolver/test/QueryStringParameterResolver.test",

    TestObjectivesDataSource: "/sitecore/shell/client/Applications/ContentTesting/Components/DataSource/TestObjectivesDataSource/TestObjectivesDataSource",
    TestObjectivesDataSourceTest: "/sitecore/shell/client/Applications/ContentTesting/Components/DataSource/TestObjectivesDataSource/test/TestObjectivesDataSource.test",

    UnorderedList: "/sitecore/shell/client/Applications/ContentTesting/Components/UnorderedList/UnorderedList",
    UnorderedListTest: "/sitecore/shell/client/Applications/ContentTesting/Components/UnorderedList/test/UnorderedList.test",

    ScoreGainedSpot: "/sitecore/shell/client/Applications/ContentTesting/Components/ScoreGainedSpot/ScoreGainedSpot",
    ScoreGainedSpotTest: "/sitecore/shell/client/Applications/ContentTesting/Components/ScoreGainedSpot/test/ScoreGainedSpot.test",

    TestOptions: "/sitecore/shell/client/Applications/ContentTesting/Components/TestOptions/TestOptions",
    TestOptionsTest: "/sitecore/shell/client/Applications/ContentTesting/Components/TestOptions/test/TestOptions.test",

    OptionsMapper: "/sitecore/shell/client/Applications/ContentTesting/Components/OptionsMapper/OptionsMapper",
    OptionsMapperTest: "/sitecore/shell/client/Applications/ContentTesting/Components/OptionsMapper/test/OptionsMapper.test",

    ZoomFrame: "/sitecore/shell/client/Applications/ContentTesting/Components/ZoomFrame/ZoomFrame",
    ZoomFrameTest: "/sitecore/shell/client/Applications/ContentTesting/Components/ZoomFrame/test/ZoomFrame.test",

    ResizableFrameGrip: "/sitecore/shell/client/Applications/ContentTesting/Components/ResizableFrameGrip/ResizableFrameGrip",
    ResizableFrameGripTest: "/sitecore/shell/client/Applications/ContentTesting/Components/ResizableFrameGrip/test/ResizableFrameGrip.test",

    PageThumbnail: "/sitecore/shell/client/Applications/ContentTesting/Components/PageThumbnail/PageThumbnail",
    PageThumbnailTest: "/sitecore/shell/client/Applications/ContentTesting/Components/PageThumbnail/test/PageThumbnail.test",
    
    AccordionRemoveCollapse: "/sitecore/shell/client/Applications/ContentTesting/Components/Behaviours/AccordionRemoveCollapse",
    AccordionRemoveCollapseTest: "/sitecore/shell/client/Applications/ContentTesting/Components/Behaviours/test/AccordionRemoveCollapse.test",

  },
  shim: {
    'boot': { exports: ["boot"] },
    'jasmine': { exports: "jasmine" },
    'jasmineHtml': { deps: ["jasmine"] },
    'jasmineEnvBoot': { deps: ["jasmineHtml"] },


    'jquery': { exports: 'jQuery' },
    'jqueryui': { deps: ['jquery'] },
    'underscore': { exports: '_' },
    'knockout': { deps: ['underscore'], exports: 'ko' },
    'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
    'sitecore': { deps: ['backbone', 'knockout'], exports: 'Sitecore.Speak' },

  },
  map: {
    '*': {
      'css': 'lib/css.js'
    },
  },

});

require(["jasmine", "jasmineHtml", "jasmineEnvBoot", "sitecore" ], function (jasmine, jasmineHtml, boot) {

  var testComponents = ["FilteredComboBoxTest",
                        "SliderAdvancedTest",
                        "CarouselImageTest",
                        "CompareImageTest",
                        "TooltipCustomTest",
                        "KPISpotTest",
                        "ValueBarTest",
                        "ExperienceIndicatorTest",
                        "ProgressBarCustomTest",
                        "GroupedCheckboxListTest",
                        "QueryStringParameterResolverTest",
                        //"TestObjectivesDataSourceTest",
                        "UnorderedListTest",
                        "ScoreGainedSpotTest",
                        "TestOptionsTest",
                        "OptionsMapperTest",
                        "ZoomFrameTest",
                        "ResizableFrameGripTest",
                        "PageThumbnailTest",
                        "AccordionRemoveCollapseTest",
                       ];

  var pathItem = "/sitecore/client/Applications/ContentTesting/Pages/JS-UnitTests/TestPage";
  $.get(pathItem, function (data) {

    //var containerElem = "<div></div>";
    var containerElem = "<div style='background-color:#96FBB9; width:1300px; height:300px;overflow-y: scroll;border: 1px solid #ff0000;margin-bottom: 10px;'></div> \
    <input name='__RequestVerificationToken' type='hidden' value='Tz8nDrAgh1yYWI5i9FH5XsZJkZvTca79r9YF52E8D5PnZoKjl8m3yJtoL9hTdsjzoAWmB2c-4G9ftRyuGY_W-AOhu0r0T5IYR8Tbgm-BmXmovLeQS7PLgn32VDitu2j90'>";
    
    var $page = $(containerElem, {
      "id": "idElem"
    }).html(data);

    $(window.document.body).append($page);

    //
    var dvElem = $page[0];
    window.runTests = function (funcTests) {
      //funcTests($page);
      funcTests($(dvElem));
    };

    require(testComponents, function () {

      jasmineHtmlReporter.initialize();
      jasmineEnvironment.execute();

    });

  });

  
});