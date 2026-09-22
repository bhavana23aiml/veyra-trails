export type Journey = {
  id: string; slug: string; name: string; state: string; short_description: string;
  description: string; difficulty: string; duration_days: number; distance_km: number;
  max_altitude_m: number; price: number; image: string; best_season: string[];
  featured: boolean; is_sample: boolean; beginner_friendly: boolean;
};
export const photos = {
  hero: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
  valley: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=85',
  lake: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85',
  alpine: 'https://images.unsplash.com/photo-1469817805249-72b7df7d0db3?auto=format&fit=crop&w=1400&q=85',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85',
  camping: 'https://images.unsplash.com/photo-1478131143081-fd1d56a7e2e5?auto=format&fit=crop&w=1000&q=85',
};
const rows: [string,string,number,number,number,number,string,string][] = [
  ['Hampta Pass','Himachal Pradesh',5,4270,26,8999,'Moderate',photos.alpine],
  ['Kashmir Great Lakes','Kashmir',7,4200,72,16999,'Challenging',photos.valley],
  ['Valley of Flowers','Uttarakhand',6,3658,38,9999,'Easy',photos.valley],
  ['Kedarkantha','Uttarakhand',6,3810,20,7499,'Moderate',photos.lake],
  ['Brahmatal','Uttarakhand',6,3734,24,8499,'Moderate',photos.lake],
  ['Tarsar Marsar','Kashmir',7,4024,48,15999,'Moderate',photos.alpine],
  ['Har Ki Dun','Uttarakhand',7,3566,44,10999,'Moderate',photos.valley],
  ['Kuari Pass','Uttarakhand',6,3814,33,9499,'Moderate',photos.hero],
  ['Dayara Bugyal','Uttarakhand',4,3639,22,6499,'Easy',photos.valley],
  ['Sandakphu','Sikkim',6,3636,46,11999,'Moderate',photos.hero],
  ['Nandi Hills','Karnataka',1,1478,8,1499,'Easy',photos.forest],
  ['Skandagiri','Karnataka',1,1450,8,1499,'Moderate',photos.forest],
  ['Kumara Parvatha','Karnataka',2,1712,22,3999,'Challenging',photos.forest],
  ['Kodachadri','Karnataka',2,1343,14,3499,'Moderate',photos.forest],
  ['Tadiandamol','Karnataka',2,1748,15,3299,'Easy',photos.valley],
];
export const sampleJourneys: Journey[] = rows.map((r,i)=>({id:`00000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`,slug:r[0].toLowerCase().replaceAll(' ','-'),name:r[0],state:r[1],duration_days:r[2],max_altitude_m:r[3],distance_km:r[4],price:r[5],difficulty:r[6],image:r[7],short_description:i===0?'Two valleys. One unforgettable crossing.':i===1?'Alpine lakes, a little closer to heaven.':i===2?'A thousand blooms. A world of wonder.':'Take the quieter path into extraordinary landscapes.',description:`Discover ${r[0]} in ${r[1]}: a journey through changing landscapes, quiet trails and the simple rhythm of life outdoors. This sample dossier is for inspiration; routes, prices, seasons and operator details require verification before travel.`,best_season:r[1]==='Karnataka'?['October','November','December','January','February']:['June','July','August','September'],featured:i<3,is_sample:true,beginner_friendly:r[6]==='Easy'}));
export const destinations = ['Himachal Pradesh','Uttarakhand','Kashmir','Ladakh','Karnataka','Maharashtra','Sikkim','Kerala'];
export const money = (value:number)=>`₹${value.toLocaleString('en-IN')}`;
