import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';

let qCount = 0;

// Üzenetküldő rendszer
function showStatus(text, type = 'success') {
    const el = document.getElementById('custom-notification');
    const msg = document.getElementById('notif-message');
    msg.innerText = text;
    el.className = `notification-visible ${type === 'success' ? 'success-mode' : 'error-mode'}`;
    setTimeout(() => { el.className = 'notification-hidden'; }, 3000);
}

// Új kérdés blokk létrehozása
function insertNewQuestion() {
    qCount++;
    const container = document.getElementById('questionsContainer');
    const qDiv = document.createElement('div');
    qDiv.className = 'question-card';
    qDiv.innerHTML = `
        <div style="color: #4A90E2; font-weight: bold; margin-bottom: 10px;">${qCount}. FELADAT</div>
        <input type="text" class="q-input" placeholder="Kérdés (pl. Mennyi 5x5?)" required>
        <input type="text" class="a-input" placeholder="Helyes válasz (pl. 25)" required>
    `;
    container.appendChild(qDiv);
}

// Mentési folyamat
async function performFirebaseUpload() {
    const title = document.getElementById('taskTitle').value.trim();
    const key = document.getElementById('targetClassKey').value.toUpperCase().trim();
    const desc = document.getElementById('taskDescription').value.trim();
    const diff = document.getElementById('difficulty').value;
    const color = document.getElementById('themeColor').value;

    const cards = document.querySelectorAll('.question-card');
    const questionsList = [];

    cards.forEach(c => {
        const q = c.querySelector('.q-input').value.trim();
        const a = c.querySelector('.a-input').value.trim();
        if (q !== "" && a !== "") {
            questionsList.push({ question: q, answer: a });
        }
    });

    // Ellenőrzés
    if (!title || !key || questionsList.length === 0) {
        showStatus("Kérlek töltsd ki a címet, a kulcsot és legalább egy kérdést!", "error");
        document.getElementById('finalStepOverlay').style.display = 'none';
        return;
    }

    try {
        const saveBtn = document.getElementById('btnFinalSave');
        saveBtn.disabled = true;
        saveBtn.innerText = "Feltöltés...";

        // CÉL: LearnIT Task gyűjtemény
        await addDoc(collection(db, "LearnIT Task"), {
            title: title,
            classKey: key,
            description: desc,
            difficulty: diff,
            themeColor: color,
            questions: questionsList,
            createdAt: serverTimestamp()
        });

        document.getElementById('finalStepOverlay').style.display = 'none';
        showStatus("Sikeresen publikálva! Irány a lista...");

        setTimeout(() => {
            window.location.href = 'LearnIT.teacher.html';
        }, 2000);

    } catch (err) {
        console.error("Hiba:", err);
        showStatus("Hiba történt a mentéskor!", "error");
        document.getElementById('btnFinalSave').disabled = false;
        document.getElementById('btnFinalSave').innerText = "IGEN, PUBLIKÁLOM!";
    }
}

// Indítás és gombok összekötése
document.addEventListener('DOMContentLoaded', () => {
    
    // Első kérdés automatikusan
    insertNewQuestion();

    // Kérdés hozzáadása gomb
    document.getElementById('btnAddQ').onclick = insertNewQuestion;

    // Mentési ablak megnyitása
    document.getElementById('btnShowSave').onclick = () => {
        document.getElementById('finalStepOverlay').style.display = 'flex';
    };

    // Mentési ablak bezárása
    document.getElementById('btnCancelStep').onclick = () => {
        document.getElementById('finalStepOverlay').style.display = 'none';
    };

    // Tényleges mentés gomb
    document.getElementById('btnFinalSave').onclick = performFirebaseUpload;
});