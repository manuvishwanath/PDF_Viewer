

import React, { Component, createRef } from 'react';
import { EventBus, PDFSinglePageViewer, } from 'pdfjs-dist/web/pdf_viewer';

//var PAGE_TO_VIEW = 3;

class PdfPageViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pdfDoc: null,
            listOfCanvas: []
        }
        this.wrapper = createRef();
        this.initEventBus();
    }

    componentWillReceiveProps(props) {
        var _pdfDoc = props.doc;
        this.setState({ pdfDoc: _pdfDoc });
        // _pdfDoc.getPage(PAGE_TO_VIEW).then((page) => {
        //     let viewerContainer = this.wrapper.current;
        //     this._pdfViewer = new PDFPageView({
        //         container: viewerContainer,
        //         eventBus: this._eventBus,
        //         id: PAGE_TO_VIEW,
        //         scale: 1,
        //         defaultViewport: page.getViewport({ scale: 1 }),
        //         textLayerFactory: new DefaultTextLayerFactory(),
        //         annotationLayerFactory: new DefaultAnnotationLayerFactory(),
        //     });
        //     this._pdfViewer.setPdfPage(page);
        //     return this._pdfViewer.draw();
        // })
    }

    initEventBus() {
        this._eventBus = new EventBus();
        this._eventBus.on('pagesinit', (e) => {
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
        this._eventBus.on('scalechange', (e) => {
            if (this.props.onScaleChanged) {
                this.props.onScaleChanged({ scale: e.scale });
            }
        });
    }

    componentDidMount() {
        let viewerContainer = this.wrapper.current;
        this._pdfViewer = new PDFSinglePageViewer({
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

    handelNext(e) {
        var crntPg = this._pdfViewer.currentPageNumber;
        if (crntPg < this.state.pdfDoc.numPages) {
            this._pdfViewer.currentPageNumber = crntPg + 1;
        }
    }

    handelPrevious(e) {
        var crntPg = this._pdfViewer.currentPageNumber;
        if (crntPg > 1) {
            this._pdfViewer.currentPageNumber = crntPg - 1;
        }
    }

    render() {
        return (
            <div ref={this.wrapper} className="Viewer">
                <div></div>
                <button onClick={(e) => { this.handelPrevious(e) }}>Previous Page</button>
                <button onClick={(e) => { this.handelNext(e) }}>Come on Next Page</button>

                <div className="pdfViewer"></div>
            </div>
        );
    }
}

export default PdfPageViewer;