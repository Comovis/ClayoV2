const { sendDowngradeEmail } = require('../SendDowngradeEmail'); // Adjust the path as necessary

async function testSendDowngradeEmail() {
  try {
    const testEmail = 'vitrexpur@gmail.com';
    console.log(`Simulating sending downgrade email to ${testEmail}...`);
    await sendDowngradeEmail(testEmail);
    console.log('Downgrade email simulation completed.');
  } catch (error) {
    console.error('Error simulating downgrade email:', error);
  }
}

testSendDowngradeEmail();
