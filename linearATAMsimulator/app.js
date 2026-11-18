import {generateSystem,normalizeSystem,compileSystem,makeRng,choose,parseTarget,positiveTernary} from './engine.js?v=2';
import {planSummary,NEW_KINDS} from './constructions.js?v=2';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={book:'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-3-2H4z M22 4h-6a3 3 0 0 0-3 3v14a4 4 0 0 1 3-2h6z',upload:'M12 16V3m-5 5 5-5 5 5 M4 15v6h16v-6',download:'M12 3v13m-5-5 5 5 5-5 M4 16v5h16v-5',flask:'M9 3h6m-5 0v7L4 20q-1 2 2 2h12q3 0 2-2l-6-10V3 M7 15h10',sliders:'M4 6h7m6 0h3M4 18h3m6 0h7 M11 3v6h6V3z M7 15v6h6v-6z',play:'m8 4 13 8-13 8z',pause:'M8 4v16M16 4v16',spark:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',edit:'m15 4 5 5M4 20l5-1L21 7l-4-4L5 15z',tiles:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',activity:'M2 12h5l3-8 4 16 3-8h5',chart:'M3 3v18h18M7 17v-5M12 17V6M17 17v-8',list:'M8 6h13M8 12h13M8 18h13M3 6h.1M3 12h.1M3 18h.1',info:'M12 11v6m0-10h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',reset:'M3 10a9 9 0 1 1 1 8M3 4v6h6',shuffle:'M3 5h3c5 0 7 14 12 14h3M17 15l4 4-4 4M3 19h3c2 0 4-3 5-6m3-4c1-2 3-4 4-4h3M17 1l4 4-4 4',plus:'M12 4v16M4 12h16'};
const icon=name=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(icons[name]||icons.info)+'"/></svg>';
const iconSpan=name=>'<span class="icon">'+icon(name)+'</span>';
document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));
const names={one:'One-pad',two:'Two-pad OR',flexible:'Flexible glues'},roles={seed:'Seed',path:'Initial path',advance:'Advance',resetA:'Reset',resetB:'Reset / pool',custom:'Custom'};
let system,compiled,analysis=null,batch=null,analysisWorker=null,batchWorker=null,sourceMode='generate',view='graphical',tileLimit=100,playTimer=null,sample=null,sampleCounter=0,windowStart=0,autoFollow=true,toastTimer=null,generation=0,constructionWorker=null;
const count=n=>n.toLocaleString('en-US');
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
function logInt(s){s=String(s).replace(/^[-+]/,'');if(/^0+$/.test(s))return -Infinity;const n=s.slice(0,15);return Math.log10(Number(n))+(s.length-n.length);}
function logFraction(s){const [n,d='1']=String(s).split('/');return logInt(n)-logInt(d);}
function approx(s){return s==null?NaN:10**logFraction(s);}
function sci(log,precision=3){if(log===-Infinity)return '0';if(!Number.isFinite(log))return '—';let e=Math.floor(log),mant=Number((10**(log-e)).toPrecision(precision));if(mant>=10){mant=1;e++;}return (mant===1?'':mant+' × ')+'10<sup>'+e+'</sup>';}
function formatExact(s){if(!s)return '—';const log=logFraction(s);if(log>=7)return sci(log);const n=approx(s);if(!s.includes('/'))return count(Math.round(n));return n.toLocaleString('en-US',{maximumFractionDigits:3});}
function formatNum(n,d=2){if(!Number.isFinite(n))return '—';if(Math.abs(n)>=1e7)return sci(Math.log10(Math.abs(n)));return n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});}
function formatSD(){if(!analysis?.variance)return '—';const log=logFraction(analysis.variance)/2;return log>=7?sci(log):(log===-Infinity?'0':formatNum(10**log));}
function save(){try{localStorage.setItem('linear-assembly-lab-v1',JSON.stringify({system,sourceMode,target:$('target').value,seed:$('rngSeed').value,trials:$('trials').value,cap:$('stepCap').value,epsilon:$('epsilon').value}));}catch{}}
function source(mode){sourceMode=mode;$('generatePanel').hidden=mode!=='generate';$('customPanel').hidden=mode!=='custom';['generate','custom'].forEach(x=>{const e=$(x+'Mode');e.classList.toggle('active',x===mode);e.setAttribute('aria-pressed',String(x===mode));});save();}
function tab(name){document.querySelectorAll('[data-tab]').forEach(e=>{const on=e.dataset.tab===name;e.classList.toggle('active',on);e.setAttribute('aria-selected',String(on));});['overview','tiles','analysis'].forEach(x=>$(x+'Panel').hidden=x!==name);if(name==='tiles')renderTiles();if(name==='analysis')renderAnalysis();if(name==='overview')renderSample();}
function setView(mode){if(compiled?.virtual)mode='numerical';view=mode;$('visualView').hidden=mode!=='graphical';$('numericalView').hidden=mode!=='numerical';['graph','numeric'].forEach(x=>{const on=(x==='graph')===(mode==='graphical');$(x+'View').classList.toggle('active',on);$(x+'View').setAttribute('aria-pressed',String(on));});renderSample();}
function large(){if(compiled?.virtual)return true;return analysis?.mean?logFraction(analysis.mean)>5:!!system?.construction&&parseTarget(system.construction.target)>100000n;}
function applySystem(next,mode='custom',initial=false){
 const normalized=normalizeSystem(next),c=compileSystem(normalized);
 constructionWorker?.terminate();constructionWorker=null;generationButton(false);
 pause();cancelBatch(false);analysisWorker?.terminate();generation++;const gen=generation;
 system=c.system;compiled=c;analysis=null;batch=null;tileLimit=100;sampleCounter=0;
 $('targetError').hidden=true;source(mode);$('modelSelect').value=system.model;customHelp();
 if(system.construction){
  const m=system.construction;$('target').value=m.target.length<=40?m.target:/^10+$/.test(m.target)?'10^'+(m.target.length-1):m.target;
  $('constructionKind').value=m.kind;$('constructionBase').value=m.base||'auto';
  if(m.epsilon){$('constructionEpsilon').value=m.epsilon;$('constructionDelta').value=m.delta;$('constructionBlocks').value=m.blocks;}
 }
 constructionFields();
 for(const id of ['graphView','playSample','stepSample','newSample','resetSample','runBtn','editLibrary','editorBtn','speed'])$(id).disabled=!!c.virtual;
 $('graphView').title=c.virtual?'This recipe is too large to list; use numerical analysis.':'';
 $('costMetric').innerHTML=formatExact(String(c.charged));$('distinctMetric').innerHTML=formatExact(String(c.distinct));$('tileTabCount').innerHTML=formatExact(String(c.distinct));
 $('meanMetric').innerHTML=system.construction?formatExact(system.construction.target):'…';$('sdMetric').textContent='…';$('exactBadge').textContent='Exact';$('meanFoot').textContent='including seed';$('sdFoot').textContent='length variability';
 $('systemStatus').innerHTML=c.virtual?'Compact recipe':c.haltable?'Haltable system<span class="status-check">✓</span>':'Nonhalting paths';
 $('statusBanner').hidden=c.haltable;$('statusBanner').classList.toggle('error',!c.haltable);
 if(!c.haltable)$('statusBanner').textContent='Some reachable interfaces cannot reach a terminal interface. Termination is not almost sure, and expected terminal length is infinite.';
 $('runHelp').textContent=c.virtual?'Compact recipe: exact analysis only.':'Reproducible sampling. Runs in your browser.';
 renderDigits();renderConstructionReport();renderTiles();resetSample(true);setView(large()?'numerical':'graphical');
 if(initial&&!large())step(12);
 renderBatch();renderChart();renderAnalysis();warnings();save();
 analysisWorker=new Worker('./worker.js?v=2',{type:'module'});
 analysisWorker.onmessage=({data})=>{
  if(gen!==generation)return;
  if(data.kind==='error'){toast(data.message);$('meanMetric').textContent='Unavailable';analysisWorker.terminate();analysisWorker=null;return;}
  analysis=data.result;$('meanMetric').innerHTML=analysis.status==='nonhalting'?'∞':formatExact(analysis.mean);$('sdMetric').innerHTML=formatSD();$('exactBadge').textContent=analysis.mean?'Exact':'—';
  $('sdFoot').textContent=analysis.variance===null?'not finite / not computed':analysis.variance==='0'?'deterministic length':'rounded from exact variance';
  if(analysis.status==='limit'){$('statusBanner').hidden=false;$('statusBanner').classList.remove('error');$('statusBanner').textContent=analysis.reason+' Random simulation remains available.';}
  if(large()&&c.haltable){$('statusBanner').hidden=false;$('statusBanner').classList.remove('error');$('statusBanner').textContent=c.virtual?'Compact construction: more than 10,000 tile entries. Exact statistics and a portable recipe are available; literal simulation is disabled.':'Large target: exact analytical moments are available without growing the full assembly. Trials still respect their attachment limits.';}
  if(large()&&view==='graphical')setView('numerical');
  renderSample();renderAnalysis();renderChart();renderBatch();renderConstructionReport();warnings();
  if(initial&&!large()&&c.haltable)runBatch();
  analysisWorker.terminate();analysisWorker=null;
 };
 analysisWorker.onerror=()=>{toast('The analysis worker could not start. Reload to retry.');$('meanMetric').textContent='Unavailable';};
 analysisWorker.postMessage({action:'analyze',system});
}
function constructionFields(){
 const kind=$('constructionKind').value,hp=kind.startsWith('concentrated');
 $('baseField').hidden=!(kind==='two-pad-mean'||kind==='concentrated-two');$('concentrationFields').hidden=!hp;
 $('constructionHelp').textContent=kind==='positive-ternary'?'Positive ternary with indexed glues.':kind==='two-pad-mean'?'Redundant base-b digits with a shared reset pool.':kind==='concentrated-one'?'Independent bijective-binary blocks with private glues.':'Independent shared-pool blocks with private glues.';
}
function groupDescription(p){
 if(p.blocks==='0')return 'Only the inert seed is needed: L = 1.';
 if(p.fallback)return 'A length-N deterministic line is no more expensive than the selected certified block system.';
 return p.groups.map(g=>formatExact(g.count)+' block'+(g.count==='1'?'':'s')+' of mean '+formatExact(g.mean)+(g.base?' (b = '+g.base+')':'')).join('; ')+'.';
}
function formatBound(value){if(value==='0')return '0';const log=logFraction(value);return log<-4?sci(log):probability(Math.min(1,approx(value)));}
function renderConstructionReport(){
 const root=$('constructionReport'),p=compiled?.generated?planSummary(compiled.generated):null;
 root.hidden=!p?.guarantee;if(root.hidden)return;
 const g=p.guarantee;root.classList.toggle('pending',!g.certified);
 let html='<div class="certificate-top"><h3>'+(g.certified?'Certified concentration':'Concentration experiment')+'</h3><span class="certificate-tag '+(g.certified?'':'pending')+'">'+(g.certified?'GUARANTEE PROVED':'BOUND ABOVE REQUESTED δ')+'</span></div>';
 html+='<p>P(|L − N| &gt; εN) ≤ <strong title="'+esc(g.upper)+'">'+formatBound(g.upper)+'</strong>. Requested δ = '+formatBound(p.delta)+'; ε = '+esc(p.epsilon)+'. '+(g.certified?'':'This sufficient bound does not certify δ; the actual failure probability may be smaller.')+'</p>';
 html+='<div class="construction-groups">'+groupDescription(p)+' Bound: '+esc(g.method)+'.</div>';
 const d=analysis?.distribution,N=approx(p.target),eps=approx(p.epsilon),t=eps*N;
 if(d&&Number.isFinite(N)){
  const inside=d.pmf.reduce((sum,m,L)=>sum+(Math.abs(L-N)<=t?m:0),0),upper=Math.max(0,Math.min(1,1-inside));
  html+='<p class="numerical-check">Floating-point Markov prediction: failure '+(d.maxLength>=Math.floor(N+t)?'≈ '+probability(upper):'between ≈ '+probability(Math.max(0,upper-d.tail))+' and '+probability(upper))+'. This numerical prediction is separate from the certificate.</p>';
 }
 if(batch&&Number.isFinite(N)){
  const failed=batch.lengths.reduce((sum,L,i)=>sum+(batch.terminated[i]&&Math.abs(L-N)>t?1:0),0);
  html+='<p class="numerical-check">Trials at this construction’s ε: '+count(failed)+' observed failures / '+count(batch.started)+' started'+(batch.capped?'; '+count(batch.capped)+' outcomes censored by the attachment limit':' (sample failure '+probability(failed/batch.started)+')')+'.</p>';
 }
 root.innerHTML=html;
}
function blockEncoding(g){
 if(g.family==='deterministic'||g.mean==='1')return 'Deterministic path of '+esc(g.mean)+' attachments';
 if(g.family==='one')return 'Bijective binary: ['+g.digits.join(', ')+']'+(BigInt(g.mean)%2n?' + one forced prefix tile':'');
 if(!g.coefficients.length)return 'Deterministic path; h = '+g.h;
 return 'b = '+g.base+', h = '+g.h+'; c = ['+g.coefficients.join(', ')+']; j = ['+g.coefficients.map(c=>c-(2*g.base-1)).join(', ')+']';
}
function renderGeneratedAnalysis(){
 const p=analysis.construction,g=p.guarantee;$('analysisMethod').textContent='EXACT BLOCK MOMENTS';
 let html='<div class="analysis-inner"><div class="analysis-grid"><div class="analysis-stat"><h3>Expected total length E[L] · exact</h3><div class="exact-number">'+esc(analysis.mean)+'</div></div><div class="analysis-stat"><h3>Variance Var(L) · exact</h3><div class="exact-number">'+esc(analysis.variance)+'</div></div></div>';
 html+='<div class="analysis-facts"><span>'+names[system.model]+' model</span><span>'+formatExact(p.blocks)+' independent block'+(p.blocks==='1'?'':'s')+'</span><span>Almost-sure termination</span><span>Equimolar · seed included</span></div>';
 html+='<div class="analysis-section"><h3>Construction</h3><p>'+groupDescription(p)+' Each block has its own glue namespace. The final successful tile exposes the next block’s input interface, so joining blocks adds no tile.</p><p>Exact charged and distinct tile count, including the seed: <span class="exact-number">'+esc(p.charged)+'</span>.</p>';
 if(p.groups.length)html+='<div class="table-scroll"><table class="block-table"><thead><tr><th>Copies</th><th>Mean attachments</th><th>Types / block</th><th>Encoding</th></tr></thead><tbody>'+p.groups.map(x=>'<tr><td title="'+esc(x.count)+'">'+formatExact(x.count)+'</td><td class="exact-number">'+esc(x.mean)+'</td><td>'+esc(x.cost)+'</td><td><code>'+blockEncoding(x)+'</code></td></tr>').join('')+'</tbody></table></div>';
 html+='</div><div class="analysis-section"><h3>Exact moments and termination</h3><p>Each random block retries a finite experiment until success, with strictly positive success probability. Every block and the finite concatenation terminate almost surely. Let A be one attempt’s length, p its success probability, and X the total block length. Renewal gives:</p><div class="formula">E[X] = E[A] / p<br>E[X²] = (E[A²] + 2E[X]E[A · 1<sub>reset</sub>]) / p<br>E[L] = 1 + Σᵢ E[Xᵢ] = N<br>Var(L) = Σᵢ Var(Xᵢ)</div><p>Fixed prefix tiles add to the mean and leave the variance unchanged. Attempt moments are evaluated from the displayed digit encodings with arbitrary-precision integer arithmetic. All generated rules are verified before these formulas are used.</p></div>';
 if(g)html+='<div class="analysis-section"><h3>Probability certificate</h3><p>For ε = '+esc(p.epsilon)+' and requested δ = '+esc(p.delta)+', the rigorous upper bound on P(|L − N| &gt; εN) is:</p><div class="exact-number">'+esc(g.upper)+'</div><p>Method: '+esc(g.method)+'. '+(g.certified?'This proves the requested guarantee.':'This bound exceeds δ. It does not determine whether the actual failure probability exceeds δ.')+'</p><div class="formula">t = εN<br>P(|L − N| &gt; t) ≤ min(1, Var(L) / t²,<br>&nbsp; 2 exp[−t² / (8ΣᵢMᵢ² + 4Mₘₐₓt)])</div><p>The sum and maximum in the exponential bound omit deterministic blocks. Residual means within a random block are at most 2Mᵢ. The exponential term is rounded upward to a dyadic rational using exact integer arithmetic. Automatic mode retains a certified block count and uses a deterministic line when it costs no more; it does not claim the least possible number of blocks or tiles.</p></div>';
 html+='<div class="analysis-section"><h3>Computational scope</h3><p>'+(p.recipeOnly?'The tile list exceeds the 10,000-entry limit. System JSON stores a compact recipe, not a literal tile list. Importing it into this version reconstructs the exact statistics and certificate.':analysis.distribution?'Floating-point Markov propagation runs through length '+count(analysis.distribution.maxLength)+'. Remaining probability mass: '+probability(analysis.distribution.tail)+'.':'A full distribution is omitted at this scale. Capped literal trials and exact moments remain available.')+' Numerical probability predictions and empirical frequencies are separate from the rigorous certificate. Scientific notation and standard deviations are rounded.</p><p><a class="method-link" href="./CONSTRUCTIONS.md" target="_blank" rel="noopener">Read the construction formulas and certificate proof</a>.</p></div></div>';
 $('analysisContent').innerHTML=html;
}
function renderDigits(){
 const box=$('digitSummary');
 if(compiled.generated){const p=planSummary(compiled.generated);box.innerHTML='<div class="summary-label">'+(p.fallback?'Deterministic fallback':p.kind==='two-pad-mean'?'Shared reset pool':'Independent block construction')+'</div><p class="digit-caption">'+groupDescription(p)+'<br>All new tile types have multiplicity 1.</p>';return;}
 if(!system.construction){box.innerHTML='<p class="digit-caption">Generate a target to inspect its construction.</p>';return;}
 const n=BigInt(system.construction.target),digits=positiveTernary(n-1n);
 if(!digits.length){box.innerHTML='<div class="summary-label">Seed-only construction</div><p class="digit-caption" style="margin-top:10px">The inert seed is terminal. <strong>L = 1</strong> deterministically.</p>';return;}
 box.innerHTML='<div class="summary-label"><span>Positive ternary of N − 1</span><span>'+count(digits.length)+' digit'+(digits.length===1?'':'s')+'</span></div><div class="digit-row">'+digits.slice(0,24).map(x=>'<span class="digit">'+x+'</span>').join('')+(digits.length>24?'<span class="digit">…</span>':'')+'</div><p class="digit-caption">'+(digits.length<=12?'('+digits.join('')+')⁺₃ = <strong>'+count(n-1n)+'</strong>':'Three charged entries per later digit.')+'<br>Unique endpoint glues for every digit.</p>';
}
function customHelp(){const m=$('modelSelect').value;$('customModelHelp').textContent=m==='one'?'A tile attaches when its west glue matches the exposed east glue.':m==='two'?'Either corresponding pad may match. A double match counts once.':'Define symmetric compatible label pairs; equality alone does not bind.';}
function warnings(){const msg=compiled.virtual?'The recipe exceeds the 10,000-entry display limit. Export its specification or choose a smaller system.':!compiled.haltable?'This system has nonhalting paths. Trials may be capped.':large()?'The expected length exceeds practical graphical size. Use analytical results, or inspect a limited prefix.':analysis?.meanNumber>Number($('stepCap').value)?'The attachment limit is below the expected length. Capped trials will be reported separately.':'';$('runWarning').hidden=!msg;$('runWarning').textContent=msg;}
function resetSample(resetCounter=false){pause();if(resetCounter)sampleCounter=0;sample={rng:makeRng($('rngSeed').value+':explorer:'+sampleCounter),state:system.seed,length:1,trace:[],terminal:compiled.choices(system.seed).total===0,capped:false};windowStart=0;autoFollow=true;$('tileInfo').textContent='Select a tile to inspect its glue labels.';renderSample();}
function step(n=1){
 if(compiled.virtual||sample.terminal||sample.capped)return;const cap=Number($('stepCap').value);
 for(let k=0;k<n;k++){
  if(sample.length-1>=cap){sample.capped=true;break;}
  const i=choose(compiled.choices(sample.state),sample.rng);if(i===null){sample.terminal=true;break;}
  sample.state=system.tiles[i].east;sample.length++;if(sample.trace.length<5000)sample.trace.push(i);
  if(compiled.choices(sample.state).total===0){sample.terminal=true;break;}
  if(sample.length-1>=cap){sample.capped=true;break;}
 }
 if(sample.terminal||sample.capped)pause();
 if(sample.length>5001&&view==='graphical'){setView('numerical');}
 renderSample();
}
function pause(){if(playTimer){clearInterval(playTimer);playTimer=null;}if($('playSample'))$('playSample').innerHTML=iconSpan('play')+'Play';}
function play(){if(compiled.virtual)return;if(playTimer){pause();renderSample();return;}if(sample.terminal||sample.capped)resetSample();const rate=Number($('speed').value);playTimer=setInterval(()=>step(Math.max(1,Math.round(rate/20))),rate<20?1000/rate:50);$('playSample').innerHTML=iconSpan('pause')+'Pause';renderSample();}
function renderSample(){
 if(!sample||!compiled)return;
 if(compiled.virtual){
  const p=planSummary(compiled.generated);$('sampleBadge').textContent='RECIPE';$('sampleBadge').classList.remove('complete');
  $('assemblySubtitle').textContent='Exact construction statistics without expanding every tile type.';
  $('currentLength').textContent='—';$('currentGlue').textContent='Not materialized';$('nextOptions').textContent='Numerical analysis only';$('stepSample').disabled=true;
  $('numericalView').innerHTML='<h3>Compact construction recipe</h3><p>Expected total length</p><div class="numeric-main">'+formatExact(p.target)+'</div><p>The specified construction has '+formatExact(p.charged)+' tile types. Its exact moments and probability certificate are computed from its blocks, without generating the full tile list.</p><div class="numeric-details"><div>Independent blocks<strong>'+formatExact(p.blocks)+'</strong></div><div>Tile entries, including seed<strong>'+formatExact(p.charged)+'</strong></div><div>Export format<strong>System JSON recipe</strong></div></div>';
  return;
 }
 const len=sample.length,choices=compiled.choices(sample.state),terminal=sample.terminal,capped=sample.capped;
 $('sampleBadge').textContent=terminal?'TERMINAL':capped?'CAPPED':playTimer?'GROWING':'PAUSED';$('sampleBadge').classList.toggle('complete',terminal);
 $('assemblySubtitle').textContent=terminal?'Sample '+(sampleCounter+1)+' terminated after '+count(len-1)+' successful attachments.':capped?'Sample capped after '+count(len-1)+' attachments; terminal length is at least '+count(len)+'.':'Watch one possible assembly grow, one tile at a time.';
 $('currentLength').textContent=count(len);$('currentGlue').textContent=sample.state.replaceAll('|',' | ');$('currentGlue').title=sample.state;
 $('nextOptions').textContent=terminal?'None · terminal':count(choices.total)+' compatible entr'+(choices.total===1?'y':'ies');
 $('nextOptions').title=choices.options.map(({i})=>system.tiles[i].id+': '+system.tiles[i].multiplicity+'/'+choices.total).join('\n');
 $('stepSample').disabled=terminal||capped;
 if(view==='graphical'){
  const stored=sample.trace.length+1,avail=$('tileViewport').clientWidth||650,slots=Math.max(3,Math.floor((avail-35)/(window.innerWidth<=900?56:61)));
  const max=Math.max(0,stored-slots);if(autoFollow)windowStart=max;windowStart=Math.max(0,Math.min(windowStart,max));
  $('windowSlider').max=String(max);$('windowSlider').value=String(windowStart);$('windowSlider').disabled=max===0;$('positionLabel').textContent=count(windowStart+1);
  let html='';
  for(let p=windowStart;p<Math.min(stored,windowStart+slots);p++){
   const t=p===0?{id:'Seed',west:system.model==='two'?'⊥|⊥':'⊥',east:system.seed,role:'is-seed'}:system.tiles[sample.trace[p-1]];
   html+='<button class="assembly-tile '+t.role+'" data-position="'+p+'" title="'+esc(t.id+' · '+t.west+' → '+t.east+' · position '+(p+1))+'" aria-label="Inspect '+esc(t.id)+' at position '+(p+1)+'"><span class="tile-name">'+esc(t.id)+'</span><span class="tile-glues"><span>'+esc(t.west)+'</span><span>'+esc(t.east)+'</span></span><span class="tile-index">'+count(p+1)+'</span></button>';
  }
  if(windowStart+slots>=stored&&!terminal&&stored===len)html+='<div class="growth-front" title="Next attachment">+</div>';
  document.querySelector('.direction-label').innerHTML=(windowStart===0?'SEED':'POSITION '+count(windowStart+1))+'<span></span>GROWTH TO THE EAST';
  $('tileViewport').innerHTML=html;$('windowLabel').textContent='Tiles '+count(windowStart+1)+'–'+count(Math.min(stored,windowStart+slots))+' of '+count(len)+(len>stored?' · stored prefix':'');
 }else{
  const mean=analysis?.mean?formatExact(analysis.mean):system.construction?formatExact(system.construction.target):'…';
  $('numericalView').innerHTML='<h3>'+(large()?'Large-target analysis':'Numerical assembly view')+'</h3><p>Expected total length</p><div class="numeric-main">'+(analysis?.status==='nonhalting'?'∞':mean)+'</div><p>'+(large()?'Exact moments are computed from the tile rules. No full-length assembly needs to be materialized.':'Track the sample numerically, or switch to Graphical to inspect its stored tile sequence.')+'</p><div class="numeric-details"><div>Observed sample length<strong>'+count(len)+(capped?' (capped)':'')+'</strong></div><div>Current interface<strong>'+esc(sample.state.length>24?sample.state.slice(0,24)+'…':sample.state)+'</strong></div><div>Reachable interfaces<strong>'+count(compiled.states.length)+'</strong></div></div>';
 }
}
function renderTiles(){
 if(!system)return;
 if(compiled.virtual){
  const p=planSummary(compiled.generated);$('tileTable').innerHTML='<tr><td colspan="5" class="recipe-message">This construction contains '+formatExact(p.charged)+' tile types. Export System JSON for the compact recipe, or see Analysis for its block encodings. The full tile list exceeds the browser limit.</td></tr>';
  $('moreTiles').hidden=true;$('tileLibrarySubtitle').textContent=names[system.model]+' · compact recipe';$('tileLibraryFoot').innerHTML='Exact count: <span class="exact-number">'+esc(p.charged)+'</span> entries, all distinct and equimolar, including the seed.';return;
 }
 const rows=[{id:'Seed',west:system.model==='two'?'⊥ | ⊥':'⊥',east:system.seed,multiplicity:1,role:'seed'},...system.tiles.slice(0,tileLimit)];
 $('tileTable').innerHTML=rows.map(t=>'<tr><td><div class="tile-cell"><span class="tile-swatch '+(t.role==='seed'?'is-seed':t.role)+'"></span><span>'+esc(t.id)+'</span></div></td><td><code>'+esc(t.west.replaceAll('|',' | '))+'</code></td><td><code>'+esc(t.east.replaceAll('|',' | '))+'</code></td><td>'+count(t.multiplicity)+'</td><td><span class="role-label">'+(roles[t.role]||'Custom')+'</span></td></tr>').join('');
 $('moreTiles').hidden=system.tiles.length<=tileLimit;
 $('tileLibrarySubtitle').textContent=names[system.model]+' binding · each row is a nonseed glue pair, plus the seed.';
 let foot='<strong>'+count(compiled.charged)+' charged entries</strong> = 1 seed + '+count(compiled.charged-1)+' nonseed multiset entries. '+count(compiled.distinct)+' distinct glue pairs including the seed.';
 if(system.model==='flexible')foot+='<br>Symmetric compatibility pairs: '+(system.compatibility.slice(0,50).map(p=>'<code>'+esc(p.join(' ↔ '))+'</code>').join(', ')||'none')+(system.compatibility.length>50?'…':'');
 if(system.model==='two')foot+='<br>Compatibility uses OR over corresponding pads; matching both pads does not double the sampling weight.';
 $('tileLibraryFoot').innerHTML=foot;
}
const probability=p=>p===0?'0':p<.00001?p.toExponential(2):(p*100).toFixed(3)+'%';
function renderAnalysis(){
 if(!analysis){$('analysisContent').innerHTML='<div class="analysis-inner"><p class="help">Calculating length moments…</p></div>';return;}
 if(analysis.method==='exact-blocks'){renderGeneratedAnalysis();return;}
 $('analysisMethod').textContent=analysis.method==='exact-ternary'?'INTEGER RECURRENCE':analysis.status==='finite'?'RATIONAL MARKOV CHAIN':'REACHABILITY';
 let html='<div class="analysis-inner"><div class="analysis-grid"><div class="analysis-stat"><h3>Expected total length E[L] · exact</h3><div class="exact-number">'+(analysis.status==='nonhalting'?'∞':esc(analysis.mean||'Not computed'))+'</div></div><div class="analysis-stat"><h3>Variance Var(L) · exact</h3><div class="exact-number">'+esc(analysis.variance||'Not defined / not computed')+'</div></div></div><div class="analysis-facts"><span>'+count(analysis.states)+' reachable interfaces</span><span>'+count(analysis.terminals.length)+' terminal interfaces</span><span>'+(analysis.haltable?'Almost-sure termination':'Nonhalting paths reachable')+'</span><span>'+names[system.model]+' model</span></div>';
 html+='<div class="analysis-section"><h3>Termination</h3><p>'+(analysis.haltable?'Every reachable unfinished interface has a path to a terminal interface. In this finite system, growth terminates almost surely and its expected length is finite.':'At least one reachable interface has no path to a terminal interface. A random run has positive probability of never terminating, so E[L] is infinite.')+'</p><p>Terminal interfaces: <code>'+esc(analysis.terminals.join(', ')||'none')+'</code>.</p>';
 if(analysis.nonhaltingStates.length)html+='<p>Interfaces without a terminal path: <code>'+esc(analysis.nonhaltingStates.join(', '))+'</code>.</p>';html+='</div>';
 if(analysis.status==='finite'){
  html+='<div class="analysis-section">';
  if(analysis.method==='exact-ternary')html+='<h3>Positive-ternary moment recurrence</h3><p>Let hᵢ and vᵢ be the mean and variance of attachments needed by the prefix ending at gᵢ. For the first positive ternary digit, h₁ = a₁ and v₁ = 0. Each subsequent digit a gives:</p><div class="formula">hᵢ = 3hᵢ₋₁ + a<br>vᵢ = 3vᵢ₋₁ + 6hᵢ₋₁² + 6(a − 1)hᵢ₋₁ + a(a − 1)<br>E[L] = 1 + hₖ &nbsp; · &nbsp; Var(L) = vₖ</div><p style="margin-top:12px">All recurrence calculations use arbitrary-precision integers. For N = 1, the seed is terminal and the variance is zero. This constructor is not an optimizer over all tile sets.</p>';
  else html+='<h3>Absorbing Markov chain</h3><p>For each nonterminal exposed interface x, let Eₓ be the expected future attachment count and Sₓ its second raw moment. Solve these equations with exact rational arithmetic:</p><div class="formula">Eₓ = 1 + Σᵧ Pₓᵧ Eᵧ<br>Sₓ = 1 + 2Σᵧ Pₓᵧ Eᵧ + Σᵧ Pₓᵧ Sᵧ<br>E[L] = 1 + Eₛ &nbsp; · &nbsp; Var(L) = Sₛ − Eₛ²</div><p style="margin-top:12px">Terminal states have Eₓ = Sₓ = 0. Adding the seed changes the expectation by one and leaves the variance unchanged.</p>';
  html+='</div>';
 }
 if(analysis.reason)html+='<div class="analysis-section"><h3>Solver limit</h3><p>'+esc(analysis.reason)+'</p></div>';
 if(Object.keys(analysis.stateMeans).length)html+='<div class="analysis-section"><h3>Expected remaining attachments by interface</h3><div class="table-scroll"><table><thead><tr><th>Interface</th><th>Eₓ · exact</th></tr></thead><tbody>'+Object.entries(analysis.stateMeans).map(([s,e])=>'<tr><td><code>'+esc(s)+'</code></td><td class="exact-number">'+esc(e)+'</td></tr>').join('')+'</tbody></table></div></div>';
 html+='<div class="analysis-section"><h3>Computational scope</h3><p>'+(analysis.distribution?'The displayed probability prediction propagates the Markov chain through length '+count(analysis.distribution.maxLength)+' using floating-point arithmetic. Unresolved probability mass beyond that horizon: '+probability(analysis.distribution.tail)+'.':'A full length distribution is not computed at this scale. Analytical moments remain separate from simulated outcomes.')+' Standard deviations and compact scientific-notation displays are rounded. Exact values above and JSON exports preserve the rational or integer moments.</p></div></div>';
 $('analysisContent').innerHTML=html;
}
function runBatch(){
 if(batchWorker||compiled.virtual)return;const trials=Number($('trials').value),cap=Number($('stepCap').value),seed=$('rngSeed').value||'42';save();
 $('runBtn').disabled=true;$('runBtn').innerHTML=iconSpan('activity')+'Running…';$('cancelBtn').hidden=false;$('runProgress').hidden=false;$('runProgress').firstElementChild.style.width='0%';$('runHelp').textContent='Starting '+count(trials)+' trials…';
 batchWorker=new Worker('./worker.js?v=2',{type:'module'});const gen=generation;
 batchWorker.onmessage=({data})=>{
  if(gen!==generation)return;
  if(data.kind==='progress'){$('runProgress').firstElementChild.style.width=(100*data.completed/data.requested)+'%';$('runHelp').textContent=count(data.completed)+' / '+count(data.requested)+' trials processed';return;}
  if(data.kind==='batch'){batch=data.result;finishBatch();renderBatch();renderChart();renderConstructionReport();$('runHelp').textContent=count(batch.done)+' terminal · '+count(batch.capped)+' capped'+(batch.unstarted?' · '+count(batch.unstarted)+' unstarted':'');if(batch.budgetReached)toast('Work budget reached. Capped and unstarted trials are reported separately.');return;}
  if(data.kind==='error'){finishBatch();toast(data.message);}
 };
 batchWorker.onerror=()=>{finishBatch();toast('The experiment worker could not start. Reload to retry.');};
 batchWorker.postMessage({action:'batch',system,trials,cap,seed});
}
function finishBatch(){batchWorker?.terminate();batchWorker=null;$('runBtn').disabled=false;$('runBtn').innerHTML=iconSpan('play')+'Run trials';$('cancelBtn').hidden=true;$('runProgress').hidden=true;}
function cancelBatch(notify=true){if(!batchWorker)return;finishBatch();$('runHelp').textContent='Cancelled. No partial batch is included in the results.';if(notify)toast('Experiment cancelled.');}
function renderBatch(){
 document.querySelector('.summary-bottom span:last-child').textContent=batch?.capped?'Capped runs contribute their observed length. The mean lower bound applies to these started runs, not to the theoretical expectation.':'Expectation describes the average over many runs, not a target stopping length.';
 const root=$('batchSummary');if(!batch){root.innerHTML='<div class="empty-summary">'+(compiled.virtual?'This compact recipe supports exact analysis. Choose a smaller construction to run literal tile simulations.':'Run an experiment to compare observed lengths with the theoretical expectation.')+'</div>';return;}
 const avg=batch.sum/batch.started,epsilon=Number($('epsilon').value)/100,mean=analysis?.meanNumber;
 const within=Number.isFinite(mean)?batch.lengths.reduce((s,n,i)=>s+(batch.terminated[i]&&Math.abs(n-mean)<=epsilon*mean?1:0),0):null;
 const empirical=within===null?'—':(batch.capped?'≥ ':'')+(within/batch.started*100).toFixed(1)+'%';
 const row=(label,value,cls='')=>'<div class="result-row '+cls+'"><span>'+label+'</span><strong>'+value+'</strong></div>';
 root.innerHTML=row('Terminal trials',count(batch.done)+' / '+count(batch.started))+row(batch.capped?'Mean lower bound':'Sample mean',(batch.capped?'≥ ':'')+formatNum(avg))+row(batch.capped?'Capped trials':'Sample std. dev.',batch.capped?count(batch.capped):batch.done>1?formatNum(Math.sqrt(Math.max(0,(batch.sumSq-batch.sum**2/batch.done)/(batch.done-1)))):'—')+row('Within ±'+$('epsilon').value+'%',empirical,'primary-result')+(batch.unstarted?row('Unstarted · work limit',count(batch.unstarted)):'');
 root.title='Random seed: '+batch.seed+'. Attachment cap: '+count(batch.cap)+'. '+count(batch.work)+' successful attachments processed. '+(batch.capped?'Capped lengths are lower bounds; all started trials are included in the mean lower bound.':'');
}
function renderChart(){
 const d=analysis?.distribution,completed=batch?batch.lengths.filter((_,i)=>batch.terminated[i]):[];
 $('chartSubtitle').textContent=batch?count(batch.done)+' terminal outcomes'+(batch.capped?'; '+count(batch.capped)+' capped.':'.'):'Observed trials alongside the Markov prediction.';
 if(!d&&!completed.length){$('chart').innerHTML='<div class="empty-chart">'+iconSpan('chart')+(large()?'This target is too large for a full length distribution. Exact moments are available in Analysis.':analysis?.status==='nonhalting'?'This system has nonhalting paths. Run limited trials to inspect any terminal outcomes.':'Run trials to see the observed length distribution.')+'</div>';$('chartFoot').textContent=batch?.capped?count(batch.capped)+' capped trials; no terminal outcomes in this batch.':'Probability predictions appear when the target and state space are manageable.';$('chartDownload').disabled=true;return;}
 $('chartDownload').disabled=false;
 const mean=analysis?.meanNumber,maxObserved=completed.reduce((a,b)=>Math.max(a,b),1);
 let horizon=Number.isFinite(mean)&&mean>0?Math.ceil(mean*5):maxObserved;
 if(d)horizon=Math.min(Math.max(10,horizon),d.maxLength);
 horizon=Math.max(10,Math.min(1000001,Math.max(horizon,maxObserved)));
 const bins=32,width=horizon/bins,pred=Array(bins).fill(0),hist=Array(bins).fill(0);
 if(d)for(let L=1;L<d.pmf.length&&L<=horizon;L++)pred[Math.min(bins-1,Math.floor((L-1)/width))]+=d.pmf[L];
 const denom=batch?.started||1;completed.forEach(n=>hist[Math.min(bins-1,Math.floor((n-1)/width))]+=1/denom);
 const ymax=Math.max(.01,...pred,...hist)*1.17,W=650,H=245,left=44,top=20,bottom=39,right=15,pw=W-left-right,ph=H-top-bottom;
 const x=i=>left+i*pw/bins,y=v=>top+ph*(1-v/ymax),fmtX=n=>n>=1000000?(n/1e6).toFixed(n%1e6?1:0)+'m':n>=1000?(n/1000).toFixed(n%1000?1:0)+'k':String(Math.round(n));
 let svg='<svg id="histogramSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Histogram of terminal assembly length, with predicted probability mass and expected length"><title>Terminal length distribution</title><rect width="'+W+'" height="'+H+'" fill="white"/><g font-family="system-ui,sans-serif" font-size="11" fill="#787286">';
 for(let j=0;j<4;j++){const v=ymax*j/3,yy=y(v);svg+='<path d="M'+left+' '+yy+'H'+(W-right)+'" stroke="#eeecf4"/><text x="'+(left-9)+'" y="'+(yy+4)+'" text-anchor="end">'+(100*v).toFixed(v<.1?1:0)+'%</text>';}
 if(Number.isFinite(mean)&&mean<=horizon){const xx=left+mean/horizon*pw;svg+='<path d="M'+xx+' '+top+'V'+(top+ph)+'" stroke="#aaa2b9" stroke-dasharray="4 5"/><text x="'+Math.min(W-65,xx+5)+'" y="'+(top-6)+'" fill="#8c72b0">E[L] '+fmtX(mean)+'</text>';}
 for(let i=0;i<bins;i++)if(hist[i]>0)svg+='<rect x="'+(x(i)+2)+'" y="'+y(hist[i])+'" width="'+(pw/bins-4)+'" height="'+(top+ph-y(hist[i]))+'" rx="2" fill="#b29be8"><title>'+ (Math.floor(i*width)+1)+'–'+Math.floor((i+1)*width)+': '+(100*hist[i]).toFixed(2)+'% of started trials</title></rect>';
 if(d)svg+='<path d="'+pred.map((p,i)=>(i?'L':'M')+(x(i)+pw/bins/2)+' '+y(p)).join(' ')+'" fill="none" stroke="#7d61b9" stroke-width="2" stroke-linejoin="round"/>';
 for(let j=0;j<=5;j++)svg+='<text x="'+(left+pw*j/5)+'" y="'+(H-19)+'" text-anchor="middle">'+fmtX(horizon*j/5)+'</text>';
 svg+='</g></svg>';$('chart').innerHTML=svg;
 let tail=0;if(d){tail=d.tail;for(let i=Math.floor(horizon)+1;i<d.pmf.length;i++)tail+=d.pmf[i];}
 $('chartSubtitle').textContent=batch?count(batch.done)+' terminal outcomes'+(batch.capped?'; '+count(batch.capped)+' capped trials excluded from bars.':'.'):'Markov prediction from the current tile rules.';
 $('chartFoot').textContent='Terminal length, including seed'+(d?' · predicted tail beyond view: '+probability(tail):'')+(batch?.capped?' · bars show fractions of all started trials':'');
}
function openEditor(){
 pause();if(compiled.virtual){toast('A compact recipe cannot be edited as a literal tile list. Change its construction settings instead.');return;}if(system.tiles.length>200){toast('The graphical editor supports 200 rules. Export JSON to edit larger systems.');return;}
 $('editorModel').value=system.model;$('editorSeed').value=system.seed;$('editorRows').innerHTML='';system.tiles.forEach(t=>addEditorRow(t));
 $('compatibilityInput').value=system.compatibility.map(p=>p.join(', ')).join('\n');$('flexibleEditor').hidden=system.model!=='flexible';$('editorError').hidden=true;$('editorDialog').showModal();
}
function addEditorRow(t={west:'',east:'⊥',multiplicity:1}){
 const tr=document.createElement('tr');tr.innerHTML='<td><input aria-label="West interface" class="rule-west" maxlength="81" value="'+esc(t.west)+'"></td><td><input aria-label="East interface" class="rule-east" maxlength="81" value="'+esc(t.east)+'"></td><td><input aria-label="Multiplicity" class="rule-count" type="number" min="1" max="1000000000" value="'+esc(t.multiplicity)+'"></td><td><button class="square-button remove-rule" title="Remove tile rule" aria-label="Remove tile rule">×</button></td>';$('editorRows').appendChild(tr);
}
function applyEditor(){
 try{
  const model=$('editorModel').value,tiles=[...$('editorRows').children].map(tr=>({west:tr.querySelector('.rule-west').value,east:tr.querySelector('.rule-east').value,multiplicity:Number(tr.querySelector('.rule-count').value),role:'custom'}));
  const compatibility=$('compatibilityInput').value.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>s.split(',').map(x=>x.trim()));
  applySystem(normalizeSystem({model,seed:$('editorSeed').value,tiles,compatibility}),'custom');$('editorDialog').close();toast('Tile rules applied. Exact analysis updated.');
 }catch(e){$('editorError').textContent=e.message;$('editorError').hidden=false;}
}
function example(model){
 if(model==='two')return {model,seed:'a|b',tiles:[{west:'a|b',east:'a|b',multiplicity:1},{west:'a|⊥',east:'⊥|⊥',multiplicity:1}],compatibility:[]};
 if(model==='flexible')return {model,seed:'a',tiles:[{west:'x',east:'a',multiplicity:2},{west:'y',east:'⊥',multiplicity:1}],compatibility:[['a','x'],['a','y']]};
 return {model:'one',seed:'A',tiles:[{west:'A',east:'A',multiplicity:2},{west:'A',east:'⊥',multiplicity:1}],compatibility:[]};
}
function saveFile(name,body,type){
 const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);$('exportMenu').hidden=true;$('exportBtn').setAttribute('aria-expanded','false');
}
function exportSystem(){saveFile('linear-assembly-system.json',JSON.stringify(system,null,2),'application/json');toast(compiled.virtual?'Compact construction recipe exported.':'System JSON exported.');}
function exportTrials(){
 if(!batch){toast('Run an experiment before exporting trial results.');return;}
 const csv=['trial,terminal_length,observed_length,status,random_seed,attachment_limit'];
 batch.lengths.forEach((n,i)=>csv.push([i+1,batch.terminated[i]?n:'',n,batch.terminated[i]?'terminal':'capped','"'+batch.seed.replaceAll('"','""')+'"',batch.cap].join(',')));
 saveFile('linear-assembly-trials.csv',csv.join('\n'),'text/csv');
}
function exportAnalysis(){
 if(!analysis){toast('Analysis is still running.');return;}
 saveFile('linear-assembly-analysis.json',JSON.stringify({system,analysis,experiment:batch,notes:{length:'Includes seed; counts successful attachments only.',moments:'mean and variance strings are exact; numerical summaries and probabilities are rounded.',capped:'Observed lengths for capped trials are lower bounds on terminal length.',unstarted:'Unstarted requested trials are excluded from all statistics.'}},null,2),'application/json');
}
function generationButton(busy){$('generateBtn').disabled=busy;$('generateBtn').innerHTML=iconSpan('spark')+(busy?'Constructing…':'Generate tile set');}
$('generateBtn').onclick=()=>{
 constructionWorker?.terminate();constructionWorker=null;$('targetError').hidden=true;
 const fail=e=>{generationButton(false);$('targetError').hidden=false;$('targetError').textContent=e.message||e;};
 const kind=$('constructionKind').value;
 if(kind==='positive-ternary'){try{applySystem(generateSystem($('target').value),'generate');tab('overview');toast('One-pad expected-length system generated.');}catch(e){fail(e);}return;}
 generationButton(true);const w=constructionWorker=new Worker('./worker.js?v=2',{type:'module'});
 w.onmessage=({data})=>{if(w!==constructionWorker)return;w.terminate();constructionWorker=null;generationButton(false);if(data.kind==='error'){fail(data.message);return;}try{applySystem(data.system,'generate');tab('overview');toast(compiled.virtual?'Compact construction and exact analysis ready.':'Construction generated with exact expected length.');}catch(e){fail(e);}};
 w.onerror=()=>{w.terminate();constructionWorker=null;fail('The construction worker could not start. Reload and try again.');};
 w.postMessage({action:'generate',target:$('target').value,options:{kind,base:$('constructionBase').value.trim().toLowerCase(),epsilon:$('constructionEpsilon').value,delta:$('constructionDelta').value,blocks:$('constructionBlocks').value.trim().toLowerCase()}});
};
$('constructionKind').onchange=constructionFields;
$('concentrationExample').onclick=()=>{$('target').value='257';$('constructionBlocks').value='32';$('constructionEpsilon').value='0.25';$('constructionDelta').value='0.05';$('epsilon').value='25';$('epsilonValue').textContent='±25%';$('generateBtn').click();};
$('crestBtn').onclick=()=>{pause();$('crestDialog').showModal();};
$('target').onkeydown=e=>{if(e.key==='Enter')$('generateBtn').click();};
$('target').oninput=()=>document.querySelectorAll('[data-target]').forEach(e=>e.classList.toggle('selected',e.dataset.target===$('target').value));
document.querySelectorAll('[data-target]').forEach(e=>e.onclick=()=>{$('target').value=e.dataset.target;document.querySelectorAll('[data-target]').forEach(x=>x.classList.toggle('selected',x===e));$('generateBtn').click();});
$('generateMode').onclick=()=>source('generate');$('customMode').onclick=()=>source('custom');
$('modelSelect').onchange=()=>{customHelp();};
$('exampleBtn').onclick=()=>{const m=$('modelSelect').value;applySystem(example(m),'custom');toast(names[m]+' example loaded.');};
$('editorBtn').onclick=()=>{openEditor();$('editorModel').value=$('modelSelect').value;$('flexibleEditor').hidden=$('modelSelect').value!=='flexible';};$('editLibrary').onclick=openEditor;
$('addRule').onclick=()=>{if($('editorRows').children.length>=200){toast('Use at most 200 rules in the graphical editor.');return;}addEditorRow();};
$('editorRows').onclick=e=>{if(e.target.closest('.remove-rule'))e.target.closest('tr').remove();};
$('editorModel').onchange=()=>$('flexibleEditor').hidden=$('editorModel').value!=='flexible';$('applyRules').onclick=applyEditor;
$('runBtn').onclick=runBatch;$('cancelBtn').onclick=()=>cancelBatch();$('resetSample').onclick=()=>resetSample();$('newSample').onclick=()=>{sampleCounter++;resetSample();step(12);};$('playSample').onclick=play;$('stepSample').onclick=()=>{pause();step();};
$('speed').onchange=()=>{if(playTimer){pause();play();}};
$('rngSeed').onchange=()=>{sampleCounter=0;resetSample();save();};
$('stepCap').onchange=()=>{warnings();if(sample.capped&&sample.length-1<Number($('stepCap').value))sample.capped=false;renderSample();save();};$('trials').onchange=save;
$('epsilon').oninput=()=>{$('epsilonValue').textContent='±'+$('epsilon').value+'%';renderBatch();save();};
$('graphView').onclick=()=>setView('graphical');$('numericView').onclick=()=>setView('numerical');
$('windowSlider').oninput=()=>{autoFollow=false;windowStart=Number($('windowSlider').value);renderSample();};
$('tileViewport').onclick=e=>{
 const tile=e.target.closest('[data-position]');if(!tile)return;const p=Number(tile.dataset.position),t=p===0?{id:'Seed',west:system.model==='two'?'⊥|⊥':'⊥',east:system.seed,multiplicity:1}:system.tiles[sample.trace[p-1]];
 $('tileInfo').innerHTML='<strong>'+esc(t.id)+'</strong> at position '+count(p+1)+' · west <code>'+esc(t.west)+'</code> · east <code>'+esc(t.east)+'</code> · multiplicity '+count(t.multiplicity);
 document.querySelectorAll('.assembly-tile').forEach(e=>e.classList.toggle('chosen',e===tile));
};
document.querySelectorAll('[data-tab]').forEach(e=>e.onclick=()=>tab(e.dataset.tab));
$('moreTiles').onclick=()=>{tileLimit+=100;renderTiles();};
$('guideBtn').onclick=$('methodFooter').onclick=()=>{pause();$('guideDialog').showModal();};
document.querySelectorAll('[data-close]').forEach(e=>e.onclick=()=>$(e.dataset.close).close());
document.querySelectorAll('dialog').forEach(e=>e.addEventListener('click',event=>{if(event.target===e){const r=e.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)e.close();}}));
$('exportBtn').onclick=()=>{$('exportMenu').hidden=!$('exportMenu').hidden;$('exportBtn').setAttribute('aria-expanded',String(!$('exportMenu').hidden));};
document.addEventListener('click',e=>{if(!e.target.closest('.export-wrap')){$('exportMenu').hidden=true;$('exportBtn').setAttribute('aria-expanded','false');}});
$('exportSystem').onclick=exportSystem;$('exportTrials').onclick=exportTrials;$('exportAnalysis').onclick=exportAnalysis;
$('chartDownload').onclick=()=>{const svg=$('histogramSvg');if(svg)saveFile('linear-assembly-distribution.svg',svg.outerHTML,'image/svg+xml');};
$('importBtn').onclick=()=>$('importFile').click();
$('importFile').onchange=async e=>{
 const f=e.target.files[0];if(!f)return;
 try{if(f.size>5000000)throw new Error('Import files must be smaller than 5 MB.');const json=JSON.parse(await f.text());applySystem(normalizeSystem(json.system||json),'custom');tab('tiles');toast('System imported and analyzed.');}catch(err){toast('Import failed: '+err.message);}e.target.value='';
};
let resizeTimeout;window.addEventListener('resize',()=>{clearTimeout(resizeTimeout);resizeTimeout=setTimeout(()=>{renderSample();renderChart();},100);});
let initialSettings=null;try{initialSettings=JSON.parse(localStorage.getItem('linear-assembly-lab-v1')||'null');}catch{}
let initial=generateSystem('100');
if(initialSettings?.system){try{initial=normalizeSystem(initialSettings.system);if(initialSettings.target)$('target').value=initialSettings.target;for(const [key,id] of [['seed','rngSeed'],['trials','trials'],['cap','stepCap'],['epsilon','epsilon']])if(initialSettings[key]!==undefined)$(id).value=initialSettings[key];$('epsilonValue').textContent='±'+$('epsilon').value+'%';}catch{initialSettings=null;}}
try{applySystem(initial,initialSettings?.sourceMode||'generate',true);}catch{applySystem(generateSystem('100'),'generate',true);toast('The saved system was invalid; restored the default example.');}
