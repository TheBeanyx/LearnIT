import { db, collection, getDocs, query, where } from './firebase-config.js';

// --- KERESÉS ÉS MEGJELENÍTÉS ---
window.executeComplexSearch = async function() {
    const searchKey = document.getElementById('classKeySearch').value.toUpperCase().trim();
    const taskGrid = document.getElementById('taskGrid');

    if (!searchKey) {
        alert("Kérlek add meg a kulcsot!");
        return;
    }

    taskGrid.innerHTML = '<p style="text-align:center;">Keresés...</p>';

    try {
        // Frissítve: LearnIT Task gyűjteményben keresünk classKey alapján
        const q = query(collection(db, "LearnIT Task"), where("classKey", "==", searchKey));
        const querySnapshot = await getDocs(q);
        
        taskGrid.innerHTML = '';

        if (querySnapshot.empty) {
            taskGrid.innerHTML = '<p style="text-align:center;">Nincs ilyen kulcsú feladat.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'task-card';
            // A tanár által választott színt használjuk a szegélyhez
            card.style.borderLeft = `8px solid ${data.themeColor || '#4A90E2'}`;
            
            card.innerHTML = `
                <div class="task-body">
                    <span class="difficulty ${data.difficulty || 'medium'}">${data.difficulty || 'Közepes'}</span>
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    <small><i class="fas fa-layer-group"></i> ${data.questions ? data.questions.length : 0} kérdés</small>
                </div>
            `;
            card.onclick = () => window.openModalWithData(data);
            taskGrid.appendChild(card);
        });
    } catch (e) {
        console.error("Hiba a keresésnél:", e);
    }
};

// --- MODAL ÉS KVÍZ LOGIKA ---
let currentTaskData = null;

window.openModalWithData = function(data) {
    currentTaskData = data;
    document.getElementById('m-title').innerText = data.title;
    document.getElementById('m-desc').innerText = data.description;
    
    const qList = document.getElementById('m-questions');
    qList.innerHTML = '';
    
    // Előnézet: Csak a kérdéseket mutatjuk meg
    data.questions.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerText = `${index + 1}. ${item.question}`;
        qList.appendChild(li);
    });

    document.getElementById('taskModal').style.display = 'block';
};

window.closeModal = function() {
    document.getElementById('taskModal').style.display = 'none';
};

// --- A JÁTÉK (KVÍZ) INDÍTÁSA ---
window.startQuiz = function() {
    if (!currentTaskData || !currentTaskData.questions) return;

    const modalData = document.getElementById('modalData');
    modalData.innerHTML = `<h2>${currentTaskData.title}</h2><div id="quizContainer"></div>`;
    
    const container = document.getElementById('quizContainer');

    currentTaskData.questions.forEach((item, index) => {
        const qDiv = document.createElement('div');
        qDiv.style.marginBottom = "20px";
        qDiv.style.padding = "15px";
        qDiv.style.background = "#f9f9f9";
        qDiv.style.borderRadius = "10px";
        
        qDiv.innerHTML = `
            <p><strong>${index + 1}. ${item.question}</strong></p>
            <input type="text" class="student-answer" data-index="${index}" placeholder="Válaszod..." 
                   style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px;">
        `;
        container.appendChild(qDiv);
    });

    const finishBtn = document.createElement('button');
    finishBtn.innerText = "Ellenőrzés";
    finishBtn.className = "btn-start-final";
    finishBtn.onclick = checkAnswers;
    container.appendChild(finishBtn);
};

function checkAnswers() {
    const inputs = document.querySelectorAll('.student-answer');
    let correctCount = 0;

    inputs.forEach(input => {
        const index = input.getAttribute('data-index');
        const studentAnswer = input.value.trim().toLowerCase();
        const correctAnswer = currentTaskData.questions[index].answer.trim().toLowerCase();

        if (studentAnswer === correctAnswer) {
            correctCount++;
            input.style.borderColor = "#2ecc71";
            input.style.background = "#eafff0";
        } else {
            input.style.borderColor = "#e74c3c";
            input.style.background = "#fff0f0";
            // Megmutatjuk a jó választ is hiba esetén
            const hint = document.createElement('small');
            hint.innerText = ` Helyes válasz: ${currentTaskData.questions[index].answer}`;
            hint.style.color = "#e74c3c";
            input.parentNode.appendChild(hint);
        }
    });

    alert(`Eredmény: ${correctCount} / ${currentTaskData.questions.length} helyes válasz!`);
}

// Bezárás gomb az ablakon kívülre kattintva
window.onclick = function(event) {
    const modal = document.getElementById('taskModal');
    if (event.target == modal) closeModal();
};