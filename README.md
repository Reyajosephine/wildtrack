# 🐘 WildTrack - Wildlife Detection System

A complete end-to-end wildlife detection and monitoring system that uses AI-powered image analysis to detect animals, send real-time alerts, and interact with an intelligent chatbot. Perfect for zoo management, wildlife conservation, and animal tracking applications.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation Guide](#installation-guide)
5. [Azure Services Setup](#-azure-services-setup)
   - [Part 1: Custom Vision Model](#part-1-azure-custom-vision-model-animal-detection)
   - [Part 2: Language Service](#part-2-azure-language-service-chatbot-qa)
6. [Environment Setup](#environment-setup)
7. [Running the Project](#running-the-project)
8. [Docker & Azure Container Registry](#-docker--azure-container-registry)
   - [Part 1: Build & Test Locally](#part-1-build-and-test-docker-image-locally)
   - [Part 2: Push to ACR](#part-2-push-to-azure-container-registry)
   - [Part 3: Deploy to ACI](#part-3-deploy-from-acr-to-azure-container-instances-aci)
   - [Part 4: Deploy to App Service](#part-4-deploy-to-azure-app-service-alternative)
9. [Project Structure](#project-structure)
10. [API Endpoints](#api-endpoints)
11. [Frontend Pages](#frontend-pages)
12. [Troubleshooting](#troubleshooting)
13. [Development Tips](#development-tips)

---

## 🎯 Project Overview

**WildTrack** is a full-stack application designed to:
- Detect animals in images using Azure AI Vision Custom Vision
- Process detection results and generate alerts
- Display alerts on an interactive dashboard
- Provide real-time webhooks for SMS/notification services
- Answer user questions about animals using Azure AI Language QA
- Support multiple frontend pages (Home, Animals, Map) with a shared chat widget

**Tech Stack:**
- **Backend:** Python FastAPI + Uvicorn
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **AI/ML:** Azure Computer Vision, Azure Language QA
- **Database:** In-memory storage (can be extended to use databases)
- **Deployment:** Docker-ready

---

## ✨ Features

✅ **Animal Detection** - Real-time detection using Azure Custom Vision  
✅ **Alert System** - Automatic alerts when animals are detected  
✅ **Webhook Integration** - Send alerts to Make.com or other webhook services  
✅ **AI Chatbot** - Ask questions about animals using natural language  
✅ **Responsive Frontend** - Multi-page application with hero slider  
✅ **Real-time Updates** - Polling-based alert retrieval  
✅ **Docker Support** - Easy deployment with Docker  
✅ **CORS Enabled** - Local development support

---

## 🔧 Prerequisites

Before you start, make sure you have the following installed on your system:

### Required Software
- **Python 3.10 or higher** - [Download Python](https://www.python.org/downloads/)
- **pip** - Python package manager (comes with Python)
- **Git** - [Download Git](https://git-scm.com/downloads) (optional but recommended)
- **Visual Studio Code** - [Download VS Code](https://code.visualstudio.com/) (optional, for editing)
- **Docker Desktop** - [Download Docker](https://www.docker.com/products/docker-desktop/) (optional, for containerization and deployment)

### Azure Services (Required)
To use the full functionality, you'll need Azure accounts with the following services:

1. **Azure Custom Vision** - For animal detection
   - Create a Custom Vision project
   - Train a model with animal images
   - Get your prediction URL and key

2. **Azure Language QA** - For the chatbot
   - Create a Language resource
   - Set up a QA project
   - Get your endpoint and API key

3. **Make.com Account** (Optional) - For webhook notifications
   - Used to send SMS alerts to zoo keepers

### System Requirements
- At least 2GB RAM
- 500MB free disk space
- Windows, macOS, or Linux

---

## 💻 Installation Guide

### Step 1: Download/Clone the Project

**Option A: Using Git (Recommended)**
```bash
git clone <your-repository-url>
cd wildtrack
```

**Option B: Download as ZIP**
- Download the project as ZIP
- Extract it to your desired location
- Open terminal/command prompt in the extracted folder

### Step 2: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**macOS/Linux:**
- Open Terminal from Applications

### Step 3: Create a Python Virtual Environment

A virtual environment is a isolated Python environment that prevents package conflicts.

**Windows (Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

✅ You'll see `(venv)` at the beginning of your terminal line when activated.

### Step 4: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs all required packages:
- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **opencv-python** - Image processing
- **azure-ai-vision-imageanalysis** - Animal detection
- **azure-ai-language-questionanswering** - Chatbot
- **requests** - HTTP requests
- **python-dotenv** - Environment variables
- **pydantic** - Data validation

**Expected output:** 
```
Successfully installed fastapi-0.110.0 uvicorn-0.27.1 ... (and many more)
```

---

## 🤖 Azure Services Setup

This section guides you through setting up Azure Custom Vision for animal detection and Azure Language Service for the chatbot. These are essential services that power WildTrack.

### Part 1: Azure Custom Vision Model (Animal Detection)

Azure Custom Vision allows you to train your own AI model to detect specific objects (animals in this case). Follow these steps:

**📚 For more detailed step-by-step guide:** [Azure Image Classification - Day 15](https://github.com/Reyajosephine/Azure-AI-900-30-days-Challenge/blob/main/Day-15.md)

#### Step A1: Create an Azure Account

1. Go to [Azure Portal](https://portal.azure.com/)
2. Click "Create a resource" (or sign in if you have an account)
3. Sign up with your Microsoft account
4. Verify your identity and add payment information (you'll get free credits)

#### Step A2: Create a Resource Group

A resource group is a container for all your Azure resources.

1. In Azure Portal, search for "Resource groups"
2. Click "Create"
3. Fill in:
   - **Subscription:** Select your subscription
   - **Resource group name:** `wildtrack-resources`
   - **Region:** Select closest to you (e.g., `East US`, `West Europe`)
4. Click "Review + create" → "Create"

#### Step A3: Create a Custom Vision Resource

1. Go to [Custom Vision Portal](https://www.customvision.ai/)
2. Sign in with your Azure account
3. Click "New Project" (or "Create new")
4. Fill in the project details:
   - **Name:** `WildTrack Animal Detection`
   - **Description:** `AI model to detect animals in images`
   - **Project Type:** `Classification`
   - **Classification Types:** `Multiclass (Single tag per image)`
   - **Domains:** `General` or `General [A2]`
   - **Resource:** Create new or select existing
5. Click "Create project"

#### Step A4: Add Training Images

Now you'll teach the model to recognize different animals.

1. Once in your project, click "Add images"
2. Select images of animals (at least 5-15 images per animal type for good results)
3. **For each image batch:**
   - Click "Browse local files" or drag & drop
   - Select images
   - Add tags (e.g., "elephant", "lion", "giraffe")
   - Click "Upload X files"

**Tips for best results:**
- Use clear, well-lit images
- Include different angles and distances
- Include images from your actual camera/environment if possible
- Aim for at least 10-30 images per animal type

#### Step A5: Train the Model

1. After uploading images, click the "Train" button (top right)
2. Select "Quick Training" (faster for testing) or "Advanced" (more accurate)
3. Wait for training to complete (usually 1-5 minutes)
4. Review the performance metrics:
   - **Precision:** How many detections are correct
   - **Recall:** How many actual animals were found

#### Step A6: Get Your Custom Vision Credentials

1. In the Custom Vision portal, go to **Settings** (gear icon, top right)
2. Copy and save these values:
   - **Project ID:** You'll see this in the URL or settings
   - **Training Key:** Your training API key
   - **Prediction Key:** Your prediction API key
   - **Resource Name:** Your Azure region (e.g., `eastus`)

3. Click "Prediction URL" to see:
   - **IMAGE URL:** Copy the full prediction URL
   - It looks like: `https://[region].cognitiveservices.azure.com/customvision/v3.0/prediction/[project-id]/classify/iterations/[iteration-name]/url`

4. Save these for later - you'll need them in the `.env` file

**Example of what you'll copy:**
```
PREDICTION_URL=https://eastus.cognitiveservices.azure.com/customvision/v3.0/prediction/a1b2c3d4-e5f6-7890-abcd-ef1234567890/classify/iterations/Iteration1/url
PREDICTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

#### Step A7: Test Your Custom Vision Model

1. In Custom Vision portal, go to "Quick Test" (top right)
2. Upload a test image to verify it detects animals correctly
3. Review the predictions and confidence scores

---

### Part 2: Azure Language Service (Chatbot QA)

Azure Language Service with Question Answering lets you create a knowledge base so the chatbot can answer questions about animals.

**📚 For more detailed step-by-step guide:** [Azure Custom Question Answering - Day 22](https://github.com/Reyajosephine/Azure-AI-900-30-days-Challenge/tree/main/Day-22)

#### Step B1: Create a Language Resource

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "Language"
3. Click "Create" under "Language service"
4. Fill in details:
   - **Subscription:** Same as before
   - **Resource group:** Select `wildtrack-resources`
   - **Region:** Same region as Custom Vision
   - **Name:** `wildtrack-language`
   - **Pricing tier:** `Free F0` (or `Standard S` if F0 not available)
5. Click "Review + create" → "Create"
6. Wait for deployment to complete

#### Step B2: Create a Question Answering Project

1. Go to [Language Studio](https://language.cognitive.azure.com/)
2. Sign in with your Azure account
3. Click "Create new" or "New project"
4. Select **Question Answering**
5. Fill in:
   - **Name:** `WildTrack QA`
   - **Description:** `Animal questions and answers`
   - **Source language:** English
   - **Language resource:** Select your `wildtrack-language` resource
6. Click "Create project"

#### Step B3: Add Questions and Answers

Now add Q&A pairs about animals that your chatbot will know.

1. Click "Edit knowledge base" or "Add QnA pair"
2. For each question, fill in:
   - **Question:** "What do elephants eat?"
   - **Answer:** "Elephants are herbivores that eat grasses, leaves, bark, and fruits. They can consume up to 300 pounds of vegetation per day."
   - **Alternative questions:** "What is an elephant's diet?" (optional)

**Example Q&A pairs to add:**

```
Q: What do elephants eat?
A: Elephants are herbivores that eat grasses, leaves, bark, and fruits. They can consume up to 300 pounds of vegetation per day.

Q: How fast can lions run?
A: Lions can run up to 50 mph (80 km/h) in short bursts when hunting prey.

Q: Where do giraffes live?
A: Giraffes live in African savannas, grasslands, and open woodlands. They prefer areas with acacia trees.

Q: How long do animals sleep?
A: Sleep varies by animal. Elephants sleep 4-6 hours, lions sleep 16-20 hours, and giraffes sleep 30 minutes to 2 hours per day.

Q: What are the endangered animals?
A: Many animals are endangered including elephants, rhinos, tigers, gorillas, pandas, and sea turtles due to habitat loss and poaching.

Q: How do animals communicate?
A: Animals communicate through sounds (roars, chirps), body language, scent marking, and visual signals.

Q: What is the fastest animal?
A: The peregrine falcon is the fastest animal, reaching speeds over 240 mph. Among land animals, the cheetah is fastest at 70 mph.

Q: How much do elephants weigh?
A: Adult African elephants weigh 5,000-14,000 pounds (2,270-6,350 kg), making them the heaviest land animals.
```

3. Add at least 8-10 Q&A pairs
4. Click "Save and train" or "Deploy" button

#### Step B4: Deploy the Knowledge Base

1. Click "Deploy knowledge base" button
2. A dialog will appear showing your deployment details
3. Review and click "Deploy" to confirm
4. Wait for deployment to complete

#### Step B5: Get Your Language Service Credentials

1. Go back to [Azure Portal](https://portal.azure.com/)
2. Search for your Language resource: `wildtrack-language`
3. Click on it
4. Go to **Keys and Endpoint** (left sidebar)
5. Copy and save:
   - **Endpoint:** `https://[region].api.cognitive.microsoft.com/`
   - **Key1 or Key2:** Your API key

6. In Language Studio, go to **Project settings**:
   - Find **Project name:** (for `PROJECT_NAME`)
   - Find **Deployment name:** (usually `prod` for production - for `DEPLOYMENT_NAME`)

**Example of what you'll copy:**
```
AZURE_LANGUAGE_ENDPOINT=https://eastus.api.cognitive.microsoft.com/
AZURE_LANGUAGE_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2
PROJECT_NAME=WildTrack QA
DEPLOYMENT_NAME=prod
```

#### Step B6: Test Your QA Model

1. In Language Studio, click "Test" or "Test in web app"
2. Ask a question like "What do elephants eat?"
3. Verify you get a correct answer
4. Ask follow-up questions to test the knowledge base

---

## 🔐 Environment Setup

### Step 5: Create Environment Variables File

Create a `.env` file in the root directory (same level as `main.py`):

**Windows (Command Prompt):**
```bash
type nul > .env
```

**Windows (PowerShell):**
```bash
New-Item -Path ".\.env" -ItemType File
```

**macOS/Linux:**
```bash
touch .env
```

### Step 6: Configure Environment Variables

Open `.env` in your text editor and add the following variables:

```env
# ===== Azure Custom Vision (Animal Detection) =====
PREDICTION_URL=https://your-region.cognitiveservices.azure.com/customvision/v3.0/prediction/YOUR-PROJECT-ID/classify/iterations/YOUR-ITERATION-NAME/url
PREDICTION_KEY=your-custom-vision-api-key

# ===== Azure Language QA (Chatbot) =====
AZURE_LANGUAGE_ENDPOINT=https://your-region.api.cognitive.microsoft.com/
AZURE_LANGUAGE_KEY=your-language-service-api-key
PROJECT_NAME=your-qna-project-name
DEPLOYMENT_NAME=your-deployment-name

# ===== Make Webhook (Optional - for SMS alerts) =====
MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-url
```

### How to Get These Values

**✅ BEFORE PROCEEDING:** Make sure you've completed the [Azure Services Setup](#-azure-services-setup) section above. These credentials come from the Azure services you just created.

#### For Azure Custom Vision (Animal Detection):

If you followed **Part 1: Azure Custom Vision Model** above, you already have these values:

1. **PREDICTION_URL:** 
   - From Step A6, you copied the full prediction URL
   - Format: `https://[region].cognitiveservices.azure.com/customvision/v3.0/prediction/[project-id]/classify/iterations/[iteration-name]/url`
   - Paste it directly into `.env`

2. **PREDICTION_KEY:**
   - Also from Step A6, your prediction API key
   - Paste it into `.env`

**If you didn't complete Part 1 yet:**
1. Go to [Custom Vision Portal](https://www.customvision.ai/)
2. Select your project
3. Click Settings (gear icon, top right)
4. You'll see your Prediction URL and Prediction Key
5. Copy both into `.env`

#### For Azure Language QA (Chatbot):

If you followed **Part 2: Azure Language Service** above, you already have these values:

1. **AZURE_LANGUAGE_ENDPOINT:**
   - From Step B5, your Language resource endpoint
   - Format: `https://[region].api.cognitive.microsoft.com/`
   - Example: `https://eastus.api.cognitive.microsoft.com/`
   - Paste it into `.env`

2. **AZURE_LANGUAGE_KEY:**
   - Also from Step B5, your API key (Key1 or Key2)
   - Paste it into `.env`

3. **PROJECT_NAME:**
   - From Step B5, your QA project name
   - Example: `WildTrack QA`
   - Paste it into `.env`

4. **DEPLOYMENT_NAME:**
   - From Step B5, usually `prod` for production
   - Paste it into `.env`

**If you didn't complete Part 2 yet:**
1. Go to [Language Studio](https://language.cognitive.azure.com/)
2. Select your QA project
3. Click Project settings (gear icon)
4. Find and copy: Endpoint, API Key, Project Name, Deployment Name
5. Also go to [Azure Portal](https://portal.azure.com/) to get your Language resource endpoint
6. Copy all values into `.env`

#### For Make Webhook (Optional):

If you want to set up automated SMS alerts via Make.com:

1. Go to [Make.com](https://www.make.com/) and sign up
2. Create a new scenario
3. Add an Instant Trigger → "Webhooks" → "Custom webhook"
4. Copy the webhook URL
5. Paste into `MAKE_WEBHOOK_URL` in `.env`

**If you don't need webhooks yet:** Leave `MAKE_WEBHOOK_URL` commented out or empty for now

---

**⚠️ Security Reminder:** 
- ❌ Never share your `.env` file or credentials
- ❌ Never commit `.env` to Git
- ❌ Never post your keys in forums or GitHub issues
- ✅ Treat these like passwords - keep them secret

---

## 🚀 Running the Project

### Step 7: Start the Backend Server

Make sure your virtual environment is activated (you should see `(venv)` in terminal).

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ Backend is now running at `http://127.0.0.1:8000`

**To stop the server:** Press `Ctrl + C`

### Step 8: Start the Frontend Server

Open a **new terminal window/tab** (keep the backend running):

**Windows:**
- Press `Ctrl + Shift + T` (in most terminals) OR
- Open a new Command Prompt/PowerShell window
- Navigate to the project folder: `cd c:\Users\...\wildtrack`

**macOS/Linux:**
- Press `Cmd + T` (in Terminal)

Navigate to the frontend folder and start a simple HTTP server:

```bash
cd frontend
python -m http.server 5500
```

**Expected output:**
```
Serving HTTP on 127.0.0.1 port 5500 (http://127.0.0.1:5500/) ...
```

✅ Frontend is now running at `http://127.0.0.1:5500`

### Step 9: Access the Application

Open your web browser and visit:

- **Home Page:** http://127.0.0.1:5500
- **Animals Page:** http://127.0.0.1:5500/animals.html
- **Map Page:** http://127.0.0.1:5500/map.html

---

## � Docker & Azure Container Registry

Docker allows you to package your entire application into a container that runs the same way everywhere. Azure Container Registry (ACR) lets you store and manage these Docker images in the cloud.

### Part 1: Build and Test Docker Image Locally

#### Step D1: Install Docker

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. After installation, verify it works:
   ```bash
   docker --version
   ```
3. Start Docker Desktop (important - it must be running in background)

#### Step D2: Build Docker Image

Make sure you're in the root directory of the wildtrack project:

```bash
docker build -t wildtrack:latest .
```

**What this does:**
- Reads the `Dockerfile` in your project
- Creates a Docker image named `wildtrack` with tag `latest`
- This image contains your entire application with Python, dependencies, and code

**Expected output:**
```
Successfully built abc123def456
Successfully tagged wildtrack:latest
```

#### Step D3: Test Docker Image Locally

Run the Docker container on your machine:

```bash
docker run -p 8000:8000 -e PREDICTION_URL="your-prediction-url" -e PREDICTION_KEY="your-key" -e AZURE_LANGUAGE_ENDPOINT="your-endpoint" -e AZURE_LANGUAGE_KEY="your-key" -e PROJECT_NAME="your-project" -e DEPLOYMENT_NAME="prod" wildtrack:latest
```

**Or use a simpler method with .env file:**

```bash
docker run --env-file .env -p 8000:8000 wildtrack:latest
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Backend is running in Docker at http://127.0.0.1:8000

**To stop:** Press `Ctrl + C`

#### Step D4: Verify Docker Container

Open a new terminal and check the running container:

```bash
docker ps
```

**Example output:**
```
CONTAINER ID   IMAGE              STATUS
a1b2c3d4e5f6   wildtrack:latest   Up 2 minutes
```

---

### Part 2: Push to Azure Container Registry

#### Step D5: Create Azure Container Registry

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "Container Registries"
3. Click "Create"
4. Fill in:
   - **Resource group:** `wildtrack-resources`
   - **Registry name:** `wildtrackregistry` (must be lowercase, no hyphens)
   - **Location:** Same as your other resources
   - **SKU:** `Basic` (cheapest option for testing)
5. Click "Review + create" → "Create"

**Wait for deployment to complete** (usually 2-3 minutes)

#### Step D6: Get ACR Credentials

1. Go to your newly created Container Registry
2. Click "Access keys" (left sidebar)
3. Note down and save these values:
   - **Login server:** (e.g., `wildtrackregistry.azurecr.io`)
   - **Username:** (your registry name)
   - **Password:** Copy this

**Example:**
```
Login server: wildtrackregistry.azurecr.io
Username: wildtrackregistry
Password: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

#### Step D7: Login to ACR from Docker

```bash
docker login wildtrackregistry.azurecr.io
```

When prompted:
- **Username:** `wildtrackregistry` (from Step D6)
- **Password:** Paste your password (from Step D6)

**Expected output:**
```
Login Succeeded
```

#### Step D8: Tag Docker Image for ACR

Before pushing to ACR, you need to tag your image with the registry name:

```bash
docker tag wildtrack:latest wildtrackregistry.azurecr.io/wildtrack:latest
```

**What this does:**
- Creates a new tag pointing to the same image
- Adds your ACR registry address as a prefix
- `latest` is the version tag

#### Step D9: Push Image to ACR

Now push your tagged image to Azure Container Registry:

```bash
docker push wildtrackregistry.azurecr.io/wildtrack:latest
```

**Expected output:**
```
The push refers to repository [wildtrackregistry.azurecr.io/wildtrack]
latest: digest: sha256:abc123def456... size: 5678
```

✅ Your image is now in Azure Container Registry!

**To verify in Azure Portal:**
1. Go to your Container Registry
2. Click "Repositories" (left sidebar)
3. You should see `wildtrack` listed with tag `latest`

---

### Part 3: Deploy from ACR to Azure Container Instances (ACI)

Azure Container Instances (ACI) is the easiest way to run your Docker container in the cloud.

#### Step D10: Create Container Instance

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "Container Instances"
3. Click "Create"
4. Fill in:
   - **Resource group:** `wildtrack-resources`
   - **Container name:** `wildtrack-app`
   - **Image source:** Select "Azure Container Registry"
   - **Registry:** `wildtrackregistry`
   - **Image:** `wildtrack`
   - **Image tag:** `latest`
   - **OS type:** `Linux`

5. Click "Next: Ports"
6. Fill in:
   - **Port:** `8000`
   - **Protocol:** `TCP`
   - **DNS label:** `wildtrack-app` (creates a public URL)

7. Click "Next: Environment variables"
8. Add your environment variables:
   - **PREDICTION_URL:** (from .env)
   - **PREDICTION_KEY:** (from .env)
   - **AZURE_LANGUAGE_ENDPOINT:** (from .env)
   - **AZURE_LANGUAGE_KEY:** (from .env)
   - **PROJECT_NAME:** (from .env)
   - **DEPLOYMENT_NAME:** (from .env)

9. Click "Review + create" → "Create"

**Wait for deployment** (usually 3-5 minutes)

#### Step D11: Access Your Deployed Application

1. Go to your Container Instance
2. Look for **FQDN** (Fully Qualified Domain Name)
3. Your app is accessible at: `http://[FQDN]:8000`

**Example:** `http://wildtrack-app.eastus.azurecontainers.io:8000`

✅ Your WildTrack API is now running in the cloud!

#### Step D12: Test the Deployed API

```bash
curl http://wildtrack-app.eastus.azurecontainers.io:8000/api/health
```

**Expected response:**
```json
{
  "message": "WildTrack API running"
}
```

---

### Part 4: Deploy to Azure App Service (Alternative)

If you prefer auto-scaling and more features, use Azure App Service:

#### Step D13: Deploy Using Azure App Service

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "App Services"
3. Click "Create"
4. Fill in:
   - **Resource group:** `wildtrack-resources`
   - **Name:** `wildtrack-api`
   - **Publish:** `Docker Container`
   - **Operating System:** `Linux`
   - **Region:** Same as other resources

5. Click "Next: Docker"
6. Fill in:
   - **Image Source:** `Azure Container Registry`
   - **Registry:** `wildtrackregistry`
   - **Image:** `wildtrack`
   - **Tag:** `latest`

7. Click "Review + create" → "Create"

#### Step D14: Configure Environment Variables in App Service

1. Go to your App Service
2. Click "Configuration" (left sidebar)
3. Click "New application settings" and add:
   - `PREDICTION_URL` = your value
   - `PREDICTION_KEY` = your value
   - `AZURE_LANGUAGE_ENDPOINT` = your value
   - `AZURE_LANGUAGE_KEY` = your value
   - `PROJECT_NAME` = your value
   - `DEPLOYMENT_NAME` = your value

4. Click "Save"

#### Step D15: Access App Service

Your app will be available at:
```
https://wildtrack-api.azurewebsites.net
```

---

## �📁 Project Structure

```
wildtrack/
├── README.md                      # This file
├── requirements.txt               # Python dependencies
├── Dockerfile                     # Docker configuration
├── .env                          # Environment variables (create this)
├── .gitignore                    # Git ignore file
│
├── main.py                       # Entry point for WSGI servers
│
├── camera.py                     # Camera integration (optional)
│
├── app/                          # Backend application
│   ├── __init__.py
│   ├── main.py                   # FastAPI app with routes
│   ├── config.py                 # Configuration settings
│   │
│   ├── services/                 # Business logic
│   │   ├── __init__.py
│   │   ├── vision.py             # Azure Vision API integration
│   │   ├── chatbot.py            # Azure Language QA integration
│   │   └── webhook.py            # Webhook sender
│   │
│   └── utils/                    # Helper functions
│       ├── __init__.py
│       └── parser.py             # Parse detection results
│
└── frontend/                     # Frontend files (served at port 5500)
    ├── index.html                # Home page with hero slider
    ├── animals.html              # Animals information page
    ├── map.html                  # Map page
    │
    ├── css/
    │   └── style.css             # Shared styles for all pages
    │
    ├── js/
    │   ├── home.js               # Hero slider logic
    │   ├── chat-widget.js        # Chat widget (embedded in all pages)
    │   └── api.js                # API communication functions
    │
    └── assets/                   # Images and other assets
```

---

## 🔗 API Endpoints

### 1. Health Check
Check if the backend is running.

```
GET http://127.0.0.1:8000/api/health
```

**Response:**
```json
{
  "message": "WildTrack API running"
}
```

**How to test:**
- Open your browser and visit the URL, or
- Use curl: `curl http://127.0.0.1:8000/api/health`

---

### 2. Upload Image & Detect Animals
Send an image to detect animals.

```
POST http://127.0.0.1:8000/detect
```

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Image file

**Response:**
```json
{
  "status": "success",
  "alerts": [
    {
      "animal_type": "elephant",
      "confidence": 0.95,
      "timestamp": "2024-05-20T10:30:00"
    }
  ]
}
```

**How to test using curl:**
```bash
curl -X POST -F "file=@image.jpg" http://127.0.0.1:8000/detect
```

---

### 3. Get Latest Alerts
Retrieve the latest detected animals.

```
GET http://127.0.0.1:8000/alerts
```

**Response:**
```json
{
  "status": "success",
  "alerts": [
    {
      "animal_type": "lion",
      "confidence": 0.92,
      "timestamp": "2024-05-20T10:25:00"
    }
  ]
}
```

**How to test:**
- Open your browser and visit the URL, or
- Use curl: `curl http://127.0.0.1:8000/alerts`

---

### 4. Ask the Chatbot a Question
Send a question about animals.

```
POST http://127.0.0.1:8000/chat
```

**Request:**
```json
{
  "message": "What do elephants eat?"
}
```

**Response:**
```json
{
  "status": "success",
  "answer": "Elephants are herbivores and eat grasses, leaves, bark, and fruits..."
}
```

**How to test using curl:**
```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What do elephants eat?"}'
```

---

## 🌐 Frontend Pages

### Home Page (`index.html`)
- **URL:** http://127.0.0.1:5500
- **Features:**
  - Hero image slider with auto-play
  - Previous/Next navigation arrows
  - Dot pagination indicators
  - Embedded chat widget
  - Responsive design

### Animals Page (`animals.html`)
- **URL:** http://127.0.0.1:5500/animals.html
- **Features:**
  - Information about different animals
  - Consistent styling with home page
  - Embedded chat widget

### Map Page (`map.html`)
- **URL:** http://127.0.0.1:5500/map.html
- **Features:**
  - Interactive map or location display
  - Embedded chat widget

### Chat Widget
- Available on all pages
- Allows users to ask questions about animals
- Uses the backend `/chat` endpoint

---

## 🆘 Troubleshooting

### Issue 1: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
1. Make sure virtual environment is activated: `(venv)` should be visible in terminal
2. Reinstall dependencies: `pip install -r requirements.txt`

---

### Issue 2: "Address already in use" on port 8000 or 5500

**Solution:**
- Windows:
  ```bash
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  ```
- macOS/Linux:
  ```bash
  lsof -i :8000
  kill -9 <PID>
  ```

---

### Issue 3: Frontend can't connect to backend (CORS error)

**Solution:**
- Make sure backend is running on `http://127.0.0.1:8000`
- Make sure frontend is running on `http://127.0.0.1:5500`
- Check browser console (F12) for specific error messages
- Verify `.env` file exists and has correct Azure credentials

---

### Issue 4: "Environmental variable not found" or Azure connection errors

**Solution:**
1. Verify `.env` file is in the root directory (same level as `main.py`)
2. Check that all required variables are set
3. Restart the backend server after updating `.env`
4. Verify Azure credentials are correct and have appropriate permissions

---

### Issue 5: Image upload returns error

**Solution:**
- Make sure you're uploading a valid image file (JPG, PNG, etc.)
- Check that Azure Custom Vision credentials are correct
- Verify the prediction URL and key are valid
- Check backend console for error details

---

### Issue 6: Virtual environment won't activate

**Windows (PowerShell):**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

---

### Issue 7: Python command not found

**Solution:**
- On Windows, try `python3` instead of `python`
- Make sure Python is installed: `python --version`
- Add Python to system PATH if needed

---

### Issue 8: Docker "command not found" or Docker Desktop not running

**Solution:**
1. Make sure Docker Desktop is installed: [Download Docker](https://www.docker.com/products/docker-desktop/)
2. Start Docker Desktop application (it runs in background)
3. Verify Docker is running:
   ```bash
   docker --version
   ```
4. If still failing, restart Docker Desktop

---

### Issue 9: Docker build fails with "Dockerfile not found"

**Solution:**
1. Make sure you're in the root directory of the project:
   ```bash
   cd c:\Users\...\wildtrack
   ```
2. Verify `Dockerfile` exists in that directory:
   ```bash
   ls Dockerfile
   # or on Windows:
   dir Dockerfile
   ```
3. If Dockerfile doesn't exist, check the project structure or create one

---

### Issue 10: Docker push fails with "denied: requesting access to the resource denied"

**Solution:**
1. Make sure you're logged in to your container registry:
   ```bash
   docker login wildtrackregistry.azurecr.io
   ```
2. Verify username and password are correct (from Step D6)
3. Make sure image is tagged correctly:
   ```bash
   docker tag wildtrack:latest wildtrackregistry.azurecr.io/wildtrack:latest
   ```
4. Push again:
   ```bash
   docker push wildtrackregistry.azurecr.io/wildtrack:latest
   ```

---

### Issue 11: Container Instance deployment fails

**Solution:**
1. Verify image is successfully in Azure Container Registry
2. Check that environment variables are correctly set
3. Verify your Azure credentials in the environment variables section
4. Look at Container Instance logs in Azure Portal:
   - Go to your Container Instance
   - Click "Containers" → "Logs"
   - Review error messages

---

## 💡 Development Tips

### Tip 1: Debugging Backend
Add print statements in your code:
```python
print(f"Received image: {image}")
print(f"Detection result: {result}")
```
Output appears in the terminal where backend is running.

### Tip 2: Debugging Frontend
Open browser DevTools:
1. Right-click → "Inspect" or Press `F12`
2. Check "Console" tab for JavaScript errors
3. Check "Network" tab to see API calls

### Tip 3: Testing API Endpoints
Use an API testing tool:
- **Postman** - https://www.postman.com/downloads/
- **Thunder Client** - VS Code extension
- **curl** - Command line tool (built into most systems)

### Tip 4: Hot Reload
The backend runs with `--reload` flag, so changes to Python code automatically refresh the server (no restart needed).

### Tip 5: Docker Useful Commands
Helpful Docker commands for development and testing:

```bash
# List all images on your machine
docker images

# List all running containers
docker ps

# List all containers (including stopped ones)
docker ps -a

# View logs from a running container
docker logs <container-id>

# Stop a running container
docker stop <container-id>

# Remove a container
docker rm <container-id>

# Remove an image
docker rmi wildtrack:latest

# Run container in background (detached mode)
docker run -d -p 8000:8000 --env-file .env wildtrack:latest

# View resource usage of containers
docker stats
```

### Tip 6: Add More Animals
To detect more animals:
1. Go to Azure Custom Vision
2. Add more training images
3. Train a new iteration
4. Update `PREDICTION_URL` in `.env`

### Tip 7: Production Deployment
To deploy to production:
1. Use Docker with Azure Container Registry (see Docker section above)
2. Use cloud platforms: Azure Container Instances, App Service, AWS, Heroku, Railway, etc.
3. Use environment variables for secrets (never hardcode)
4. Update CORS origins to your domain
5. Use HTTPS/TLS for secure communication
6. Set up monitoring and logging in Azure Portal

---

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Read error messages carefully** - they usually tell you what's wrong
3. **Check Azure service status** - https://status.azure.com/
4. **Verify environment variables** - `PREDICTION_KEY`, `AZURE_LANGUAGE_KEY`, etc.
5. **Review console output** - Backend prints helpful debug info

---

## 🎓 Next Steps

After successfully running the project:

1. **Customize the UI** - Edit HTML/CSS in the `frontend/` folder
2. **Train your own model** - Add more animals to Azure Custom Vision
3. **Extend the chatbot** - Add more Q&A pairs to Azure Language
4. **Add database support** - Store alerts in a database instead of memory
5. **Deploy to cloud** - Use Docker to deploy to Azure, AWS, etc.
6. **Add authentication** - Secure your API with API keys or OAuth
7. **Implement real-time updates** - Use WebSockets instead of polling

---

## 📜 License

This project is provided as-is for educational and development purposes.

---

## 🙌 Happy Coding!

Good luck with WildTrack! Feel free to experiment and customize the application to your needs. 🐘🦁🐯

---

**Last Updated:** May 20, 2024
**Version:** 1.0
**Difficulty Level:** Beginner to Intermediate
