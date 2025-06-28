import { KokoroTTS, env } from "kokoro-js"

// getitng cli agruments passed
const input = process.argv[2]
const cacheDir = process.argv[3]


console.log("cacheDirectory", cacheDir)

// setting the cacheDir
env.cacheDir = cacheDir

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
  // the coolest part of this is the serializing logic, it just was not working, using nodes inbuilt serializer kept adding a few abritrary bytes,
  // probably for a handshake of sorts while deserializing, but when it struck that maybe just maybe converting the ArrayBuffer to a node Buffer might
  // just fix things, it did and gosh am I glad.
  const arr = new Uint8Array(result)
  const buffer = Buffer.from(arr)
  if (process.send) process.send(buffer)
})
