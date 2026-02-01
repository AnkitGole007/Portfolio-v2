'use client';

import { useState } from 'react';
import SectionLayout from '@/components/SectionLayout';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  ExternalLink
} from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail size={24} />,
    label: 'Email',
    value: 'aggole@wpi.edu',
    href: 'mailto:aggole@wpi.edu',
    color: '#0a84ff',
  },
  {
    icon: <Mail size={24} />,
    label: 'Personal Email',
    value: 'ankit17.gole@gmail.com',
    href: 'mailto:ankit17.gole@gmail.com',
    color: '#5e5ce6',
  },
  {
    icon: <Phone size={24} />,
    label: 'Phone',
    value: '+1 (774) 525-2916',
    href: 'tel:+17745252916',
    color: '#30d158',
  },
  {
    icon: <MapPin size={24} />,
    label: 'Location',
    value: 'Worcester, MA',
    href: null,
    color: '#ff375f',
  },
];

const socialLinks = [
  {
    icon: <Github size={24} />,
    label: 'GitHub',
    username: 'AnkitGole007',
    href: 'https://github.com/AnkitGole007',
    color: '#f5f5f7',
  },
  {
    icon: <Linkedin size={24} />,
    label: 'LinkedIn',
    username: 'ankit-gole',
    href: 'https://linkedin.com/in/ankit-gole',
    color: '#0077b5',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - in production, connect to a backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Open email client with pre-filled content
    const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`);
    const body = encodeURIComponent(
      `From: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:aggole@wpi.edu?subject=${subject}&body=${body}`;

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <SectionLayout title="Contact" subtitle="Ping my inbox">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Get in Touch</h3>
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 5 }}
                  className="group"
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-4 p-3 rounded-xl
                               hover:bg-white/5 transition-colors"
                    >
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <span style={{ color: item.color }}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">{item.label}</p>
                        <p className="text-white group-hover:text-[#0a84ff] transition-colors">
                          {item.value}
                        </p>
                      </div>
                      <ExternalLink
                        size={16}
                        className="ml-auto text-white/30 group-hover:text-white/60 transition-colors"
                      />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-3">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <span style={{ color: item.color }}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">{item.label}</p>
                        <p className="text-white">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Connect</h3>
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5
                           border border-white/10 hover:border-[#0a84ff]/50
                           hover:bg-[#0a84ff]/5 transition-all duration-300 group"
                >
                  <span style={{ color: link.color }}>{link.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium">{link.label}</p>
                    <p className="text-white/50 text-sm">@{link.username}</p>
                  </div>
                  <ExternalLink
                    size={18}
                    className="text-white/30 group-hover:text-white/60 transition-colors"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Send a Message</h3>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-[#30d158]/20 flex items-center justify-center mx-auto mb-4">
                <Send size={28} className="text-[#30d158]" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Message Ready!</h4>
              <p className="text-white/50">
                Your email client should have opened. Thanks for reaching out!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-[#0a84ff] hover:text-[#5e5ce6] transition-colors"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/70 text-sm mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder:text-white/30
                           focus:outline-none focus:border-[#0a84ff]/50 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder:text-white/30
                           focus:outline-none focus:border-[#0a84ff]/50 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder:text-white/30 resize-none
                           focus:outline-none focus:border-[#0a84ff]/50 transition-colors"
                  placeholder="What would you like to discuss?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]
                         text-white font-medium flex items-center justify-center gap-2
                         hover:shadow-lg hover:shadow-[#0a84ff]/25 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </SectionLayout>
  );
}
