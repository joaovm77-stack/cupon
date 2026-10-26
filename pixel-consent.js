/* Meta Pixel — Cupón de la Vez. Consentimiento previo, sin eventos de compra simulados. */
(()=>{'use strict';
const PIXEL_ID='1438430094129999';
const KEY='cuponmx-analytics-consent-v1';
let accepted=false,initialized=false;
try{accepted=localStorage.getItem(KEY)==='accepted'}catch(_){}
function initialize(){
 if(initialized||!accepted)return;
 initialized=true;
 window.fbq=window.fbq||function(){(window.fbq.callMethod?window.fbq.callMethod:window.fbq.queue.push).apply(window.fbq,arguments)};
 if(!window._fbq)window._fbq=window.fbq;
 window.fbq.push=window.fbq.push||[];
 window.fbq.loaded=true;window.fbq.version='2.0';
 const s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';s.referrerPolicy='no-referrer';document.head.appendChild(s);
 window.fbq('init',PIXEL_ID);
 window.fbq('track','PageView');
}
function track(name,props){
 if(!accepted||!initialized||!/^Coupon(Start|Validated|RoundCompleted)$|^OfferClicked$/.test(name))return;
 window.fbq('trackCustom',name,props&&typeof props==='object'?props:{});
}
window.cuponTrack=track;
function store(value){
 accepted=value;
 try{localStorage.setItem(KEY,value?'accepted':'rejected')}catch(_){}
 if(value)initialize();
 const banner=document.getElementById('analyticsConsent');if(banner)banner.hidden=true;
 const panel=document.getElementById('privacyPreference');if(panel)panel.hidden=false;
}
function ready(){
 const banner=document.getElementById('analyticsConsent');
 const panel=document.getElementById('privacyPreference');
 const yes=document.getElementById('analyticsYes');
 const no=document.getElementById('analyticsNo');
 const manage=document.getElementById('manageAnalytics');
 if(yes)yes.addEventListener('click',()=>store(true));
 if(no)no.addEventListener('click',()=>store(false));
 if(manage)manage.addEventListener('click',()=>{
   if(banner)banner.hidden=false;
   if(panel)panel.hidden=true;
 });
 let stored=null;try{stored=localStorage.getItem(KEY)}catch(_){}
 if(stored==='accepted'){if(panel)panel.hidden=false;initialize()}
 else if(stored==='rejected'){if(panel)panel.hidden=false}
 else if(banner)banner.hidden=false;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();