const E=require('./engine.js');
const N=+process.argv[2]||200000;
let rnd=Math.random, base=0,bonusW=0,trig=0,hits=0,bonusList=[];
for(let i=0;i<N;i++){const r=E.playSpin(false,rnd,{meter:0});base+=r.win;if(r.win>0)hits++;
 if(r.sc>=3){trig++;const b=E.playBonus(E.FREE_SPINS[Math.min(r.sc,5)],rnd);bonusW+=b;bonusList.push(b);}}
console.log('base RTP',(base/N*100).toFixed(1),'bonus RTP',(bonusW/N*100).toFixed(1),'total',((base+bonusW)/N*100).toFixed(1));
console.log('hit',(hits/N*100).toFixed(1)+'%','bonus 1 in',(N/trig).toFixed(0),'avg bonus',(bonusW/trig).toFixed(1),'x');
