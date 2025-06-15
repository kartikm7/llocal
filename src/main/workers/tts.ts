import { KokoroTTS } from "kokoro-js";

const input = process.argv[2]

const speak = async (text) => {
  const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
  const tts = await KokoroTTS.from_pretrained(model_id, {
    dtype: "q4", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
    device: "cpu", // Options: "wasm", "webgpu" (web) or "cpu" (node). If using "webgpu", we recommend using dtype="fp32".
  });

  if (!tts) throw new Error('Model could not be loaded');
  const generatedAudio = await tts.generate(
    text,
    { voice: 'af_sky' }
  );
  let buffer = generatedAudio.toWav()
  return buffer
}

speak(input).then(result => {
  const arr = new Uint8Array(result)
  const buffer = Buffer.from(arr)
  if (process.send) process.send(buffer)
})
