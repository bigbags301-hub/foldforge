(function(){
  document.getElementById('yr').textContent=new Date().getFullYear();
  // Illustrative Monte Carlo fan: deterministic seeded paths, not real data.
  var svg=document.getElementById('fan'); if(!svg) return;
  var NS='http://www.w3.org/2000/svg', W=600,H=420,P=36,N=60,T=120, seed=7;
  function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
  var base=[];for(var i=0;i<T;i++){base.push(rnd()<0.6?0.9+rnd()*0.9:-(1.0+rnd()*1.2));}
  var s=base.reduce(function(a,b){return a+b;},0),adj=(18-s)/T;base=base.map(function(v){return v+adj;});
  var paths=[],lo=0,hi=0;
  for(var n=0;n<N;n++){
    var a=base.slice();for(var j=a.length-1;j>0;j--){var k=Math.floor(rnd()*(j+1));var t=a[j];a[j]=a[k];a[k]=t;}
    var eq=[0],peak=0,dd=0;for(var m=0;m<T;m++){var v=eq[m]+a[m];eq.push(v);peak=Math.max(peak,v);dd=Math.max(dd,peak-v);}
    paths.push({eq:eq,dd:dd});eq.forEach(function(v){lo=Math.min(lo,v);hi=Math.max(hi,v);});
  }
  var ddLimit=paths.map(function(p){return p.dd;}).sort(function(a,b){return b-a;})[2]+0.01;
  function x(i){return P+i*(W-2*P)/T;} function y(v){return H-P-(v-lo)*(H-2*P)/(hi-lo);}
  function el(n,at){var e=document.createElementNS(NS,n);for(var k in at)e.setAttribute(k,at[k]);return e;}
  svg.appendChild(el('line',{x1:P,x2:W-P,y1:y(0),y2:y(0),stroke:'#2f4560','stroke-dasharray':'4 4'}));
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  paths.forEach(function(p,idx){
    var d=p.eq.map(function(v,i){return (i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1);}).join('');
    var bad=p.dd>=ddLimit;
    var path=el('path',{d:d,fill:'none',stroke:bad?'#e98a6f':'#d9a33a','stroke-width':bad?2:1,'stroke-opacity':bad?1:0.28});
    svg.appendChild(path);
    if(!reduce){var L=path.getTotalLength();path.style.strokeDasharray=L;path.style.strokeDashoffset=L;
      path.style.transition='stroke-dashoffset 1.8s cubic-bezier(.2,.7,.2,1) '+(idx*18)+'ms';
      requestAnimationFrame(function(){requestAnimationFrame(function(){path.style.strokeDashoffset=0;});});}
  });
  var lab=el('text',{x:P,y:22,fill:'#a9b2bd','font-size':'13','font-family':'Instrument Sans, sans-serif'});
  lab.textContent='Equity, 60 reshuffles of the same 120 trades';svg.appendChild(lab);
  // Lightweight click tracking hook (wire to analytics once an account exists)
  document.addEventListener('click',function(e){var a=e.target.closest('[data-track]');if(a&&window.plausible)window.plausible(a.dataset.track);});
})();
