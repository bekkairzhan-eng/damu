// Радарный (паутинный) график для HR-рейтинга
// scores: массив чисел 0–5, по одному на каждую ось (порядок = порядок RATING_COMPONENTS)
// shortLabels: массив коротких названий осей
// size: размер SVG в px
// showLabels: показывать ли подписи и значения (false = мини-режим)

export function RadarChart({ scores, shortLabels, size = 220, showLabels = true }) {
  const N = scores.length
  const cx = size / 2
  const cy = size / 2

  // Радиус полигона — оставляем место для подписей
  const r = showLabels ? size * 0.31 : size * 0.41

  function angle(i) {
    return -Math.PI / 2 + (i * 2 * Math.PI) / N
  }

  function pt(i, frac) {
    const a = angle(i)
    return [
      cx + r * frac * Math.cos(a),
      cy + r * frac * Math.sin(a),
    ]
  }

  function toPolyPts(fracs) {
    return fracs.map((f, i) => pt(i, Math.max(0.04, f)).join(',')).join(' ')
  }

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]
  const actualFracs = scores.map(s => s / 5)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Концентрические сетки */}
      {gridLevels.map(lv => (
        <polygon
          key={lv}
          points={toPolyPts(Array(N).fill(lv))}
          fill={lv === 1.0 ? 'rgba(67,97,238,0.04)' : 'none'}
          stroke={lv === 1.0 ? '#bfcad5' : '#e8edf2'}
          strokeWidth={lv === 1.0 ? 1.2 : 0.7}
        />
      ))}

      {/* Оси от центра */}
      {Array.from({ length: N }).map((_, i) => {
        const [x, y] = pt(i, 1.0)
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y}
            stroke="#dde4ea" strokeWidth={0.8} />
        )
      })}

      {/* Заливка фактических показателей */}
      <polygon
        points={toPolyPts(actualFracs)}
        fill="rgba(67,97,238,0.18)"
        stroke="#4361ee"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />

      {/* Точки на осях */}
      {actualFracs.map((f, i) => {
        const [x, y] = pt(i, Math.max(0.04, f))
        return (
          <circle key={i} cx={x} cy={y}
            r={showLabels ? 3.5 : 2.5}
            fill="#4361ee"
          />
        )
      })}

      {/* Подписи и значения (только в полном режиме) */}
      {showLabels && shortLabels && shortLabels.map((label, i) => {
        const a = angle(i)
        const lf = 1.38
        const lx = cx + r * lf * Math.cos(a)
        const ly = cy + r * lf * Math.sin(a)
        const cosA = Math.cos(a)
        const ta = Math.abs(cosA) < 0.25 ? 'middle' : cosA > 0 ? 'start' : 'end'

        const score = scores[i]
        const gap = parseFloat((5 - score).toFixed(1))

        return (
          <g key={i}>
            {/* Короткое название оси */}
            <text
              x={lx} y={ly - 3}
              textAnchor={ta}
              fontSize={9.5}
              fontWeight="600"
              fill="#7a8fa0"
              style={{ fontFamily: 'inherit' }}
            >
              {label}
            </text>
            {/* Числовое значение */}
            <text
              x={lx} y={ly + 10}
              textAnchor={ta}
              fontSize={11.5}
              fontWeight="800"
              fill="#0f1923"
              style={{ fontFamily: 'inherit' }}
            >
              {score.toFixed(1)}
            </text>
            {/* Дефицит до 5.0 — красным, если значимый */}
            {gap >= 0.3 && (
              <text
                x={lx} y={ly + 21}
                textAnchor={ta}
                fontSize={8.5}
                fill="#ef4444"
                style={{ fontFamily: 'inherit' }}
              >
                −{gap.toFixed(1)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
