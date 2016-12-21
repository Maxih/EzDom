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
      });
    }
    return this;
  }

  empty() {
    html("");
    return this;
  }

  append(children) {
     if (this.collection.length === 0) return;

     if (typeof children === 'object' && !(children instanceof DOMNodeCollection)) {
       children = $l(children);
     }

     if (typeof children === "string") {
       this.each(node => node.innerHTML += children);
     } else if (children instanceof DOMNodeCollection) {
       this.each(node => {
         children.each(childNode => {
           node.appendChild(childNode.cloneNode(true))
         });
       })
     }

     return this;
   }

   load(file) {
     var xhr= new XMLHttpRequest();
     xhr.open('GET', file, true);
     xhr.onreadystatechange= function() {
         if (this.readyState!==4) return;
         if (this.status!==200) return;
         this.collection[0].innerHTML= this.responseText;
     };
     xhr.send();
   }

  attr(arg, val) {
    if(val === undefined) {
      return this.collection[0].getAttribute(arg);
    } else {
      this.collection[0].setAttribute(arg, val);
    }
    return this;
  }

  addClass(newClass) {
    this.each(node => node.classList.add(newClass));
  }

  removeClass(oldClass) {
    this.each(node => node.classList.remove(oldClass));
  }

  toggleClass(toggleClass) {
    this.each(node => node.classList.toggle(toggleClass));
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
    return new DOMNodeCollection(parentNodes);
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
