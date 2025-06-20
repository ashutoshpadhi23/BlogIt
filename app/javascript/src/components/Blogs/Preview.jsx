import React from "react";

import { Modal, Button } from "neetoui";

import PostDetails from "./PostDetails";

const Preview = ({
  history,
  setShowModal,
  showModal,
  updateTask,
  post,
  handleEdit,
}) => (
  <Modal
    className="flex h-screen max-h-full w-screen max-w-full flex-col"
    isOpen={showModal}
    size="fullScreen"
    onClose={() => setShowModal(false)}
  >
    <Modal.Header title="Preview Post" onClose={() => setShowModal(false)} />
    <Modal.Body className="flex-1 overflow-auto p-6">
      <PostDetails canEdit={() => false} post={post} updateTask={updateTask} />
    </Modal.Body>
    <Modal.Footer className="border-t p-4">
      <div className="flex w-full justify-end space-x-2">
        <Button
          label="Cancel"
          style="tertiary"
          onClick={() => setShowModal(false)}
        />
        <Button
          label="Save"
          onClick={async () => {
            await handleEdit();
            setShowModal(false);
            history.push("/");
          }}
        />
      </div>
    </Modal.Footer>
  </Modal>
);

export default Preview;
