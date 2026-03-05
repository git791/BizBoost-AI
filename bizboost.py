import boto3
import json
import time
import speech_recognition as sr
import uuid
from datetime import datetime

# AWS Clients
bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("bizboost-posts")

# ─────────────────────────────────────────
# STEP 1: Listen from mic in Hindi
# ─────────────────────────────────────────
def listen_from_mic():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("\n🎤 Speak your product description in Hindi...")
    print("(You have 5 seconds after the beep)\n")

    with mic as source:
        recognizer.adjust_for_ambient_noise(source, duration=1)
        print("🔴 Recording now — SPEAK!")
        audio = recognizer.listen(source, timeout=10, phrase_time_limit=10)

    print("⏳ Transcribing...")
    text = recognizer.recognize_google(audio, language="hi-IN")
    print(f"✅ You said: {text}")
    return text

# ─────────────────────────────────────────
# STEP 2: Generate catalog post via Nova
# ─────────────────────────────────────────
def generate_post(product_description):
    prompt = f"""
You are a content creator for small Indian businesses.
A business owner described their product as: "{product_description}"

Create a professional WhatsApp catalog post in both Hindi and English.
Include: product name, price if mentioned, a catchy description, and 3 emojis.
Keep it short and attractive for customers.
"""
    response = bedrock.invoke_model(
        modelId="amazon.nova-lite-v1:0",
        body=json.dumps({
            "messages": [
                {
                    "role": "user",
                    "content": [{"text": prompt}]
                }
            ]
        })
    )
    result = json.loads(response["body"].read())
    post = result["output"]["message"]["content"][0]["text"]
    print(f"\n✅ Generated Post:\n{post}")
    return post

# ─────────────────────────────────────────
# STEP 3: Save to DynamoDB
# ─────────────────────────────────────────
def save_to_dynamodb(spoken_text, generated_post):
    post_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()

    table.put_item(Item={
        "post_id": post_id,
        "spoken_input": spoken_text,
        "generated_post": generated_post,
        "timestamp": timestamp
    })
    print(f"\n✅ Saved to DynamoDB! ID: {post_id}")
    return post_id

# ─────────────────────────────────────────
# MAIN — Connect everything
# ─────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("🚀 BizBoost AI — Voice to Catalog Generator")
    print("=" * 50)

    # Step 1: Listen
    spoken_text = listen_from_mic()

    # Step 2: Generate
    generated_post = generate_post(spoken_text)

    # Step 3: Save
    post_id = save_to_dynamodb(spoken_text, generated_post)

    print("\n" + "=" * 50)
    print("✅ ALL DONE! Your catalog post is ready!")
    print("=" * 50)
