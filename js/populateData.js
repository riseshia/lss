// width is times of T
function populateSinusoid(sinu, width) {
  var cos = [];

  period = 1/sinu.fre;
  max_t = period * width;
  interval = period/100;
  t = 0;

  while(t <= max_t) {
    cos.push({x: cut(1000*t), y: cut(sinu.exec(t))});
    t += interval;
  }

  return [
    {
      values: cos,
      key: 'Sinusoid',
      color: '#ff7f0e'
    }
  ];
}

function populateDiscrete(sinu, width) {
  var sam = [];

  period = 1/sinu.fre;
  max_t = period * width;
  interval = period/100;
  i = 0;

  while(i <= max_t) {
    sam.push({x: cut(i), y: cut(sinu.exec(i))});
    i += interval;
  }

  return [
    {
      values: sam,
      key: 'Sinusoid',
      color: '#ff7f0e'
    }
  ];
}

// Sampled x_n
function populateSpec(sinu) {
  var sam = [];

  str = "f = ";
  x_max = 3;
  x_min = -3;
  has_ali = (sinu.d_fre() >= 1);
  spectrum = {}
  ali = Math.round(sinu.d_fre()*100)/100;
  while(ali > x_min) {
    spectrum[Math.round(ali*100)/100] = sinu.amp;
    ali -= 2;
    if (!has_ali && ali < -1)
      break;
  }
  ali = Math.round(-1*sinu.d_fre()*100)/100;
  while(ali < x_max) {
    spectrum[Math.round(ali*100)/100] = sinu.amp;
    ali += 2;
    if (!has_ali && ali > 1)
      break;
  }
  if(sinu.dc != 0)
    spectrum[0] = sinu.dc;

  i=x_min;
  while(i <= x_max) {
    if (spectrum[i] == undefined)
      sam.push({label: "i"+i, value: 0, color: "#000000"});
    else {
      if (Math.abs(i) == Math.round(sinu.d_fre()*100)/100)
        sam.push({label: "i"+i, value: cut(spectrum[i]), color: "orange"});
      else
        sam.push({label: "i"+i, value: cut(spectrum[i]), color: "red"});

      str += i + "π, ";
    }
    i += 0.01;
    i = Math.round(i*100)/100;
  }

  str.substr(0, str.length-2);
  $("#x_n_explanation").text(str);

  return [
    {
      values: sam,
      key: 'Sampled Signal',
    }
  ];
}

function populate_h_w_a() {
  var line = [];

  w = -1;
  n = 2;

  while(w <= 1.02) {
    line.push({x: cut(w), y: cut(filter.amp(w))});

    w += 0.01;
  }

  return [
    {
      values: line,
      key: 'H(w) Amplitude',
      color: '#ff7f0e'
    }
  ];
}

function populate_h_w_p() {
  var line = [];

  w = -1;
  n = 2;

  while(w <= 1.02) {
    line.push({x: cut(w), y: cut(filter.phase(w))});

    w += 0.01;
  }

  return [
    {
      values: line,
      key: 'H(w) phase',
      color: '#ff7f0e'
    }
  ];
}

function populateSS(sinu, width) {
  var cos = [], sam = [];

  c_period = 1/sinu.fre;
  s_period = 1/s_fre;
  max_t = c_period * width;
  if (c_period < s_period)
     max_t = s_period * width;

  interval = c_period/200;
  t = 0;
  st = 0;

  while(t < max_t) {
    mst = cut(1000*t);
    sinu_res = cut(sinu.exec(t));
    cos.push([mst, sinu_res]);

    if (st - t <= 0) {
      sam.push([mst, sinu_res]);
      st += s_period;
    } else {
      sam.push([mst, 0]);
    }

    t += interval;
  }

  return [
    {
      key: 'Sampled',
      bar: true,
      values: sam
    },
    {
      key: 'Sinusoid',
      values: cos
    }
  ];
}
