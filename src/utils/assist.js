const pageScroll = (function () {
    const fn = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    let islock = false;

    return {
        lock: function (el) {
            if (islock) return;
            islock = true;
            (el || document).addEventListener('touchmove', fn);
        },
        unlock: function (el) {
            islock = false;
            (el || document).removeEventListener('touchmove', fn);
        }
    };
})();

const isIOS = !!(window.navigator && window.navigator.userAgent || '').match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

const isColor = function (value) {
    const colorReg = /^#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?$/;
    const rgbaReg = /^[rR][gG][bB][aA]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){3}\s*(\.|\d+\.)?\d+\s*\)$/;
    const rgbReg = /^[rR][gG][bB]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){2}(25[0-5]|2[0-4]\d|1?\d{1,2})\s*\)$/;

    return colorReg.test(value) || rgbaReg.test(value) || rgbReg.test(value);
};

const getScrollview = function (el) {
    let currentNode = el;
    while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
        let overflowY = document.defaultView.getComputedStyle(currentNode).overflowY;
        if (overflowY === 'scroll' || overflowY === 'auto') {
            return currentNode;
        }
        currentNode = currentNode.parentNode;
    }
    return window;
};

const checkInview = function (scrollView, el) {
    const contentHeight = scrollView === window ? document.body.offsetHeight : scrollView.offsetHeight;
    const contentTop = scrollView === window ? 0 : scrollView.getBoundingClientRect().top;

    const post = el.getBoundingClientRect().top - contentTop;
    const posb = post + el.offsetHeight;

    return (post >= 0 && post < contentHeight) || (posb > 0 && posb <= contentHeight);
};

const hasClass = function (elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length === 0 || !elem) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
};

const addClass = function (ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className === '' ? cls : ele.className + ' ' + cls;
    }
};

const removeClass = function (ele, cls) {
    if (hasClass(ele, cls)) {
        let newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
};

//Copy from iView. https://www.iviewui.com/
const scrollTop = function (el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) return;

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }

    scroll(from, to, step);
};
//获取cookie、
const  getCookie=function(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
};
//设置cookie,增加到vue实例方便全局调用
const setCookie=function(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};
//删除cookie
const  delCookie=function(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};
/*获取随机数*/
const randomNumber=function(number){
  var suijishu='';
  for (var i=0;i<number.length;i++){
    suijishu+=Math.floor(Math.random()*10);
  }
  return suijishu;
  debugger;
}
export default {randomNumber,delCookie,setCookie,getCookie,pageScroll, isIOS, isColor, getScrollview, checkInview, addClass, removeClass, scrollTop};
