class DOMNodeCollection {
  constructor(collection = []) {
    this.collection = collection;
  }

  each(cb) {
    this.collection.forEach(cb);
  }

  html(arg) {
    if(arg === undefined) {
      return this.collection[0].innerHTML;
    } else {
      this.each((node) => {
        node.innerHTML = arg;
        return this;
      });
    }
  }

  empty() {
    html("");
    return this;
  }

  append(children) {
     if (this.collection.length === 0) return;

     if (typeof children === 'object' && !(children instanceof DomNodeCollection)) {
       children = $l(children);
     }

     if (typeof children === "string") {
       this.each(node => node.innerHTML += children);
     } else if (children instanceof DomNodeCollection) {
       this.each(node => {
         children.each(childNode => {
           node.appendChild(childNode.cloneNode(true))
         });
       })
     }
   }

  attr(arg, val) {
    if(val === undefined) {
      return this.collection[0].getAttribute(arg);
    } else {
      this.collection[0].setAttribute(arg, val);
    }
    return this;
  }

  addClass(classname) {
    let classes = this.attr("class").split(" ");

    if(!classes.includes(classname)) {
      classes.push(classname);
    }

    this.attr("class", classes.join(" "));
    return this;
  }

  removeClass(classname) {
    let classes = this.attr("class").split(" ");

    let index = classes.indexOf(classname);

    if(index > -1) {
      classes.splice(index, 1);
    }

    this.attr("class", classes.join(" "));
    return this;
  }

  children() {
    let childNodes = [];
    this.each((node) => {
      childNodes = childNodes.concat(Array.from(node.children));
    });

    return new DOMNodeCollection(childNodes);
  }

  parent() {
    const parentNodes = [];
    this.each(node => parentNodes.push(node.parentNode));
    return new DomNodeCollection(parentNodes);
  }

  find(arg) {
    return new DOMNodeCollection(this.collection[0].querySelectorAll(arg));
  }

  remove() {
    this.collection.forEach((node) => {
      node.remove();
    });
  }

  on(eventName, callback) {
    this.each(node => {
      node.addEventListener(eventName, callback);
      const eventKey = `jqliteEvents-${eventName}`;
      if (typeof node[eventKey] === "undefined") {
        node[eventKey] = [];
      }
      node[eventKey].push(callback);
    });
  }

  off(eventName) {
    this.each(node => {
      const eventKey = `jqliteEvents-${eventName}`;
      if (node[eventKey]) {
        node[eventKey].forEach(callback => {
          node.removeEventListener(eventName, callback);
        });
      }
      node[eventKey] = [];
    });
  }
}

module.exports = DOMNodeCollection;
