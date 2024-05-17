export default function Input(): JSX.Element {
  return (
    <input
      placeholder="Enter your prompt"
      className="relative w-3/6 h-12 p-5 bg-black placeholder-white outline-none rounded-full text-sm bg-opacity-20 text-white backdrop-blur-lg shadow-xl"
      type="text"
    />
  )
}
