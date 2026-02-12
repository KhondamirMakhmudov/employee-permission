import DashboardLayout from "@/layout/Dashboard";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useGetQuery from "@/hooks/python/useGetQuery";
import { URLS } from "@/constants/url";
import { KEYS } from "@/constants/key";
import { requestGeneralAuth, requestPython } from "@/services/api";
import EmployeeCard from "@/components/card/EmployeeCard";
import { get } from "lodash";
import { useState, useEffect } from "react";
import usePostQuery from "@/hooks/python/usePostQuery";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [employeesData, setEmployeesData] = useState({});

  const { data: allRequests } = useGetQuery({
    key: KEYS.allRequests,
    url: URLS.allRequests,
    apiClient: requestPython,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    params: {
      limit: 10,
      offset: 0,
    },
    enabled: !!session?.accessToken, // Only fetch when accessToken is available
  });

  // Get requests list from API response
  const requestsList = get(allRequests, "data.data", []);

  // Fetch all employees data automatically
  useEffect(() => {
    const fetchAllEmployees = async () => {
      const uniqueEmployeeIds = [
        ...new Set(requestsList.map((r) => r.employee_id)),
      ];

      const results = {};

      await Promise.all(
        uniqueEmployeeIds.map((id) =>
          requestGeneralAuth(`${URLS.employee}/${id}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          })
            .then((response) => {
              // Extract the actual employee data from response
              const employeeData = response?.data || response;
              results[id] = employeeData;
              console.log(`Employee ${id} data:`, employeeData);
            })
            .catch((error) => {
              console.error(`Error fetching employee ${id}:`, error);
            }),
        ),
      );

      setEmployeesData(results);
    };

    if (requestsList.length > 0 && session?.accessToken) {
      fetchAllEmployees();
    }
  }, [requestsList, session?.accessToken]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const minutes = Math.round((end - start) / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}ч ${mins}м`;
    }
    return `${mins}м`;
  };

  const { mutate: approveRequest } = usePostQuery({
    listKeyId: "approveRequest",
    apiClient: requestPython,
  });

  const handleApprove = (request) => {
    approveRequest(
      {
        url: `${URLS.approveRequest}/${request.id}`,
        attributes: {
          status: "разрешено",
          reason: request.description || null,
          // startDate: request.startDate,
          // endDate: request.endDate,
        },
        config: {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Заявка одобрена");
          // Invalidate and refetch the allRequests query to get updated data
          queryClient.invalidateQueries({ queryKey: [KEYS.allRequests] });
        },
        onError: (error) => {
          toast.error("Ошибка при одобрении заявки");
          console.error("Approve error:", error);
        },
      },
    );
  };

  const handleReject = (request) => {
    approveRequest(
      {
        url: `${URLS.approveRequest}/${request.id}`,
        attributes: {
          status: "отказано",
          reason: request.description || null,
          // startDate: request.startDate,
          // endDate: request.endDate,
        },
        config: {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      },
      {
        onSuccess: (data) => {
          toast.success("Заявка отклонена");
          // Invalidate and refetch the allRequests query to get updated data
          queryClient.invalidateQueries({ queryKey: [KEYS.allRequests] });
        },
        onError: (error) => {
          toast.error("Ошибка при отклонении заявки");
          console.error("Reject error:", error);
        },
      },
    );
  };

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

  return (
    <DashboardLayout headerTitle="Активные заявки">
      <div className="space-y-6">
        {requestsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requestsList.map((request) => {
              const employeeData = employeesData[request.employee_id];

              const employeeName = employeeData
                ? `${employeeData?.last_name || ""} ${employeeData?.first_name || ""} ${employeeData?.middle_name || ""}`.trim()
                : "Загрузка...";

              const employeePosition = employeeData
                ? get(employeeData, "workplace.position.name", "—")
                : "—";

              const employeeDepartment = employeeData
                ? get(employeeData, "workplace.organizational_unit.name", "—")
                : "—";

              return (
                <div key={request.id} className="relative">
                  <EmployeeCard
                    name={employeeName}
                    position={employeePosition}
                    department={employeeDepartment}
                    status={request.status}
                    visitPurpose={request.direction}
                    date={formatDate(request.startDate)}
                    timeStart={formatTime(request.startDate)}
                    timeEnd={formatTime(request.endDate)}
                    duration={calculateDuration(
                      request.startDate,
                      request.endDate,
                    )}
                    onApprove={() => handleApprove(request)}
                    onReject={() => handleReject(request)}
                  />
                  {/* Status Badge */}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">
              inbox
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Нет активных заявок
            </h3>
            <p className="text-gray-500">
              Все запросы на выход рассмотрены или их нет
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
