var m=Object.defineProperty;var er=Object.getOwnPropertyDescriptor;var tr=Object.getOwnPropertyNames;var ur=Object.prototype.hasOwnProperty;var v=(r,n)=>{for(var e in n)m(r,e,{get:n[e],enumerable:!0})},ir=(r,n,e,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let u of tr(n))!ur.call(r,u)&&u!==e&&m(r,u,{get:()=>n[u],enumerable:!(t=er(n,u))||t.enumerable});return r};var sr=r=>ir(m({},"__esModule",{value:!0}),r);var kr={};v(kr,{PHRASE_COUNT_FALLBACK:()=>U,PHRASE_COUNT_KEY:()=>y,PHRASE_COUNT_MAX:()=>x,PHRASE_COUNT_MIN:()=>F,RANDOM_SEPARATOR_OPTS:()=>O,SEPARATOR_FALLBACK:()=>T,SEPARATOR_KEY:()=>S,VAL_DASH:()=>q,VAL_DOLLAR:()=>z,VAL_PERIOD:()=>K,VAL_RANDOM:()=>Sr,VAL_SPACE:()=>H,combine_zip:()=>Pr,make_phrases:()=>br,make_separators:()=>Jr,make_wl_keys:()=>Cr,parse_count_val:()=>Dr,parse_qs_to_phrase_config:()=>Mr,shuffle:()=>Rr});module.exports=sr(kr);var d={};v(d,{_1:()=>C,_2:()=>R,_3:()=>P,_4:()=>M,_5:()=>D,_6:()=>b,_7:()=>J,_8:()=>k,__1:()=>cr,__2:()=>fr,__3:()=>_r,__4:()=>lr,__5:()=>pr,__6:()=>mr,__7:()=>vr,__8:()=>hr,app:()=>c});function h(r,n,e){for(var t=new Array(e),u=0,i=n;u<e;)t[u]=r[i],u=u+1|0,i=i+1|0;return t}function c(r,n){for(;;){var e=n,t=r,u=t.length,i=u===0?1:u,s=e.length,o=i-s|0;if(o===0)return t.apply(null,e);if(o>=0)return function(f,l){return function(nr){return c(f,l.concat([nr]))}}(t,e);n=h(e,i,-o|0),r=t.apply(null,h(e,0,i))}}function C(r,n){var e=r.length;if(e===1)return r(n);switch(e){case 1:return r(n);case 2:return function(t){return r(n,t)};case 3:return function(t,u){return r(n,t,u)};case 4:return function(t,u,i){return r(n,t,u,i)};case 5:return function(t,u,i,s){return r(n,t,u,i,s)};case 6:return function(t,u,i,s,o){return r(n,t,u,i,s,o)};case 7:return function(t,u,i,s,o,f){return r(n,t,u,i,s,o,f)};default:return c(r,[n])}}function cr(r){var n=r.length;return n===1?r:function(e){return C(r,e)}}function R(r,n,e){var t=r.length;if(t===2)return r(n,e);switch(t){case 1:return c(r(n),[e]);case 2:return r(n,e);case 3:return function(u){return r(n,e,u)};case 4:return function(u,i){return r(n,e,u,i)};case 5:return function(u,i,s){return r(n,e,u,i,s)};case 6:return function(u,i,s,o){return r(n,e,u,i,s,o)};case 7:return function(u,i,s,o,f){return r(n,e,u,i,s,o,f)};default:return c(r,[n,e])}}function fr(r){var n=r.length;return n===2?r:function(e,t){return R(r,e,t)}}function P(r,n,e,t){var u=r.length;if(u===3)return r(n,e,t);switch(u){case 1:return c(r(n),[e,t]);case 2:return c(r(n,e),[t]);case 3:return r(n,e,t);case 4:return function(i){return r(n,e,t,i)};case 5:return function(i,s){return r(n,e,t,i,s)};case 6:return function(i,s,o){return r(n,e,t,i,s,o)};case 7:return function(i,s,o,f){return r(n,e,t,i,s,o,f)};default:return c(r,[n,e,t])}}function _r(r){var n=r.length;return n===3?r:function(e,t,u){return P(r,e,t,u)}}function M(r,n,e,t,u){var i=r.length;if(i===4)return r(n,e,t,u);switch(i){case 1:return c(r(n),[e,t,u]);case 2:return c(r(n,e),[t,u]);case 3:return c(r(n,e,t),[u]);case 4:return r(n,e,t,u);case 5:return function(s){return r(n,e,t,u,s)};case 6:return function(s,o){return r(n,e,t,u,s,o)};case 7:return function(s,o,f){return r(n,e,t,u,s,o,f)};default:return c(r,[n,e,t,u])}}function lr(r){var n=r.length;return n===4?r:function(e,t,u,i){return M(r,e,t,u,i)}}function D(r,n,e,t,u,i){var s=r.length;if(s===5)return r(n,e,t,u,i);switch(s){case 1:return c(r(n),[e,t,u,i]);case 2:return c(r(n,e),[t,u,i]);case 3:return c(r(n,e,t),[u,i]);case 4:return c(r(n,e,t,u),[i]);case 5:return r(n,e,t,u,i);case 6:return function(o){return r(n,e,t,u,i,o)};case 7:return function(o,f){return r(n,e,t,u,i,o,f)};default:return c(r,[n,e,t,u,i])}}function pr(r){var n=r.length;return n===5?r:function(e,t,u,i,s){return D(r,e,t,u,i,s)}}function b(r,n,e,t,u,i,s){var o=r.length;if(o===6)return r(n,e,t,u,i,s);switch(o){case 1:return c(r(n),[e,t,u,i,s]);case 2:return c(r(n,e),[t,u,i,s]);case 3:return c(r(n,e,t),[u,i,s]);case 4:return c(r(n,e,t,u),[i,s]);case 5:return c(r(n,e,t,u,i),[s]);case 6:return r(n,e,t,u,i,s);case 7:return function(f){return r(n,e,t,u,i,s,f)};default:return c(r,[n,e,t,u,i,s])}}function mr(r){var n=r.length;return n===6?r:function(e,t,u,i,s,o){return b(r,e,t,u,i,s,o)}}function J(r,n,e,t,u,i,s,o){var f=r.length;if(f===7)return r(n,e,t,u,i,s,o);switch(f){case 1:return c(r(n),[e,t,u,i,s,o]);case 2:return c(r(n,e),[t,u,i,s,o]);case 3:return c(r(n,e,t),[u,i,s,o]);case 4:return c(r(n,e,t,u),[i,s,o]);case 5:return c(r(n,e,t,u,i),[s,o]);case 6:return c(r(n,e,t,u,i,s),[o]);case 7:return r(n,e,t,u,i,s,o);default:return c(r,[n,e,t,u,i,s,o])}}function vr(r){var n=r.length;return n===7?r:function(e,t,u,i,s,o,f){return J(r,e,t,u,i,s,o,f)}}function k(r,n,e,t,u,i,s,o,f){var l=r.length;if(l===8)return r(n,e,t,u,i,s,o,f);switch(l){case 1:return c(r(n),[e,t,u,i,s,o,f]);case 2:return c(r(n,e),[t,u,i,s,o,f]);case 3:return c(r(n,e,t),[u,i,s,o,f]);case 4:return c(r(n,e,t,u),[i,s,o,f]);case 5:return c(r(n,e,t,u,i),[s,o,f]);case 6:return c(r(n,e,t,u,i,s),[o,f]);case 7:return c(r(n,e,t,u,i,s,o),[f]);default:return c(r,[n,e,t,u,i,s,o,f])}}function hr(r){var n=r.length;return n===8?r:function(e,t,u,i,s,o,f,l){return k(r,e,t,u,i,s,o,f,l)}}var w={};v(w,{combine_zip:()=>Or,count_fallback:()=>a,count_key:()=>G,count_max:()=>Q,count_min:()=>W,make_phrases:()=>ar,make_separators:()=>wr,make_wl_keys:()=>X,nullable_to_option:()=>g,parse_count_val:()=>Nr,parse_qs_to_phrase_config:()=>gr,random_sep_chars:()=>j,sep_fallback:()=>Z,sep_key:()=>$,shuffle:()=>Y,str_to_int:()=>N});var E=2147483647,A=-2147483648;function I(r){return r>E?E:r<A?A:Math.floor(r)}function L(r){return r===void 0?{BS_PRIVATE_NESTED_SOME_NONE:0}:r!==null&&r.BS_PRIVATE_NESTED_SOME_NONE!==void 0?{BS_PRIVATE_NESTED_SOME_NONE:r.BS_PRIVATE_NESTED_SOME_NONE+1|0}:r}function V(r){if(!(r!==null&&r.BS_PRIVATE_NESTED_SOME_NONE!==void 0))return r;var n=r.BS_PRIVATE_NESTED_SOME_NONE;if(n!==0)return{BS_PRIVATE_NESTED_SOME_NONE:n-1|0}}function B(r){return L(r)}function p(r,n){if(n!==void 0)return r(V(n))}var y="phrase-count",S="separator",F=6,x=10,T="random",U=8,H="\xA0",q="-",K=".",z="$",Sr="random",O=["_",",","!","@","*","&","^","~",q,z,K,H];function X(r){var n=Math.imul(r,5),e=new Uint32Array(n);crypto.getRandomValues(e);for(var t=[],u=0;;){var i=u;if(i%5===0&&t.push(e.subarray(i,i+5|0).map(function(s){return s%6+1|0}).join("")),(i+1|0)===n)return t;u=i+1|0}}function Y(r){for(var n=r,e=r.length,t=0;e>0;){e=e-1|0;var u=Math.random();t=I(u*e);var i=n[e];n[e]=n[t],n[t]=i}return n}function Or(r,n){for(var e=r.length,t=[],u=0;;){var i=u;if(i===e)return t;var s=r[i];t.push(s);var o=n[i];t.push(o),u=i+1|0}}function N(r){var n=parseInt(r,10),e=isNaN(n);if(!e)return n}var G=y,$=S,W=6,Q=10,a=8,Z=T;function g(r){if(r!==null)return B(r)}function gr(r){var n=new URLSearchParams(r),e=g(n.get(G)),t=g(n.get($)),u=p(function(s){var o=N(s);return p(function(f){if(f>=W&&f<=Q)return o},o)},e),i=p(function(s){if(/(random|\u00a0|-|\.|\$)/.test(s))return s},t);return u!==void 0&&i!==void 0?{count:u,sep:i}:{count:a,sep:Z}}function Nr(r){var n=N(r);return n!==void 0?n:a}function ar(r,n){for(var e=X(r),t=e.length,u=new Array(t),i=0;;){var s=i;if(s===(t-1|0))return u;var o=e[s];u[s]=n[o],i=s+1|0}}var j=O;function wr(r,n){var e=n-1|0;if(r!=="random")return new Array(e).fill(r);for(var t=[];t.length<e;)t.push(Y(j.slice())[0]);return t}var rr=d,_=w,Cr=_.make_wl_keys,Rr=_.shuffle,Pr=_.combine_zip,Mr=_.parse_qs_to_phrase_config,Dr=_.parse_count_val,br=function(r,n){return rr._2(_.make_phrases,r,n)},Jr=function(r,n){return rr._2(_.make_separators,r,n)};
