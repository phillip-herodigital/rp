require.config({
  paths: {
      bootstraplib: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/bootstrap/js/bootstrap.min"
  },
  shim: {
    'bootstraplib': { deps: ['jquery'] }
  }
});

define("bootstrap", ["jquery", "bootstraplib"], function () {
  return true;
});