import { FormData } from '../types';

type LeadData = [string, string, string]; // [company, website, description]

export async function generateLeads(formData: FormData) {
  console.log('Sending request to webhook:', formData);

  const response = await fetch('https://hook.eu2.make.com/r8kip3perjxr6tndcwn5c9bglff731ab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      productName: formData.productName,
      productDescription: formData.productDescription,
      location: formData.location
    })
  });

  let responseText;
  if (!response.ok) {
    try {
      responseText = await response.text();
      console.error('Webhook error response:', responseText);
    } catch (e) {
      console.error('Failed to read error response');
    }
    throw new Error(`Failed to connect to lead generation service: ${response.status}`);
  }

  try {
    responseText = await response.text();
    
    if (!responseText) {
      throw new Error('Empty response from service');
    }

    console.log('Raw webhook response:', responseText);
    // Clean and parse the response
    const cleanedResponse = responseText
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim().replace(/,$/, ''))
      .join(',');

    const leads = JSON.parse(`[${cleanedResponse}]`) as LeadData[];

    console.log('Parsed webhook response:', leads);

    if (!Array.isArray(leads)) {
      console.error('Invalid response structure:', leads);
      throw new Error('Invalid response from lead generation service');
    }

    if (leads.length === 0) {
      throw new Error('No leads generated');
    }

    return leads;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('JSON parse error:', error, 'Response text:', responseText);
      throw new Error('Invalid response format from lead generation service');
    }
    throw error;
  }
}