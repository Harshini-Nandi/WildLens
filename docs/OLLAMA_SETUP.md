# Ollama Setup Guide for WildBuddy

WildBuddy is powered by **open-weight, locally hosted AI models** run via [Ollama](https://ollama.com). No API keys, cloud subscriptions, or external data tracking are ever required.

---

## 1. Install Ollama

### On Windows
1. Download the Windows installer from [ollama.com/download/windows](https://ollama.com/download/windows).
2. Run the installer `OllamaSetup.exe` and follow the setup wizard.
3. Once installed, Ollama runs automatically in the system tray.

### On macOS / Linux
- **macOS:** Download from [ollama.com/download/mac](https://ollama.com/download/mac).
- **Linux:** Run `curl -fsSL https://ollama.com/install.sh | sh`.

Verify installation in PowerShell or terminal:
```bash
ollama --version
```

---

## 2. Recommended Open-Weight Models

### Vision-Language Models (For Nature & Specimen Identification)

| Model Name | Size | Recommended VRAM / RAM | Description |
| :--- | :--- | :--- | :--- |
| **`gemma3`** *(Recommended)* | ~3.3 GB | 6 GB - 8 GB | Google's newest open-weight multimodal model with excellent botanical understanding. |
| **`llava`** | ~4.7 GB | 8 GB | High-accuracy open-source vision assistant based on LLaMA. |
| **`moondream`** | ~1.7 GB | 4 GB | Ultra-lightweight vision model, ideal for budget laptops or integrated GPUs. |
| **`minicpm-v`** | ~5.5 GB | 8 GB | High-resolution image reasoning for intricate leaf veins and insect patterns. |

Pull your chosen vision model in terminal:
```bash
# Pull Google Gemma 3
ollama pull gemma3

# Or pull lightweight Moondream
ollama pull moondream
```

### Text Models (For Outdoor Missions & Challenges)

| Model Name | Size | Recommended RAM | Description |
| :--- | :--- | :--- | :--- |
| **`gemma3`** *(Recommended)* | Shared | 8 GB | Can serve as both vision and text model simultaneously. |
| **`llama3.2`** | ~2.0 GB | 4 GB | Fast, creative outdoor mission generator from Meta. |
| **`mistral`** | ~4.1 GB | 8 GB | Eloquent nature challenges and mindfulness prompts. |

Pull your text model:
```bash
ollama pull gemma3
```

---

## 3. Start the Ollama Service

Make sure the local Ollama daemon is running:
```bash
ollama serve
```

By default, Ollama listens at `http://127.0.0.1:11434`.

Test connectivity in PowerShell:
```powershell
curl http://127.0.0.1:11434/api/tags
```

---

## 4. Connecting WildBuddy to Ollama

In `server/.env`:
```env
PORT=3001
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_VISION_MODEL=gemma3
OLLAMA_TEXT_MODEL=gemma3
```

WildBuddy automatically monitors the connection via `GET /api/health`. You can also dynamically reconfigure the model names and host in the **Settings** view in the web app!

---

## 5. Offline Behavior

Once you have run `ollama pull <model>` on your computer, the model weights reside on your hard drive.
You can take your laptop outdoors with zero WiFi, launch WildBuddy, and run full AI vision inference offline!
