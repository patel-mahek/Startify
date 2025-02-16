# basic gemini
# from fastapi import FastAPI
# from pydantic import BaseModel
# import os
# from dotenv import load_dotenv
# import google.generativeai as genai

# load_dotenv()

# genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

# app = FastAPI()
# class PromptRequest(BaseModel):
#     prompt: str

# app.post("/generate/" ) 
# async def generate_text(request: PromptRequest):
#     try:
#         resposnse = genai.generate_text(prompt=request.prompt,model="models/text-bison-001",temperature=0.7,stop_sequence="\n",num_results=1)
#         return {"text": response.result}
#     except Exception as e:
#         return {"error": str(e)}


# for text generation
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import os
# from dotenv import load_dotenv
# import google.generativeai as genai
# from fastapi.middleware.cors import CORSMiddleware
# import pymongo
# load_dotenv()

# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# # mongoDB
# MONGO_URI = os.getenv("MONGO_URI")
# if not MONGO_URI:
#     raise ValueError("MONGO_URI is not set in environment variables.")
# DB_NAME = "StartupAI"
# COLLECTION_NAME = "Responses"
# client = pymongo.MongoClient(MONGO_URI)
# db = client[DB_NAME]
# responses_collection = db[COLLECTION_NAME]


# app = FastAPI()

# # Enable CORS for frontend communication
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Change this to specific domains in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# json_string = """{
#     "1": {
#         "companyName": "",
#         "startYear": ""
#     },
#     "2": {
#         "industrySector": ""
#     },
#     "3": {
#         "businessModel": []
#     },
#     "4": {
#         "currentStage": ""
#     },
#     "5": {
#         "targetMarket": ""
#     },
#     "6": {
#         "marketSize": ""
#     },
#     "7": {
#         "geographicalFocus": ""
#     },
#     "8": {
#         "fundingStatus": ""
#     },
#     "9": {
#         "fundingType": []
#     },
#     "10": {
#         "teamSize": ""
#     },
#     "11": {
#         "shortTermGoals": ""
#     },
#     "12": {
#         "longTermVision": ""
#     },
#     "13": {
#         "currentChallenges": ""
#     },
#     "14": {
#         "areasOfAssistance": []
#     },
#     "15": {
#         "financialBreakdown": ""
#     }
# }"""


# class PromptRequest(BaseModel):
#     prompt: str

# @app.post("/generate/")
# async def generate_text(request: PromptRequest):
#     try:
#         model = genai.GenerativeModel("gemini-pro")
#         structured_prompt = f"""Analyze the following startup questionnaire responses and provide insights: the following will be the information given to you in json format\n{json_string} and i want to give them 
#         1)a greeting to the person\n\n{request.prompt}"""
#         response = model.generate_content(structured_prompt)

#         if response and hasattr(response, "text"):
#             return {"text": response.text}
#         else:
#             raise HTTPException(status_code=500, detail="Invalid response from AI model")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))




# with mongodb
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import pymongo
from typing import Dict, Any
import logging

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in environment variables.")

DB_NAME = "CYberCypher"
COLLECTION_NAME = "Responses"
client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
responses_collection = db[COLLECTION_NAME]


logging.basicConfig(level=logging.INFO)
origins = ["http://localhost:3000"]
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class PromptRequest(BaseModel):
    prompt: Dict[str, Any]  



@app.post("/generate/")
async def generate_text(request: PromptRequest):
    try:
        model = genai.GenerativeModel("gemini-pro")
        structured_prompt = f"""Analyze the following startup questionnaire responses and provide insights:
        
        The following will be the information given to you in JSON format:

        {{
            "1": {{"companyName": "", "startYear": ""}},
            "2": {{"industrySector": ""}},
            "3": {{"businessModel": []}},
            "4": {{"currentStage": ""}},
            "5": {{"targetMarket": ""}},
            "6": {{"marketSize": ""}},
            "7": {{"geographicalFocus": ""}},
            "8": {{"fundingStatus": ""}},
            "9": {{"fundingType": []}},
            "10": {{"teamSize": ""}},
            "11": {{"shortTermGoals": ""}},
            "12": {{"longTermVision": ""}},
            "13": {{"currentChallenges": ""}},
            "14": {{"areasOfAssistance": []}},
            "15": {{"financialBreakdown": ""}}
        }}

        1) Provide a greeting to the person.
        2) Summarize the company details, including its goals, and beautify the text.
        3) Identify loopholes or potential challenges the company might face based on its type and goals, and suggest solutions.
        4) Provide a detailed structured plan for achieving their goals.
        5) Conclude with a supportive message and a motivational quote.

        Input details:\n{request.prompt}"""

        response = model.generate_content(structured_prompt)

        if response and hasattr(response, "text"):
            generated_text = response.text.strip()

            # Save response to MongoDB
            response_data = {"prompt": request.prompt, "response": generated_text}
            responses_collection.insert_one(response_data)

            return {"text": generated_text}
        else:
            raise HTTPException(status_code=500, detail="Invalid response from AI model")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from fastapi import Query

@app.get("/responses/")
def get_responses(company_name: str = Query(None)):
    try:
        query = {"prompt.1.companyName": company_name} if company_name else {}
        responses = list(responses_collection.find(query, {"_id": 0}))
        return {"responses": responses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/latest/")
def get_latest_response():
    try:
        latest_doc = responses_collection.find_one(sort=[("_id", -1)])  # Get latest entry
        if not latest_doc:
            return {"message": "No data found"}
        
        latest_doc["_id"] = str(latest_doc["_id"])  # Convert ObjectId to string
        return latest_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))