import {compileSystem,serializedAnalysis,makeRng,simulate} from './engine.js';
self.onmessage=({data})=>{
  try {
    const compiled=compileSystem(data.system);
    if(data.action==='analyze') {postMessage({kind:'analysis',result:serializedAnalysis(compiled)});return;}
    if(data.action==='batch') {
      const rng=makeRng(data.seed),lengths=[],terminated=[];let work=0,done=0,capped=0,sum=0,sumSq=0,finishedSum=0,finishedSumSq=0;
      const budget=10000000,started=performance.now();
      for(let i=0;i<data.trials;i++) {
        if(work>=budget)break;
        const r=simulate(compiled,rng,data.cap,0,budget-work);
        lengths.push(r.length);terminated.push(r.terminal);work+=r.steps;sum+=r.length;sumSq+=r.length*r.length;
        if(r.terminal){done++;finishedSum+=r.length;finishedSumSq+=r.length*r.length;}else capped++;
        if((i+1)%100===0)postMessage({kind:'progress',completed:i+1,requested:data.trials});
      }
      postMessage({kind:'batch',result:{lengths,terminated,requested:data.trials,started:lengths.length,done,capped,unstarted:data.trials-lengths.length,sum,sumSq,finishedSum,finishedSumSq,work,seed:data.seed,cap:data.cap,budgetReached:work>=budget,elapsed:performance.now()-started}});
    }
  } catch(e) {postMessage({kind:'error',message:e.message});}
};
