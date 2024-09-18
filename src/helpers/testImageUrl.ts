export default async function testImageUrl(url) {
  return new Promise((resolve) => {
    // Create a new image object
    const img = new Image()

    // Handle the successful loading of the image
    img.onload = function () {
      resolve(true) // Resolve the promise with true on success
    }

    // Handle the error scenario if the image fails to load
    img.onerror = function () {
      resolve(false) // Resolve the promise with false on error
    }

    // Set the source of the image to trigger the loading
    img.src = url
  })
}
