function postServerRequest(name, context, handler, async) {
  $.ajax({
    url: "/-/speak/request/v1/" + name,
    data: "data=" + JSON.stringify(context),
    success: handler,
    type: "POST",
    async: async != undefined ? async : true
  });
}