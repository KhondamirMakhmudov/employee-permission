// app/manager/login/page.jsx
import { useState } from "react";
import Link from "next/link";

const ManagerLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      // Add your login logic here
      console.log("Login attempt:", data);
      // await loginAPI(data);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      {/* Left Side - Image & Info */}
      <div className="hidden lg:flex w-1/2 relative bg-blue-600 items-center justify-center overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm9TEYEho7TV5VndpKDcMPLrFE_ViE_dYyaatXwXWvEMqCIeDkph4yKrfYmN7H16cBzCd-efULU5DQ_vbzpmwjchH_guDopQVTB9ujbkAoXtwETNDg8cI2eXzbkPs6JJyL1vVOPtWs_I81n5cqT2PPnOj4iF1Auu763G017-Hel_1x3Vf7SH13umkpo5bdAIQS_xyiO7dKzWqr1hLZtWtfRUizY4Q2mk3AbsncEn6D_LNAnpkYqfkKQtOMQ0iwdyvQhcqZ_ySzHdk"
          alt="Office background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-blue-600/40"></div>
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

        <div className="w-full max-w-[480px] flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">
              Вход для руководителей
            </h1>
            <p className="text-gray-600 text-base font-normal leading-normal">
              Пожалуйста, введите свои учетные данные для доступа к панели
              одобрения заявок.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col w-full group">
              <label
                htmlFor="text"
                className="text-gray-900 text-base font-medium leading-normal pb-2"
              >
                Имя пользователя
              </label>
              <input
                id="text"
                name="text"
                className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 border border-gray-300 bg-white h-14 placeholder:text-gray-500 px-4 text-base font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                placeholder="Введите имя пользователя"
                required
                type="email"
              />
            </div>

            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center pb-2">
                <label
                  htmlFor="password"
                  className="text-gray-900 text-base font-medium leading-normal"
                >
                  Пароль
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Забыли пароль?
                </button>
              </div>
              <div className="flex w-full items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-gray-300 bg-white overflow-hidden transition-all duration-200">
                <input
                  id="password"
                  name="password"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 border-none bg-transparent h-14 placeholder:text-gray-500 px-4 text-base font-normal leading-normal focus:outline-none focus:ring-0"
                  placeholder="Введите пароль"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  className="text-gray-500 flex items-center justify-center px-4 hover:text-gray-900 transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

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
                href="/employee"
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
              <span>Защищено системой корпоративного доступа v2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginPage;
