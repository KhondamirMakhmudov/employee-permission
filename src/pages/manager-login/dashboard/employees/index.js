import Link from "next/link";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-orange-100 to-amber-100">
            <span className="material-symbols-outlined text-4xl text-orange-600">
              block
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900">
              Раздел недоступен
            </h1>
            <p className="text-gray-600">
              Доступны только: Все заявки, Активные заявки и Архив.
            </p>
          </div>

          <Link
            href="/manager-login/dashboard"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>На главную</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
