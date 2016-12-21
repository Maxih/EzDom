const DOMNodeCollection = require("./dom_node_collection.js");

const readyFuncs = [];
let docReady = false;
document.addEventListener("DOMContentLoaded", executeLoad);


function executeLoad() {
  docReady = true;
  readyFuncs.forEach((fn) => {
    fn();
  });
}

$l = function(selector) {

  if(selector instanceof Function) {
    if(docReady)
      selector();
    else
      readyFuncs.push(selector);
  } else if(selector instanceof HTMLElement) {
    return new DOMNodeCollection([selector]);
  } else if(typeof(selector) === "string") {
    const args = [];
    const matcher = /<(.+)>/g;
    const matched = matcher.exec(selector);

    if(matched === null) {
      args.push(document.querySelector(selector));
    } else {
      args.push(document.createElement(matched[1]));
    }

    return new DOMNodeCollection(args);
  }
};

$l.extend = function(objectA, ...objects) {
  objects.forEach((object) => {
    for(let key in object) {
      objectA[key] = object[key];
    }
  });
  return objectA;
};

$l.ajax = function(options = {}) {
  const request = new XMLHttpRequest();
  const defaults = {
    method: "GET",
    url: "",
    success: function() {},
    error: function() {},
    data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  };

  options = $l.extend(defaults, options);
  options.method = options.method.toUpperCase();

  request.open(options.method, options.url, true);
  request.onload = e => {
    if (request.status === 200) {
      options.success(request.response);
    } else {
      options.error(request.response);
    }
  };

request.send(JSON.stringify(options.data));
};
