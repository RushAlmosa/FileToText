document.getElementById('extractButton').addEventListener('click', function() {
    var fileInput = document.getElementById('zipFileInput');
    var file = fileInput.files[0];
    if (file) {
        extractZip(file);
    }
});

function extractZip(file) {
    JSZip.loadAsync(file).then(function(zip) {
        var output = document.getElementById('output');
        output.textContent = '';

        zip.forEach(function(relativePath, zipEntry) {
            zipEntry.async("string").then(function(content) {
                output.textContent += `Path: ${relativePath}\nContent:\n${content}\n\n`;
            });
        });
    });
}
