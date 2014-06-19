////////////////////////
//  Convert Function  //
////////////////////////
function update_formula() {
  loadSinusoid();
  $("#x_t").text(x_t.to_s("t"));

  render_x_t();

  sampling();
}

function sampling() {
  val = $("#sampling-frequency").val();
  $("#f_s_ex").text(val);

  if (val == "")
    return;
  else
    window.s_fre = Number(val);

  digi = x_t.fre / s_fre;

  window.x_n = new Sinusoid(amp, digi, phase, dc);

  $("#x_n").text(x_n.to_s("n"));

  render_x_n();
  render_x_n2();
  render_x_n_s();

  window.fir_n = Number($("#filter-n").val());
  fir_filter(fir_n);
}

function clear_graph(name) {
  id = "#graph-" + name;

  d3.select(id + " svg").remove();
  $(id).html("<svg></svg>");
}

function aliasing() {
  // Clear Graph after sampling
  clear_graph("h_w_a");
  clear_graph("h_w_p");
  clear_graph("h_n_x");
  clear_graph("h_n_y");
  clear_graph("y_n");
  clear_graph("x_t2");
  clear_graph("y_t");

  // Alert to user
  $("#sampling-frequency").parent().parent().addClass("has-error");
  $("#aliasing-text").text("Aliasing!!!");
}

function fir_filter(k) {
  if (x_t.fre * 2 > s_fre) {
    aliasing();
    return;
  } else {
    $("#sampling-frequency").parent().parent().removeClass("has-error");
    $("#aliasing-text").text("");
  }

  arr = $("#filter-n").val().split(",");
  for(i=0;i!=arr.length;i++)
    arr[i] = Number(arr[i]);

  if (!FilterUtil.is_valid(arr)) {
    alert("사용하실수 없는 필터입니다. 대칭 형태의 필터를 입력해주세요. \nex) '0,1' '1,2,1' '1,1'");
    window.filter = new Filter([1]);
  } else {
    window.filter = new Filter(arr);
  }

  $("#h_z").html(filter.ztrans());

  window.y_n = new Sinusoid(x_n.amp * filter.amp(x_n.d_fre()), x_n.fre, x_n.phase + filter.phase(x_n.d_fre()), x_n.dc);
  $("#y_n").text(y_n.to_s("n"));

  render_h_w_a();
  render_h_w_p();

  render_y_n();
  render_h_n_x();
  render_h_n_y();

  reconstruction();
}

function reconstruction() {
  window.y_t = new Sinusoid(y_n.amp, y_n.fre * s_fre, y_n.phase, y_n.dc);

  $("#y_t").text(y_t.to_s("t"));

  render_y_t();
  render_y_t2();
  render_x_t2();
}

////////////////////////
//   Sinusoid Class   //
////////////////////////
var Sinusoid = (function() {
  function Sinusoid(amp, fre, phase, dc) {
    this.amp = amp;
    this.fre = fre;
    this.phase = phase;
    this.dc = dc;
  }

  Sinusoid.prototype.to_s = function(unit) {
    var str;
    str = num_to_s(this.amp);
    str += "cos(";
    str += num_to_s(this.fre * 2);
    str += "π";
    str += unit;
    if (this.phase > 0)
      str += "+";
    str += num_to_s(this.phase);
    if (this.phase != 0)
      str += "π"
    str += ")";
    return str += pnum_to_s(this.dc);
  };

  Sinusoid.prototype.exec = function(t) {
    return Math.cos(Math.PI * (2 * this.fre * t + this.phase)) * this.amp + this.dc;
  };

  // 단위는 PI
  Sinusoid.prototype.d_fre = function() {
    return this.fre * 2;
  };

  return Sinusoid;
})();

////////////////////////
//   Util  Function   //
////////////////////////
function cut(i) {
  return Math.round(i*10000)/10000;
}

function num_to_s(i) {
  i = cut(i);
  str = ""
  if (i == 0 || i == 1)
    return "";
  else if (i == -1)
    str += "-";
  else
    str += i;

  return str;
}

function cal_aliasing() {
  ali_fre = x_n.d_fre();
  while(ali_fre > 1)
    ali_fre -= 2;

  return ali_fre;
}

function has_aliasing() {
  return x_t.fre * 2 > s_fre;
}

function pnum_to_s(i) {
  if (i == 0)
    return "";
  else if (i == 1)
    return "+1"
  else if (i > 0)
    return "+" + num_to_s(i);
  else
    return "-" + Math.abs(i);
}

function loadSinusoid() {
  amp = Number($("#amplitude").val());
  fre = Number($("#frequency").val());
  phase = Number($("#phase").val());
  dc = Number($("#dc").val());

  window.x_t = new Sinusoid(amp,fre,phase,dc);
}

$(document).ready(function() {
  update_formula();

  $("#x_t-update").click(function() { update_formula(); return false; });

  test();
})
