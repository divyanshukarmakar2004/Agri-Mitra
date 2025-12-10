// Static farmers data with IDs matching your RTDB keys

export const FARMERS = [
  {
    id: "1758864587530",
    nameKey: "1758864587530",
    cityKey: "mahasamund",
    stateKey: "chhattisgarh",
    citylabel: "Mahasamund",
    state: "Chhattisgarh",
    email: "divyanshu@gmail.com",
    phone: "8103222607",
  },
  {
    id: "1758865038656",
    nameKey: "1758865038656",
    cityKey: "jhansi",
    stateKey: "up",
    citylabel: "Jhansi",
    state: "UP",
    email: "sagar@gmail.com",
    phone: "9867437348",
  },
  {
    id: "1758865093378",
    nameKey: "1758865093378",
    cityKey: "chennai",
    stateKey: "tamil_nadu",
    citylabel: "Chennai",
    state: "Tamil Nadu",
    email: "uday@gmail.com",
    phone: "8562365942",
  },
  {
    id: "1758865188981",
    nameKey: "1758865188981",
    cityKey: "vellore",
    stateKey: "tamil_nadu",
    citylabel: "Vellore",
    state: "Tamil Nadu",
    email: "atharva@gmail.com",
    phone: "8952364586",
  },
  {
    id: "1758865135352",
    nameKey: "1758865135352",
    cityKey: "bangalore",
    stateKey: "karnataka",
    citylabel: "Banglore",
    state: "Karnataka",
    email: "eshaan@gmail.com",
    phone: "8569236325",
  },
];

export const FARMERS_BY_ID = Object.fromEntries(FARMERS.map((f) => [f.id, f]));
