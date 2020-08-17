import React, { Component, createRef } from 'react';

class PdfTableofContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pdfDoc: null,
            listOfCanvas: []
        }
        this.pdfInCanvas = [];
        this.divParent = createRef();
    }

    componentWillReceiveProps(props) {
        if (props === null || props === undefined) {
            console.log(`Pdfpages is not avaliable: ${this.state.pdfDoc}`);
        }
        else {
            this.extractPages(props);
        }
    }

    async extractPages(props) {
        const _pdf = props.doc;
        this.setState({ pdfDoc: _pdf, listOfCanvas: [] });
        console.log(`Pdfpages ${_pdf.numPages}`);
        this.pdfInCanvas = [];
        var pages = []; while (pages.length < _pdf.numPages)
            pages.push(pages.length + 1);
        await Promise.all(pages.map((num) => {
            // create a div for each page and build a small canvas for it
            var div = document.getElementById("sideIndex");
            //document.body.appendChild(div);
            return _pdf.getPage(num).then((echpage) => this.makeThumb(echpage))
                .then(function (canvas) {
                    div.appendChild(canvas);
                });
        }));

    }

    makeThumb(page) {
        // draw page to fit into 96x96 canvas
        var vp = page.getViewport({ scale: 1 });
        var canvas = document.createElement("canvas", { height: "96", width: "96" });
        // canvas.width = canvas.height = 96;
        var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
        return page.render({ canvasContext: canvas.getContext("2d"), viewport: page.getViewport({ scale: scale }) }).promise.then(function () {
            return canvas;
        });
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
            <div id="sideIndex" className="pdfviewer-tableofcontent">
                <div>count of canvas items:{this.pdfInCanvas.length}</div>
                {
                    this.state.listOfCanvas.map((cnvEle, idx) => {
                        console.log(`Canvs index: ${idx} ||| prop:${cnvEle}`)
                        return (
                            <div key={idx}>{cnvEle} </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default PdfTableofContent;