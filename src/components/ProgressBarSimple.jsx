import prettyMS from "pretty-ms";

const ProgressBarSimple = ({
  progress = 0,
  remaining = 0,
}) => {
  return (
    <>
      {!!remaining && (
        <div className="mb-1.5 text-sm text-gray-700">
          Remaining time: {prettyMS(remaining)}
        </div>
      )}
      <div className="py-1.5 h-5 relative ">
        <div className="absolute top-0 bottom-0 left-0 w-full h-full rounded-full  bg-gray-400"></div>
        <div
          style={{
            width: `${progress}%`,
          }}
          className="absolute top-0 bottom-0 left-0 h-full rounded-full  transition-all duration-150 bg-sky-600"
        ></div>
        <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center w-full h-full">
          <span className="text-xs font-bold text-white">{progress}%</span>
        </div>
      </div>
    </>
  );
};

export default ProgressBarSimple;