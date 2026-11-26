// Revised Sections 3.1, 4.2 and 6.1 (November 26, 2026).
// Legacy recipes remain reproducible; newly generated systems use revision 3.
import * as legacy from './legacy-constructions.js?v=3';
export const MATERIALIZATION_LIMIT=10000;
export const CONSTRUCTION_REVISION=3;
export const NEW_KINDS=legacy.NEW_KINDS;
export const parseProbability=legacy.parseProbability;
export const rationalText=legacy.rationalText;
const min=(a,b)=>a<b?a:b;
const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return a;};
const rational=(n,d=1n)=>{const g=gcd(n,d);return {n:n/g,d:d/g};};
const ceilDiv=(n,d)=>(n+d-1n)/d;

function integerTarget(input){
  let s=String(input).trim().replace(/[,_\s]/g,'');
  const p=s.match(/^10\^(\d+)$/),e=s.match(/^([1-9]\d*)e\+?(\d+)$/i);
  if(p||e){const power=Number(p?p[1]:e[2]),lead=p?'1':e[1];if(power+lead.length>1001)throw Error('N supports up to 1,001 digits.');s=lead+'0'.repeat(power);}
  if(!/^\d+$/.test(s)||s.length>1001||BigInt(s)<1n)throw Error('N must be a positive integer with at most 1,001 digits.');
  return BigInt(s);
}
export function positiveDigits(M,base){
  M=BigInt(M);base=BigInt(base);
  if(M<1n||base<2n||base>256n)throw Error('Use a positive block mean and a base from 2 to 256.');
  const digits=[];
  while(M){const a=1n+(M-1n)%base;digits.push(Number(a));M=(M-a)/base;}
  return digits.reverse();
}
function descriptorAtBase(M,family,b){
  const digits=positiveDigits(M,b),k=digits.length,B=BigInt(b);
  let h=BigInt(digits[0]),v=0n;
  for(const digit of digits.slice(1)){
    const a=BigInt(digit),z=a-1n;
    v=B*v+B*(B-1n)*h*h+2n*B*z*h+(family==='one'?a*z:2n*z*z);
    h=B*h+a;
  }
  const cost=BigInt(digits[0]+(family==='one'?3*(k-1):k===1?0:2*(k-1)+2*(b-2)));
  const distinct=family==='one'?BigInt(digits[0]+digits.slice(1).reduce((s,a)=>s+(a===2?3:2),0)):cost;
  return {family,algorithm:family==='one'?'positive-ternary':'positive-base',mean:M,base:b,digits,cost,distinct,variance:v,residualBound:(family==='one'?1n:2n)*M};
}
export function blockDescriptor(M,family,base='auto'){
  M=BigInt(M);if(M<1n)throw Error('Block means must be positive.');
  if(family==='one')return descriptorAtBase(M,'one',3);
  if(family!=='two')throw Error('Unknown block family.');
  if(base!=='auto'){
    const b=Number(base);if(!Number.isInteger(b)||b<2||b>256)throw Error('Choose a base from 2 to 256, or auto.');
    return descriptorAtBase(M,'two',b);
  }
  const s=(M+1n).toString(),log=Math.log(Number(s.slice(0,15)))+(s.length-Math.min(s.length,15))*Math.LN10;
  const bound=Math.max(16,Math.ceil(2*Math.sqrt(log)));
  let best=null;
  for(let b=2;b<=bound;b++){
    const d=descriptorAtBase(M,'two',b);
    if(!best||d.cost<best.cost||(d.cost===best.cost&&d.variance<best.variance))best=d;
  }
  return best;
}
function partition(M,r,family,base,cache){
  const q=M/r,rem=M%r,groups=[];
  const block=m=>{const key=String(m);if(!cache.has(key))cache.set(key,blockDescriptor(m,family,base));return cache.get(key);};
  if(rem)groups.push({count:rem,block:block(q+1n)});
  if(r>rem)groups.push({count:r-rem,block:block(q)});
  let variance=0n,cost=1n,distinct=1n,A=0n,Hmax=0n;
  for(const {count,block:b} of groups){
    variance+=count*b.variance;cost+=count*b.cost;distinct+=count*b.distinct;
    if(b.variance){A+=count*b.mean*b.residualBound;if(b.residualBound>Hmax)Hmax=b.residualBound;}
  }
  return {groups,r,variance,cost,distinct,A,Hmax,fallback:false};
}
function certificate(plan,N,epsilon,delta){
  if(plan.variance===0n)return {upper:rational(0n),method:'deterministic',certified:true,dyadicExponent:0};
  const tnum=epsilon.n*N,tden=epsilon.d;
  const cheb=rational(plan.variance*tden*tden,tnum*tnum);
  // log E exp(±lambda(X-M)) <= MH lambda^2/(1-H lambda).
  // One-pad H=M (Lemma 5); two-pad H=2M (Lemma 6).
  const denominator=4n*plan.A*tden*tden+2n*plan.Hmax*tnum*tden;
  const exponent=min(4096n,tnum*tnum/denominator);
  const dyadic=exponent<1n?rational(1n):rational(1n,1n<<(exponent-1n));
  let upper=rational(1n),method='trivial';
  if(cheb.n<cheb.d){upper=cheb;method='Chebyshev (exact variance)';}
  if(dyadic.n*upper.d<upper.n*dyadic.d){upper=dyadic;method='residual-mean Bernstein';}
  return {upper,method,certified:upper.n*delta.d<=delta.n*upper.d,dyadicExponent:Number(exponent)};
}
function legacyPlan(input){
  const p=legacy.constructionPlan(input);
  return {...p,revision:2,distinct:p.cost,equimolar:true,residualFactor:2,meta:{...p.meta,revision:2},groups:p.groups.map(g=>({...g,block:{...g.block,distinct:g.block.cost,algorithm:g.block.family==='one'?'legacy-binary':g.block.family==='two'?'legacy-redundant':'deterministic',residualBound:2n*g.block.mean}}))};
}
export function constructionPlan(input){
  const revision=input.revision??CONSTRUCTION_REVISION;
  if(revision===2)return legacyPlan(input);
  if(revision!==CONSTRUCTION_REVISION)throw Error('Unsupported construction revision.');
  if(!NEW_KINDS.includes(input.kind))throw Error('Unknown construction.');
  const N=integerTarget(input.target),M=N-1n,family=input.kind==='concentrated-one'?'one':'two',hp=input.kind!=='two-pad-mean';
  const base=family==='two'?String(input.base??'auto'):'auto';
  if(base!=='auto'&&(!/^\d+$/.test(base)||Number(base)<2||Number(base)>256))throw Error('Choose a base from 2 to 256, or auto.');
  const meta={kind:input.kind,target:String(N),base,revision:CONSTRUCTION_REVISION},cache=new Map();
  const make=r=>partition(M,r,family,base,cache);
  let epsilon=null,delta=null;
  if(hp){epsilon=parseProbability(input.epsilon??'0.25','Relative error ε');delta=parseProbability(input.delta??'0.05','Failure probability δ');meta.epsilon=rationalText(epsilon);meta.delta=rationalText(delta);meta.blocks=String(input.blocks??'auto').trim();}
  let plan;
  if(M===0n)plan={groups:[],r:0n,variance:0n,cost:1n,distinct:1n,A:0n,Hmax:0n,fallback:false};
  else if(!hp)plan=make(1n);
  else if(meta.blocks!=='auto'){
    if(!/^\d+$/.test(meta.blocks)||meta.blocks.length>1001)throw Error('Block count must be auto or a positive integer.');
    const r=BigInt(meta.blocks);if(r<1n||r>M)throw Error('Block count must be between 1 and N − 1.');
    plan=make(r);
  }else{
    let J=0n,power=1n;while(delta.n*power<2n*delta.d){power*=2n;J++;}
    // A certified starting point: exponent >= epsilon^2 r / (10 for one, 20 for two).
    const constant=family==='one'?10n:20n;
    const upper=min(M,ceilDiv(constant*J*epsilon.d*epsilon.d,epsilon.n*epsilon.n));
    plan=make(upper);
    let low=1n,high=upper;
    for(let iter=0;low<high&&iter<64;iter++){
      const mid=(low+high)/2n,candidate=make(mid);
      if(certificate(candidate,N,epsilon,delta).certified){high=mid;plan=candidate;}else low=mid+1n;
    }
    if(!certificate(plan,N,epsilon,delta).certified)throw Error('Internal certificate check failed.');
    if(plan.cost>=N)plan={groups:[{count:1n,block:{family:'deterministic',algorithm:'deterministic',mean:M,cost:M,distinct:M,variance:0n,residualBound:M}}],r:1n,variance:0n,cost:N,distinct:N,A:0n,Hmax:0n,fallback:true};
  }
  if(hp&&M===0n&&meta.blocks!=='auto'&&meta.blocks!=='0')throw Error('For N = 1 use automatic blocks; only the seed is needed.');
  return {...plan,N,M,revision:CONSTRUCTION_REVISION,model:family,meta,epsilon,delta,residualFactor:family==='one'?1:2,equimolar:plan.cost===plan.distinct,guarantee:hp?certificate(plan,N,epsilon,delta):null};
}
export function literalBlock(d,model,prefix='B1:'){
  const tiles=[],add=(west,east,multiplicity=1,role='path')=>tiles.push({west,east,multiplicity,role});
  const first=x=>prefix+x+(model==='two'?'|⊥':'');
  if(d.family==='deterministic'){
    for(let i=0;i<Number(d.mean);i++)add(first('p'+i),first('p'+(i+1)));
    return {input:first('p0'),output:first('p'+d.mean),tiles};
  }
  const {digits,base:b}=d,k=digits.length,a1=digits[0],A=first('A');
  const endpoint=i=>model==='one'?prefix+'g'+i:(i===k?'⊥':prefix+'c')+'|'+prefix+'u'+i;
  const B=a1===1?endpoint(1):first('B'),path=i=>i===0?A:i===a1?endpoint(1):i===1?B:first(i===2?'C':'z'+i);
  for(let i=1;i<=a1;i++)add(path(i-1),path(i));
  if(model==='one'){
    for(let i=2;i<=k;i++){
      const a=digits[i-1],west=endpoint(i-1);add(west,endpoint(i),1,'advance');
      if(a>1)add(west,A,a-1,'resetA');if(a<3)add(west,B,3-a,'resetB');
    }
  }else if(k>1){
    for(let i=2;i<=k;i++){
      const a=digits[i-1],west='⊥|'+prefix+'u'+(i-1);
      add(west,endpoint(i),1,'advance');add(west,a===1?B:a===2?A:first('d'+(a-2)),1,'resetA');
    }
    for(let j=1;j<=b-2;j++){
      add(prefix+'c|'+prefix+'xi'+j,B,1,'resetB');
      add(first('d'+j),j===1?A:first('d'+(j-1)),1,'path');
    }
  }
  return {input:A,output:endpoint(k),tiles};
}
export function systemFromPlan(plan){
  if(plan.revision===2)return legacy.systemFromPlan(plan);
  const common={version:3,model:plan.model,compatibility:[],construction:plan.meta},inert=plan.model==='two'?'⊥|⊥':'⊥';
  if(plan.cost>BigInt(MATERIALIZATION_LIMIT))return {...common,seed:inert,tiles:[],recipeOnly:true};
  const blocks=[];let index=0;
  for(const {count,block} of plan.groups)for(let i=0;i<Number(count);i++)blocks.push(literalBlock(block,plan.model,'B'+(++index)+':'));
  const tiles=[];
  for(let i=0;i<blocks.length;i++)for(const t of blocks[i].tiles)tiles.push({...t,east:t.east===blocks[i].output&&i<blocks.length-1?blocks[i+1].input:t.east});
  return {...common,seed:blocks[0]?.input??inert,tiles};
}
export function generateConstruction(target,options={}){return systemFromPlan(constructionPlan({...options,target}));}
export function planSummary(plan){
  return {
    kind:plan.meta.kind,target:String(plan.N),model:plan.model,revision:plan.revision,blocks:String(plan.r),charged:String(plan.cost),distinct:String(plan.distinct),equimolar:plan.equimolar,residualFactor:plan.residualFactor,
    variance:String(plan.variance),fallback:plan.fallback,recipeOnly:plan.cost>BigInt(MATERIALIZATION_LIMIT),
    groups:plan.groups.map(({count,block:b})=>({count:String(count),mean:String(b.mean),cost:String(b.cost),distinct:String(b.distinct),variance:String(b.variance),family:b.family,algorithm:b.algorithm,base:b.base,h:b.h,digits:b.digits,coefficients:b.coefficients,odd:b.odd})),
    epsilon:plan.epsilon?rationalText(plan.epsilon):null,delta:plan.delta?rationalText(plan.delta):null,
    guarantee:plan.guarantee?{upper:rationalText(plan.guarantee.upper),certified:plan.guarantee.certified,method:plan.guarantee.method,dyadicExponent:plan.guarantee.dyadicExponent}:null
  };
}
export function verifiedPlan(system){
  if(!NEW_KINDS.includes(system.construction?.kind))return null;
  try{
    const plan=constructionPlan({...system.construction,revision:system.construction.revision??2}),expected=systemFromPlan(plan);
    if(system.model!==expected.model||system.seed!==expected.seed||!!system.recipeOnly!==!!expected.recipeOnly)return null;
    const signature=s=>JSON.stringify(s.tiles.map(t=>[t.west,t.east,Number(t.multiplicity)]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
    if(signature(system)!==signature(expected))return null;
    return plan;
  }catch{return null;}
}
