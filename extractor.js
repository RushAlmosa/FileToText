document.getElementById('zipFileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        showLoadingIndicator(true);
        extractZip(file);
    }
});

var isCancelled = false;

document.getElementById('cancelButton').addEventListener('click', function() {
    isCancelled = true;
    console.log('Extraction cancelled by user.');
    console.log('isCancelled:', isCancelled);
    showLoadingIndicator(false);
    document.getElementById('output').textContent += 'Extraction cancelled by user.\n';
    finalizeExtraction();
});
async function extractZip(file) {
    try {
        isCancelled = false;
        const zip = await JSZip.loadAsync(file);
        const output = document.getElementById('output');
        let totalFiles = 0;
        let totalCharacters = 0;
        let filesProcessed = 0;
        const totalFilesInZip = Object.keys(zip.files).length;
        output.textContent = '';
        showLoadingIndicator(true);

        for (const relativePath of Object.keys(zip.files)) {
            console.log('isCancelled:', isCancelled);
            if (isCancelled) {
                console.log('Extraction Cancelled');
                throw new Error('Extraction Cancelled');
            }

            const zipEntry = zip.files[relativePath];
            const content = await zipEntry.async("string");
            if (isCancelled) {
                console.log('Extraction Cancelled after async call');
                throw new Error('Extraction Cancelled');
            }

            totalFiles++;
            totalCharacters += content.length;
            const displayContent = content.trim().length === 0 ? 
                                   (zipEntry.dir ? "This is a folder." : "No content/maybe this is a file or empty.") : content;
            output.textContent += `Path: ${relativePath}\nContent:\n${displayContent}\n\n`;

            document.getElementById('fileCount').textContent = `Total Files: ${totalFiles}`;
            document.getElementById('charCount').textContent = `Total Characters: ${totalCharacters}`;
            output.scrollTop = output.scrollHeight;

            filesProcessed++;
            if (filesProcessed === totalFilesInZip) {
                finalizeExtraction();
            }
        }
    } catch (error) {
        if (error.message === 'Extraction Cancelled') {
            console.log('Extraction was cancelled by the user.');
        } else {
            console.error('Error during extraction:', error);
        }
    }
}


function finalizeExtraction() {
    document.getElementById('fileCount').classList.remove('highlight');
    document.getElementById('charCount').classList.remove('highlight');
    document.getElementById('zipFileInput').classList.remove('disabled');
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('disabled'));
    showLoadingIndicator(false);
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
