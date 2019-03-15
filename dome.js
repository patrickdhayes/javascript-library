(function(win){
    var global = win;
    var doc = global.document;
    var regXTag = /^\s*<(\w|!)[^>]*>/;
    var Dome = function(els) {
        for(var i=0; i < els.length; i++) {
            this[i] = els[i];
        }
        this.length = els.length;
        console.log(this);
//        return this;   
    }
    
    
    var dome = function(params, context) {
        var els;
        var regXTag = /^\s*<(\w|!)[^>]*>/;
        var currentContext = document.documentElement.lastChild;
        
        if(context) {
            if(context.nodeType) {
                currentContext = context;
            } else {
                console.log('dome: ' + typeof context);
                var sel = doc.querySelectorAll(context);
                
                if(sel[0] === undefined) {
                    var elemt = document.documentElement.lastChild;
                    console.log("Sel: " + sel);
                } else {
                    var elemt = new dome(sel);
                }
                currentContext = elemt[0];
                console.log('current: ' + currentContext);
            }
        }
        
        // return empty object if no params
        
        
        if(typeof params === 'string' && regXTag.test(params)) {
            var divElem = document.createElement('div');
            divElem.className = 'dome-wrapper';
            var docFrag = document.createDocumentFragment();
            docFrag.appendChild(divElem);
            var queryDiv = docFrag.querySelector('div');
            queryDiv.innerHTML = params;
            currentContext.appendChild(queryDiv.firstChild);
            
            //return new Dome(currentContext);
        }
        
        if(!regXTag.test(params)) {
        
            if(typeof params === "string") {
                els = doc.querySelectorAll(params);
            } else if (params.length) {
                els = params;
            } else {
                els = [params];   
            }

            return new Dome(els);  
        }
    };
    
    global.dome = global.$ = dome;
    //dome.fn = Dome.prototype;
    
    Dome.prototype.map = function(callback) {
      var len = this.length;
	for(var i = 0; i < len; i++){
		callback.call(this[i], i, this[i]);
	}
	return this;  
    };
   Dome.prototype.each = function (callback) {
	this.map(callback);
    return this;
};
    Dome.prototype.mapOne = function(callback) {
      var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };
    Dome.prototype.html = function(htmlString){
	if(htmlString){
		return this.each(function(){
			this.innerHTML = htmlString;
		});
	}else{
		return this[0].innerHTML;
	}
};

    Dome.prototype.text = function(textString){
        if(textString) {
            return this.each(function() {
               return this.textContent = textString; 
            });
        } else {
            return this.mapOne(function() {
            return this.textContent; 
            });   
        }
};
     
    Dome.prototype.addClass = function(classes) {
            if(typeof classes !== "string") {    
            for (var i = 0; i < classes.length; i++) {           
//                console.log(classes[i]);
                    this.each(function(){
            this.classList.add(classes[i].toString());
                });
            }              
        } else {
            this.each(function(){
            this.classList.add(classes);
        });
     }
};
    Dome.prototype.removeClass = function(clss) {
          return this.each(function() {
              this.classList.remove(clss);
          });
    };
    Dome.prototype.tag = function(name) {
        var tagName = this[0].getElementsByTagName(name);
        return new Dome(tagName);
    };
    Dome.prototype.prev = function(ele) {
            if(ele) {
            var res = this[0].querySelectorAll(ele);
            var resPrev = res[0].previousElementSibling;
            return new dome(resPrev);
        } else if(!ele) {   
            console.log('Prev test');
            var resPrev = this[0].previousElementSibling;
            if(resPrev !== null) {
                return new dome(resPrev);    
            } else {
                return this;    
            }
        }
    };
    Dome.prototype.next = function(ele) {
       if(ele) {
            var res = this[0].querySelectorAll(ele);
            var resNext = res[0].nextElementSibling;
            return new dome(resNext);
        } else if(!ele) {
            var resNext = this[0].nextElementSibling;
            return new dome(nextPrev);
            if(resNext !== null) {
                return new dome(resNext);
            } else {
                return this;    
            }       
        }
    };
    Dome.prototype.parent = function(ele) {
        if(ele != null) {
            var res = this[0].querySelectorAll(ele);
            var resPar = res[0].parentNode;
            return new dome(resPar);
        } else if (!ele) {
            var resPar = this[0].parentNode;
            return new dome(resPar);
        } else {
            return this;   
        }
    };
    Dome.prototype.first = function() {
            var res = this[0].firstElementChild;
            return new dome(res);
    };
    Dome.prototype.last = function() {
            var res = this[0].lastElementChild;
            return new dome(res);
    };
    Dome.prototype.remove = function(ele) {
        if(ele) {
            var res = this[0].querySelector(ele);
            var resPar = this[0].removeChild(res);
            return resPar;
        } else if(!ele) {
              console.log(this[0].parentElement);
              var res = this[0];
              return this[0].parentElement.removeChild(this[0]);
         
        }
    };
    Dome.prototype.append = function (ele) {
        if(regXTag.test(ele)) {
          return this.each(function() {
            var divElem = document.createElement('div');
            var docFrag = document.createDocumentFragment();
            docFrag.appendChild(divElem);
            var queryDiv = docFrag.querySelector('div');
            queryDiv.innerHTML = ele;
            console.log(typeof queryDiv);  
            this.appendChild(queryDiv.firstChild);
          });
        } else {
            return this.each(function(){
            var elem = document.createElement(ele);
            var divElem = document.createElement('div');
            var docFrag = document.createDocumentFragment();
            docFrag.appendChild(divElem);
            var queryDiv = docFrag.querySelector('div');
            queryDiv.appendChild(elem);
            this.appendChild(queryDiv.firstChild);    
            }); 
        }
    };
    Dome.prototype.prepend = function(ele) {
          if(regXTag.test(ele)) {
          return this.each(function() {
            var divElem = document.createElement('div');
            var docFrag = document.createDocumentFragment();
            docFrag.appendChild(divElem);
            var queryDiv = docFrag.querySelector('div');
            queryDiv.innerHTML = ele;
            console.log(typeof queryDiv);  
            this.insertBefore(queryDiv.firstChild, this.firstChild);
          });
        } else {
            return this.each(function(){
            var elem = document.createElement(ele);
            var divElem = document.createElement('div');
            var docFrag = document.createDocumentFragment();
            docFrag.appendChild(divElem);
            var queryDiv = docFrag.querySelector('div');
            queryDiv.appendChild(elem);
            this.insertBefore(queryDiv.firstChild, this.firstChild);    
            }); 
        }
    };
    Dome.prototype.hasClass = function(name) {
        console.log('classList contains: ' + this[0].classList);
                if(this.classList) {
                    this.classList.each(function(index){
                        this[index].classList.contains(name);
                        return true;
                    });
                }
                return false;       
    };
    Dome.prototype.attr = function(attr, val) {
        if(typeof val !== 'undefined') {
            return this.each(function() {
                this.setAttribute(attr, val);
            });
        } else {
            var arr = [];
                arr.push(this[0].getAttribute(attr));              
            return arr;
        }
    };
    Dome.prototype.getStyle = function(name) {
        var elem = this[0];
        console.log(elem);
          if(elem.style[name]) {
              return elem.style[name];
          } else if(elem.currentStyle) {
               return elem.currentStyle[name];
          } else if(document.defaultView && document.defaultView.getComputedStyle) {
              name = name.toString().replace(/([A-Z])/g, "-$1");
              name = name.toLowerCase();
              
              var s = document.defaultView.getComputedStyle(elem, "");
              console.log('style: ' + s.getPropertyValue(name));
              return s && s.getPropertyValue(name);
              console.log(s);
          } 
        return null;
    };
    Dome.prototype.resetCSS = function(prop) {
        var old = {};
         for(var i in prop) {
             old[i] = this[0].style[i];
             this[0].style[i] = prop[i];
         }
        
        return old;
    };
    Dome.prototype.restoreCSS = function(prop) {
          for (var i in prop) {
              this[0].style[i] = prop[i];
          }
    };
    Dome.prototype.height = function() {
           if(this.getStyle('display') != 'none') {
               return this.clientHeight || this.getStyle('height');
           }
            
            var old = this.resetCSS({
                display: 'block',
                visibility: 'hidden',
                position: 'absolute'
                
            });
        
            var h = this.clientHeight || this.getStyle('height');
        
            this.restoreCSS(old);
        
        return h;     
        
    };
    Dome.prototype.width = function() {
           if(this.getStyle('display') != 'none') {
               return this.clientHeight || this.getStyle('width');
           }
            
            var old = this.resetCSS({
                display: 'block',
                visibility: 'hidden',
                position: 'absolute'
                
            });
        
            var w = this.clientHeight || this.getStyle('width');
        
            this.restoreCSS(old);
        
        return w;
    };
    Dome.prototype.hide = function() {
           var currentDisplay = this.getStyle('display');
        
        if (currentDisplay != 'none') {
            this.each(function(){
               this.style.display = 'none'; 
            });
        }
    };
    Dome.prototype.show = function() {
        this.each(function(){
            this.style.display = '';   
        });
    };
    Dome.prototype.setOpacity = function(level) {
        if (this.filters) {
            this.style.filters = 'alpha(opacity=' + level + ')';
        } else {
            this.each(function(){
                this.style.opacity = level / 100;    
            });
            
        }
        
    };
    Dome.prototype.slideDown = function() {
//        if (height) {
//            var h = height;   
//        } else {
//            var h = this.height();  
//        }
        var elem = this[0];
        var ele = this;
	    this[0].style.overflow = 'hidden';
        var h = this.height();
//      this[0].style.overflow = 'auto';
        var padB = this.getStyle('padding-bottom');
        var pad = this.getStyle('padding-top');
        this[0].style.height = 0;
        this[0].style.paddingTop = '0';
        this[0].style.paddingBottom = '0';
        elem.style.opacity = '0';
        ele.show();
            
        
        
        console.log('padding-bottom: ' + padB);
        this[0].style.transition = 'all 0.5s';

        setTimeout(function(){
            elem.style.opacity = '1';
            elem.style.paddingTop = pad;
            elem.style.paddingBottom = padB;
            elem.style.height = h;
            
        }, 50);
    };
    Dome.prototype.slideUp = function() {
//        var elem = this[0]; 
//        
//        var h = this.height().toString();
//        this[0].style.transition = 'all 0.5s';
//        this[0].style.height = h;
//        setTimeout(function(){
//            elem.style.height = '0px';
//            elem.hide();
//        }, 50);
	this[0].style.overflow = 'hidden';
        var h = this.height();
        
        var elem = this[0];
        var ele = this;
        this[0].style.transition = 'all 0.5s';
//        var h = this.height();
//      this[0].style.overflow = 'auto';
        var padB = this.getStyle('padding-bottom');
        var pad = this.getStyle('padding-top');

        setTimeout(function(){
            elem.style.paddingTop = '0';
            elem.style.paddingBottom = '0';
            elem.style.height = '0';
            elem.style.opacity = '0';
        }, 100);
        setTimeout(function(){
            elem.style.opacity = '0';
        }, 100);
        setTimeout(function(){
            elem.style.display = 'none';
            elem.style.height = h;
            elem.style.paddingTop = pad;
            elem.style.paddingBottom = padB;
        }, 500);
    };
    Dome.prototype.slideToggle = function() {
        if(this[0].style.display == 'none') {
            this.slideDown();
            
        } else {
            this.slideUp();
        }
    };
    Dome.prototype.fadeIn = function() {
        var elem = this[0];
        this.setOpacity(0);
        this.show();
                
        this[0].style.transition = 'opacity 1s';
        setTimeout(function(){
            elem.style.opacity = 100;    
        }, 50);
        
    };
    Dome.prototype.fadeOut = function() {
        var elem = this[0];
                
        this[0].style.transition = 'opacity 1s';
        setTimeout(function(){
            elem.style.opacity = 0;    
        }, 50);
        
    };
    Dome.prototype.positionX = function() {
//            return elem[0].offsetLeft;
       var currLeft = 0;
        if (this[0].offsetParent) {
            while(this[0].offsetParent) {
                currLeft += this[0].offsetLeft;
                this[0] = this[0].offsetParent;
            }
        } else {
            return this[0].offsetLeft;
        }
        console.log('Current Left 1: ' + currLeft);
        return  currLeft;
    };
    Dome.prototype.positionY = function() {
//        return this[0].offsetTop;
        var currTop = 0;
        if (this[0].offsetParent) {
            while(this[0].offsetParent) {
                currTop += this[0].offsetTop;
                this[0] = this[0].offsetParent;
            }
        } else {
            return this[0].offsetTop;
        }
        console.log('Current Top 1: ' + currTop);
        return  currTop;
                
    };
    Dome.prototype.parentX = function(ele) {
        var elem = this[0].querySelectorAll(ele);
//        console.log('what is h: ' + this.pageX(ele));
//        console.log('parentX ' + this.pageX(elem[0]));
        if (this[0].parentNode == this[0].offsetParent) {
            console.log('what is h: ' + this[0].offsetLeft);
               return this[0].offsetLeft;
        } else {
            var offset = this[0].offsetLeft;
            var parentOffset = this[0].parentNode.offsetLeft;
            console.log('what is i: ' + offset - parentOffset);
            return offset - parentOffset;
                
        }
        
    };
    Dome.prototype.parentY = function() {
        var elem;
        if (this[0].parentNode == this[0].offsetParent) {
               return this[0].offsetTop;   
        } else {
            var offset = this[0].offsetTop;
            var parentOffset = this[0].parentNode.offsetTop;
            return offset - parentOffset;
                
        }
    };
    Dome.prototype.posX = function(pos) {
        if(pos) {
            this[0].style.left = pos + 'px';
        } else {
            return parseInt(this.getStyle('left'));
        }
    };
    Dome.prototype.posY = function(pos) {
        if(pos) {
            this[0].style.top = pos + 'px';  
        } else {
            return parseInt(this.getStyle('top'));
        }
    };
    Dome.prototype.setX = function(pos) {
          this[0].style.left = pos + 'px';
    };
    Dome.prototype.setY = function(pos) {
          this[0].style.top = pos + 'px';
    };
    Dome.prototype.addX = function(pos) {
        this.setX(this.posX() + pos);
    };
    Dome.prototype.addY = function(pos) {
        this.setY(this.posY() + pos);
    };
    Dome.prototype.on = function(evt, callback) {
        return this[0].addEventListener(evt, callback, false);
    };
    Dome.prototype.randomString = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

})(window);
