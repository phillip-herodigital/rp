if (!("console" in window))
{
  window.console = {};
}

var methods =
{
  assert: function(truth, message)
  {
  },

  clear: function()
  {
  },

  close: function()
  {
  },

  copy: function(text)
  {
  },

  count: function()
  {
  },

  debug: function()
  {
  },

  dir: function(object)
  {
  },

  dirxml: function(node)
  {
  },

  error: function()
  {
  },

  group: function()
  {
  },

  groupStart: function()
  {
  },

  groupEnd: function()
  {
  },

  info: function()
  {
  },
  
  log: function()
  {
  },

  open: function()
  {
  },

  profile: function()
  {
  },

  profileEnd: function()
  {
  },

  time: function(name)
  {
  },

  timeEnd: function(name)
  {
  },

  trace: function()
  {
  },

  warn: function()
  {
  }
};

for (var methodName in methods)
{
  if (!(methodName in console))
  {
    console[methodName] = methods[methodName];
  }
};