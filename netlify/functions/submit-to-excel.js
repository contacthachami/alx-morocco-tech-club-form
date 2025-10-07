// ALX Morocco Tech Club - Power Automate Bridge Function
// This function receives form data from Netlify and forwards it to Power Automate

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the incoming form data
    const formData = JSON.parse(event.body);
    
    console.log('Received form data:', formData);

    // Prepare data for Power Automate (matching your Excel columns)
    const excelData = {
      fullName: formData.fullName || '',
      age: parseInt(formData.age) || 0,
      email: formData.email || '',
      phoneNumber: formData.phoneNumber || '',
      currentCohort: formData.currentCohort || '',
      currentProgram: formData.currentProgram || '',
      hubLocation: formData.hubLocation || '',
      volunteerRole: formData.volunteerRole || '',
      timeCommitment: formData.timeCommitment || '',
      motivation: formData.motivation || '',
      experience: formData.experience || '',
      resourceLink: formData.resourceLink || '',
      submittedAt: new Date().toISOString(),
      status: 'New'
    };

    // Your Power Automate webhook URL will go here
    // For now, we'll simulate the success and log the data
    const powerAutomateUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL || 'PLACEHOLDER_WEBHOOK_URL';
    
    if (powerAutomateUrl === 'PLACEHOLDER_WEBHOOK_URL') {
      // Log the data for now (will work once we get the webhook URL)
      console.log('Excel data prepared:', excelData);
      
      // Simulate successful submission
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Form submitted successfully. Data prepared for Excel integration.',
          data: excelData
        })
      };
    }

    // Send to Power Automate (when webhook URL is available)
    const response = await fetch(powerAutomateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(excelData)
    });

    if (response.ok) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Form submitted successfully to Excel via Power Automate!' 
        })
      };
    } else {
      throw new Error(`Power Automate responded with status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to process form submission. Please try again.' 
      })
    };
  }
};