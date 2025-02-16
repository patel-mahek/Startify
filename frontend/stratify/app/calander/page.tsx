"use client"

import './style.css'
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const primaryColor = "rgb(0, 75, 98)"

export default function Dashboard() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [events, setEvents] = React.useState<{ date: Date; title: string; color: string }[]>([])
  const [newEvent, setNewEvent] = React.useState({ title: "", color: "#3b82f6" })
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date)
  }

  const handleSaveEvent = () => {
    if (selectedDate && newEvent.title) {
      setEvents([...events, { date: selectedDate, title: newEvent.title, color: newEvent.color }])
      setNewEvent({ title: "", color: "#3b82f6" })
      setSelectedDate(null)
    }
  }

  const renderCalendar = () => {
    const startDate = startOfWeek(currentDate)
    const endDate = endOfWeek(addDays(currentDate, 34))
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold p-2" style={{ color: primaryColor }}>
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayEvents = events.filter((event) => isSameDay(event.date, day))
          return (
            <div
              key={index}
              className={cn(
                "p-2 border rounded-md cursor-pointer hover:bg-gray-100",
                !isSameMonth(day, currentDate) && "text-gray-400",
                isSameDay(day, new Date()) && "bg-blue-100",
              )}
              onClick={() => handleAddEvent(day)}
            >
              <div className="text-right">{format(day, "d")}</div>
              {dayEvents.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="text-xs truncate mt-1 p-1 rounded"
                  style={{ backgroundColor: event.color }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  const pitchers = [
    { name: "John Doe", date: "2024-02-20", type: "Fastball", timing: "14:00", pitch: "Pitch1.pdf" },
    { name: "Jane Smith", date: "2024-02-21", type: "Curveball", timing: "15:30", pitch: "Pitch2.pdf" },
    { name: "Mike Johnson", date: "2024-02-22", type: "Slider", timing: "10:00", pitch: "Pitch3.pdf" },
    { name: "Emily Brown", date: "2024-02-23", type: "Changeup", timing: "11:45", pitch: "Pitch4.pdf" },
    { name: "Chris Wilson", date: "2024-02-24", type: "Knuckleball", timing: "16:15", pitch: "Pitch5.pdf" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stratify</h1>
          <NavigationMenu>
            <NavigationMenuList className="flex justify-center space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Calendar
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Pitch
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Presentation
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header> */}

      <main className="flex-grow flex flex-col overflow-hidden p-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div>
              <Button onClick={handlePrevMonth} variant="outline" size="icon" className="mr-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={handleNextMonth} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {renderCalendar()}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
            Pitcher Information
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name of Pitcher</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type of Pitcher</TableHead>
                <TableHead>Timing</TableHead>
                <TableHead>Pitch</TableHead>
                <TableHead>History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pitchers.map((pitcher, index) => (
                <TableRow key={index}>
                  <TableCell>{pitcher.name}</TableCell>
                  <TableCell>{pitcher.date}</TableCell>
                  <TableCell>{pitcher.type}</TableCell>
                  <TableCell>{pitcher.timing}</TableCell>
                  <TableCell>
                    <Button style={{ backgroundColor: primaryColor }}>Download Pitch</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline">History</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-title" className="text-right">
                Event Title
              </Label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-color" className="text-right">
                Event Color
              </Label>
              <Input
                id="event-color"
                type="color"
                value={newEvent.color}
                onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleSaveEvent}>Save Event</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

