window.Filter = (function() {
  function Filter(b_k) {

    this.b_k = b_k;
    if (!FilterUtil.is_valid(this.b_k)) {
      this.b_k = [1];
    }

    zero_count = 0;
    while(b_k[zero_count] == 0)
      zero_count += 1;

    this.phase_c = (b_k.length - zero_count - 1)/2 + zero_count;

    amp = [];
    mid = Math.round(this.phase_c);
    for(i=mid; i!=b_k.length; i++) {
      if (i == this.phase_c)
        amp.push({a: b_k[i], f: i - this.phase_c});
      else
        amp.push({a: 2*b_k[i], f: i - this.phase_c});
    }

    this.amp_c = amp;
  }

  Filter.prototype.ztrans = function() {
    b_k = this.b_k;

    i = 0;
    while(b_k[i] == 0)
      i += 1;

    html = "";
    if (i == 0)
      html += b_k[i];
    else
      html += "" + num_to_s(b_k[i]) + "z<sup>" + i*-1 + "</sup>";

    i += 1;
    while(i != b_k.length) {
      if (b_k[i] != 0)
        html += " + " + num_to_s(b_k[i]) + "z<sup>" + i*-1 + "</sup>";
      i++;
    }

    return html;
  }

  // 단위는 PI
  Filter.prototype.phase = function(omega) {
    raw = -1 * omega * this.phase_c;

    while(raw > 1)
      raw -= 2;
    while(raw < -1)
      raw += 2;

    return raw;
  };

  // 단위는 PI
  Filter.prototype.amp = function(omega) {
    sum = 0;
    amp_c = this.amp_c;

    for(i=0; i!= amp_c.length; i++) {
      cos = amp_c[i];
      sum += cos.a * Math.cos(cos.f * Math.PI * omega);
    }

    return Math.abs(sum);
  };

  return Filter;
})();

window.FilterUtil = {
  is_valid: function(b_k) {
    var ep, sp;
    sp = 0;
    ep = b_k.length - 1;
    zero_count = 0;

    while (b_k[sp] === 0) {
      sp += 1;
      zero_count += 1;
    }

    while (sp < ep) {
      if (typeof b_k[sp] === "string" || typeof b_k[ep] === "string") {
        return false;
      }
      if (b_k[sp] !== b_k[ep]) {
        return false;
      }
      sp += 1;
      ep -= 1;
    }
    if (typeof b_k[sp] === "string") {
      return false;
    }
    return true;
  }
};
