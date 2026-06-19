import { useState } from 'react'

const LEVELS_INFO = {
  'Базовый': 'На этом уровне присутствует базовое понимание, но практический опыт ограничен. Основные концепции известны, но ещё не применяются самостоятельно.',
  'Средний': 'На этом уровне специалист способен самостоятельно решать задачи умеренной сложности. Подтверждённый опыт практического применения навыка.',
  'Продвинутый': 'На этом уровне специалист проектирует сложные решения с полной ответственностью. Опыт в реальных проектах и элементы технического лидерства.',
  'Эксперт': 'На этом уровне специалист является признанным экспертом. Внедряет инновации, наставляет коллег, формирует стандарты в организации.',
}

const LEARNING_MATERIALS = [
  { title: 'База знаний BI Group: нормативы строительства', type: 'База знаний', badge: 'От экспертов', icon: '📚' },
  { title: 'Обязательный учебный путь для освоения навыка', type: 'Учебный путь', badge: 'От экспертов', icon: '🗺' },
]

const PRACTICAL_TASKS = [
  { title: 'Провести аудит качества на строительном объекте', start: '05 Фев 2026', workload: '1–3 ч/нед' },
  { title: 'Написать методическую инструкцию по охране труда', start: '13 Фев 2026', workload: '3–5 ч/нед' },
  { title: 'Создать BIM-модель текущего объекта', start: '05 Май 2026', workload: '3–5 ч/нед' },
  { title: 'Провести обучение для прорабов A по навыку', start: '13 Фев 2026', workload: '3–5 ч/нед' },
]

export default function SkillDetail({ skill, onBack }) {
  const [activeLevel, setActiveLevel] = useState('Базовый')
  const [myLevel, setMyLevel] = useState('Средний')
  const LEVELS = ['Базовый', 'Средний', 'Продвинутый', 'Эксперт']

  return (
    <div>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '16px 32px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4361ee', fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>← Навыки</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923' }}>{skill}</h1>
              <span style={{ color: '#cdd5e0', cursor: 'pointer' }}>⋮</span>
              <span style={{ color: '#cdd5e0', cursor: 'pointer' }}>🔗</span>
              <span style={{ color: '#cdd5e0', cursor: 'pointer' }}>♡</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button style={btnPrimary}>Поделиться</button>
              <button style={btnOutline}>Добавить в план ▾</button>
              <button style={btnOutline}>Подписаться</button>
              <span style={{ fontSize: 12, color: '#9aafbd', alignSelf: 'center' }}>Обновлено: 1 месяц назад</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#9aafbd', marginBottom: 6 }}>Укажите свой уровень навыка</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#7a8fa0' }}>Самозаявленный уровень:</span>
              <select value={myLevel} onChange={e => setMyLevel(e.target.value)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d0d7e5', fontSize: 12, color: '#4361ee', fontWeight: 600, outline: 'none' }}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 3, marginTop: 8, justifyContent: 'flex-end' }}>
              {LEVELS.map((l, i) => <div key={l} style={{ width: 18, height: 18, borderRadius: 4, background: i < LEVELS.indexOf(myLevel) + 1 ? '#4361ee' : '#e0e6ef' }} />)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', marginBottom: 10 }}>Описание навыка</div>
          <p style={{ fontSize: 13, color: '#4a6275', lineHeight: 1.6, marginBottom: 10 }}>
            {skill} охватывает способность проектировать и реализовывать решения с применением современных подходов и методологий. Этот навык связывает требования бизнеса с практической реализацией, обеспечивая надёжность и соответствие отраслевым стандартам.
          </p>
          <button style={{ fontSize: 12, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer' }}>Показать больше</button>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7a8fa0' }}>
            ✨ <button style={{ fontSize: 12, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer' }}>Сгенерировать описание через ИИ</button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #f0f2f8', marginBottom: 16 }}>
            {[...LEVELS, 'Все уровни'].map(l => (
              <button key={l} onClick={() => setActiveLevel(l)} style={{
                padding: '8px 18px', background: 'none', border: 'none',
                borderBottom: activeLevel === l ? '2.5px solid #0f1923' : '2.5px solid transparent',
                fontSize: 13, fontWeight: activeLevel === l ? 600 : 400,
                color: activeLevel === l ? '#0f1923' : '#7a8fa0', cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>

          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923', marginBottom: 8 }}>Что вы должны знать</div>
          <p style={{ fontSize: 13, color: '#4a6275', lineHeight: 1.6, marginBottom: 10 }}>
            {LEVELS_INFO[activeLevel] || 'Выберите конкретный уровень, чтобы увидеть требования.'}
          </p>
          <div style={{ fontSize: 12, color: '#7a8fa0', display: 'flex', alignItems: 'center', gap: 6 }}>
            ✨ <button style={{ fontSize: 12, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer' }}>Сгенерировать описание уровня через ИИ</button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>Учебные материалы</div>
            <button style={btnPrimary}>+ Добавить</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {LEARNING_MATERIALS.map(m => (
              <div key={m.title} style={{ border: '1px solid #e8edf2', borderRadius: 10, padding: 14, display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0f1923', marginBottom: 4 }}>{m.title}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, background: '#f0f2f8', color: '#4a6275', padding: '1px 6px', borderRadius: 6 }}>РУС</span>
                    <span style={{ fontSize: 10, background: '#f0f2f8', color: '#4a6275', padding: '1px 6px', borderRadius: 6 }}>{m.type}</span>
                    <span style={{ fontSize: 10, background: '#d1fae5', color: '#059669', padding: '1px 6px', borderRadius: 6 }}>{m.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8f9fc', borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', marginBottom: 4 }}>Учебный путь, разработанный ИИ</div>
            <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 10 }}>Получите набор рекомендованных курсов и программ, подобранных ИИ-помощником</div>
            <button style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: '#0f1923', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Создать учебный путь через ИИ</button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', marginBottom: 4 }}>Практические задания</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <button style={btnOutline}>+ Добавить личное задание</button>
            <button style={{ ...btnOutline, display: 'flex', alignItems: 'center', gap: 6 }}>✨ Сгенерировать задания через ИИ</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {PRACTICAL_TASKS.map(t => (
              <div key={t.title} style={{ border: '1px solid #e8edf2', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: '#9aafbd', marginBottom: 4 }}>Старт: {t.start}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#0f1923', marginBottom: 8, lineHeight: 1.4 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: '#7a8fa0', marginBottom: 10 }}>Нагрузка: {t.workload}</div>
                <button style={btnOutline}>Открыть</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', marginBottom: 10 }}>Вопросы для самопроверки</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={btnOutline}>+ Добавить вопрос</button>
            <button style={{ ...btnOutline, display: 'flex', alignItems: 'center', gap: 6 }}>✨ Сгенерировать вопросы через ИИ</button>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: '#9aafbd', textAlign: 'center', padding: 20 }}>Контент от экспертов пока отсутствует</div>
        </div>
      </div>
    </div>
  )
}

const btnPrimary = { padding: '7px 16px', borderRadius: 7, border: 'none', background: '#4361ee', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }
const btnOutline = { padding: '7px 16px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer' }
