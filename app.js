const tabs=[...document.querySelectorAll('.nav-tab')];const panels=[...document.querySelectorAll('.tab-panel')];const dotsWrap=document.querySelector('.dots');const counter=document.querySelector('#counter');const content=document.querySelector('#panel-content');let current=0;let touchStart=0;panels.forEach((_,i)=>{const d=document.createElement('span');d.className='dot'+(i===0?' active':'');dotsWrap.appendChild(d)});const dots=[...document.querySelectorAll('.dot')];function activate(value,push=true){let index=typeof value==='number'?value:panels.findIndex(p=>p.id===value);if(index<0)index=0;current=(index+panels.length)%panels.length;panels.forEach((p,i)=>{const active=i===current;p.hidden=!active;p.classList.toggle('active',active)});tabs.forEach((t,i)=>{const active=i===current;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});dots.forEach((d,i)=>d.classList.toggle('active',i===current));counter.textContent=`${current+1} / ${panels.length}`;if(push)history.replaceState(null,'',`#${panels[current].id}`);content.scrollTop=0}tabs.forEach(t=>t.addEventListener('click',()=>{activate(t.dataset.tab);document.querySelector('.primary-nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false')}));document.querySelectorAll('.jump-button').forEach(b=>b.addEventListener('click',()=>activate(b.dataset.tab)));document.querySelector('#previous').addEventListener('click',()=>activate(current-1));document.querySelector('#next').addEventListener('click',()=>activate(current+1));document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')activate(current+1);if(e.key==='ArrowLeft')activate(current-1)});document.querySelector('.resume-card').addEventListener('touchstart',e=>touchStart=e.changedTouches[0].screenX,{passive:true});document.querySelector('.resume-card').addEventListener('touchend',e=>{const delta=e.changedTouches[0].screenX-touchStart;if(Math.abs(delta)>60)activate(current+(delta<0?1:-1))},{passive:true});const menu=document.querySelector('.menu-toggle');menu.addEventListener('click',()=>{const nav=document.querySelector('.primary-nav');const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});document.querySelectorAll('.copy-button').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);showToast('Location copied')}catch{showToast(b.dataset.copy)}}));function showToast(message){const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}activate(location.hash.slice(1)||'home',false);window.addEventListener('hashchange',()=>activate(location.hash.slice(1),false));
const form=document.querySelector('#contact-form');
if(form){
  const validateField=(field)=>{
    const error=field.parentElement.querySelector('.field-error');
    let message='';
    if(field.validity.valueMissing) message='This field is required.';
    else if(field.validity.typeMismatch) message='Enter a valid email address.';
    else if(field.validity.tooShort) message=`Use at least ${field.minLength} characters.`;
    field.classList.toggle('invalid',Boolean(message));
    field.setAttribute('aria-invalid',String(Boolean(message)));
    if(error) error.textContent=message;
    return !message;
  };
  form.querySelectorAll('input,textarea').forEach(field=>{
    field.addEventListener('blur',()=>validateField(field));
    field.addEventListener('input',()=>{if(field.classList.contains('invalid'))validateField(field)});
  });
  form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const fields=[...form.querySelectorAll('input,textarea')];
    const valid=fields.map(validateField).every(Boolean);
    if(!valid){fields.find(f=>f.classList.contains('invalid'))?.focus();showToast('Please complete the highlighted fields');return}
    const data=new FormData(form);
    const subject=encodeURIComponent('Portfolio enquiry for Joanna Ruby Toledo');
    const body=encodeURIComponent(`Hello Joanna,\n\n${data.get('message')}\n\nRegards,\n${data.get('name')}\n${data.get('email')}`);
    showToast('Opening your email application');
    setTimeout(()=>{window.location.href=`mailto:joannarosastoledo@gmail.com?subject=${subject}&body=${body}`},350);
  });
}
