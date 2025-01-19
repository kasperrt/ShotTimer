import { useModals } from '@/router';

export default function Rules() {
  const modals = useModals();

  const handleClose = () => modals.close();

  return (
    <div>
      <h1>Rules</h1>
      <div>Rules go here</div>
      <button type="button" onClick={handleClose}>
        Close
      </button>
    </div>
  );
}
