const API_TIMEOUT = 10000;
const TOKEN_KEY = 'relayflow_access_token';
const USER_KEY = 'relayflow_current_user';

export function getAccessToken(){
  if(typeof window==='undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export async function apiRequest(url,options={}){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),API_TIMEOUT);
  try{
    const token=getAccessToken();
    const response=await fetch(url,{
      ...options,
      headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...(options.headers||{})},
      signal:controller.signal,
    });
    clearTimeout(timeout);
    const payload=await response.json().catch(()=>({}));
    if(!response.ok){
      if(response.status===401 && typeof window!=='undefined'){
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
      }
      const error=new Error(payload?.error?.user_facing_error||`Erreur HTTP ${response.status}`);
      error.status=response.status;
      error.code=payload?.error?.code;
      throw error;
    }
    return payload;
  }catch(error){
    clearTimeout(timeout);
    throw error;
  }
}
