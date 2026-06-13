const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const tables = {
        'CANDIDATE_TABLE': `<table><tr><th>Attribute</th><th>Data type</th><th>Constrain</th></tr><tr><td>candidate_id</td><td>Int(10)</td><td>Primary_key</td></tr><tr><td>name</td><td>Varchar(50)</td><td>Not Null</td></tr><tr><td>email</td><td>Varchar(50)</td><td>Not Null, Unique</td></tr><tr><td>resume_url</td><td>Varchar(100)</td><td>Not Null</td></tr></table>`,
        'JOB_TABLE': `<table><tr><th>Attribute</th><th>Data type</th><th>Constrain</th></tr><tr><td>job_id</td><td>Int(10)</td><td>Primary_key</td></tr><tr><td>title</td><td>Varchar(50)</td><td>Not Null</td></tr><tr><td>required_skills</td><td>Varchar(255)</td><td>Not Null</td></tr><tr><td>cutoff_score</td><td>Float</td><td>Not Null</td></tr></table>`,
        'APPLICATION_TABLE': `<table><tr><th>Attribute</th><th>Data type</th><th>Constrain</th></tr><tr><td>application_id</td><td>Int(10)</td><td>Primary_key</td></tr><tr><td>candidate_id</td><td>Int(10)</td><td>Foreign_key</td></tr><tr><td>job_id</td><td>Int(10)</td><td>Foreign_key</td></tr><tr><td>status</td><td>Varchar(30)</td><td>Not Null</td></tr></table>`,
        'ASSESSMENT_TABLE': `<table><tr><th>Attribute</th><th>Data type</th><th>Constrain</th></tr><tr><td>assessment_id</td><td>Int(10)</td><td>Primary_key</td></tr><tr><td>application_id</td><td>Int(10)</td><td>Foreign_key</td></tr><tr><td>score</td><td>Float</td><td>Not Null</td></tr></table>`,
        'INTERVIEW_TABLE': `<table><tr><th>Attribute</th><th>Data type</th><th>Constrain</th></tr><tr><td>interview_id</td><td>Int(10)</td><td>Primary_key</td></tr><tr><td>application_id</td><td>Int(10)</td><td>Foreign_key</td></tr><tr><td>behavioral_score</td><td>Float</td><td>Not Null</td></tr></table>`,
        'SCHEDULE_TABLE': `<table><tr><th>Attribute</th><th>Data type</th><th>Constrain</th></tr><tr><td>schedule_id</td><td>Int(10)</td><td>Primary_key</td></tr><tr><td>application_id</td><td>Int(10)</td><td>Foreign_key</td></tr><tr><td>time_slot</td><td>Varchar(50)</td><td>Not Null</td></tr></table>`
    };

    const css = `<style>
        body { font-family: "Times New Roman", Times, serif; background: white; padding: 20px; display: inline-block; }
        table { border-collapse: collapse; width: 600px; border: 2px solid black; }
        th, td { border: 1px solid black; padding: 12px; text-align: left; color: black; font-size: 18px; }
        th { font-weight: bold; background: white; }
    </style>`;

    for (const [name, html] of Object.entries(tables)) {
        await page.setContent(css + html);
        const element = await page.$('table');
        await element.screenshot({ path: `C:\\Users\\Helios\\Downloads\\${name}.png` });
    }
    await browser.close();
}
run();
