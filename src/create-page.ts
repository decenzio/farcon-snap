export const createPageHtml = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Crea una Domanda!</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; }

:root {
  --paper:    #fef9e7;
  --ink:      #1a1006;
  --red:      #d62828;
  --green:    #2a9d2a;
  --blue:     #1d4e89;
  --yellow:   #e9c46a;
  --orange:   #f4732a;
  --purple:   #7b2d8b;
  --pink:     #e040a0;
  --teal:     #1a7a6e;
  --line:     rgba(100,120,180,0.13);
}

html { min-height: 100%; }

body {
  font-family: "Caveat", cursive;
  font-size: 18px;
  color: var(--ink);
  min-height: 100vh;
  margin: 0;
  padding: 2rem 1rem 4rem;
  background-color: var(--paper);
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px);
  background-size: 100% 2rem;
  background-position: 0 1rem;
}

.page {
  max-width: 580px;
  margin: 0 auto;
}

/* ── HEADER ─────────────────────────────── */
.header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.header h1 {
  font-size: 3.2rem;
  font-weight: 900;
  margin: 0;
  line-height: 1.1;
  color: var(--red);
  text-shadow: 3px 3px 0 var(--ink), -1px -1px 0 var(--ink);
  display: inline-block;
  transform: rotate(-1.5deg);
}

.header .sub {
  font-size: 1.3rem;
  color: var(--blue);
  margin-top: 0.2rem;
  font-weight: 600;
}

.doodle-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 1.6rem;
  transform: rotate(1deg);
  user-select: none;
}

/* ── LABELS ─────────────────────────────── */
.section-label {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.8rem 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.section-label span { font-size: 1.3rem; }

/* ── PHOTO ZONE ─────────────────────────── */
.photo-zone {
  position: relative;
  border: 4px dashed var(--blue);
  border-radius: 18px 8px 20px 10px / 10px 20px 8px 18px;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo-zone.drag-over {
  background: #e8f0fe;
  border-color: var(--red);
  border-style: solid;
}
.photo-zone:hover { background: #f5faff; }

.photo-placeholder {
  text-align: center;
  padding: 2rem 1.5rem;
  pointer-events: none;
}
.photo-placeholder .big-icon { font-size: 3.5rem; display: block; margin-bottom: 0.5rem; }
.photo-placeholder p { margin: 0; color: var(--blue); font-size: 1.2rem; font-weight: 600; }
.photo-placeholder small { color: #777; font-size: 1rem; }

.photo-preview {
  width: 100%;
  display: none;
  position: relative;
}
.photo-preview img {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  display: block;
  border-radius: 14px 4px 16px 6px;
}
.photo-preview .remove-photo {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--red);
  color: #fff;
  border: 2px solid var(--ink);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Caveat", cursive;
  font-weight: 700;
  line-height: 1;
}

.url-toggle {
  text-align: center;
  margin-top: 0.6rem;
  font-size: 1rem;
  color: var(--blue);
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  display: block;
}

.url-row {
  display: none;
  margin-top: 0.6rem;
}
.url-row.visible { display: flex; gap: 0.5rem; align-items: center; }
.url-row input {
  flex: 1;
}

/* ── INPUTS ─────────────────────────────── */
input[type="text"],
input[type="url"],
textarea {
  font-family: "Caveat", cursive;
  font-size: 1.25rem;
  width: 100%;
  padding: 0.6rem 0.9rem;
  background: #fff;
  color: var(--ink);
  border: 3px solid var(--ink);
  border-radius: 12px 4px 10px 6px / 4px 10px 6px 12px;
  outline: none;
  transition: box-shadow 0.15s;
}
input[type="text"]:focus,
input[type="url"]:focus,
textarea:focus {
  box-shadow: 4px 4px 0 var(--ink);
}
textarea {
  resize: vertical;
  min-height: 90px;
  line-height: 1.4;
}

/* ── OPTIONS ────────────────────────────── */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 0.2rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-num {
  font-size: 1.4rem;
  font-weight: 700;
  min-width: 28px;
  text-align: center;
}

.option-row input {
  flex: 1;
}

.option-row:nth-child(1) .option-num { color: var(--red); }
.option-row:nth-child(2) .option-num { color: var(--green); }
.option-row:nth-child(3) .option-num { color: var(--blue); }
.option-row:nth-child(4) .option-num { color: var(--orange); }
.option-row:nth-child(5) .option-num { color: var(--purple); }
.option-row:nth-child(6) .option-num { color: var(--pink); }

.option-row:nth-child(1) input:focus { box-shadow: 4px 4px 0 var(--red); }
.option-row:nth-child(2) input:focus { box-shadow: 4px 4px 0 var(--green); }
.option-row:nth-child(3) input:focus { box-shadow: 4px 4px 0 var(--blue); }
.option-row:nth-child(4) input:focus { box-shadow: 4px 4px 0 var(--orange); }
.option-row:nth-child(5) input:focus { box-shadow: 4px 4px 0 var(--purple); }
.option-row:nth-child(6) input:focus { box-shadow: 4px 4px 0 var(--pink); }

.btn-remove-opt {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #bbb;
  padding: 0 0.2rem;
  transition: color 0.1s;
  font-family: "Caveat", cursive;
  line-height: 1;
}
.btn-remove-opt:hover { color: var(--red); }

.btn-add-opt {
  margin-top: 0.5rem;
  font-family: "Caveat", cursive;
  font-size: 1.2rem;
  font-weight: 700;
  background: none;
  border: 3px dashed var(--green);
  border-radius: 10px 4px 12px 4px;
  color: var(--green);
  padding: 0.4rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-add-opt:hover { background: rgba(42,157,42,0.08); }
.btn-add-opt:disabled { opacity: 0.4; cursor: default; }

/* ── SUBMIT ─────────────────────────────── */
.submit-row {
  display: flex;
  justify-content: center;
  margin-top: 2.2rem;
}

.btn-create {
  font-family: "Caveat", cursive;
  font-size: 2rem;
  font-weight: 900;
  background: var(--red);
  color: #fff;
  border: 4px solid var(--ink);
  border-radius: 20px 8px 22px 10px / 8px 22px 10px 20px;
  padding: 0.6rem 2.5rem;
  cursor: pointer;
  box-shadow: 5px 5px 0 var(--ink);
  transform: rotate(-1deg);
  transition: transform 0.1s, box-shadow 0.1s;
  letter-spacing: 0.04em;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
}
.btn-create:hover {
  transform: rotate(-1deg) translateY(-2px);
  box-shadow: 7px 7px 0 var(--ink);
}
.btn-create:active {
  transform: rotate(-1deg) translateY(1px);
  box-shadow: 3px 3px 0 var(--ink);
}
.btn-create:disabled {
  opacity: 0.6;
  cursor: progress;
  transform: rotate(-1deg);
  box-shadow: 5px 5px 0 var(--ink);
}

/* ── STATUS / RESULT ─────────────────────── */
.status {
  min-height: 1.8rem;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 0.8rem;
}
.status.error { color: var(--red); font-weight: 700; }
.status.info   { color: var(--blue); }

.result-box {
  display: none;
  margin-top: 2rem;
  border: 4px solid var(--green);
  border-radius: 16px 6px 18px 8px / 6px 18px 8px 16px;
  background: #fff;
  padding: 1.2rem 1.4rem;
  box-shadow: 5px 5px 0 var(--green);
}
.result-box h2 {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--green);
  margin: 0 0 0.6rem;
}
.result-box .snap-url {
  word-break: break-all;
  font-size: 1.1rem;
  color: var(--blue);
  text-decoration: none;
  font-weight: 700;
  display: block;
  margin: 0.3rem 0;
}
.result-box .emulator-link {
  display: inline-block;
  margin-top: 0.8rem;
  font-size: 1.1rem;
  color: var(--purple);
  font-weight: 700;
  text-decoration: underline;
}

/* ── HIDDEN INPUTS ──────────────────────── */
#file-input { display: none; }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <h1>CREA UNA DOMANDA!</h1>
    <div class="sub">make a Farcaster snap poll</div>
    <div class="doodle-row" aria-hidden="true">🖍️ 🌟 ✏️ 🎨 ⭐ 🖊️</div>
  </div>

  <form id="poll-form" novalidate>

    <!-- Photo upload -->
    <div class="section-label"><span>📷</span> La tua foto (opzionale!)</div>

    <div class="photo-zone" id="drop-zone" role="button" tabindex="0"
         aria-label="Click or drag a photo here">
      <div class="photo-placeholder" id="placeholder">
        <span class="big-icon">🖼️</span>
        <p>Clicca o trascina la tua foto qui!</p>
        <small>JPEG, PNG, WEBP, GIF · max 4 MB</small>
      </div>
      <div class="photo-preview" id="preview">
        <img id="preview-img" src="" alt="preview">
        <button type="button" class="remove-photo" id="btn-remove-photo"
                aria-label="Remove photo">✕</button>
      </div>
    </div>
    <input type="file" id="file-input" name="image_file"
           accept="image/jpeg,image/png,image/webp,image/gif">

    <span class="url-toggle" id="url-toggle" role="button" tabindex="0">
      oppure usa un URL di un'immagine →
    </span>
    <div class="url-row" id="url-row">
      <input type="url" id="image-url" name="image_url"
             placeholder="https://…" autocomplete="off">
    </div>

    <!-- Question -->
    <div class="section-label"><span>❓</span> La domanda</div>
    <textarea name="question" id="question" required
              maxlength="320"
              placeholder="Qual è la tua pizza preferita?"></textarea>

    <!-- Options -->
    <div class="section-label"><span>✍️</span> Le risposte (2–6)</div>
    <div class="options-list" id="options-list"></div>
    <button type="button" class="btn-add-opt" id="btn-add-opt">
      + Aggiungi risposta
    </button>

    <!-- Submit -->
    <div class="submit-row">
      <button type="submit" class="btn-create" id="btn-create">
        🌟 CREA! 🌟
      </button>
    </div>
    <div class="status" id="status" role="status" aria-live="polite"></div>
  </form>

  <!-- Result -->
  <div class="result-box" id="result">
    <h2>🎉 Fatto!</h2>
    <p>Condividi questo URL su Farcaster:</p>
    <a class="snap-url" id="snap-url" target="_blank" rel="noopener"></a>
    <br>
    <a class="emulator-link" id="emulator-url" target="_blank" rel="noopener">
      Testa nell'emulatore Snap →
    </a>
  </div>

</div><!-- .page -->

<script>
(function () {
  /* ── State ─────────────────────────────── */
  let selectedFile = null;     // File object if user picked one
  let options = ["", ""];      // always start with two

  /* ── Elements ──────────────────────────── */
  const form        = document.getElementById("poll-form");
  const dropZone    = document.getElementById("drop-zone");
  const fileInput   = document.getElementById("file-input");
  const placeholder = document.getElementById("placeholder");
  const preview     = document.getElementById("preview");
  const previewImg  = document.getElementById("preview-img");
  const btnRemove   = document.getElementById("btn-remove-photo");
  const urlToggle   = document.getElementById("url-toggle");
  const urlRow      = document.getElementById("url-row");
  const imageUrlInput = document.getElementById("image-url");
  const optList     = document.getElementById("options-list");
  const btnAddOpt   = document.getElementById("btn-add-opt");
  const btnCreate   = document.getElementById("btn-create");
  const statusEl    = document.getElementById("status");
  const resultBox   = document.getElementById("result");
  const snapUrlEl   = document.getElementById("snap-url");
  const emulatorEl  = document.getElementById("emulator-url");

  /* ── Photo handling ─────────────────────── */
  function showPreview(file) {
    selectedFile = file;
    imageUrlInput.value = "";
    urlRow.classList.remove("visible");
    urlToggle.textContent = "oppure usa un URL di un’immagine →";
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      placeholder.style.display = "none";
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    selectedFile = null;
    previewImg.src = "";
    preview.style.display = "none";
    placeholder.style.display = "";
    fileInput.value = "";
  }

  function handleFile(file) {
    if (!file) return;
    const allowed = ["image/jpeg","image/jpg","image/png","image/webp","image/gif"];
    if (!allowed.includes(file.type.toLowerCase())) {
      setStatus("Solo JPEG, PNG, WEBP o GIF! 🙅", "error");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setStatus("L’immagine deve essere meno di 4 MB!", "error");
      return;
    }
    setStatus("", "");
    showPreview(file);
  }

  dropZone.addEventListener("click", function (e) {
    if (e.target === btnRemove) return;
    fileInput.click();
  });
  dropZone.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") fileInput.click();
  });
  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });
  dropZone.addEventListener("dragleave", function () {
    dropZone.classList.remove("drag-over");
  });
  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer && e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
  fileInput.addEventListener("change", function () {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });
  btnRemove.addEventListener("click", function (e) {
    e.stopPropagation();
    clearPhoto();
  });

  /* ── URL toggle ─────────────────────────── */
  urlToggle.addEventListener("click", toggleUrl);
  urlToggle.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") toggleUrl();
  });
  function toggleUrl() {
    const showing = urlRow.classList.contains("visible");
    if (showing) {
      urlRow.classList.remove("visible");
      urlToggle.textContent = "oppure usa un URL di un’immagine →";
    } else {
      clearPhoto();
      urlRow.classList.add("visible");
      urlToggle.textContent = "← nascondi URL";
      imageUrlInput.focus();
    }
  }
  imageUrlInput.addEventListener("input", function () {
    if (imageUrlInput.value.trim()) clearPhoto();
  });

  /* ── Options ────────────────────────────── */
  const EMOJIS = ["🔴","🟢","🔵","🟠","🟣","💗"];

  function renderOptions() {
    optList.innerHTML = "";
    options.forEach(function (val, i) {
      const row = document.createElement("div");
      row.className = "option-row";

      const num = document.createElement("span");
      num.className = "option-num";
      num.textContent = EMOJIS[i] || (i + 1) + ".";

      const inp = document.createElement("input");
      inp.type = "text";
      inp.maxLength = 30;
      inp.value = val;
      inp.placeholder = "Risposta " + (i + 1) + "…";
      inp.required = i < 2;
      inp.addEventListener("input", function () { options[i] = inp.value; });

      const btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.className = "btn-remove-opt";
      btnDel.textContent = "✕";
      btnDel.title = "Rimuovi";
      btnDel.disabled = options.length <= 2;
      btnDel.addEventListener("click", function () {
        options.splice(i, 1);
        renderOptions();
        updateAddBtn();
      });

      row.appendChild(num);
      row.appendChild(inp);
      row.appendChild(btnDel);
      optList.appendChild(row);
    });
    updateAddBtn();
  }

  function updateAddBtn() {
    btnAddOpt.disabled = options.length >= 6;
  }

  btnAddOpt.addEventListener("click", function () {
    if (options.length < 6) {
      options.push("");
      renderOptions();
    }
  });

  renderOptions();

  /* ── Helpers ────────────────────────────── */
  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = "status" + (type ? " " + type : "");
  }

  /* ── Submit ─────────────────────────────── */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    resultBox.style.display = "none";
    setStatus("", "");

    const question = document.getElementById("question").value.trim();
    if (!question) { setStatus("Scrivi la domanda! 📝", "error"); return; }

    const cleanOpts = options.map(function (o) { return o.trim(); }).filter(Boolean);
    if (cleanOpts.length < 2) { setStatus("Aggiungi almeno 2 risposte! ✍️", "error"); return; }
    if (new Set(cleanOpts).size !== cleanOpts.length) {
      setStatus("Le risposte devono essere diverse! 🙈", "error");
      return;
    }

    btnCreate.disabled = true;

    try {
      /* 1. Upload photo if chosen */
      let imageUrl = null;

      if (selectedFile) {
        setStatus("Caricando la foto… 🖼️", "info");
        const fd = new FormData();
        fd.append("image", selectedFile);
        const upRes = await fetch("/api/upload-image", { method: "POST", body: fd });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson.error || "Errore upload");
        imageUrl = upJson.url;
      } else if (imageUrlInput.value.trim()) {
        imageUrl = imageUrlInput.value.trim();
      }

      /* 2. Create poll */
      setStatus("Creando la domanda… ✨", "info");
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, image_url: imageUrl, options: cleanOpts }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore del server");

      setStatus("", "");
      snapUrlEl.href = json.url;
      snapUrlEl.textContent = json.url;
      emulatorEl.href =
        "https://farcaster.xyz/~/developers/snaps?url=" + encodeURIComponent(json.url);
      resultBox.style.display = "block";
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

      /* Reset form */
      document.getElementById("question").value = "";
      options = ["", ""];
      renderOptions();
      clearPhoto();
      imageUrlInput.value = "";
      urlRow.classList.remove("visible");
      urlToggle.textContent = "oppure usa un URL di un’immagine →";

    } catch (err) {
      setStatus(err.message || "Qualcosa è andato storto 😬", "error");
    } finally {
      btnCreate.disabled = false;
    }
  });
}());
</script>
</body>
</html>`;
