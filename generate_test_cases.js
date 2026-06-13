const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set a wide viewport for the massive table
    await page.setViewport({ width: 1400, height: 800 });
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body { font-family: "Times New Roman", Times, serif; background: white; padding: 20px; display: inline-block; }
        table { border-collapse: collapse; width: 1300px; border: 2px solid black; }
        th, td { border: 1px solid black; padding: 12px; text-align: left; color: black; font-size: 16px; vertical-align: top; }
        th { font-weight: bold; background: white; text-align: center; }
        td:first-child { text-align: center; font-weight: bold; }
        .status { text-align: center; font-weight: bold; color: black; }
    </style>
    </head>
    <body>
        <table>
            <tr>
                <th>Sr.No</th>
                <th>Test Scenario</th>
                <th>Pre-requisite</th>
                <th>Test Data</th>
                <th>Steps</th>
                <th>Expected Result</th>
                <th>Actual Result</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>1</td>
                <td>Candidate Signup Validation</td>
                <td>Landing Page open</td>
                <td>Email: test@gmail</td>
                <td>1. Open Signup form<br>2. Enter improperly formatted email</td>
                <td>System should reject email syntax and display validation error.</td>
                <td>System rejected email and displayed syntax error.</td>
                <td class="status">PASSED</td>
            </tr>
            <tr>
                <td>2</td>
                <td>MCQ Evaluation & Sync</td>
                <td>- Authenticated<br>- Job role applied</td>
                <td>Role: AI Scientist</td>
                <td>1. Access MCQ Phase<br>2. Answer all generated questions<br>3. Submit Assessment</td>
                <td>Score should be evaluated and seamlessly synced to backend /receive-score.</td>
                <td>Score calculated and database sync successful.</td>
                <td class="status">PASSED</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Behavioral AI Video Analysis</td>
                <td>- MCQ Cleared<br>- Webcam & Microphone active</td>
                <td>N/A</td>
                <td>1. Start AI Video Interview<br>2. Complete verbal response<br>3. Exit Interview</td>
                <td>AI behavioral feedback and integrity score should be generated and stored.</td>
                <td>AI analysis completed and telemetry stored in database.</td>
                <td class="status">PASSED</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Coding Arena Sequential Navigation</td>
                <td>- AI Interview Cleared<br>- Coding Phase unlocked</td>
                <td>Hard Questions Bank</td>
                <td>1. Open Assessment Roadmap<br>2. Solve Coding Challenge 1<br>3. Attempt to navigate to Challenge 2</td>
                <td>'Next Challenge' button unlocks exclusively after Challenge 1 test cases pass.</td>
                <td>Navigation unlocked only upon clearing all test cases for Challenge 1.</td>
                <td class="status">PASSED</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Algorithmic Edge-Case Validation</td>
                <td>Median of Two Sorted Arrays challenge active</td>
                <td>nums1=[1,3]<br>nums2=[2]</td>
                <td>1. Implement algorithm<br>2. Click 'Run Tests'<br>3. Observe backend execution result</td>
                <td>Test case should compile and pass with output 2.00000.</td>
                <td>Test case passed with correct floating-point output.</td>
                <td class="status">PASSED</td>
            </tr>
            <tr>
                <td>6</td>
                <td>HR Dashboard Telemetry Sync</td>
                <td>Candidate successfully completed Coding Phase</td>
                <td>Solved: 1<br>Test Cases: 5</td>
                <td>1. Submit Coding Assessment<br>2. Login to Admin Dashboard<br>3. Review Candidate profile</td>
                <td>Dashboard should reflect granular telemetry: 1/2 Solved and 5 cleared Test Cases.</td>
                <td>Granular technical telemetry synced and visible to HR Admin.</td>
                <td class="status">PASSED</td>
            </tr>
            <tr>
                <td>7</td>
                <td>Admin Command Center Filtering</td>
                <td>- Candidates populated in DB<br>- Admin Access granted</td>
                <td>Filter Status: CODING_CLEARED</td>
                <td>1. Open Command Center UI<br>2. Select 'Coding Cleared' from global status filter</td>
                <td>List should instantly filter to only display candidates matching the selected status.</td>
                <td>Candidate grid filtered correctly in real-time.</td>
                <td class="status">PASSED</td>
            </tr>
            <tr>
                <td>8</td>
                <td>Proctoring Fullscreen Violation Alert</td>
                <td>Coding Interview active</td>
                <td>N/A</td>
                <td>1. Enter Fullscreen examination mode<br>2. Attempt to tab out or exit via ESC key</td>
                <td>System should detect integrity violation and auto-submit the examination.</td>
                <td>Security violation detected; test auto-submitted instantly.</td>
                <td class="status">PASSED</td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await page.setContent(html);
    const element = await page.$('table');
    await element.screenshot({ path: 'C:\\Users\\Helios\\Downloads\\Test_Cases.png' });
    await browser.close();
}
run();
