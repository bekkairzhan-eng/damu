const certs = [
  { name: 'Удостоверение по охране труда и ТБ (РК)', type: 'Сертификат', status: 'Действителен', issued: '15 Мар 2024' },
  { name: 'Технический надзор в строительстве', type: 'Сертификат', status: 'Действителен', issued: '20 Янв 2023' },
  { name: 'BIM-технологии: базовый курс (Autodesk)', type: 'Сертификат', status: 'Действителен', issued: '10 Июн 2023' },
  { name: 'Lean Construction (BI Group)', type: 'Сертификат', status: 'Действителен', issued: '05 Авг 2023' },
  { name: 'Пожарная безопасность (уровень 2)', type: 'Сертификат', status: 'Истёк', issued: '01 Янв 2022' },
]

const industryExp = [
  { industry: 'Жилое строительство', sub: '', total: '2 г 3 мес', latest: '01 Июн 2026' },
  { industry: 'Коммерческая недвижимость', sub: '', total: '1 г 1 мес', latest: '28 Авг 2025' },
  { industry: 'Инфраструктурные объекты', sub: 'Badge', total: '8 мес', latest: '02 Фев 2025' },
  { industry: 'Промышленное строительство', sub: '', total: '4 мес', latest: '01 Окт 2024' },
]

export default function ExperienceProfile() {
  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ background: '#f8f9fc', border: '1px solid #e0e6ef', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#4a6275' }}>
        📊 Профиль опыта объединяет данные о вашей производственной деятельности, участии в корпоративных инициативах и программах BI Group.
      </div>

      <Section title="Общий опыт">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InfoRow label="Стаж работы в BI Group" value="4 года 11 месяцев" />
            <InfoRow label="Опыт на текущей должности" value="2 года 6 месяцев" />
            <InfoRow label="Подтверждённый уровень казахского" value={<span>B2 <span style={{ fontSize: 11, color: '#7a8fa0' }}>· Подтверждён 12 Мар 2024</span></span>} />
            <InfoRow label="Рейтинг профиля сотрудника" value={<span style={{ fontWeight: 700, color: '#4361ee' }}>#3 (4.1)</span>} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RoleCard role="Foreman B" dept="BI Development" date="01 Янв 2024" current />
            <RoleCard role="Foreman A" dept="BI Development" date="17 Июл 2021" />
          </div>
        </div>
      </Section>

      <Section title="Отраслевой опыт">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f2f8' }}>
              {['Отрасль / Подотрасль', 'Общий стаж', 'Последний опыт', 'Текущие проекты'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#7a8fa0', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {industryExp.map(row => (
              <tr key={row.industry} style={{ borderBottom: '1px solid #f0f2f8' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500, color: '#0f1923' }}>{row.industry} {row.sub && <span style={{ fontSize: 10, background: '#4361ee', color: '#fff', padding: '1px 6px', borderRadius: 10, marginLeft: 4 }}>Badge</span>}</td>
                <td style={{ padding: '10px 12px', color: '#4a6275' }}>{row.total}</td>
                <td style={{ padding: '10px 12px', color: '#4a6275' }}>{row.latest}</td>
                <td style={{ padding: '10px 12px', color: '#9aafbd' }}>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Сертификаты" action={<button style={btnPrimary}>+ Добавить</button>}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#7a8fa0' }}>Сортировка:</span>
          <select style={{ fontSize: 12, border: '1px solid #e0e6ef', borderRadius: 6, padding: '2px 8px', color: '#4a6275' }}>
            <option>Дата выдачи</option><option>Срок истечения</option>
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f2f8' }}>
              {['Сертификат', 'Тип', 'Статус', 'Дата выдачи', 'Дата истечения'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#7a8fa0', fontWeight: 600, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid #f0f2f8' }}>
                <td style={{ padding: '10px 12px', color: '#0f1923', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: '#4361ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontSize: 12 }}>🏆</span>
                    </div>
                    {c.name}
                  </div>
                </td>
                <td style={{ padding: '10px 12px', color: '#4a6275' }}>{c.type}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: c.status === 'Действителен' ? '#d1fae5' : '#fee2e2', color: c.status === 'Действителен' ? '#059669' : '#dc2626' }}>{c.status}</span>
                </td>
                <td style={{ padding: '10px 12px', color: '#4a6275' }}>{c.issued}</td>
                <td style={{ padding: '10px 12px', color: '#9aafbd' }}>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#9aafbd', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#0f1923' }}>{value}</div>
    </div>
  )
}

function RoleCard({ role, dept, date, current }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${current ? '#c7d2fe' : '#e8edf2'}`, background: current ? '#f0f4ff' : '#fafafa' }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: current ? '#4361ee' : '#0f1923' }}>{role} {current && <span style={{ fontSize: 10, background: '#4361ee', color: '#fff', padding: '1px 6px', borderRadius: 10 }}>текущая</span>}</div>
      <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 2 }}>{dept} · с {date}</div>
    </div>
  )
}

const btnPrimary = { padding: '7px 16px', borderRadius: 7, border: 'none', background: '#4361ee', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 }
