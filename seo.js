(()=>{
  const SITE='https://vizeerasmus.com';
  const HOST='vizeerasmus.com';

  const normalizePath=(value)=>{
    let p=value||'/';
    p=p.replace(/\/index\.html$/i,'/').replace(/\.html$/i,'');
    if(!p.startsWith('/')) p='/'+p;
    p=p.replace(/\/{2,}/g,'/');
    return p||'/';
  };

  const path=normalizePath(location.pathname);
  const canonical=SITE+(path==='/'?'/':path);

  const cleanInternalUrl=(raw)=>{
    if(!raw||raw.startsWith('#')||/^(mailto:|tel:|javascript:|data:)/i.test(raw)) return raw;
    try{
      const u=new URL(raw,location.href);
      const host=u.hostname.replace(/^www\./i,'');
      if(host!==HOST) return raw;
      const p=normalizePath(u.pathname);
      return p+(u.search||'')+(u.hash||'');
    }catch{return raw;}
  };

  document.querySelectorAll('a[href]').forEach(a=>{
    const raw=a.getAttribute('href');
    const clean=cleanInternalUrl(raw);
    if(clean&&clean!==raw) a.setAttribute('href',clean);
  });
  document.querySelectorAll('form[action]').forEach(f=>{
    const raw=f.getAttribute('action');
    const clean=cleanInternalUrl(raw);
    if(clean&&clean!==raw) f.setAttribute('action',clean);
  });

  const title=document.title||'VizeErasmus | Erasmus Rehberleri';
  const desc=document.querySelector('meta[name="description"]')?.content||'Erasmus öğrencileri için ülke, vize, oturum, evrak, hibe, konaklama, öğrenim ve staj rehberleri.';
  const socialImage=SITE+'/vizeerasmus-og.jpg';
  const set=(selector,attrs)=>{
    let el=document.head.querySelector(selector);
    if(!el){el=document.createElement(attrs.tag||'meta');document.head.appendChild(el);}
    Object.entries(attrs).forEach(([k,v])=>{if(k!=='tag')el.setAttribute(k,v);});
    return el;
  };

  set('link[rel="canonical"]',{tag:'link',rel:'canonical',href:canonical});
  set('meta[name="robots"]',{name:'robots',content:'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'});
  set('meta[property="og:title"]',{property:'og:title',content:title});
  set('meta[property="og:description"]',{property:'og:description',content:desc});
  set('meta[property="og:url"]',{property:'og:url',content:canonical});
  set('meta[property="og:type"]',{property:'og:type',content:(path.startsWith('/ulkeler/')||path.startsWith('/blog/'))?'article':'website'});
  set('meta[property="og:site_name"]',{property:'og:site_name',content:'VizeErasmus'});
  set('meta[property="og:image"]',{property:'og:image',content:socialImage});
  set('meta[property="og:image:secure_url"]',{property:'og:image:secure_url',content:socialImage});
  set('meta[property="og:image:type"]',{property:'og:image:type',content:'image/jpeg'});
  set('meta[property="og:image:width"]',{property:'og:image:width',content:'1200'});
  set('meta[property="og:image:height"]',{property:'og:image:height',content:'630'});
  set('meta[property="og:image:alt"]',{property:'og:image:alt',content:'VizeErasmus - Erasmus ülke rehberleri ve başvuru yol haritası'});
  set('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
  set('meta[name="twitter:title"]',{name:'twitter:title',content:title});
  set('meta[name="twitter:description"]',{name:'twitter:description',content:desc});
  set('meta[name="twitter:image"]',{name:'twitter:image',content:socialImage});
  set('meta[name="twitter:image:alt"]',{name:'twitter:image:alt',content:'VizeErasmus Erasmus öğrenci rehberi'});

  const h1=document.querySelector('h1')?.textContent?.trim()||title;
  const crumbs=[{'@type':'ListItem',position:1,name:'VizeErasmus',item:SITE+'/'}];
  if(path.startsWith('/ulkeler/')){
    crumbs.push({'@type':'ListItem',position:2,name:'Ülkeler',item:SITE+'/ulkeler'});
    crumbs.push({'@type':'ListItem',position:3,name:h1,item:canonical});
  }else if(path.startsWith('/blog/')){
    crumbs.push({'@type':'ListItem',position:2,name:'Blog',item:SITE+'/blog'});
    crumbs.push({'@type':'ListItem',position:3,name:h1,item:canonical});
  }

  const graph=[
    {'@type':'WebSite','@id':SITE+'/#website',url:SITE+'/',name:'VizeErasmus',inLanguage:'tr-TR'},
    {'@type':'Organization','@id':SITE+'/#organization',name:'VizeErasmus',url:SITE+'/',telephone:'+90 312 911 24 23',email:'info@vizeerasmus.com',contactPoint:[
      {'@type':'ContactPoint',telephone:'+90 312 911 24 23',contactType:'customer service',areaServed:'TR',availableLanguage:['tr']},
      {'@type':'ContactPoint',telephone:'+90 553 534 57 81',contactType:'customer support',areaServed:'TR',availableLanguage:['tr']}
    ]},
    {'@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description:desc,inLanguage:'tr-TR',primaryImageOfPage:{'@type':'ImageObject',url:socialImage,width:1200,height:630},isPartOf:{'@id':SITE+'/#website'}}
  ];
  if(crumbs.length>1) graph.push({'@type':'BreadcrumbList',itemListElement:crumbs});
  if((path.startsWith('/ulkeler/')||path.startsWith('/blog/'))&&h1){
    graph.push({'@type':'Article',headline:h1,description:desc,image:[socialImage],mainEntityOfPage:{'@id':canonical+'#webpage'},publisher:{'@id':SITE+'/#organization'},inLanguage:'tr-TR'});
  }
  let ld=document.getElementById('ve-auto-schema');
  if(!ld){ld=document.createElement('script');ld.id='ve-auto-schema';ld.type='application/ld+json';document.head.appendChild(ld);}
  ld.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});

  const special={
    almanya:{id:'de',title:'Almanya Erasmus başvurusunda kritik dosya kontrolü',intro:'Almanya Erasmus dosyasında kabul belgesi, Learning Agreement, hareketlilik tarihleri, hibe veya diğer finans kanıtları, sigorta ve konaklama planının birbiriyle tutarlı olması önemlidir. Öğrenim ve staj hareketliliklerinde belge türleri benzer görünse de ev sahibi kurum ve faaliyet içeriği farklılaşabilir.',items:['Kabul belgesindeki başlangıç ve bitiş tarihleri ile vize başvuru kategorisinin uyumu','Learning Agreement bilgilerinin kabul belgesi ve üniversite yazılarıyla tutarlılığı','Hibe yazısı, ek finans kaynağı ve planlanan kalış süresinin birlikte değerlendirilmesi','Sağlık veya seyahat sigortasının hareketlilik dönemine uygunluğu','Konaklama planı ve Almanya’ya varış sonrası kayıt adımlarının önceden hazırlanması'],note:'Kesin evrak listesi ve başvuru kanalı zaman içinde değişebileceğinden Almanya’nın Türkiye’deki resmî temsilciliklerinin güncel açıklamaları başvuru öncesinde yeniden kontrol edilmelidir.'},
    ispanya:{id:'es',title:'İspanya Erasmus başvurusunda kritik dosya kontrolü',intro:'İspanya Erasmus dosyasında kabul belgesi, Learning Agreement, kalış süresi, finans planı, sigorta ve konaklama bilgilerinin aynı seyahat planını desteklemesi gerekir. Öğrenim ve staj hareketliliklerinde ev sahibi kurumun niteliği ve faaliyet içeriği dosyanın merkezindedir.',items:['Kabul ve hareketlilik tarihlerinin başvuru kategorisiyle uyumu','Learning Agreement veya staj planının ev sahibi kurum bilgileriyle eşleşmesi','Hibe yazısı ile ek finans kanıtlarının kalış süresini desteklemesi','Sigorta kapsamının hareketlilik dönemine uygun olması','Konaklama ve varış sonrası yerel kayıt adımlarının önceden planlanması'],note:'İspanya için vize, oturum ve belge gereklilikleri başvuru türüne göre değişebilir; başvuru öncesi yetkili İspanya temsilciliklerinin güncel duyuruları kontrol edilmelidir.'},
    fransa:{id:'fr',title:'Fransa Erasmus başvurusunda kritik dosya kontrolü',intro:'Fransa Erasmus dosyasında kabul veya davet belgesi, akademik hareketlilik planı, finansman, sigorta ve konaklama bilgilerinin birbirini desteklemesi önemlidir. Staj hareketliliklerinde ev sahibi kurum ve görev tanımı ayrıca dikkatle kontrol edilmelidir.',items:['Kabul veya davet belgesindeki tarihlerin seyahat planıyla uyumu','Learning Agreement ve üniversite Erasmus yazılarının aynı dönem ve kurumu göstermesi','Hibe veya diğer finans kanıtlarının planlanan kalışı desteklemesi','Sigorta ve konaklama belgelerinin hareketlilik tarihlerini kapsaması','Fransa’ya varış sonrası kurum kayıt ve varsa yerel prosedürlerin önceden araştırılması'],note:'Fransa başvurularında kategori ve belge listeleri güncellenebilir; yetkili Fransız makamlarının güncel başvuru açıklamaları esas alınmalıdır.'},
    italya:{id:'it',title:'İtalya Erasmus başvurusunda kritik dosya kontrolü',intro:'İtalya Erasmus dosyasında kabul, akademik veya staj planı, finansman, sigorta ve konaklama belgelerinin aynı hareketlilik dönemini göstermesi gerekir. Özellikle tarih ve kurum bilgilerindeki çelişkiler başvuru öncesinde giderilmelidir.',items:['Kabul belgesi ve Learning Agreement tarihlerinin uyumu','Gönderen ve ev sahibi üniversite bilgilerinin belgelerde tutarlı olması','Hibe veya diğer finans kaynaklarının kalış planını desteklemesi','Sigorta ve konaklama kanıtlarının hareketlilik dönemini kapsaması','Varış sonrası üniversite ve yerel kayıt işlemlerinin önceden planlanması'],note:'İtalya vize ve oturum prosedürleri başvuru türü ve kalış süresine göre değişebilir; yetkili İtalyan makamlarının güncel bilgi notları esas alınmalıdır.'},
    hollanda:{id:'nl',title:'Hollanda Erasmus başvurusunda kritik dosya kontrolü',intro:'Hollanda Erasmus dosyasında ev sahibi kurumun kabulü, hareketlilik türü, finansman, sigorta ve konaklama planı birlikte değerlendirilmelidir. Üniversitenin veya kurumun başvuru sürecindeki rolü önceden netleştirilmelidir.',items:['Ev sahibi üniversite veya kurum kabulünün hareketlilik türünü açıkça göstermesi','Learning Agreement veya staj planının kabul belgesiyle uyumu','Hibe ve diğer finans kaynaklarının planlanan süreyi desteklemesi','Sigorta ve konaklama bilgilerinin aynı hareketlilik dönemini kapsaması','Ev sahibi kurumun vize veya oturum sürecindeki yönlendirmelerinin takip edilmesi'],note:'Hollanda’da başvuru süreci kurum türü ve kalış süresine göre farklılaşabilir; ev sahibi kurumun ve yetkili Hollanda makamlarının güncel talimatları esas alınmalıdır.'}
  };

  if(path.startsWith('/ulkeler/')){
    const slug=path.split('/').filter(Boolean).pop()||'';
    const country=(h1.split(':')[0]||h1).replace(/ Erasmus.*$/,'').trim();
    const baseCfg=special[slug]||{
      id:slug,
      title:country+' Erasmus başvurusunda kritik dosya kontrolü',
      intro:country+' Erasmus dosyasında kabul belgesi, Learning Agreement veya staj planı, hareketlilik tarihleri, finans, sigorta ve konaklama bilgilerinin aynı başvuru hikâyesini desteklemesi gerekir. Öğrenim ve staj hareketliliklerinde ev sahibi kurum ve faaliyet içeriği ayrıca kontrol edilmelidir.',
      items:['Kabul belgesi ile hareketlilik başlangıç ve bitiş tarihlerinin tutarlılığı','Learning Agreement veya staj planının ev sahibi kurum bilgileriyle uyumu','Hibe ve diğer finans kanıtlarının planlanan kalış süresini desteklemesi','Sigorta ve konaklama dönemlerinin hareketlilik tarihleriyle örtüşmesi','Başvuru öncesinde yetkili makamların güncel belge listesi ve prosedürünün yeniden doğrulanması'],
      note:country+' için vize, oturum ve başvuru gereklilikleri kalış süresi ve hareketlilik türüne göre değişebilir. Dosya tesliminden önce yetkili resmî makamların güncel açıklamaları esas alınmalıdır.'
    };
    const cfg={...baseCfg,label:'Dosya kontrolü'};
    const faq=[
      [country+' Erasmus için temel belgeler nelerdir?','Temel dosya genellikle pasaport, kabul belgesi, Learning Agreement veya staj planı, üniversite yazıları, finans kanıtı, sigorta ve konaklama planından oluşur. Kesin liste başvuru türüne göre değişebilir.'],
      [country+' Erasmus öğrenim ve staj dosyaları aynı mıdır?','Temel yapı benzerdir ancak ev sahibi kurum, faaliyet içeriği ve bazı belge gereklilikleri öğrenim ve staj hareketliliklerinde farklılaşabilir.'],
      [country+' Erasmus başvurusunda güncel resmî kaynaklar neden kontrol edilmelidir?','Başvuru kanalları ve belge gereklilikleri değişebileceği için dosya tesliminden önce yetkili makamların güncel bilgi notları esas alınmalıdır.']
    ];

    const article=document.querySelector('main article')||document.querySelector('main .wrap');
    const faqSection=document.getElementById('sss');
    const sid=(cfg.id||slug)+'-seo-expansion';
    if(article&&!document.getElementById(sid)){
      const section=document.createElement('section');
      section.className='card';
      section.id=sid;
      section.innerHTML='<h2>'+cfg.title+'</h2><p>'+cfg.intro+'</p><h3>Başvuru öncesi kontrol edilmesi gerekenler</h3><ul>'+cfg.items.map(x=>'<li>'+x+'</li>').join('')+'</ul><div class="note">'+cfg.note+'</div>';
      if(faqSection&&faqSection.parentNode===article) article.insertBefore(section,faqSection); else article.appendChild(section);
    }
    const toc=document.querySelector('.toc');
    if(toc&&!toc.querySelector('a[href="#'+sid+'"]')){
      const a=document.createElement('a');a.href='#'+sid;a.textContent=cfg.label;
      const target=toc.querySelector('a[href="#sss"]');
      toc.insertBefore(a,target||toc.querySelector('.actions'));
    }
    const faqData={'@context':'https://schema.org','@type':'FAQPage','mainEntity':faq.map(x=>({'@type':'Question',name:x[0],acceptedAnswer:{'@type':'Answer',text:x[1]}}))};
    let f=document.getElementById('ve-'+(cfg.id||slug)+'-faq-schema');
    if(!f){f=document.createElement('script');f.id='ve-'+(cfg.id||slug)+'-faq-schema';f.type='application/ld+json';document.head.appendChild(f);}
    f.textContent=JSON.stringify(faqData);
  }

  document.documentElement.setAttribute('data-ve-canonical','clean');
})();
