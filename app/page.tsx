"use client";
import {useState} from "react";
import {Check, Copy, Instagram, Search, Sparkles, X, Loader2} from "lucide-react";

type Status="AVAILABLE"|"TAKEN"|"UNKNOWN"|"ERROR";
type Result={username:string;status:Status};

const statusText:Record<Status,string>={AVAILABLE:"VERIFIED AVAILABLE",TAKEN:"Taken",UNKNOWN:"Unable to verify",ERROR:"Verification error"};

export default function Home(){
 const [query,setQuery]=useState(""); const [length,setLength]=useState(4); const [loading,setLoading]=useState(false); const [results,setResults]=useState<Result[]>([]); const [error,setError]=useState(""); const [copied,setCopied]=useState("");
 async function search(){
   if(!query.trim()) return setError("Enter a name or idea first.");
   setLoading(true);setError("");setResults([]);
   try{const r=await fetch("/api/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query,length})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Search failed");setResults(d.results||[])}catch(e){setError(e instanceof Error?e.message:"Search failed")}finally{setLoading(false)}
 }
 async function copy(u:string){try{await navigator.clipboard.writeText(u);setCopied(u);setTimeout(()=>setCopied(""),1200)}catch{}}
 return <main className="min-h-screen pb-16">
  <nav className="shell flex items-center justify-between py-6"><div className="flex items-center gap-2 font-bold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black"><Sparkles size={18}/></span>RareHandle</div><div className="hidden text-sm text-zinc-500 sm:block">Instagram username discovery</div></nav>
  <section className="shell pt-12 text-center sm:pt-20"><div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300"><Instagram size={14}/> Instagram only</div><h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-[-.05em] sm:text-7xl">Find your rare<br/><span className="text-zinc-500">Instagram username.</span></h1><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400">Discover short, clean and brandable handles, then verify their status through your configured verification service.</p>
  <div className="glass mx-auto mt-9 max-w-2xl rounded-3xl p-2 text-left shadow-2xl"><div className="flex items-center gap-3 px-4 py-2"><Search className="text-zinc-500" size={20}/><input value={query} onChange={e=>{setQuery(e.target.value);setError("")}} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Enter a name or idea..." className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-zinc-600"/></div><div className="flex flex-col gap-2 border-t border-white/10 p-2 sm:flex-row"><div className="flex flex-1 gap-2">{[4,5,6].map(n=><button key={n} onClick={()=>setLength(n)} className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${length===n?"bg-white text-black":"bg-white/5 text-zinc-400 hover:bg-white/10"}`}>{n}L</button>)}</div><button disabled={loading} onClick={search} className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">{loading?<Loader2 className="animate-spin" size={17}/>:<Sparkles size={17}/>} {loading?"Checking...":"Find Rare Handles"}</button></div></div>
  {error&&<p className="mt-4 text-sm text-red-400">{error}</p>}
  </section>
  <section className="shell mt-12 max-w-2xl">{loading&&<div className="glass rounded-2xl p-5 text-center text-sm text-zinc-400">Generating candidates and verifying Instagram status…</div>}{!loading&&results.length>0&&<div className="space-y-3">{results.map(r=><div key={r.username} className="glass flex items-center gap-4 rounded-2xl p-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5"><Instagram size={20}/></div><div className="min-w-0 flex-1"><div className="truncate text-lg font-semibold">@{r.username}</div><div className={`mt-1 flex items-center gap-1.5 text-xs ${r.status==="AVAILABLE"?"text-emerald-400":"text-zinc-500"}`}>{r.status==="AVAILABLE"?<Check size={14}/>:<X size={14}/>} {statusText[r.status]}</div></div><button onClick={()=>copy(r.username)} className="rounded-xl bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">{copied===r.username?<Check size={18}/>:<Copy size={18}/>}</button></div>)}</div>}{!loading&&results.length===0&&<div className="mt-10 text-center text-sm text-zinc-600">Your verified results will appear here.</div>}</section>
 </main>
}
