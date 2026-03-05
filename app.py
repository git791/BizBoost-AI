from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import json
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("bizboost-posts")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    product_input = data.get("text", "")

    if not product_input:
        return jsonify({"error": "No text provided"}), 400

    prompt = f"""
You are a content creator for small Indian businesses.
A business owner described their product as: "{product_input}"

Create a professional WhatsApp catalog post in both Hindi and English.
Include: product name, price if mentioned, a catchy description, and 3 emojis.
Keep it short and attractive for customers.

Format your response exactly like this:
HINDI:
[hindi post here]

ENGLISH:
[english post here]
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
    full_text = result["output"]["message"]["content"][0]["text"]

    # Split Hindi and English
    hindi_post = ""
    english_post = ""

    if "HINDI:" in full_text and "ENGLISH:" in full_text:
        parts = full_text.split("ENGLISH:")
        hindi_post = parts[0].replace("HINDI:", "").strip()
        english_post = parts[1].strip()
    else:
        hindi_post = full_text
        english_post = full_text

    # Save to DynamoDB
    table.put_item(Item={
        "post_id": str(uuid.uuid4()),
        "spoken_input": product_input,
        "generated_post": full_text,
        "timestamp": datetime.utcnow().isoformat()
    })

    return jsonify({
        "hindi": hindi_post,
        "english": english_post
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)