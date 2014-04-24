define({
  load: function (name, req, load, config) {
    var fileName = config.baseUrl + (config.paths[name] || name);

    if (fileName.indexOf(".css", fileName.length - 4) === -1) {
      fileName += ".css";
    }
    
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = fileName;
    link.rel = 'stylesheet';
    link.type = 'text/css';

    head.appendChild(link);

    load(true);
  }
});
