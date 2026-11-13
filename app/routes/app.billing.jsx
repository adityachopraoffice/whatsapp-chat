import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { Page, Layout, Card, BlockStack, Text, Button, Grid, Badge, List } from "@shopify/polaris";

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

  let settings = await prisma.shopSettings.findUnique({ where: { shop } });
  if (settings && settings.currentPlan !== currentPlan) {
    settings = await prisma.shopSettings.update({
      where: { shop },
      data: { currentPlan },
    });
  }

  return json({ currentPlan: settings?.currentPlan || currentPlan });
};

export const action = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan");
  
  if (plan === "free") {
    const billingCheck = await billing.check({
      plans: ["basic", "pro"],
      isTest: true,
    });
    
    if (billingCheck.hasActivePayment) {
      const activeSubscription = billingCheck.appSubscriptions[0];
      await billing.cancel({
        subscriptionId: activeSubscription.id,
        isTest: true,
        prorate: true,
      });
    }

    await prisma.shopSettings.update({
      where: { shop: session.shop },
      data: { currentPlan: "free" },
    });

    return redirect("/app/billing");
  }

  const shopId = session.shop.replace('.myshopify.com', '');
  const clientId = process.env.SHOPIFY_API_KEY === "your_api_key" ? "ba14e71219a0d25b11e496db975520f4" : (process.env.SHOPIFY_API_KEY || "ba14e71219a0d25b11e496db975520f4");
  const adminUrl = `https://admin.shopify.com/store/${shopId}/apps/${clientId}`;

  await billing.request({
    plan,
    isTest: true,
    returnUrl: `${adminUrl}/app/billing`,
  });

  return null;
};

export default function Billing() {
  const { currentPlan } = useLoaderData();
  const submit = useSubmit();
  const nav = useNavigation();
  const isUpgrading = nav.state === "submitting";

  const handleUpgrade = (plan) => {
    submit({ plan }, { method: "post" });
  };

  return (
    <Page title="Billing">
      <BlockStack gap="500">
        <div style={{ marginBottom: "20px" }}>
          <Text variant="headingLg" as="h2">Current Plan: <Badge tone="success">{currentPlan.toUpperCase()}</Badge></Text>
        </div>

        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">Free — $0/mo</Text>
                <List>
                  <List.Item>Minimal template only</List.Item>
                  <List.Item>Bottom right position only</List.Item>
                  <List.Item>No custom colors</List.Item>
                  <List.Item>No custom message</List.Item>
                </List>
                <Button 
                  disabled={currentPlan === "free"}
                  onClick={() => handleUpgrade("free")}
                  fullWidth
                >
                  {currentPlan === "free" ? "Current Plan" : "Downgrade to Free"}
                </Button>
              </BlockStack>
            </Card>
          </Grid.Cell>

          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">Basic — $4.99/mo</Text>
                <List>
                  <List.Item>All 4 templates</List.Item>
                  <List.Item>Choose left or right position</List.Item>
                  <List.Item>No custom colors</List.Item>
                  <List.Item>No custom message</List.Item>
                </List>
                <Button 
                  primary={currentPlan !== "basic"}
                  disabled={currentPlan === "basic"}
                  loading={isUpgrading}
                  onClick={() => handleUpgrade("basic")}
                  fullWidth
                >
                  {currentPlan === "basic" ? "Current Plan" : "Upgrade to Basic"}
                </Button>
              </BlockStack>
            </Card>
          </Grid.Cell>

          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">Pro — $9.99/mo</Text>
                <List>
                  <List.Item>All 4 templates</List.Item>
                  <List.Item>Choose left or right position</List.Item>
                  <List.Item>Full color customization</List.Item>
                  <List.Item>Custom pre-filled message</List.Item>
                </List>
                <Button 
                  primary={currentPlan !== "pro"}
                  disabled={currentPlan === "pro"}
                  loading={isUpgrading}
                  onClick={() => handleUpgrade("pro")}
                  fullWidth
                >
                  {currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro"}
                </Button>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>
      </BlockStack>
    </Page>
  );
}
