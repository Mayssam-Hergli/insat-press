export default function FloatingLetters() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="floating-letter left-[4%] top-[8%] text-[12rem] md:text-[18rem]">
        P
      </span>

      <span className="floating-letter right-[8%] top-[8%] text-[8rem] md:text-[12rem] delay-200">
        “
      </span>

      <span className="floating-letter bottom-[8%] left-[46%] text-[8rem] md:text-[11rem] delay-500">
        &
      </span>

      <span className="floating-word right-[10%] bottom-[14%] delay-700">
        press
      </span>

      <span className="floating-word left-[8%] bottom-[18%] delay-300">
        story
      </span>
    </div>
  );
}