// Literal constructions from Sections 4–6 of the supplied research manuscript.
// All new families are equimolar. Integers and probability certificates are exact.
export const MATERIALIZATION_LIMIT = 10000;
export const NEW_KINDS = ['two-pad-mean','concentrated-one','concentrated-two'];
const min=(a,b)=>a<b?a:b;
const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return a;};
const rational=(n,d=1n)=>{const g=gcd(n,d);return {n:n/g,d:d/g};};
const ceilDiv=(n,d)=>(n+d-1n)/d;
export const rationalText=f=>f.d===1n?String(f.n):f.n+'/'+f.d;
export function parseProbability(value,name='Probability') {
  const s=String(value).trim();let n,d;
  const f=s.match(/^(\d+)\/(\d+)$/);
  if(f){if(f[1].length>1005||f[2].length>1005)throw Error(name+' is too long.');n=BigInt(f[1]);d=BigInt(f[2]);}
  else {
    const m=s.match(/^(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i);
    if(!m||!(m[1]||m[2]))throw Error(name+' must be a decimal, fraction, or scientific notation.');
    const exponent=Number(m[3]||0)-(m[2]||'').length;
    if(Math.abs(exponent)>1000||(m[1]+(m[2]||'')).length>1001)throw Error(name+' supports at most 1,000 decimal places.');
    n=BigInt((m[1]||'0')+(m[2]||''));d=1n;
    if(exponent<0)d=10n**BigInt(-exponent);else n*=10n**BigInt(exponent);
  }
  if(d<=0n||n<=0n||2n*n>d)throw Error(name+' must be greater than 0 and at most 0.5.');
  // Bounded input size keeps certificate arithmetic and JSON recipes practical.
  if(n*10n**1000n<d)throw Error(name+' must be at least 1e-1000.');
  return rational(n,d);
}
function integerTarget(input) {
  let s=String(input).trim().replace(/[,_\s]/g,'');
  const p=s.match(/^10\^(\d+)$/),e=s.match(/^([1-9]\d*)e\+?(\d+)$/i);
  if(p||e){const exponent=Number(p?p[1]:e[2]),lead=p?'1':e[1];if(exponent+lead.length>1001)throw Error('N supports up to 1,001 digits.');s=lead+'0'.repeat(exponent);}
  if(!/^\d+$/.test(s)||s.length>1001||BigInt(s)<1n)throw Error('N must be a positive integer with at most 1,001 digits.');
  return BigInt(s);
}
export function redundantDigits(M,b) {
  b=BigInt(b);const A=2n*b-1n,cs=[];let h=BigInt(M);
  if(h<1n||b<2n)throw Error('Positive mean and base at least 2 required.');
  while(h>3n*b-2n){const c=A+(h-A)%b;cs.push(Number(c));h=(h-c)/b;}
  return {h:Number(h),coefficients:cs.reverse()};
}
export function binaryDigits(n) {
  const ds=[];while(n){const d=n%2n?1n:2n;ds.push(Number(d));n=(n-d)/2n;}return ds.reverse();
}
function oneDescriptor(M) {
  if(M===1n)return {family:'one',mean:M,cost:1n,variance:0n,digits:[],odd:true};
  const even=M-M%2n,ds=binaryDigits(even/2n);let prefix=0n,D=0n,A2=0n,AF=0n,weight=1n<<BigInt(ds.length-1);
  for(const digit of ds){prefix+=BigInt(digit);A2+=weight*prefix*prefix;AF+=weight*prefix;weight/=2n;D+=BigInt(digit);}
  const v=D*D+A2+2n*even*AF-even*even;
  return {family:'one',mean:M,cost:2n*D+M%2n,variance:v,digits:ds,odd:M%2n===1n};
}
function twoAtBase(M,b) {
  const {h,coefficients:cs}=redundantDigits(M,b),k=cs.length;
  if(!k)return {family:'two',mean:M,cost:M,variance:0n,base:b,h,coefficients:cs};
  let weight=BigInt(b)**BigInt(k-1),A2=BigInt(h+k)**2n,AF=0n;
  for(let i=0;i<k;i++){
    const j=cs[i]-(2*b-1),common=BigInt(h+i+2),privateCost=common+BigInt(j);
    A2+=weight*(BigInt(b-2)*common*common+privateCost*privateCost);
    AF+=weight*(BigInt(b-2)*common+privateCost);weight/=BigInt(b);
  }
  return {family:'two',mean:M,cost:BigInt(h+2*k+2*b-2),variance:A2+2n*M*AF-M*M,base:b,h,coefficients:cs};
}
export function blockDescriptor(M,family,base='auto') {
  M=BigInt(M);if(M<1n)throw Error('Block means must be positive.');
  if(family==='one')return oneDescriptor(M);
  if(base!=='auto'){
    const b=Number(base);if(!Number.isInteger(b)||b<2||b>256)throw Error('Choose a base from 2 to 256, or auto.');
    return twoAtBase(M,b);
  }
  const s=(M+1n).toString(),log=Math.log(Number(s.slice(0,15)))+(s.length-Math.min(s.length,15))*Math.LN10;
  const bound=Math.max(16,Math.ceil(2*Math.sqrt(log)));
  let best=null;
  for(let b=2;b<=bound;b++){const candidate=twoAtBase(M,b);if(!best||candidate.cost<best.cost)best=candidate;}
  return best;
}
function partition(M,r,family,base) {
  const q=M/r,rem=M%r,groups=[];
  if(rem)groups.push({count:rem,block:blockDescriptor(q+1n,family,base)});
  if(r>rem)groups.push({count:r-rem,block:blockDescriptor(q,family,base)});
  let variance=0n,cost=1n,S2=0n,max=0n;
  for(const {count,block:b} of groups){variance+=count*b.variance;cost+=count*b.cost;if(b.variance){S2+=count*b.mean*b.mean;if(b.mean>max)max=b.mean;}}
  return {groups,r,variance,cost,S2,max,fallback:false};
}
function certificate(plan,N,epsilon,delta) {
  if(plan.variance===0n)return {upper:rational(0n),method:'deterministic',certified:true,dyadicExponent:0};
  const tnum=epsilon.n*N,tden=epsilon.d;
  const cheb=rational(plan.variance*tden*tden,tnum*tnum);
  // The explicit residual-mean Bernstein bound is explained in CONSTRUCTIONS.md.
  const denominator=8n*plan.S2*tden*tden+4n*plan.max*tnum*tden;
  const exponent=min(4096n,tnum*tnum/denominator);
  const dyadic=exponent<1n?rational(1n):rational(1n,1n<<(exponent-1n));
  let upper=rational(1n),method='trivial';
  if(cheb.n<cheb.d){upper=cheb;method='Chebyshev (exact variance)';}
  if(dyadic.n*upper.d<upper.n*dyadic.d){upper=dyadic;method='residual-mean Bernstein';}
  return {upper,method,certified:upper.n*delta.d<=delta.n*upper.d,dyadicExponent:Number(exponent)};
}
export function constructionPlan(input) {
  if(!NEW_KINDS.includes(input.kind))throw Error('Unknown construction.');
  const N=integerTarget(input.target),M=N-1n,family=input.kind==='concentrated-one'?'one':'two',hp=input.kind!=='two-pad-mean';
  const base=family==='two'?String(input.base??'auto'):'auto';
  if(base!=='auto'&&(!/^\d+$/.test(base)||Number(base)<2||Number(base)>256))throw Error('Choose a base from 2 to 256, or auto.');
  const meta={kind:input.kind,target:String(N),base};
  let epsilon=null,delta=null;
  if(hp){epsilon=parseProbability(input.epsilon??'0.25','Relative error ε');delta=parseProbability(input.delta??'0.05','Failure probability δ');meta.epsilon=rationalText(epsilon);meta.delta=rationalText(delta);meta.blocks=String(input.blocks??'auto').trim();}
  let plan;
  if(M===0n)plan={groups:[],r:0n,variance:0n,cost:1n,S2:0n,max:0n,fallback:false};
  else if(!hp)plan=partition(M,1n,family,base);
  else if(meta.blocks!=='auto'){
    if(!/^\d+$/.test(meta.blocks)||meta.blocks.length>1001)throw Error('Block count must be auto or a positive integer.');
    const r=BigInt(meta.blocks);if(r<1n||r>M)throw Error('Block count must be between 1 and N − 1.');
    plan=partition(M,r,family,base);
  }else{
    // Exact integer J such that 2^(1-J) <= delta, without floating-point logs.
    let J=1n,power=1n;while(delta.n*power<2n*delta.d){power*=2n;J++;}J-=1n;
    const upper=min(M,ceilDiv(20n*J*epsilon.d*epsilon.d,epsilon.n*epsilon.n));
    plan=partition(M,upper,family,base);
    let low=1n,high=upper;
    // Keep a certified endpoint; no monotonicity claim about optimal tile count.
    for(let iter=0;low<high&&iter<64;iter++){
      const mid=(low+high)/2n,candidate=partition(M,mid,family,base);
      if(certificate(candidate,N,epsilon,delta).certified){high=mid;plan=candidate;}else low=mid+1n;
    }
    if(!certificate(plan,N,epsilon,delta).certified)throw Error('Internal certificate check failed.');
    if(plan.cost>=N)plan={groups:[{count:1n,block:{family:'deterministic',mean:M,cost:M,variance:0n}}],r:1n,variance:0n,cost:N,S2:0n,max:0n,fallback:true};
  }
  if(hp&&M===0n&&meta.blocks!=='auto'&&meta.blocks!=='0')throw Error('For N = 1 use automatic blocks; only the seed is needed.');
  return {...plan,N,M,model:family==='one'?'one':'two',meta,epsilon,delta,guarantee:hp?certificate(plan,N,epsilon,delta):null};
}
function deterministicBlock(M,model,prefix) {
  const tiles=[],label=i=>prefix+'p'+i+(model==='two'?'|⊥':'');
  for(let i=0;i<Number(M);i++)tiles.push({west:label(i),east:i===Number(M)-1?(model==='two'?'⊥|⊥':'⊥'):label(i+1),multiplicity:1,role:'path'});
  return {input:label(0),tiles};
}
export function literalBlock(descriptor,model,prefix='B1:') {
  const d=descriptor,M=d.mean,tiles=[],add=(west,east,role='path')=>tiles.push({west,east,multiplicity:1,role});
  if(d.family==='deterministic'||M===1n||(model==='two'&&!d.coefficients.length))return deterministicBlock(M,model,prefix);
  const g=x=>prefix+x;
  if(model==='one'){
    const q=i=>g('q'+i),input=d.odd?g('start'):q(1),ds=d.digits;
    if(d.odd)add(input,q(1));
    for(let i=0;i<ds.length;i++){
      const from=q(i+1),to=i===ds.length-1?'⊥':q(i+2);
      if(ds[i]===1){add(from,to,'advance');add(from,q(1),'resetA');}
      else{const u=g('u'+(i+1)),v=g('v'+(i+1));add(from,u,'advance');add(u,to,'advance');add(from,v,'resetA');add(v,q(1),'resetA');}
    }
    return {input,tiles};
  }
  const first=x=>g(x)+'|⊥',second=x=>'⊥|'+g(x),{base:b,h,coefficients:cs}=d;
  const input=h>1?first('v1'):second('u0');
  add(first('q'),input); // Q: a resettable root, distinct from the external seed.
  for(let l=1;l<h;l++)add(first('v'+l),l===h-1?second('u0'):first('v'+(l+1)));
  for(let i=1;i<=cs.length;i++){
    add(second('u'+(i-1)),g('a')+'|'+g('u'+i),'advance');
    const j=cs[i-1]-(2*b-1);add(second('u'+i),first(j?'d'+j:'q'),'resetA');
  }
  for(let j=1;j<b;j++)add(first('d'+j),first(j===1?'q':'d'+(j-1)),'resetB');
  for(let r=1;r<=b-2;r++)add(g('a')+'|'+g('xi'+r),first('q'),'resetB');
  add(second('u'+cs.length),'⊥|⊥','advance');
  return {input,tiles};
}
export function systemFromPlan(plan) {
  const common={version:2,model:plan.model,compatibility:[],construction:plan.meta};
  const inert=plan.model==='two'?'⊥|⊥':'⊥';
  if(plan.cost>BigInt(MATERIALIZATION_LIMIT))return {...common,seed:inert,tiles:[],recipeOnly:true};
  const blocks=[];let index=0;
  for(const {count,block} of plan.groups)for(let i=0;i<Number(count);i++)blocks.push(literalBlock(block,plan.model,'B'+(++index)+':'));
  const tiles=[];
  for(let i=0;i<blocks.length;i++){
    for(const t of blocks[i].tiles)tiles.push({...t,east:t.east===inert&&i<blocks.length-1?blocks[i+1].input:t.east});
  }
  return {...common,seed:blocks[0]?.input??inert,tiles};
}
export function generateConstruction(target,options={}) {return systemFromPlan(constructionPlan({...options,target}));}
export function planSummary(plan) {
  return {
    kind:plan.meta.kind,target:String(plan.N),model:plan.model,blocks:String(plan.r),
    charged:String(plan.cost),variance:String(plan.variance),fallback:plan.fallback,
    recipeOnly:plan.cost>BigInt(MATERIALIZATION_LIMIT),
    groups:plan.groups.map(({count,block:b})=>({count:String(count),mean:String(b.mean),cost:String(b.cost),variance:String(b.variance),family:b.family,base:b.base,h:b.h,digits:b.digits,coefficients:b.coefficients})),
    epsilon:plan.epsilon?rationalText(plan.epsilon):null,delta:plan.delta?rationalText(plan.delta):null,
    guarantee:plan.guarantee?{upper:rationalText(plan.guarantee.upper),certified:plan.guarantee.certified,method:plan.guarantee.method,dyadicExponent:plan.guarantee.dyadicExponent}:null
  };
}
export function verifiedPlan(system) {
  if(!NEW_KINDS.includes(system.construction?.kind))return null;
  try{
    const plan=constructionPlan(system.construction),expected=systemFromPlan(plan);
    if(system.model!==expected.model||system.seed!==expected.seed||!!system.recipeOnly!==!!expected.recipeOnly)return null;
    const signature=s=>JSON.stringify(s.tiles.map(t=>[t.west,t.east,Number(t.multiplicity)]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
    if(signature(system)!==signature(expected))return null;
    return plan;
  }catch{return null;}
}
