import React, { Component } from 'react';
import pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

import PdfIndex from './pdfSideContent.Coponent';
import Viewer from './pdfViewer.component';
import SinglePageViewer from './pdfPageViewer.component';

import './pdfContainer.styles.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
var CmapUrl = '../node_modules/pdfjs-dist/cmaps/';

class PdfViewer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pdfDoc: null,
        }
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
            this.setState({
                pdfDoc: doc,
            });
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

    render() {
        return (
            <div>
                <div className="App-header">
                    <h2>Welcome to PDF.js
                        <input type="file" onChange={(e) => { this.LoadFile(e.target.files[0]) }} />
                    </h2>
                </div>

                <div className="MainContainer">
                    <div>
                        <PdfIndex doc={this.state.pdfDoc} />
                    </div>
                    <div>
                        {/*<Viewer doc={this.state.pdfDoc}></Viewer>*/}
                        <SinglePageViewer doc={this.state.pdfDoc}></SinglePageViewer>
                    </div>
                </div>
            </div>
        );
    }
}

export default PdfViewer;