document.getElementById('zipFileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        showLoadingIndicator(true);
        extractZip(file);
    }
});

function extractZip(file) {
    JSZip.loadAsync(file).then(function(zip) {
        var output = document.getElementById('output');
        var totalFiles = 0;
        var totalCharacters = 0;
        var filesProcessed = 0;
        var totalFilesInZip = Object.keys(zip.files).length;
        output.textContent = ''; // Clear previous output
        document.getElementById('fileCount').classList.add('highlight');
        document.getElementById('charCount').classList.add('highlight');
        document.getElementById('zipFileInput').classList.add('disabled');
        document.querySelectorAll('button').forEach(btn => btn.classList.add('disabled'));

        zip.forEach(function(relativePath, zipEntry) {
            totalFiles++;
            zipEntry.async("string").then(function(content) {
                totalCharacters += content.length;
                let displayContent = content.trim().length === 0 ? 
                                     (zipEntry.dir ? "This is a folder." : "No content/maybe this is a file or empty.") : content;
                output.textContent += `Path: ${relativePath}\nContent:\n${displayContent}\n\n`;
                filesProcessed++;

                document.getElementById('fileCount').textContent = `Total Files: ${totalFiles}`;
                document.getElementById('charCount').textContent = `Total Characters: ${totalCharacters}`;

                // Hide loading indicator when all files are processed
                if (filesProcessed === totalFilesInZip) {
                    document.getElementById('fileCount').classList.remove('highlight');
                    document.getElementById('charCount').classList.remove('highlight');
                    document.getElementById('zipFileInput').classList.remove('disabled');
                    document.querySelectorAll('button').forEach(btn => btn.classList.remove('disabled'));
            
                    showLoadingIndicator(false);
                }
            });
        });
    });
}

function showLoadingIndicator(show) {
    var indicator = document.getElementById('loadingIndicator');
    indicator.style.display = show ? 'block' : 'none';
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
