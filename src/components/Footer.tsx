import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ background: '#1a0a00', color: '#fff' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-14 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
                                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                                    <rect x="4" y="8" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
                                    <rect x="16" y="8" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
                                    <rect x="4" y="15" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
                                    <rect x="18" y="15" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
                                    <rect x="4" y="22" width="8" height="5" rx="1" fill="#fff" fillOpacity="0.5" />
                                    <rect x="14" y="22" width="14" height="5" rx="1" fill="#fff" fillOpacity="0.8" />
                                </svg>
                            </div>
                            <span className="text-base font-extrabold tracking-tight">
                                Apna{' '}
                                <span style={{ background: 'linear-gradient(135deg, #d97706, #a16207)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Bhatta
                                </span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            Pakistan&apos;s official store for premium quality bricks — direct from the source to your site.
                        </p>
                        <div className="flex gap-3">
                            {['Facebook', 'Instagram', 'WhatsApp'].map(s => (
                                <a key={s} href="#" aria-label={s}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold hover:opacity-80 transition"
                                    style={{ background: 'rgba(161,98,7,0.15)', border: '1px solid rgba(161,98,7,0.2)', color: '#d97706' }}>
                                    {s[0]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: '#a16207' }}>Navigation</h3>
                        <ul className="space-y-2.5">
                            {[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'About Us', href: '/about' }, { label: 'Contact Us', href: '/contact' }].map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.45)' }}>{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Users */}
                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: '#a16207' }}>For Users</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Customer Login', href: '/login/customer' },
                                { label: 'Driver Login', href: '/login/driver' },
                            ].map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.45)' }}>{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: '#a16207' }}>Get In Touch</h3>
                        <ul className="space-y-3 mb-5">
                            {[{ icon: '📍', text: 'Kasur Pakistan' }, { icon: '📞', text: '+92 3001234567' }, { icon: '✉️', text: 'support@apnabhatta.pk' }].map(c => (
                                <li key={c.text} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                    <span>{c.icon}</span><span>{c.text}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/contact"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition"
                            style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
                            Send Message ›
                        </Link>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}>
                    <p>© {new Date().getFullYear()} Apna Bhatta. All rights reserved.</p>
                    <p>Built with ❤️ for Pakistan&apos;s construction industry.</p>
                </div>
            </div>
        </footer>
    );
}
