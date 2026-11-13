import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Icon,
  Badge
} from "@shopify/polaris";
import { 
  SettingsIcon, 
  CreditCardIcon, 
  ChatIcon,
  CheckCircleIcon
} from '@shopify/polaris-icons';

export const loader = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;

  const billingCheck = await billing.check({
    plans: ["basic", "pro"],
    isTest: true,
  });

  let currentPlan = "free";
  if (billingCheck.hasActivePayment) {
    const activePlans = billingCheck.appSubscriptions.map(sub => sub.name);
    if (activePlans.includes("pro")) {
      currentPlan = "pro";
    } else if (activePlans.includes("basic")) {
      currentPlan = "basic";
    }
  }

  const settings = await prisma.shopSettings.findUnique({ where: { shop } });
  const hasConfiguredNumber = settings && settings.whatsappNumber && settings.whatsappNumber.length > 5;

  return json({ 
    shop, 
    currentPlan, 
    hasConfiguredNumber,
    isPro: currentPlan === "pro"
  });
};

export default function Dashboard() {
  const { currentPlan, hasConfiguredNumber, isPro } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page fullWidth>
      <style dangerouslySetInnerHTML={{__html: `
        .hero-banner {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          padding: 40px;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .hero-banner::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
        }
        .hero-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
          color: white;
        }
        .hero-subtitle {
          font-size: 16px;
          opacity: 0.9;
          max-width: 600px;
        }
        .stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -8px rgba(0,0,0,0.15);
        }
      `}} />

      <div className="hero-banner">
        <BlockStack gap="400">
          <div className="hero-title">Welcome to WhatsApp Chat Button! 🚀</div>
          <div className="hero-subtitle">
            Boost your sales and engage with your customers directly on WhatsApp. 
            Connect instantly and never miss a lead.
          </div>
          <div style={{ marginTop: '16px' }}>
            <Button 
              variant="primary" 
              size="large"
              onClick={() => navigate("/app/settings")}
            >
              {hasConfiguredNumber ? "Edit Button Settings" : "Configure Your Number"}
            </Button>
          </div>
        </BlockStack>
      </div>

      <Layout>
        <Layout.Section variant="oneHalf">
          <div className="stat-card">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <div style={{ color: '#10b981' }}><Icon source={ChatIcon} /></div>
                    <Text variant="headingMd" as="h3">Button Status</Text>
                  </InlineStack>
                  {hasConfiguredNumber ? (
                    <Badge tone="success" icon={CheckCircleIcon}>Ready</Badge>
                  ) : (
                    <Badge tone="warning">Action Required</Badge>
                  )}
                </InlineStack>
                
                <Text color="subdued">
                  {hasConfiguredNumber 
                    ? "Your WhatsApp button is configured. Make sure it's enabled in your Shopify Theme Editor!"
                    : "You haven't added a WhatsApp number yet. Customers won't be able to chat with you."}
                </Text>

                <div style={{ marginTop: '8px' }}>
                  <Button onClick={() => navigate("/app/settings")} icon={SettingsIcon}>
                    Go to Settings
                  </Button>
                </div>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <div className="stat-card">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <div style={{ color: '#8b5cf6' }}><Icon source={CreditCardIcon} /></div>
                    <Text variant="headingMd" as="h3">Current Plan</Text>
                  </InlineStack>
                  <Badge tone={isPro ? "magic" : currentPlan === "basic" ? "info" : "new"}>
                    {currentPlan.toUpperCase()}
                  </Badge>
                </InlineStack>
                
                <Text color="subdued">
                  {isPro 
                    ? "You are on the Pro plan! Enjoy full color customization and pre-filled messages."
                    : "Upgrade to unlock custom templates, advanced positioning, and brand colors."}
                </Text>

                <div style={{ marginTop: '8px' }}>
                  <Button onClick={() => navigate("/app/billing")} variant={!isPro ? "primary" : undefined}>
                    View Billing & Plans
                  </Button>
                </div>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
