// Esegui una richiesta GET al sito web
const classe = 4;
const sezione = 'E';
const url = 'https://corsproxy.org/?' + encodeURIComponent(`https://www.itisfermi.edu.it/Orario/Classi/${classe}${sezione}.html`);
fetch(url)
    .then(response => response.text())
    .then(html => {
        // Crea un nuovo DOMParser
        let parser = new DOMParser();

        // Analizza l'HTML
        let doc = parser.parseFromString(html, 'text/html');

        let schedule = [];
        let rowspan = [];

        // Trova tutte le righe della tabella
        let rows = doc.querySelectorAll('table tr');

        rows.forEach((row, i) => {
            let cells = row.querySelectorAll('td');

            cells.forEach((cell, j) => {
                let cellText = cell.textContent.trim();
                let cellRowspan = cell.getAttribute('rowspan');

                if (!schedule[i]) {
                    schedule[i] = [];
                }

                // Se la cella è occupata, spostati alla cella successiva
                while (schedule[i][j]) {
                    j++;
                }

                schedule[i][j] = cellText;

                if (cellRowspan && parseInt(cellRowspan) > 1) {
                    for (let k = 1; k < parseInt(cellRowspan); k++) {
                        if (!schedule[i + k]) {
                            schedule[i + k] = [];
                        }
                        schedule[i + k][j] = cellText;
                    }
                }
            });
        });

        console.log(schedule[1][2]);
    })
    .catch(error => {
        console.error(error);
    });