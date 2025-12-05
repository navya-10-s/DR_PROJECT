import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay
import os
import matplotlib.pyplot as plt
import numpy as np
print("start")
# ✅ Paths
test_dir = "model"  # Update this path to your test images
model_path = "saved_images/retina.pth"

# ✅ Transforms (no augmentation)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ✅ Dataset & Loader
test_dataset = datasets.ImageFolder(test_dir, transform=transform)
test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

# ✅ Model Setup
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
model.fc = nn.Sequential(
    nn.Linear(model.fc.in_features, 512),
    nn.ReLU(),
    nn.Dropout(0.5),
    nn.Linear(512, len(test_dataset.classes))
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.load_state_dict(torch.load(model_path))
model = model.to(device)
model.eval()

# ✅ Inference with Progress Tracking
all_preds = []
all_labels = []

with torch.no_grad():
    total_batches = len(test_loader)
    for batch_idx, (images, labels) in enumerate(test_loader):
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        _, preds = torch.max(outputs, 1)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

        progress = (batch_idx + 1) / total_batches * 100
        print(f"🧪 Test Progress: {progress:.1f}% ({batch_idx + 1}/{total_batches} batches)")

# ✅ Overall Accuracy
total_correct = np.sum(np.array(all_preds) == np.array(all_labels))
total_samples = len(all_labels)
test_accuracy = total_correct / total_samples * 100
print(f"\n✅ Overall Test Accuracy: {test_accuracy:.2f}%")

# ✅ Per-Class Accuracy
class_correct = [0] * len(test_dataset.classes)
class_total = [0] * len(test_dataset.classes)

for label, pred in zip(all_labels, all_preds):
    class_total[label] += 1
    if label == pred:
        class_correct[label] += 1

print("\n📊 Per-Class Accuracy:")
for i, class_name in enumerate(test_dataset.classes):
    accuracy = 100 * class_correct[i] / class_total[i] if class_total[i] > 0 else 0
    print(f"   {class_name}: {accuracy:.2f}% ({class_correct[i]}/{class_total[i]})")

# ✅ Classification Report
print("\n📋 Classification Report:")
print(classification_report(all_labels, all_preds, target_names=test_dataset.classes))

# ✅ Confusion Matrix
cm = confusion_matrix(all_labels, all_preds)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=test_dataset.classes)
disp.plot(cmap=plt.cm.Blues, xticks_rotation=45)
plt.title("Test Confusion Matrix")
plt.tight_layout()
plt.show()








