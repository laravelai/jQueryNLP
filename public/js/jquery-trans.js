!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=33)}({33:function(e,t,n){e.exports=n(34)},34:function(e,t){for(var n=$("[id^='trans']"),r=new Array(n.length),o=0,i=0,l=[],a=!1,c=0;o<n.length;)if(r[o]=new Array,d(n[o],r[o]),r[o]=r[o].join("\n"),(o>0||i>0)&&(l.join("\n\n\n")+r[o]).length>max_length){var u={source:source_lang,target:target_lang,text:l.join("\n\n\n"),engine:engine};setTimeout(s,c+safe_interval,u,i),c+=safe_interval,i=o,l=[],a=!0}else l.push(r[o]),a=!1,o++;function s(e,t){if(e.text.length>1)$.ajax({type:"POST",url:"/api/nlp",data:e,success:function(e){if(0===e.ret&&""!==e.target_text){var o=e.target_text;r=o.split("\n\n\n");for(var i=0;i<r.length;i++)r[i]=r[i].split("\n"),f(n[i+t],r[i])}else console.log(e.msg)},dataType:"json"})}function d(e,t){for(var n=0;n<e.childNodes.length;n++)if(e.childNodes[n].childNodes.length>0)d(e.childNodes[n],t);else if("#text"===e.childNodes[n].nodeName){var r=h(p(g(e.childNodes[n].data))).trim();""!==r&&t.push(g(r))}}function f(e,t){for(var n=0;n<e.childNodes.length;n++)if(e.childNodes[n].childNodes.length>0)f(e.childNodes[n],t);else if("#text"===e.childNodes[n].nodeName){var r=h(p(g(e.childNodes[n].data))).trim(),o=[".","。","?","!"];""!==r&&(void 0!==t[0]&&(!o.includes(r.charAt(r.length-1))&&o.includes(t[0].charAt(t[0].length-1))&&(t[0]=" "+t[0].substring(0,t[0].length-2)+r.charAt(r.length-1)+" "),e.childNodes[n].data=" "+t[0]),t.shift())}}function g(e){return e.includes("\n")?g(e.replace("\n","")):e}function h(e){return e.includes("  ")?h(e.replace("  "," ")):e}function p(e){return e=(e=e.replace(/\t/g,"")).replace(/&nbsp;/g,"")}a||(transData={source:source_lang,target:target_lang,text:l.join("\n\n\n"),engine:engine},setTimeout(s,c+safe_interval,transData,i))}});