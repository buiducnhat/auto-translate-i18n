# auto-translate-i18n

Automatically translate i18n JSON files using Google's Gemini AI. This tool helps you maintain multiple language versions of your i18n JSON files by automatically translating missing keys.

## Installation

```bash
npm install -g auto-translate-i18n
```

## Features

- Automatically translates missing keys in i18n JSON files
- Powered by Google's Gemini AI for high-quality translations
- Supports nested JSON structures
- Preserves existing translations
- Rate limiting protection built-in

## Usage

```bash
auto-translate-i18n -k YOUR_GEMINI_API_KEY -s English -d Vietnamese -f en.json -t vi.json -p "Translate in a formal tone, my website is related to finance"
```

### Required Options

| Option | Description |
|--------|-------------|
| `-k, --api-key <key>` | Your Google Gemini API key |
| `-s, --source-lang <lang>` | Source language code (e.g., "en") |
| `-d, --dest-lang <lang>` | Destination language code (e.g., "vi") |
| `-f, --source-file <path>` | Path to source language JSON file |
| `-t, --dest-file <path>` | Path to destination language JSON file |

### Optional Options

| Option | Description |
|--------|-------------|
| `-m, --model <model>` | Gemini model name (default: "gemini-1.5-flash") |
| `-p, --prompt <text>` | Additional context prompt for translation |

### Examples

Basic translation from English to Vietnamese:
```bash
auto-translate-i18n -k YOUR_API_KEY -s English -d Vietnamese -f en.json -t vi.json
```

With custom model and prompt:
```bash
auto-translate-i18n -k YOUR_API_KEY -s English -d Vietnamese -f en.json -t vi.json -m gemini-1.5-pro -p "Translate in a formal tone, my website is related to finance"
```

## Example

Source file (`en.json`):
```json
{
  "welcome": "Welcome to our app",
  "settings": {
    "title": "Settings",
    "theme": "Choose theme"
  }
}
```

After translation (`vi.json`):
```json
{
  "welcome": "Chào mừng đến với ứng dụng của chúng tôi",
  "settings": {
    "title": "Cài đặt",
    "theme": "Chọn chủ đề"
  }
}
```

## Features in Detail

- **Preserves Existing Translations**: Only translates missing keys, keeping existing translations intact
- **Nested JSON Support**: Handles complex nested JSON structures
- **Rate Limiting**: Built-in protection against API rate limits with automatic retries
- **Progress Tracking**: Shows translation progress and final key count
- **Error Handling**: Graceful error handling with informative messages

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
