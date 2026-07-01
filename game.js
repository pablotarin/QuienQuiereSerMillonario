/* ═══════════════════════════════════════════
   DATOS — edita aquí tus preguntas y regalos
═══════════════════════════════════════════ */

const QUESTIONS = [
  {
    q: "¿Qué día es nuestro aniversario?",
    a: ["1 de Julio", "1 de Junio", "4 de Agosto", "30 de Junio"],
    correct: 0,
  },
  {
    q: "¿En que ciudad nos vimos por primera vez?",
    a: ["Xeraco", "Valencia", "Cullera", "Ninguna de las anteriores"],
    correct: 1,
  },
  {
    q: "¿Dónde fue el primer sitio donde nos hicimos una foto juntos?",
    a: ["Tavernes Pueblo", "Xeraco pueblo", "Xeraco Playa", "Tavernes Playa"],
    correct: 3,
  },
  {
    q: "¿Cuál ha sido la única saga de peliculas que hemos visto entera?",
    a: ["Los juegos del hambre", "Piratas del Caribe", "Harry Potter", "no hemos terminado ninguna"],
    correct: 2,
  },
  {
    q: "¿Dónde tuvimos nuestra primera cita/cena como pareja?",
    a: [
      { text: "Aoyama", img: "img/aoyama.jpg" },
      { text: "Piscolabis", img: "img/piscolabis.jpg" },
      { text: "Ultramarinos Huerta", img: "img/ultramarinos.jpg" },
      { text: "Vermúdez", img: "img/vermudez.png" },
    ],
    correct: 0,
  },
  {
    q: "¿Cuál fue el primer regalo que te hice?",
    a: [
      "Ramo de rosas, chocolate, brazalete y pendientes",
      "Ramo de flores, brazalete, chocolates y pendientes",
      "Brazalete, pendientes y zapatillas",
      "Ramo de flores, chocolate, zapatillas y pendientes",
    ],
    correct: 1,
  },
  {
    q: "¿En cuál de nuestros viajes cogimos una moto por la ciudad?",
    a: ["Granada", "Madrid", "Bruselas", "Brujas"],
    correct: 1,
  },
  {
    q: "¿Cuál fue la primera película que vimos juntos en el cine?",
    a: [
      { text: "El diablo viste de Prada 2", img: "img/diabloPrada2.jpg" },
      { text: "La Asistenta", img: "img/asistenta.jpg" },
      { text: "Ídolos", img: "img/idolos.jpg" },
      "Ninguna de las anteriores",
    ],
    correct: 2,
  },
  {
    q: "¿Donde dormimos juntos por primera vez?",
    a: ["Valencia", "Chiva", "Xeraco", "Tavernes"],
    correct: 1,
  },
  {
    q: "¿Qué canción es más nuestra?",
    a: [
      { text: " ", audio: "audio/princesas.mp3" },
      { text: " ", audio: "audio/siTeVas.mp3" },
      { text: " ", audio: "audio/olvidarnos.mp3" },
      { text: " ", audio: "audio/siSupieran.mp3" },
    ],
    correct: 3,
  },
]

const PRIZES = [
  {
    after: 2,
    icon: "🍽️",
    title: "¡Regalo sorpresa #1!",
    desc: "Un días especial merece una cena especial...",
    hint: "¡Ponte guapa! Nos vamos de cena a un sitio muy especial 🌃",
  },
  {
    after: 4,
    icon: "🏠",
    title: "¡Regalo sorpresa #2!",
    desc: "Un pequeño recuerdo de nuestro viaje",
    hint: "Pista: Tienes que buscar detrás de nuestro próximo viaje de navidad",
  },
  {
    after: 7,
    icon: "🎁",
    title: "¡Regalo sorpresa #3!",
    desc: "Un recuerdo de estos 12 meses increíbles...",
    hint: "Mira dentro del cajón de la mesita 🗝️",
  },
  {
    after: 10,
    icon: "🎁",
    title: "¡Regalo final! ¡Eres la campeona!",
    desc: "Has respondido todo perfecto... igual que este año contigo.",
    hint: "El último regalo lo tienes en mis manos 💍",
  },
];

const CALL_HINT =
  "«Hola Cande, he estado buscando y creo que la respuesta correcta es la B. ¡Mucha suerte!»";

/* ═══════════════════════════════════════════
   AUDIO — Web Audio API (sin archivos externos)
═══════════════════════════════════════════ */

let audioCtx = null;

function getAudio() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(frequency, duration, type = "sine", volume = 0.3, delay = 0) {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + delay + duration,
    );
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (e) {}
}

function playChord(
  notes,
  duration,
  type = "sine",
  volume = 0.2,
  startDelay = 0,
) {
  notes.forEach((freq, i) =>
    playTone(freq, duration, type, volume, startDelay + i * 0.05),
  );
}

// Sonido al seleccionar respuesta (suspenso)
function soundSelect() {
  playTone(440, 0.12, "sine", 0.2);
}

// Sonido correcto — fanfarria ascendente
function soundCorrect() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => playTone(f, 0.18, "sine", 0.25, i * 0.1));
}

// Sonido incorrecto — descenso grave
function soundWrong() {
  playTone(300, 0.15, "sawtooth", 0.3, 0);
  playTone(220, 0.2, "sawtooth", 0.3, 0.15);
  playTone(150, 0.3, "sawtooth", 0.25, 0.35);
}

// Sonido de premio — melodía festiva
function soundPrize() {
  const melody = [523, 659, 784, 659, 784, 1047];
  melody.forEach((f, i) => playTone(f, 0.2, "sine", 0.22, i * 0.12));
}

// Sonido de victoria — gran fanfarria
function soundWin() {
  const melody = [523, 659, 784, 1047, 784, 1047, 1319];
  melody.forEach((f, i) => playTone(f, 0.25, "sine", 0.28, i * 0.13));
  // Armónicos de fondo
  setTimeout(() => playChord([261, 329, 392], 1.0, "sine", 0.12), 300);
}

// Sonido de comodín usado
function soundLifeline() {
  playTone(880, 0.1, "sine", 0.2, 0);
  playTone(660, 0.1, "sine", 0.2, 0.1);
  playTone(440, 0.15, "sine", 0.2, 0.2);
}

// Sonido de suspense al cargar pregunta
function soundQuestion() {
  playTone(220, 0.08, "sine", 0.1, 0);
  playTone(247, 0.08, "sine", 0.1, 0.1);
  playTone(261, 0.12, "sine", 0.12, 0.2);
}

// Sonido al pasar de nivel / escalar
function soundLevelUp() {
  playTone(523, 0.1, "sine", 0.18, 0);
  playTone(659, 0.1, "sine", 0.18, 0.08);
}

/* ═══════════════════════════════════════════
   ESTADO
═══════════════════════════════════════════ */

let state = {
  currentQ: 0,
  answered: false,
  hiddenAnswers: [],
  audienceHint: null,
  lifelines: { fifty: false, audience: false, call: false },
  failedQuestions: [],
  correctedFailed: [],
  retryingFailed: false,
  retryQueue: [],
  failedIndex: 0,
  correctCount: 0,
  activeAudio: null,
  activeAudioIndex: null,
};

/* ═══════════════════════════════════════════
   PANTALLAS
═══════════════════════════════════════════ */

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });
  const target = document.getElementById("screen-" + name);
  target.classList.remove("hidden");
  target.classList.add("active");
}

function getPrizeForCorrectCount(count) {
  return PRIZES.find((p) => p.after === count);
}

function getNextPrizeLabel() {
  const nextPrize = PRIZES.find((p) => p.after > state.correctCount);
  return nextPrize ? `🎁 Regalo al acertar ${nextPrize.after} preguntas` : "";
}

function getPendingFailedQuestions() {
  return state.failedQuestions.filter(
    (q) => !state.correctedFailed.includes(q),
  );
}

function startRetryRound() {
  state.retryQueue = getPendingFailedQuestions();
  state.retryingFailed = true;
  state.failedIndex = 0;
  loadQuestion();
  showScreen("game");
}

/* ═══════════════════════════════════════════
   INICIO
═══════════════════════════════════════════ */

function startGame() {
  // Inicializar AudioContext en gesto de usuario
  getAudio();
  soundQuestion();

  state = {
    currentQ: 0,
    answered: false,
    hiddenAnswers: [],
    audienceHint: null,
    lifelines: { fifty: false, audience: false, call: false },
    failedQuestions: [],
    correctedFailed: [],
    retryingFailed: false,
    retryQueue: [],
    failedIndex: 0,
    correctCount: 0,
    activeAudio: null,
    activeAudioIndex: null,
  };
  loadQuestion();
  showScreen("game");
}

/* ═══════════════════════════════════════════
   CARGAR PREGUNTA
═══════════════════════════════════════════ */
function updateAudioButtonUI(index, isPlaying, progress = 0) {
  const btn = document.getElementById("ans-audio-" + index);
  if (!btn) return;

  btn.classList.toggle("playing", isPlaying);
  btn.textContent = isPlaying ? "⏸️ Pausar" : "▶️ Play";
}

function stopActiveAudio() {
  if (state.activeAudio) {
    state.activeAudio.pause();
    state.activeAudio.currentTime = 0;
  }

  if (state.activeAudioIndex !== null) {
    updateAudioButtonUI(state.activeAudioIndex, false, 0);
  }

  state.activeAudio = null;
  state.activeAudioIndex = null;
}

function toggleAnswerAudio(index) {
  if (state.answered) return;

  const q =
    QUESTIONS[
      state.retryingFailed
        ? state.retryQueue[state.failedIndex]
        : state.currentQ
    ];
  const answer = q.a[index];
  const audioUrl = answer && answer.audio ? answer.audio : null;
  const btn = document.getElementById("ans-audio-" + index);

  if (!audioUrl || !btn) return;

  if (state.activeAudio && state.activeAudioIndex === index) {
    if (state.activeAudio.paused) {
      state.activeAudio.play().catch(() => {
        updateAudioButtonUI(index, false, 0);
        state.activeAudio = null;
        state.activeAudioIndex = null;
      });
      updateAudioButtonUI(
        index,
        true,
        (state.activeAudio.currentTime /
          Math.max(state.activeAudio.duration || 1, 1)) *
          100,
      );
    } else {
      state.activeAudio.pause();
      updateAudioButtonUI(
        index,
        false,
        (state.activeAudio.currentTime /
          Math.max(state.activeAudio.duration || 1, 1)) *
          100,
      );
    }
    return;
  }

  stopActiveAudio();

  const audio = new Audio(audioUrl);
  state.activeAudio = audio;
  state.activeAudioIndex = index;
  updateAudioButtonUI(index, true, 0);

  const syncProgress = () => {
    if (!state.activeAudio || state.activeAudio !== audio) return;
    const ratio = audio.duration
      ? (audio.currentTime / audio.duration) * 100
      : 0;
    updateAudioButtonUI(index, !audio.paused, ratio);
  };

  audio.addEventListener("timeupdate", syncProgress);
  audio.addEventListener("play", syncProgress);
  audio.addEventListener("pause", syncProgress);
  audio.addEventListener("ended", () => {
    if (state.activeAudio === audio) {
      updateAudioButtonUI(index, false, 100);
      state.activeAudio = null;
      state.activeAudioIndex = null;
    }
  });

  audio.play().catch(() => {
    updateAudioButtonUI(index, false, 0);
    state.activeAudio = null;
    state.activeAudioIndex = null;
  });
}

function loadQuestion() {
  let qIndex = state.currentQ;

  if (state.retryingFailed && state.failedIndex < state.retryQueue.length) {
    qIndex = state.retryQueue[state.failedIndex];
  }

  stopActiveAudio();

  const q = QUESTIONS[qIndex];
  const idx = state.currentQ;
  const progress = state.retryingFailed
    ? ((state.failedIndex || 0) / Math.max(state.retryQueue.length, 1)) * 100
    : (idx / 10) * 100;

  document.getElementById("question-text").textContent = q.q;
  document.getElementById("q-counter").textContent = state.retryingFailed
    ? `Reintento: ${state.failedIndex + 1} de ${state.retryQueue.length}`
    : `Pregunta ${idx + 1} de 10`;
  document.getElementById("progress-fill").style.width = `${progress}%`;
  document.getElementById("q-prize-label").textContent = getNextPrizeLabel();

  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById("ans-" + i);
    const textEl = document.getElementById("ans-text-" + i);
    const imgEl = document.getElementById("ans-img-" + i);
    const audioBtn = document.getElementById("ans-audio-" + i);
    const answer = q.a[i];

    if (answer && answer.img) {
      textEl.textContent = answer.text;
      imgEl.src = answer.img;
      imgEl.classList.add("visible");
    } else if (answer && answer.text) {
      textEl.textContent = answer.text;
      imgEl.classList.remove("visible");
    } else {
      textEl.textContent = answer;
      imgEl.classList.remove("visible");
    }

    if (answer && answer.audio) {
      audioBtn.style.display = "inline-flex";
      updateAudioButtonUI(i, false, 0);
      audioBtn.onclick = (event) => {
        event.stopPropagation();
        toggleAnswerAudio(i);
      };
      audioBtn.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          toggleAnswerAudio(i);
        }
      };
    } else {
      audioBtn.style.display = "none";
      audioBtn.onclick = null;
      audioBtn.onkeydown = null;
    }

    btn.className = "answer-btn";
  }

  updateLifelineButtons();
  updateLadder();

  state.answered = false;
  state.hiddenAnswers = [];
  state.audienceHint = null;

  soundQuestion();
}

/* ═══════════════════════════════════════════
   SELECCIONAR RESPUESTA
═══════════════════════════════════════════ */
function selectAnswer(idx) {
  if (state.answered) return;
  stopActiveAudio();
  state.answered = true;

  soundSelect();

  let currentQIndex = state.currentQ;
  if (state.retryingFailed && state.failedIndex < state.retryQueue.length) {
    currentQIndex = state.retryQueue[state.failedIndex];
  }

  const correct = QUESTIONS[currentQIndex].correct;
  document
    .querySelectorAll(".answer-btn")
    .forEach((btn) => btn.classList.add("disabled"));

  const selectedBtn = document.getElementById("ans-" + idx);

  if (idx === correct) {
    setTimeout(() => {
      selectedBtn.classList.add("correct");
      soundCorrect();
    }, 600);

    setTimeout(() => {
      state.correctCount++;
      const prize = getPrizeForCorrectCount(state.correctCount);
      const isFinal = state.correctCount >= 10;

      if (state.retryingFailed) {
        if (!state.correctedFailed.includes(currentQIndex)) {
          state.correctedFailed.push(currentQIndex);
        }
        state.failedIndex++;

        const roundDone = state.failedIndex >= state.retryQueue.length;
        const pending = getPendingFailedQuestions();
        const allResolved = pending.length === 0;

        const goNext = () => {
          if (roundDone) {
            if (allResolved) {
              showWin();
            } else {
              soundPrize();
              showFailedQuestionsModal();
            }
          } else {
            soundLevelUp();
            loadQuestion();
            showScreen("game");
          }
        };

        if (prize) {
          soundPrize();
          if (isFinal) {
            showPrize(prize, true, showWin);
          } else {
            showPrize(prize, false, goNext);
          }
        } else {
          goNext();
        }
      } else {
        state.currentQ++;
        const passComplete = state.currentQ >= 10;
        if (passComplete) {
          document.getElementById("progress-fill").style.width = "100%";
        }

        const goNext = () => {
          if (passComplete) {
            if (getPendingFailedQuestions().length > 0) {
              showFailedQuestionsModal();
            } else {
              showWin();
            }
          } else {
            soundLevelUp();
            loadQuestion();
            showScreen("game");
          }
        };

        if (prize) {
          soundPrize();
          showPrize(prize, isFinal, goNext);
        } else {
          goNext();
        }
      }
    }, 1800);
  } else {
    setTimeout(() => {
      selectedBtn.classList.add("wrong");
      soundWrong();
    }, 600);

    setTimeout(() => {
      if (state.retryingFailed) {
        // Sigue fallada: no se pierde, se reintentará en la próxima ronda
        state.failedIndex++;
        const roundDone = state.failedIndex >= state.retryQueue.length;

        if (roundDone) {
          soundPrize();
          showFailedQuestionsModal();
        } else {
          soundLevelUp();
          loadQuestion();
        }
      } else {
        if (state.failedQuestions.indexOf(state.currentQ) === -1) {
          state.failedQuestions.push(state.currentQ);
        }
        state.currentQ++;
        if (state.currentQ >= 10) {
          if (state.failedQuestions.length > 0) {
            soundPrize();
            showFailedQuestionsModal();
          } else {
            showWin();
          }
        } else {
          soundLevelUp();
          loadQuestion();
        }
      }
    }, 1800);
  }
}

/* ═══════════════════════════════════════════
   COMODINES
═══════════════════════════════════════════ */

function useLifeline(type) {
  if (state.lifelines[type] || state.answered) return;
  state.lifelines[type] = true;
  updateLifelineButtons();
  soundLifeline();

  let currentQIndex = state.currentQ;
  if (state.retryingFailed && state.failedIndex < state.retryQueue.length) {
    currentQIndex = state.retryQueue[state.failedIndex];
  }

  const correct = QUESTIONS[currentQIndex].correct;

  if (type === "fifty") {
    const wrong = [0, 1, 2, 3]
      .filter((i) => i !== correct)
      .sort(() => Math.random() - 0.5);
    state.hiddenAnswers = [wrong[0], wrong[1]];
    state.hiddenAnswers.forEach((i) =>
      document.getElementById("ans-" + i).classList.add("hidden-ans"),
    );
  } else if (type === "audience") {
    state.audienceHint = correct;
    document.getElementById("ans-" + correct).classList.add("audience-hint");
    showAudienceModal(correct);
  } else if (type === "call") {
    showCallModal(correct, currentQIndex);
  }
}

function updateLifelineButtons() {
  ["fifty", "audience", "call"].forEach((type) => {
    document
      .getElementById("lifeline-" + type)
      .classList.toggle("used", state.lifelines[type]);
  });
}

/* ═══════════════════════════════════════════
   ESCALERA
═══════════════════════════════════════════ */

function updateLadder() {
  const items = getLadderItems();

  const activeRealIndex = state.retryingFailed
    ? state.retryQueue[state.failedIndex]
    : state.currentQ;

  for (let i = 0; i < 10; i++) {
    const el = document.getElementById("ladder-" + (i + 1));
    if (!el) continue;

    const label = items[i];
    const isGift = label.startsWith("Regalo");

    el.querySelector(".l-label").textContent = label;
    el.querySelector(".l-icon").textContent = isGift ? "🎁" : "";
    el.classList.toggle("milestone", isGift);
    el.classList.remove("current", "done", "wrong");

    const wasFailed = state.failedQuestions.includes(i);
    const wasCorrected = state.correctedFailed.includes(i);

    // Ya resuelta correctamente: o no falló nunca, o falló pero ya se corrigió en el reintento
    const isResolvedCorrect = !wasFailed || wasCorrected;
    // Fallada y todavía pendiente de reintentar (aún no le ha tocado)
    const isPendingRetry = wasFailed && !wasCorrected;

    if (i === activeRealIndex) {
      el.classList.add("current");
    } else if (state.retryingFailed) {
      // En el reintento: lo resuelto se queda "done" esté donde esté,
      // y solo lo pendiente de reintentar se marca como "wrong"
      if (isResolvedCorrect) {
        el.classList.add("done");
      } else if (isPendingRetry) {
        el.classList.add("wrong");
      }
    } else {
      // Primera pasada: solo lo ya jugado (antes de currentQ) se marca
      if (i < state.currentQ) {
        el.classList.add(isPendingRetry ? "wrong" : "done");
      }
    }
  }
}

function getLadderItems() {
  const items = new Array(10);
  for (let i = 0; i < 10; i++) items[i] = `Pregunta ${i + 1}`;

  const sortedPrizes = [...PRIZES].sort((a, b) => a.after - b.after);

  // ¿Está esta pregunta resuelta correctamente AHORA MISMO?
  // (nunca falló, o falló pero ya se corrigió en algún reintento)
  const isResolved = (i) => {
    const wasFailed = state.failedQuestions.includes(i);
    return !wasFailed || state.correctedFailed.includes(i);
  };

  // 1) Recorre las 10 posiciones en orden y cuenta las que YA están
  //    resueltas (sea porque no fallaron nunca, sea porque ya se
  //    corrigieron en un reintento anterior)
  let correctSoFar = 0;
  let giftPointer = 0;

  for (let i = 0; i < 10; i++) {
    if (isResolved(i)) {
      correctSoFar++;
      if (
        giftPointer < sortedPrizes.length &&
        correctSoFar === sortedPrizes[giftPointer].after
      ) {
        items[i] = `Regalo #${giftPointer + 1}`;
        giftPointer++;
      }
    }
  }

  // 2) Proyecta los regalos que aún quedan por entregar sobre las
  //    preguntas que TODAVÍA están pendientes de corregir, en el
  //    orden en que se van a volver a intentar.
  const pending = state.failedQuestions.filter(
    (i) => !state.correctedFailed.includes(i),
  );

  pending.forEach((i) => {
    correctSoFar++;
    if (
      giftPointer < sortedPrizes.length &&
      correctSoFar === sortedPrizes[giftPointer].after
    ) {
      items[i] = `Regalo #${giftPointer + 1}`;
      giftPointer++;
    }
  });

  return items;
}

/* ═══════════════════════════════════════════
   PREMIOS
═══════════════════════════════════════════ */

function showPrize(prize, isFinal, nextAction) {
  document.getElementById("prize-icon").textContent = prize.icon;
  document.getElementById("prize-title").textContent = prize.title;
  document.getElementById("prize-desc").textContent = prize.desc;
  document.getElementById("prize-hint").textContent = prize.hint;

  const btn = document.getElementById("prize-btn");
  if (isFinal) {
    btn.textContent = "Ver resultado final 🎉";
    btn.onclick =
      nextAction ||
      (() => {
        if (state.failedQuestions.length > 0) {
          showScreen("game");
          showFailedQuestionsModal();
        } else {
          showWin();
        }
      });
  } else {
    btn.textContent = "Seguir jugando ➡️";
    btn.onclick = nextAction || continuePlaying;
  }
  showScreen("prize");
}

function continuePlaying() {
  loadQuestion();
  showScreen("game");
}

function showWin() {
  soundWin();
  showScreen("win");
}

/* ═══════════════════════════════════════════
   MODALES
═══════════════════════════════════════════ */

function openModal(icon, title, bodyHTML, closeTxt) {
  document.getElementById("modal-icon").textContent = icon;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML = bodyHTML;
  document.getElementById("modal-close-btn").textContent = closeTxt || "Cerrar";
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function showFailedQuestionsModal() {
  const pending = getPendingFailedQuestions();
  const count = pending.length;
  const text =
    count === 1 ? "Fallaste 1 pregunta 💔" : `Fallaste ${count} preguntas 💔`;

  const bodyHTML = `
    <p style="margin-bottom: 16px;">
      Pero no te preocupes, puedes seguir intentándolo hasta acertarlas todas 💖
    </p>
    <p style="font-size: 13px; color: rgba(255,255,255,0.7);">
      Preguntas a reintentar: <strong>${count}</strong>
    </p>
  `;

  openModal("🎲", text, bodyHTML, "Aceptar desafío");
  document.getElementById("modal-close-btn").onclick = () => {
    closeModal();
    startRetryRound();
  };
}

function showWrongModal() {
  openModal(
    "💔",
    "¡Fallaste!",
    "No pasa nada amor, lo importante es que lo has intentado. ¿Volvemos a empezar?",
    "🔁 Jugar de nuevo",
  );
  document.getElementById("modal-close-btn").onclick = restartGame;
}

function showAudienceModal(correct) {
  const letters = ["A", "B", "C", "D"];
  const pcts = [0, 1, 2, 3].map((i) =>
    i === correct
      ? Math.floor(Math.random() * 20 + 60)
      : Math.floor(Math.random() * 10 + 2),
  );
  const total = pcts.reduce((a, b) => a + b, 0);
  const norm = pcts.map((p) => Math.round((p / total) * 100));

  const bars = norm
    .map(
      (pct, i) => `
    <div class="audience-bar-row">
      <span class="bar-letter">${letters[i]}</span>
      <div class="bar-track">
        <div class="bar-fill ${i === correct ? "correct-bar" : "wrong-bar"}" style="width:${pct}%"></div>
      </div>
      <span class="bar-pct">${pct}%</span>
    </div>`,
    )
    .join("");

  openModal("👥", "El público ha votado", bars, "Entendido");
  document.getElementById("modal-close-btn").onclick = closeModal;
}

function getAnswerTextForQuestion(qIndex, correctIndex) {
  const answer = QUESTIONS[qIndex].a[correctIndex];
  return typeof answer === "string" ? answer : answer.text;
}

function showCallModal(correct, qIndex) {
  const letters = ["A", "B", "C", "D"];
  const answerLetter = letters[correct] || "?";
  const answerText = getAnswerTextForQuestion(qIndex, correct);
  const answer = answerLetter + ', "' + answerText + '"';
  const hint = `${CALL_HINT.replace("B", answer)}`;

  openModal(
    "📞",
    "Llamando a mamá...",
    `<em>${hint}</em>`,
    "Colgar",
  );
  document.getElementById("modal-close-btn").onclick = closeModal;
}

/* ═══════════════════════════════════════════
   REINICIAR
═══════════════════════════════════════════ */

function restartGame() {
  closeModal();
  state = {
    currentQ: 0,
    answered: false,
    hiddenAnswers: [],
    audienceHint: null,
    lifelines: { fifty: false, audience: false, call: false },
    failedQuestions: [],
    correctedFailed: [],
    retryingFailed: false,
    retryQueue: [],
    failedIndex: 0,
    correctCount: 0,
  };
  showScreen("intro");
}

/* ═══════════════════════════════════════════
   ESTRELLAS EN CANVAS
═══════════════════════════════════════════ */

function initStars() {
  const canvas = document.getElementById("stars-canvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const stars = Array.from({ length: 130 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.008 + 0.003,
    dir: Math.random() > 0.5 ? 1 : -1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      s.alpha += s.speed * s.dir;
      if (s.alpha >= 1 || s.alpha <= 0.05) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════
   ARRANQUE
═══════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initStars();
});
