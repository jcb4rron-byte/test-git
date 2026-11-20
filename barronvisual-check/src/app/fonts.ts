import localFont from "next/font/local";
import { Inter, Instrument_Serif } from "next/font/google";

// Display de marca (la misma de barronvisual.com).
export const arkhip = localFont({
  src: "./fonts/Arkhip-Regular.otf",
  variable: "--font-arkhip",
  display: "swap",
});

// Cursiva editorial solo para el remate de los titulares.
export const instrument = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

// Texto de interfaz: legible en tablas, formularios y panel.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
