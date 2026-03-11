export const TEST_NAMES: string[] = [
  "Jack & DP test",
  "CT Tests (Ratio, Polarity,WR)",
  "Measurement of voltage ratio at all taps",
  "Measurement of Vector Group Verification",
  "Measurement of Magnetic Balance test",
  "Measurement of No – Load Current at 415V",
  "Measurement of winding resistance at all taps on HV & LV",
  "Measurement of Insulation Resistance with PI B/F Dielectric",
  "2kV & 10kV Core Isolation test",
  "Measurement of Capacitance and Tan Delta for Windings & Bushing (Before dielectric)",
  "Oil BDV,DGA and PPM test before and after Dielectric",
  "Measurement of No load loss and excitation current at 90%,100%,110% of Rated Voltage (B/F Dielectric)",
  "Harmonics Measurement",
  "Lighting Impulse test with chopped wave on HV & LV winding",
  "Lighting Impulse test Neutral terminal",
  "Determination of Transient voltage",
  "Switching impulse Test",
  "Applied Voltage Test",
  "Induced Over Voltage Test With PD (IVPD)",
  "Measurement of load loss & impedance at normal and extreme taps",
  "Zero Phase Sequence measurement",
  "Test on OLTC",
  "Heatrun test (DGA B/F & A/F HRT) and HRT",
  "Completion of Heatrun test",
  "Thermography Test",
  "Power Taken by Fan loss",
  "Measurement of No load loss and excitation current at 90%,100%,110% of Rated Voltage (After Dielectric)",
  "Measurement of Sound Level",
  "Measurement of Insulation Resistance with PI A/F Dielectric",
  "Measurement of Capacitance and Tan Delta for Windings & Bushing A/F Dielectric",
  "Functional checks on Marshalling Box,IR test, RTCC,paper insertion test",
  "SFRA test",
  "Oil Leak Test (Start)",
  "Oil Leak test (End)",
  "Dimensions of Trf, radiator,RTCC,MB,Clearance LV,HV",
  "WTI, OTI , MOG,Operation of B RelayCalibration",
  "Paint Shade , adhesion and thickness verification",
  "Calculation of Regulation",
  "PRV Testing",
  "Test Reports",
];

export const COOLING_TYPES = [
  "ONAN",
  "ONAF",
  "ONAF / ONAF",
  "OFAF",
  "OFWF",
  "ODAF",
  "ODAN",
];

export const TEST_TYPES = ["Routine Test", "Type Test", "Special Test"] as const;
export const SHIFTS = ["Day Test", "Night Test"] as const;
export const STATUSES = ["Pending", "In Progress", "Completed", "Failed"] as const;

export type TestType = (typeof TEST_TYPES)[number];
export type Shift = (typeof SHIFTS)[number];
export type Status = (typeof STATUSES)[number];

export interface JobInfo {
  workOrderNumber: string;
  customerName: string;
  transformerRating: string;
  voltageLevel: string;
  coolingType: string;
  numberOfWindings: string;
}

export interface ScheduleEntry {
  id: string;
  dayLabel: string;
  testName: string;
  shift: Shift;
  unitName: string;
  testType: TestType;
  status: Status;
  createdAt: string;
}
