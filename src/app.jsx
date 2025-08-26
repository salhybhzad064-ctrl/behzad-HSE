
/* Behzad HSE React app (simplified) */
import React, { useEffect, useMemo, useState } from "react";

const LS_KEY = "behzadHSE.hazards.v2";
const todayStr = () => new Date().toISOString().slice(0,10);
const uid = () => Math.random().toString(36).slice(2,9);

const PPE_ITEMS = [
  { key: "helmet", label: "کلاه ایمنی" },
  { key: "goggles", label: "عینک" },
  { key: "gloves", label: "دستکش" },
  { key: "boots", label: "کفش ایمنی" },
  { key: "ear", label: "گوشی/ایرپلاگ" },
  { key: "respirator", label: "ماسک/رسپیراتور" },
  { key: "harness", label: "هارنس" },
  { key: "vest", label: "جلیقه" },
];

const defaultHazard = () => ({
  id: uid(),
  process: "",
  title: "",
  location: "",
  category: "ایمنی",
  description: "",
  likelihood: 1,
  severity: 1,
  owner: "",
  controls: "",
  due: todayStr(),
  status: "باز",
  createdAt: new Date().toISOString(),
  fmea: { severity: 1, occurrence: 1, detection: 10, effect: "", cause: "" },
  ppe: PPE_ITEMS.reduce((a, it) => ({ ...a, [it.key]: false }), {}),
});

function App(){
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(()=>{ try{ const raw = localStorage.getItem(LS_KEY); if(raw) setItems(JSON.parse(raw)); } catch(e){} },[]);
  useEffect(()=>{ localStorage.setItem(LS_KEY, JSON.stringify(items)); },[items]);

  const startNew = ()=>{ setEditing(defaultHazard()); setShowForm(true); };
  const save = (rec)=>{ setItems(list=>{ const exists = list.some(x=>x.id===rec.id); return exists ? list.map(x=> x.id===rec.id? rec: x) : [{...rec}, ...list]; }); setShowForm(false); };
  const del = (rec)=>{ if(confirm('حذف؟')) setItems(list=>list.filter(x=>x.id!==rec.id)); };

  return (
    <div style={{padding:20,fontFamily:'Tahoma, sans-serif',direction:'rtl'}}>
      <h2>Behzad HSE - نسخه دسکتاپ (Electron)</h2>
      <div style={{marginBottom:10}}>
        <button onClick={startNew}>مورد جدید</button>
        <button onClick={()=>{ const csv = JSON.stringify(items,null,2); const blob = new Blob([csv],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='behzad-hse.json'; a.click(); URL.revokeObjectURL(url); }}>خروجی JSON</button>
      </div>

      {showForm && editing && (
        <div style={{border:'1px solid #ccc', padding:10, borderRadius:8, marginBottom:10}}>
          <div>
            <label>فعالیت: <input value={editing.process} onChange={e=>setEditing({...editing, process:e.target.value})} /></label>
          </div>
          <div>
            <label>عنوان: <input value={editing.title} onChange={e=>setEditing({...editing, title:e.target.value})} /></label>
          </div>
          <div>
            <label>شرح: <textarea value={editing.description} onChange={e=>setEditing({...editing, description:e.target.value})} /></label>
          </div>
          <div style={{marginTop:8}}>
            <button onClick={()=>save(editing)}>ذخیره</button>
            <button onClick={()=>{ setShowForm(false); setEditing(null); }}>انصراف</button>
          </div>
        </div>
      )}

      <table border="1" cellPadding="6" style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr><th>فعالیت</th><th>عنوان</th><th>ریسک</th><th>RPN</th><th>PPE</th><th>عملیات</th></tr>
        </thead>
        <tbody>
          {items.map(it=>{
            const score = it.likelihood * it.severity;
            const rpn = it.fmea.severity * it.fmea.occurrence * it.fmea.detection;
            const ppe = PPE_ITEMS.filter(p=>it.ppe[p.key]).map(p=>p.label).join(', ');
            return (<tr key={it.id}>
              <td>{it.process}</td>
              <td>{it.title}</td>
              <td>{score}</td>
              <td>{rpn}</td>
              <td>{ppe}</td>
              <td>
                <button onClick={()=>{ setEditing(it); setShowForm(true); }}>ویرایش</button>
                <button onClick={()=>del(it)}>حذف</button>
              </td>
            </tr>)
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
