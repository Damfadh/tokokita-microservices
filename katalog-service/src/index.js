const express = require('express');
const app = express(); app.use(express.json());
const products = [
 {id:'P001',name:'Kopi Nusantara',category:'Minuman',price:45000,stock:24,description:'Kopi arabika pilihan, 250 g'},
 {id:'P002',name:'Teh Melati',category:'Minuman',price:28000,stock:30,description:'Teh melati harum, 25 kantong'},
 {id:'P003',name:'Keramik Senja',category:'Rumah',price:85000,stock:12,description:'Cangkir keramik buatan lokal'},
 {id:'P004',name:'Tas Kanvas',category:'Aksesori',price:120000,stock:9,description:'Tas kanvas sehari-hari'}
];
app.get('/health',(req,res)=>res.json({service:'katalog-service',status:'ok'}));
app.get('/products',(req,res)=>res.json(products));
app.get('/products/:id',(req,res)=>{const p=products.find(x=>x.id===req.params.id); return p?res.json(p):res.status(404).json({error:'Produk tidak ditemukan'});});
app.get('/categories',(req,res)=>res.json([...new Set(products.map(p=>p.category))]));
app.post('/reserve',(req,res)=>{const items=req.body.items||[]; const missing=[]; for(const i of items){const p=products.find(x=>x.id===i.productId); if(!p||!Number.isInteger(i.quantity)||i.quantity<1||p.stock<i.quantity)missing.push(i.productId);} if(missing.length)return res.status(409).json({error:'Stok tidak mencukupi',products:missing}); for(const i of items)products.find(p=>p.id===i.productId).stock-=i.quantity; res.json({reserved:true,items});});
app.post('/release',(req,res)=>{for(const i of req.body.items||[]){const p=products.find(x=>x.id===i.productId); if(p&&Number.isInteger(i.quantity)&&i.quantity>0)p.stock+=i.quantity;} res.json({released:true});});
app.listen(process.env.PORT||3001,()=>console.log('katalog-service ready'));
