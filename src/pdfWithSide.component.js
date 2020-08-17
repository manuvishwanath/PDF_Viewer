import React, { Component } from 'react';
import { PDFSinglePageViewer, EventBus } from 'pdfjs-dist/web/pdf_viewer';

import pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import 'pdfjs-dist/web/pdf_viewer.css';

import './pdfWithSide.style.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
var CmapUrl = '../node_modules/pdfjs-dist/cmaps/';

class PdfWithSides extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfDoc: null,
            thumbList: [],
        }
        this.pdfContainer = React.createRef();
        this.thumbsContainer = [];
        this.initEventBus();
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
        this._eventBus = eventBus;
    }

    async LoadFile(file) {
        let loadingTask;
        console.log("File type:" + typeof (file));
        console.log("File:" + file);
        var pdfBlob = await this.readFile(file);
        loadingTask = pdfjsLib.getDocument({
            url: pdfBlob,
            cMapUrl: CmapUrl,
            cMapPacked: true
        });
        loadingTask.promise.then((doc) => {
            console.log(`Document ${file.name} loaded ${doc.numPages} page(s)`);
            this.setState({ pdfDoc: doc }, () => this.getPageViewForThum());
            this._pdfViewer.setDocument(doc)
        }, (reason) => {
            console.error(`Error during ${file.name} loading: ${reason}`);
        });
    }

    readFile = (fileobj) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(fileobj);
        });
    };

    async getPageViewForThum() {
        this.state.thumbList = [];
        this.thumbView = [];
        for (let i = 1; i <= this.state.pdfDoc.numPages; i++) {
            let echPg = await this.state.pdfDoc.getPage(i);
            let cnvs = await this.makeThumb(echPg);
            //let withPg = React.createElement("div", {}, [React.createElement("div", {}, cnvs), React.createElement("p", {}, i)]);
            let child = document.createElement('div');
            child.appendChild(cnvs);
            child.className = "TestP"
            let withPg = document.createElement('div');
            withPg.appendChild(child);
            withPg.className = "TestChild"
            let pgnum = document.createElement('span').innerText = i;
            child.after(pgnum);
            this.thumbView.push(withPg);
        }
        console.log(this.thumbView.length)
        this.setState({ thumbList: this.thumbView });
        for (let idx = 0; idx < this.thumbView.length; idx++) {
            document.getElementById("ThumbViewer").appendChild(this.thumbView[idx]);
        }
    }
    async makeThumb(page) {
        var vp = page.getViewport({ scale: 1 });
        var canvas = document.createElement("canvas");
        canvas.height = vp.height / 3;
        canvas.width = vp.width / 3;
        var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
        return await page.render({ canvasContext: canvas.getContext("2d"), viewport: page.getViewport({ scale: scale }) }).promise.then(function () {
            return canvas;
        });
    }
    componentDidMount() {
        let viewerContainer = this.pdfContainer.current;
        this._pdfViewer = new PDFSinglePageViewer({
            container: viewerContainer,
            eventBus: this._eventBus,
        });
        this._pdfViewer.scrollMode = 2;
        this.setState({ thumbList: [] });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.pdfDoc !== nextState.pdfDoc ||
            this.state.scale !== nextState.scale) {
            document.getElementById("ThumbViewer").innerHTML = '';
            return true;
        }
        return false;
    }

    render() {
        return (
            <div className="PdfViewer">
                <h2>Welcome to PDF.js
                        <input type="file" onChange={(e) => { this.LoadFile(e.target.files[0]) }} />
                </h2>
                <div className="MainContainer">
                    <div id="ThumbViewer">

                    </div>
                    <div ref={this.pdfContainer} className="Viewer">
                        <div></div>
                    </div>
                </div>
            </div>

        );
    }
}

export default PdfWithSides;