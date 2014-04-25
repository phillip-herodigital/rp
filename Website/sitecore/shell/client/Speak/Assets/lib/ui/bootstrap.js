require.config({
  paths: {
    bootstraplib: "lib/ui/deps/bootstrap/js/bootstrap.min"
  },
  shim: {
    'bootstraplib': { deps: ['jquery'] }
  }
});

define("bootstrap", ["jquery", "bootstraplib"], function () {
  return true;
});