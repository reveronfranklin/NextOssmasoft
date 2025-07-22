import { useState, useCallback } from 'react';

const useCrudModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpenModal = useCallback((item = null) => {
    setEditingItem(item);
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