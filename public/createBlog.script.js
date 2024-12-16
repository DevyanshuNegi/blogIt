console.log("THIS WOKRING FINE");

const quill = new Quill('#editor', {
    theme: 'snow'
});

// Function to update the hidden field with the Quill editor content before form submission
function updateContentField() {
    var contentField = document.getElementById('content');
    var htmlContent = quill.root.innerHTML;
    contentField.value = htmlContent;
}

// Attach event listener to the form's submit event
document.getElementById('blog-post-form').addEventListener('submit', function(event) {
    updateContentField();
});