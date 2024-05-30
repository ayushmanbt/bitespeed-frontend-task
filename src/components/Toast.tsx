export const Toast = ({ message }: { message: string }) => {
  return (
    <div className="fixed font-bold text-xl rounded-md px-4 py-3 transform z-10 top-2 left-1/2 -translate-x-1/2 bg-red-200 slate-900">
      {message}
    </div>
  );
};
