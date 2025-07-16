
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
import { supabase } from "@/integrations/supabase/client";

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

  // Load attendance data from database
  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        // Load time entries for today
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data: timeEntriesData, error: timeError } = await supabase
          .from('time_entries')
          .select(`
            *,
            employees(first_name, last_name)
          `)
          .eq('date', today)
          .eq('user_id', user.user.id);

        if (timeError) {
          console.error('Error loading time entries:', timeError);
        } else {
          const transformedTimeEntries: TimeEntry[] = timeEntriesData.map(entry => ({
            id: entry.id,
            employeeId: entry.employee_id,
            employeeName: `${entry.employees.first_name} ${entry.employees.last_name}`,
            date: new Date(entry.date),
            clockIn: entry.clock_in || '--:--',
            clockOut: entry.clock_out || '--:--',
            totalHours: Number(entry.total_hours) || 0,
            status: entry.status as 'present' | 'late' | 'absent' | 'partial',
            notes: entry.notes
          }));

          // Add entries for employees without time entries today
          const existingEmployeeIds = new Set(transformedTimeEntries.map(te => te.employeeId));
          const missingEmployeeEntries: TimeEntry[] = employees
            .filter(emp => !existingEmployeeIds.has(emp.id))
            .map(emp => ({
              id: `temp-${emp.id}`,
              employeeId: emp.id,
              employeeName: `${emp.first_name} ${emp.last_name}`,
              date: new Date(),
              clockIn: '--:--',
              clockOut: '--:--',
              totalHours: 0,
              status: 'absent' as const,
              notes: undefined
            }));

          setTimeEntries([...transformedTimeEntries, ...missingEmployeeEntries]);
        }

        // Load leave requests
        const { data: leaveData, error: leaveError } = await supabase
          .from('leave_requests')
          .select(`
            *,
            employees(first_name, last_name)
          `)
          .eq('user_id', user.user.id)
          .order('created_at', { ascending: false });

        if (leaveError) {
          console.error('Error loading leave requests:', leaveError);
        } else {
          const transformedLeaveRequests: LeaveRequest[] = leaveData.map(request => ({
            id: request.id,
            employeeId: request.employee_id,
            employeeName: `${request.employees.first_name} ${request.employees.last_name}`,
            leaveType: request.leave_type as 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency',
            startDate: new Date(request.start_date),
            endDate: new Date(request.end_date),
            days: request.days,
            status: request.status as 'pending' | 'approved' | 'rejected',
            reason: request.reason,
            requestDate: new Date(request.request_date)
          }));

          setLeaveRequests(transformedLeaveRequests);
        }
      } catch (error) {
        console.error('Error loading attendance data:', error);
        toast({
          title: "Error",
          description: "Failed to load attendance data",
          variant: "destructive"
        });
      }
    };

    if (employees.length > 0) {
      loadAttendanceData();
    }
  }, [employees]);

  const handleClockIn = async (employeeId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const now = new Date();
      const timeString = format(now, 'HH:mm');
      const today = format(now, 'yyyy-MM-dd');
      
      // Check if entry exists for today
      const { data: existingEntry } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('date', today)
        .eq('user_id', user.user.id)
        .single();

      if (existingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('time_entries')
          .update({
            clock_in: timeString,
            status: 'present'
          })
          .eq('id', existingEntry.id);

        if (error) {
          console.error('Error updating clock in:', error);
          toast({
            title: "Error",
            description: "Failed to clock in",
            variant: "destructive"
          });
          return;
        }
      } else {
        // Create new entry
        const { error } = await supabase
          .from('time_entries')
          .insert({
            employee_id: employeeId,
            date: today,
            clock_in: timeString,
            status: 'present',
            user_id: user.user.id
          });

        if (error) {
          console.error('Error creating time entry:', error);
          toast({
            title: "Error",
            description: "Failed to clock in",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Update local state
      setTimeEntries(prev => prev.map(entry => 
        entry.employeeId === employeeId 
          ? { ...entry, clockIn: timeString, status: 'present' as const }
          : entry
      ));
      
      toast({
        title: "Clocked In",
        description: `Employee clocked in at ${timeString}`,
      });
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: "Error",
        description: "Failed to clock in",
        variant: "destructive"
      });
    }
  };

  const handleClockOut = async (employeeId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const now = new Date();
      const timeString = format(now, 'HH:mm');
      const today = format(now, 'yyyy-MM-dd');
      
      // Find the existing entry
      const currentEntry = timeEntries.find(entry => entry.employeeId === employeeId);
      if (!currentEntry || currentEntry.clockIn === '--:--') {
        toast({
          title: "Error",
          description: "Employee must clock in first",
          variant: "destructive"
        });
        return;
      }

      const totalHours = calculateHours(currentEntry.clockIn, timeString);

      // Update the time entry in database
      const { error } = await supabase
        .from('time_entries')
        .update({
          clock_out: timeString,
          total_hours: totalHours
        })
        .eq('employee_id', employeeId)
        .eq('date', today)
        .eq('user_id', user.user.id);

      if (error) {
        console.error('Error updating clock out:', error);
        toast({
          title: "Error",
          description: "Failed to clock out",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setTimeEntries(prev => prev.map(entry => 
        entry.employeeId === employeeId 
          ? { 
              ...entry, 
              clockOut: timeString,
              totalHours
            }
          : entry
      ));
      
      toast({
        title: "Clocked Out",
        description: `Employee clocked out at ${timeString}`,
      });
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: "Error",
        description: "Failed to clock out",
        variant: "destructive"
      });
    }
  };

  const calculateHours = (clockIn: string, clockOut: string): number => {
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    
    return Math.round(((outMinutes - inMinutes) / 60) * 100) / 100;
  };

  const handleLeaveRequest = async () => {
    if (!newLeaveRequest.employeeId || !newLeaveRequest.leaveType || !newLeaveRequest.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const employee = employees.find(emp => emp.id === newLeaveRequest.employeeId);
      const days = Math.ceil((newLeaveRequest.endDate.getTime() - newLeaveRequest.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const { data, error } = await supabase
        .from('leave_requests')
        .insert({
          employee_id: newLeaveRequest.employeeId,
          leave_type: newLeaveRequest.leaveType,
          start_date: format(newLeaveRequest.startDate, 'yyyy-MM-dd'),
          end_date: format(newLeaveRequest.endDate, 'yyyy-MM-dd'),
          days,
          reason: newLeaveRequest.reason,
          user_id: user.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating leave request:', error);
        toast({
          title: "Error",
          description: "Failed to submit leave request",
          variant: "destructive"
        });
        return;
      }

      const request: LeaveRequest = {
        id: data.id,
        employeeId: newLeaveRequest.employeeId,
        employeeName: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
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
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive"
      });
    }
  };

  const updateLeaveStatus = async (leaveId: string, status: 'approved' | 'rejected') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status,
          approved_by: status === 'approved' ? user.user.id : null,
          approved_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', leaveId)
        .eq('user_id', user.user.id);

      if (error) {
        console.error('Error updating leave status:', error);
        toast({
          title: "Error",
          description: "Failed to update leave request status",
          variant: "destructive"
        });
        return;
      }

      setLeaveRequests(prev => prev.map(req => 
        req.id === leaveId ? { ...req, status } : req
      ));

      toast({
        title: `Leave Request ${status}`,
        description: `The leave request has been ${status}`,
      });
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast({
        title: "Error",
        description: "Failed to update leave request status",
        variant: "destructive"
      });
    }
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
