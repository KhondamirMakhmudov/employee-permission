// app/manager/login/page.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import Input from "@/components/input";

const ManagerLoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [savedLogins, setSavedLogins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSavedLogins, setShowSavedLogins] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      const storedUsername =
        session?.user?.username || session?.user?.name || "";
      setUsername(storedUsername);
    }
  }, [session]);

  useEffect(() => {
    if (!session?.accessToken) {
      return;
    }

    const loginType =
      typeof window !== "undefined" ? localStorage.getItem("login_type") : null;

    if (loginType === "employee") {
      router.replace("/employee-permission");
      return;
    }

    router.replace("/manager-login/dashboard/active-requests");
  }, [session, router]);

  useEffect(() => {
    const stored = localStorage.getItem("logins");
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
    localStorage.setItem("logins", JSON.stringify(updated));
  };

  const selectSavedLogin = (login) => {
    setUsername(login.username);
    setPassword(login.password);
    setShowSavedLogins(false);
    toast.success(`Выбран: ${login.username}`);
  };

  const removeSavedLogin = (usernameToRemove) => {
    const updated = savedLogins.filter(
      (login) => login.username !== usernameToRemove,
    );
    setSavedLogins(updated);
    localStorage.setItem("logins", JSON.stringify(updated));
    toast.success("Сохраненный логин удален");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Attempting sign in with:", { username });

      const response = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (response?.ok && !response?.error) {
        localStorage.setItem("login_type", "manager");
        toast.success("Добро пожаловать");
        saveLogin(username, password);
        // Redirect to dashboard after successful login
        router.push("/manager-login/dashboard/active-requests");
      } else {
        console.error("SignIn error details:", response?.error);
        toast.error(
          "Login xato! " + (response?.error || "Ma'lumotlar noto'g'ri."),
        );
      }
    } catch (error) {
      console.error("SignIn exception:", error);
      toast.error("Tizimga kirishda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnter = () => {
    router.push("/manager-login/dashboard/active-requests");
  };

  const handleExit = async () => {
    await signOut({ callbackUrl: "http://localhost:8080" });
    localStorage.removeItem("login_type");
    setUsername("");
    setPassword("");
    toast.success("Вы вышли из системы");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      {/* Left Side - Image & Info */}
      <div className="hidden lg:flex w-1/2 relative bg-blue-600 items-center justify-center overflow-hidden">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm9TEYEho7TV5VndpKDcMPLrFE_ViE_dYyaatXwXWvEMqCIeDkph4yKrfYmN7H16cBzCd-efULU5DQ_vbzpmwjchH_guDopQVTB9ujbkAoXtwETNDg8cI2eXzbkPs6JJyL1vVOPtWs_I81n5cqT2PPnOj4iF1Auu763G017-Hel_1x3Vf7SH13umkpo5bdAIQS_xyiO7dKzWqr1hLZtWtfRUizY4Q2mk3AbsncEn6D_LNAnpkYqfkKQtOMQ0iwdyvQhcqZ_ySzHdk"
          alt="Office background"
          fill
          className="object-cover opacity-40 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-blue-600/90 to-blue-600/40"></div>
        <div className="relative z-10 p-12 max-w-lg text-white">
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/10 shadow-lg">
            <span className="material-symbols-outlined text-4xl">
              admin_panel_settings
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-6">
            Контроль доступа предприятия
          </h2>
          <p className="text-lg text-white/90 font-medium leading-relaxed">
            Безопасное управление запросами сотрудников на выход, утверждение
            табелей и поддержание организационного регламента в единой панели
            управления.
          </p>
          <div className="mt-12 flex gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="material-symbols-outlined text-lg">
                verified_user
              </span>
              Защищенный вход в систему
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-6 sm:p-12 relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-blue-600">
          <span className="material-symbols-outlined text-3xl">
            admin_panel_settings
          </span>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            ПропускСистема
          </span>
        </div>

        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Success Screen - Shown when user has active session */}
          {session?.accessToken ? (
            <div className="flex flex-col items-center animate-fade-in-up">
              {/* Main Success Card */}
              <div className="w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
                {/* Decorative gradient background */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-10"></div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                  {/* Success Icon with enhanced animation */}
                  <div className="relative mt-4">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 blur-2xl opacity-40 animate-pulse-slow"></div>

                    {/* Main icon container */}
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-2xl animate-scale-bounce">
                      {/* Inner white circle for icon */}
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
                        <span className="material-symbols-outlined text-6xl text-green-500 animate-check">
                          check_circle
                        </span>
                      </div>
                    </div>

                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping-slow opacity-30"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping-slower opacity-20"></div>
                  </div>

                  {/* Success Message */}
                  <div className="text-center space-y-3 animate-fade-in-delay">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                      С возвращением!
                    </h2>

                    {/* User Info Card */}
                    <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100 shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
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
                        <p className="text-sm font-bold text-gray-900">
                          {session?.user?.username ||
                            session?.user?.name ||
                            username}
                        </p>
                        <p className="text-xs text-gray-500">Руководитель</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Ваша сессия активна
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 w-full mt-4">
                    <button
                      onClick={handleEnter}
                      className="group relative flex w-full items-center justify-center gap-3 rounded-2xl h-16 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-base font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></div>

                      <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform duration-300">
                        dashboard
                      </span>
                      <span className="relative">
                        Открыть панель управления
                      </span>
                      <span className="material-symbols-outlined text-xl ml-auto group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      onClick={handleExit}
                      className="group flex w-full items-center justify-center gap-3 rounded-2xl h-14 px-6 bg-white hover:bg-gray-50 active:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-base font-semibold transition-all duration-200 hover:shadow-md"
                    >
                      <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                        logout
                      </span>
                      <span>Выйти из системы</span>
                    </button>
                  </div>

                  {/* Additional info */}
                  <div className="mt-2 pt-6 border-t border-gray-200 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-green-600">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="font-medium">Активная сессия</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <span className="material-symbols-outlined text-sm">
                          lock
                        </span>
                        <span>Защищено</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced keyframe animations */}
              <style jsx>{`
                @keyframes scale-bounce {
                  0% {
                    transform: scale(0);
                    opacity: 0;
                  }
                  50% {
                    transform: scale(1.15);
                  }
                  70% {
                    transform: scale(0.95);
                  }
                  100% {
                    transform: scale(1);
                    opacity: 1;
                  }
                }

                @keyframes fade-in-up {
                  0% {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                @keyframes fade-in-delay {
                  0% {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                @keyframes check {
                  0% {
                    transform: scale(0) rotate(-45deg);
                    opacity: 0;
                  }
                  50% {
                    transform: scale(1.2) rotate(10deg);
                  }
                  100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                  }
                }

                @keyframes ping-slow {
                  0%,
                  100% {
                    transform: scale(1);
                    opacity: 0.3;
                  }
                  50% {
                    transform: scale(1.5);
                    opacity: 0;
                  }
                }

                @keyframes ping-slower {
                  0%,
                  100% {
                    transform: scale(1);
                    opacity: 0.2;
                  }
                  50% {
                    transform: scale(2);
                    opacity: 0;
                  }
                }

                @keyframes pulse-slow {
                  0%,
                  100% {
                    opacity: 0.4;
                  }
                  50% {
                    opacity: 0.6;
                  }
                }

                .animate-scale-bounce {
                  animation: scale-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .animate-fade-in-up {
                  animation: fade-in-up 0.5s ease-out;
                }

                .animate-fade-in-delay {
                  animation: fade-in-delay 0.6s ease-out 0.3s both;
                }

                .animate-check {
                  animation: check 0.5s ease-out 0.2s both;
                }

                .animate-ping-slow {
                  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                .animate-ping-slower {
                  animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                .animate-pulse-slow {
                  animation: pulse-slow 3s ease-in-out infinite;
                }
              `}</style>
            </div>
          ) : (
            /* Login Form - Shown when isLoggedIn is false */
            <>
              <div className="flex flex-col gap-3">
                <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">
                  Вход для руководителей
                </h1>
                <p className="text-gray-600 text-base font-normal leading-normal">
                  Пожалуйста, введите свои учетные данные для доступа к панели
                  одобрения заявок.
                </p>
              </div>

              <form onSubmit={onSubmit} className="flex flex-col gap-6">
                {/* Saved Logins Section - Now positioned above the username field */}
                {savedLogins.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSavedLogins(!showSavedLogins)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <span className="material-symbols-outlined text-lg">
                            account_circle
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-900">
                            Сохраненные аккаунты
                          </p>
                          <p className="text-xs text-gray-600">
                            {savedLogins.length}{" "}
                            {savedLogins.length === 1 ? "аккаунт" : "аккаунтов"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`material-symbols-outlined text-gray-600 transition-transform duration-200 ${
                          showSavedLogins ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* Dropdown with saved logins */}
                    {showSavedLogins && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
                        <div className="p-2">
                          {savedLogins.map((login, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group/item"
                            >
                              <button
                                type="button"
                                onClick={() => selectSavedLogin(login)}
                                className="flex items-center gap-3 flex-1 text-left"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                                  <span className="text-lg font-bold">
                                    {login.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {login.username}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Нажмите для входа
                                  </p>
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSavedLogin(login.username);
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                                title="Удалить"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  delete
                                </span>
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 p-2">
                          <button
                            type="button"
                            onClick={() => setShowSavedLogins(false)}
                            className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2"
                          >
                            Закрыть
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Input
                  label="Имя пользователя"
                  name="username"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <Input
                  label="Пароль"
                  name="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  <span className="truncate">
                    {isLoading ? "Вход..." : "Войти"}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-gray-500 text-sm">Вы сотрудник?</span>
                  <Link
                    href="/employee-permission"
                    className="text-blue-600 font-bold text-sm hover:underline"
                  >
                    Форма для сотрудников
                  </Link>
                </div>
              </form>

              <div className="mt-8 border-t border-gray-200 pt-6 flex justify-center">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <span className="material-symbols-outlined text-[16px]">
                    lock
                  </span>
                  <span>Защищено системой корпоративного доступа</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginPage;
