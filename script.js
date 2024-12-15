const API_KEY = "ibuRaXLejlFEkr2BqvVa";
const MODEL_ENDPOINT = "https://detect.roboflow.com/doctor-plant/1";
let capturedImage = "";

// Start Camera function
async function startCamera() {
    const videoElement = document.getElementById("videoElement");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        videoElement.style.display = "block";
        videoElement.play();

        // Hide "Start Camera" button and show "Capture and Detect Disease" button
        document.getElementById("startCameraBtn").style.display = "none";
        document.getElementById("captureAndDetectBtn").style.display = "inline-block";
    } catch (error) {
        console.error("Error accessing camera: ", error);
        alert("Error accessing camera. Please check permissions.");
    }
}


// Capture image from camera and detect disease
async function captureAndDetect() {
    const videoElement = document.getElementById("videoElement");
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    const loading = document.getElementById('loading');

    // Set canvas dimensions to match video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image URL
    capturedImage = canvas.toDataURL("image/png");

    // Call the disease detection function
    await detectDiseaseFromImage(capturedImage);

    // Hide the video once the capture is done
    videoElement.style.display = "none";

    // Show plant details input form
    document.getElementById('plantDetails').style.display = "block";
}

//_____________

async function detectDisease() {
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    const loading = document.getElementById('loading');

    resultDiv.innerHTML = "";
    loading.style.display = "block";

    try {
        let response;
        if (fileInput.files.length > 0) {
            const image = await loadImageBase64(fileInput.files[0]);
            response = await axios({
                method: "POST",
                url: MODEL_ENDPOINT,
                params: { api_key: API_KEY },
                data: image,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });
            imagePreview.src = URL.createObjectURL(fileInput.files[0]);
        } else if (urlInput.value) {
            response = await axios({
                method: "POST",
                url: MODEL_ENDPOINT,
                params: {
                    api_key: API_KEY,
                    image: urlInput.value
                }
            });
            imagePreview.src = urlInput.value;
        } else {
            throw new Error("Please upload an image or provide an image URL.");
        }

        const predictions = response.data.predictions;
        let resultHTML = "<h3>Detection Results:</h3>";
        predictions.forEach(pred => {
            resultHTML += `<p><strong>${pred.class}</strong> (Confidence: ${(pred.confidence * 100).toFixed(2)}%)</p>`;
        });
        resultDiv.innerHTML = resultHTML;
        imagePreview.style.display = "block";
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        imagePreview.style.display = "none";
    } finally {
        loading.style.display = "none";
    }
}

function loadImageBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

// Preview image on file selection
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('imagePreview').style.display = "block";
        }
        reader.readAsDataURL(file);
    }
});

// Save image with plant details
function saveImage() {
    const plantName = document.getElementById("plantName").value;
    const plantLocation = document.getElementById("plantLocation").value;

    if (!plantName || !plantLocation) {
        alert("Please enter both the plant name and location.");
        return;
    }

    // You can store the captured image and details in a database or send to a server here.
    console.log("User Inputs:");
    console.log("Sapling's Name: " + plantName);
    console.log("Location: " + plantLocation);
    console.log("Captured Image URL: " + capturedImage);

    // Hide the plant details form after saving
    document.getElementById('plantDetails').style.display = "none";
    alert("Image saved successfully!");
}



// Hover effect for buttons
document.querySelector('button').addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.05)';
});
document.querySelector('button').addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
});



//
//____________________--REPOOOOOORTTTTTTTSSSSSSSSSSSSSSSSSSS


