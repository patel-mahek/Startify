"use client";
import "./style.css";
import * as React from "react";
import { Paperclip, Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const primaryColor = "rgb(0, 75, 98)";

export default function Dashboard() {
  const [messages, setMessages] = React.useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! How can I assist you today?", isUser: false },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Function to send user message and get response from backend
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newMessages = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      setMessages([...newMessages, { text: data.reply, isUser: false }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages([...newMessages, { text: "Sorry, an error occurred.", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="flex-grow flex overflow-hidden">
        {/* History Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="font-bold mb-4" style={{ color: primaryColor }}>
            History
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Today</h3>
              <p className="text-sm text-gray-600">Discussed project timeline</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex w-3/4 flex-col">
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "mb-4 p-2 rounded-lg max-w-[70%]",
                  message.isUser ? "bg-blue-100 ml-auto" : "bg-gray-100"
                )}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t flex items-center">
            <Input
              className="flex-grow mr-2"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={loading}
            />
            <Button onClick={handleSendMessage} style={{ backgroundColor: primaryColor }} disabled={loading}>
              {loading ? "..." : <Send className="h-4 w-4" />}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// "use client";

// import './style.css';
// import * as React from "react";
// import { Bar, Line, Pie } from "react-chartjs-2";
// import {
//   CurrencyRupeeIcon,
//   ShoppingBagIcon,
//   ChartBarIcon,
//   ChartPieIcon,
// } from "@heroicons/react/24/solid";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function Dashboard() {
//   const [data, setData] = React.useState(null);
//   const [error, setError] = React.useState(null);

//   // 🛠️ Fetch the latest data from FastAPI
//   React.useEffect(() => {
//     fetch("http://localhost:8000/latest/") // Update URL if API runs on another port
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch data");
//         return res.json();
//       })
//       .then((data) => setData(data))
//       .catch((err) => {
//         console.error("Error fetching data:", err);
//         setError(err.message);
//       });
//   }, []);

//   if (error) return <p className="text-red-500">Error: {error}</p>;
//   if (!data) return <p>Loading...</p>;

//   const prompt = data.prompt || {};

//   // 🛠️ Extract financial data safely
//   let financialData = [];
//   try {
//     financialData = (prompt["15"] || "")
//       .split(", ")
//       .map((entry) => {
//         const parts = entry.split("% ");
//         return { label: parts[1] || "Unknown", value: parseFloat(parts[0]) || 0 };
//       });
//   } catch (err) {
//     console.error("Error parsing financial data:", err);
//   }

//   // 📊 Revenue Growth Chart (Replace with API data if available)
//   const revenueGrowthData = {
//     labels: ["2020", "2021", "2022", "2023", "2024"],
//     datasets: [
//       {
//         label: "Revenue (in Million USD)",
//         data: [10, 20, 35, 50, 70], // Replace with dynamic values if API supports it
//         backgroundColor: "rgb(14, 136, 173)",
//       },
//     ],
//   };

//   // 📈 User Growth Chart
//   const userGrowthData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May"],
//     datasets: [
//       {
//         label: "User Growth",
//         data: [500, 800, 1200, 1600, 2200], // Replace with API values if available
//         borderColor: "rgb(0, 75, 98)",
//         backgroundColor: "rgba(0, 75, 98, 0.2)",
//         fill: true,
//       },
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <main className="container mx-auto p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Overview Section */}
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <OverviewCard title="Company Name" value={prompt["1-companyName"] || "N/A"} icon={<CurrencyRupeeIcon className="h-6 w-6" />} />
//               <OverviewCard title="Founder" value={prompt["1-MyName"] || "N/A"} icon={<ChartBarIcon className="h-6 w-6" />} />
//               <OverviewCard title="Founded" value={prompt["1-startYear"] || "N/A"} icon={<ShoppingBagIcon className="h-6 w-6" />} />
//               <OverviewCard title="Target Audience" value={prompt["5"] || "N/A"} icon={<ChartPieIcon className="h-6 w-6" />} />
//             </div>

//             {/* Financial Breakdown Pie Chart */}
//             <Card className="h-[400px]">
//               <CardHeader>
//                 <CardTitle>Financial Breakdown</CardTitle>
//               </CardHeader>
//               <CardContent className="h-[340px]">
//                 {financialData.length > 0 ? (
//                   <FinancialChart data={financialData} />
//                 ) : (
//                   <p className="text-gray-500">No financial data available</p>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Revenue Growth Bar Chart */}
//             <Card className="h-[400px]">
//               <CardHeader>
//                 <CardTitle>Revenue Growth</CardTitle>
//               </CardHeader>
//               <CardContent className="h-[340px]">
//                 <Bar data={revenueGrowthData} options={{ responsive: true, maintainAspectRatio: false }} />
//               </CardContent>
//             </Card>

//             {/* User Growth Line Chart */}
//             <Card className="h-[400px]">
//               <CardHeader>
//                 <CardTitle>User Growth Over Time</CardTitle>
//               </CardHeader>
//               <CardContent className="h-[340px]">
//                 <Line data={userGrowthData} options={{ responsive: true, maintainAspectRatio: false }} />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // 🏷️ Overview Card Component
// function OverviewCard({ title, value, icon }) {
//   return (
//     <Card className="h-[180px]">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         {icon}
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//       </CardContent>
//     </Card>
//   );
// }

// // 🥧 Financial Breakdown Chart
// function FinancialChart({ data }) {
//   const chartData = {
//     labels: data.map((entry) => entry.label),
//     datasets: [
//       {
//         data: data.map((entry) => entry.value),
//         backgroundColor: ["rgb(14, 136, 173)", "rgb(58, 184, 222)", "rgb(54, 132, 156)", "rgb(0, 75, 98)"],
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "right" },
//       title: { display: true, text: "Financial Breakdown" },
//     },
//   };

//   return <Pie data={chartData} options={options} />;
// }
