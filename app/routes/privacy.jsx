import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h1 style={{ fontSize: '32px', borderBottom: '2px solid #eaeaea', paddingBottom: '10px' }}>
        Privacy Policy for WhatsApp Chat
      </h1>
      <p><strong>Last Updated: November 13, 2026</strong></p>
      
      <p>
        WhatsApp Chat ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your information is collected, used, and shared when you install or use the WhatsApp Chat application in connection with your Shopify-supported store.
      </p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>1. Information We Collect</h2>
      <p>When you install the App, we automatically access certain types of information from your Shopify account to provide our services:</p>
      <ul>
        <li>
          <strong>Store Information:</strong> We collect your Shopify store domain and basic account information necessary to authenticate your account and process billing via Shopify.
        </li>
        <li>
          <strong>App Settings & Configuration:</strong> We store the configuration settings you create within the app (such as your WhatsApp phone number, prefilled greeting message, button styling, colors, size, and screen position) in our database to display the floating chat widget on your storefront.
        </li>
      </ul>
      <p>
        <strong>Note on Customer Data:</strong> WhatsApp Chat <strong>DOES NOT</strong> collect, store, or track any Personal Identifiable Information (PII) from your store's visitors or shoppers. When a customer clicks the WhatsApp button, they are redirected directly to WhatsApp (via wa.me) to converse with your store. No customer conversations or customer details are stored on our servers.
      </p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>2. How We Use Your Information</h2>
      <p>We use the collected information solely to:</p>
      <ul>
        <li>Provide, operate, and maintain the WhatsApp Chat widget on your store.</li>
        <li>Process subscriptions and billing through Shopify's secure Billing API.</li>
        <li>Provide customer support and respond to merchant inquiries.</li>
        <li>Comply with Shopify App Store requirements and applicable data protection regulations.</li>
      </ul>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>3. Sharing Your Information</h2>
      <p>We do not sell, rent, or trade your personal or store information. We only share information with trusted infrastructure providers required to operate the service:</p>
      <ul>
        <li><strong>Infrastructure Providers:</strong> We use secure, industry-standard hosting (Vercel) and database services (Neon PostgreSQL) to host and operate the application securely.</li>
        <li><strong>Legal Compliance:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
      </ul>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>4. Data Retention and Deletion</h2>
      <p>
        We retain your store configuration settings for as long as the App is installed on your store. When you uninstall the App, we receive Shopify's mandatory data redaction and uninstall webhooks (<code>app/uninstalled</code>, <code>shop/redact</code>) and automatically delete your store session and configuration data from our active database in full compliance with Shopify's data protection policies.
      </p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>5. Your Rights (GDPR & CCPA)</h2>
      <p>
        If you are a merchant residing in the European Economic Area (EEA), United Kingdom, or California, you have the right to access, update, or request the deletion of any personal data we hold about your store. You can exercise these rights at any time by contacting us.
      </p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>6. Changes</h2>
      <p>
        We may update this Privacy Policy periodically to reflect changes in our practices or for legal, operational, or regulatory reasons.
      </p>
      
      <h2 style={{ fontSize: '24px', marginTop: '30px' }}>7. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy or wish to make an inquiry, please contact us by email at <strong>adityachopraoffice@gmail.com</strong>.
      </p>
    </div>
  );
}
