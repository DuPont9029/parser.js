const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const csvWriter = require('fast-csv').write;

axios.get('https://www.itisfermi.edu.it/Orario/Classi/4E.html')
    .then(response => {
        let html = response.data;
        let $ = cheerio.load(html);
        let schedule = [];
        let rowspan = [];

        $('table tr').each((i, row) => {
            $(row).find('td').each((j, cell) => {
                let cellText = $(cell).text().trim();
                let cellRowspan = $(cell).attr('rowspan');

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

        let ws = fs.createWriteStream('schedule.csv');
        csvWriter(schedule).pipe(ws);
    })
    .catch(error => {
        console.error(error);
    });