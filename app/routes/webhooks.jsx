import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session } = await authenticate.webhook(request);

  switch (topic) {
    case "APP_UNINSTALLED":
    case "app/uninstalled":
      if (session) {
        await prisma.session.deleteMany({ where: { shop } });
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "customers/data_request":
    case "CUSTOMERS_REDACT":
    case "customers/redact":
    case "SHOP_REDACT":
    case "shop/redact":
      // Mandatory compliance webhooks
      // Must respond with 200 OK
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  return new Response();
};
