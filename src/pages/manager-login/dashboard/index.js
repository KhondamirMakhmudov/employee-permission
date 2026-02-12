import DashboardLayout from "@/layout/Dashboard";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Index = () => {
  const { data: session } = useSession();

  // Show login prompt if user is not authenticated
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-indigo-100">
              <span className="material-symbols-outlined text-4xl text-blue-600">
                lock
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-gray-900">
                Требуется аутентификация
              </h1>
              <p className="text-gray-600">
                Пожалуйста, войдите в систему для доступа к панели управления
                руководителя.
              </p>
            </div>

            <Link
              href="/manager-login"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined">login</span>
              <span>Войти</span>
            </Link>

            <div className="pt-4 border-t border-gray-200 w-full">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Вы сотрудник?</span>
                <Link
                  href="/employee-permission"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Вход для сотрудников
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardLayout></DashboardLayout>;
};

export default Index;
