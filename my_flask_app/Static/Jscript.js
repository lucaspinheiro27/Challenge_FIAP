document.getElementById('audio-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const audioPlayer = document.getElementById('audio-player');
    const url = URL.createObjectURL(file);
    audioPlayer.src = url;

    const fileName = file.name;

    fetch('/get_transcription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_name: fileName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.transcription) {
            document.getElementById('transcription').value = data.transcription;
        } else {
            document.getElementById('transcription').value = 'Transcription not found';
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('save-btn').addEventListener('click', function() {
    const transcription = document.getElementById('transcription').value;
    const blob = new Blob([transcription], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transcription.txt';
    link.click();
});
