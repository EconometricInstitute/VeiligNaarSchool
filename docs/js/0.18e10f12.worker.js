(function(e){var r={};function o(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=r,o.d=function(e,r,t){o.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,r){if(1&r&&(e=o(e)),8&r)return e;if(4&r&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)o.d(t,n,function(r){return e[r]}.bind(null,n));return t},o.n=function(e){var r=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(r,"a",r),r},o.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},o.p="/VerspreidNaarSchool/",o(o.s="d83f")})({d83f:function(e,r,o){"use strict";function t(e,r){for(var o=0,t=0;t<r.length;t++)o+=r[t];for(var a=Array(o),i=0,l=0;l<r.length;l++)for(var u=0;u<r[l];u++)a[i]=l,i++;var f=Array(o);n(a,f);var g=s(a,r.length,e);console.log("New costs: "+g);var p=!0;while(p){p=!1;for(var c=0;c<o;c++){for(var v=a[c],d=0;d<r.length;d++)if(r[v]>r[d]){a[c]=d;var y=s(a,r.length,e);y>g?(console.log("New costs: "+y),g=y,n(a,f),p=!0,r[v]=r[v]-1,r[d]=r[v]+1):a[c]=v}for(var b=c+1;b<o;b++)if(a[c]!=a[b]){var h=a[c];a[c]=a[b],a[b]=h;var m=s(a,r.length,e);m>g?(console.log("New costs: "+m),g=m,n(a,f),p=!0):(h=a[c],a[c]=a[b],a[b]=h)}}}return console.log(f),{currentCosts:g,bestDivision:f}}function n(e,r){for(var o=0;o<e.length;o++)r[o]=e[o]}function s(e,r,o){for(var t=0,n=0;n<r;n++){for(var s=[],a=0;a<e.length;a++)e[a]==n&&s.push(a);for(var i=0;i<s.length;i++)for(var l=i+1;l<s.length;l++)t+=o[s[i]][s[l]]}return t}o.r(r);var a=t;function i(e,r){if(e&&r){var o=e/r;postMessage({type:"progress",payload:{state:"running",progress:o,progressMsg:"Berekenen: "+e+" / "+r}})}else postMessage({type:"progress",payload:{state:"running",progress:0,progressMsg:"Berekenen...",indeterminate:!0}})}function l(e){e?(console.log("Optimal!!"),postMessage({type:"progress",payload:{state:"optimal",progress:1,progressMsg:"Best mogelijke gevonden."}})):postMessage({type:"progress",payload:{state:"done",progress:1,progressMsg:"Klaar."}})}function u(e){postMessage({type:"solution",payload:e})}var f={progress:i,finish:l,solution:u};addEventListener("message",(function(e){var r=e.data;i(0,1),setTimeout((function(){var e=a(r.matrix,r.sizes).bestDivision;f.solution(e),l()}),1500)}))}});
//# sourceMappingURL=0.18e10f12.worker.js.map