function postServerRequest(name, context, handler, async) {
  function onError(args) {
    if (args.status === 403) {
      console.error("Not logged in, will reload page");
      window.top.location.reload(true);
    }
  }

  $.ajax({
    url: "/sitecore/api/ssc/" + name,
    data: context,
    error: onError,
    success: handler,
    type: "POST",
    async: async != undefined ? async : true
  });
}