type BoxProps = {
    message:string;
    type:"success" | "error"
}   
export const Box = ({message,type}:BoxProps) => {
  return (
    <div
      className={`p-3 
    ${
      type == "success"
        ? "bg-green-50 border-green-200"
        : "bg-red-50 border-red-200"
    } rounded-lg border
    `}
    >
      <p
        className={`text-sm ${
          type == "success" ? "text-green-600" : "text-red-600"
        }`}
      >
        {message}
      </p>
    </div>
  );
};
