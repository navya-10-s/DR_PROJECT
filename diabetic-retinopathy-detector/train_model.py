print("start")
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader, Subset
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import os
import matplotlib.pyplot as plt
import numpy as np

print("start")

# ✅ Paths
data_dir = "dataset"
save_dir = "saved_images"
save_path = os.path.join(save_dir, "retina.pth")
log_path = os.path.join(save_dir, "train4_log.txt")
os.makedirs(save_dir, exist_ok=True)

# ✅ Transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ✅ Dataset
dataset = datasets.ImageFolder(data_dir, transform=transform)
if len(dataset) == 0:
    raise ValueError("❌ No images found in dataset.")
print(f"✅ Total images: {len(dataset)}")
print(f"✅ Classes: {dataset.classes}")

# ✅ Stratified Split
targets = [sample[1] for sample in dataset.samples]
sss = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, val_idx = next(sss.split(np.zeros(len(targets)), targets))
train_dataset = Subset(dataset, train_idx)
val_dataset = Subset(dataset, val_idx)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32)

# ✅ Model
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
model.fc = nn.Sequential(
    nn.Linear(model.fc.in_features, 512),
    nn.ReLU(),
    nn.Dropout(0.5),
    nn.Linear(512, len(dataset.classes))
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# ✅ Class Weights
train_targets = [dataset.samples[i][1] for i in train_idx]
class_weights = compute_class_weight('balanced', classes=np.unique(train_targets), y=train_targets)
weights = torch.tensor(class_weights, dtype=torch.float).to(device)
criterion = nn.CrossEntropyLoss(weight=weights)

# ✅ Optimizer & Scheduler
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4, weight_decay=1e-5)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=2, factor=0.5)

# ✅ Accuracy Function
def calculate_accuracy(outputs, labels):
    _, preds = torch.max(outputs, 1)
    correct = (preds == labels).sum().item()
    total = labels.size(0)
    return correct, total

# ✅ Training Loop
best_val_loss = float('inf')
patience = 8
trigger_times = 0

for epoch in range(20):
    model.train()
    running_loss = 0.0
    correct_preds = 0
    total_preds = 0
    print(f"\n🔄 Epoch {epoch+1} starting...")

    for batch_idx, (images, labels) in enumerate(train_loader):
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        correct, total = calculate_accuracy(outputs, labels)
        correct_preds += correct
        total_preds += total

        progress = (batch_idx + 1) / len(train_loader) * 100
        if batch_idx % 5 == 0:
            print(f"   Batch {batch_idx} ({progress:.1f}%) Loss: {loss.item():.4f}")

    train_accuracy = (correct_preds / total_preds) * 100
    print(f"✅ Epoch {epoch+1} Train Loss: {running_loss:.4f}, Accuracy: {train_accuracy:.2f}%")

    # ✅ Validation
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()
            correct, total = calculate_accuracy(outputs, labels)
            val_correct += correct
            val_total += total

    val_accuracy = (val_correct / val_total) * 100
    print(f"📊 Validation Loss: {val_loss:.4f}, Accuracy: {val_accuracy:.2f}%")
    scheduler.step(val_loss)

    # ✅ Logging
    with open(log_path, "a") as f:
        f.write(f"Epoch {epoch+1}: Train Loss={running_loss:.4f}, Accuracy={train_accuracy:.2f}%\n")
        f.write(f"Validation Loss={val_loss:.4f}, Accuracy={val_accuracy:.2f}%\n\n")

    # ✅ Early Stopping
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        trigger_times = 0
        torch.save(model.state_dict(), save_path)
        print("💾 Model improved and saved.")
    else:
        trigger_times += 1
        print(f"⏳ No improvement. Early stop counter: {trigger_times}/{patience}")
        if trigger_times >= patience:
            print("🛑 Early stopping triggered.")
            break

# ✅ Confusion Matrix
model.load_state_dict(torch.load(save_path))
model.eval()
all_preds = []
all_labels = []

with torch.no_grad():
    for images, labels in val_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        _, preds = torch.max(outputs, 1)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

cm = confusion_matrix(all_labels, all_preds)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=dataset.classes)
disp.plot(cmap=plt.cm.Blues, xticks_rotation=45)
plt.title("Confusion Matrix")
plt.tight_layout()
plt.show()