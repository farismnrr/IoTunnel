import fetch from 'node-fetch';
import { spawn } from 'child_process';
import fs from 'fs';

interface SubscriptionData {
  data: {
    user_id: string;
    api_key: string;
  }[];
}

const url = process.env.API_ENDPOINT + '/api/v1/orders/subscription' || '';
async function fetchData() {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY || ''
      }
    });
    const rawData = await response.json();
    const data: SubscriptionData = rawData as SubscriptionData;
    data.data.forEach(async ({ user_id, api_key }) => {
      const filePath = '/etc/mosquitto/passwd';
      if (!fs.existsSync(filePath)) {
        console.log('File does not exist, creating...');
        const createFileChild = spawn('sudo', ['touch', filePath]);
        createFileChild.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        createFileChild.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        createFileChild.on('close', (code) => {
          console.log(`File creation process exited with code ${code}`);
          if (code === 0) {
            console.log('File created successfully.');
            // Proceed with the original command
            const child = spawn('sudo', ['mosquitto_passwd', '-b', filePath, user_id, api_key]);
            child.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });
            child.stderr.on('data', (data) => {
              console.error(`stderr: ${data}`);
            });
            child.on('close', (code) => {
              console.log(`child process exited with code ${code}`);
              // Restarting mosquitto service after password update
              const restartChild = spawn('sudo', ['systemctl', 'restart', 'mosquitto']);
              restartChild.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
              });
              restartChild.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
              });
              restartChild.on('close', (code) => {
                console.log(`Mosquitto service restart process exited with code ${code}`);
                // Check if the restart process was successful
                if (code === 0) {
                  console.log('Mosquitto service restarted successfully.');
                } else {
                  console.error('Failed to restart Mosquitto service.');
                }
              });
            });
          } else {
            console.error('Failed to create file.');
          }
        });
      } else {
        console.log('File exists, proceeding...');
        // Proceed with the original command
        const child = spawn('sudo', ['mosquitto_passwd', '-b', filePath, user_id, api_key]);
        child.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        child.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        child.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          // Restarting mosquitto service after password update
          const restartChild = spawn('sudo', ['systemctl', 'restart', 'mosquitto']);
          restartChild.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
          });
          restartChild.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });
          restartChild.on('close', (code) => {
            console.log(`Mosquitto service restart process exited with code ${code}`);
            // Check if the restart process was successful
            if (code === 0) {
              console.log('Mosquitto service restarted successfully.');
            } else {
              console.error('Failed to restart Mosquitto service.');
            }
          });
        });
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();
