import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return json(
      { error: "Missing shop parameter" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  let settings = await prisma.shopSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    settings = {
      shop,
      whatsappNumber: "",
      prefilledMessage: "Hello! I have a question about your store.",
      selectedTemplate: "minimal",
      position: "right",
      bgColor: "#25D366",
      iconColor: "#FFFFFF",
      buttonSize: "60px",
      currentPlan: "free",
    };
  }

  // Clean WhatsApp number server side
  settings.whatsappNumber = settings.whatsappNumber.replace(/[\s\-\(\)\[\]\{\}]/g, "");

  return json(settings, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Bypass-Tunnel-Reminder",
    },
  });
};

export const action = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Bypass-Tunnel-Reminder",
      },
    });
  }
};
