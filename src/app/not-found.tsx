import Link from 'next/link';
import { Compass } from 'lucide-react';
export default function NotFound(){return <main className="mx-auto max-w-xl px-6 py-24"><Compass className="text-primary" size={40}/><p className="mt-7 text-xs tracking-widest text-accent">OFF THE BEATEN PATH / 404</p><h1 className="mt-4 text-5xl">A trail yet to be discovered.</h1><p className="my-6 text-muted-foreground">This page doesn’t exist. There’s still plenty to explore.</p><Link href="/journeys" className="inline-block rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground">Explore journeys</Link></main>}
