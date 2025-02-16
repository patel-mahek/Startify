"use client"

import './style.css'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { text } from "stream/consumers"
import { useRouter } from "next/navigation";


const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

const questions = [
  {
    id: 1,
    text: "Company Information",
    type: "multi",
    fields: [
      { name: "companyName", label: "Company Name", type: "text" },
      { name: "MyName", label: "My Name", type: "text" },
      { name: "startYear", label: "Year of Starting", type: "select", options: years },
    ],
  },
  {
    id: 2,
    text: "Industry Sector: Which industry best describes your startup?",
    type: "radio",
    options: ["Technology", "Healthcare", "Finance", "Education", "Other"],
  },
  {
    id: 3,
    text: "Business Model: How does your startup generate revenue?",
    type: "checkbox",
    options: ["Product Sales", "Service-Based", "Subscription", "Advertising", "Other"],
  },
  {
    id: 4,
    text: "Current Stage: What stage is your startup currently in?",
    type: "radio",
    options: ["Idea/Concept", "Prototype/Development", "Launched", "Scaling"],
  },
  {
    id: 5,
    text: "Target Market: Who is your primary target audience?",
    type: "text",
  },
  {
    id: 6,
    text: "Market Size: What is the estimated size of your target market?",
    type: "radio",
    options: ["Less than $1 million", "$1 million - $10 million", "$10 million - $100 million", "Over $100 million"],
  },
  {
    id: 7,
    text: "Geographical Focus: Where are your target customers primarily located?",
    type: "radio",
    options: ["Local", "National", "International", "Global"],
  },
  {
    id: 8,
    text: "Funding Status: Have you secured any funding for your startup?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: 9,
    text: "If Yes: What type of funding have you received?",
    type: "checkbox",
    options: ["Bootstrapped", "Angel Investment", "Venture Capital", "Crowdfunding", "Other"],
    conditional: 8,
  },
  {
    id: 10,
    text: "Team Size: How would you describe the current size of your team?",
    type: "radio",
    options: [
      "Solo Entrepreneur (1 person)",
      "Small Team (2-5 people)",
      "Medium Team (6-20 people)",
      "Large Team (21-100 people)",
      "Enterprise (100+ people)",
    ],
  },
  {
    id: 11,
    text: "Short-Term Goals: What are your primary objectives for the next 6-12 months?",
    type: "text",
  },
  {
    id: 12,
    text: "Long-Term Vision: Where do you envision your startup in the next 3-5 years?",
    type: "text",
  },
  {
    id: 13,
    text: "Current Challenges: What are the main obstacles you're facing in your entrepreneurial journey?",
    type: "text",
  },
  {
    id: 14,
    text: "Areas of Assistance: In which areas do you seek support? (Select all that apply)",
    type: "checkbox",
    options: [
      "Business Idea Validation",
      "Market Research",
      "Funding and Investment",
      "Product Development",
      "Marketing and Sales",
      "Legal and Compliance",
      "Networking and Partnerships",
      "Other",
    ],
  },
  {
    id: 15,
    text: "Financial Breakdown",
    type: "text",
    label: "Please provide a breakdown of your financial metrics (e.g., 30% profit, 20% factory charges)",
  },
]

export default function Questionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [aiResponse, setAiResponse] = useState("")

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()  
    }
  }
  
  const router = useRouter();

    const handleSubmit = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/generate/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: answers })
        })

        const data = await response.json()
        if (data.text) {
          setAiResponse(data.text)
          setIsCompleted(true)
        }
      } catch (error) {
        console.error("Error fetching AI response:", error)
      }
    };

    
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const renderQuestion = (question: any) => {
    if (question.conditional && !answers[question.conditional]) {
      return null
    }

    switch (question.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={`q${question.id}`}>{question.label || question.text}</Label>
            <Input
              id={`q${question.id}`}
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
          </div>
        )
      case "select":
        return (
          <div className="space-y-2">
            <Label>{question.label}</Label>
            <Select onValueChange={(value) => handleAnswer(question.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((year: number) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case "radio":
        return (
          <RadioGroup onValueChange={(value) => handleAnswer(question.id, value)}>
            {question.options.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`q${question.id}-${option}`} />
                <Label htmlFor={`q${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`q${question.id}-${option}`}
                  onCheckedChange={(checked) => {
                    const currentAnswers = answers[question.id] || []
                    if (checked) {
                      handleAnswer(question.id, [...currentAnswers, option])
                    } else {
                      handleAnswer(
                        question.id,
                        currentAnswers.filter((a: string) => a !== option),
                      )
                    }
                  }}
                />
                <Label htmlFor={`q${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "multi":
        return (
          <div className="space-y-4">
            {question.fields.map((field: any) => (
              <div key={field.name}>{renderQuestion({ ...field, id: `${question.id}-${field.name}` })}</div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5e6d3]">
        <div className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-6 text-[#8d6e63]">
            Thank you for completing the questionnaire!
          </h2>
          <p className="mb-4">Your responses have been recorded.</p>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e6d3]">
      <div className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-lg">
        <Progress value={progress} className="mb-8" />
        <h2 className="text-2xl font-bold mb-6 text-[#8d6e63]">{questions[currentQuestion].text}</h2>
        {renderQuestion(questions[currentQuestion])}
        <div className="flex justify-between mt-8">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>
          <Button onClick={handleNext}>{currentQuestion === questions.length - 1 ? "Finish" : "Next"}</Button>
        </div>
      </div>
    </div>
  )
}

