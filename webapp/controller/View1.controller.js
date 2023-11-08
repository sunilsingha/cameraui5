sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("camerapp.controller.View1", {
            onInit: function () {
                var oComboBox = this.getView().byId("cameraSource");
                oComboBox.setModel(new sap.ui.model.json.JSONModel({
                    cameraSources: [
                        { key: "user", text: "Front Camera" },
                        { key: "environment", text: "Back Camera" }
                    ]
                }), "cameraSources");
                // Set the selected item (e.g., "Front Camera" by default)
                oComboBox.setSelectedKey("user");
            },

            onStartCamera: function () {
                // Access the HTML container
                var oView = this.getView();
                var oCameraPreview = oView.byId("cameraPreview");

                // Access the video element
                //var oVideo = oCameraPreview.getDomRef().querySelector("#video1"); 
                var oVideo = document.getElementById("video1");

                // Get the selected camera source
                var oComboBox = oView.byId("cameraSource");
                var selectedSource = oComboBox.getSelectedKey();
                console.log("Sselected key", selectedSource);

                // Check if the browser supports getUserMedia
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    // Access the camera
                    navigator.mediaDevices
                        .getUserMedia({ video: { facingMode: selectedSource } })
                        .then(function (stream) {
                            oVideo.srcObject = stream;
                        })
                        .catch(function (error) {
                            console.error("Error accessing camera:", error);
                        });
                } else {
                    console.error("getUserMedia is not supported in this browser.");
                }
            },

            onCaptureImage: function () {
                var oView = this.getView();
                var oVideo = document.getElementById("video1");
                var oCapturedImage = oView.byId("capturedImage");

                if (oVideo && oCapturedImage) {
                    oVideo.pause(); // Pause the video stream
                    
                    // oCapturedImage.style.display = "block"; // Display the captured image
                    //oVideo.addStyleClass("hide");
                    oCapturedImage.addStyleClass("show");
                    oCapturedImage.src = this.captureImageFromVideo(oVideo);
                    document.getElementById('image1').src = oCapturedImage.src;
                }
            },

            // Function to capture an image from the video stream
            captureImageFromVideo: function (videoElement) {
                var canvas = document.createElement("canvas");
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                canvas.getContext("2d").drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                return canvas.toDataURL("image/png");
            },

            // Function to save an image as PNG with specified dimensions
            saveCapturedImageAsPNG: function (imageElement, width, height) {
                var canvas = document.createElement("canvas");
                canvas.width = imageElement.width;
                canvas.height = imageElement.height;
                var context = canvas.getContext("2d");
                context.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
                var dataURL = canvas.toDataURL("image/png");

                // Save or process the image as needed (e.g., display, download, etc.)
                // You can implement your own logic here for saving or processing the image.

                // Create a download link
                var a = document.createElement("a");
                a.href = dataURL;
                a.download = "captured_image.png"; // Set the desired file name

                // Simulate a click on the download link
                a.click();

            },

            onSaveImage: function () {
                var oView = this.getView();
                var oCapturedImage = oView.byId("capturedImage");

                if (oCapturedImage) {
                    // Get the image element within the 'capturedImage' HTML control
                    var imageElement = document.getElementById('image1');

                    // Call 'saveCapturedImageAsPNG' to save the image as a PNG
                    this.saveCapturedImageAsPNG(imageElement, 1920, 1080);
                }
            },

  
            onCancel: function () {
                var oView = this.getView();
                var oVideo = oView.byId("video1");
                var oImage = oView.byId("capturedImage");

                if (oVideo && oImage) {
                    oVideo.play(); // Restart the video stream

                    // Add 'hide' class to image and remove it from video to hide the image and show the video
                    oImage.addStyleClass("hide");
                   
                }
                oImage.addStyleClass("hide");
                this.onStartCamera();
            },

            onStopCamera: function () {
                // Access the video element and stop the camera stream
                var oView = this.getView();
                var oCameraPreview = oView.byId("cameraPreview");
                //var oVideo = oCameraPreview.getDomRef().querySelector("#video");
                var oVideo = document.getElementById("video1");

                if (oVideo.srcObject) {
                    oVideo.srcObject.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
            }

        });
    });
