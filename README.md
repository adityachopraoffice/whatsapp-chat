# WhatsApp Chat - Shopify App

A Shopify app built with Remix and Prisma featuring a WhatsApp chat button theme app extension.

## Features

- **WhatsApp Chat Extension**: Embeddable floating WhatsApp button for Shopify storefronts.
- **Merchant Admin Settings**: Configure WhatsApp phone number, default greeting message, display position, and styling from the Shopify admin.
- **Embedded Admin App**: Built with Shopify Polaris and Remix.
- **Prisma Session Storage**: Persistent session and settings storage.

## Tech Stack

- [Remix](https://remix.run/)
- [Shopify App Remix](https://shopify.dev/docs/api/shopify-app-remix)
- [Shopify Polaris](https://polaris.shopify.com/)
- [Prisma](https://www.prisma.io/)
- [Shopify Theme App Extensions](https://shopify.dev/docs/apps/online-store/theme-app-extensions)

## Getting Started

### Prerequisites

- Node.js (v20+ or v22+)
- Shopify Partner account & development store
- Shopify CLI

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd whatsapp-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` and fill in your Shopify App credentials:
   ```bash
   cp .env.example .env
   ```

4. Initialize database:
   ```bash
   npm run setup
   ```

5. Run local development:
   ```bash
   npm run dev
   ```
