const articles = document.querySelectorAll(
  ".mec-event-list-standard article.mec-event-article"
);

articles.forEach((article) => {
  // Obtener detalles del evento
  const link = article.querySelector(".mec-event-title a");
  if (!link || link.nextSibling?.classList?.contains("add-to-calendar-btn"))
    return;

  const [title = "", speaker = "", organization = ""] = link.textContent
    .split(" // ")
    .map((s) => s.trim());

  const dateText =
    article.querySelector(".mec-start-date-label")?.innerText.trim() || "";
  const timeText =
    article.querySelector(".mec-start-time")?.innerText.trim() || "";
  const venue =
    article.querySelector(".mec-venue-details span")?.innerText.trim() || "";
  const description =
    article.querySelector(".mec-event-description")?.innerText.trim() || "";
  const eventUrl = link.href;

  // Creando botón
  const btn = document.createElement("button");
  btn.innerText = "Agregar al calendario";
  btn.className = "add-to-calendar-btn";
  btn.style.marginLeft = "8px";
  btn.style.padding = "4px 8px";
  btn.style.cursor = "pointer";
  btn.style.color = "#fff";

  btn.onclick = () => {
    const fullTitle = `${dateText} — ${title}`;

    const monthMap = {
      Eno: 0,
      Feb: 1,
      Mar: 2,
      Abr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Ago: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dic: 11,
    };
    const [dayNum, monStr] = dateText.split(" ");
    const month =
      monthMap[monStr] != null ? monthMap[monStr] : new Date().getMonth();
    const [hour = "0", min = "0"] = timeText.split(":");

    const localDT = new Date();
    localDT.setMonth(month);
    localDT.setDate(parseInt(dayNum, 10));
    localDT.setHours(parseInt(hour, 10), parseInt(min, 10), 0);

    // Convertir de hora local a hora de Guadalajara
    const guadalajaraTime = new Date(
      localDT.toLocaleString("en-US", { timeZone: "America/Mexico_City" })
    );
    const startDT = new Date(guadalajaraTime);
    const endDT = new Date(startDT.getTime() + 60 * 60 * 1000);

    // Formato específico de Google Calendar
    const formatGCal = (dt) =>
      dt.getUTCFullYear().toString() +
      String(dt.getUTCMonth() + 1).padStart(2, "0") +
      String(dt.getUTCDate()).padStart(2, "0") +
      "T" +
      String(dt.getUTCHours()).padStart(2, "0") +
      String(dt.getUTCMinutes()).padStart(2, "0") +
      String(dt.getUTCSeconds()).padStart(2, "0") +
      "Z";

    // Payload final
    const detailsArr = [];
    if (speaker) detailsArr.push(`Speaker: ${speaker}`);
    if (venue) detailsArr.push(`Lugar: ${venue}`);
    if (organization) detailsArr.push(`Organización: ${organization}`);
    if (description) detailsArr.push(`\nDescription: ${description}`);
    detailsArr.push(`\nMás información: ${eventUrl}`);

    const params = new URLSearchParams({
      text: fullTitle,
      dates: `${formatGCal(startDT)}/${formatGCal(endDT)}`,
      location: venue,
      details: detailsArr.join("\n"),
    });

    window.open(
      `https://calendar.google.com/calendar/u/0/r/eventedit?${params}`,
      "_blank"
    );
  };

  link.parentNode.insertBefore(btn, link.nextSibling);
});
