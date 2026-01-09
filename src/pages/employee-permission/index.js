// app/employee/page.jsx
import Header from "@/components/header";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import TimeRange from "@/components/input/TimeRange";
import FormSection from "@/components/form-container/FormSection";
import FormContainer from "@/components/form-container/index";
import SubmitButton from "@/components/button";
import InfoAlert from "@/components/info-alert";
import Link from "next/link";

const EmployeePage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Process form data
    const data = {
      employeeName: formData.get("employee-name"),
      date: formData.get("date"),
      timeFrom: formData.get("time-from"),
      timeTo: formData.get("time-to"),
      purpose: formData.get("purpose"),
    };

    // Send to API
    console.log(data);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="employee-name"
                    label="ФИО сотрудника"
                    placeholder="Иванов Иван Иванович"
                    required
                    icon="person"
                  />
                  <Input
                    id="date"
                    label="Дата выхода"
                    type="date"
                    required
                    icon="calendar_today"
                  />
                </div>

                <TimeRange />

                <Textarea
                  id="purpose"
                  label="Цель выхода"
                  placeholder="Укажите причину или место назначения..."
                  required
                  rows={3}
                />

                <div className="pt-4">
                  <SubmitButton>Отправить запрос</SubmitButton>
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
