import React from 'react'
import Modal from 'react-modal'

export const SimpleModal = props => {
  return (
    <Modal
      isOpen={props.open}
      aria={{ labelledby: 'heading', describedby: 'full_description' }}
      onRequestClose={props.toggle}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 3 },
        content: {
          top: '20%',
          left: '10%',
          right: '10%',
          bottom: '20%',
          backgroundColor: '#F2E1B2',
          border: '1px solid white'
        }
      }}
      ariaHideApp={false}
    >
      {props.children}
    </Modal>
  )
}
export const LargeModal = props => {
  return (
    <Modal
      isOpen={props.open}
      aria={{ labelledby: 'heading', describedby: 'full_description' }}
      onRequestClose={props.toggle}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 3 },
        content: {
          top: '7%',
          left: '7%',
          right: '7%',
          bottom: '7%',
          backgroundColor: '#b5e51d',
          border: '1px solid white'
        }
      }}
      ariaHideApp={false}
    >
      {props.children}
    </Modal>
  )
}

export default SimpleModal
