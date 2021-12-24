// Generated by ReScript, PLEASE EDIT WITH CARE


function make_wl_keys(count) {
  var key_count = Math.imul(count, 5);
  var raw_bits = new Uint32Array(key_count);
  crypto.getRandomValues(raw_bits);
  var acc = [];
  var _idx = 0;
  while(true) {
    var idx = _idx;
    if (idx % 5 === 0) {
      acc.push(raw_bits.subarray(idx, idx + 5 | 0).map(function (x) {
                  return x % 6 + 1 | 0;
                }).join(""));
    }
    if ((idx + 1 | 0) === key_count) {
      return acc;
    }
    _idx = idx + 1 | 0;
    continue ;
  };
}

export {
  make_wl_keys ,
  
}
/* No side effect */
