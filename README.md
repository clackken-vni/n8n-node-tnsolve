# n8n-nodes-tnsolve

n8n custom node for TN Solve Video Automation platform.

## Description

This n8n custom node enables automation of video creation on the TN Solve platform (https://tnsolve.com/), supporting:

- **6 Video Modes**: movie, character_preservation, scene_consistency, my_subject, custom_character, custom_scenes
- **Free Model**: veo3_fast_lower (0 gems per 8 seconds)
- **Image Upload**: Support for subject images, character references, and scene uploads
- **Full API Integration**: Create videos, check status, list videos, manage user account

## Installation

### Local Development

```bash
# Clone and install dependencies
cd n8n-nodes-tnsolve
npm install

# Build the node
npm run build

# Link to n8n (for development)
cd ~/.n8n/nodes/
npm link /path/to/n8n-nodes-tnsolve
```

### For n8n Cloud

Package and upload the `dist/` folder according to n8n's custom nodes documentation.

## Credentials

### TNSolve API Credential

- **access_token**: Session access token from browser cookies
- **csrf_token**: CSRF token from browser cookies

To obtain credentials:
1. Log in to https://tnsolve.com/vi
2. Open Developer Tools → Application → Cookies
3. Copy `access_token` and `csrf_token` values

## Operations

### 1. Create Video (createVideo)
Create a new video with specified parameters.

**Parameters:**
- Title (required): Video title
- Script/Prompt (required): Video description
- Video Mode (required): 6 options (movie, character_preservation, etc.)
- Model (required): Default veo3_fast_lower (FREE)
- Frame Rate (required): horizontal (16:9) or vertical (9:16)
- Video Style (optional): general, cinematic, animation, etc.
- Duration (required): 1-120 (unit: 8 seconds)
- Mode-specific fields: subjectImage, characterImages, characterPrompt, etc.

### 2. Upload Image (uploadImage)
Upload an image to TN Solve storage.

**Parameters:**
- File (required): Image file to upload

### 3. Get Video Status (getVideoStatus)
Check the status of a created video.

**Parameters:**
- Video ID (required): The video ID from createVideo response

### 4. List Videos (listVideos)
List all videos for the authenticated user.

### 5. Get User Info (getUserInfo)
Get authenticated user information including credit balance.

## Usage Example

```json
{
  "nodes": [
    {
      "parameters": {
        "title": "My AI Video",
        "script": "A beautiful sunset over the ocean",
        "videoMode": "movie",
        "frameRate": "horizontal",
        "videoDuration": "1"
      },
      "name": "Create TN Solve Video",
      "type": "n8n-nodes-tnsolve.Tnsolve",
      "typeVersion": 1,
      "position": [250, 300],
      "credentials": {
        "tnsolveApi": {
          "id": "your-credential-id",
          "name": "TN Solve Account"
        }
      }
    }
  ]
}
```

## Supported Video Modes

| Mode | Vietnamese | Description | Image Required |
|------|------------|-------------|----------------|
| movie | Làm phim | Standard video creation | ❌ No |
| character_preservation | Đồng bộ nhân vật | Maintain character consistency | ❌ No |
| scene_consistency | Đồng bộ cảnh quay | Maintain scene consistency | ❌ No |
| my_subject | Chủ thể của tôi | Custom subject image | ✅ 1 image |
| custom_character | Nhân vật tùy chỉnh | Create custom character | ✅ 1+ images |
| custom_scenes | Bối cảnh tùy chỉnh | Custom scene prompts | ❌ No |

## License

MIT
