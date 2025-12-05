import torch
import torch.nn as nn
from torchvision import transforms, models
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

# -------------------------------
# Load Classes (same as training)
# -------------------------------
classes = ["No_DR", "Mild", "Moderate", "Severe", "Proliferative_DR"]

# -------------------------------
# Load Model
# -------------------------------
model_path = "saved_images/retina.pth"

model = models.resnet50(weights=None)
model.fc = nn.Sequential(
    nn.Linear(model.fc.in_features, 512),
    nn.ReLU(),
    nn.Dropout(0.5),
    nn.Linear(512, len(classes))
)

model.load_state_dict(torch.load(model_path, map_location="cpu"))
model.eval()

# -------------------------------
# Image Transform
# -------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# -------------------------------
# FastAPI App
# -------------------------------
app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Health Check Route
# -------------------------------
@app.get("/")
def home():
    return {"message": "Backend is running!"}

# -------------------------------
# Prediction API
# -------------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Load image bytes
    img_bytes = await file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # Apply transforms
    img = transform(image).unsqueeze(0)

    # Predict
    with torch.no_grad():
        outputs = model(img)
        probs = torch.softmax(outputs, dim=1)
        confidence, pred = torch.max(probs, 1)

    return {
        "prediction": classes[pred.item()],
        "confidence": float(confidence.item())
    }
