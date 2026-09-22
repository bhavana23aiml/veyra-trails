import type { Metadata } from 'next';
import { Geist, DM_Serif_Display } from 'next/font/google';
import { Header, Footer } from '@/components/layout/header';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
const geist = Geist({variable:'--font-geist-sans',subsets:['latin']});
const editorial = DM_Serif_Display({variable:'--font-editorial',subsets:['latin'],weight:'400'});
export const metadata: Metadata = {title:{default:'VEYRA TRAILS — Find your kind of adventure',template:'%s | VEYRA TRAILS'},description:'Thoughtfully curated outdoor journeys. Discover extraordinary trails, quiet alpine valleys and your next adventure with Veyra.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body className={`${geist.variable} ${editorial.variable} antialiased`}><Header/>{children}<Footer/><Toaster position="bottom-center"/></body></html>}
