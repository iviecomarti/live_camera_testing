document.addEventListener('DOMContentLoaded', function () {
    const cameraDropdown = document.getElementById('cameraDropdown');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const videoContainer = document.getElementById('videoContainer');
    let selectedCameraStream;

    // Use mediaDevices API to get available cameras
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.text = device.label || `Camera ${cameraDropdown.options.length + 1}`;
                    cameraDropdown.add(option);
                }
            });
        })
        .catch(err => console.error('Error accessing media devices:', err));

    // Set up event listener for the start recording button
    startBtn.addEventListener('click', startRecording);

    // Set up event listener for the stop recording button
    stopBtn.addEventListener('click', stopRecording);

    function startRecording() {
        const selectedCameraId = cameraDropdown.value;

        // Use getUserMedia to access the camera stream
        navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCameraId } })
            .then(stream => {
                selectedCameraStream = stream;

                // Create a video element and append it to the video container
                const video = document.createElement('video');
                video.srcObject = stream;
                video.autoplay = true;
                videoContainer.innerHTML = '';
                videoContainer.appendChild(video);

                // Enable the stop button and disable the start button
                stopBtn.disabled = false;
                startBtn.disabled = true;
            })
            .catch(err => console.error('Error accessing camera:', err));
    }

    function stopRecording() {
        // Stop the camera stream
        if (selectedCameraStream) {
            selectedCameraStream.getTracks().forEach(track => track.stop());
            selectedCameraStream = null;

            // Disable the stop button and enable the start button
            stopBtn.disabled = true;
            startBtn.disabled = false;
        }
    }

    // Stop the camera stream when the page is closed or refreshed
    window.addEventListener('beforeunload', function () {
        stopRecording();
    });
});
