'use client';

import { useState } from 'react';

/* Brown palette constants */
const BR = {
  btn: 'linear-gradient(135deg, #a16207 0%, #92400e 100%)',
  btnHover: '0 12px 28px rgba(146,64,14,0.4)',
  accent: '#92400e',
  accentMid: '#a16207',
  accentLight: '#d97706',
  selected: 'rgba(146,64,14,0.12)',
  selectedBorder: '#92400e',
  resultBg: 'rgba(146,64,14,0.08)',
  resultBorder: 'rgba(146,64,14,0.2)',
  tag: 'rgba(146,64,14,0.11)',
  tagBorder: 'rgba(146,64,14,0.25)',
};

const THICKNESS_OPTIONS = [
  { value: '4.5', label: '4.5"', sub: 'Single Layer' },
  { value: '9', label: '9"', sub: 'Standard Double' },
];

export default function BrickCalculator() {
  const [length, setLength] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [thickness, setThickness] = useState<'4.5' | '9'>('9');
  const [costPerBrick, setCostPerBrick] = useState<number | ''>('');
  const [result, setResult] = useState<{ bricks: number; totalCost: number; bags: number } | null>(null);

  const handleCalculate = () => {
    if (!length || !height) return;
    const areaSqFt = (length as number) * (height as number);
    const bricksPerSqFt = thickness === '9' ? 10.5 : 5.25;
    const bricks = Math.ceil(areaSqFt * bricksPerSqFt);
    const bags = Math.ceil(bricks / 350);
    const totalCost = costPerBrick ? Math.ceil(bricks * (costPerBrick as number)) : 0;
    setResult({ bricks, totalCost, bags });
  };

  const inputStyle = {
    backgroundColor: '#fef9f0',
    border: '1.5px solid rgba(146,64,14,0.18)',
    color: '#1a0a00',
    borderRadius: 12,
    padding: '10px 16px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ background: '#fffbf7', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="flex flex-col lg:flex-row gap-14 items-start justify-between max-w-6xl mx-auto px-6 lg:px-16">

        {/* ── Left text */}
        <div className="flex-1 lg:max-w-sm pt-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: BR.tag, border: `1px solid ${BR.tagBorder}`, color: BR.accent }}>
            🧮 Brick Estimator
          </span>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-4"
            style={{ color: '#1a0a00', letterSpacing: '-0.02em' }}>
            Plan Your Build<br />With Confidence
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b4a30' }}>
            Not sure how many bricks your wall needs? Enter dimensions and get an instant count — plus total material cost so you can budget before ordering.
          </p>
          <ul className="space-y-2.5">
            {[
              'Accounts for 5% wastage allowance',
              'Supports 4.5" and 9" wall types',
              'Calculates mortar bags needed',
              'Total cost with your price per brick',
            ].map(t => (
              <li key={t} className="flex items-start gap-2.5 text-sm" style={{ color: '#6b4a30' }}>
                <span className="mt-0.5 font-black" style={{ color: BR.accentMid }}>✦</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right card */}
        <div className="flex-1 w-full max-w-md rounded-3xl overflow-hidden transition-all duration-300"
          style={{
            background: '#fff',
            border: `2px solid ${BR.accent}`,
            boxShadow: '0 12px 40px rgba(146,64,14,0.12)',
          }}>
          <div className="p-7 space-y-5">

            {/* Length & Height */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Wall Length (ft)', value: length, set: setLength },
                { label: 'Wall Height (ft)', value: height, set: setHeight },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4a30' }}>{label}</label>
                  <input type="number" min="0" value={value}
                    onChange={e => { set(parseFloat(e.target.value) || ''); setResult(null); }}
                    placeholder="e.g. 20"
                    suppressHydrationWarning
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = BR.accent)}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(146,64,14,0.18)')}
                  />
                </div>
              ))}
            </div>

            {/* Thickness */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#6b4a30' }}>Wall Thickness</label>
              <div className="grid grid-cols-2 gap-3">
                {THICKNESS_OPTIONS.map(opt => (
                  <label key={opt.value}
                    className="cursor-pointer rounded-2xl p-3 text-center transition-all duration-200"
                    style={{
                      backgroundColor: thickness === opt.value ? BR.selected : '#fef9f0',
                      border: `1.5px solid ${thickness === opt.value ? BR.selectedBorder : 'rgba(146,64,14,0.15)'}`,
                    }}>
                    <input type="radio" name="thickness" value={opt.value} className="hidden"
                      checked={thickness === opt.value}
                      suppressHydrationWarning
                      onChange={() => { setThickness(opt.value as '4.5' | '9'); setResult(null); }} />
                    <span className="font-black block text-base" style={{ color: '#1a0a00' }}>{opt.label}</span>
                    <span className="text-xs" style={{ color: '#9a6040' }}>{opt.sub}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cost per brick */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4a30' }}>
                Cost Per Brick (PKR) <span style={{ color: BR.accentMid }}>— optional</span>
              </label>
              <input type="number" min="0" value={costPerBrick}
                onChange={e => { setCostPerBrick(parseFloat(e.target.value) || ''); setResult(null); }}
                placeholder="e.g. 18"
                suppressHydrationWarning
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = BR.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(146,64,14,0.18)')}
              />
            </div>

            {/* Calculate button */}
            <button onClick={handleCalculate} disabled={!length || !height}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40"
              style={{ background: BR.btn, boxShadow: '0 6px 20px rgba(146,64,14,0.35)' }}>
              Calculate →
            </button>

            {/* Results */}
            {result && (
              <div className="rounded-2xl p-5 space-y-3"
                style={{ background: BR.resultBg, border: `1px solid ${BR.resultBorder}` }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BR.accent }}>
                  Estimated Materials
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1a0a00' }}>Total Bricks</p>
                    <p className="text-xs" style={{ color: '#9a6040' }}>incl. 5% wastage</p>
                  </div>
                  <p className="text-3xl font-black" style={{ color: BR.accent }}>{result.bricks.toLocaleString()}</p>
                </div>
                {result.totalCost > 0 && (
                  <div className="flex justify-between items-center pt-3" style={{ borderTop: `1px solid ${BR.resultBorder}` }}>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#1a0a00' }}>Total Cost</p>
                      <p className="text-xs" style={{ color: '#9a6040' }}>at your price/brick</p>
                    </div>
                    <p className="text-xl font-black" style={{ color: '#1a0a00' }}>PKR {result.totalCost.toLocaleString()}</p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3" style={{ borderTop: `1px solid ${BR.resultBorder}` }}>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1a0a00' }}>Cement Bags (50kg)</p>
                    <p className="text-xs" style={{ color: '#9a6040' }}>approx. for mortar</p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: '#1a0a00' }}>~{result.bags}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
