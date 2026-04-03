// app/employee/login/page.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import toast from "react-hot-toast";
import Input from "@/components/input";

const EmployeeLoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [savedLogins, setSavedLogins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user already has a session
  useEffect(() => {
    if (session?.accessToken) {
      const storedUsername =
        session?.user?.username || session?.user?.name || "";
      setUsername(storedUsername);
    }
  }, [session]);

  // Prevent managers/admins from using employee login page
  useEffect(() => {
    if (!session?.accessToken) {
      return;
    }

    const loginType =
      typeof window !== "undefined" ? localStorage.getItem("login_type") : null;

    if (loginType === "manager") {
      router.replace("/manager-login/dashboard/active-requests");
      return;
    }

    // Regular employee with active session
    router.replace("/employee-permission");
  }, [session, router]);

  // Load saved logins on component mount
  useEffect(() => {
    const stored = localStorage.getItem("employee_logins");
    if (stored) {
      try {
        setSavedLogins(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading saved logins:", error);
      }
    }
  }, []);

  const saveLogin = (username, password) => {
    let updated = [...savedLogins];
    const existingIndex = updated.findIndex((u) => u.username === username);
    if (existingIndex > -1) {
      updated[existingIndex].password = password;
    } else {
      updated.push({ username, password });
    }
    setSavedLogins(updated);
    localStorage.setItem("employee_logins", JSON.stringify(updated));
  };

  const selectSavedLogin = (login) => {
    setUsername(login.username);
    setPassword(login.password);
    toast.success(`Выбран: ${login.username}`);
  };

  const removeSavedLogin = (usernameToRemove) => {
    const updated = savedLogins.filter(
      (login) => login.username !== usernameToRemove,
    );
    setSavedLogins(updated);
    localStorage.setItem("employee_logins", JSON.stringify(updated));
    toast.success("Удален");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (response?.ok && !response?.error) {
        localStorage.setItem("login_type", "employee");
        toast.success("Добро пожаловать!");
        saveLogin(username, password);
        
        // Wait a moment for session to be established, then redirect
        setTimeout(() => {
          router.push("/employee-permission");
        }, 500);
      } else {
        toast.error("Ошибка входа! " + (response?.error || "Неверные данные."));
      }
    } catch (error) {
      toast.error("Произошла ошибка при входе в систему.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnter = () => {
    router.push("/employee-permission/request");
  };

  const handleExit = async () => {
    await signOut({ callbackUrl: "http://localhost:8080" });
    localStorage.removeItem("login_type");
    setUsername("");
    setPassword("");
    toast.success("Вы вышли из системы");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Info */}
          <div className="hidden lg:block space-y-8 animate-slide-in-left">
            {/* Logo & Brand */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-blue-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-2xl">
                    badge
                  </span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Портал Сотрудника
                </span>
              </div>

              <h1 className="text-5xl font-black text-slate-900 leading-tight">
                Добро пожаловать
                <br />в систему доступа
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Управляйте заявками на выход, отслеживайте разрешения и
                контролируйте посещаемость в едином цифровом пространстве.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                {
                  icon: "verified_user",
                  text: "Защищенный доступ",
                  color: "blue",
                },
                {
                  icon: "schedule",
                  text: "Отслеживание в реальном времени",
                  color: "indigo",
                },
                {
                  icon: "inventory_2",
                  text: "История запросов",
                  color: "cyan",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-5 py-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <span className="material-symbols-outlined text-white text-xl">
                      {feature.icon}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="animate-slide-in-right">
            <div className="bg-white rounded-3xl shadow-2xl border border-white/60 p-8 lg:p-10 backdrop-blur-sm">
              {session?.accessToken ? (
                /* Success State */
                <div className="space-y-6">
                  {/* Success Icon */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-2xl opacity-30 animate-pulse-slow"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500">
                        <span className="material-symbols-outlined text-5xl text-white animate-bounce-in">
                          check_circle
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div className="text-center space-y-3">
                    <h2 className="text-3xl font-black text-slate-900">
                      Сессия активна!
                    </h2>

                    {/* User Badge */}
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-2xl border border-blue-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">
                          {(
                            session?.user?.username ||
                            session?.user?.name ||
                            username
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900">
                          {session?.user?.username ||
                            session?.user?.name ||
                            username}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Сотрудник
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={handleEnter}
                      className="group w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      <span className="material-symbols-outlined text-xl">
                        badge
                      </span>
                      Перейти к форме заявки
                      <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      onClick={handleExit}
                      className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <span className="material-symbols-outlined text-lg">
                        logout
                      </span>
                      Выйти из системы
                    </button>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-slate-500 font-medium">
                      Безопасное соединение
                    </span>
                  </div>
                </div>
              ) : (
                /* Login Form */
                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 lg:hidden mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-white text-xl">
                          badge
                        </span>
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Портал Сотрудника
                      </span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900">
                      Вход в систему
                    </h2>
                    <p className="text-slate-600">
                      Введите учетные данные для доступа к порталу
                    </p>
                  </div>

                  {/* Saved Logins */}
                  {savedLogins.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-blue-600 text-lg">
                          history
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          Быстрый вход
                        </span>
                      </div>

                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {savedLogins.map((login, index) => (
                          <div
                            key={index}
                            className="group flex items-center justify-between bg-white hover:bg-blue-50 rounded-xl p-3 transition-all duration-200 cursor-pointer"
                            onClick={() => selectSavedLogin(login)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-sm">
                                  {login.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {login.username}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Нажмите для входа
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSavedLogin(login.username);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <span className="material-symbols-outlined text-red-500 text-lg">
                                close
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                      <Input
                        label="Имя пользователя"
                        name="username"
                        placeholder="Введите имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />

                      <div className="relative">
                        <Input
                          label="Пароль"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Введите пароль"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Вход...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xl">
                            login
                          </span>
                          Войти
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer Links */}
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      Вы руководитель?
                    </span>
                    <Link
                      href="/manager-login"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Вход для руководителей →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="material-symbols-outlined text-slate-400 text-sm">
                lock
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Защищено системой корпоративного доступа
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(20px) translateX(-20px);
          }
        }

        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out backwards;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EmployeeLoginPage;
