export const Loading = ({ isLoading = false }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <div className="fixed bottom-0 right-0 z-50">
      <div className="spinner">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
