import FilterButton from "@/components/button/FilterButton";
import Card from "@/components/card";
import DashboardLayout from "@/layout/Dashboard";
import EmployeeCard from "@/components/card/EmployeeCard";
const Index = () => {
  const employees = [
    {
      name: "Александра Иванова",
      position: "UX Дизайнер",
      department: "Отдел дизайна",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDxqjqGsFloKFR7l3bUPN4oP6QAS1gSrfQfCiUFhDmiQDogbAhkoKM7Kfbu0d92z9bHa5YtZa3RAxJpZiBZz9i-ERBZKrPoTj1sXfNGLv14H99ZGmZ98gY0_LFcT24qSw-rSQFXjJ996O5m8wfAj37kIFjjm0zJPs_9uOpzDZlejNeEvM0C74KEOFcwxYdtjeYjwedVuy51kpdyam8fypSNIIjmQs1lTLHZ8Q1DBA3AtLfwX2aDA1TqY6XUchV4t6Ejy4P9jc3zdOE",
      priority: "urgent",
      visitPurpose:
        "Личный визит - Стоматологическая помощь. Нужно уйти пораньше, чтобы успеть на прием к врачу.",
      date: "Сегодня, 14:00 - 16:00",
      duration: "2 часа",
    },
    {
      name: "Михаил Россов",
      position: "Ведущий разработчик",
      department: "IT",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA62ZyR9DWdujFUhu-k4A-QFwOnAkAce8kwj6jMqYkRXKOD0-FmckAm4jvMIyUSq6jKlD9-JNgADRgk6mBUXrsT57S1pgJgPerysHCKADMFDMJvWI6f5wczOoTQAltQJmp_0AwRk3WJ34FD9Q_o3J8T-VvVZe3cyG_oieLhN-IxYrmi21oU9VaQGhTFcm6GExcy12qYZHdLjO36z1Dnw3HnsaX81tdhK8qhqi1huSfVtEfBNe5PAXdksoLO18Mti33x3-AEUIW7-dA",
      priority: "planned",
      visitPurpose:
        "Визит в банк для оформления ипотеки. Требуется личное присутствие.",
      date: "Завтра, 09:00 - 11:00",
      duration: "2 часа",
    },
  ];
  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-3 mb-4">
        <Card
          classNames={"col-span-4"}
          icon={"pending_actions"}
          iconColor={"text-blue-600 rounded-md p-1"}
          title={"Ожидают решения"}
          value={"50"}
        />

        <Card
          classNames={"col-span-4"}
          icon={"check_circle"}
          iconColor={"text-green-500 rounded-md p-1"}
          title={"Одобрено сегодня"}
          value={"50"}
        />
        <Card
          classNames={"col-span-4"}
          icon={"directions_run"}
          iconColor={"text-orange-500"}
          title={"Отсутствуют"}
          value={"50"}
        />
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-md mb-2">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search Input */}
          <label className="flex items-center border border-gray-200 md:w-80 h-10 rounded-lg bg-[#f0f2f] flex-1 w-1/2">
            <div className="text-[#616f89] border-none flex items-center justify-center pl-3">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-[#111318] placeholder:text-[#616f89] dark:placeholder:text-slate-500 text-sm font-normal h-full px-3 outline-none"
              placeholder="Поиск по имени, ID или отделу..."
            />
          </label>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto md:overflow-visible">
            <FilterButton>Все заявки</FilterButton>
            <FilterButton>В ожидании</FilterButton>
            <FilterButton>Одобрено</FilterButton>
            <FilterButton>Отклонено</FilterButton>
          </div>
        </div>
      </div>

      <section className="bg-white border border-gray-200 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {employees.map((employee, index) => (
          <EmployeeCard
            key={index}
            {...employee}
            onApprove={() => console.log("Approved:", employee.name)}
            onReject={() => console.log("Rejected:", employee.name)}
          />
        ))}
      </section>
    </DashboardLayout>
  );
};

export default Index;
