import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthFlowProps {
  onLoginSuccess: (user: User) => void;
}

export default function AuthFlow({ onLoginSuccess }: AuthFlowProps) {
  const [screen, setScreen] = useState<'login' | 'signup'>('login');
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);

  // Password strength state
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }
    let score = 0;
    if (password.length > 0) score = 1;
    if (password.length > 4) score = 2;
    if (password.length > 7 && /[A-Z]/.test(password)) score = 3;
    if (password.length > 10 && /[!@#$%^&*]/.test(password)) score = 4;
    setStrength(score);
  }, [password]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMessage('Redirecting to Dashboard...');
      setShowToast(true);
      setTimeout(() => {
        onLoginSuccess({
          name: fullName || 'Architect',
          email: email,
          role: 'Principal Architect',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSwBXWnUusNPmxKVrniF6hymeABdQ3bMU-ElHJEpfhFz7IHDbmhdcZjhG2fDfiBVaEHcTPjxMbA8abyNlQhGcnGusuYp4t_VwHvSFSwoxSGF0FEOjA2FB1YrD3bX8Yu-W-ifb5_62qPYTKCyij-IlVNozVe6ycGS_fZRq9YYQtkDMsKjzOcY3nz0fxlQmcgagsCrKzt5h4kPqDO-_yaffnSRyEog634ErNCHeP6hVgXW9YDzqrsS56f3_qM97Li99MEWp8CYN7tA',
          company: 'Lumina Tech'
        });
      }, 1500);
    }, 1200);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMessage('Account created! Booting workspace...');
      setShowToast(true);
      setTimeout(() => {
        onLoginSuccess({
          name: fullName || 'John Doe',
          email: email || 'name@company.com',
          role: role || 'Engineering Manager',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSwBXWnUusNPmxKVrniF6hymeABdQ3bMU-ElHJEpfhFz7IHDbmhdcZjhG2fDfiBVaEHcTPjxMbA8abyNlQhGcnGusuYp4t_VwHvSFSwoxSGF0FEOjA2FB1YrD3bX8Yu-W-ifb5_62qPYTKCyij-IlVNozVe6ycGS_fZRq9YYQtkDMsKjzOcY3nz0fxlQmcgagsCrKzt5h4kPqDO-_yaffnSRyEog634ErNCHeP6hVgXW9YDzqrsS56f3_qM97Li99MEWp8CYN7tA',
          company: company || 'Acme Corp'
        });
      }, 1500);
    }, 1200);
  };

  const handleVerificationChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = val;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`verify-${index + 1}`);
      nextInput?.focus();
    }
  };

  const renderStrengthMeter = () => {
    const bars = [];
    for (let i = 1; i <= 4; i++) {
      let bgClass = 'bg-neutral-800';
      if (strength >= i) {
        if (strength === 1) bgClass = 'bg-rose-500';
        else if (strength === 2) bgClass = 'bg-amber-500';
        else if (strength === 3) bgClass = 'bg-indigo-500';
        else bgClass = 'bg-emerald-500';
      }
      bars.push(
        <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${bgClass}`} />
      );
    }
    return <div className="flex gap-1.5 mt-2">{bars}</div>;
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-700 antialiased flex overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-white border border-slate-200 px-6 py-4 rounded-xl flex items-center gap-4 z-50 shadow-2xl animate-bounce">
          <span className="material-symbols-outlined text-indigo-600 font-bold">verified_user</span>
          <span className="text-slate-800 font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Left Column: Technical Branding - Visible on LG screens */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 flex-col justify-between p-16 border-r border-slate-800">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <span className="font-sans text-xl font-bold text-white tracking-tight">KnowledgeOS</span>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-mono text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">Enterprise Intelligence v4.0</span>
          </div>
          <h1 className="font-sans text-5xl font-extrabold text-white tracking-tight leading-none">
            Architecting the future of collective wisdom.
          </h1>
          <p className="text-lg text-indigo-100/80 leading-relaxed">
            Unify your organization's fragmented knowledge into a single, high-performance execution engine. KnowledgeOS transforms data into strategic action at the speed of thought.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-indigo-300/40 font-mono text-xs font-semibold">
          <div className="flex gap-6">
            <span>SECURE PROTOCOL L-7</span>
            <span>ENCRYPTED END-TO-END</span>
          </div>
          <div>© 2026 KNOWLEDGEOS INC.</div>
        </div>
      </section>

      {/* Right Column: Interaction Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 text-md">hub</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">KnowledgeOS</span>
          </div>

          {screen === 'login' ? (
            /* Login Screen */
            <div className="space-y-6">
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
                <p className="text-slate-500 text-sm">Enter your credentials to access your intelligence workspace.</p>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('architect@company.com');
                    setFullName('Architect');
                    setPassword('********');
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 bg-white transition-colors group cursor-pointer shadow-sm"
                >
                  <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="currentColor"></path>
                  </svg>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Google Demo</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('john.doe@company.com');
                    setFullName('John Doe');
                    setPassword('********');
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 bg-white transition-colors group cursor-pointer shadow-sm"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                  </svg>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">GitHub Demo</span>
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center"><span className="bg-slate-50 px-4 text-slate-400 font-mono text-xs uppercase font-bold">Or continue with email</span></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold" htmlFor="email">Work Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@company.com"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-300 font-sans focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold" htmlFor="password">Password</label>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-indigo-600 hover:text-indigo-700 font-mono text-xs transition-colors font-semibold">Forgot password?</a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-300 font-sans focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-300 bg-white text-indigo-600 focus:ring-indigo-600 focus:ring-offset-transparent cursor-pointer"
                  />
                  <label htmlFor="remember" className="font-sans text-sm text-slate-500 cursor-pointer select-none font-medium">
                    Remember this device for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </div>
                  ) : (
                    'Sign In to KnowledgeOS'
                  )}
                </button>
              </form>

              {/* Toggle to Signup */}
              <p className="text-center text-slate-500 text-sm font-sans pt-2">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setScreen('signup');
                    setSignupStep(1);
                  }}
                  className="text-indigo-600 hover:underline font-bold cursor-pointer"
                >
                  Create a free trial account
                </button>
              </p>
            </div>
          ) : (
            /* Signup Screen (Step 1, Step 2, Step 3) */
            <div className="space-y-6">
              {/* Step indicator */}
              <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
                  style={{ width: `${(signupStep / 3) * 100}%` }}
                />
              </div>

              {signupStep === 1 && (
                /* Sign up Step 1: Account details */
                <div className="space-y-6">
                  <header className="space-y-2 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create your account</h2>
                    <p className="text-slate-500 text-sm">Start your 14-day premium trial today.</p>
                  </header>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-300 font-sans focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">Work Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@company.com"
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-300 font-sans focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-300 font-sans focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all shadow-sm"
                      />
                      {renderStrengthMeter()}
                      <p className="text-[11px] text-slate-400 font-mono mt-1">Min. 8 characters with capital letters and symbols.</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (fullName && email && password) {
                           setSignupStep(2);
                        } else {
                          alert('Please fill out all fields.');
                        }
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100"
                    >
                      Continue to Workspace
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                    
                    <p className="text-center text-slate-500 mt-6 text-sm">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setScreen('login')}
                        className="text-indigo-600 hover:underline font-bold cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {signupStep === 2 && (
                /* Sign up Step 2: Workspace details */
                <div className="space-y-6">
                  <header className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors font-mono uppercase text-[11px] cursor-pointer mb-2 font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      Go Back
                    </button>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Setup Workspace</h2>
                    <p className="text-slate-500 text-sm">Configure your collaborative environment.</p>
                  </header>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">Company Name</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-300 font-sans focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">Your Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-sans focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all appearance-none shadow-sm"
                      >
                        <option disabled value="">Select position</option>
                        <option value="Engineering Manager">Engineering Manager</option>
                        <option value="Principal Architect">Principal Architect</option>
                        <option value="Product Lead">Product Lead</option>
                        <option value="Security Architect">Security Architect</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-sm text-slate-500 leading-tight select-none font-medium">
                        I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="text-indigo-600 underline font-semibold">Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()} className="text-indigo-600 underline font-semibold">Privacy Policy</a>.
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (company && role && termsAccepted) {
                          setSignupStep(3);
                        } else {
                          alert('Please fill out all fields and accept the Terms to continue.');
                        }
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100"
                    >
                      Create Workspace
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </button>
                  </div>
                </div>
              )}

              {signupStep === 3 && (
                /* Sign up Step 3: Activation / Verification Prompt */
                <form onSubmit={handleSignupSubmit} className="space-y-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mb-2 relative">
                    <span className="material-symbols-outlined text-indigo-600 text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Verify your email</h2>
                    <p className="text-slate-500 text-sm">
                      We've sent a 4-digit verification code to <br />
                      <span className="text-indigo-600 font-bold font-mono">{email || 'john.doe@company.com'}</span>
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    {verificationCode.map((char, index) => (
                      <input
                        key={index}
                        id={`verify-${index}`}
                        type="text"
                        maxLength={1}
                        value={char}
                        onChange={(e) => handleVerificationChange(index, e.target.value)}
                        className="w-12 h-14 bg-white border border-slate-200 rounded-lg text-center text-2xl font-bold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all shadow-sm"
                      />
                    ))}
                  </div>

                  <div className="w-full space-y-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100"
                    >
                      {loading ? 'Activating Workspace...' : 'Complete Activation'}
                    </button>

                    <p className="text-xs text-slate-500 font-medium">
                      Didn't receive the email?{' '}
                      <a href="#" onClick={(e) => e.preventDefault()} className="text-indigo-600 hover:underline font-bold">Resend code</a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer certification details */}
          <footer className="pt-4 flex flex-col items-center gap-4 border-t border-slate-200">
            <div className="flex items-center gap-6 text-slate-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-slate-400">lock</span>
                Secure Encryption
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-slate-400 font-bold">dns</span>
                SOC2 Compliant
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-slate-400">public</span>
                EU Data Residency
              </div>
            </div>
            <p className="text-slate-300 text-[10px] font-mono text-center">
              © 2026 KnowledgeOS Intelligence. All rights reserved.
            </p>
          </footer>
        </div>
      </section>

      {/* Decorative Slide-in card for visual interest - Desktop Only */}
      <div className="hidden xl:block fixed top-1/2 right-12 -translate-y-1/2 w-[340px] pointer-events-none z-10">
        <div className="bg-white border-l-4 border-l-indigo-600 p-6 rounded-2xl border-y border-r border-slate-200 shadow-xl space-y-4">
          <p className="font-mono text-[10px] text-indigo-600 uppercase tracking-wider font-bold">Live Insight</p>
          <p className="text-slate-700 text-sm font-sans italic leading-relaxed font-medium">
            "KnowledgeOS reduced our technical debt onboarding by 40% in the first quarter."
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-100">
              <img 
                className="w-full h-full object-cover" 
                alt="Sarah Chen" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Ot93VXzyB35uP0g1pANBROg4VJgIo3oGDC_dd_tdG2C6BE95YiUSG7xdkbHcsvfsakSarBTOn6aEKeKHg0X84Em-cT5ZI1WebJY2TJo5LLAmFOpV3nJJoRggEQwbbsWRmkioSuTTZ_F-5g2gW6PiA7DvYVeLhESJCiuSxKlqFu4M3NSWq3tDt6WRLQ6REy3mJmdommPHvx5bhzZvwq9zKxwB8hBd0DLxp4P7MlM1HTFD_258xzRVeEdRIBpqYFg9ShyCGdporQ"
              />
            </div>
            <div>
              <p className="text-slate-800 font-extrabold text-xs">Sarah Chen</p>
              <p className="text-slate-400 text-[10px] font-medium font-mono">VP Eng, CloudScale</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
