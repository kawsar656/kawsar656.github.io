(()=>{'use strict';const canvas=document.getElementById('animation-canvas'),ctx=canvas.getContext('2d',{alpha:false}),nav=document.getElementById('navbar'),btn=document.getElementById('menu-btn'),menu=document.getElementById('mobile-menu'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const total=179,images=[],pending=new Set();let target=0,current=0,last=-1,raf=0;function path(i){return 'frames/ezgif-frame-'+String(i+1).padStart(3,'0')+'.webp'}function draw(i){const im=images[i];if(!im)return;ctx.fillStyle='#010f19';ctx.fillRect(0,0,canvas.width,canvas.height);const ratio=Math.max(canvas.width/im.naturalWidth,canvas.height/im.naturalHeight),w=im.naturalWidth*ratio,h=im.naturalHeight*ratio;ctx.drawImage(im,(canvas.width-w)/2,(canvas.height-h)/2,w,h);last=i}function resize(){const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;draw(last>=0?last:0)}function tick(){raf=0;current+=reduced?target-current:(target-current)*.12;const n=Math.round(current);if(images[n]&&n!==last)draw(n);else if(!images[n])load(n);if(Math.abs(target-current)>.04)raf=requestAnimationFrame(tick)}function request(){if(!raf)raf=requestAnimationFrame(tick)}async function load(i){if(images[i]||pending.has(i))return;pending.add(i);const im=new Image();im.src=path(i);try{await im.decode();images[i]=im;if(last<0||Math.abs(i-current)<2)draw(i)}catch{}finally{pending.delete(i)}}function scroll(){nav.classList.toggle('scrolled',scrollY>50);target=reduced?0:Math.max(0,Math.min(1,scrollY/Math.max(1,document.scrollingElement.scrollHeight-innerHeight)))*(total-1);request()}btn.addEventListener('click',()=>{const open=menu.classList.toggle('active');btn.setAttribute('aria-expanded',String(open))});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('active');btn.setAttribute('aria-expanded','false')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('active');btn.setAttribute('aria-expanded','false')}});addEventListener('resize',()=>{resize();scroll()},{passive:true});addEventListener('scroll',scroll,{passive:true});resize();load(0).then(async()=>{if(reduced)return;let next=1;await Promise.all(Array.from({length:4},async()=>{while(next<total){const i=next++;await load(i)}}));request()});scroll()})();

// Contact form: prepare an email draft; never send mail from this page.
(()=>{
 const form=document.querySelector('#contact-form');
 if(!form)return;
 const status=document.querySelector('#form-status');
 form.addEventListener('submit',event=>{
  event.preventDefault();
  status.textContent='';
  if(form.elements.website.value)return;
  if(!form.reportValidity()){status.textContent='Please complete the required fields with a valid email address.';return;}
  const name=form.elements.name.value.trim(),email=form.elements.email.value.trim();
  const message=form.elements.message.value.trim();
  if(!name){status.textContent='Please enter your name.';form.elements.name.focus();return;}
  if(message.length<10){status.textContent='Please enter a message of at least 10 characters.';form.elements.message.focus();return;}
  const body='Name: '+name+'\nEmail: '+email+'\n\n'+message;
  location.href='mailto:mdabualkawsar334@gmail.com?subject='+encodeURIComponent('Portfolio enquiry from '+name)+'&body='+encodeURIComponent(body);
  status.textContent='Your email draft is ready. Please send it from your email app. You can also email mdabualkawsar334@gmail.com directly.';
 });
})();


(()=>{const viewer=document.querySelector('#poster-viewer'),image=viewer.querySelector('img');document.querySelectorAll('[data-poster]').forEach(button=>button.addEventListener('click',()=>{image.src=button.dataset.poster;image.alt=button.querySelector('img').alt;viewer.showModal()}));viewer.querySelector('button').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close()})})();

(()=>{
 const gallery=document.querySelector('.design-gallery');
 const items=[...gallery.querySelectorAll('.design-item')];
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let active=0,timer=0,inView=false,hovered=false;
 gallery.setAttribute('role','region');
 gallery.setAttribute('aria-label','My Social Media Designs. Posters rotate automatically. Select a poster to view it.');
 function render(){
  const mobile=matchMedia('(max-width:600px)').matches;
  items.forEach((item,i)=>{
   let offset=(i-active+items.length)%items.length;
   if(offset>items.length/2)offset-=items.length;
   const distance=Math.abs(offset);
   item.style.setProperty('--x',(offset*(mobile?94:133))+'px');
   item.style.setProperty('--z',(-distance*80)+'px');
   item.style.setProperty('--angle',(-Math.sign(offset)*Math.min(distance*18,48))+'deg');
   item.style.setProperty('--layer',String(10-distance));
   item.style.setProperty('--opacity',String(Math.max(.4,1-distance*.16)));
   item.classList.toggle('is-current',offset===0);
  });
 }
 function schedule(){
  clearInterval(timer);timer=0;
  if(!inView||hovered||document.hidden||motion.matches||gallery.contains(document.activeElement)||document.querySelector('#poster-viewer')?.open)return;
  timer=setInterval(()=>{active=(active+1)%items.length;render()},1500);
 }
 const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule()},{threshold:.15});observer.observe(gallery);
 gallery.addEventListener('mouseenter',()=>{hovered=true;schedule()});
 gallery.addEventListener('mouseleave',()=>{hovered=false;schedule()});
 gallery.addEventListener('focusin',schedule);
 gallery.addEventListener('focusout',()=>requestAnimationFrame(schedule));
 gallery.addEventListener('click',schedule);
 document.querySelector('#poster-viewer')?.addEventListener('close',schedule);
 document.addEventListener('visibilitychange',schedule);
 motion.addEventListener('change',schedule);
 addEventListener('resize',render,{passive:true});render();
})();


(()=>{const button=document.querySelector('#skills-motion'),rows=document.querySelector('.skills-marquees');button.addEventListener('click',()=>{const paused=rows.classList.toggle('is-paused');button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Play skills animation':'Pause skills animation');button.textContent=paused?'Play ▷':'Pause Ⅱ'})})();

// Section-specific entrances; content stays visible when motion is disabled.
(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches||!('IntersectionObserver' in window))return;
  const elements=[];
  function prepare(selector,kind,step=95,base=0){
    document.querySelectorAll(selector).forEach((el,i)=>{
      el.classList.add('motion-item');el.dataset.motion=kind;
      el.style.setProperty('--motion-delay',`${base+Math.min(i,5)*step}ms`);
      elements.push(el);
    });
  }
  prepare('.hero-col-left > .section-tag','rise',0,70);
  prepare('.hero-headline','hero',0,150);
  prepare('.hero-role','rise',0,300);
  prepare('.hero-subtitle','rise',0,420);
  prepare('.hero-actions > a','rise',110,500);
  prepare('.hero-social > p','rise',0,600);
  prepare('.hero-social-links > a','pop',65,650);
  prepare('.scroll-indicator','rise',0,700);
  document.querySelectorAll('.section:not(#hero)').forEach(section=>{
    const local=(selector,kind,step=95)=>{
      section.querySelectorAll(selector).forEach((el,i)=>{
        el.classList.add('motion-item');el.dataset.motion=kind;
        el.style.setProperty('--motion-delay',`${Math.min(i,4)*step}ms`);elements.push(el);
      });
    };
    local('.section-header > .section-tag','slide');
    local('.section-title','title');
    local('.about-narrative > p','rise',145);
    local('.experience-row','slide',145);
    local('.featured-project','card',140);
    local('.design-heading > *','rise',90);
    local('.design-gallery','gallery');
    local('.gallery-controls','rise');
    local('.skills-marquee','slide',120);
  });
  prepare('#contact .contact-intro,#contact .contact-form,#contact .contact-info,#site-footer .closing-grid > *,#site-footer .closing-bottom','rise',100);
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('motion-visible');observer.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -28px 0px'});
  elements.forEach(el=>observer.observe(el));
  document.documentElement.classList.add('motion-ready');
  const showAll=()=>{document.documentElement.classList.remove('motion-ready');observer.disconnect()};
  preference.addEventListener('change',event=>{if(event.matches)showAll()});
  // Keyboard navigation never lands on an invisible link or field.
  document.addEventListener('focusin',event=>{
    let el=event.target;while(el&&el!==document.documentElement){
      if(el.classList?.contains('motion-item'))el.classList.add('motion-visible');el=el.parentElement;
    }
  });
  document.querySelectorAll('.nav-item,.mobile-nav-item').forEach(link=>link.addEventListener('click',()=>{
    document.querySelectorAll('.nav-item').forEach(item=>item.classList.toggle('nav-current',item.getAttribute('href')===link.getAttribute('href')));
  }));
})();
