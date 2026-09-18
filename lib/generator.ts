const VOWELS = "aeiou";
const CONSONANTS = "bcdfghjklmnpqrstvwxyz";
const VALID = /^[a-z0-9._]+$/;

function clean(input:string){return input.toLowerCase().replace(/[^a-z0-9]/g,"")}
function score(s:string){
  let n=0; const vowels=[...s].filter(c=>VOWELS.includes(c)).length;
  if(vowels>0 && vowels<s.length) n+=35;
  if(!/[0-9._]/.test(s)) n+=25;
  if(!/(.)\1\1/.test(s)) n+=15;
  if(/[a-z]/.test(s)) n+=10;
  if(!/[qwxz]{3,}/.test(s)) n+=10;
  if(/^[a-z]+$/.test(s)) n+=5;
  return n;
}
function pattern(length:number, seed:string, i:number){
  const chars=clean(seed); const pool=chars.length?chars:CONSONANTS;
  let out="";
  for(let j=0;j<length;j++){
    const useVowel=(j+i)%3===1;
    const source=useVowel?VOWELS:(chars.length?pool:CONSONANTS);
    out+=source[(i*7+j*11)%source.length];
  }
  return out;
}
export function generateCandidates(input:string,length:number,count=50){
  const seed=clean(input); const set=new Set<string>();
  if(seed.length===length && VALID.test(seed)) set.add(seed);
  const bases=[seed, seed.split("").reverse().join(""), seed.slice(0,2), seed.slice(-2), "nova", "zen", "vex", "ky", "zy"];
  for(let i=0;set.size<count && i<1000;i++){
    const base=bases[i%bases.length];
    let candidate="";
    if(base.length===length) candidate=base;
    else if(base.length<length){
      const suffix=pattern(length-base.length,seed,i); candidate=(base+suffix).slice(0,length);
    } else candidate=pattern(length,seed,i);
    candidate=candidate.replace(/[^a-z0-9._]/g,"").slice(0,length);
    if(candidate.length===length && VALID.test(candidate)) set.add(candidate);
  }
  return [...set].map(username=>({username,score:score(username)})).sort((a,b)=>b.score-a.score).slice(0,count).map(x=>x.username);
}
