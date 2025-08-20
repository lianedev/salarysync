
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock } from "lucide-react";

interface QuickActionsCardProps {
  onViewAnalytics: () => void;
  onTrackAttendance: () => void;
}

const QuickActionsCard = ({ 
  onViewAnalytics, 
  onTrackAttendance 
}: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks you might want to perform
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onViewAnalytics} variant="outline" className="flex items-center gap-1 w-full sm:w-auto">
          <BarChart3 className="p-0.5" />
          View Analytics
        </Button>
        <Button onClick={onTrackAttendance} variant="outline" className="flex items-center gap-1 w-full sm:w-auto">
          <Clock className="p-0.5" />
          Track Attendance
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
