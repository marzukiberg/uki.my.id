import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, subtitle, children, onSave, onCancel, saveButtonText = 'Save', cancelButtonText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>{title}</h3>
            {subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
        {(onSave || onCancel) && (
          <div className={styles.modalFooter}>
            {onCancel && (
              <button onClick={onCancel} className={styles.modalCancelButton}>
                {cancelButtonText}
              </button>
            )}
            {onSave && (
              <button onClick={onSave} className={styles.modalSaveButton}>
                {saveButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
