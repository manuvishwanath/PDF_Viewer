import React, { Component } from 'react';
import { EventBus, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';

import './pdfViewer.style.css'

class Viewer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pdfDoc: this.props.doc
        }
        this.wrapper = React.createRef();
        this.initEventBus();
    }

    componentWillReceiveProps(props) {
        var _pdfDoc = props.doc;
        this.setState({ pdfDoc: _pdfDoc });
    }

    initEventBus() {
        let eventBus = new EventBus();
        eventBus.on('pagesinit', (e) => {
            this.setState({
                scale: this._pdfViewer.currentScale
            });
            if (this.props.onInit) {
                this.props.onInit({});
            }
            if (this.props.onScaleChanged) {
                this.props.onScaleChanged({ scale: this.state.scale });
            }
        });
        eventBus.on('scalechange', (e) => {
            if (this.props.onScaleChanged) {
                this.props.onScaleChanged({ scale: e.scale });
            }
        });
        eventBus.on('nextpage', (e) => {
            if (this.props.onNextPage) {

            }
        })
        this._eventBus = eventBus;
    }

    componentDidMount() {
        let viewerContainer = this.wrapper.current;
        this._pdfViewer = new PDFViewer({
            container: viewerContainer,
            eventBus: this._eventBus,
        });
        console.log(this.state.pdfDoc);
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.state.pdfDoc !== nextState.pdfDoc) {
            this._pdfViewer.setDocument(nextState.pdfDoc);
        }
        if (this.state.scale !== nextState.scale) {
            this._pdfViewer.currentScale = nextState.scale;
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.pdfDoc !== nextState.pdfDoc ||
            this.state.scale !== nextState.scale) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <div ref={this.wrapper} className="Viewer">
                <div ></div>
            </div>
        );
    }
}

export default Viewer;