import Card from "@/components/card";
import DashboardLayout from "@/layout/Dashboard";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-3">
        <Card classNames={"col-span-4"} />
        <Card classNames={"col-span-4"} />
        <Card classNames={"col-span-4"} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
