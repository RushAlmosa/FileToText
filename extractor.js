document.getElementById('zipFileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        extractZip(file);
    }
});

function extractZip(file) {
    JSZip.loadAsync(file).then(function(zip) {
        var output = document.getElementById('output');
        var totalFiles = 0;
        var totalCharacters = 0;
        output.textContent = ''; // Clear previous output

        zip.forEach(function(relativePath, zipEntry) {
            totalFiles++;
            zipEntry.async("string").then(function(content) {
                totalCharacters += content.length;
                output.textContent += `Path: ${relativePath}\nContent:\n${content}\n\n`;

                // Update statistics after processing each file
                document.getElementById('fileCount').textContent = `Total Files: ${totalFiles}`;
                document.getElementById('charCount').textContent = `Total Characters: ${totalCharacters}`;
            });
        });
    });
}

function downloadContent() {
    var element = document.createElement('a');
    var content = document.getElementById('output').textContent;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'extracted_content.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

document.getElementById('downloadButton').addEventListener('click', downloadContent);

function copyContent() {
    var content = document.getElementById('output').textContent;
    navigator.clipboard.writeText(content).then(function() {
        alert('Content copied to clipboard!');
    }, function(err) {
        alert('Error in copying text: ', err);
    });
}

document.getElementById('copyButton').addEventListener('click', copyContent);
