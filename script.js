const listEl=document.getElementById('articlesList')
const popularEl=document.getElementById('popularCard')
const sortEl=document.getElementById('sortSelect')
const themeBtn=document.getElementById('themeToggle')
const titleEl=document.getElementById('popularTitle')
let articles=[]

function updatePopularTitle(){
  titleEl.textContent=sortEl.value==='views'?'Most Popular News:':'Latest News:'
}

fetch('articles.json').then(r=>r.json()).then(d=>{articles=d.articles;render()})

function render(){
  const sorted=[...articles].sort((a,b)=>
    sortEl.value==='views'?b.views-a.views:new Date(b.date)-new Date(a.date))
  listEl.innerHTML=''
  sorted.forEach(a=>listEl.appendChild(card(a)))
  popularEl.innerHTML=''
  popularEl.appendChild(card(sorted[0],true))
  updatePopularTitle()
}

function card(a,small=false){
  const col=document.createElement('div')
  col.className=small?'':'col-12'
  const img=a.image||`https://picsum.photos/seed/${a.id}/600/400`
  const c=document.createElement('div')
  c.className='card h-100'
  c.innerHTML=`
    <img src="${img}" class="card-img-top${small?' img-fluid rounded':''}" alt="${a.title}">
    <div class="card-body">
      <h6 class="card-title">${a.title}</h6>
      <span class="badge bg-secondary me-2">${a.category}</span>
      <small class="text-muted">${a.date}</small>
      <p class="mt-2 small">${a.content.slice(0,120)}...</p>
      <p class="small mb-1">Views: <strong>${a.views}</strong> • Read: ${Math.ceil(a.wordCount/200)} min</p>
      <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#m${a.id}">Read</button>
    </div>`
  modal(a,img);col.appendChild(c);return col
}

function modal(a,img){
  if(document.getElementById('m'+a.id))return
  const m=document.createElement('div')
  m.className='modal fade'
  m.id='m'+a.id
  m.innerHTML=`
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <img src="${img}" class="w-100" alt="">
        <div class="modal-header">
          <h5 class="modal-title">${a.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body"><p>${a.content}</p></div>
      </div>
    </div>`
  document.body.appendChild(m)
}

sortEl.addEventListener('change',render)

function setTheme(t){
  document.documentElement.dataset.theme=t
  localStorage.setItem('theme',t)
  themeBtn.textContent=t==='light'?'🌙':'☀️'
}
themeBtn.addEventListener('click',()=>setTheme(
  document.documentElement.dataset.theme==='light'?'dark':'light'
))
setTheme(localStorage.getItem('theme')||'light')
