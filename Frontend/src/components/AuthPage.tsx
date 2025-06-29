// AuthPage.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (isLogin) {
      await supabase.auth.signInWithPassword({ email, password });
    } else {
      const { data } = await supabase.auth.signUp({
        email,
        password
      });

      if (data?.user) {
        await supabase.from('profiles').insert([
          { id: data.user.id, full_name: fullName }
        ]);
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      {!isLogin && (
        <input
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
      )}
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>
        {isLogin ? 'Login' : 'Create Account'}
      </button>
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
        {isLogin ? 'Need an account?' : 'Already have one? Log in'}
      </p>
    </div>
  );
}
