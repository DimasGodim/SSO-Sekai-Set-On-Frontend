import { useState, useCallback } from 'react';
import type { ModalType } from '../lib/constants';

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}

// Modal manager for multiple modals
export function useModalManager() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  
  const openModal = useCallback((modalType: ModalType) => {
    setActiveModal(modalType);
  }, []);
  
  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);
  
  const isModalOpen = useCallback((modalType: ModalType) => {
    return activeModal === modalType;
  }, [activeModal]);
  
  return {
    activeModal,
    openModal,
    closeModal,
    isModalOpen,
  };
}
