// app/employee/page.jsx
import { useState, useEffect } from "react";
import Header from "@/components/header";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import FormSection from "@/components/form-container/FormSection";
import FormContainer from "@/components/form-container/index";
import SubmitButton from "@/components/button";
import InfoAlert from "@/components/info-alert";
import Link from "next/link";
import usePostQuery from "@/hooks/python/usePostQuery";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import useGetQuery from "@/hooks/python/useGetQuery";
import { useSession } from "next-auth/react";
import { requestEmployeeDetail, requestPython } from "@/services/api";
import toast from "react-hot-toast";
import { get } from "lodash";

const EmployeePage = () => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedChief, setSelectedChief] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    timeStart: "",
    timeEnd: "",
    purpose: "",
  });

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: employeeInfo, isLoading } = useGetQuery({
    key: [KEYS.employeeDetail, debouncedSearch],
    url: debouncedSearch
      ? `${URLS.employeeDetail}${encodeURIComponent(debouncedSearch)}`
      : URLS.employeeDetail,
    apiClient: requestEmployeeDetail,
    params: {
      limit: 10,
      offset: 0,
    },
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!session?.accessToken && debouncedSearch.length > 0,
  });

  const { data: getAllChiefs } = useGetQuery({
    key: KEYS.allChiefs,
    url: `${URLS.allChiefs}/${selectedEmployee?.id}`,
    apiClient: requestEmployeeDetail,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    enabled: !!session?.accessToken && !!selectedEmployee?.id,
  });

  console.log(getAllChiefs, "get all chiefs");

  // Get employee list from API response
  const employeeList = get(employeeInfo, "data.data", []);

  // Get chiefs list from API response
  const chiefsList = get(getAllChiefs, "data", []);

  const { mutate: sendRequestForPermission, isLoading: isSubmitting } =
    usePostQuery({
      listKeyId: "employee-requests",
      hideSuccessToast: true,
      apiClient: requestPython,
    });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(value.length > 0);
    if (!value) {
      setSelectedEmployee(null);
    }
  };

  const handleSelectEmployee = (employee) => {
    const fullName =
      `${employee.last_name || ""} ${employee.first_name || ""} ${employee.middle_name || ""}`.trim();
    setSearchQuery(fullName);
    setSelectedEmployee(employee);
    setSelectedChief(null); // Reset chief selection when employee changes
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      toast.error("Пожалуйста, выберите сотрудника из списка");
      return;
    }

    if (!selectedChief) {
      toast.error("Пожалуйста, выберите руководителя");
      return;
    }

    if (
      !formData.date ||
      !formData.timeStart ||
      !formData.timeEnd ||
      !formData.purpose
    ) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.timeStart}:00`);
    const endDateTime = new Date(`${formData.date}T${formData.timeEnd}:00`);

    sendRequestForPermission(
      {
        url: URLS.passRequest,
        attributes: {
          employee_id: selectedEmployee.id,
          chief_id: selectedChief.id,
          direction: formData.purpose,
          description: formData.purpose,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
        },
        config: {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      },
      {
        onSuccess: (data) => {
          toast.success(data?.data?.message || "Запрос успешно отправлен");
          // Reset form
          setSearchQuery("");
          setSelectedEmployee(null);
          setFormData({
            date: "",
            timeStart: "",
            timeEnd: "",
            purpose: "",
          });
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Ошибка при отправке запроса",
          );
        },
      },
    );
  };

  return (
    <div>
      <Header>
        <Link href={"/"}>
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
        </Link>
      </Header>

      <main className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <FormSection
            title="Запрос на выход"
            description="Заполните форму ниже для получения разрешения на временный выход из офиса."
          >
            <FormContainer>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {/* Employee Search with Autocomplete */}
                  <div className="relative">
                    <Input
                      name="employee-name"
                      label="ФИО сотрудника"
                      placeholder="Начните вводить имя..."
                      required
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => searchQuery && setShowDropdown(true)}
                      autoComplete="off"
                    />

                    {/* Dropdown with search results */}
                    {showDropdown && employeeList.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoading ? (
                          <div className="p-4 text-center text-gray-500">
                            Загрузка...
                          </div>
                        ) : (
                          employeeList.map((employee) => (
                            <button
                              key={employee.id}
                              type="button"
                              onClick={() => handleSelectEmployee(employee)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">
                                {employee.last_name} {employee.first_name}{" "}
                                {employee.middle_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {get(employee, "workplace.position.name") && (
                                  <div>
                                    {get(employee, "workplace.position.name")}
                                  </div>
                                )}
                                {get(
                                  employee,
                                  "workplace.organizational_unit.name",
                                ) && (
                                  <div>
                                    {get(
                                      employee,
                                      "workplace.organizational_unit.name",
                                    )}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}

                    {/* No results message */}
                    {showDropdown &&
                      searchQuery &&
                      employeeList.length === 0 &&
                      !isLoading &&
                      debouncedSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                          Сотрудник не найден
                        </div>
                      )}
                  </div>

                  {/* Display selected employee info */}
                  {selectedEmployee && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Должность:</span>{" "}
                        {get(selectedEmployee, "workplace.position.name") ||
                          "—"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Отдел:</span>{" "}
                        {get(
                          selectedEmployee,
                          "workplace.organizational_unit.name",
                        ) || "—"}
                      </p>
                    </div>
                  )}

                  {/* Chief Selection */}
                  {selectedEmployee && (
                    <div className="relative">
                      <label className="block mb-2 text-sm text-gray-700 font-medium">
                        Руководитель <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedChief?.id || ""}
                        onChange={(e) => {
                          const chief = chiefsList.find(
                            (c) => c.id === e.target.value,
                          );
                          setSelectedChief(chief || null);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Выберите руководителя...</option>
                        {chiefsList.map((chief) => (
                          <option key={chief.id} value={chief.id}>
                            {chief.last_name} {chief.first_name}{" "}
                            {chief.middle_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Input
                    name="date"
                    label="Дата выхода"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="timeStart"
                    label="Время выхода"
                    type="time"
                    required
                    value={formData.timeStart}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="timeEnd"
                    label="Время возвращения"
                    type="time"
                    required
                    value={formData.timeEnd}
                    onChange={handleInputChange}
                  />
                </div>

                <Textarea
                  name="purpose"
                  label="Цель выхода"
                  placeholder="Укажите причину или место назначения..."
                  required
                  rows={3}
                  value={formData.purpose}
                  onChange={handleInputChange}
                />

                <div className="pt-4">
                  <SubmitButton disabled={isSubmitting || !selectedEmployee}>
                    {isSubmitting ? "Отправка..." : "Отправить запрос"}
                  </SubmitButton>
                </div>

                <InfoAlert>
                  Запрос будет автоматически направлен вашему руководителю. Вы
                  получите уведомление о статусе заявки.
                </InfoAlert>
              </form>
            </FormContainer>
          </FormSection>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-200">
        <p>© 2024 Система управления доступом. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default EmployeePage;
