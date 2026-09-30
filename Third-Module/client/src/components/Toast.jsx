export default function Toast({ message, isError }) {
  if (!message) return null;
  return (
    <div className={`toast show${isError ? ' error' : ''}`}>{message}</div>
  );
}
