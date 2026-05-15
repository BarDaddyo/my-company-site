'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const COLORS = [
  { bg: '#EEEDFE', text: '#3C3489', border: '#AFA9EC' },
  { bg: '#E1F5EE', text: '#085041', border: '#5DCAA5' },
  { bg: '#FAECE7', text: '#712B13', border: '#F0997B' },
  { bg: '#FBEAF0', text: '#72243E', border: '#ED93B1' },
  { bg: '#E6F1FB', text: '#0C447C', border: '#85B7EB' },
  { bg: '#EAF3DE', text: '#27500A', border: '#97C459' },
  { bg: '#FAEEDA', text: '#633806', border: '#EF9F27' },
];

const CHUNK = 40;
const PASSWORD = 'myboard';

function uid() { return 'id' + Date.now() + Math.random().toString(36).slice(2, 6); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function rc(i) { return COLORS[i % COLORS.length]; }
function isDue(t) {
  if (t.done) return false;
  if (t.urgent) return true;
  if (!t.date) return false;
  return t.date <= todayStr();
}

const DEFAULT_DATA = {
  roles: [
    { id: 'r1', name: 'Lecturer' },
    { id: 'r2', name: 'Business' },
    { id: 'r3', name: 'Dad' },
    { id: 'r4', name: 'Personal' },
  ],
  tasks: [],
};

export default function BoardPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [roles, setRoles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysLoaded, setDaysLoaded] = useState(CHUNK);
  const [modal, setModal] = useState(null);
  const scrollRef = useRef(null);
  const saveTimer = useRef(null);

  // --- Auth ---
  useEffect(() => {
    if (sessionStorage.getItem('board_auth') === PASSWORD) setAuthed(true);
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if (pwInput === PASSWORD) {
      sessionStorage.setItem('board_auth', PASSWORD);
      setAuthed(true);
    } else {
      alert('Incorrect password.');
    }
  }

  // --- Data load ---
  useEffect(() => {
    if (!authed) return;
    fetch('/api/board')
      .then(r => r.json())
      .then(d => {
        if (d.roles && d.tasks) {
          setRoles(d.roles.length ? d.roles : DEFAULT_DATA.roles);
          setTasks(d.tasks);
        } else {
          setRoles(DEFAULT_DATA.roles);
          setTasks(DEFAULT_DATA.tasks);
        }
      })
      .catch(() => {
        setRoles(DEFAULT_DATA.roles);
        setTasks(DEFAULT_DATA.tasks);
      })
      .finally(() => setLoading(false));
  }, [authed]);

  // --- Debounced save ---
  function save(newRoles, newTasks) {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: newRoles, tasks: newTasks }),
      });
    }, 600);
  }

  function updateRoles(r) { setRoles(r); save(r, tasks); }
  function updateTasks(t) { setTasks(t); save(roles, t); }
  function updateBoth(r, t) { setRoles(r); setTasks(t); save(r, t); }

  // --- Infinite scroll ---
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 500) {
      setDaysLoaded(d => d + CHUNK);
    }
  }, []);

  // --- Jump to today ---
  function jumpToday() {
    const el = document.querySelector(`[data-date="${todayStr()}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // --- Role actions ---
  function addRole() {
    const name = prompt('New role name:');
    if (!name?.trim()) return;
    updateRoles([...roles, { id: uid(), name: name.trim() }]);
  }

  function deleteRole(id) {
    if (!confirm('Delete this role and all its tasks?')) return;
    updateBoth(roles.filter(r => r.id !== id), tasks.filter(t => t.roleId !== id));
  }

  // --- Task actions ---
  function removeTask(id) { updateTasks(tasks.filter(t => t.id !== id)); }

  function saveModal(data) {
    if (modal?.id) {
      updateTasks(tasks.map(t => t.id === modal.id ? { ...t, ...data } : t));
    } else {
      updateTasks([...tasks, { id: uid(), done: false, ...data }]);
    }
    setModal(null);
  }

  function openAdd(roleId, date, oneDay = false, urgent = false) {
    setModal({ roleId, date: date || '', oneDay, urgent, text: '', notes: '', mode: 'add' });
  }

  function openEdit(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    setModal({ ...t, mode: 'edit' });
  }

  // --- Date rows ---
  const today = todayStr();
  const dates = [];
  for (let i = 0; i < daysLoaded; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }

  if (!authed) return <LoginScreen pwInput={pwInput} setPwInput={setPwInput} onSubmit={handleLogin} />;
  if (loading) return <div style={{ padding: 40, color: 'var(--text2)', fontFamily: 'system-ui' }}>loading…</div>;

  const colTemplate = `80px repeat(${roles.length}, 175px)`;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Top bar */}
        <div className="top-bar">
          <h1>my board</h1>
          <div style={{ display: 'flex', gap: 7 }}>
            <button onClick={addRole}>+ role</button>
            <button onClick={jumpToday}>today</button>
          </div>
        </div>

        <div className="middle">
          {/* Today strip */}
          <TodayStrip roles={roles} tasks={tasks} today={today} colTemplate={colTemplate}
            onAdd={(rid) => openAdd(rid, null, false, true)}
            onEdit={openEdit} onRemove={removeTask} />

          {/* Scrollable grid */}
          <div className="scroll-area" ref={scrollRef} onScroll={handleScroll}>
            <div className="grid-wrap" style={{ gridTemplateColumns: colTemplate }}>
              {/* Sticky header row */}
              <div className="corner-cell">date</div>
              {roles.map((r, i) => (
                <RoleCell key={r.id} role={r} color={rc(i)}
                  onAdd={() => openAdd(r.id, null)}
                  onDelete={() => deleteRole(r.id)} />
              ))}
              {/* Date rows */}
              {dates.map(date => (
                <DateRow key={date} date={date} today={today} roles={roles} tasks={tasks}
                  onAdd={(rid) => openAdd(rid, date)}
                  onEdit={openEdit} onRemove={removeTask} />
              ))}
            </div>
          </div>

          {/* One day strip */}
          <OneDayStrip roles={roles} tasks={tasks} colTemplate={colTemplate}
            onAdd={(rid) => openAdd(rid, null, true)}
            onEdit={openEdit} onRemove={removeTask} />
        </div>

        {/* Modal */}
        {modal && (
          <TaskModal modal={modal} roles={roles} today={today}
            onSave={saveModal}
            onDelete={modal.id ? () => { removeTask(modal.id); setModal(null); } : null}
            onClose={() => setModal(null)} />
        )}
      </div>
    </>
  );
}

// --- Sub-components ---

function LoginScreen({ pwInput, setPwInput, onSubmit }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', background: '#eeede9' }}>
      <form onSubmit={onSubmit} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,.15)', borderRadius: 12, padding: 32, display: 'flex', flexDirection: 'column', gap: 12, width: 260 }}>
        <h2 style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>my board</h2>
        <input type="password" placeholder="password" value={pwInput}
          onChange={e => setPwInput(e.target.value)}
          style={{ padding: '7px 10px', border: '0.5px solid rgba(0,0,0,.2)', borderRadius: 8, fontSize: 13 }} />
        <button type="submit" style={{ padding: '7px 0', background: '#1a1a18', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>enter</button>
      </form>
    </div>
  );
}

function RoleCell({ role, color, onAdd, onDelete }) {
  return (
    <div className="role-cell" style={{ background: color.bg, color: color.text }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role.name}</span>
      <div className="role-actions">
        <button className="icon-btn" onClick={onAdd} title="add task">+</button>
        <button className="icon-btn del-btn" onClick={onDelete} title="delete role">✕</button>
      </div>
    </div>
  );
}

function Chip({ task, roleIdx, overdue, onEdit, onRemove }) {
  const c = rc(roleIdx);
  const border = overdue ? '#E24B4A' : c.border;
  const borderWidth = overdue ? '1.5px' : '0.5px';
  return (
    <div className={`chip${task.done ? ' done' : ''}`}
      style={{ background: c.bg, color: c.text, border: `${borderWidth} solid ${border}` }}
      onClick={(e) => { e.stopPropagation(); onEdit(task.id); }}>
      <span style={{ flex: 1 }}>
        {task.text}
        {overdue && <span style={{ fontSize: 9, opacity: .6, marginLeft: 3 }}>({task.date})</span>}
      </span>
      {task.notes && <span className="notes-dot" title={task.notes} />}
      <button className="xb" onClick={(e) => { e.stopPropagation(); onRemove(task.id); }}>×</button>
    </div>
  );
}

function DateRow({ date, today, roles, tasks, onAdd, onEdit, onRemove }) {
  const d = new Date(date + 'T12:00:00');
  const dow = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][d.getDay()];
  const mon = d.toLocaleString('default', { month: 'short' });
  const isWknd = d.getDay() === 0 || d.getDay() === 6;
  const wkCls = isWknd ? ' weekend' : '';
  const todayCls = date === today ? ' today' : '';
  return (
    <>
      <div className={`date-cell${todayCls}${wkCls}`} data-date={date}>
        <span className="dow">{dow}</span>
        <span className="day">{d.getDate()}</span>
        <span className="mon">{mon}</span>
      </div>
      {roles.map((r, i) => {
        const ct = tasks.filter(t => t.roleId === r.id && t.date === date && !isDue(t));
        return (
          <div key={r.id} className={`task-cell${wkCls}`} onClick={() => onAdd(r.id)}>
            {ct.map(t => <Chip key={t.id} task={t} roleIdx={i} onEdit={onEdit} onRemove={onRemove} />)}
            <button className="cell-add" onClick={(e) => { e.stopPropagation(); onAdd(r.id); }}>+</button>
          </div>
        );
      })}
    </>
  );
}

function TodayStrip({ roles, tasks, today, colTemplate, onAdd, onEdit, onRemove }) {
  const d = new Date();
  const dayStr = d.toLocaleString('default', { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div className="today-strip" style={{ gridTemplateColumns: colTemplate }}>
      <div className="today-label"><p>today</p><span>{dayStr}</span></div>
      {roles.map((r, i) => {
        const ut = tasks.filter(t => t.roleId === r.id && isDue(t));
        return (
          <div key={r.id} className="today-cell" onClick={() => onAdd(r.id)}>
            {ut.map(t => <Chip key={t.id} task={t} roleIdx={i} overdue={t.date && t.date < today && !t.urgent} onEdit={onEdit} onRemove={onRemove} />)}
            <button className="cell-add" onClick={(e) => { e.stopPropagation(); onAdd(r.id); }}>+</button>
          </div>
        );
      })}
    </div>
  );
}

function OneDayStrip({ roles, tasks, colTemplate, onAdd, onEdit, onRemove }) {
  return (
    <div className="oneday-strip" style={{ gridTemplateColumns: colTemplate }}>
      <div className="oneday-label"><p>one day</p><span>no deadline</span></div>
      {roles.map((r, i) => {
        const ot = tasks.filter(t => t.roleId === r.id && !t.date && !t.urgent);
        return (
          <div key={r.id} className="oneday-cell" onClick={() => onAdd(r.id)}>
            {ot.map(t => <Chip key={t.id} task={t} roleIdx={i} onEdit={onEdit} onRemove={onRemove} />)}
            <button className="cell-add" onClick={(e) => { e.stopPropagation(); onAdd(r.id); }}>+</button>
          </div>
        );
      })}
    </div>
  );
}

function TaskModal({ modal, roles, today, onSave, onDelete, onClose }) {
  const isEdit = modal.mode === 'edit';
  const [text, setText] = useState(modal.text || '');
  const [notes, setNotes] = useState(modal.notes || '');
  const [roleId, setRoleId] = useState(modal.roleId || roles[0]?.id);
  const [dateMode, setDateMode] = useState(
    modal.urgent ? 'urgent' : !modal.date && !modal.oneDay ? 'oneday' : modal.oneDay ? 'oneday' : 'date'
  );
  const [date, setDate] = useState(modal.date || today);
  const textRef = useRef(null);

  useEffect(() => { textRef.current?.focus(); }, []);

  function handleSave() {
    if (!text.trim()) return;
    const urgent = dateMode === 'urgent';
    const finalDate = urgent ? null : dateMode === 'oneday' ? null : date || null;
    onSave({ text: text.trim(), notes, roleId, date: finalDate, urgent });
  }

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>{isEdit ? 'edit task' : 'add task'}</h2>
        <label>task
          <input ref={textRef} type="text" value={text} onChange={e => setText(e.target.value)}
            placeholder="what needs doing?" onKeyDown={e => e.key === 'Enter' && handleSave()} />
        </label>
        <label>role
          <select value={roleId} onChange={e => setRoleId(e.target.value)}>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </label>
        <div>
          <div className="when-label">when</div>
          <div className="date-toggle">
            {['urgent', 'date', 'oneday'].map(m => (
              <button key={m} className={dateMode === m ? 'active' : ''} onClick={() => setDateMode(m)}>
                {m === 'urgent' ? 'today' : m === 'date' ? 'specific date' : 'one day'}
              </button>
            ))}
          </div>
          {dateMode === 'date' && (
            <div style={{ marginTop: 6 }}>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%' }} />
            </div>
          )}
        </div>
        <label>notes
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="any extra detail…" rows={3} style={{ resize: 'vertical', lineHeight: 1.5 }} />
        </label>
        <div className="modal-btns">
          {onDelete && <button className="del-btn" onClick={onDelete}>delete</button>}
          <button onClick={onClose}>cancel</button>
          <button className="save" onClick={handleSave}>save</button>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg1:#ffffff;--bg2:#f5f5f3;--bg3:#eeede9;
  --text1:#1a1a18;--text2:#5a5a56;--text3:#9a9993;
  --border1:rgba(0,0,0,.12);--border2:rgba(0,0,0,.2);
  --radius:8px;--radius-lg:12px;
}
@media(prefers-color-scheme:dark){:root{
  --bg1:#1e1e1c;--bg2:#2a2a27;--bg3:#333330;
  --text1:#e8e7e2;--text2:#a0a09a;--text3:#6a6a64;
  --border1:rgba(255,255,255,.1);--border2:rgba(255,255,255,.18);
}}
html,body{height:100%;overflow:hidden}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg3);color:var(--text1)}
button{cursor:pointer;font-family:inherit}
.app{display:flex;flex-direction:column;height:100vh}
.top-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg1);border-bottom:0.5px solid var(--border1);flex-shrink:0}
.top-bar h1{font-size:15px;font-weight:500;color:var(--text2)}
.top-bar button{font-size:12px;padding:5px 11px;border:0.5px solid var(--border2);border-radius:var(--radius);background:var(--bg1);color:var(--text1)}
.top-bar button:hover{background:var(--bg2)}
.middle{flex:1;overflow:hidden;display:flex;flex-direction:column;min-height:0}
.scroll-area{flex:1;overflow:auto;min-height:0}
.grid-wrap{display:grid;min-width:max-content}
.corner-cell{position:sticky;top:0;left:0;z-index:4;background:var(--bg2);border-right:0.5px solid var(--border1);border-bottom:0.5px solid var(--border1);padding:0 10px;display:flex;align-items:center;font-size:10px;color:var(--text3);min-height:46px;min-width:80px}
.role-cell{position:sticky;top:0;z-index:3;background:var(--bg2);border-right:0.5px solid var(--border1);border-bottom:0.5px solid var(--border1);padding:0 8px;display:flex;align-items:center;justify-content:space-between;gap:4px;min-height:46px;min-width:175px;font-size:12px;font-weight:500}
.role-cell .role-actions{display:flex;gap:2px;opacity:0;transition:opacity .15s}
.role-cell:hover .role-actions{opacity:1}
.icon-btn{background:none;border:none;padding:3px 5px;font-size:14px;line-height:1;border-radius:4px;color:var(--text2)}
.icon-btn:hover{background:var(--border1)}
.date-cell{position:sticky;left:0;z-index:2;background:var(--bg2);border-right:0.5px solid var(--border1);border-bottom:0.5px solid var(--border1);padding:3px 8px;display:flex;flex-direction:row;align-items:center;gap:4px;min-width:80px;white-space:nowrap}
.date-cell .dow{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.03em}
.date-cell .day{font-size:11px;font-weight:500}
.date-cell .mon{font-size:10px;color:var(--text3)}
.date-cell.today .dow,.date-cell.today .day,.date-cell.today .mon{color:#1D9E75}
.date-cell.weekend{background:#f0ede6}
@media(prefers-color-scheme:dark){.date-cell.weekend{background:#2f2c27}}
.task-cell{border-right:0.5px solid var(--border1);border-bottom:0.5px solid var(--border1);padding:3px 6px;display:flex;flex-direction:column;gap:2px;min-width:175px;cursor:pointer}
.task-cell.weekend{background:#f7f5f0}
@media(prefers-color-scheme:dark){.task-cell.weekend{background:#272420}}
.task-cell:hover{background:var(--bg2)}
.chip{font-size:11px;padding:3px 7px;border-radius:20px;line-height:1.4;display:flex;align-items:center;gap:4px;word-break:break-word;cursor:pointer}
.chip.done{opacity:.4;text-decoration:line-through}
.chip .xb{opacity:0;background:none;border:none;padding:0 1px;font-size:12px;line-height:1;flex-shrink:0;color:inherit}
.chip:hover .xb{opacity:1}
.notes-dot{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.4;flex-shrink:0;display:inline-block}
.cell-add{opacity:0;font-size:10px;color:var(--text3);padding:2px 3px;border:none;background:none;text-align:left}
.task-cell:hover .cell-add,.today-cell:hover .cell-add,.oneday-cell:hover .cell-add{opacity:1}
.today-strip{flex-shrink:0;display:grid;border-bottom:2px solid var(--border2);background:var(--bg1);overflow-x:auto}
.today-label{position:sticky;left:0;background:#E1F5EE;border-right:0.5px solid var(--border1);padding:8px 10px;display:flex;flex-direction:column;justify-content:center;min-width:80px;z-index:2}
.today-label p{font-size:11px;font-weight:500;color:#085041}
.today-label span{font-size:9px;color:#1D9E75;margin-top:2px}
.today-cell{border-right:0.5px solid var(--border1);padding:6px 7px;display:flex;flex-direction:column;gap:3px;min-width:175px;cursor:pointer}
.today-cell:hover{background:#f0faf6}
@media(prefers-color-scheme:dark){.today-label{background:#0a2e22}.today-label p{color:#9FE1CB}.today-label span{color:#5DCAA5}.today-cell:hover{background:#0d3828}}
.oneday-strip{flex-shrink:0;display:grid;border-top:2px solid var(--border2);background:var(--bg1);overflow-x:auto}
.oneday-label{position:sticky;left:0;background:var(--bg2);border-right:0.5px solid var(--border1);padding:8px 10px;display:flex;flex-direction:column;justify-content:center;min-width:80px;z-index:2}
.oneday-label p{font-size:11px;font-weight:500;color:var(--text2)}
.oneday-label span{font-size:9px;color:var(--text3);margin-top:2px}
.oneday-cell{border-right:0.5px solid var(--border1);padding:6px 7px;display:flex;flex-direction:column;gap:3px;min-width:175px;cursor:pointer}
.oneday-cell:hover{background:var(--bg2)}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:50;align-items:center;justify-content:center}
.overlay.open{display:flex}
.modal{background:var(--bg1);border:0.5px solid var(--border2);border-radius:var(--radius-lg);padding:20px;width:300px;display:flex;flex-direction:column;gap:11px;color:var(--text1)}
.modal h2{font-size:14px;font-weight:500}
.modal label{font-size:11px;color:var(--text2);display:flex;flex-direction:column;gap:3px}
.modal input,.modal select,.modal textarea{padding:6px 9px;border:0.5px solid var(--border2);border-radius:var(--radius);background:var(--bg1);color:var(--text1);font-size:12px;font-family:inherit;width:100%}
.when-label{font-size:11px;color:var(--text2);margin-bottom:4px}
.date-toggle{display:flex;gap:6px}
.date-toggle button{flex:1;font-size:11px;padding:5px 0;border:0.5px solid var(--border2);border-radius:var(--radius);background:var(--bg1);color:var(--text2)}
.date-toggle button.active{background:var(--text1);color:var(--bg1);border-color:var(--text1)}
.modal-btns{display:flex;gap:6px;justify-content:flex-end;margin-top:4px}
.modal-btns button{font-size:11px;padding:5px 12px;border:0.5px solid var(--border2);border-radius:var(--radius);background:var(--bg1);color:var(--text1)}
.modal-btns button:hover{background:var(--bg2)}
.modal-btns .save{background:var(--text1);color:var(--bg1);border-color:var(--text1)}
.modal-btns .save:hover{opacity:.85}
.del-btn{color:#A32D2D !important}
`;
