'use client';

import { useState } from 'react';

const BR = {
  accent: '#92400e',
  accentMid: '#a16207',
  btn: 'linear-gradient(135deg, #a16207 0%, #92400e 100%)',
  tag: 'rgba(146,64,14,0.1)',
  tagBorder: 'rgba(146,64,14,0.25)',
  infoBg: '#fef9f0',
  infoBorder: 'rgba(146,64,14,0.12)',
  inputBorder: 'rgba(146,64,14,0.2)',
};

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', type: 'general', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitted(true);
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    border: `1.5px solid ${BR.inputBorder}`,
    borderRadius: 12,
    padding: '10px 16px',
    fontSize: '0.875rem',
    outline: 'none',
    color: '#1a0a00',
    background: '#fef9f0',
    transition: 'border-color 0.2s',
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
          <span className="text-2xl text-white">✓</span>
        </div>
        <h3 className="text-xl font-extrabold mb-2" style={{ color: '#1a0a00' }}>Message Sent!</h3>
        <p className="text-sm mb-6" style={{ color: '#6b4a30' }}>
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', type: 'general', subject: '', message: '' }); }}
          className="btn-brown px-6 py-2.5 rounded-xl text-sm font-bold text-white">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: BR.accent }}>Submit a Request</p>
        <h3 className="text-xl font-extrabold" style={{ color: '#1a0a00' }}>Tell Us What&apos;s Up</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4a30' }}>Your Name</label>
          <input name="name" value={form.name} onChange={handleChange} required
            placeholder="Ali Hassan"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = BR.accent)}
            onBlur={e => (e.currentTarget.style.borderColor = BR.inputBorder)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4a30' }}>Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required
            placeholder="ali@example.com"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = BR.accent)}
            onBlur={e => (e.currentTarget.style.borderColor = BR.inputBorder)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4a30' }}>Issue Type</label>
        <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
          <option value="general">General Inquiry</option>
          <option value="bug">Bug / Technical Error</option>
          <option value="order">Order Issue</option>
          <option value="delivery">Delivery Problem</option>
          <option value="payment">Payment Issue</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4a30' }}>Subject</label>
        <input name="subject" value={form.subject} onChange={handleChange} required
          placeholder="Brief summary of your issue"
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = BR.accent)}
          onBlur={e => (e.currentTarget.style.borderColor = BR.inputBorder)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4a30' }}>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} required
          rows={5} placeholder="Describe your issue in detail..."
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={e => (e.currentTarget.style.borderColor = BR.accent)}
          onBlur={e => (e.currentTarget.style.borderColor = BR.inputBorder)}
        />
      </div>

      <button type="submit" disabled={loading}
        className="btn-brown w-full py-3.5 rounded-2xl text-sm font-bold text-white disabled:opacity-60">
        {loading ? 'Sending...' : 'Send Message →'}
      </button>
    </form>
  );
}
