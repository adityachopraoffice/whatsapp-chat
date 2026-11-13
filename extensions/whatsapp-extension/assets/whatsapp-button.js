document.addEventListener("DOMContentLoaded", function() {
  const wrapper = document.getElementById("whatsapp-wrapper");
  if (!wrapper) return;
  const shop = wrapper.getAttribute("data-shop");
  if (!shop) return;

  fetch(`/apps/whatsapp-chat/api/settings?shop=${shop}`)
    .then(res => res.json())
    .then(settings => {
      if (!settings.whatsappNumber) return;

      const number = settings.whatsappNumber;
      const plan = settings.currentPlan;
      
      let url = `https://wa.me/${number}`;
      if (plan === "pro" && settings.prefilledMessage) {
        url += `?text=${encodeURIComponent(settings.prefilledMessage)}`;
      }

      const isCustomColors = plan === "pro";
      
      let styles = {};
      switch (settings.selectedTemplate) {
        case "minimal":
          styles = {
            background: isCustomColors ? settings.bgColor : "#25D366",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          };
          break;
        case "bold":
          styles = {
            background: isCustomColors ? settings.bgColor : "#1A1A1A",
            border: `3px solid ${isCustomColors ? settings.bgColor : "#25D366"}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
          };
          break;
        case "elegant":
          styles = {
            background: isCustomColors ? settings.bgColor : "#FDF6F0",
            border: "2px solid #C49A6C",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          };
          break;
        case "dark":
          styles = {
            background: isCustomColors ? settings.bgColor : "#0D0D0D",
            border: "2px solid #00FF88",
            boxShadow: "0 4px 12px rgba(0,255,136,0.3)"
          };
          break;
        default:
          styles = {
            background: isCustomColors ? settings.bgColor : "#25D366",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          };
      }

      let position = "right";
      if (plan === "basic" || plan === "pro") {
        position = settings.position;
      }

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.position = "fixed";
      a.style.bottom = "20px";
      if (position === "right") {
        a.style.right = "20px";
      } else {
        a.style.left = "20px";
      }
      a.style.width = settings.buttonSize;
      a.style.height = settings.buttonSize;
      a.style.display = "flex";
      a.style.alignItems = "center";
      a.style.justifyContent = "center";
      a.style.borderRadius = "50%";
      a.style.background = styles.background;
      if (styles.border !== "none") a.style.border = styles.border;
      a.style.boxShadow = styles.boxShadow;
      a.style.zIndex = "2147483647"; // Ensure it's on top

      const iconColor = isCustomColors ? settings.iconColor : (
        settings.selectedTemplate === "minimal" ? "#FFFFFF" :
        settings.selectedTemplate === "bold" ? "#25D366" :
        settings.selectedTemplate === "elegant" ? "#25D366" :
        settings.selectedTemplate === "dark" ? "#00FF88" : "#FFFFFF"
      );

      const whatsappIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="color: ${iconColor}; width: 60%; height: 60%;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.471-.148-.67.15c-.197.297-.767.966-.94 1.164c-.173.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52c.149-.174.198-.298.298-.497c.099-.198.05-.371-.025-.52c-.075-.149-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51c-.173-.008-.371-.01-.57-.01c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074c.149.198 2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625c.712.227 1.36.195 1.871.118c.571-.085 1.758-.719 2.006-1.413c.248-.694.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214l-3.741.982l.998-3.648l-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`;
      
      a.innerHTML = whatsappIcon;
      document.body.appendChild(a);
    })
    .catch(err => console.error("WhatsApp Chat Button error:", err));
});
