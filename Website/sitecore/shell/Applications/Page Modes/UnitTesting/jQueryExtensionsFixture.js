module("jQuery extensions");

test("areEqualStrings", function () {
  ok(!$sc.areEqualStrings("a", "A"), "if 'ignoreCase' flag is not passed, the case sensitive equality is checked.");
  ok($sc.areEqualStrings("a", "A", true), "if 'ignoreCase' flag is set to true, the case-insensitive equality is checked.");
  ok($sc.areEqualStrings("a", "a"));
  raises(function () {
    $sc.areEqualStrings(2, "A");
  }, "must throw an exception if non-string parameter is passed.");
});

test("evaluateJSON", 2, function() {
  var jObject =  $sc.evalJSON("{\"text\": \"Hello world\"}");
  same(jObject.text, "Hello world", "The propert should be the same");
  jObject =  $sc.evalJSON("{text: \"Hello world\"}"); 
  same(jObject.text, "Hello world", "The propert should be the same");
});

test("Array - exists", 2, function() {
  var array = [-1, 2, -2, 7];
  var truePredicate = function() { return this > 5 };
  ok ($sc.exists(array, truePredicate), "The element should be found");
  var falsePredicate = function() {return this == 0};
  ok (!$sc.exists(array, falsePredicate), "The element shouldn't be found");
});

test("Array - findIndex", 2, function() {
  var array = [-1, 2, -2, 7];
  var predicate = function() { return this > 0 && this < 5; };
  same($sc.findIndex(array, predicate), 1, "The index should be equal 1");
  predicate = function() { return this > 100; };
  ok ($sc.findIndex(array, predicate), -1, "The element shouldn't be found.");
});

test("Array - first", 2, function() {
  var objToFind = { value: 12};
  var array = [{value:0}, objToFind, {value: 2}];
  var predicate = function () { return this.value > 0;}
  var result = $sc.first(array, predicate);
  equal(objToFind, result, "Wrong object found");
  predicate = function () { return this.value > 100;};
  ok ($sc.first(array, predicate) == null,  "The value shouldn't be found");
});

test("Array - last", 2, function() {
  var objToFind = { value: 12};
  var array = [{value:0}, {value: 2}, objToFind];
  var predicate = function () { return this.value > 0;}
  var result = $sc.last(array, predicate);
  equal(objToFind, result, "Wrong object found");
  predicate = function () { return this.value > 100;};
  ok ($sc.last(array, predicate) == null,  "The value shouldn't be found");
});

test("Format string", 1, function() {
  var str = "It's {0}. {1} {0} is passed.";
  same($sc.formatString(str, "test", "The"), "It's test. The test is passed.", "The text should be the same");
});

test("Parse Query", 2, function() {
  var query = "/testHost/testPage.aspx?name=test&value=1";
  var obj = $sc.parseQuery(query);
  same(obj.name, "test", "The name doesn't match");
  same(obj.value, "1", "The value doesn't match");  
});

test("Remove Tags", 1, function() {
  var html = "<div id='test div'>Hello <br /><span>world</span></div>";
  same($sc.removeTags(html), "Hello world", "The strings must match");  
});

test("To short Id", 1, function() {
  var id = "{67A5FC75-1996-44E2-B226-A7F92AC9F9C7}";
  same($sc.toShortId(id), "67A5FC75199644E2B226A7F92AC9F9C7", "Wrong conversion");
});

test("To Id", 1, function() {
  var shortId = "67A5FC75199644E2B226A7F92AC9F9C7";
  same($sc.toId(shortId), "{67A5FC75-1996-44E2-B226-A7F92AC9F9C7}", "Wrong conversion");
});

 test("Truncate", 1, function() {
   var string = "Hello world";
   same($sc.truncate(string, 5), "Hello...", "Wrong stirng");
 });

 test("Outer html", 2, function() {
  var container = $sc("#qunit-fixture").html("");
  var element = $sc("<div class='test'><span>test</span></div>").appendTo(container);
  same($sc.trim(element.outerHtml()), $sc.trim(container.html()), "The html must match");
  element.outerHtml("<span>hello</span>")
  same("<span>hello</span>", container.html().toLowerCase(), "The html must match");
 });

 test("Update", 1, function() {
  same($sc("#qunit-fixture").update("<span>hello world</span>")[0].innerHTML.toLowerCase(), "<span>hello world</span>", "The html must match");  
 });

 test("Stop event", 1, function() {
  var parent = $sc("<div></div>").click(function() {
    ok(false, "We shouldn't get gere");
  });

  var e = $sc.Event("click");
  var child = $sc("<a href='http://sitecore.net'>Click</a>").click(function(e) { e.stop(); });
  child.appendTo(parent);
  parent.appendTo($sc("#qunit-fixture"));
  child.trigger(e);
  ok(e.isDefaultPrevented(), "The default ation should be prevented");
 });