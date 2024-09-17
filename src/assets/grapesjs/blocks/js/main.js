document.querySelectorAll('[id^="vcard-button-"]').forEach((btn) => {
  btn.addEventListener("click", function () {
    const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN;CHARSET=UTF-8:{{fullName}}\nN;CHARSET=UTF-8;:{{fullName}};;;\nEMAIL;CHARSET=UTF-8;type=EMAIL:{{email}}\nTEL;TYPE=CELL:{{phoneNumber}}\nLABEL;CHARSET=UTF-8;TYPE=WORK:Company's address\nADR;CHARSET=UTF-8;TYPE=WORK:;;;{{companyAddress}};;;\nTITLE;CHARSET=UTF-8:{{position}}\nORG;CHARSET=UTF-8:{{companyName}}\nURL;type=WORK;CHARSET=UTF-8:{{websiteUrl}}\nREV:2024-08-30T08:29:33.523Z\nEND:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "{{fullName}}.vcf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
});
document.querySelectorAll('[id^="dialog-button-"]').forEach((btn) => {
  const dialogButtonId = btn.id.replace("dialog-button-", "");
  btn.addEventListener("click", function () {
    const dialogOverlay = document.getElementById(
      `dialog-${dialogButtonId}-overlay`
    );
    const dialogContent = document.getElementById(
      `dialog-${dialogButtonId}-content`
    );
    const dialogBox = document.getElementById(`dialog-${dialogButtonId}-box`);
    const dialogClose = document.getElementById(
      `dialog-${dialogButtonId}-close`
    );

    if (dialogOverlay && dialogContent && dialogBox) {
      dialogOverlay.classList.remove("hidden");
      dialogContent.classList.remove("hidden");
      dialogBox.classList.remove("hidden");
    }

    if (dialogOverlay) {
      dialogOverlay.addEventListener("click", () => {
        dialogOverlay.classList.add("hidden");
        dialogContent.classList.add("hidden");
        dialogBox.classList.add("hidden");
      });
    }

    if (dialogClose) {
      dialogClose.addEventListener("click", () => {
        dialogOverlay.classList.add("hidden");
        dialogContent.classList.add("hidden");
        dialogBox.classList.add("hidden");
      });
    }
  });
});
