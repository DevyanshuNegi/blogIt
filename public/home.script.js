
blogs = document.getElementsByClassName("blog-container")


for (let index = 0; index < blogs.length; index++) {
    const element = blogs[index];
    element.addEventListener('click', function () {
        // alert('You clicked the div!');
        console.log(this.id)
        window.location.href = "/blog?id="+this.id
    });
}