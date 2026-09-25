const thanksCopy={
 pl:{title:'Toumé — Dziękuję za wiadomość',label:'Zróbmy kolejny krok',heading:'Dziękuję<br>za wiadomość.',description:'Po otrzymaniu wiadomości odpowiem na podany adres e-mail.',back:'Wróć na stronę główną'},
 en:{title:'Toumé — Thank you for getting in touch',label:'Let’s take the next step',heading:'Thanks for<br>getting in touch.',description:'Once I receive your message, I’ll reply to the email address you provided.',back:'Back to the homepage'}
};
let thanksLanguage=new URLSearchParams(location.search).get('lang');
if(!['pl','en'].includes(thanksLanguage)){try{thanksLanguage=localStorage.getItem('toume-language');}catch{}}
const thanksText=thanksCopy[thanksLanguage]||thanksCopy.en;
document.documentElement.lang=thanksLanguage==='pl'?'pl':'en';document.title=thanksText.title;
document.querySelector('#thanks-label').textContent=thanksText.label;
document.querySelector('#thanks-title').innerHTML=thanksText.heading;
document.querySelector('#thanks-description').textContent=thanksText.description;
document.querySelector('#thanks-back').textContent=thanksText.back;
