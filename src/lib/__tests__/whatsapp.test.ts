import { getWhatsAppUrl, getWhatsAppUrlWithMessage, getTrialLessonMessage } from "../whatsapp";
import { content } from "@/content/ru";
import { WHATSAPP_NUMBER } from "../constants";

describe("WhatsApp helpers", () => {
  it("should build correct WhatsApp URL with trial lesson message", () => {
    const url = getWhatsAppUrl();
    expect(url).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
    expect(url).toContain("text=");
    expect(url).toContain(encodeURIComponent("Здравствуйте!")); // greeting in URL encoding
  });

  it("should build WhatsApp URL with custom message", () => {
    const customMsg = "Привет, это тестовое сообщение";
    const url = getWhatsAppUrlWithMessage(customMsg);
    expect(url).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
    expect(url).toContain(encodeURIComponent(customMsg));
  });

  it("should return trial lesson message text", () => {
    const message = getTrialLessonMessage();
    expect(message).toBe(content.whatsapp.trialLessonMessage);
  });
});
