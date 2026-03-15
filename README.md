# 🚀 BizBoost AI — बोल के बेचो

> **Voice-first AI platform for Indian small businesses**  
> Speak in Hindi → Get a professional WhatsApp catalog post instantly!

🌐 **Live Demo:** [https://main.d2ffe75oiuyqgr.amplifyapp.com](https://main.d2ffe75oiuyqgr.amplifyapp.com)

---

## 🤔 What is BizBoost AI?

India has 60 million+ small business owners. Most of them:
- Don't know English well
- Can't afford a social media manager
- Struggle to create professional product posts

**BizBoost AI solves this.** A chai wala, a saree shop owner, a street food vendor — anyone can just **speak in Hindi** and get a beautiful, ready-to-share WhatsApp catalog post in seconds. No typing. No English. No tech skills needed.

---

## ✨ Features

- 🎤 **Voice Input** — Speak in Hindi, browser transcribes it instantly
- 🤖 **AI Content Generation** — Amazon Nova Lite generates bilingual posts
- 📱 **WhatsApp Ready** — Hindi + English post with emojis, formatted perfectly
- 📋 **One-click Copy** — Copy to WhatsApp in one tap
- 💾 **Auto Save** — Every post saved to DynamoDB automatically
- 📱 **Mobile Friendly** — Works on any smartphone browser

---

## 🛠️ Tech Stack — 100% AWS Native

```
Voice Input (Browser Speech API)
         ↓
   Flask API (app.py)
         ↓
Amazon Bedrock — Nova Lite  ← AI content generation
         ↓
   Amazon DynamoDB          ← stores every post
         ↓
AWS Lambda + API Gateway    ← serverless backend
         ↓
    AWS Amplify             ← frontend hosting
```

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, Flask |
| AI Model | Amazon Bedrock (Nova Lite) |
| Database | Amazon DynamoDB |
| Serverless | AWS Lambda |
| API | AWS API Gateway |
| Hosting | AWS Amplify |

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.13+
- AWS account with Bedrock, DynamoDB access
- AWS CLI configured (`aws configure`)

### Step 1 — Clone the repo
```bash
git clone https://github.com/git791/BizBoost-AI.git
cd BizBoost-AI
```

### Step 2 — Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

### Step 3 — Install dependencies
```bash
pip install flask flask-cors boto3
```

### Step 4 — Set up DynamoDB table
1. Go to AWS Console → DynamoDB
2. Create table named `bizboost-posts`
3. Partition key: `post_id` (String)
4. Region: `us-east-1`

### Step 5 — Run the backend
```bash
python app.py
```
You should see:
```
Running on http://127.0.0.1:5000
```

### Step 6 — Open the frontend
Just double-click `index.html` in your file explorer — it opens in your browser!

### Step 7 — Test it!
1. Click the 🎤 microphone button
2. Speak in Hindi — e.g. *"पनीर टिक्का 200 रुपीस, बहुत टेस्टी है"*
3. Click **Generate Catalog Post**
4. See your bilingual WhatsApp post appear!
5. Click **Copy to WhatsApp** and share!

---

## ☁️ Deploying to AWS (What We Did)

### Backend — AWS SAM + Lambda
```bash
# Install AWS SAM CLI from:
# https://github.com/aws/aws-sam-cli/releases/latest/download/AWS_SAM_CLI_64_PY3.msi

sam build --use-container
sam deploy --guided
```
SAM automatically creates:
- ✅ Lambda function
- ✅ API Gateway
- ✅ CloudFormation stack

### Frontend — AWS Amplify
1. Push code to GitHub
2. Go to AWS Amplify Console
3. Connect GitHub repo
4. Select `main` branch
5. Deploy — done! Live URL in 3 minutes ✅

---

## 📁 Project Structure

```
BizBoost-AI/
├── index.html          # Frontend UI (voice input, results display)
├── app.py              # Flask backend (connects to Nova + DynamoDB)
├── bizboost.py         # Core pipeline (voice → Nova → DynamoDB)
├── nova_test.py        # Amazon Bedrock Nova connection test
├── transcribe_test.py  # Voice recognition test
├── template.yaml       # AWS SAM deployment template
├── requirements.txt    # Python dependencies
└── README.md           # This file!
```

---

## 🗺️ Roadmap

### Phase 1 — MVP (Built ✅)
- Hindi voice input
- Nova AI content generation
- WhatsApp post output
- DynamoDB storage
- Live deployment on AWS

### Phase 2 — Coming Soon
- 🌍 Tamil, Telugu, Bengali, Marathi support
- 📸 Smart Photo Enhancer (Amazon Rekognition)
- 📲 Direct WhatsApp + Instagram publishing
- 🎉 Festival content auto-scheduler (Diwali, Holi, Eid)

### Phase 3 — Future
- 🤖 Customer engagement bot (24/7 query handling)
- 📊 Analytics dashboard
- 💳 Subscription tiers (Free / Pro / Premium)

---

## 👥 Team — Context Coders

| Name | GitHub | LinkedIn |
|------|--------|----------|
| Mohammed Ayaan Adil Ahmed | [@git791](https://github.com/git791) | [LinkedIn](https://www.linkedin.com/in/mohammed-ayaan-adil-ahmed-540868311/) |
| Bibi Sufiya Shariff | [@Suf78](https://github.com/Suf78) | [LinkedIn](https://www.linkedin.com/in/sufiya-shariff-b8a398337/) |

---

## 📄 License

MIT License — feel free to build on this for Indian small businesses! 🇮🇳

---

<div align="center">
  Made with ❤️ for India's 60 million small business owners<br>
  <b>बोल के बेचो — Speak it. Sell it.</b>
</div>
