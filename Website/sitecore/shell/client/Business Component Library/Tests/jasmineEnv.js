define("jasmineEnv",["jquery"], function ($) {
  console.log("jasmineEnv");
  var jasmineEnv = window.jasmine.getEnv();
  console.log(jasmineEnv);
  var htmlReporter = new window.jasmine.HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function (spec) {
    return htmlReporter.specFilter(spec);
  };
  var currentWindowOnload = window.onload;
  window.onload = function () {
    if (currentWindowOnload) {
      currentWindowOnload();
    }

    document.querySelector('.version').innerHTML = jasmineEnv.versionString();
    execJasmine();
  };

  function execJasmine() {
    jasmineEnv.execute();
  }

  return jasmineEnv;
});