import { useState } from 'react'

const ALL_POSITIONS = [
  'Foreman D', 'Foreman C', 'Foreman B', 'Foreman A',
  'Site Engineer D', 'Site Engineer C', 'Site Engineer B', 'Site Engineer A',
  'Site Manager', 'Deputy PM', 'Project Manager',
]

const DEFAULT_GRAPHS = {
  'K1': [
    { from: 'Foreman D',      to: 'Foreman C'       },
    { from: 'Foreman C',      to: 'Foreman B'       },
    { from: 'Foreman B',      to: 'Foreman A'       },
    { from: 'Foreman B',      to: 'Site Engineer D' },
    { from: 'Foreman A',      to: 'Site Manager'    },
    { from: 'Site Engineer D', to: 'Site Engineer C' },
    { from: 'Site Engineer C', to: 'Site Engineer B' },
    { from: 'Site Engineer B', to: 'Site Engineer A' },
    { from: 'Site Engineer A', to: 'Site Manager'   },
    { from: 'Site Manager',   to: 'Deputy PM'       },
    { from: 'Deputy PM',      to: 'Project Manager' },
  ],
  'K2-Север': [
    { from: 'Foreman D',      to: 'Foreman C'       },
    { from: 'Foreman C',      to: 'Foreman B'       },
    { from: 'Foreman B',      to: 'Foreman A'       },
    { from: 'Foreman B',      to: 'Site Engineer D' },
    { from: 'Foreman A',      to: 'Site Manager'    },
    { from: 'Site Engineer D', to: 'Site Engineer C' },
    { from: 'Site Engineer C', to: 'Site Engineer B' },
    { from: 'Site Engineer B', to: 'Site Engineer A' },
    { from: 'Site Engineer A', to: 'Site Manager'   },
    { from: 'Site Manager',   to: 'Deputy PM'       },
    { from: 'Deputy PM',      to: 'Project Manager' },
  ],
  'K2-Юг': [
    { from: 'Foreman D',      to: 'Foreman C'       },
    { from: 'Foreman C',      to: 'Foreman B'       },
    { from: 'Foreman B',      to: 'Foreman A'       },
    { from: 'Foreman A',      to: 'Site Manager'    },
    { from: 'Site Manager',   to: 'Deputy PM'       },
    { from: 'Deputy PM',      to: 'Project Manager' },
  ],
  'K2-International': [
    { from: 'Foreman C',      to: 'Foreman B'       },
    { from: 'Foreman B',      to: 'Foreman A'       },
    { from: 'Foreman B',      to: 'Site Engineer C' },
    { from: 'Foreman A',      to: 'Site Manager'    },
    { from: 'Site Engineer C', to: 'Site Engineer B' },
    { from: 'Site Engineer B', to: 'Site Engineer A' },
    { from: 'Site Engineer A', to: 'Site Manager'   },
    { from: 'Site Manager',   to: 'Deputy PM'       },
    { from: 'Deputy PM',      to: 'Project Manager' },
  ],
}

const CLUSTERS = Object.keys(DEFAULT_GRAPHS)

export default function CareerGraph() {
  const [cluster, setCluster] = useState('K1')
  const [graphs, setGraphs] = useState(DEFAULT_GRAPHS)
  const [addForm, setAddForm] = useState({ from: ALL_POSITIONS[0], to: ALL_POSITIONS[1] })
  const [showAdd, setShowAdd] = useState(false)

  const edges = graphs[cluster] || []

  function removeEdge(from, to) {
    setGraphs(prev => ({ ...prev, [cluster]: prev[cluster].filter(e => !(e.from === from && e.to === to)) }))
  }

  function addEdge() {
    if (addForm.from === addForm.to) return
    const exists = edges.some(e => e.from === addForm.from && e.to === addForm.to)
    if (exists) return
    setGraphs(prev => ({ ...prev, [cluster]: [...prev[cluster], addForm] }))
    setShowAdd(false)
  }

  // Group edges by "from" position for display
  const grouped = edges.reduce((acc, e) => {
    if (!acc[e.from]) acc[e.from] = []
    acc[e.from].push(e.to)
    return acc
  }, {})

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Карьерный граф</h1>
          <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>Настройка переходов между должностями по кластерам</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Добавить переход
        </button>
      </div>

      {/* Cluster tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', border: '1px solid #e8edf2', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {CLUSTERS.map(c => (
          <button key={c} onClick={() => setCluster(c)} style={{ padding: '8px 20px', borderRadius: 7, border: 'none', background: cluster === c ? '#4361ee' : 'transparent', color: cluster === c ? '#fff' : '#7a8fa0', fontSize: 14, fontWeight: cluster === c ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Connections list */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8edf2', fontWeight: 600, fontSize: 14, color: '#0f1923' }}>
            Переходы — {cluster} ({edges.length})
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Откуда', 'Куда', ''].map((h, i) => (
                  <th key={i} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {edges.map((e, i) => (
                <tr key={i} style={{ borderBottom: i < edges.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
                  <td style={{ padding: '12px 20px', fontSize: 14, color: '#0f1923' }}>{e.from}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#4361ee' }}>arrow_forward</span>
                      <span style={{ fontSize: 14, color: '#0f1923' }}>{e.to}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <button onClick={() => removeEdge(e.from, e.to)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual adjacency */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1923', marginBottom: 16 }}>Структура переходов</div>
          {Object.entries(grouped).map(([from, tos]) => (
            <div key={from} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f1923', marginBottom: 4 }}>{from}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 16 }}>
                {tos.map(to => (
                  <div key={to} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#7a8fa0' }}>subdirectory_arrow_right</span>
                    <span style={{ padding: '3px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: 5, fontSize: 12, fontWeight: 600 }}>{to}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <div style={{ color: '#7a8fa0', fontSize: 13 }}>Переходы не настроены</div>
          )}
        </div>
      </div>

      {/* Add edge modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 400 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f1923', margin: '0 0 24px' }}>Добавить переход — {cluster}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Откуда
                <select value={addForm.from} onChange={e => setAddForm(f => ({ ...f, from: e.target.value }))} style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                  {ALL_POSITIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Куда
                <select value={addForm.to} onChange={e => setAddForm(f => ({ ...f, to: e.target.value }))} style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                  {ALL_POSITIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '10px 20px', border: '1px solid #e8edf2', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer' }}>Отмена</button>
              <button onClick={addEdge} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#4361ee', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
