# Ephemeral Storage Worker

A Cloudflare Worker for generating temporary URLs to store and retrieve images. This project is designed to enable secure, short-lived storage for workflows, such as relaying images for analysis by GPT-4o, without consuming excessive input tokens (reducing prompt token consumption from about 37k to 1.2k).

## Features
- **Ephemeral Storage**: Images are stored temporarily using Cloudflare KV with a customizable expiration time.
- **Secure Relay**: Temporary URLs ensure secure access to image data for limited durations.
- **Integration-Ready**: Built to seamlessly integrate with workflows using tools like Tines and OpenAI's APIs.

---

## How It Works
1. **Upload an Image**:
   - Send raw image bytes to the `/upload` endpoint.
   - The Worker generates a unique URL with a 1-minute expiration.
2. **Retrieve the Image**:
   - Access the image using the generated URL before it expires.

---

## Repository Structure
```plaintext
ephemeral-storage-worker/
├── src/
│   └── index.ts        # Cloudflare Worker code
├── wrangler.toml       # Configuration for the Worker
├── package.json        # Node.js dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

---

## Setup

### Prerequisites
- **Wrangler CLI**: Install the Cloudflare Workers CLI.
  ```bash
  npm install -g wrangler
  ```
- **Cloudflare Account**: Ensure you have a KV namespace created.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/tyler-tee/ephemeral-image-storage.git
   cd ephemeral-image-storage/ephemeral-storage-worker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `wrangler.toml`:
   - Add your KV namespace `id`:
     ```toml
     [[kv_namespaces]]
     binding = "ephemeral-image-storage"
     id = "your-kv-namespace-id"
     ```

---

## Usage

### Development
Run the Worker locally:
```bash
wrangler dev
```

### Deployment
Publish the Worker to Cloudflare:
```bash
wrangler publish
```

### API Endpoints
1. **`POST /upload`**:
   - Upload an image.
   - Example:
     ```bash
     curl -X POST https://your-worker-url/upload --data-binary @test-image.png
     ```
   - Response:
     ```json
     {
       "url": "/image/{id}",
       "expires": 1698423000
     }
     ```

2. **`GET /image/{id}`**:
   - Retrieve an uploaded image using the provided `id`.
   - Example:
     ```bash
     curl https://your-worker-url/image/{id} --output retrieved-image.png
     ```

---

## License
This project is licensed under the MIT License.
