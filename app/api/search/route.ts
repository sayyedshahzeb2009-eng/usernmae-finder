import {NextResponse} from "next/server";
import {generateCandidates} from "@/lib/generator";
import {verifyBatch} from "@/lib/domscan";

export async function POST(req:Request){
  try{
    const body=await req.json();
    const query=typeof body.query==="string"?body.query.trim():"";
    const length=Number(body.length);
    if(!query) return NextResponse.json({error:"Enter a name or idea."},{status:400});
    if(![4,5,6].includes(length)) return NextResponse.json({error:"Length must be 4, 5 or 6."},{status:400});
    const candidates=generateCandidates(query,length,50);
    const results=await verifyBatch(candidates,5);
    return NextResponse.json({candidates:candidates.length,results});
  }catch{return NextResponse.json({error:"Search failed. Please try again."},{status:500})}
}
