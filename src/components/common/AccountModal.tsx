import React, { useState } from 'react';

import {
  X,
  User,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

import {
  api,
} from '../../services/api';

import {
  Artifact,
} from '../../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;

  bookmarkedArtifacts: Artifact[];

  onSelectArtifact: (
    artifact: Artifact
  ) => void;

  onOpenContribute: () => void;
}

type AuthMode =
  | 'login'
  | 'register';

export const AccountModal:
React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onOpenContribute,
}) => {

  const [mode, setMode] =
    useState<AuthMode>('login');

  const [username, setUsername] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [
    loggedIn,
    setLoggedIn,
  ] = useState(
    api.isLoggedIn()
  );

  if (!isOpen) {
    return null;
  }

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    if (
      !username.trim() ||
      !password
    ) {
      setError(
        'Username and password are required.'
      );

      return;
    }

    try {

      setLoading(true);

      setError('');

      setMessage('');

      await api.login({
        username:
          username.trim(),

        password,
      });

      setLoggedIn(true);

      setMessage(
        'Login successful.'
      );

      localStorage.setItem(
        'hh_username',
        username.trim()
      );

    } catch (err: any) {

      console.error(
        'Login failed:',
        err
      );

      setError(
        err?.message ||
        'Invalid username or password.'
      );

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     REGISTER
  ========================================================= */

  const handleRegister = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password
    ) {

      setError(
        'Username, email and password are required.'
      );

      return;
    }

    try {

      setLoading(true);

      setError('');

      setMessage('');

      await api.register({
        username:
          username.trim(),

        email:
          email.trim(),

        password,

        role:
          'contributor',
      });

      setMessage(
        'Registration successful. You can now log in.'
      );

      setPassword('');

      setMode('login');

    } catch (err: any) {

      console.error(
        'Registration failed:',
        err
      );

      setError(
        err?.message ||
        'Unable to register account.'
      );

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {

    api.logout();

    localStorage.removeItem(
      'hh_username'
    );

    setLoggedIn(false);

    setUsername('');

    setPassword('');

    setMessage(
      'Logged out successfully.'
    );

    setError('');
  };

  const storedUsername =
    localStorage.getItem(
      'hh_username'
    );

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        fixed inset-0 z-[100]
        bg-black/60
        backdrop-blur-sm
        flex items-center
        justify-center
        p-4
      "
      onClick={onClose}
    >

      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          bg-[#faf9f5]
          w-full
          max-w-lg
          border
          border-[#c4c7c7]
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-[#c4c7c7]
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-10 h-10
                rounded-full
                bg-[#94492d]
                text-white
                flex
                items-center
                justify-center
              "
            >
              <User className="w-5 h-5" />
            </div>

            <div>

              <h2
                className="
                  font-display
                  text-xl
                  font-bold
                "
              >
                HeritageHub Account
              </h2>

              <p
                className="
                  text-xs
                  text-[#747878]
                "
              >
                Django JWT Authentication
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="
              w-9 h-9
              rounded-full
              hover:bg-[#efeeea]
              flex
              items-center
              justify-center
            "
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* ===================================================
            LOGGED IN
        =================================================== */}

        {loggedIn ? (

          <div className="p-7">

            <div
              className="
                text-center
                border
                border-[#c4c7c7]
                bg-white
                p-7
              "
            >

              <div
                className="
                  w-16 h-16
                  rounded-full
                  bg-emerald-100
                  text-emerald-700
                  flex
                  items-center
                  justify-center
                  mx-auto
                "
              >
                <ShieldCheck className="w-8 h-8" />
              </div>

              <h3
                className="
                  font-display
                  text-2xl
                  font-bold
                  mt-4
                "
              >
                Logged In
              </h3>

              {storedUsername && (

                <p
                  className="
                    text-[#444748]
                    mt-2
                  "
                >
                  Signed in as{' '}
                  <strong>
                    {storedUsername}
                  </strong>
                </p>

              )}

              <p
                className="
                  text-sm
                  text-[#747878]
                  mt-3
                  leading-relaxed
                "
              >
                Your JWT access token is
                now stored in the frontend.
                Authenticated HeritageHub
                requests can be sent to Django.
              </p>

            </div>

            <button
              onClick={() => {

                onClose();

                onOpenContribute();

              }}
              className="
                mt-5
                w-full
                bg-[#94492d]
                hover:bg-[#773319]
                text-white
                py-3
                text-xs
                uppercase
                tracking-wider
                font-bold
              "
            >
              Contribute Heritage
            </button>

            <button
              onClick={
                handleLogout
              }
              className="
                mt-3
                w-full
                border
                border-[#c4c7c7]
                py-3
                text-xs
                uppercase
                tracking-wider
                font-bold
                flex
                items-center
                justify-center
                gap-2
                hover:bg-[#efeeea]
              "
            >

              <LogOut className="w-4 h-4" />

              Logout

            </button>

          </div>

        ) : (

          /* =================================================
             LOGIN / REGISTER
          ================================================= */

          <div className="p-6">

            {/* TABS */}

            <div
              className="
                grid
                grid-cols-2
                border
                border-[#c4c7c7]
                mb-6
              "
            >

              <button
                onClick={() => {

                  setMode('login');

                  setError('');

                  setMessage('');

                }}
                className={`
                  py-3
                  text-xs
                  uppercase
                  tracking-wider
                  font-bold
                  ${
                    mode === 'login'
                      ? 'bg-[#94492d] text-white'
                      : 'bg-white text-[#444748]'
                  }
                `}
              >

                Login

              </button>

              <button
                onClick={() => {

                  setMode('register');

                  setError('');

                  setMessage('');

                }}
                className={`
                  py-3
                  text-xs
                  uppercase
                  tracking-wider
                  font-bold
                  ${
                    mode === 'register'
                      ? 'bg-[#94492d] text-white'
                      : 'bg-white text-[#444748]'
                  }
                `}
              >

                Register

              </button>

            </div>

            {error && (

              <div
                className="
                  mb-5
                  bg-red-50
                  border
                  border-red-200
                  text-red-700
                  p-3
                  text-sm
                "
              >
                {error}
              </div>

            )}

            {message && (

              <div
                className="
                  mb-5
                  bg-emerald-50
                  border
                  border-emerald-200
                  text-emerald-700
                  p-3
                  text-sm
                "
              >
                {message}
              </div>

            )}

            <form
              onSubmit={
                mode === 'login'
                  ? handleLogin
                  : handleRegister
              }
              className="space-y-5"
            >

              {/* USERNAME */}

              <div>

                <label
                  className="
                    block
                    text-[11px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-[#444748]
                    mb-2
                  "
                >
                  Username *
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="Enter username"
                  className="
                    w-full
                    px-4
                    py-3
                    bg-white
                    border
                    border-[#c4c7c7]
                    focus:outline-none
                    focus:border-[#94492d]
                  "
                />

              </div>

              {/* EMAIL — REGISTER ONLY */}

              {mode === 'register' && (

                <div>

                  <label
                    className="
                      block
                      text-[11px]
                      uppercase
                      tracking-wider
                      font-bold
                      text-[#444748]
                      mb-2
                    "
                  >
                    Email *
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="Enter email"
                    className="
                      w-full
                      px-4
                      py-3
                      bg-white
                      border
                      border-[#c4c7c7]
                      focus:outline-none
                      focus:border-[#94492d]
                    "
                  />

                </div>

              )}

              {/* PASSWORD */}

              <div>

                <label
                  className="
                    block
                    text-[11px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-[#444748]
                    mb-2
                  "
                >
                  Password *
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter password"
                    className="
                      w-full
                      px-4
                      py-3
                      pr-12
                      bg-white
                      border
                      border-[#c4c7c7]
                      focus:outline-none
                      focus:border-[#94492d]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-[#747878]
                    "
                  >

                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}

                  </button>

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-[#94492d]
                  hover:bg-[#773319]
                  disabled:opacity-50
                  text-white
                  py-3.5
                  text-xs
                  uppercase
                  tracking-wider
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                {mode === 'login' ? (
                  <LogIn className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}

                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                  ? 'Login'
                  : 'Create Account'}

              </button>

            </form>

          </div>

        )}

      </div>

    </div>
  );
};