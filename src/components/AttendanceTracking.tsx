
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Calendar as CalendarIcon, CheckCircle, XCircle, AlertCircle, Plus, Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface AttendanceTrackingProps {
  employees: any[];
}

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  status: 'present' | 'late' | 'absent' | 'partial';
  notes?: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestDate: Date;
}

const AttendanceTracking = ({ employees }: AttendanceTrackingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeId: '',
    leaveType: '',
    startDate: new Date(),
    endDate: new Date(),
    reason: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockTimeEntries: TimeEntry[] = employees.map((emp, index) => ({
      id: `time-${index}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      date: new Date(),
      clockIn: ['08:00', '08:15', '09:00', '08:30'][index % 4],
      clockOut: ['17:00', '17:15', '18:00', '16:30'][index % 4],
      totalHours: [8, 8.25, 8, 8][index % 4],
      status: ['present', 'late', 'present', 'present'][index % 4] as any,
      notes: index % 3 === 0 ? 'Worked overtime' : undefined
    }));

    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: 'leave-1',
        employeeId: employees[0]?.id || '1',
        employeeName: employees[0] ? `${employees[0].firstName} ${employees[0].lastName}` : 'John Doe',
        leaveType: 'annual',
        startDate: new Date(2025, 0, 15),
        endDate: new Date(2025, 0, 17),
        days: 3,
        status: 'pending',
        reason: 'Family vacation',
        requestDate: new Date()
      },
      {
        id: 'leave-2',
        employeeId: employees[1]?.id || '2',
        employeeName: employees[1] ? `${employees[1].firstName} ${employees[1].lastName}` : 'Jane Smith',
        leaveType: 'sick',
        startDate: new Date(2025, 0, 10),
        endDate: new Date(2025, 0, 12),
        days: 3,
        status: 'approved',
        reason: 'Medical appointment',
        requestDate: new Date(2024, 11, 28)
      }
    ];

    setTimeEntries(mockTimeEntries);
    setLeaveRequests(mockLeaveRequests);
  }, [employees]);

  const handleClockIn = (employeeId: string) => {
    const now = new Date();
    const timeString = format(now, 'HH:mm');
    
    setTimeEntries(prev => prev.map(entry => 
      entry.employeeId === employeeId 
        ? { ...entry, clockIn: timeString, status: 'present' as const }
        : entry
    ));
    
    toast({
      title: "Clocked In",
      description: `Employee clocked in at ${timeString}`,
    });
  };

  const handleClockOut = (employeeId: string) => {
    const now = new Date();
    const timeString = format(now, 'HH:mm');
    
    setTimeEntries(prev => prev.map(entry => 
      entry.employeeId === employeeId 
        ? { 
            ...entry, 
            clockOut: timeString,
            totalHours: calculateHours(entry.clockIn, timeString)
          }
        : entry
    ));
    
    toast({
      title: "Clocked Out",
      description: `Employee clocked out at ${timeString}`,
    });
  };

  const calculateHours = (clockIn: string, clockOut: string): number => {
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    
    return Math.round(((outMinutes - inMinutes) / 60) * 100) / 100;
  };

  const handleLeaveRequest = () => {
    if (!newLeaveRequest.employeeId || !newLeaveRequest.leaveType || !newLeaveRequest.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const employee = employees.find(emp => emp.id === newLeaveRequest.employeeId);
    const days = Math.ceil((newLeaveRequest.endDate.getTime() - newLeaveRequest.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const request: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: newLeaveRequest.employeeId,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
      leaveType: newLeaveRequest.leaveType as any,
      startDate: newLeaveRequest.startDate,
      endDate: newLeaveRequest.endDate,
      days,
      status: 'pending',
      reason: newLeaveRequest.reason,
      requestDate: new Date()
    };

    setLeaveRequests(prev => [request, ...prev]);
    setNewLeaveRequest({
      employeeId: '',
      leaveType: '',
      startDate: new Date(),
      endDate: new Date(),
      reason: ''
    });

    toast({
      title: "Leave Request Submitted",
      description: "The leave request has been submitted for approval",
    });
  };

  const updateLeaveStatus = (leaveId: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === leaveId ? { ...req, status } : req
    ));

    toast({
      title: `Leave Request ${status}`,
      description: `The leave request has been ${status}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: "default",
      late: "secondary",
      absent: "destructive",
      partial: "outline",
      pending: "secondary",
      approved: "default",
      rejected: "destructive"
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Attendance & Time Tracking</h2>
          <p className="text-muted-foreground">Manage employee attendance, timesheets, and leave requests</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="timesheets" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="pto-policies">PTO Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="timesheets" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {timeEntries.filter(entry => entry.status === 'present').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {timeEntries.filter(entry => entry.status === 'late').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {timeEntries.filter(entry => entry.status === 'absent').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Hours</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {(timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0) / timeEntries.length || 0).toFixed(1)}h
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>Employee time tracking for {format(selectedDate, 'MMMM d, yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.employeeName}</TableCell>
                      <TableCell>{entry.clockIn}</TableCell>
                      <TableCell>{entry.clockOut}</TableCell>
                      <TableCell>{entry.totalHours}h</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleClockIn(entry.employeeId)}
                          >
                            Clock In
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleClockOut(entry.employeeId)}
                          >
                            Clock Out
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave-requests" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Leave Request</CardTitle>
                <CardDescription>Request time off for employees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Employee</Label>
                  <Select value={newLeaveRequest.employeeId} onValueChange={(value) => 
                    setNewLeaveRequest(prev => ({ ...prev, employeeId: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Leave Type</Label>
                  <Select value={newLeaveRequest.leaveType} onValueChange={(value) => 
                    setNewLeaveRequest(prev => ({ ...prev, leaveType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={format(newLeaveRequest.startDate, 'yyyy-MM-dd')}
                      onChange={(e) => setNewLeaveRequest(prev => ({ 
                        ...prev, 
                        startDate: new Date(e.target.value) 
                      }))}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={format(newLeaveRequest.endDate, 'yyyy-MM-dd')}
                      onChange={(e) => setNewLeaveRequest(prev => ({ 
                        ...prev, 
                        endDate: new Date(e.target.value) 
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Reason</Label>
                  <Textarea
                    value={newLeaveRequest.reason}
                    onChange={(e) => setNewLeaveRequest(prev => ({ 
                      ...prev, 
                      reason: e.target.value 
                    }))}
                    placeholder="Enter reason for leave"
                  />
                </div>

                <Button onClick={handleLeaveRequest} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Manage pending and approved leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{request.employeeName}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {request.leaveType.replace('_', ' ')} Leave • {request.days} days
                          </p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <p className="text-sm mb-2">
                        {format(request.startDate, 'MMM d')} - {format(request.endDate, 'MMM d, yyyy')}
                      </p>
                      
                      <p className="text-sm text-muted-foreground mb-3">{request.reason}</p>
                      
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateLeaveStatus(request.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateLeaveStatus(request.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pto-policies" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PTO Policies</CardTitle>
                <CardDescription>Configure paid time off policies for different employee levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Entry Level</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Annual Leave: <span className="font-medium">15 days</span></div>
                      <div>Sick Leave: <span className="font-medium">10 days</span></div>
                      <div>Personal Leave: <span className="font-medium">3 days</span></div>
                      <div>Maternity Leave: <span className="font-medium">90 days</span></div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Mid Level</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Annual Leave: <span className="font-medium">21 days</span></div>
                      <div>Sick Leave: <span className="font-medium">15 days</span></div>
                      <div>Personal Leave: <span className="font-medium">5 days</span></div>
                      <div>Maternity Leave: <span className="font-medium">120 days</span></div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Senior Level</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Annual Leave: <span className="font-medium">30 days</span></div>
                      <div>Sick Leave: <span className="font-medium">20 days</span></div>
                      <div>Personal Leave: <span className="font-medium">7 days</span></div>
                      <div>Maternity Leave: <span className="font-medium">120 days</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Balance Summary</CardTitle>
                <CardDescription>Current leave balances for all employees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.slice(0, 5).map((emp, index) => (
                    <div key={emp.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                        <div className="text-sm text-muted-foreground">{emp.position}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div>Annual: {[15, 12, 8, 21, 18][index]} days</div>
                        <div>Sick: {[8, 10, 5, 15, 12][index]} days</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceTracking;
