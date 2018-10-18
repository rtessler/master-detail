import React from 'react'
import './modal.scss'

export default class Modal extends React.Component {

    render() {

        const { overlayStyle, contentStyle, dialogStyle  } = this.props

        return (
            <div>
              <div className="modal-overlay-div" style={overlayStyle} />
              <div className="modal-content-div" style={contentStyle} onClick={this.onOverlayClick.bind(this)}>
                <div className="modal-dialog-div" style={dialogStyle} onClick={this.onDialogClick}>
                  {this.props.children}
                </div>
              </div>
            </div>
          );

    }

    listenKeyboard(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
          this.props.onClose();
        }
      }
      
      componentDidMount() {
        if (this.props.onClose) {
          window.addEventListener('keydown', this.listenKeyboard.bind(this), true);
        }
      }
      
      componentWillUnmount() {
        if (this.props.onClose) {
          window.removeEventListener('keydown', this.listenKeyboard.bind(this), true);
        }
      }
      
      onOverlayClick() {
        this.props.onClose();
      }
      
      onDialogClick(event) {
        event.stopPropagation();
      }    
}