import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import axios from "axios";

const port = new SerialPort({
  path: "COM5",
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

parser.removeAllListeners("data");

parser.on("data", async (line) => {
  try {
    const cleanLine = line.trim().replace(/\0/g, "");

    if (!cleanLine || !cleanLine.includes(",")) return;

    console.log("Received:", cleanLine);

    const parts = cleanLine.split(",");

    if (parts.length !== 4) {
      console.log("Invalid format, skipping:", cleanLine);
      return;
    }

    let [binId, fillLevel, gasLevel, temperature] = parts;

    binId = binId.replace(/[^\w_]/g, "").trim();

    if (!binId || binId.length > 20) {
      console.log("Invalid binId, skipping:", binId);
      return;
    }

    fillLevel = Number(fillLevel);
    gasLevel = Number(gasLevel);
    temperature = Number(temperature);

    if (
      isNaN(fillLevel) ||
      isNaN(gasLevel) ||
      isNaN(temperature)
    ) {
      console.log("Invalid numeric data, skipping:", cleanLine);
      return;
    }

    const data = {
      binId,
      fillLevel,
      gasLevel,
      temperature,
    };

    console.log("Sending:", data);

    await axios.post("http://localhost:5000/api/bin-data", data);

    console.log("SUCCESS");

  } catch (err) {
    console.error("FULL ERROR:", err.message);
  }
});

port.on("error", (err) => {
  console.error("Serial Port Error:", err.message);
});