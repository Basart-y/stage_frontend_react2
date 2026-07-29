import {apiRequest, getAccessToken} from "@/services/api.js";
const STORAGE_KEY = "relayflow_reports";
const defaults = [
  {id:1,type:"autre",origin:"Commerçant",description:"Colis arrivé avec un emballage fortement endommagé.",deliveryRef:"LIV-00003",status:"ouvert",createdAt:"2026-07-24T09:15:00Z",priority:"haute"},
  {id:2,type:"probleme_reception_livreur",origin:"Point relais",description:"Le livreur a quitté le relais avant la vérification du nombre de colis.",deliveryRef:"LIV-00007",status:"en_traitement",createdAt:"2026-07-24T11:40:00Z",priority:"normale"},
];
function read(){ if(typeof window==="undefined") return [...defaults]; try{ const s=localStorage.getItem(STORAGE_KEY); if(!s){localStorage.setItem(STORAGE_KEY,JSON.stringify(defaults));return [...defaults];} return JSON.parse(s);}catch{return [...defaults];}}
function write(items){ if(typeof window!=="undefined") localStorage.setItem(STORAGE_KEY,JSON.stringify(items)); }
export const serviceSignalement={
  async getAll(){if(getAccessToken()){const r=await apiRequest("/api/v1/reports");return r.data||[];}return read();},
  async create(data){if(getAccessToken()){const r=await apiRequest("/api/v1/reports",{method:"POST",body:JSON.stringify(data)});return r.data;}const items=read();const id=Math.max(0,...items.map(i=>Number(i.id)||0))+1;const item={id,type:data.type||"autre",origin:data.origin||"Commerçant",description:data.description||"",deliveryRef:data.deliveryRef||"",status:data.type==="probleme_paiement"?"en_traitement":"ouvert",priority:data.priority||"normale",createdAt:new Date().toISOString(),history:[{status:"ouvert",date:new Date().toISOString(),comment:"Signalement créé."}]};write([item,...items]);return item;},
  async update(id,status,comment=""){if(getAccessToken()){const actionMap={en_traitement:'take',escalade:'escalate',resolu:'resolve',rejete:'reject'};const action=actionMap[status]||status;const r=await apiRequest(`/api/v1/reports/${id}/action`,{method:"POST",body:JSON.stringify({action,comment})});return r.data;}const items=read();const index=items.findIndex(i=>String(i.id)===String(id));if(index<0)return null;const current=items[index];items[index]={...current,status,updatedAt:new Date().toISOString(),history:[...(current.history||[]),{status,date:new Date().toISOString(),comment}]};write(items);return items[index];}
};
export default serviceSignalement;
