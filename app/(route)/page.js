import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Award,
  BadgePercent,
  Package,
  Ticket,
  TrendingUp,
} from "lucide-react";

function DashboardCard({ icon: Icon, title, value }) {
  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="flex flex-col items-center text-center">
        <Icon className="h-12 w-12 text-primary mb-2" />
        <CardDescription className="font-semibold text-xl text-gray-700">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard icon={Ticket} title="Bookings" value={540} />
        <DashboardCard icon={Package} title="Deliveries" value={2218} />
        <DashboardCard icon={BadgePercent} title="Income" value="₹12,540" />
        <DashboardCard icon={Award} title="Profit" value="₹7,340" />
      </div>
      <div className="w-3/4 mt-6">

      </div>
    </div>
  );
}
