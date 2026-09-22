import { Journey } from '@/lib/catalog';
type Table<Row, Insert, Update, Relationships extends {foreignKeyName:string;columns:string[];isOneToOne:boolean;referencedRelation:string;referencedColumns:string[]}[] = []> = {Row:Row;Insert:Insert;Update:Update;Relationships:Relationships};
type Trek = Journey & {destination_id:string|null;status:'draft'|'published'|'archived';created_at:string;updated_at:string};
type Wishlist = {user_id:string;trek_id:string;created_at:string};
export type Database = {
 public: {
  Tables: {
   treks: Table<Trek,Omit<Trek,'id'|'created_at'|'updated_at'> & {id?:string},Partial<Trek>>;
   wishlists: Table<Wishlist,{user_id:string;trek_id:string;created_at?:string},Partial<Wishlist>,[{foreignKeyName:'wishlists_trek_id_fkey';columns:['trek_id'];isOneToOne:false;referencedRelation:'treks';referencedColumns:['id']}]>;
   profiles: Table<{user_id:string;full_name:string;phone:string|null;created_at:string},{user_id:string;full_name?:string;phone?:string}, {full_name?:string;phone?:string}>;
   admins: Table<{user_id:string},{user_id:string},{user_id?:string}>;
   destinations: Table<{id:string;name:string;slug:string;created_at:string},{name:string;slug:string},{name?:string;slug?:string}>;
  };
  Views: {[_ in never]:never};
  Functions: {[_ in never]:never};
  Enums: {[_ in never]:never};
  CompositeTypes: {[_ in never]:never};
 };
};
