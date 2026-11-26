import {NEW_KINDS,verifiedPlan,planSummary} from './constructions.js?v=3';
// Linear Assembly Lab — model, exact moments, and reproducible sampling.
// Length includes the seed. Only successful attachments increment length.
export const INERT = '⊥';
export const MAX_DIGITS = 1001;
const allowedModels = new Set(['one','two','flexible']);
const clean = x => {
  const s = String(x ?? '').trim();
  if (!s || s === '∅' || s === '⊥') return INERT;
  if (s.length > 40) throw new Error('Glue labels must be at most 40 characters.');
  return s;
};
export function parseTarget(input) {
  let s = String(input).trim().replace(/[,_\s]/g,'');
  const power = s.match(/^10\^(\d+)$/);
  const exp = s.match(/^([1-9]\d*)e\+?(\d+)$/i);
  if (power || exp) {
    const n = Number((power || exp)[power ? 1 : 2]);
    const lead = power ? '1' : exp[1];
    if (n + lead.length > MAX_DIGITS) throw new Error('Use at most 1,001 decimal digits (up to 10^1000).');
    s = lead + '0'.repeat(n);
  }
  if (!/^\d+$/.test(s) || s.length > MAX_DIGITS) throw new Error('Enter a positive integer, such as 100, 10^30, or 1e30 (up to 1,001 digits).');
  const n = BigInt(s);
  if (n < 1n) throw new Error('Expected total length N must be at least 1.');
  return n;
}
export function positiveTernary(n) {
  const digits = [];
  while (n > 0n) { const a = 1n + (n-1n)%3n; digits.push(Number(a)); n = (n-a)/3n; }
  return digits.reverse();
}
export function generateSystem(input) {
  const n = parseTarget(input);
  const digits = positiveTernary(n-1n);
  const tiles = [];
  const add = (west,east,multiplicity,role) => tiles.push({west,east,multiplicity,role});
  if (digits.length) {
    const a = digits[0], B = a === 1 ? 'g1' : 'B';
    if (a === 1) add('A','g1',1,'path');
    if (a >= 2) { add('A','B',1,'path'); if(a === 2) add('B','g1',1,'path'); }
    if (a === 3) { add('B','C',1,'path'); add('C','g1',1,'path'); }
    for(let j=1;j<digits.length;j++) {
      const west='g'+j, east='g'+(j+1), a=digits[j];
      add(west,east,1,'advance');
      if(a > 1) add(west,'A',a-1,'resetA');
      if(a < 3) add(west,B,3-a,'resetB');
    }
  }
  return normalizeSystem({version:1,model:'one',seed:digits.length?'A':INERT,tiles,compatibility:[],construction:{kind:'positive-ternary',target:n.toString()}});
}
export function normalizeInterface(x,model) {
  if(model==='two') {
    const parts=Array.isArray(x)?x:String(x??'').split('|');
    if(parts.length!==2) throw new Error('Two-pad interfaces need two labels separated by |, for example a | b.');
    return parts.map(clean).join('|');
  }
  const s=clean(x); if(s.includes('|')) throw new Error('Use | only to separate the two pads in two-pad mode.');
  return s;
}
export function normalizeSystem(input) {
  if(!input || typeof input!=='object' || Array.isArray(input)) throw new Error('The system must be a JSON object.');
  if(!allowedModels.has(input.model)) throw new Error('Model must be one, two, or flexible.');
  if(!Array.isArray(input.tiles) || input.tiles.length>10000) throw new Error('Provide an array of at most 10,000 tile rules.');
  const model=input.model, seed=normalizeInterface(input.seed,model), merged=new Map();
  for(const t of input.tiles) {
    const west=normalizeInterface(t.west,model),east=normalizeInterface(t.east,model);
    const multiplicity=Number(t.multiplicity??1);
    if(!Number.isSafeInteger(multiplicity)||multiplicity<1||multiplicity>1000000000) throw new Error('Each multiplicity must be an integer from 1 to 1,000,000,000.');
    const key=JSON.stringify([west,east]);
    if(merged.has(key)) merged.get(key).multiplicity+=multiplicity;
    else merged.set(key,{west,east,multiplicity,role:['path','advance','resetA','resetB'].includes(t.role)?t.role:'custom'});
  }
  const tiles=[...merged.values()].map((t,i)=>({...t,id:'t'+(i+1)}));
  const total=tiles.reduce((s,t)=>s+t.multiplicity,0);
  if(total>1000000000) throw new Error('The total nonseed multiplicity must be at most 1,000,000,000.');
  const pairSet=new Map();
  if(model==='flexible') {
    if(!Array.isArray(input.compatibility)) throw new Error('Flexible glue systems need a compatibility array of label pairs.');
    if(input.compatibility.length>20000) throw new Error('Use at most 20,000 compatibility pairs.');
    for(const pair of input.compatibility) {
      if(!Array.isArray(pair)||pair.length!==2) throw new Error('Each compatibility entry must contain exactly two glue labels.');
      const p=pair.map(clean).sort();
      if(p.includes(INERT)) throw new Error('The inert glue ⊥ cannot occur in a compatibility pair.');
      pairSet.set(JSON.stringify(p),p);
    }
  }
  const result={version:NEW_KINDS.includes(input.construction?.kind)?(input.construction.revision??2):1,model,seed,tiles,compatibility:[...pairSet.values()]};
  if(input.construction?.kind==='positive-ternary') result.construction={kind:'positive-ternary',target:String(input.construction.target)};
  if(NEW_KINDS.includes(input.construction?.kind)){
    const c=input.construction;result.construction={kind:c.kind,target:String(c.target),base:String(c.base??'auto')};
    if(c.revision!==undefined){if(![2,3].includes(c.revision))throw Error('Unsupported construction revision.');result.construction.revision=c.revision;}
    if(c.kind!=='two-pad-mean')Object.assign(result.construction,{epsilon:String(c.epsilon??'0.25'),delta:String(c.delta??'0.05'),blocks:String(c.blocks??'auto')});
  }
  if(input.recipeOnly){
    if(!result.construction||!NEW_KINDS.includes(result.construction.kind)||tiles.length)throw Error('A compact recipe needs supported construction metadata and no literal tile rules.');
    result.recipeOnly=true;
  }
  return result;
}
export function compileSystem(system) {
  const s=normalizeSystem(system), index=new Map();
  const generated=verifiedPlan(s);
  if(s.recipeOnly){
    if(!generated)throw Error('The compact construction recipe is invalid.');
    return {system:s,virtual:true,generated,states:[],terminals:[],haltable:true,nonhaltingStates:[],charged:String(generated.cost),distinct:String(generated.distinct),choices:()=>({options:[],total:0})};
  }
  if(s.construction && !generated && !validConstruction(s)) delete s.construction;
  function push(key,i) { if(!index.has(key)) index.set(key,[]); index.get(key).push(i); }
  s.tiles.forEach((t,i)=> {
    if(s.model==='two') t.west.split('|').forEach((g,p)=>{if(g!==INERT)push(p+':'+g,i);});
    else if(t.west!==INERT) push(t.west,i);
  });
  const compat=new Map();
  s.compatibility.forEach(([a,b])=>{ if(!compat.has(a))compat.set(a,new Set());if(!compat.has(b))compat.set(b,new Set());compat.get(a).add(b);compat.get(b).add(a); });
  const cache=new Map();
  function choices(state) {
    if(cache.has(state)) return cache.get(state);
    let ids;
    if(s.model==='one') ids=state===INERT?[]:(index.get(state)||[]);
    else if(s.model==='two') {
      const all=state.split('|').flatMap((g,p)=>g===INERT?[]:(index.get(p+':'+g)||[]));
      ids=[...new Set(all)].sort((a,b)=>a-b);
    } else ids=[...new Set([...(compat.get(state)||[])].flatMap(g=>index.get(g)||[]))].sort((a,b)=>a-b);
    let total=0; const options=ids.map(i=>{total+=s.tiles[i].multiplicity;return {i,upto:total};});
    const c={options,total};cache.set(state,c);return c;
  }
  const states=[],seen=new Set([s.seed]),queue=[s.seed];
  for(let q=0;q<queue.length;q++) {
    const state=queue[q];states.push(state);
    for(const {i} of choices(state).options) { const to=s.tiles[i].east;if(!seen.has(to)){seen.add(to);queue.push(to);} }
  }
  const terminals=states.filter(x=>choices(x).total===0),rev=new Map(states.map(x=>[x,[]]));
  states.forEach(x=>choices(x).options.forEach(({i})=>rev.get(s.tiles[i].east).push(x)));
  const reaches=new Set(terminals),todo=[...terminals];
  for(let q=0;q<todo.length;q++) for(const x of rev.get(todo[q])) if(!reaches.has(x)){reaches.add(x);todo.push(x);}
  const haltable=states.every(x=>reaches.has(x));
  const seedWest=s.model==='two'?'⊥|⊥':'⊥';
  const distinct=new Set(s.tiles.map(t=>JSON.stringify([t.west,t.east])));distinct.add(JSON.stringify([seedWest,s.seed]));
  return {system:s,generated,virtual:false,states,terminals,haltable,nonhaltingStates:states.filter(x=>!reaches.has(x)),choices,charged:1+s.tiles.reduce((n,t)=>n+t.multiplicity,0),distinct:distinct.size};
}
export const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;};
export function frac(a,b=1n) {a=BigInt(a);b=BigInt(b);if(b===0n)throw new Error('Zero denominator.');if(b<0n){a=-a;b=-b;}const g=gcd(a,b);return {n:a/g,d:b/g};}
const add=(a,b)=>frac(a.n*b.d+b.n*a.d,a.d*b.d);
const sub=(a,b)=>frac(a.n*b.d-b.n*a.d,a.d*b.d);
const mul=(a,b)=>frac(a.n*b.n,a.d*b.d);
const div=(a,b)=>frac(a.n*b.d,a.d*b.n);
export const fractionString=f=>f.d===1n?f.n.toString():`${f.n}/${f.d}`;
export function fractionNumber(f) {
  const sign=f.n<0n?-1:1,n=(f.n<0n?-f.n:f.n).toString(),d=f.d.toString();
  return sign*(Number(n.slice(0,16))/Number(d.slice(0,16)))*10**((n.length-Math.min(16,n.length))-(d.length-Math.min(16,d.length)));
}
function solve(matrix,rhs) {
  const a=matrix.map((row,i)=>[...row.map(x=>frac(x)),rhs[i]]),n=a.length;
  for(let c=0;c<n;c++) {
    let p=c;while(p<n&&a[p][c].n===0n)p++;
    if(p===n)throw new Error('The moment system is singular.');
    if(p!==c)[a[p],a[c]]=[a[c],a[p]];
    for(let i=c+1;i<n;i++) {
      if(a[i][c].n===0n)continue;
      const ratio=div(a[i][c],a[c][c]);a[i][c]=frac(0n);
      for(let j=c+1;j<=n;j++) a[i][j]=sub(a[i][j],mul(ratio,a[c][j]));
    }
  }
  const x=Array(n);
  for(let i=n-1;i>=0;i--){let r=a[i][n];for(let j=i+1;j<n;j++)r=sub(r,mul(a[i][j],x[j]));x[i]=div(r,a[i][i]);}
  return x;
}
export function genericMoments(compiled) {
  if(!compiled.haltable)return {status:'nonhalting',mean:null,variance:null,method:'reachability'};
  const active=compiled.states.filter(x=>compiled.choices(x).total>0),n=active.length;
  if(!n)return {status:'finite',mean:frac(1n),variance:frac(0n),method:'exact-rational',stateMeans:{}};
  if(n>64)return {status:'limit',mean:null,variance:null,method:'exact-rational',reason:'Exact custom-system analysis is limited to 64 reachable nonterminal interfaces.'};
  const ids=new Map(active.map((x,i)=>[x,i])),matrix=active.map((x,i)=>{
    const row=Array(n).fill(0n),ch=compiled.choices(x);row[i]=BigInt(ch.total);
    ch.options.forEach(({i:tile})=>{const j=ids.get(compiled.system.tiles[tile].east);if(j!==undefined)row[j]-=BigInt(compiled.system.tiles[tile].multiplicity);});return row;
  });
  const totals=active.map(x=>BigInt(compiled.choices(x).total));
  const e=solve(matrix,totals.map(t=>frac(t)));
  const q=solve(matrix,totals.map((t,i)=>mul(frac(t),sub(mul(frac(2n),e[i]),frac(1n)))));
  const start=ids.get(compiled.system.seed);
  return {status:'finite',mean:add(frac(1n),e[start]),variance:sub(q[start],mul(e[start],e[start])),method:'exact-rational',stateMeans:Object.fromEntries(active.map((x,i)=>[x,fractionString(e[i])]))};
}
export function ternaryMoments(target) {
  const n=parseTarget(target),digits=positiveTernary(n-1n);
  let h=0n,v=0n;
  for(let i=0;i<digits.length;i++) {
    const a=BigInt(digits[i]);
    if(i===0) h=a;
    else {v=3n*v+6n*h*h+6n*(a-1n)*h+a*(a-1n);h=3n*h+a;}
  }
  return {status:'finite',mean:frac(n),variance:frac(v),method:'exact-ternary',digits};
}
function validConstruction(s) {
  if(s.model!=='one'||!s.construction)return false;
  try {
    const expected=generateSystem(s.construction.target);
    const signature=x=>JSON.stringify([x.seed,x.tiles.map(t=>[t.west,t.east,t.multiplicity]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))]);
    return signature(s)===signature(expected);
  } catch{return false;}
}
export function moments(compiled) {
  if(compiled.generated)return {status:'finite',mean:frac(compiled.generated.N),variance:frac(compiled.generated.variance),method:'exact-blocks'};
  return validConstruction(compiled.system)?ternaryMoments(compiled.system.construction.target):genericMoments(compiled);
}
export function distribution(compiled,maxLength=2000) {
  if(compiled.virtual)throw Error('A compact recipe has no materialized transition chain.');
  if(!Number.isInteger(maxLength)||maxLength<1||maxLength>50000)throw new Error('Distribution limit must be from 1 to 50,000.');
  const states=compiled.states,ids=new Map(states.map((x,i)=>[x,i]));
  const transitions=states.map(x=>{
    const c=compiled.choices(x);return c.options.map(({i})=>[ids.get(compiled.system.tiles[i].east),compiled.system.tiles[i].multiplicity/c.total]);
  });
  let p=new Float64Array(states.length);p[ids.get(compiled.system.seed)]=1;
  const pmf=new Float64Array(maxLength+1);let tail=1;
  for(let length=1;length<=maxLength;length++) {
    const next=new Float64Array(states.length);let terminal=0;
    for(let i=0;i<states.length;i++) if(p[i]) {
      if(!transitions[i].length)terminal+=p[i];
      else for(const [j,prob] of transitions[i])next[j]+=p[i]*prob;
    }
    pmf[length]=terminal;p=next;
    tail=p.reduce((a,b)=>a+b,0);
    if(tail<1e-12)return {pmf:Array.from(pmf.slice(0,length+1)),tail,maxLength:length};
  }
  return {pmf:Array.from(pmf),tail,maxLength};
}
export function makeRng(seed) {
  let x=2166136261;
  for(const c of String(seed))x=Math.imul(x^c.charCodeAt(0),16777619)>>>0;
  return ()=>{x=(x+0x6D2B79F5)>>>0;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return (t^(t>>>14))>>>0;};
}
export function choose(options,rng) {
  if(options.total===0)return null;
  const limit=Math.floor(4294967296/options.total)*options.total;let r;
  do {r=rng();}while(r>=limit);
  r%=options.total;
  for(const choice of options.options)if(r<choice.upto)return choice.i;
  throw new Error('Invalid sampling weights.');
}
export function simulate(compiled,rng,cap=100000,keep=0,budget=Infinity) {
  if(compiled.virtual)throw Error('Literal simulation is unavailable for compact recipes.');
  let state=compiled.system.seed,length=1,trace=[];
  while(length<=cap&&length-1<budget) {
    const i=choose(compiled.choices(state),rng);
    if(i===null)return {length,terminal:true,trace,steps:length-1,state};
    state=compiled.system.tiles[i].east;length++;
    if(trace.length<keep)trace.push(i);
  }
  return {length,terminal:compiled.choices(state).total===0,trace,steps:length-1,state};
}
export function serializedAnalysis(compiled) {
  const m=moments(compiled);
  const result={status:m.status,method:m.method,reason:m.reason,mean:m.mean?fractionString(m.mean):null,variance:m.variance?fractionString(m.variance):null,meanNumber:m.mean?fractionNumber(m.mean):null,varianceNumber:m.variance?fractionNumber(m.variance):null,charged:compiled.charged,distinct:compiled.distinct,states:compiled.states.length,terminals:compiled.terminals,haltable:compiled.haltable,nonhaltingStates:compiled.nonhaltingStates,stateMeans:m.stateMeans||{},digits:m.digits};
  result.virtual=!!compiled.virtual;
  if(compiled.generated)result.construction=planSummary(compiled.generated);
  const edgeCount=compiled.states.reduce((sum,x)=>sum+compiled.choices(x).options.length,0);
  const horizon=Math.min(20000,Math.max(80,Math.ceil(result.meanNumber*12)));
  if(!compiled.virtual&&m.status==='finite'&&result.meanNumber<=25000&&compiled.states.length<=2048&&edgeCount*horizon<=20000000) {
    result.distribution=distribution(compiled,Math.min(20000,Math.max(80,Math.ceil(result.meanNumber*12))));
  }
  return result;
}
