// This file will contain dummy passwords for LGA admin login.
// In a real application, these credentials should be stored securely (e.g., in a database)
// and passwords should be hashed.

const lgaCredentials = {
  'Bassa': 'Bassa123',
  'Barkin Ladi': 'Barkin Ladi123',
  'Bokkos': 'Bokkos123',
  'Jos North': 'Jos North123',
  'Jos South': 'Jos South123',
  'Jos East': 'Jos East123',
  'Kanam': 'Kanam123',
  'Kanke': 'Kanke123',
  'Langtang North': 'Langtang North123',
  'Langtang South': 'Langtang South123',
  'Mangu': 'Mangu123',
  'Mikang': 'Mikang123',
  'Pankshin': 'Pankshin123',
  'Qua’an Pan': 'Qua’an Pan123',
  'Riyom': 'Riyom123',
  'Shendam': 'Shendam123',
  'Wase': 'Wase123',
};

export function authenticateLgaAdmin(lga, passcode) {
  if (!lga || !passcode) {
    return { success: false, message: 'LGA and passcode are required.' };
  }

  const expectedPasscode = lgaCredentials[lga];

  if (expectedPasscode && expectedPasscode === passcode) {
    return { success: true, message: 'Login successful!' };
  } else {
    return { success: false, message: 'Invalid LGA or passcode.' };
  }
}