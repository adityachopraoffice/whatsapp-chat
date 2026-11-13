import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useActionData, useNavigation } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  TextField,
  Select,
  Text,
  Button,
  Grid,
  Box,
  InlineStack,
  Banner,
  Tooltip
} from "@shopify/polaris";
import { useState, useEffect } from "react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let settings = await prisma.shopSettings.findUnique({ where: { shop } });
  if (!settings) {
    settings = await prisma.shopSettings.create({
      data: {
        shop,
        whatsappNumber: "",
        prefilledMessage: "Hello! I have a question about your store.",
        selectedTemplate: "minimal",
        position: "right",
        bgColor: "#25D366",
        iconColor: "#FFFFFF",
        buttonSize: "60px",
        currentPlan: "free",
      },
    });
  }

  return json({ settings });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();

  const data = {
    whatsappNumber: formData.get("whatsappNumber"),
    prefilledMessage: formData.get("prefilledMessage"),
    selectedTemplate: formData.get("selectedTemplate"),
    position: formData.get("position"),
    bgColor: formData.get("bgColor"),
    iconColor: formData.get("iconColor"),
    buttonSize: formData.get("buttonSize"),
  };

  await prisma.shopSettings.update({
    where: { shop },
    data,
  });

  return json({ success: true });
};

export default function Settings() {
  const { settings } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const nav = useNavigation();

  const [formState, setFormState] = useState(settings);
  const isSaving = nav.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show("Settings saved successfully!");
    }
  }, [actionData]);

  const isFree = settings.currentPlan === "free";
  const isBasic = settings.currentPlan === "basic";
  const isPro = settings.currentPlan === "pro";

  const templates = [
    { id: "minimal", label: "Minimal" },
    { id: "bold", label: "Bold" },
    { id: "elegant", label: "Elegant" },
    { id: "dark", label: "Dark" },
  ];

  const handleSave = () => {
    submit(formState, { method: "post" });
  };

  const getTemplateStyles = (templateId) => {
    const defaultIcon = "#FFFFFF";
    const defaultBg = "#25D366";

    const isCustomColors = isPro;
    const finalBg = isCustomColors ? formState.bgColor : defaultBg;
    const finalIcon = isCustomColors ? formState.iconColor : defaultIcon;

    switch (templateId) {
      case "minimal":
        return {
          background: isCustomColors ? formState.bgColor : "#25D366",
          border: "none",
          iconColor: isCustomColors ? formState.iconColor : "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        };
      case "bold":
        return {
          background: isCustomColors ? formState.bgColor : "#1A1A1A",
          border: `3px solid ${isCustomColors ? formState.bgColor : "#25D366"}`,
          iconColor: isCustomColors ? formState.iconColor : "#25D366",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
        };
      case "elegant":
        return {
          background: isCustomColors ? formState.bgColor : "#FDF6F0",
          border: "2px solid #C49A6C",
          iconColor: isCustomColors ? formState.iconColor : "#25D366",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        };
      case "dark":
        return {
          background: isCustomColors ? formState.bgColor : "#0D0D0D",
          border: "2px solid #00FF88",
          iconColor: isCustomColors ? formState.iconColor : "#00FF88",
          boxShadow: "0 4px 12px rgba(0,255,136,0.3)"
        };
      default:
        return {};
    }
  };

  const currentStyles = getTemplateStyles(formState.selectedTemplate);

  const WhatsappIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ color, width: '60%', height: '60%' }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.471-.148-.67.15c-.197.297-.767.966-.94 1.164c-.173.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52c.149-.174.198-.298.298-.497c.099-.198.05-.371-.025-.52c-.075-.149-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51c-.173-.008-.371-.01-.57-.01c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074c.149.198 2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625c.712.227 1.36.195 1.871.118c.571-.085 1.758-.719 2.006-1.413c.248-.694.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214l-3.741.982l.998-3.648l-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );

  return (
    <Page
      title="Messenger Linker Settings"
      primaryAction={{
        content: "Save",
        onAction: handleSave,
        loading: isSaving,
      }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">WhatsApp Details</Text>
                <TextField
                  label="WhatsApp Number"
                  value={formState.whatsappNumber}
                  onChange={(val) => setFormState({ ...formState, whatsappNumber: val })}
                  helpText="Include country code e.g. +91XXXXXXXXXX"
                  autoComplete="off"
                />
                
                {isFree || isBasic ? (
                  <Tooltip content="Upgrade to Pro">
                    <TextField
                      label="Pre-filled Message"
                      value={formState.prefilledMessage}
                      disabled
                      autoComplete="off"
                    />
                  </Tooltip>
                ) : (
                  <TextField
                    label="Pre-filled Message"
                    value={formState.prefilledMessage}
                    onChange={(val) => setFormState({ ...formState, prefilledMessage: val })}
                    autoComplete="off"
                  />
                )}
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Position</Text>
                {isFree && (
                  <Banner title="Upgrade to Basic" status="info">
                    Unlock left positioning by upgrading to the Basic plan.
                  </Banner>
                )}
                <Select
                  label="Button Position"
                  options={[
                    { label: "Bottom Right", value: "right" },
                    { label: "Bottom Left", value: "left" },
                  ]}
                  value={isFree ? "right" : formState.position}
                  onChange={(val) => setFormState({ ...formState, position: val })}
                  disabled={isFree}
                />
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Template</Text>
                <Grid>
                  {templates.map((tpl) => {
                    const tplStyles = getTemplateStyles(tpl.id);
                    const isLocked = isFree && tpl.id !== "minimal";
                    const isSelected = formState.selectedTemplate === tpl.id;

                    return (
                      <Grid.Cell key={tpl.id} columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                        <div
                          onClick={() => !isLocked && setFormState({ ...formState, selectedTemplate: tpl.id })}
                          style={{
                            border: isSelected ? "2px solid #000" : "1px solid #ccc",
                            padding: "1rem",
                            borderRadius: "8px",
                            cursor: isLocked ? "not-allowed" : "pointer",
                            opacity: isLocked ? 0.6 : 1,
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px"
                          }}
                        >
                          {isLocked && (
                            <div style={{ position: "absolute", top: "5px", right: "5px", background: "#ffea8a", padding: "2px 5px", fontSize: "10px", borderRadius: "4px" }}>
                              Upgrade
                            </div>
                          )}
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: tplStyles.background,
                            border: tplStyles.border,
                            boxShadow: tplStyles.boxShadow,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <WhatsappIcon color={tplStyles.iconColor} />
                          </div>
                          <Text as="span">{tpl.label}</Text>
                        </div>
                      </Grid.Cell>
                    );
                  })}
                </Grid>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Colors</Text>
                {!isPro && (
                  <Banner title="Upgrade to Pro" status="info">
                    Unlock custom colors by upgrading to the Pro plan.
                  </Banner>
                )}
                <div style={{ opacity: isPro ? 1 : 0.6, pointerEvents: isPro ? "auto" : "none" }}>
                  <BlockStack gap="400">
                    <TextField
                      type="color"
                      label="Button Background"
                      value={formState.bgColor}
                      onChange={(val) => setFormState({ ...formState, bgColor: val })}
                      autoComplete="off"
                    />
                    <TextField
                      type="color"
                      label="Icon Color"
                      value={formState.iconColor}
                      onChange={(val) => setFormState({ ...formState, iconColor: val })}
                      autoComplete="off"
                    />
                    <TextField
                      label="Button Size"
                      value={formState.buttonSize}
                      onChange={(val) => setFormState({ ...formState, buttonSize: val })}
                      autoComplete="off"
                    />
                  </BlockStack>
                </div>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400" align="center">
              <Text variant="headingMd" as="h2">Live Preview</Text>
              <div style={{
                position: "relative",
                height: "200px",
                width: "100%",
                background: "#f4f6f8",
                border: "1px dashed #c9cccf",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{
                  width: formState.buttonSize,
                  height: formState.buttonSize,
                  borderRadius: "50%",
                  background: currentStyles.background,
                  border: currentStyles.border,
                  boxShadow: currentStyles.boxShadow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <WhatsappIcon color={currentStyles.iconColor} />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Text as="span" variant="bodySm">Position: Bottom {isFree ? "Right" : formState.position === "right" ? "Right" : "Left"}</Text>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
