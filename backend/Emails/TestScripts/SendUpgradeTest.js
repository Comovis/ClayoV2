const { sendUpgradeEmail } = require('../SendUpgradeEmail');

async function testSendUpgradeEmail() {
  try {
    const testEmail = 'vitrexpur@gmail.com';
    console.log(`Simulating sending upgrade email to ${testEmail}...`);
    await sendUpgradeEmail(testEmail);
    console.log('Upgrade email simulation completed.');
  } catch (error) {
    console.error('Error simulating upgrade email:', error);
  }
}

testSendUpgradeEmail();
