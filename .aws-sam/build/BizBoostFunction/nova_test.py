import boto3
import json

# Connect to Bedrock in us-east-1
client = boto3.client("bedrock-runtime", region_name="us-east-1")

# Your product description (in Hindi!)
product_input = "Yeh special paneer tikka hai, ₹200, bahut tasty"

# The prompt we send to Nova
prompt = f"""
You are a content creator for small Indian businesses.
A business owner described their product as: "{product_input}"

Create a professional WhatsApp catalog post in both Hindi and English.
Include: product name, price, a catchy description, and 3 emojis.
Keep it short and attractive for customers.
"""

# Call Amazon Nova Lite
response = client.invoke_model(
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

# Read and print the response
result = json.loads(response["body"].read())
print(result["output"]["message"]["content"][0]["text"])