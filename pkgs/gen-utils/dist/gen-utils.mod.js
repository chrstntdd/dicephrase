var B=Object.defineProperty;var F=(n,e)=>{for(var t in e)B(n,t,{get:e[t],enumerable:!0})};var E={};F(E,{combine_zip:()=>Y,count_fallback:()=>m,count_key:()=>k,count_max:()=>L,count_min:()=>D,make_phrases:()=>j,make_separators:()=>W,make_wl_keys:()=>M,nullable_to_option:()=>p,parse_count_val:()=>X,parse_qs_to_phrase_config:()=>G,random_sep_chars:()=>V,sep_fallback:()=>w,sep_key:()=>y,shuffle:()=>J,str_to_int:()=>c});var f=2147483647,l=-2147483648;function v(n){return n>f?f:n<l?l:Math.floor(n)}function A(n){return n===void 0?{BS_PRIVATE_NESTED_SOME_NONE:0}:n!==null&&n.BS_PRIVATE_NESTED_SOME_NONE!==void 0?{BS_PRIVATE_NESTED_SOME_NONE:n.BS_PRIVATE_NESTED_SOME_NONE+1|0}:n}function S(n){if(!(n!==null&&n.BS_PRIVATE_NESTED_SOME_NONE!==void 0))return n;var e=n.BS_PRIVATE_NESTED_SOME_NONE;if(e!==0)return{BS_PRIVATE_NESTED_SOME_NONE:e-1|0}}function h(n){return A(n)}function s(n,e){if(e!==void 0)return n(S(e))}var O="phrase-count",T="separator",N=6,R=10,C="random",P=8,H="\xA0",q="-",K=".",$="$",Z="random",g=["_",",","!","@","*","&","^","~",q,$,K,H];function M(n){var e=Math.imul(n,5),t=new Uint32Array(e);crypto.getRandomValues(t);for(var r=[],i=0;;){var o=i;if(o%5===0&&r.push(t.subarray(o,o+5|0).map(function(a){return a%6+1|0}).join("")),(o+1|0)===e)return r;i=o+1|0}}function J(n){for(var e=n,t=n.length,r=0;t>0;){t=t-1|0;var i=Math.random();r=v(i*t);var o=e[t];e[t]=e[r],e[r]=o}return e}function Y(n,e){for(var t=n.length,r=[],i=0;;){var o=i;if(o===t)return r;var a=n[o];r.push(a);var _=e[o];r.push(_),i=o+1|0}}function c(n){var e=parseInt(n,10),t=isNaN(e);if(!t)return e}var k=O,y=T,D=6,L=10,m=8,w=C;function p(n){if(n!==null)return h(n)}function G(n){var e=new URLSearchParams(n),t=p(e.get(k)),r=p(e.get(y)),i=s(function(a){var _=c(a);return s(function(d){if(d>=D&&d<=L)return _},_)},t),o=s(function(a){if(/(random|\u00a0|-|\.|\$)/.test(a))return a},r);return i!==void 0&&o!==void 0?{count:i,sep:o}:{count:m,sep:w}}function X(n){var e=c(n);return e!==void 0?e:m}function j(n,e){for(var t=M(n),r=t.length,i=new Array(r),o=0;;){var a=o;if(a===r)return i;var _=t[a];i[a]=e[_],o=a+1|0}}var V=g;function W(n,e){var t=e-1|0;if(n!=="random")return new Array(t).fill(n);for(var r=[];r.length<t;)r.push(J(V.slice())[0]);return r}var u=E,nn=u.make_wl_keys,en=u.shuffle,tn=u.combine_zip,rn=u.parse_qs_to_phrase_config,on=u.parse_count_val,an=u.make_phrases,un=u.make_separators;export{P as PHRASE_COUNT_FALLBACK,O as PHRASE_COUNT_KEY,R as PHRASE_COUNT_MAX,N as PHRASE_COUNT_MIN,g as RANDOM_SEPARATOR_OPTS,C as SEPARATOR_FALLBACK,T as SEPARATOR_KEY,q as VAL_DASH,$ as VAL_DOLLAR,K as VAL_PERIOD,Z as VAL_RANDOM,H as VAL_SPACE,tn as combine_zip,an as make_phrases,un as make_separators,nn as make_wl_keys,on as parse_count_val,rn as parse_qs_to_phrase_config,en as shuffle};
