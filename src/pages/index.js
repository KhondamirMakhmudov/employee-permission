import Header from "@/components/header";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
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

      // console.log("SignIn response:", response);

      if (response?.ok && !response?.error) {
        toast.success("Добро пожаловать");
        saveLogin(username, password);
        router.push("/dashboard/employees");
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
  return (
    <div className="bg-white">
      <Header>
        <div className="flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-4">
            <div className="size-6 text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                shield_person
              </span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
              Система пропусков
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined cursor-pointer hover:text-blue-400  transition-colors text-[#686189] dark:text-[#a09bb1]">
              settings
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-blue-400  transition-colors text-[#686189] dark:text-[#a09bb1]">
              help_outline
            </span>
          </div>
        </div>
      </Header>

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <h1 className="text-black tracking-tight text-[32px] md:text-[40px] font-bold leading-tight text-center pb-3 pt-6">
          Выберите вашу роль
        </h1>

        <p className="text-[#686189] dark:text-[#a09bb1] text-lg font-normal leading-normal pb-10 pt-1 px-4 text-center max-w-2xl">
          Пожалуйста, выберите соответствующий профиль для работы в системе
          контроля доступа.
        </p>
        {/* role */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 w-full max-w-4xl mx-auto">
          {/* Employee Card - Simple */}
          <div className="flex flex-col gap-5 p-6 bg-white rounded-xl border border-gray-300 shadow-md">
            <div className="w-full h-40 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-6xl">
                person
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-gray-900 text-xl font-bold">Сотрудник</h3>
              <p className="text-gray-600 text-sm flex-1">
                Заполните форму для запроса выхода из офиса.
              </p>
            </div>
            <Link
              href={"/employee-permission"}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Открыть форму
            </Link>
          </div>

          {/* Manager Card - Simple */}
          <div className="flex flex-col gap-5 p-6 bg-white rounded-xl border border-gray-300 shadow-md">
            <div className="w-full h-40 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-6xl">
                admin_panel_settings
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-gray-900 text-xl font-bold">Руководитель</h3>
              <p className="text-gray-600 text-sm flex-1">
                Рассмотрение и одобрение заявок от сотрудников, управление
                правами доступа и отчетность.
              </p>
            </div>
            <Link
              href={"/manager-login"}
              className="w-full bg-white flex items-center justify-center text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition border border-blue-300"
            >
              Войти
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
