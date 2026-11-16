const E=require('./engine.js');
const N=+process.argv[2]||200000; const rnd=Math.random;
let steps={},hits=0,base=0,bonusW=0,trig=0,by={3:[],4:[],5:[]};
for(let i=0;i<N;i++){const st0={meter:0};const r=E.playSpin(false,rnd,st0);base+=r.win;if(r.win>0)hits++;steps[st0.steps]=(steps[st0.steps]||0)+1;
 if(r.sc>=3){trig++;const k=Math.min(r.sc,5);const b=E.playBonus(E.FREE_SPINS[k],rnd,E.START_MULTI[k]);bonusW+=b;by[k].push(b);}}
const med=a=>{a=[...a].sort((x,y)=>x-y);return a.length?a[a.length>>1]:0};
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
console.log('base',(base/N*100).toFixed(1),'bonus',(bonusW/N*100).toFixed(1),'TOTAL',((base+bonusW)/N*100).toFixed(1),'| bonus 1 in',(N/trig).toFixed(0));
for(const k of [3,4,5])console.log(k,'scat: share',(by[k].length/trig*100).toFixed(1)+'%','avg',avg(by[k]).toFixed(0),'med',med(by[k]).toFixed(0),'P(>gap)',(by[k].filter(x=>x>N/trig).length/Math.max(1,by[k].length)*100).toFixed(0)+'%');
// koupený bonus
let bb=[];for(let i=0;i<3000;i++)bb.push(E.playBonus(10,rnd,0));console.log('buy avg',avg(bb).toFixed(0),'med',med(bb).toFixed(0));
console.log('hit',(hits/N*100).toFixed(1)+'%','cascades',JSON.stringify(Object.fromEntries(Object.entries(steps).map(([k,v])=>[k,(v/N*100).toFixed(2)]))));
