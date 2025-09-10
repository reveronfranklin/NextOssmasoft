import { useState, useCallback } from 'react';

type UseCrudModalReturn = {
  modalOpen: boolean;
  editingItem: any;
  handleOpenModal: (item?: any) => void;
  handleCloseModal: () => void;
  setEditingItem: React.Dispatch<React.SetStateAction<any>>;
};

const useCrudModal = (): UseCrudModalReturn => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>({});

  const handleOpenModal = useCallback((item = null) => {

    // setEditingItem(item);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingItem(null);
    setModalOpen(false);
  }, []);

  return {
    modalOpen,
    editingItem,
    handleOpenModal,
    handleCloseModal,
    setEditingItem,
  };
};

export default useCrudModal;