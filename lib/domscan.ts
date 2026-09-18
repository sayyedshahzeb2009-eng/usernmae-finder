export type VerificationStatus="AVAILABLE"|"TAKEN"|"UNKNOWN"|"ERROR";
export type Verification={username:string;status:VerificationStatus;raw?:unknown};

function extractStatus(data:any):VerificationStatus{
  const candidates=[data?.status,data?.availability,data?.available,data?.result?.status,data?.result?.availability,data?.data?.status,data?.data?.availability];
  for(const v of candidates){
    if(typeof v==="boolean") return v?"AVAILABLE":"TAKEN";
    if(typeof v==="string"){
      const s=v.toLowerCase();
      if(["available","free","unavailable?false","not_taken","not taken"].includes(s)||s.includes("available")&&!s.includes("unavailable")) return "AVAILABLE";
      if(["taken","unavailable","unavailable?true","registered"].includes(s)||s.includes("taken")) return "TAKEN";
    }
  }
  return "UNKNOWN";
}

export async function verifyInstagram(username:string):Promise<Verification>{
  const key=process.env.DOMSCAN_API_KEY;
  const base=process.env.DOMSCAN_API_BASE_URL || "https://api.domscan.io";
  if(!key) return {username,status:"ERROR"};
  const url=new URL("/v1/social",base);
  url.searchParams.set("handle",username);
  url.searchParams.set("platforms","instagram");
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),10000);
  try{
    const res=await fetch(url.toString(),{method:"GET",headers:{"X-API-Key":key,Accept:"application/json"},signal:controller.signal,cache:"no-store"});
    if(!res.ok){ if(res.status===429) return {username,status:"UNKNOWN"}; return {username,status:"ERROR"}; }
    const data=await res.json();
    return {username,status:extractStatus(data),raw:undefined};
  }catch{return {username,status:"ERROR"}}finally{clearTimeout(timer)}
}

export async function verifyBatch(usernames:string[],concurrency=5){
  const out:Verification[]=[]; let index=0;
  async function worker(){while(true){const i=index++;if(i>=usernames.length)return;out[i]=await verifyInstagram(usernames[i]);}}
  await Promise.all(Array.from({length:Math.min(concurrency,usernames.length)},worker));
  return out;
}
