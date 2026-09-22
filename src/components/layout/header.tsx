'use client';
import Link from 'next/link';
import { Mountain, ArrowUpRight, Search, Bookmark, UserRound, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
const links = [['Journeys','/journeys'],['Places','/#places'],['Seasonal Picks','/journeys?month=September'],['Journey Studio','/journey-match'],['Our Story','/#our-story']];
export function Header(){
 const [open,setOpen]=useState(false);
 return <header className="border-b border-border/65 bg-background"><div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between gap-5 px-6 md:px-12 lg:px-16">
 <Link href="/" className="flex items-center gap-2.5" aria-label="Veyra Trails home"><Mountain className="h-9 w-9 text-primary" strokeWidth={1.4}/><span className="text-[26px] font-semibold tracking-[.14em] leading-none">VEYRA<span className="mt-1.5 block text-[9px] tracking-[.54em] font-medium">TRAILS & BEYOND</span></span></Link>
 <nav className="hidden items-center gap-7 text-[12px] font-medium xl:flex">{links.map(([label,href])=><Link className="transition-colors hover:text-accent" href={href} key={label}>{label}</Link>)}</nav>
 <div className="flex items-center gap-5"><Link href="/journeys" aria-label="Search journeys" className="hidden sm:block"><Search size={18}/></Link><Link href="/saved" aria-label="Saved journeys" className="hidden sm:block"><Bookmark size={18}/></Link><Link href="/account" aria-label="Your account"><UserRound size={18}/></Link><Link href="/journey-match" className="hidden items-center gap-5 rounded-md bg-primary px-5 py-3.5 text-xs font-medium text-primary-foreground lg:flex">Plan a Journey <ArrowUpRight size={15}/></Link>
 <Sheet open={open} onOpenChange={setOpen}><SheetTrigger aria-label="Open navigation" className="xl:hidden"><Menu/></SheetTrigger><SheetContent className="w-full bg-background sm:max-w-lg"><SheetTitle className="mb-14 text-primary">VEYRA TRAILS</SheetTitle><nav className="flex flex-col gap-8">{[...links,['Saved Journeys','/saved'],['My Account','/account']].map(([label,href])=><Link onClick={()=>setOpen(false)} href={href} key={label} className="font-serif text-3xl">{label}</Link>)}</nav></SheetContent></Sheet>
 </div></div></header>
}
export function Footer(){return <footer className="border-t py-12"><div className="mx-auto flex max-w-[1312px] flex-col justify-between gap-8 px-6 md:flex-row"><div><Link href="/" className="flex items-center gap-2 text-xl tracking-widest"><Mountain className="text-primary"/> VEYRA TRAILS</Link><p className="mt-3 text-sm text-muted-foreground">Go a little further. Come back a little different.</p></div><div className="flex flex-wrap gap-7 text-sm"><Link href="/journeys">Find your journey</Link><Link href="/account">Your account</Link><Link href="/#our-story">Our philosophy</Link></div></div><p className="mx-auto mt-10 max-w-[1312px] px-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Veyra Trails. Sample catalog · Not currently accepting bookings.</p></footer>}
