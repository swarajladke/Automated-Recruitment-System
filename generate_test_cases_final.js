const puppeteer = require('puppeteer');
const fs = require('fs');

async function generate() {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body { font-family: 'Times New Roman', serif; background: white; padding: 40px; }
      table { width: 100%; border-collapse: collapse; border: 2px solid black; }
      th, td { border: 1px solid black; padding: 35px 20px; text-align: left; font-size: 20px; line-height: 1.6; color: black; }
      th { font-weight: bold; background-color: #f2f2f2; padding: 30px 20px; }
      .pass { font-weight: bold; color: black; }
    </style>
    </head>
    <body>
    <div id="capture-area" style="display: inline-block; padding: 10px; background: white;">
    <table>
      <tr>
        <th>Test Case ID</th>
        <th>Module Tested</th>
        <th>Test Description</th>
        <th>Expected Result</th>
        <th>Actual Result</th>
        <th>Status</th>
      </tr>
      <tr><td>TC01</td><td>JWT Authentication</td><td>Verify secure login utilizing JWT for candidate access.</td><td>Generates valid auth token & grants portal access.</td><td>Token generated successfully, access granted.</td><td class="pass">Pass</td></tr>
      <tr><td>TC02</td><td>WebRTC Video Stream</td><td>Request and initialize webcam hardware access via the browser API.</td><td>Active video stream feeds directly into the UI.</td><td>Stream initialized without latency.</td><td class="pass">Pass</td></tr>
      <tr><td>TC03</td><td>WebRTC Audio Stream</td><td>Request and initialize microphone hardware access for speech capture.</td><td>Microphone successfully captures audio telemetry.</td><td>Audio captured and routed properly.</td><td class="pass">Pass</td></tr>
      <tr><td>TC04</td><td>OpenCV Face Detection</td><td>Evaluate the system's ability to track the candidate's facial landmarks in real-time.</td><td>Algorithm continuously locks onto the primary face.</td><td>Facial bounding box tracked accurately.</td><td class="pass">Pass</td></tr>
      <tr><td>TC05</td><td>Multiple Face Anomaly</td><td>Introduce a secondary person into the webcam frame to trigger integrity checks.</td><td>System instantly flags a "Multiple Persons" violation.</td><td>Violation triggered and logged to DB.</td><td class="pass">Pass</td></tr>
      <tr><td>TC06</td><td>YOLOv8 Object Detection</td><td>Introduce a mobile phone into the camera frame during the interview.</td><td>System detects unauthorized hardware and generates flag.</td><td>Phone identified, integrity flag generated.</td><td class="pass">Pass</td></tr>
      <tr><td>TC07</td><td>NLP Resume Parser</td><td>Upload a PDF resume to test the spaCy keyword extraction engine.</td><td>System extracts text and calculates affinity score.</td><td>Skills extracted and scored accurately.</td><td class="pass">Pass</td></tr>
      <tr><td>TC08</td><td>Speech-to-Text</td><td>Process the candidate's live audio feed through the transcription engine.</td><td>Audio is accurately transcribed into a text string.</td><td>Speech converted to text with high accuracy.</td><td class="pass">Pass</td></tr>
      <tr><td>TC09</td><td>Database Transaction</td><td>Commit the final calculated risk score and AI flags to PostgreSQL.</td><td>Data is securely persisted with no SQL errors.</td><td>Transaction committed, data verified in DB.</td><td class="pass">Pass</td></tr>
      <tr><td>TC10</td><td>Score Aggregation</td><td>Validate the mathematical logic calculating the final candidate threshold.</td><td>Algorithm outputs the correct weighted final score.</td><td>Final score calculated accurately.</td><td class="pass">Pass</td></tr>
    </table>
    </div>
    </body>
    </html>
    `;
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Increased height to ensure no clipping
    await page.setViewport({ width: 1400, height: 2500, deviceScaleFactor: 2 }); 
    await page.setContent(html);
    
    const element = await page.$('#capture-area');
    await element.screenshot({ path: 'C:\\Users\\Helios\\Downloads\\Test_Cases_Final.png' });
    
    await browser.close();
}
generate();
